#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$DIR/.." && pwd )"

echo "========================================================================"
echo "   BUILDING SHIVODAYA EARTH MONITOR (C++17 QUERY BRIDGE)               "
echo "========================================================================"

gcc -O3 -c "$ROOT_DIR/third_party/sqlite3/sqlite3.c" -o "$DIR/sqlite3.o"
g++ -O3 -std=c++17 "$DIR/earth_monitor.cpp" "$DIR/sqlite3.o" -I"$ROOT_DIR/third_party/sqlite3" -lpthread -ldl -o "$DIR/earth_monitor"
rm -f "$DIR/sqlite3.o"

echo "[+] Build complete -> earth_monitor/earth_monitor"
