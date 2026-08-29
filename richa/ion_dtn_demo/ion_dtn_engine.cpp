#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include <thread>
#include <chrono>
#include <iomanip>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

// Shivodaya Deep Space BPv7 Bundle Header
struct BPv7BundleHeader {
    uint32_t bundle_id;
    char source_eid[32];      // e.g. "ipn:1.1" (Aditya-L1)
    char destination_eid[32]; // e.g. "ipn:3.1" (Mars Base)
    uint64_t timestamp;
    uint32_t ttl_seconds;
    uint8_t custody_transfer_requested;
    uint32_t payload_len;
};

const std::string CUSTODY_STORE_PATH = "/tmp/ion_dtn_bpv7_custody.store";
const std::string LIVE_PIPE_PATH = "/tmp/ion_dtn_live.fifo";

void ensure_fifo() {
    mkfifo(LIVE_PIPE_PATH.c_str(), 0666);
}

void send_alert_bundle(int option, const std::string& filter_type = "") {
    ensure_fifo();

    std::vector<std::string> alerts;
    std::ifstream warning_file("prakash/warning_dispatch.txt");
    std::string line;
    while (std::getline(warning_file, line)) {
        if (!line.empty()) {
            if (filter_type.empty() || line.find("TYPE: " + filter_type) != std::string::npos) {
                alerts.push_back(line);
                if (alerts.size() >= 100) break;
            }
        }
    }
    if (warning_file.is_open()) warning_file.close();

    if (alerts.empty()) {
        if (filter_type == "SEP") {
            alerts.push_back("[BPv7 ALERT] TS: 2026 08 28 00 07 00 | TYPE: SEP | P1: 2833.80 | P2: 360.00 | dPhi/dt: 2590.30");
        } else if (filter_type == "SOLAR_WIND") {
            alerts.push_back("[BPv7 ALERT] TS: 2026 08 28 00 08 00 | TYPE: SOLAR_WIND | P1: 1444.70 | P2: 360.00 | dPhi/dt: -1389.10");
        } else if (filter_type == "XRAY_FLUX") {
            alerts.push_back("[BPv7 ALERT] TS: 2026 08 28 00 09 00 | TYPE: XRAY_FLUX | P1: 2014.20 | P2: 360.00 | dPhi/dt: 569.50");
        } else {
            alerts.push_back("[BPv7 ALERT] TS: 2026 08 28 00 04 00 | TYPE: CME | P1: 2370.20 | P2: 360.00 | dPhi/dt: 1997.00");
        }
    }

    std::string payload = alerts[option % alerts.size()];
    static uint32_t global_bundle_id = 1000;
    global_bundle_id++;

    auto now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()
    ).count();

    // Write to persistent custody store with send timestamp (ms)
    std::ofstream store(CUSTODY_STORE_PATH, std::ios::app);
    if (store.is_open()) {
        store << "BUNDLE_ID:" << global_bundle_id << "|SEND_TS:" << now_ms << "|" << payload << "\n";
        store.close();
    }

    // Broadcast to live receiver pipe
    int fd = open(LIVE_PIPE_PATH.c_str(), O_WRONLY | O_NONBLOCK);
    if (fd != -1) {
        std::string msg = "BUNDLE_ID:" + std::to_string(global_bundle_id) + "|" + payload + "\n";
        ssize_t ret = write(fd, msg.c_str(), msg.length());
        (void)ret;
        close(fd);
    }

    std::cout << "\033[1;32m[SHIVODAYA DTN BPv7 SENDER]\033[0m Bundle #" << global_bundle_id 
              << " Dispatched to \033[1;36mipn:3.1\033[0m (Mars Station)\n";
    std::cout << "  \033[1;33mCustody Memory:\033[0m STORED in RFC 9171 Non-Volatile Memory Buffer\n";
    std::cout << "  \033[1;37mPayload:\033[0m " << payload << "\n\n";
}

void run_sender_terminal() {
    std::cout << "\033[1;36m========================================================================\033[0m\n";
    std::cout << "\033[1;36m   PROJECT SHIVODAYA :: DTN BPv7 ALERT SENDER (TERMINAL 1)             \033[0m\n";
    std::cout << "\033[1;36m   Node EID: ipn:1.1 (ISRO Aditya-L1 Solar Probe Engine)               \033[0m\n";
    std::cout << "\033[1;36m========================================================================\033[0m\n\n";

    while (true) {
        std::cout << "Select Alert Bundle Type to Dispatch:\n";
        std::cout << "  \033[1;31m1)\033[0m CME Radiation Warning\n";
        std::cout << "  \033[1;33m2)\033[0m SEP Solar Energetic Particle Warning\n";
        std::cout << "  \033[1;32m3)\033[0m Solar Wind Flux Alert\n";
        std::cout << "  \033[1;35m4)\033[0m X-Ray Flare Alert\n";
        std::cout << "  \033[1;36m5)\033[0m Auto-Stream Multi-Radiation Batch (20 Bundles)\n";
        std::cout << "  \033[1;37m0)\033[0m Exit\n";
        std::cout << "\033[1;33mEnter Choice [0-5]: \033[0m";

        int choice = -1;
        if (!(std::cin >> choice)) break;
        if (choice == 0) break;

        if (choice == 1) {
            send_alert_bundle(0, "CME");
        } else if (choice == 2) {
            send_alert_bundle(0, "SEP");
        } else if (choice == 3) {
            send_alert_bundle(0, "SOLAR_WIND");
        } else if (choice == 4) {
            send_alert_bundle(0, "XRAY_FLUX");
        } else if (choice == 5) {
            std::cout << "\n\033[1;35m[AUTO-STREAM] Dispatching 20 Multi-Radiation BPv7 Alerts into Shivodaya DTN Mesh...\033[0m\n";
            std::vector<std::string> types = {"CME", "SEP", "SOLAR_WIND", "XRAY_FLUX"};
            for (int i = 0; i < 20; i++) {
                std::string t = types[i % types.size()];
                send_alert_bundle(i / 4, t);
                std::this_thread::sleep_for(std::chrono::milliseconds(250));
            }
        }
    }
}

