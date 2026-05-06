# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 23-Oct-24   ATK                    Created
# -------------------------------------------------------------------------------------

#!/bin/bash

# Check if the file path argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-large-files>"
  exit 1
fi

# Get the file path from the argument
FILE_PATH="$1"

# Step 1: Track the large files with Git LFS
git lfs track "$FILE_PATH"

# Step 2: Commit the changes to track the files
git commit -m "Track large files with LFS"

# Step 3: Add the large files to the staging area
git add "$FILE_PATH"

# Step 4: Commit the addition of large files
git commit -m "Add large files to the repository"

# Step 5: Push the changes to the current branch
CURRENT_BRANCH=$(git branch --show-current)
git push origin "$CURRENT_BRANCH"
