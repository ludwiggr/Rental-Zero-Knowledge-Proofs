#!/bin/bash

# Create necessary directories
mkdir -p build artifacts

# Download powers of tau if not exists
if [ ! -f artifacts/pot12_final.ptau ]; then
    echo "Downloading powers of tau..."
    curl -L -o artifacts/pot12_0000.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
    mv artifacts/pot12_0000.ptau artifacts/pot12_final.ptau
fi

# Compile the circuit
echo "Compiling credit score circuit..."
circom src/credit_score.circom --r1cs --wasm --sym -o build

# Generate proving key
echo "Generating proving key..."
snarkjs groth16 setup build/credit_score.r1cs artifacts/pot12_final.ptau artifacts/credit_score.zkey

# Export verification key
echo "Exporting verification key..."
snarkjs zkey export verificationkey artifacts/credit_score.zkey artifacts/credit_score.vkey.json

echo "Compilation complete!" 