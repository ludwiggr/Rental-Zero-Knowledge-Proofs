#!/bin/bash

set -e

echo "🔍 Prüfe pot15.ptau..."

if [ -f "pot15.ptau" ]; then
    echo "✅ pot15.ptau existiert bereits."
else
    echo "⚙️  Erstelle pot15.ptau lokal..."

    snarkjs powersoftau new bn128 15 pot15_0000.ptau -v
    snarkjs powersoftau contribute pot15_0000.ptau pot15_0001.ptau --name="First contribution" -v
    snarkjs powersoftau prepare phase2 pot15_0001.ptau pot15_final.ptau -v
    mv pot15_final.ptau pot15.ptau

    echo "✅ pot15.ptau wurde erfolgreich erzeugt."
fi

echo "⚙️  Starte Groth16 Setup..."
snarkjs groth16 setup circuit.r1cs pot15.ptau circuit_final.zkey

echo "⚙️  Exportiere Verification Key..."
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

echo "🎉 Fertig! Setup und Verification Key sind erstellt."
