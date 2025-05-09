#!/bin/bash

# Set the URL for the Powers of Tau file
PTAU_URL="https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau"
PTAU_FILE="pot15.ptau"

# Check if the file already exists
if [ -f "$PTAU_FILE" ]; then
    echo "✅ Powers of Tau file already exists"
    exit 0
fi

# Download the file
echo "📥 Downloading Powers of Tau file..."
curl -L -o "$PTAU_FILE" "$PTAU_URL"

# Verify the file was downloaded
if [ -f "$PTAU_FILE" ]; then
    echo "✅ Powers of Tau file downloaded successfully"
else
    echo "❌ Failed to download Powers of Tau file"
    exit 1
fi 