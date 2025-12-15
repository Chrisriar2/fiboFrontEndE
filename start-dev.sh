#!/bin/bash

# Script to start the development server with Node.js 20
# Ensures the correct Node.js version is used

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Print versions
echo "Using Node.js $(node --version)"
echo "Using npm $(npm --version)"

# Start dev server
echo "Starting development server..."
npx vite --host