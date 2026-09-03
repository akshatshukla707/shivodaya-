#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -f "$DIR/earth_monitor" ]; then
    "$DIR/build.sh"
fi

cd "$DIR"
./earth_monitor
