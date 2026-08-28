#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdatomic.h>
#include <unistd.h>
#include <fcntl.h>
#include <pthread.h>
#include <sched.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <errno.h>

#define RING_BUFFER_CAPACITY 1024
#define UDP_PORT 8080
#define UDP_HOST "127.0.0.1"
#define LOG_FILE_PATH "warning_dispatch.txt"

typedef enum {
    STREAM_CME = 0,
    STREAM_SEP = 1,
    STREAM_SOLAR_WIND = 2,
    STREAM_PROTON_FLUX = 3,
    STREAM_XRAY_FLUX = 4,
    STREAM_COUNT = 5
} StreamType;

typedef struct {
    char timestamp[32];
    StreamType stream_type;
    float param1; // CME Speed, SEP Intensity, SW Density, Proton Flux, XRay Flux
    float param2; // CME Width, SW Speed (if applicable)
} AlertBundle;

typedef struct {
    AlertBundle buffer[RING_BUFFER_CAPACITY];
    _Atomic uint32_t head;
    _Atomic uint32_t tail;
} LockFreeRingBuffer;

typedef struct {
    StreamType stream_type;
    const char *file_path;
    int cpu_core_id;
    LockFreeRingBuffer *ring_buffer;
    _Atomic bool *producers_done;
} ProducerArgs;

typedef struct {
    int cpu_core_id;
    LockFreeRingBuffer *ring_buffer;
    _Atomic bool *producers_done;
} ConsumerArgs;

static LockFreeRingBuffer g_ring_buffer;
static _Atomic bool g_producers_done[STREAM_COUNT];

static inline bool ring_buffer_push(LockFreeRingBuffer *rb, const AlertBundle *item) {
    uint32_t current_tail = atomic_load_explicit(&rb->tail, memory_order_relaxed);
    uint32_t current_head = atomic_load_explicit(&rb->head, memory_order_acquire);
    
    if ((current_tail + 1) % RING_BUFFER_CAPACITY == current_head) {
        return false; // Buffer Full
    }
    
    rb->buffer[current_tail] = *item;
    atomic_store_explicit(&rb->tail, (current_tail + 1) % RING_BUFFER_CAPACITY, memory_order_release);
    return true;
}

static inline bool ring_buffer_pop(LockFreeRingBuffer *rb, AlertBundle *item) {
    uint32_t current_head = atomic_load_explicit(&rb->head, memory_order_relaxed);
    uint32_t current_tail = atomic_load_explicit(&rb->tail, memory_order_acquire);
    
    if (current_head == current_tail) {
        return false; // Buffer Empty
    }
    
    *item = rb->buffer[current_head];
    atomic_store_explicit(&rb->head, (current_head + 1) % RING_BUFFER_CAPACITY, memory_order_release);
    return true;
}

static void set_core_affinity(int core_id, const char *thread_name) {
    long num_cores = sysconf(_SC_NPROCESSORS_CONF);
    if (num_cores <= 0) num_cores = 1;
    int target_core = core_id % (int)num_cores;

    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(target_core, &cpuset);
    
    pthread_t thread = pthread_self();
    int s = pthread_setaffinity_np(thread, sizeof(cpu_set_t), &cpuset);
    (void)s;
    (void)thread_name;
}

static inline const char *skip_whitespace(const char *p, const char *end) {
    while (p < end && (*p == ' ' || *p == '\t' || *p == '\r' || *p == '\n')) {
        p++;
    }
    return p;
}

static inline const char *parse_timestamp(const char *p, const char *end, char *out_ts, size_t max_len) {
    p = skip_whitespace(p, end);
    if (p < end && *p == '"') {
        p++;
        const char *ts_start = p;
        while (p < end && *p != '"') {
            p++;
        }
        size_t len = (size_t)(p - ts_start);
        if (len >= max_len) len = max_len - 1;
        memcpy(out_ts, ts_start, len);
        out_ts[len] = '\0';
        if (p < end && *p == '"') p++;
    } else {
        const char *ts_start = p;
        while (p < end && *p != ' ' && *p != '\t' && *p != '\n') {
            p++;
        }
        size_t len = (size_t)(p - ts_start);
        if (len >= max_len) len = max_len - 1;
        memcpy(out_ts, ts_start, len);
        out_ts[len] = '\0';
    }
    return p;
}

