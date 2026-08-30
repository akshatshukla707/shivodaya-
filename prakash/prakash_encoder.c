#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdatomic.h>
#include <stdalign.h>
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
#include <math.h>
#include <time.h>

// #include "zco.h"
// #include "bp.h"

#define RING_BUFFER_CAPACITY 4096
#define RING_BUFFER_MASK (RING_BUFFER_CAPACITY - 1)
#define CACHE_LINE_SIZE 64
#define MARKER_MAGIC "Bhaarat"

// Joint Source-Channel Coding (JSCC) Native C Embedding Struct
typedef struct {
    float embedding[32]; // 32-float semantic vector feature map
    char marker[8];      // Hardcoded 'Bhaarat' marker (null-terminated)
} SemanticPayload;

typedef struct {
    char timestamp[32];
    uint32_t stream_type; // 0: CME, 1: SEP, 2: SW, 3: Proton, 4: XRay
    float raw_val1;
    float raw_val2;
    float dphi_dt;
    SemanticPayload payload;
} EncodedAlertBundle;

typedef struct {
    alignas(CACHE_LINE_SIZE) _Atomic uint32_t head;
    alignas(CACHE_LINE_SIZE) _Atomic uint32_t tail;
    alignas(CACHE_LINE_SIZE) _Atomic uint64_t dropped_bundles;
    alignas(CACHE_LINE_SIZE) _Atomic uint64_t total_processed;
    alignas(CACHE_LINE_SIZE) EncodedAlertBundle buffer[RING_BUFFER_CAPACITY];
} LockFreeRingBuffer;

static LockFreeRingBuffer g_ring_buffer;
static _Atomic bool g_producers_done[5];

// Lightweight Linear Projection Weight Matrix (5 normalized inputs -> 32 embedding dimensions)
// Hardcoded projection weights representing JSCC neural compression layer
static const float PROJECTION_WEIGHTS[5][32] = {
    // CME Velocity & Width projection row
    {0.85f, 0.12f, -0.44f, 0.91f, 0.33f, -0.21f, 0.77f, 0.05f, 0.62f, -0.19f, 0.41f, 0.88f, -0.31f, 0.54f, 0.11f, -0.67f,
     0.29f, 0.83f, -0.15f, 0.47f, 0.66f, -0.38f, 0.92f, 0.14f, 0.51f, -0.27f, 0.73f, 0.09f, -0.45f, 0.61f, 0.35f, -0.81f},
    // SEP Intensity projection row
    {0.34f, 0.95f, 0.18f, -0.52f, 0.71f, 0.43f, -0.16f, 0.89f, -0.37f, 0.64f, 0.22f, -0.79f, 0.58f, 0.03f, 0.86f, 0.27f,
     -0.61f, 0.49f, 0.76f, -0.11f, 0.38f, 0.82f, -0.24f, 0.67f, 0.15f, 0.93f, -0.48f, 0.31f, 0.70f, -0.05f, 0.56f, 0.19f},
    // Solar Wind Speed & Density row
    {-0.22f, 0.41f, 0.87f, 0.19f, -0.63f, 0.78f, 0.31f, -0.44f, 0.85f, 0.12f, -0.56f, 0.39f, 0.74f, -0.28f, 0.65f, 0.08f,
     0.91f, -0.33f, 0.46f, 0.80f, -0.17f, 0.53f, 0.26f, -0.71f, 0.40f, 0.68f, 0.13f, -0.84f, 0.25f, 0.59f, -0.36f, 0.72f},
    // Proton Flux row
    {0.67f, -0.31f, 0.52f, 0.84f, 0.09f, -0.76f, 0.48f, 0.23f, -0.90f, 0.37f, 0.61f, -0.14f, 0.45f, 0.79f, -0.26f, 0.58f,
     0.17f, -0.69f, 0.35f, 0.81f, -0.42f, 0.28f, 0.64f, 0.06f, -0.88f, 0.43f, 0.57f, -0.21f, 0.39f, 0.75f, -0.18f, 0.50f},
    // X-Ray Flux row
    {0.19f, 0.74f, -0.29f, 0.63f, 0.88f, 0.07f, -0.55f, 0.42f, 0.71f, -0.36f, 0.80f, 0.25f, -0.68f, 0.49f, 0.16f, 0.93f,
     -0.21f, 0.58f, 0.34f, -0.77f, 0.62f, 0.11f, -0.49f, 0.86f, 0.30f, -0.64f, 0.53f, 0.79f, -0.13f, 0.47f, 0.28f, -0.70f}
};

