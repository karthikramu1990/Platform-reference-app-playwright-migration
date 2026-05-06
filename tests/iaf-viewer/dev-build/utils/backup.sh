# Back up in temp directory before obfuscatig
WORK_DIR=$(mktemp -d)
echo "Backing up in " + $WORK_DIR
cp -rf . $WORK_DIR
