#!/bin/bash

# Check if required tools are installed
if ! command -v circom &> /dev/null; then
    echo "Error: circom is not installed"
    exit 1
fi

if ! command -v snarkjs &> /dev/null; then
    echo "Error: snarkjs is not installed"
    exit 1
fi

# Create necessary directories
mkdir -p build artifacts

# Download powers of tau if not exists
if [ ! -f artifacts/pot12_final.ptau ]; then
    echo "Downloading powers of tau..."
    curl -L -o artifacts/pot12_final.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
fi

# Compile the circuit
echo "Compiling income proof circuit..."
circom src/income_proof.circom --r1cs --wasm --sym -o build

# Generate proving key
echo "Generating proving key..."
snarkjs groth16 setup build/income_proof.r1cs artifacts/pot12_final.ptau artifacts/income_proof.zkey

# Export verification key
echo "Exporting verification key..."
snarkjs zkey export verificationkey artifacts/income_proof.zkey artifacts/income_proof.vkey.json

echo "Compilation complete!"