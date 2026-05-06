# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 01-04-23    ATK        PLAT-2709   New UX UI Foundation Project
# 17-04-203                          npm link to react from iaf-viewer
# 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
# 12-Jan-23   RRP        PLAT-3940   Update dev friendly build scripts for 4.2
# 13-Jan-23   ATK        PLAT-3940   Be sure that ipa-core and ipa-dt is on React 17
# 13-Jan-23   ATK        PLAT-3940   Cleanup
# -------------------------------------------------------------------------------------

#!/bin/bash

# exit when any command fails
set -e

echo "-----------------------------------------------------------------------"
echo "Cleaning up the npm cache"
rm -rf /Users/atulkulkarni/.nvm/versions/node/v14.21.3/lib/node_modules/@dtplatform
rm -rf /Users/atulkulkarni/.nvm/versions/node/v16.20.2/lib/node_modules/@dtplatform
echo "Cleaning up the platform-api"
cd ../platform-api/
rm -rf node_modules
rm -rf dist
echo "Cleaning up the iaf-viewer"
cd ../iaf-viewer
rm -rf node_modules
rm -rf dist
echo "Removing package-lock.json for iaf-viewer"
./dev-build/remove-file.sh package-lock.json
echo "Removing package-lock.json for platform-api"
./dev-build/remove-file.sh ../platform-api/package-lock.json
