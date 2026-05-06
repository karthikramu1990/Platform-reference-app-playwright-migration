# -------------------------------------------------------------------------------------
# Date        Author     Reference    Comments
# Created     ATK                    Creates backup of iaf-viewer excluding node_modules
# -------------------------------------------------------------------------------------

#!/bin/bash
set -e

# Check if feature argument is provided
if [ -z "$1" ]; then
    echo "Error: Feature argument is required!"
    echo ""
    echo "Usage: $0 <feature>"
    echo "Example: $0 authentication"
    echo "Example: $0 refactor"
    echo ""
    echo "This will create a backup in: ~/invicara/backups/iaf-viewer-<feature>-<date>"
    exit 1
fi

# Parse required feature argument
FEATURE="$1"

# Get the iaf-viewer directory (parent of dev-build)
IAF_VIEWER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_BASE_DIR="$HOME/invicara/backups"

# Generate date string in format YYYY-MM-DD-HHMMSS
DATE_STRING=$(date +"%Y-%m-%d-%H%M%S")

# Construct backup directory name with feature
BACKUP_DIR="$BACKUP_BASE_DIR/iaf-viewer-$FEATURE-$DATE_STRING"

echo "=========================================="
echo "iaf-viewer Backup Script"
echo "=========================================="
echo "Source: $IAF_VIEWER_DIR"
echo "Destination: $BACKUP_DIR"
echo "Feature: $FEATURE"
echo ""

# Create backup base directory if it doesn't exist
mkdir -p "$BACKUP_BASE_DIR"

# Check if source directory exists
if [ ! -d "$IAF_VIEWER_DIR" ]; then
    echo "Error: Source directory does not exist: $IAF_VIEWER_DIR"
    exit 1
fi

# Create backup directory
echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Use rsync to copy files, excluding only node_modules as requested
echo "Copying files (excluding node_modules)..."
rsync -av \
    --exclude='node_modules' \
    "$IAF_VIEWER_DIR/" "$BACKUP_DIR/"

# Calculate backup size
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

echo ""
echo "=========================================="
echo "Backup completed successfully!"
echo "=========================================="
echo "Backup location: $BACKUP_DIR"
echo "Backup size: $BACKUP_SIZE"
echo "Date: $(date)"
echo ""

