# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 01-04-23    ATK        PLAT-2709   New UX UI Foundation Project
# 17-04-203                          npm link to react from iaf-viewer
# 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
# 12-Jan-23   RRP        PLAT-3940   Update dev friendly build scripts for 4.2
# 13-Jan-23   ATK        PLAT-3940   Be sure that ipa-core and ipa-dt is on React 17
# 13-Jan-23   ATK        PLAT-3940   Cleanup
# 28-Jun-24   ATK                    platform-api not liked by platform-api-conflux
# -------------------------------------------------------------------------------------

#!/bin/bash

# exit when any command fails
set -e

echo "-----------------------------------------------------------------------"
echo "Rebuilding iafViewer"
echo "-----------------------------------------------------------------------"

source ./dev-build/env.sh

cd ../iaf-viewer
npm link

cp package.json package.json.original
npm install
# echo "Explicitly installing peer dependencies for iaf-viewer for node $NODE_VERSION"
# npm install @mui/material@^5.15.15 @mui/icons-material@^5.15.15 @emotion/react@11.11.4 @emotion/styled@11.11.5 lodash-es@^4.17.21 react@^18.2.0 react-dom@^18.2.0 react-router-dom@^5.3.4

cp package.json package.json.peer

# Comment following lines if you don't want to use local platform-api build
rm -rf ./node_modules/@dtplatform/platform-api
npm link @dtplatform/platform-api
# Comment above lines if you don't want to use local platform-api build

npm run build-dev
echo "Saving git ignored package.json.peer for incrmenetal build for node $NODE_VERSION"
cp package.json.original package.json