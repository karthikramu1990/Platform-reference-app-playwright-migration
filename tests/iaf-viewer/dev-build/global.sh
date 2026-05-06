# -------------------------------------------------------------------------------------
# Date        Author     Referene    Comments
# 01-04-23    ATK        PLAT-2709   New UX UI Foundation Project
# 17-04-203                          npm link to react from iaf-viewer
# 22-Oct-23   ATK        PLAT-2414   Performance - CSDL - On Demand
# 12-Jan-23   RRP        PLAT-3940   Update dev friendly build scripts for 4.2
# 13-Jan-23   ATK        PLAT-3940   Be sure that ipa-core and ipa-dt is on React 17
# 13-Jan-23   ATK        PLAT-3940   Cleanup
# -------------------------------------------------------------------------------------

echo "-----------------------------------------------------------------------"
echo "Installing global dependencies"
echo "-----------------------------------------------------------------------"
#!/bin/bash

echo "🔧 Setting up development environment on macOS..."

# Step 1: Install Homebrew if not already installed
if ! command -v brew &>/dev/null; then
  echo "🍺 Homebrew not found. Installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "✅ Homebrew already installed."
fi

# Step 2: Install Git
if ! command -v git &>/dev/null; then
  echo "📦 Installing Git..."
  brew install git
else
  echo "✅ Git already installed."
fi

# Step 3: Install Watchman
if ! command -v watchman &>/dev/null; then
  echo "📦 Installing Watchman..."
  brew install watchman
else
  echo "✅ Watchman already installed."
fi

# Step 4: Install NVM
source ./dev-build/packages/nvm.sh

# Step 8: Install React dependencies (non-React app use)
if [ ! -d "node_modules/react" ]; then
  echo "📦 Installing React dependencies..."
  npm install react react-dom react-is --save
else
  echo "✅ React dependencies already installed."
fi

source ./dev-bulid/packages/lfs.sh

echo "🎉 Development environment setup complete!"