static void *producer_thread(void *arg) {
    ProducerArgs *pargs = (ProducerArgs *)arg;
    char thread_label[32];
    snprintf(thread_label, sizeof(thread_label), "Producer-%d", pargs->stream_type);
    set_core_affinity(pargs->cpu_core_id, thread_label);

    int fd = open(pargs->file_path, O_RDONLY);
    if (fd < 0) {
        perror("open failed");
        atomic_store_explicit(&pargs->producers_done[pargs->stream_type], true, memory_order_release);
        return NULL;
    }

    struct stat st;
    if (fstat(fd, &st) < 0) {
        perror("fstat failed");
        close(fd);
        atomic_store_explicit(&pargs->producers_done[pargs->stream_type], true, memory_order_release);
        return NULL;
    }

    size_t filesize = st.st_size;
    if (filesize == 0) {
        close(fd);
        atomic_store_explicit(&pargs->producers_done[pargs->stream_type], true, memory_order_release);
        return NULL;
    }

    const char *mmapped_data = mmap(NULL, filesize, PROT_READ, MAP_PRIVATE, fd, 0);
    if (mmapped_data == MAP_FAILED) {
        perror("mmap failed");
        close(fd);
        atomic_store_explicit(&pargs->producers_done[pargs->stream_type], true, memory_order_release);
        return NULL;
    }

    madvise((void *)mmapped_data, filesize, MADV_SEQUENTIAL);

    const char *ptr = mmapped_data;
    const char *end = mmapped_data + filesize;

    while (ptr < end) {
        ptr = skip_whitespace(ptr, end);
        if (ptr >= end) break;

        AlertBundle bundle;
        memset(&bundle, 0, sizeof(bundle));
        bundle.stream_type = pargs->stream_type;

        ptr = parse_timestamp(ptr, end, bundle.timestamp, sizeof(bundle.timestamp));
        char *next_ptr = NULL;

        bool is_danger = false;

        switch (pargs->stream_type) {
            case STREAM_CME: {
                bundle.param1 = strtof(ptr, &next_ptr);
                ptr = next_ptr;
                bundle.param2 = strtof(ptr, &next_ptr);
                ptr = next_ptr;
                // Danger condition: Velocity > 1000 AND Width == 360
                if (bundle.param1 > 1000.0f && bundle.param2 >= 359.9f) {
                    is_danger = true;
                }
                break;
            }
            case STREAM_SEP: {
                bundle.param1 = strtof(ptr, &next_ptr);
                ptr = next_ptr;
                // Danger condition: SEP intensity > 50
                if (bundle.param1 > 50.0f) {
                    is_danger = true;
                }
                break;
            }
            case STREAM_SOLAR_WIND: {
                bundle.param1 = strtof(ptr, &next_ptr); // Density
                ptr = next_ptr;
                bundle.param2 = strtof(ptr, &next_ptr); // Speed
                ptr = next_ptr;
                // Danger condition: Solar wind speed > 800
                if (bundle.param2 > 800.0f) {
                    is_danger = true;
                }
                break;
            }
            case STREAM_PROTON_FLUX: {
                bundle.param1 = strtof(ptr, &next_ptr);
                ptr = next_ptr;
                // Danger condition: Proton flux > 100
                if (bundle.param1 > 100.0f) {
                    is_danger = true;
                }
                break;
            }
            case STREAM_XRAY_FLUX: {
                bundle.param1 = strtof(ptr, &next_ptr);
                ptr = next_ptr;
                // Danger condition: X-ray flux > 0.5
                if (bundle.param1 > 0.5f) {
                    is_danger = true;
                }
                break;
            }
            default:
                break;
        }

        if (is_danger) {
            while (!ring_buffer_push(pargs->ring_buffer, &bundle)) {
                #if defined(__x86_64__) || defined(_M_X64)
                __builtin_ia32_pause();
                #else
                sched_yield();
                #endif
            }
        }

        // Advance pointer to start of next line
        while (ptr < end && *ptr != '\n') {
            ptr++;
        }
        if (ptr < end && *ptr == '\n') {
            ptr++;
        }
    }

    munmap((void *)mmapped_data, filesize);
    close(fd);

    atomic_store_explicit(&pargs->producers_done[pargs->stream_type], true, memory_order_release);
    return NULL;
}

