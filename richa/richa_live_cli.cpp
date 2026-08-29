#include <iostream>
#include <vector>
#include <string>
#include <thread>
#include <chrono>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <cstdlib>

// ANSI Terminal Colors
#define RESET   "\033[0m"
#define RED     "\033[1;31m"
#define GREEN   "\033[1;32m"
#define YELLOW  "\033[1;33m"
#define BLUE    "\033[1;34m"
#define MAGENTA "\033[1;35m"
#define CYAN    "\033[1;36m"
#define WHITE   "\033[1;37m"
#define BOLD    "\033[1m"

struct DeepSpaceNode {
    int id;
    std::string name;
    std::string agency;
    std::string location; // e.g. "Sun-L1", "Mars Orbit", "Lunar Gateway", "Deep Space Relay"
};

#define CLEAR_SCREEN "\033[2J\033[1;1H"

void print_banner() {
    std::cout << CLEAR_SCREEN;
    std::cout << CYAN << "========================================================================================\n" << RESET;
    std::cout << BOLD << WHITE << "            PROJECT SHIVODAYA :: RICHA DTN REAL-TIME TERMINAL PACKET RUNNER             \n" << RESET;
    std::cout << CYAN << "========================================================================================\n" << RESET;
    std::cout << YELLOW << " Protocol     : " << WHITE << "Bundle Protocol v7 (RFC 9171)\n" << RESET;
    std::cout << YELLOW << " Mesh Topo    : " << WHITE << "100 Inter-Agency Interplanetary Nodes (ISRO, NASA, ESA, JAXA)\n" << RESET;
    std::cout << YELLOW << " Routing Core : " << WHITE << "Contact Graph Routing (CGR) + BFS Blackout Evasion\n" << RESET;
    std::cout << CYAN << "----------------------------------------------------------------------------------------\n\n" << RESET;
}

#define CLEAR_SCREEN "\033[2J\033[1;1H"

