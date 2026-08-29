cmake_minimum_required(VERSION 3.16)
project(ProjectShivodaya LANGUAGES C CXX)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_compile_options(-O3 -Wall -Wextra -pthread)

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/third_party/sqlite3
)

if(EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/third_party/ION-DTN")
    include_directories(
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party/ION-DTN/bpv7/include
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party/ION-DTN/ici/include
    )
elseif(EXISTS "/home/akshat/ION-DTN")
    include_directories(
        /home/akshat/ION-DTN/bpv7/include
        /home/akshat/ION-DTN/ici/include
    )
endif()

# SQLite3 Library
add_library(sqlite3_static STATIC third_party/sqlite3/sqlite3.c)
target_include_directories(sqlite3_static PUBLIC third_party/sqlite3)

# Module 1: Prakash (C11 - Native Semantic Encoder & Ingest)
add_executable(prakash_encoder prakash/prakash_encoder.c)
target_link_libraries(prakash_encoder PRIVATE sqlite3_static pthread m)

# Module 2: Richa (C++17 - Native Neural DTN Router)
add_executable(richa_neural_router richa/richa_neural_router.cpp)
target_link_libraries(richa_neural_router PRIVATE sqlite3_static pthread m)

# Module 3: Akashdeep Legacy Decoder (C++17 - Native Semantic Decoder)
add_executable(akashdeep_decoder akashdeep/akashdeep_decoder.cpp)
target_link_libraries(akashdeep_decoder PRIVATE sqlite3_static pthread m)

# Module 3: Akashdeep NASA ION Backend (C++17 - BP Ingress & SQLite Logger)
add_executable(akashdeep_ion_backend akashdeep/akashdeep_ion_backend.cpp)
target_link_libraries(akashdeep_ion_backend PRIVATE sqlite3_static pthread m)

# Module 4: Earth Monitoring Center & Visualization Bridge
add_executable(earth_monitor earth_monitor/earth_monitor.cpp)
target_link_libraries(earth_monitor PRIVATE sqlite3_static pthread m)

# Module 5: Standalone ION DTN Engine Demo
add_executable(ion_dtn_engine richa/ion_dtn_demo/ion_dtn_engine.cpp)
target_link_libraries(ion_dtn_engine PRIVATE pthread m)
