#!/bin/bash

set -e

# === CONFIG ===
INCOME_CIRCUIT_SRC="./servers/employer/circuits/src/income_proof.circom"
INCOME_OUTPUT_DIR="./servers/employer/circuits"
INCOME_INPUT_JSON="./servers/employer/circuits/input.json"

CREDIT_CIRCUIT_SRC="./servers/bank/circuits/src/credit_proof.circom"
CREDIT_OUTPUT_DIR="./servers/bank/circuits"
CREDIT_INPUT_JSON="./servers/bank/circuits/input.json"

PTAU_FILE="./pot15.ptau"

# === CHECK REQUIRED FILES AND DIRECTORIES ===
echo "🔍 Checking required files and directories..."

# Check Powers of Tau file
if [ ! -f "$PTAU_FILE" ]; then
    echo "❌ Error: Powers of Tau file ($PTAU_FILE) not found!"
    echo "Please generate or download pot15.ptau and place it in the project root."
    exit 1
fi
echo "✅ Found $PTAU_FILE"

# Check circuit source files
if [ ! -f "$INCOME_CIRCUIT_SRC" ]; then
    echo "❌ Error: Income circuit source file ($INCOME_CIRCUIT_SRC) not found!"
    exit 1
fi
echo "✅ Found income circuit source"

if [ ! -f "$CREDIT_CIRCUIT_SRC" ]; then
    echo "❌ Error: Credit circuit source file ($CREDIT_CIRCUIT_SRC) not found!"
    exit 1
fi
echo "✅ Found credit circuit source"

# Create output directories if they don't exist
mkdir -p "$INCOME_OUTPUT_DIR"
mkdir -p "$CREDIT_OUTPUT_DIR"
echo "✅ Created output directories"

# Check input JSON files
if [ ! -f "$INCOME_INPUT_JSON" ]; then
    echo "❌ Error: Income circuit input file ($INCOME_INPUT_JSON) not found!"
    exit 1
fi
echo "✅ Found income circuit input file"

if [ ! -f "$CREDIT_INPUT_JSON" ]; then
    echo "❌ Error: Credit circuit input file ($CREDIT_INPUT_JSON) not found!"
    exit 1
fi
echo "✅ Found credit circuit input file"

# === BUILD INCOME CIRCUIT ===
echo "🚀 Compiling IncomeProof circuit..."
circom "$INCOME_CIRCUIT_SRC" --r1cs --wasm --sym -o "$INCOME_OUTPUT_DIR" -l ./node_modules

echo "⚙️  Setting up IncomeProof..."
snarkjs groth16 setup "$INCOME_OUTPUT_DIR/income_proof.r1cs" "$PTAU_FILE" "$INCOME_OUTPUT_DIR/circuit_final.zkey"
snarkjs zkey export verificationkey "$INCOME_OUTPUT_DIR/circuit_final.zkey" "$INCOME_OUTPUT_DIR/verification_key.json"

echo "⚙️  Calculating witness for IncomeProof..."
node "$INCOME_OUTPUT_DIR/income_proof_js/generate_witness.js" \
    "$INCOME_OUTPUT_DIR/income_proof_js/income_proof.wasm" \
    "$INCOME_INPUT_JSON" \
    "$INCOME_OUTPUT_DIR/witness.wtns"

echo "⚙️  Generating proof for IncomeProof..."
snarkjs groth16 prove "$INCOME_OUTPUT_DIR/circuit_final.zkey" "$INCOME_OUTPUT_DIR/witness.wtns" \
    "$INCOME_OUTPUT_DIR/proof.json" "$INCOME_OUTPUT_DIR/public.json"

echo "🔍 Verifying proof for IncomeProof..."
snarkjs groth16 verify "$INCOME_OUTPUT_DIR/verification_key.json" "$INCOME_OUTPUT_DIR/public.json" "$INCOME_OUTPUT_DIR/proof.json"

echo "✅ IncomeProof completed."

# === BUILD CREDIT CIRCUIT ===
echo "🚀 Compiling CreditProof circuit..."
circom "$CREDIT_CIRCUIT_SRC" --r1cs --wasm --sym -o "$CREDIT_OUTPUT_DIR" -l ./node_modules

echo "⚙️  Setting up CreditProof..."
snarkjs groth16 setup "$CREDIT_OUTPUT_DIR/credit_proof.r1cs" "$PTAU_FILE" "$CREDIT_OUTPUT_DIR/circuit_final.zkey"
snarkjs zkey export verificationkey "$CREDIT_OUTPUT_DIR/circuit_final.zkey" "$CREDIT_OUTPUT_DIR/verification_key.json"

echo "⚙️  Calculating witness for CreditProof..."
node "$CREDIT_OUTPUT_DIR/credit_proof_js/generate_witness.js" \
    "$CREDIT_OUTPUT_DIR/credit_proof_js/credit_proof.wasm" \
    "$CREDIT_INPUT_JSON" \
    "$CREDIT_OUTPUT_DIR/witness.wtns"

echo "⚙️  Generating proof for CreditProof..."
snarkjs groth16 prove "$CREDIT_OUTPUT_DIR/circuit_final.zkey" "$CREDIT_OUTPUT_DIR/witness.wtns" \
    "$CREDIT_OUTPUT_DIR/proof.json" "$CREDIT_OUTPUT_DIR/public.json"

echo "🔍 Verifying proof for CreditProof..."
snarkjs groth16 verify "$CREDIT_OUTPUT_DIR/verification_key.json" "$CREDIT_OUTPUT_DIR/public.json" "$CREDIT_OUTPUT_DIR/proof.json"

echo "✅ CreditProof completed."

echo "🎉 All circuits compiled, setup, proofed and verified!"
