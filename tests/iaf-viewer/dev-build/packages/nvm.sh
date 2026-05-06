#!/bin/bash

if command -v git-lfs &> /dev/null; then
  echo "✅ nvm already installed."
  exit 0
fi

# Step 1: Remove existing NVM files
echo "🧹 Removing existing NVM installation..."
rm -rf ~/.nvm

# Step 2: Remove NVM config lines from .zshrc
echo "🧽 Cleaning .zshrc..."
sed -i '' '/nvm/d' ~/.zshrc

# Step 3: Uninstall and reinstall via Homebrew
echo "📦 Reinstalling NVM via Homebrew..."
brew uninstall nvm || true
brew install nvm

# Step 4: Add NVM config to .zshrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"' >> ~/.zshrc
echo '[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"' >> ~/.zshrc

# Step 5: Source .zshrc (for current session)
source ~/.zshrc

# Step 6: Install specific Node versions using NVM
echo "📦 Installing Node.js versions using NVM..."
nvm install 10.16.2
nvm install 14.21.3
nvm install 16.20.2
nvm install 18.19.0

# Step 7: Confirm installation
if command -v nvm &> /dev/null; then
  echo "✅ NVM successfully reinstalled. Version: $(nvm --version)"
else
  echo "❌ NVM installation failed. Please check your shell configuration."
  exit 1
fi