static inline bool ring_buffer_push(LockFreeRingBuffer *rb, const EncodedAlertBundle *item) {
    uint32_t tail = atomic_load_explicit(&rb->tail, memory_order_relaxed);
    uint32_t head = atomic_load_explicit(&rb->head, memory_order_acquire);
    
    if (((tail + 1) & RING_BUFFER_MASK) == head) {
        atomic_fetch_add_explicit(&rb->dropped_bundles, 1, memory_order_relaxed);
        return false;
    }
    rb->buffer[tail & RING_BUFFER_MASK] = *item;
    atomic_store_explicit(&rb->tail, (tail + 1) & RING_BUFFER_MASK, memory_order_release);
    return true;
}

static inline bool ring_buffer_pop(LockFreeRingBuffer *rb, EncodedAlertBundle *item) {
    uint32_t head = atomic_load_explicit(&rb->head, memory_order_relaxed);
    uint32_t tail = atomic_load_explicit(&rb->tail, memory_order_acquire);
    
    if (head == tail) return false;
    *item = rb->buffer[head & RING_BUFFER_MASK];
    atomic_store_explicit(&rb->head, (head + 1) & RING_BUFFER_MASK, memory_order_release);
    return true;
}

// Native C Linear JSCC Semantic Encoder
static void encode_jscc_semantic_vector(float v1, float v2, float dphi, uint32_t stream_type, SemanticPayload *out_payload) {
    // Normalization factors per stream
    float norm[5];
    norm[0] = v1 / 3000.0f;       // CME velocity
    norm[1] = v1 / 5000.0f;       // SEP flux
    norm[2] = v1 / 2000.0f;       // Solar wind speed
    norm[3] = v1 / 1000.0f;       // Proton flux
    norm[4] = v1 / 10.0f;         // X-Ray flux

    // Matrix Multiplication: Input vector [norm0..norm4] x Weight Matrix [5x32]
    for (int col = 0; col < 32; col++) {
        float sum = 0.0f;
        for (int row = 0; row < 5; row++) {
            sum += norm[row] * PROJECTION_WEIGHTS[row][col];
        }
        // Non-linear activation (tanh) for semantic bound protection
        out_payload->embedding[col] = tanhf(sum + (dphi / 10000.0f));
    }

    // Embed hardcoded magic marker
    memset(out_payload->marker, 0, sizeof(out_payload->marker));
    strncpy(out_payload->marker, MARKER_MAGIC, 7);
}

// Fast ASCII float parser
static float fast_atof(const char *p) {
    float val = 0.0f;
    int sign = 1;
    while (*p == ' ' || *p == '\t') p++;
    if (*p == '-') { sign = -1; p++; }
    else if (*p == '+') { p++; }
    while (*p >= '0' && *p <= '9') {
        val = val * 10.0f + (*p - '0');
        p++;
    }
    if (*p == '.') {
        p++;
        float factor = 0.1f;
        while (*p >= '0' && *p <= '9') {
            val += (*p - '0') * factor;
            factor *= 0.1f;
            p++;
        }
    }
    return val * sign;
}

typedef struct {
    const char *filepath;
    uint32_t stream_type;
    int core_id;
} MMapWorkerArgs;

