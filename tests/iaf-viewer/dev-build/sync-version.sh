#!/bin/bash
set -e

# Script to sync version from iaf-viewer/package.json to GraphicsService/src/Information.ts
# Usage: ./sync-version.sh

# Get the script directory and resolve paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IAF_VIEWER_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKSPACE_ROOT="$(cd "$IAF_VIEWER_DIR/../../.." && pwd)"

PACKAGE_JSON="$IAF_VIEWER_DIR/package.json"
INFORMATION_TS="$WORKSPACE_ROOT/GraphicsService/src/Information.ts"

echo "=========================================="
echo "Sync Version Script"
echo "=========================================="
echo "Source (package.json): $PACKAGE_JSON"
echo "Target (Information.ts): $INFORMATION_TS"
echo ""

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON" ]; then
    echo "Error: package.json not found at $PACKAGE_JSON"
    exit 1
fi

# Check if Information.ts exists
if [ ! -f "$INFORMATION_TS" ]; then
    echo "Error: Information.ts not found at $INFORMATION_TS"
    exit 1
fi

# Extract version from package.json
# Try using jq first, fallback to grep/sed if jq is not available
if command -v jq &> /dev/null; then
    VERSION=$(jq -r '.version' "$PACKAGE_JSON")
else
    # Fallback: use grep and sed to extract version
    VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$PACKAGE_JSON" | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')
fi

if [ -z "$VERSION" ]; then
    echo "Error: Could not extract version from package.json"
    exit 1
fi

echo "Extracted version: $VERSION"
echo ""

# Get current version from Information.ts
CURRENT_VERSION=$(grep -o "const version: string = '[^']*';" "$INFORMATION_TS" | sed -E "s/const version: string = '([^']*)';/\1/" || echo "")

if [ -n "$CURRENT_VERSION" ]; then
    echo "Current version in Information.ts: $CURRENT_VERSION"
else
    echo "Warning: Could not find current version in Information.ts"
fi

# Update the version in Information.ts
# Use sed to replace the version string
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires empty string after -i
    sed -i '' "s/const version: string = '[^']*';/const version: string = '$VERSION';/" "$INFORMATION_TS"
else
    # Linux
    sed -i "s/const version: string = '[^']*';/const version: string = '$VERSION';/" "$INFORMATION_TS"
fi

# Verify the update
NEW_VERSION=$(grep -o "const version: string = '[^']*';" "$INFORMATION_TS" | sed -E "s/const version: string = '([^']*)';/\1/" || echo "")

if [ "$NEW_VERSION" = "$VERSION" ]; then
    echo ""
    echo "=========================================="
    echo "Version sync completed successfully!"
    echo "=========================================="
    echo "Updated version in Information.ts: $NEW_VERSION"
    echo ""
else
    echo ""
    echo "Error: Version update verification failed"
    echo "Expected: $VERSION"
    echo "Found: $NEW_VERSION"
    exit 1
fi

