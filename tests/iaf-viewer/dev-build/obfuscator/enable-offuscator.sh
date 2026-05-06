# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# -------------------------------------------------------------------------------------

#!/bin/bash

# exit when any command fails
set -e

export OBF_SCRIPTS_DIR="../../../GraphicsService/obfuscator/scripts"

echo "-----------------------------------------------------------------------"
echo "Copying obfuscator scripts..."
mkdir -p obfuscator
cp -rf $OBF_SCRIPTS_DIR ./dev-build/obfuscator/.

echo "Installing javascript-obfuscator"
npm install javascript-obfuscator@~4.1.1 --save-dev
