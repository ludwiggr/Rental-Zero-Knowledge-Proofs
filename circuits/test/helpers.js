const { groth16 } = require('snarkjs');
const fs = require('fs');
const path = require('path');

async function generateProof(circuitName, input) {
    const wasmPath = path.join(__dirname, '../build', `${circuitName}_js`, `${circuitName}.wasm`);
    const zkeyPath = path.join(__dirname, '../artifacts', `${circuitName}.zkey`);
    
    const { proof, publicSignals } = await groth16.fullProve(
        input,
        wasmPath,
        zkeyPath
    );
    
    return { proof, publicSignals };
}

async function verifyProof(circuitName, proof, publicSignals) {
    const vkeyPath = path.join(__dirname, '../artifacts', `${circuitName}.vkey.json`);
    const vkey = JSON.parse(fs.readFileSync(vkeyPath));
    
    const result = await groth16.verify(vkey, publicSignals, proof);
    return result;
}

module.exports = {
    generateProof,
    verifyProof
}; 