#!/bin/bash

#git clone https://github.com/mdrahbar21/chatApp.git
#cd chatApp
# Change directory to "frontend"
cd frontend

# Install nvm (if not installed already)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Either restart your terminal or add nvm to your shell profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Install Node.js version 16
nvm install 16

# Install Node.js dependencies
npm ci

# Build the frontend
npm run build

# Return to the previous directory
cd ..

# Download Go modules
go mod download

# Tidy up Go modules
go mod tidy

# Build the Go server
go build -o main ./cmd/server

# Run the server
./main