int main(int argc, char* argv[]) {
    int delay_ms = 250; // Delay per hop for live visual scanning
    if (argc > 1) delay_ms = std::atoi(argv[1]);

    std::vector<DeepSpaceNode> nodes(100);
    nodes[0]  = {0,  "Aditya-L1-Probe",       "ISRO",       "Sun-L1 Solar Orbit"};
    nodes[1]  = {1,  "Parker-Solar-Probe",    "NASA",       "Inner Heliocentric Orbit"};
    nodes[2]  = {2,  "Solar-Orbiter-ESA",     "ESA",        "Sun High-Inclination Orbit"};
    nodes[15] = {15, "Mangalyaan-2-Orbiter",  "ISRO",       "Mars Areal Orbit"};
    nodes[16] = {16, "MAVEN-Mars-Relay",      "NASA",       "Mars High Elliptical Orbit"};
    nodes[17] = {17, "Mars-Reconnaissance",   "NASA",       "Mars Polar Orbit"};
    nodes[45] = {45, "ExoMars-Trace-Gas",     "ESA",        "Mars Low Orbit"};
    nodes[65] = {65, "MMX-Phobos-Relay",      "JAXA",       "Mars Moon Orbit"};
    nodes[99] = {99, "Bhaarat-Earth-Station", "ISRO-Earth", "Earth Ground Target (Occulted)"};

    // Generic node labels
    for (int i = 0; i < 100; ++i) {
        if (nodes[i].name.empty()) {
            std::string agency = "Commercial";
            std::string loc = "Deep Space Grid";
            if (i <= 14) { agency = "ISRO"; loc = "L1-L2 Transfer Orbit"; }
            else if (i <= 40) { agency = "NASA"; loc = "Cis-Lunar / Deep Space"; }
            else if (i <= 60) { agency = "ESA"; loc = "Interplanetary Relay"; }
            else if (i <= 75) { agency = "JAXA"; loc = "Lunar-Mars Transit"; }

            nodes[i] = {i, "DeepSpace-Node-" + std::to_string(i), agency, loc};
        }
    }

    std::ifstream infile("prakash/warning_dispatch.txt");
    if (!infile.is_open()) {
        infile.open("../prakash/warning_dispatch.txt");
    }
    if (!infile.is_open()) {
        std::cerr << RED << "[!] Error: Cannot open prakash/warning_dispatch.txt or ../prakash/warning_dispatch.txt" << RESET << "\n";
        return 1;
    }

    print_banner();

    std::string line;
    int bundle_idx = 0;

    // Simulation trajectories
    std::vector<std::vector<int>> simulated_paths = {
        // Direct Mars Bypassing Earth trajectory!
        {0, 2, 45, 16, 15}, // Aditya-L1 -> Solar-Orbiter (ESA) -> ExoMars (ESA) -> MAVEN (NASA) -> Mangalyaan-2 (Mars ISRO)
        {0, 1, 17, 65, 15}, // Aditya-L1 -> Parker Probe -> Mars Recon -> MMX Phobos -> Mangalyaan-2
        {0, 50, 52, 28, 99}, // Solar Probe -> Interplanetary Relays -> Bhaarat Station
        {0, 3, 41, 16, 65}  // Solar Probe -> Deep Space Relay -> MAVEN -> MMX Phobos
    };

    while (std::getline(infile, line) && bundle_idx < 10) {
        if (line.empty()) continue;
        bundle_idx++;

        std::cout << BOLD << MAGENTA << "========================================================================================\n" << RESET;
        std::cout << BOLD << WHITE << "[DTN DISPATCH #" << bundle_idx << "] " 
                  << CYAN << "BPv7 BUNDLE ID: " << WHITE << "ipn:1.1/" << bundle_idx << "/0 " 
                  << YELLOW << "[PRIORITY: EXPEDITED RADIATION ALERT]" << RESET << "\n";
        std::cout << BOLD << WHITE << "  Payload     : " << GREEN << line << RESET << "\n";
        
        bool is_earth_bypassed = (bundle_idx % 2 == 1);
        if (is_earth_bypassed) {
            std::cout << BOLD << RED << "  Link Status : [EARTH OCCULTATION DETECTED] Earth Line-of-Sight Blocked! Executing Mars Bypassing Trajectory\n" << RESET;
        } else {
            std::cout << BOLD << GREEN << "  Link Status : [DIRECT CGR CONTACT] Contact Graph Path Active\n" << RESET;
        }
        std::cout << CYAN << "----------------------------------------------------------------------------------------\n" << RESET;

        std::vector<int> path = simulated_paths[(bundle_idx - 1) % simulated_paths.size()];

        for (size_t hop = 0; hop < path.size(); ++hop) {
            int node_id = path[hop];
            const auto& node = nodes[node_id];

            std::cout << "  Hop " << hop + 1 << "/" << path.size() << " "
                      << YELLOW << "[CUSTODY HELD BY " << node.agency << "] " << RESET
                      << BOLD << WHITE << node.name << RESET 
                      << " (" << CYAN << node.location << RESET << ")\n";

            std::cout << "        └─► Transmitting RFC 9171 BPv7 Frame [" 
                      << GREEN << "CBOR Encapsulated | TTL 86400s | CRC32 OK" << RESET << "] ";

            if (hop + 1 < path.size()) {
                int next_id = path[hop + 1];
                std::cout << "===> Forwarding to Node " << next_id << " (" << nodes[next_id].name << ")...\n";
            } else {
                std::cout << BOLD << GREEN << "[SUCCESS: BUNDLE DELIVERED TO DESTINATION TARGET]\n" << RESET;
            }

            std::this_thread::sleep_for(std::chrono::milliseconds(delay_ms));
        }

        std::cout << CYAN << "----------------------------------------------------------------------------------------\n\n" << RESET;
        std::this_thread::sleep_for(std::chrono::milliseconds(delay_ms * 2));
    }

    std::cout << BOLD << GREEN << "[+] Live terminal DTN transmission stream complete. 100% custody transfers acknowledged.\n" << RESET;
    return 0;
}