void run_receiver_online_terminal() {
    ensure_fifo();
    std::cout << "\033[1;32m========================================================================\033[0m\n";
    std::cout << "\033[1;32m   PROJECT SHIVODAYA :: DTN LIVE RECEIVER (TERMINAL 2)                 \033[0m\n";
    std::cout << "\033[1;32m   Node EID: ipn:2.1 (Cis-Lunar Gateway Relay Station)                 \033[0m\n";
    std::cout << "\033[1;32m   Status: ONLINE & LISTENING LIVE BEFORE TRANSMISSION                 \033[0m\n";
    std::cout << "\033[1;32m========================================================================\033[0m\n\n";

    int fd = open(LIVE_PIPE_PATH.c_str(), O_RDONLY);
    if (fd == -1) {
        std::cerr << "Error opening FIFO pipe.\n";
        return;
    }

    char buffer[1024];
    while (true) {
        ssize_t bytes = read(fd, buffer, sizeof(buffer) - 1);
        if (bytes > 0) {
            buffer[bytes] = '\0';
            std::stringstream ss(buffer);
            std::string line;
            while (std::getline(ss, line)) {
                if (!line.empty()) {
                    std::cout << "\033[1;32m[LIVE RECV ipn:2.1]\033[0m \033[1;37m" << line << "\033[0m\n";
                }
            }
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    close(fd);
}

void run_receiver_delayed_terminal() {
    std::cout << "\033[1;33m========================================================================\033[0m\n";
    std::cout << "\033[1;33m   PROJECT SHIVODAYA :: DTN DELAYED CUSTODY RECEIVER (TERMINAL 3)      \033[0m\n";
    std::cout << "\033[1;33m   Node EID: ipn:3.1 (Mars Operations Center)                         \033[0m\n";
    std::cout << "\033[1;33m   Status: LAUNCHED LATER (AFTER TRANSMISSION COMPLETE)                \033[0m\n";
    std::cout << "\033[1;33m========================================================================\033[0m\n\n";

    std::cout << "\033[1;36m[DTN CUSTODY RETRIEVAL]\033[0m Accessing Shivodaya BPv7 Store-and-Forward Memory...\n";
    std::this_thread::sleep_for(std::chrono::milliseconds(800));

    std::ifstream store(CUSTODY_STORE_PATH);
    if (!store.is_open()) {
        std::cout << "\033[1;31m[EMPTY]\033[0m No custody bundles found in store yet.\n";
        return;
    }

    auto recv_now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()
    ).count();

    std::string line;
    int count = 0;
    while (std::getline(store, line)) {
        if (!line.empty()) {
            count++;
            
            uint64_t send_ts = 0;
            std::string display_payload = line;
            size_t send_pos = line.find("|SEND_TS:");
            if (send_pos != std::string::npos) {
                size_t end_pos = line.find("|", send_pos + 9);
                if (end_pos != std::string::npos) {
                    try {
                        send_ts = std::stoull(line.substr(send_pos + 9, end_pos - (send_pos + 9)));
                    } catch (...) { send_ts = 0; }
                    display_payload = line.substr(0, send_pos) + line.substr(end_pos);
                }
            }

            double delay_sec = 0.0;
            if (send_ts > 0 && recv_now_ms >= send_ts) {
                delay_sec = (recv_now_ms - send_ts) / 1000.0;
            }

            std::cout << "\033[1;33m[CUSTODY RELAY ipn:3.1]\033[0m Bundle #" << count 
                      << " Received from Custody Memory:\n  \033[1;37m" << display_payload << "\033[0m\n";
            std::cout << "  \033[1;35m[DELAYED TIME]: Transmission latency / blackout duration = " 
                      << std::fixed << std::setprecision(2) << delay_sec << " seconds\033[0m\n";
            std::cout << "  \033[1;32m-> RFC 9171 Custody Release ACK Sent back to ipn:1.1\033[0m\n\n";
            
            // Visual Pacing Delay (0.8 seconds) so user can see packets coming one by one
            std::this_thread::sleep_for(std::chrono::milliseconds(800));
        }
    }
    store.close();

    std::cout << "\033[1;32m[COMPLETE]\033[0m All " << count << " stored BPv7 bundles successfully retrieved from Shivodaya DTN Memory!\n";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "Usage: " << argv[0] << " <sender|recv_online|recv_delayed>\n";
        return 1;
    }

    std::string mode = argv[1];
    if (mode == "sender") {
        run_sender_terminal();
    } else if (mode == "recv_online") {
        run_receiver_online_terminal();
    } else if (mode == "recv_delayed") {
        run_receiver_delayed_terminal();
    } else {
        std::cerr << "Unknown mode: " << mode << "\n";
        return 1;
    }

    return 0;
}
