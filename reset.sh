#!/bin/bash
# Usage:
#   ./reset.sh          # defaults to iOS
#   ./reset.sh android  # run Android instead

set -e
COLOR='\033[0;32m'
NC='\033[0m'

PLATFORM=${1:-ios}

echo "➤ ${COLOR}Expo prebuild clean (Bun)${NC}"

echo ""
# Clear Watchman cache
echo "➤ ${COLOR}Clearing Watchman cache${NC}"
watchman watch-del-all || true

echo ""
# Regenerate clean native projects
echo "➤ ${COLOR}Rebuilding native projects${NC}"
bunx expo prebuild --clean

echo ""
# Run full native build
echo "➤ ${COLOR}Running full $PLATFORM build${NC}"
bunx expo run:$PLATFORM

echo ""
echo "➤ ${COLOR}Done!${NC}"
