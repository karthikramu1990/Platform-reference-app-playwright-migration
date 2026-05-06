#!/bin/bash

# Usage: ./copy-iaf-dist.sh /absolute/path/to/project

if [ -z "$1" ]; then
  echo "❌ Error: target_dir (project directory) not provided."
  echo "Usage: $0 /absolute/path/to/project"
  exit 1
fi

PROJECT_DIR="$1"
TARGET_DIR="$PROJECT_DIR/node_modules/@dtplatform/iaf-viewer"
SOURCE_DIR="../InvicaraAppFramework/packages/iaf-viewer/dist"

# Check if target exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "❌ Error: Target directory does not exist: $TARGET_DIR"
  exit 1
fi

echo "🔄 Removing existing dist from: $TARGET_DIR"
rm -rf "$TARGET_DIR/dist"

echo "📁 Copying dist from $SOURCE_DIR to $TARGET_DIR"
cp -rf "$SOURCE_DIR" "$TARGET_DIR/"

echo "✅ Copy complete."
