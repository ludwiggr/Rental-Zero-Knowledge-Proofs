#!/bin/bash

# Create build directory if it doesn't exist
mkdir -p build

# Compile income proof circuit
circom src/income_proof.circom --r1cs --wasm --sym -o build

# Compile credit score circuit
circom src/credit_score.circom --r1cs --wasm --sym -o build

# Generate proving keys
snarkjs groth16 setup build/income_proof.r1cs artifacts/pot12_final.ptau artifacts/income_proof.zkey
snarkjs groth16 setup build/credit_score.r1cs artifacts/pot12_final.ptau artifacts/credit_score.zkey

# Export verification keys
snarkjs zkey export verificationkey artifacts/income_proof.zkey artifacts/income_proof.vkey.json
snarkjs zkey export verificationkey artifacts/credit_score.zkey artifacts/credit_score.vkey.json 