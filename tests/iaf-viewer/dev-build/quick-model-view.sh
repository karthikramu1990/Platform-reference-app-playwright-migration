# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 28-Jun-24   ATK                    Created
# 28-Jun-24   ATK                    platform-api not liked by platform-api-conflux
# -------------------------------------------------------------------------------------

#!/bin/bash

# exit when any command fails
set -e

source ./dev-build/env.sh

# echo "-----------------------------------------------------------------------"
# echo "Rebuilding QuickModelView"
# echo "-----------------------------------------------------------------------"
cd ../../../QuickModelView

# echo "Cleaning up the QuickModelView"
# rm -rf node_modules
# nvm use $NEW_NODE_VERSION
# # cp package.json package.json.original
# # cp package-lock.json package-lock.json.original
# npm install
# nvm use $NODE_VERSION

source ../InvicaraAppFramework/packages/iaf-viewer/dev-build/copy-iafviewer-dist.sh .

# SOURCE_DIR="/Users/atul.kulkar/invicara/projects/InvicaraAppFramework/packages/iaf-viewer/dist"
# TARGET_DIR="/Users/atul.kulkar/invicara/projects/QuickModelView/node_modules/@dtplatform/iaf-viewer"

# echo "🔄 Removing existing dist folder from $TARGET_DIR"
# rm -rf "$TARGET_DIR/dist"

# echo "📁 Copying built dist from $SOURCE_DIR to $TARGET_DIR"
# cp -rf "$SOURCE_DIR" "$TARGET_DIR/"

# echo "✅ Copy complete."

# # Comment following lines if you don't want to use local iaf-viewer build
# # echo "Using local iaf-viewer package"
# # rm -rf ./node_modules/@dtplatform/iaf-viewer
# # npm link @dtplatform/iaf-viewer
# # Comment above lines if you don't want to use local iaf-viewer build

# # Comment following lines if you don't want to use local platform-api build
# # echo "Using local platform-api package"
# # rm -rf ./node_modules/@dtplatform/platform-api
# # npm link @dtplatform/platform-api
# # Comment above lines if you don't want to use local platform-api build

# # Comment following lines if you don't want to match up with iaf-viewer react versions
# echo "Using local iaf-viewer package"
# rm -rf ./node_modules/@dtplatform/iaf-viewer
# echo "Using local react package used by iaf-viewer"
# npm link ../InvicaraAppFramework/packages/iaf-viewer 
# # ../InvicaraAppFramework/packages/iaf-viewer/node_modules/react ../InvicaraAppFramework/packages/iaf-viewer/node_modules/react-dom ../InvicaraAppFramework/packages/iaf-viewer/node_modules/react-router-dom
# # Comment following lines if you don't want to match up with iaf-viewer react versions

# ls -lt node_modules/@dtplatform
# ls -lt node_modules/react
# ls -lt node_modules/react-dom
# ls -lt node_modules/react-router-dom

# nvm use $NEW_NODE_VERSION
# # npm run build-dev
# echo "Saving git ignored package.json.peer for incrmenetal build for node $NEW_NODE_VERSION"
# cp package.json package.json.peer
# cp package.json.original package.json
# cp package-lock.json package-lock.json.peer
# cp package-lock.json.original package-lock.json

echo "-----------------------------------------------------------------------"
echo "Launching QuickModelView"
echo "-----------------------------------------------------------------------"
export NODE_OPTIONS="--max-old-space-size=8192"
npm run watch

cd ../InvicaraAppFramework/packages/iaf-viewer