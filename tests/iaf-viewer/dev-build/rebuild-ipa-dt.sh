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

source ./dev-build/env.sh

source ./dev-build/global.sh

source ./dev-build/clean.sh

source ./dev-build/platform-api.sh
# echo "Exiting abruptly"
# exit

source ./dev-build/iaf-viewer.sh

echo "-----------------------------------------------------------------------"
echo "Rebuilding ipa-dt"
echo "-----------------------------------------------------------------------"
cd ../../../ipa-dt
echo "Cleaning up the ipa-dt"
rm -rf node_modules
nvm use $NEW_NODE_VERSION
cp package.json package.json.original
cp package-lock.json package-lock.json.original
npm install
npm install \
    @invicara/core-utils@4.2.2 \
    @invicara/iaf-script-engine@4.2.10 \
    @dtplatform/iaf-viewer@^4.3.15 \
    @invicara/invicara-lib@4.2.2 \
    @invicara/ipa-core@2.2.110-react-17.0 \
    @dtplatform/platform-api@^4.3.15 \
    @invicara/platform-ui-components@4.2.11 \
    @invicara/ui-utils@4.2.6 \
    react@^17.0.2  \
    react-data-table-component@^7.5.3  \
    react-dom@^17.0.2  \
    react-inspector@^6.0.2  \
    react-router@^5.3.4  \
    react-router-dom@^5.3.4  \
    react-table@^7.8.0
nvm use $NODE_VERSION
rm -rf ./node_modules/@dtplatform/iaf-viewer
npm link @dtplatform/iaf-viewer
npm link @dtplatform/platform-api
npm link ../InvicaraAppFramework/packages/iaf-viewer/node_modules/react
nvm use $NEW_NODE_VERSION
npm run build-dev
echo "Saving git ignored package.json.peer for incrmenetal build for node $NEW_NODE_VERSION"
cp package.json package.json.peer
cp package.json.original package.json
cp package-lock.json package-lock.json.peer
cp package-lock.json.original package-lock.json

echo "-----------------------------------------------------------------------"
echo "Launching ipa-dt"
echo "-----------------------------------------------------------------------"
export NODE_OPTIONS="--max-old-space-size=8192"
npm run watch

cd ../InvicaraAppFramework/packages/iaf-viewer
nvm use $CURRENT_NODE_VERSION
# unset NVM_DIR