static void* mmap_ingest_worker(void *arg) {
    MMapWorkerArgs *margs = (MMapWorkerArgs*)arg;
    
    // Core pinning
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(margs->core_id, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);

    int fd = open(margs->filepath, O_RDONLY);
    if (fd < 0) {
        g_producers_done[margs->stream_type] = true;
        return NULL;
    }

    struct stat st;
    fstat(fd, &st);
    if (st.st_size == 0) {
        close(fd);
        g_producers_done[margs->stream_type] = true;
        return NULL;
    }

    char *mapped = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
    if (mapped == MAP_FAILED) {
        close(fd);
        g_producers_done[margs->stream_type] = true;
        return NULL;
    }

    madvise(mapped, st.st_size, MADV_SEQUENTIAL);

    const char *ptr = mapped;
    const char *end = mapped + st.st_size;
    float prev_val = 0.0f;

    while (ptr < end) {
        const char *line_end = memchr(ptr, '\n', end - ptr);
        if (!line_end) line_end = end;

        // Parse quoted timestamp "YYYY MM DD HH MM SS"
        char ts[32] = {0};
        const char *p = ptr;
        if (*p == '"') {
            p++;
            const char *qend = memchr(p, '"', line_end - p);
            if (qend) {
                size_t tslen = qend - p;
                if (tslen >= sizeof(ts)) tslen = sizeof(ts) - 1;
                memcpy(ts, p, tslen);
                ts[tslen] = '\0';
                p = qend + 1;
            }
        }

        // Skip space after timestamp quote
        while (p < line_end && (*p == ' ' || *p == '\t')) p++;

        float val1 = fast_atof(p);
        const char *p2 = p;
        while (p2 < line_end && *p2 != ' ' && *p2 != '\t') p2++;
        while (p2 < line_end && (*p2 == ' ' || *p2 == '\t')) p2++;
        float val2 = (p2 < line_end) ? fast_atof(p2) : 0.0f;

        float dphi = val1 - prev_val;
        prev_val = val1;

        bool danger = false;
        if (margs->stream_type == 0 && (val1 > 500.0f || dphi > 200.0f)) danger = true;
        else if (margs->stream_type == 1 && (val1 > 50.0f || dphi > 50.0f)) danger = true;
        else if (margs->stream_type == 2 && (val1 > 500.0f || dphi > 100.0f)) danger = true;
        else if (margs->stream_type == 3 && (val1 > 50.0f || dphi > 20.0f)) danger = true;
        else if (margs->stream_type == 4 && (val1 > 0.1f || dphi > 0.01f)) danger = true;

        if (danger) {
            EncodedAlertBundle item;
            memset(&item, 0, sizeof(item));
            strncpy(item.timestamp, ts, 31);
            item.stream_type = margs->stream_type;
            item.raw_val1 = val1;
            item.raw_val2 = val2;
            item.dphi_dt = dphi;

            encode_jscc_semantic_vector(val1, val2, dphi, margs->stream_type, &item.payload);

            while (!ring_buffer_push(&g_ring_buffer, &item)) {
                usleep(100);
            }
            atomic_fetch_add_explicit(&g_ring_buffer.total_processed, 1, memory_order_relaxed);
        }

        ptr = line_end + 1;
    }

    munmap(mapped, st.st_size);
    close(fd);
    g_producers_done[margs->stream_type] = true;
    return NULL;
}

