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
echo "Rebuilding platform-api"
echo "-----------------------------------------------------------------------"

cd ../platform-api/
npm link

echo "IMPORTANT! Assuming that rollup dev config file correctly outputs to file: dist/esm/platform-api.js"
cp package.json package.json.original
npm install
npm install lodash-es@^4.17.21  @babel/core babelify
cp package.json package.json.peer
npm run build-dev
cp package.json.original package.json
cd ../iaf-viewer

# echo "Exiting abruptly"
# exit