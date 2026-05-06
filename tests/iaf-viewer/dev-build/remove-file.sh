# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 28-Aug-24   ATK                    Created
# -------------------------------------------------------------------------------------

#!/bin/bash

# Check if the user provided a file path
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 /path/to/your/file.txt"
    exit 1
fi

# Define the file path from the input argument
FILE_PATH="$1"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
    # Remove the file
    rm "$FILE_PATH"
    echo "File removed: $FILE_PATH"
else
    # File does not exist, do nothing
    echo "File does not exist: $FILE_PATH"
fi