int main(int argc, char **argv) {
    (void)argc; (void)argv;
    printf("\033[1;36m========================================================================\033[0m\n");
    printf("\033[1;36m   PROJECT SHIVODAYA :: PRAKASH MODULE (C11 SEMANTIC JSCC ENCODER)      \033[0m\n");
    printf("\033[1;36m   Endpoint Target: ipn:1.1  --> Destination: ipn:2.1                       \033[0m\n");
    printf("\033[1;36m========================================================================\033[0m\n\n");

    const char *files[5] = {
        "prakash/cme_sim.txt",
        "prakash/sep_sim.txt",
        "prakash/solar_wind_sim.txt",
        "prakash/proton_flux_sim.txt",
        "prakash/xray_flux_sim.txt"
    };

    const char *alt_files[5] = {
        "../prakash/cme_sim.txt",
        "../prakash/sep_sim.txt",
        "../prakash/solar_wind_sim.txt",
        "../prakash/proton_flux_sim.txt",
        "../prakash/xray_flux_sim.txt"
    };

    // Synthesize realistic deep-space telemetry streams if missing or empty
    for (int i = 0; i < 5; i++) {
        const char *target = files[i];
        struct stat st;
        if (stat(target, &st) != 0) {
            target = alt_files[i];
        }
        if (stat(target, &st) != 0 || st.st_size == 0) {
            FILE *f = fopen(alt_files[i], "w");
            if (f) {
                for (int r = 0; r < 200; r++) {
                    float v1 = 300.0f;
                    float v2 = 90.0f;
                    if (r % 5 == 2 || r % 5 == 4) {
                        if (i == 0) { v1 = 1800.0f; v2 = 360.0f; }
                        else if (i == 1) { v1 = 2500.0f; v2 = 360.0f; }
                        else if (i == 2) { v1 = 1200.0f; v2 = 360.0f; }
                        else if (i == 3) { v1 = 800.0f; v2 = 360.0f; }
                        else if (i == 4) { v1 = 5.5f; v2 = 360.0f; }
                    }
                    fprintf(f, "\"2026 08 28 00 %02d 00\" %.2f %.2f\n", r % 60, v1, v2);
                }
                fclose(f);
            }
        }
    }

    pthread_t threads[5];
    MMapWorkerArgs args[5];

    for (int i = 0; i < 5; i++) {
        g_producers_done[i] = false;
        struct stat st;
        args[i].filepath = (stat(files[i], &st) == 0) ? files[i] : alt_files[i];
        args[i].stream_type = i;
        args[i].core_id = i % 4;
        pthread_create(&threads[i], NULL, mmap_ingest_worker, &args[i]);
    }

    // Transmit binary payload struct over FIFO IPC pipe simulating ION DTN bundle egress
    const char *fifo_path = "/tmp/shivodaya_richa_ingress.fifo";
    mkfifo(fifo_path, 0666);
    int fifo_fd = open(fifo_path, O_RDWR | O_NONBLOCK);

    printf("\033[1;32m[+] Prakash Ingestion Threads Active across 5 Telemetry Streams\033[0m\n");
    printf("\033[1;33m[+] Native C JSCC 32-Float Linear Projection Matrix Initialized\033[0m\n");
    printf("\033[1;35m[+] Marker Verification String: '%s'\033[0m\n\n", MARKER_MAGIC);

    uint64_t dispatched = 0;
    while (1) {
        EncodedAlertBundle item;
        if (ring_buffer_pop(&g_ring_buffer, &item)) {
            dispatched++;
            if (fifo_fd >= 0) {
                write(fifo_fd, &item, sizeof(item));
            }
            
            if (dispatched % 10 == 0 || dispatched == 1) {
                printf("[PRAKASH EGRESS #%lu] EID ipn:1.1 -> ipn:2.1 | Stream: %u | Val1: %.2f | Marker: '%s'\n",
                       dispatched, item.stream_type, item.raw_val1, item.payload.marker);
                printf("  Semantic Vector[0..3]: [%.4f, %.4f, %.4f, %.4f]\n",
                       item.payload.embedding[0], item.payload.embedding[1],
                       item.payload.embedding[2], item.payload.embedding[3]);
            }
            usleep(1000);
        } else {
            bool all_done = true;
            for (int i = 0; i < 5; i++) {
                if (!g_producers_done[i]) { all_done = false; break; }
            }
            if (all_done) break;
            usleep(5000);
        }
    }

    for (int i = 0; i < 5; i++) {
        pthread_join(threads[i], NULL);
    }
    printf("\n\033[1;32m========================================================================\033[0m\n");
    printf("\033[1;32m[+] Prakash Encoder Completed: %lu Danger Bundles JSCC Encoded & Dispatched\033[0m\n", dispatched);
    printf("\033[1;32m========================================================================\033[0m\n");

    return 0;
}
