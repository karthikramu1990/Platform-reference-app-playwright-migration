if ! command -v git-lfs &> /dev/null; then
  echo "📥 Installing Git LFS..."
  brew install git-lfs
else
  echo "✅ Git LFS already installed."
fi

# Step 3: Initialize Git LFS
echo "🔧 Initializing Git LFS..."
git lfs install