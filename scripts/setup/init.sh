#!/bin/bash

# Initialize the project
echo "Initializing Rental ZKP Project..."

# Create necessary directories
mkdir -p client/src/{components,pages,services,utils}
mkdir -p server/src/{controllers,models,routes,services,utils}
mkdir -p circuits/{src,build,artifacts}
mkdir -p docs/{api,circuits,setup,architecture,contributing,deployment}
mkdir -p test/{client,server,circuits}

# Install dependencies
echo "Installing dependencies..."
npm install
cd client && npm install
cd ../server && npm install
cd ../circuits && npm install
cd ..

# Create environment files
echo "Creating environment files..."
cp client/.env.example client/.env
cp server/.env.example server/.env

# Initialize git hooks
echo "Setting up git hooks..."
npx husky install

echo "Setup complete! 🎉" 