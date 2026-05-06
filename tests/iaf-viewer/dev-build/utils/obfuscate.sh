# # Setup javascript-obfuscator
# npm install --save-dev javascript-obfuscator
# npm link javascript-obfuscator

# # install rename on mac
# brew install rename

# Back up in temp directory before obfuscatig
source ./backup.sh

# generate -obfuscated.js files on .js
javascript-obfuscator .

# find remove .js from obfuscated files
find . -type f -name "*obfuscated*" -exec rename 's/\.js$//' {} \;

# delete *.js files
find . -type f -name "*.js" -delete

# rename obfuscated files
find . -type f -name "*obfuscated*" -exec rename 's/$/.js/' {} \;

# rename obfuscated files by removing the pattern "obfuscated"
find . -type f -name "*-obfuscated*" -exec rename 's/-obfuscated//' {} \;

rm -f ./obfuscate.sh