#!/bin/bash

# Define color codes
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to print error messages in red
echo_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# Function to print warning messages in yellow
echo_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Function to print success messages in green
echo_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}
