#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <chrono>
#include <thread>
#include <unistd.h>
#include "sqlite3.h"

int main(int argc, char** argv) {
    (void)argc; (void)argv;
    std::cout << "\033[1;36m========================================================================\033[0m\n";
    std::cout << "\033[1;36m   PROJECT SHIVODAYA :: EARTH MONITORING CENTER (MODULE 4)              \033[0m\n";
    std::cout << "\033[1;36m   Real-time Neural DTN Mesh & SQLite Visualizer Dashboard Bridge       \033[0m\n";
    std::cout << "\033[1;36m========================================================================\033[0m\n\n";

    sqlite3* db = nullptr;
    if (sqlite3_open("richa_routing_log.db", &db) != SQLITE_OK) {
        std::cerr << "[Earth Monitor Error] Cannot open richa_routing_log.db\n";
        return 1;
    }

    std::cout << "\033[1;32m[+] Connected to Richa Asynchronous Neural Routing SQLite Database\033[0m\n";
    std::cout << "\033[1;33m[+] Monitoring Deep Space Nodes: ISRO (Bhaarat), NASA, ESA, Roscosmos, JAXA\033[0m\n\n";

    const char* query = "SELECT id, timestamp, source, dest, status, perceptron_score, path_taken FROM routing_log ORDER BY id DESC LIMIT 10;";
    
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db, query, -1, &stmt, nullptr) == SQLITE_OK) {
        std::cout << "\033[1;37m+-----+---------------------+----------+----------+-----------------------+------------------+------------------------------+\033[0m\n";
        std::cout << "\033[1;37m| ID  | Timestamp           | Source   | Dest     | Status                | Perceptron Score | Path Taken                   |\033[0m\n";
        std::cout << "\033[1;37m+-----+---------------------+----------+----------+-----------------------+------------------+------------------------------+\033[0m\n";

        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int id = sqlite3_column_int(stmt, 0);
            const unsigned char* ts = sqlite3_column_text(stmt, 1);
            const unsigned char* src = sqlite3_column_text(stmt, 2);
            const unsigned char* dst = sqlite3_column_text(stmt, 3);
            const unsigned char* st = sqlite3_column_text(stmt, 4);
            double score = sqlite3_column_double(stmt, 5);
            const unsigned char* path = sqlite3_column_text(stmt, 6);

            std::cout << "| " << std::left << std::setw(3) << id
                      << " | " << std::setw(19) << (ts ? (const char*)ts : "")
                      << " | " << std::setw(8) << (src ? (const char*)src : "")
                      << " | " << std::setw(8) << (dst ? (const char*)dst : "")
                      << " | " << std::setw(21) << (st ? (const char*)st : "")
                      << " | " << std::setw(16) << std::fixed << std::setprecision(4) << score
                      << " | " << std::setw(28) << (path ? (const char*)path : "") << " |\n";
        }
        std::cout << "\033[1;37m+-----+---------------------+----------+----------+-----------------------+------------------+------------------------------+\033[0m\n";
        sqlite3_finalize(stmt);
    }

    sqlite3_close(db);
    std::cout << "\n\033[1;32m[+] Earth Monitoring Telemetry Sync Complete\033[0m\n";
    return 0;
}
