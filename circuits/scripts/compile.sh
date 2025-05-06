#!/bin/bash

# Create necessary directories
mkdir -p build artifacts

# Compile circuits
circom src/income_proof.circom --r1cs --wasm --sym -o build
circom src/rental_history.circom --r1cs --wasm --sym -o build
circom src/credit_score.circom --r1cs --wasm --sym -o build

# Generate proving and verification keys
snarkjs groth16 setup build/income_proof.r1cs artifacts/pot12_final.ptau artifacts/income_proof.zkey
snarkjs groth16 setup build/rental_history.r1cs artifacts/pot12_final.ptau artifacts/rental_history.zkey
snarkjs groth16 setup build/credit_score.r1cs artifacts/pot12_final.ptau artifacts/credit_score.zkey

# Export verification keys
snarkjs zkey export verificationkey artifacts/income_proof.zkey artifacts/income_proof.vkey.json
snarkjs zkey export verificationkey artifacts/rental_history.zkey artifacts/rental_history.vkey.json
snarkjs zkey export verificationkey artifacts/credit_score.zkey artifacts/credit_score.vkey.json 