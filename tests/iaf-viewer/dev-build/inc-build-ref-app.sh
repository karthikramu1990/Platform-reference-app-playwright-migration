# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 01-04-23    ATK        PLAT-2709   New UX UI Foundation Project
# 17-04-203                          npm link to react from iaf-viewer
# 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
# 12-Jan-23   RRP        PLAT-3940   Update dev friendly build scripts for 4.2
# 13-Jan-23   ATK        PLAT-3940   Cleanup
# -------------------------------------------------------------------------------------
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

source ./dev-build/env.sh

# Store the current Node.js version
CURRENT_NODE_VERSION=$(nvm current)

# Set the desired Node.js version
echo "NODE_VERSION: "$NODE_VERSION
echo "NEW_NODE_VERSION: "$NEW_NODE_VERSION
nvm use $NODE_VERSION

#!/bin/bash

# exit when any command fails
set -e

source ~/.nvm/nvm.sh
nvm use $NODE_VERSION

echo "-----------------------------------------------------------------------"
echo "Incrementally building platform-api"
echo "-----------------------------------------------------------------------"
cd ../platform-api/
cp package.json package.json.original
cp package.json.peer package.json
npm run build-dev
mv package.json.original package.json
cd ../iaf-viewer

echo "-----------------------------------------------------------------------"
echo "Incrementally building iafViewer"
echo "-----------------------------------------------------------------------"
cp package.json package.json.original
cp package.json.peer package.json
npm run build-dev
mv package.json.original package.json

echo "-----------------------------------------------------------------------"
echo "Incrementally building PlatformReferenceApp"
echo "-----------------------------------------------------------------------"
cd ../../../PlatformReferenceApp
cp package.json package.json.original
cp package.json.peer package.json
nvm use $NEW_NODE_VERSION
# npm run build-dev
mv package.json.original package.json

echo "-----------------------------------------------------------------------"
echo "Launching PlatformReferenceApp"
echo "-----------------------------------------------------------------------"
export NODE_OPTIONS="--max-old-space-size=8192"
npm run watch

cd ../InvicaraAppFramework/packages/iaf-viewer