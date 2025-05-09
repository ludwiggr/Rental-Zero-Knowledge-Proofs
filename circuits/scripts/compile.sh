#!/bin/bash

# Create necessary directories
mkdir -p build
mkdir -p secure_storage

# Function to verify powers of tau file
verify_powers_of_tau() {
    local ptau_file=$1
    local expected_hash="YOUR_KNOWN_GOOD_HASH"  # Replace with actual hash from trusted source
    
    # Calculate SHA-256 hash of the file
    local file_hash=$(shasum -a 256 "$ptau_file" | cut -d' ' -f1)
    
    if [ "$file_hash" != "$expected_hash" ]; then
        echo "Error: Powers of tau file hash mismatch!"
        exit 1
    fi
}

# Download and verify powers of tau if not exists
if [ ! -f secure_storage/pot12_final.ptau ]; then
    echo "Downloading powers of tau..."
    curl -L -o secure_storage/pot12_0000.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
    
    # Verify the downloaded file
    verify_powers_of_tau secure_storage/pot12_0000.ptau
    
    # Move to final location
    mv secure_storage/pot12_0000.ptau secure_storage/pot12_final.ptau
fi

# Compile income proof circuit
echo "Compiling income proof circuit..."
circom src/income_proof.circom --r1cs --wasm --sym -o build

# Compile credit score circuit
echo "Compiling credit score circuit..."
circom src/credit_score.circom --r1cs --wasm --sym -o build

# Generate proving keys with secure entropy
echo "Generating proving keys..."
snarkjs groth16 setup build/income_proof.r1cs secure_storage/pot12_final.ptau secure_storage/income_proof.zkey
snarkjs groth16 setup build/credit_score.r1cs secure_storage/pot12_final.ptau secure_storage/credit_score.zkey

# Export verification keys
echo "Exporting verification keys..."
snarkjs zkey export verificationkey secure_storage/income_proof.zkey secure_storage/income_proof.vkey.json
snarkjs zkey export verificationkey secure_storage/credit_score.zkey secure_storage/credit_score.vkey.json

# Set secure permissions
chmod 600 secure_storage/*.zkey
chmod 600 secure_storage/*.vkey.json
chmod 600 secure_storage/*.ptau

echo "Compilation complete!" 