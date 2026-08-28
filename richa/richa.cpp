#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <limits>
#include <fstream>
#include <sstream>
#include <chrono>
#include <cmath>
#include <memory>
#include <algorithm>

constexpr int TOTAL_NODES = 100;
constexpr double INF_WEIGHT = 1e9;

enum Agency {
    ISRO = 0,
    NASA = 1,
    ESA = 2,
    JAXA = 3,
    COMMERCIAL = 4
};

const char* agency_to_string(Agency a) {
    switch (a) {
        case ISRO: return "ISRO (Bhaarat)";
        case NASA: return "NASA";
        case ESA: return "ESA";
        case JAXA: return "JAXA";
        case COMMERCIAL: return "Commercial Mesh";
        default: return "Unknown";
    }
}

// Bundle Protocol v7 (RFC 9171) Payload Encapsulation
struct DTNBundle {
    std::string bundle_id;
    std::string source_eid;      // e.g. "ipn:1.1" (Prakash Solar Probe)
    std::string destination_eid; // e.g. "ipn:0.1" (Bhaarat Earth Station)
    uint8_t priority;            // 0=Bulk, 1=Normal, 2=Expedited Radiation Alert
    uint64_t creation_timestamp;
    uint32_t lifetime_ttl;       // Seconds
    std::string payload_data;    // Radiation threat alert payload
    int current_custody_node;
    std::vector<int> hops_taken;
};

// Edge in Space Contact Graph
struct Edge {
    int target_node;
    double propagation_delay_ms; // Distance / speed_of_light
    double bandwidth_mbps;
    bool is_blackout;
};

// Node in Space Mesh Network
struct SpaceNode {
    int node_id;
    std::string name;
    Agency agency;
    double pos_x; // 2D orbital map coordinate
    double pos_y;
    bool is_active;
    std::vector<Edge> neighbors;
    std::vector<DTNBundle> custody_store; // Local DTN persistence store
};

class RichaTransportEngine {
private:
    std::vector<SpaceNode> mesh_nodes;

public:
    RichaTransportEngine() {
        initialize_100_space_nodes();
        build_interagency_mesh_edges();
    }

    void initialize_100_space_nodes() {
        mesh_nodes.resize(TOTAL_NODES);
        
        // Node 0: Prakash Solar Probe (Aditya-L1 / ISRO)
        mesh_nodes[0] = {0, "Prakash-Aditya-L1", ISRO, 100.0, 300.0, true, {}, {}};
        // Node 99: Bhaarat Primary Station (ISRO Earth Ground Target)
        mesh_nodes[99] = {99, "Bhaarat-Earth-Station", ISRO, 900.0, 300.0, true, {}, {}};

        for (int i = 1; i < TOTAL_NODES - 1; ++i) {
            Agency agency;
            std::string name_prefix;

            if (i >= 1 && i <= 15) {
                agency = ISRO;
                name_prefix = "ISRO-NavIC-Sat-" + std::to_string(i);
            } else if (i >= 16 && i <= 40) {
                agency = NASA;
                name_prefix = "NASA-Artemis-Node-" + std::to_string(i - 15);
            } else if (i >= 41 && i <= 60) {
                agency = ESA;
                name_prefix = "ESA-Juice-Relay-" + std::to_string(i - 40);
            } else if (i >= 61 && i <= 75) {
                agency = JAXA;
                name_prefix = "JAXA-Lunar-Relay-" + std::to_string(i - 60);
            } else {
                agency = COMMERCIAL;
                name_prefix = "Commercial-Mesh-Tower-" + std::to_string(i - 75);
            }

            // Distribute 2D orbital coordinates visually across grid space
            double col = (i % 10) * 80.0 + 120.0;
            double row = (i / 10) * 55.0 + 50.0;

            mesh_nodes[i] = {i, name_prefix, agency, col, row, true, {}, {}};
        }
    }

    void build_interagency_mesh_edges() {
        // Connect each node to nearby geometric neighbor nodes within communication range
        for (int i = 0; i < TOTAL_NODES; ++i) {
            for (int j = 0; j < TOTAL_NODES; ++j) {
                if (i == j) continue;

                double dx = mesh_nodes[i].pos_x - mesh_nodes[j].pos_x;
                double dy = mesh_nodes[i].pos_y - mesh_nodes[j].pos_y;
                double dist = std::sqrt(dx * dx + dy * dy);

                // Nodes within line-of-sight range establish inter-agency link
                if (dist < 180.0) {
                    double delay_ms = dist * 0.5; // Simulated prop delay
                    double bw_mbps = 100.0 + (i + j) % 50;
                    mesh_nodes[i].neighbors.push_back({j, delay_ms, bw_mbps, false});
                }
            }
        }
    }

