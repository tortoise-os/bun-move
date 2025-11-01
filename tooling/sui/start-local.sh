#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐢 TortoiseOS - Local Sui Network Starter${NC}"
echo ""

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo -e "${YELLOW}⚠️  Sui CLI not found. Installing...${NC}"
    echo ""
    echo "This will install Sui CLI using Cargo. Make sure you have Rust installed."
    echo "Visit https://rustup.rs/ if you need to install Rust first."
    echo ""
    read -p "Continue with installation? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
    else
        echo -e "${RED}❌ Installation cancelled${NC}"
        exit 1
    fi
fi

# Check sui version
echo -e "${GREEN}✓ Found Sui CLI:${NC}"
sui --version
echo ""

# Check if a sui network is already running
if lsof -Pi :9000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 9000 is already in use${NC}"
    echo "A Sui network may already be running."
    echo ""
    read -p "Do you want to stop it and start fresh? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Kill process on port 9000
        kill $(lsof -t -i:9000) 2>/dev/null || true
        sleep 2
    else
        echo -e "${GREEN}✓ Using existing Sui network on port 9000${NC}"
        exit 0
    fi
fi

# Clean up old Sui config if requested
if [ -d "$HOME/.sui/sui_config" ]; then
    echo ""
    echo -e "${YELLOW}Found existing Sui configuration${NC}"
    read -p "Start with a fresh network state? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Backing up old config..."
        mv "$HOME/.sui/sui_config" "$HOME/.sui/sui_config.backup.$(date +%s)"
    fi
fi

echo ""
echo -e "${GREEN}🚀 Starting Sui Local Network...${NC}"
echo ""
echo "Configuration:"
echo "  - RPC URL: http://localhost:9000"
echo "  - Faucet URL: http://localhost:9123"
echo "  - Epoch Duration: 60000ms (1 minute)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the network${NC}"
echo ""

# Start Sui local network with faucet
sui start --with-faucet --epoch-duration-ms 60000
