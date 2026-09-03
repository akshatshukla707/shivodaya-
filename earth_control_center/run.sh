#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -f "$DIR/bin/earthcontrol/EarthControlCenterUI.class" ]; then
    "$DIR/build.sh"
fi

echo "========================================================================"
echo "   LAUNCHING SHIVODAYA EARTH CONTROL CENTER (JAVA SWING GUI)           "
echo "========================================================================"

cd "$DIR"
java -cp ".:bin:lib/*" earthcontrol.EarthControlCenterUI
