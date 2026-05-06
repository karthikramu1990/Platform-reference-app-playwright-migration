# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 01-04-23    ATK        PLAT-2709   New UX UI Foundation Project
# 17-04-203                          npm link to react from iaf-viewer
# 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
# 12-Jan-23   RRP        PLAT-3940   Update dev friendly build scripts for 4.2
# 13-Jan-23   ATK        PLAT-3940   Be sure that ipa-core and PlatformReferenceApp is on React 17
# 13-Jan-23   ATK        PLAT-3940   Cleanup
# -------------------------------------------------------------------------------------

#!/bin/bash

# exit when any command fails
set -e

source ./dev-build/env.sh

# source ./dev-build/global.sh

source ./dev-build/clean.sh

source ./dev-build/platform-api.sh
# echo "Exiting abruptly"
# exit

source ./dev-build/iaf-viewer.sh

source ./dev-build/ref-app.sh

nvm use $CURRENT_NODE_VERSION
# unset NVM_DIR