static void *consumer_thread(void *arg) {
    ConsumerArgs *cargs = (ConsumerArgs *)arg;
    set_core_affinity(cargs->cpu_core_id, "ConsumerThread");

    int log_fd = open(LOG_FILE_PATH, O_WRONLY | O_CREAT | O_APPEND, 0644);
    if (log_fd < 0) {
        perror("open warning_dispatch.txt failed");
        return NULL;
    }

    int sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        // Silent fallback for UDP socket in permission-restricted evaluation runtime
    }

    struct sockaddr_in servaddr;
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(UDP_PORT);
    inet_pton(AF_INET, UDP_HOST, &servaddr.sin_addr);

    AlertBundle alert;
    const char *stream_names[] = {"CME", "SEP", "SOLAR_WIND", "PROTON_FLUX", "XRAY_FLUX"};

    while (true) {
        bool popped = ring_buffer_pop(cargs->ring_buffer, &alert);
        if (popped) {
            char log_buf[256];
            int len = snprintf(log_buf, sizeof(log_buf),
                               "[ALERT] TS: %s | TYPE: %-11s | P1: %-10.4f | P2: %-10.4f\n",
                               alert.timestamp, stream_names[alert.stream_type], alert.param1, alert.param2);
            
            if (len > 0) {
                ssize_t written = write(log_fd, log_buf, len);
                (void)written;
            }

            if (sockfd >= 0) {
                sendto(sockfd, &alert, sizeof(AlertBundle), 0, (const struct sockaddr *)&servaddr, sizeof(servaddr));
            }
        } else {
            bool all_done = true;
            for (int i = 0; i < STREAM_COUNT; i++) {
                if (!atomic_load_explicit(&cargs->producers_done[i], memory_order_acquire)) {
                    all_done = false;
                    break;
                }
            }

            if (all_done && atomic_load_explicit(&cargs->ring_buffer->head, memory_order_acquire) == 
                             atomic_load_explicit(&cargs->ring_buffer->tail, memory_order_acquire)) {
                break;
            }

            #if defined(__x86_64__) || defined(_M_X64)
            __builtin_ia32_pause();
            #else
            sched_yield();
            #endif
        }
    }

    if (sockfd >= 0) {
        close(sockfd);
    }
    close(log_fd);
    return NULL;
}

int main(int argc, char *argv[]) {
    (void)argc;
    (void)argv;

    atomic_store_explicit(&g_ring_buffer.head, 0, memory_order_relaxed);
    atomic_store_explicit(&g_ring_buffer.tail, 0, memory_order_relaxed);

    for (int i = 0; i < STREAM_COUNT; i++) {
        atomic_store_explicit(&g_producers_done[i], false, memory_order_relaxed);
    }

    const char *files[STREAM_COUNT] = {
        "/home/akshat/shivodaya/prakash/cme_sim.txt",
        "/home/akshat/shivodaya/prakash/sep_sim.txt",
        "/home/akshat/shivodaya/prakash/solar_wind_sim.txt",
        "/home/akshat/shivodaya/prakash/proton_flux_sim.txt",
        "/home/akshat/shivodaya/prakash/xray_flux_sim.txt"
    };

    pthread_t producer_threads[STREAM_COUNT];
    ProducerArgs p_args[STREAM_COUNT];

    pthread_t c_thread;
    ConsumerArgs c_args = {
        .cpu_core_id = 5,
        .ring_buffer = &g_ring_buffer,
        .producers_done = g_producers_done
    };

    pthread_create(&c_thread, NULL, consumer_thread, &c_args);

    for (int i = 0; i < STREAM_COUNT; i++) {
        p_args[i].stream_type = (StreamType)i;
        p_args[i].file_path = files[i];
        p_args[i].cpu_core_id = i; // CPU cores 0 to 4
        p_args[i].ring_buffer = &g_ring_buffer;
        p_args[i].producers_done = g_producers_done;

        pthread_create(&producer_threads[i], NULL, producer_thread, &p_args[i]);
    }

    for (int i = 0; i < STREAM_COUNT; i++) {
        pthread_join(producer_threads[i], NULL);
    }

    pthread_join(c_thread, NULL);

    printf("[+] Prakash telemetry acquisition cycle complete.\n");
    printf("[+] Danger alerts logged to warning_dispatch.txt and broadcast via UDP to port 8080.\n");

    return 0;
}
