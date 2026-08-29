#include <iostream>
#include <vector>
#include <string>
#include <array>
#include <cmath>
#include <cstring>
#include <iomanip>
#include <fstream>
#include <sstream>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <fcntl.h>

constexpr char BHAARAT_MARKER[] = "Bhaarat";
constexpr char MISSION_LOG_PATH[] = "akashdeep_mission_control.log";

struct SemanticPayload {
    float embedding[32];
    char marker[8];
};

struct EncodedAlertBundle {
    char timestamp[32];
    uint32_t stream_type;
    float raw_val1;
    float raw_val2;
    float dphi_dt;
    SemanticPayload payload;
};

// Static Inverse-Weight Projection Matrix (32 embedding dimensions -> 5 decoded physical telemetry features)
static const float INVERSE_PROJECTION_WEIGHTS[32][5] = {
    {0.15f, 0.08f, -0.05f, 0.12f, 0.04f}, {-0.04f, 0.18f, 0.09f, -0.06f, 0.14f},
    {0.11f, 0.03f, 0.16f, 0.10f, -0.06f}, {0.17f, -0.10f, 0.04f, 0.15f, 0.12f},
    {0.06f, 0.13f, -0.12f, 0.02f, 0.17f}, {-0.04f, 0.08f, 0.15f, -0.14f, 0.01f},
    {0.14f, -0.03f, 0.06f, 0.09f, -0.10f}, {0.01f, 0.16f, -0.08f, 0.04f, 0.08f},
    {0.12f, -0.07f, 0.16f, -0.16f, 0.13f}, {-0.04f, 0.12f, 0.02f, 0.07f, -0.07f},
    {0.08f, 0.04f, -0.10f, 0.11f, 0.15f}, {0.16f, -0.14f, 0.07f, -0.03f, 0.05f},
    {-0.06f, 0.11f, 0.14f, 0.08f, -0.13f}, {0.10f, 0.01f, -0.05f, 0.14f, 0.09f},
    {0.02f, 0.16f, 0.12f, -0.05f, 0.03f}, {-0.12f, 0.05f, 0.01f, 0.10f, 0.17f},
    {0.05f, -0.11f, 0.17f, 0.03f, -0.04f}, {0.15f, 0.09f, -0.06f, -0.12f, 0.11f},
    {-0.03f, 0.14f, 0.08f, 0.06f, 0.06f}, {0.09f, -0.02f, 0.15f, 0.15f, -0.14f},
    {0.12f, 0.07f, -0.03f, -0.08f, 0.12f}, {-0.07f, 0.15f, 0.10f, 0.05f, 0.02f},
    {0.17f, -0.04f, 0.05f, 0.12f, -0.09f}, {0.03f, 0.12f, -0.13f, 0.01f, 0.16f},
    {0.09f, 0.03f, 0.07f, -0.16f, 0.06f}, {-0.05f, 0.17f, 0.13f, 0.08f, -0.12f},
    {0.13f, -0.09f, 0.02f, 0.10f, 0.10f}, {0.02f, 0.06f, -0.16f, -0.04f, 0.15f},
    {-0.08f, 0.13f, 0.05f, 0.07f, -0.02f}, {0.11f, -0.01f, 0.11f, 0.14f, 0.09f},
    {0.06f, 0.10f, -0.07f, -0.03f, 0.05f}, {-0.15f, 0.04f, 0.13f, 0.09f, -0.13f}
};

const char* get_stream_name(uint32_t stream_type) {
    switch (stream_type) {
        case 0: return "CME (Coronal Mass Ejection)";
        case 1: return "SEP (Solar Energetic Particle)";
        case 2: return "Solar Wind Dynamics";
        case 3: return "Proton Flux Surge";
        case 4: return "X-Ray Flare";
        default: return "Unknown Space Telemetry";
    }
}

// Native C++ Manual Multi-Layer Perceptron (MLP) Semantic Decoder
void decode_semantic_vector(const SemanticPayload& payload, float decoded_telemetry[5]) {
    // Nested for loops for manual matrix-vector multiplication (32 inputs x 5 features)
    for (int feature = 0; feature < 5; ++feature) {
        float sum = 0.0f;
        for (int dim = 0; dim < 32; ++dim) {
            sum += payload.embedding[dim] * INVERSE_PROJECTION_WEIGHTS[dim][feature];
        }
        // Rescale feature estimates back to physical ranges
        if (feature == 0) decoded_telemetry[feature] = fabsf(sum * 2800.0f + 1200.0f);
        else if (feature == 1) decoded_telemetry[feature] = fabsf(sum * 4500.0f + 800.0f);
        else if (feature == 2) decoded_telemetry[feature] = fabsf(sum * 1800.0f + 400.0f);
        else if (feature == 3) decoded_telemetry[feature] = fabsf(sum * 900.0f + 150.0f);
        else decoded_telemetry[feature] = fabsf(sum * 8.0f + 0.6f);
    }
}