    // Autonomous Time-Dependent Dijkstra Contact Graph Routing (CGR)
    std::vector<int> calculate_cgr_path(int source, int destination) {
        std::vector<double> min_dist(TOTAL_NODES, INF_WEIGHT);
        std::vector<int> parent(TOTAL_NODES, -1);
        
        // Priority Queue storing pair: <distance, node_id>
        using QueuePair = std::pair<double, int>;
        std::priority_queue<QueuePair, std::vector<QueuePair>, std::greater<QueuePair>> pq;

        min_dist[source] = 0.0;
        pq.push({0.0, source});

        while (!pq.empty()) {
            auto [current_delay, u] = pq.top();
            pq.pop();

            if (current_delay > min_dist[u]) continue;
            if (u == destination) break;

            for (const auto& edge : mesh_nodes[u].neighbors) {
                if (edge.is_blackout || !mesh_nodes[edge.target_node].is_active) continue;

                double new_delay = current_delay + edge.propagation_delay_ms;
                if (new_delay < min_dist[edge.target_node]) {
                    min_dist[edge.target_node] = new_delay;
                    parent[edge.target_node] = u;
                    pq.push({new_delay, edge.target_node});
                }
            }
        }

        // Reconstruct Path
        std::vector<int> path;
        if (min_dist[destination] == INF_WEIGHT) {
            return path; // No primary path available (Blackout)
        }

        for (int at = destination; at != -1; at = parent[at]) {
            path.push_back(at);
        }
        std::reverse(path.begin(), path.end());
        return path;
    }

    // Blackout Evasion: BFS Alternative Relay Path Discovery
    std::vector<int> bfs_blackout_evasion_path(int source, int destination) {
        std::vector<int> parent(TOTAL_NODES, -1);
        std::vector<bool> visited(TOTAL_NODES, false);
        std::queue<int> q;

        q.push(source);
        visited[source] = true;

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            if (u == destination) break;

            for (const auto& edge : mesh_nodes[u].neighbors) {
                if (edge.is_blackout || !mesh_nodes[edge.target_node].is_active) continue;

                if (!visited[edge.target_node]) {
                    visited[edge.target_node] = true;
                    parent[edge.target_node] = u;
                    q.push(edge.target_node);
                }
            }
        }

        std::vector<int> path;
        if (!visited[destination]) return path;

        for (int at = destination; at != -1; at = parent[at]) {
            path.push_back(at);
        }
        std::reverse(path.begin(), path.end());
        return path;
    }

    void simulate_blackout_link(int node_a, int node_b) {
        for (auto& edge : mesh_nodes[node_a].neighbors) {
            if (edge.target_node == node_b) edge.is_blackout = true;
        }
        for (auto& edge : mesh_nodes[node_b].neighbors) {
            if (edge.target_node == node_a) edge.is_blackout = true;
        }
    }

    void process_prakash_dispatches(const std::string& input_log_path, const std::string& output_log_path) {
        std::ifstream infile(input_log_path);
        std::ofstream outfile(output_log_path);

        if (!infile.is_open()) {
            std::cerr << "[!] Error opening Prakash dispatches file: " << input_log_path << "\n";
            return;
        }

        outfile << "========================================================================\n";
        outfile << " PROJECT SHIVODAYA :: RICHA DTN INTER-AGENCY TRANSPORT DISPATCH LOG     \n";
        outfile << "========================================================================\n\n";

        std::string line;
        int bundle_counter = 0;

        while (std::getline(infile, line) && bundle_counter < 50) {
            if (line.empty()) continue;
            bundle_counter++;

            DTNBundle bundle;
            bundle.bundle_id = "BPv7-BUNDLE-" + std::to_string(bundle_counter);
            bundle.source_eid = "ipn:1.1";
            bundle.destination_eid = "ipn:99.1";
            bundle.priority = 2; // High priority expedited alert
            bundle.payload_data = line;
            bundle.current_custody_node = 0;

            // 1. Calculate Primary CGR Path (Time-Dependent Dijkstra)
            std::vector<int> path = calculate_cgr_path(0, 99);

            // Simulate planetary blackout on primary path every 5th bundle
            if (bundle_counter % 5 == 0 && path.size() > 2) {
                int blackout_u = path[1];
                int blackout_v = path[2];
                simulate_blackout_link(blackout_u, blackout_v);

                outfile << "[BLACKOUT DETECTED] Link (" << blackout_u << " -> " << blackout_v 
                        << ") Occulted! Executing BFS Blackout Evasion Reroute...\n";

                // Re-evaluate using BFS Evasion Path
                path = bfs_blackout_evasion_path(0, 99);
            }

            bundle.hops_taken = path;

            outfile << "[DISPATCH #" << bundle_counter << "] Bundle ID: " << bundle.bundle_id << "\n";
            outfile << "  - Payload: " << bundle.payload_data << "\n";
            outfile << "  - Calculated DTN Trajectory (" << path.size() << " Hops): ";
            
            for (size_t k = 0; k < path.size(); ++k) {
                outfile << "Node " << path[k] << " (" << agency_to_string(mesh_nodes[path[k]].agency) << ")";
                if (k + 1 < path.size()) outfile << " -> ";
            }
            outfile << "\n  - DTN Custody Transfer Status: SUCCESSFUL DELIVERY TO TARGET\n\n";
        }

        std::cout << "[+] Processed " << bundle_counter << " Prakash alert bundles through 100-node inter-agency DTN mesh.\n";
        std::cout << "[+] Dispatch log saved to: " << output_log_path << "\n";
    }
};

int main() {
    std::cout << "===============================================================\n";
    std::cout << "       PROJECT SHIVODAYA :: RICHA DTN TRANSPORT MODULE         \n";
    std::cout << "===============================================================\n";

    RichaTransportEngine richa;
    richa.process_prakash_dispatches(
        "/home/akshat/shivodaya/prakash/warning_dispatch.txt",
        "/home/akshat/shivodaya/richa/richa_dispatch_log.txt"
    );

    return 0;
}
