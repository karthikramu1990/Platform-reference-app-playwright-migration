# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 06-Sep-24   ATK                    Created
# -------------------------------------------------------------------------------------

#!/bin/bash

# exit when any command fails
set -e

source ./dev-build/env.sh

source ./dev-build/global.sh

source ./dev-build/clean.sh

source ./dev-build/iaf-viewer.sh

source ./dev-build/quick-model-view.sh

nvm use $CURRENT_NODE_VERSION
# unset NVM_DIR