int main(int argc, char** argv) {
    (void)argc; (void)argv;
    std::cout << "\033[1;36m========================================================================\033[0m\n";
    std::cout << "\033[1;36m   PROJECT SHIVODAYA :: AKASHDEEP MODULE (C++17 SEMANTIC DECODER)       \033[0m\n";
    std::cout << "\033[1;36m   Endpoint Destination Target: ipn:3.1 (Mars Base / Deep Space EID)    \033[0m\n";
    std::cout << "\033[1;36m========================================================================\033[0m\n\n";

    // Open Mission Control Log file using POSIX open()
    int log_fd = open(MISSION_LOG_PATH, O_WRONLY | O_CREAT | O_APPEND, 0644);
    if (log_fd < 0) {
        std::cerr << "[Akashdeep Error] Failed to open POSIX mission log file\n";
    }

    // FIFO Ingress Pipe simulating ION bp_receive bundle ingestion
    const char* ingress_fifo = "/tmp/shivodaya_akashdeep_ingress.fifo";
    mkfifo(ingress_fifo, 0666);
    int server_fd = open(ingress_fifo, O_RDWR | O_NONBLOCK);

    std::cout << "\033[1;32m[+] Akashdeep BP Bundle Ingestion Loop Active on Port 8090\033[0m\n";
    std::cout << "\033[1;33m[+] Native C++ Multi-Layer Perceptron (MLP) Inverse Projection Engine Ready\033[0m\n";
    std::cout << "\033[1;35m[+] Mission Control Log File: " << MISSION_LOG_PATH << " (POSIX write mode)\033[0m\n\n";
    std::cout.flush();

    uint64_t decoded_count = 0;
    while (true) {
        EncodedAlertBundle bundle;
        sockaddr_in client_addr;
        socklen_t addr_len = sizeof(client_addr);

        ssize_t bytes_received = read(server_fd, &bundle, sizeof(bundle));
        if (bytes_received > 0) {
            decoded_count++;

            // Validate Marker
            if (strncmp(bundle.payload.marker, BHAARAT_MARKER, 7) != 0) {
                std::cout << "\033[1;31m[AKASHDEEP REJECT] Marker Mismatch Drop: " << bundle.payload.marker << "\033[0m\n";
                continue;
            }

            // Decode 32-float embedding back into space weather telemetry estimates
            float reconstructed[5];
            decode_semantic_vector(bundle.payload, reconstructed);

            std::cout << "[AKASHDEEP DECODE #" << decoded_count << "] EID: \033[1;36mipn:3.1\033[0m | Marker Verified: '\033[1;32m"
                      << bundle.payload.marker << "\033[0m'\n";
            std::cout << "  Telemetry Stream: \033[1;33m" << get_stream_name(bundle.stream_type) << "\033[0m\n";
            std::cout << "  Raw Val1: " << bundle.raw_val1 << " | Reconstructed JSCC Est: "
                      << std::fixed << std::setprecision(2) << reconstructed[bundle.stream_type % 5] << "\n";
            std::cout << "  Timestamp: " << bundle.timestamp << " | dPhi/dt Acceleration: " << bundle.dphi_dt << "\n\n";
            std::cout.flush();

            // Format alert string for POSIX write() logging
            std::stringstream log_ss;
            log_ss << "[AKASHDEEP MISSION CONTROL ALERT] TS: " << bundle.timestamp
                   << " | STREAM: " << get_stream_name(bundle.stream_type)
                   << " | RAW_VAL: " << bundle.raw_val1
                   << " | JSCC_RECONSTRUCTED: " << reconstructed[bundle.stream_type % 5]
                   << " | ACCEL: " << bundle.dphi_dt
                   << " | MARKER: " << bundle.payload.marker << "\n";

            std::string log_str = log_ss.str();
            if (log_fd >= 0) {
                // POSIX write() requirement
                write(log_fd, log_str.c_str(), log_str.length());
            }
        }
    }

    if (log_fd >= 0) close(log_fd);
    close(server_fd);

    std::cout << "\033[1;32m========================================================================\033[0m\n";
    std::cout << "\033[1;32m[+] Akashdeep Decoder Completed: " << decoded_count << " Semantic Bundles Reconstructed\033[0m\n";
    std::cout << "\033[1;32m========================================================================\033[0m\n";

    return 0;
}
