#  ----------  ----------  ----------  ----------  ----------  ----------  ----------  ---------- -----
# Date        Author     Referene    Comments
# 28-Aug-24   ATK                    Created
#  ----------  ----------  ----------  ----------  ----------  ----------  ----------  ---------- -----

#!/bin/bash

# exit when any command fails
set -e
source ./dev-build/env.sh
source ./dev-build/color-echo.sh

clear

# Function to check for uncommitted changes
check_uncommitted_changes() {
    if [[ -n $(git status --porcelain) ]]; then
        echo_error " ---------- Exiting... there are uncommitted changes in the repository"
        exit 1
    fi
}
check_uncommitted_changes

echo " ---------- Verifying the obfuscation ---------- "
./dev-build/obfuscator/scripts/fetch.sh
./dev-build/obfuscator/scripts/build.sh

echo " ---------- Verifying the uncommitted changes in iaf-viewer ---------- "
check_uncommitted_changes

echo " ---------- Verifying the uncommitted changes in GraphicsService ---------- "
cd ../../../GraphicsService
check_uncommitted_changes

cd ../InvicaraAppFramework/packages/iaf-viewer
echo " ---------- Removing package-lock.json for iaf-viewer ---------- "
./dev-build/remove-file.sh package-lock.json

echo " ---------- Removing package-lock.json for platform-api ---------- "
./dev-build/remove-file.sh ../platform-api/package-lock.json

echo " ---------- Executing npm install at InvicaraAppFramwork level  ---------- "
cd ../../
npm install --no-package-lock

echo " ---------- Releasing InvicaraAppFramework  ---------- "
npm run release
cd packages/iaf-viewer
