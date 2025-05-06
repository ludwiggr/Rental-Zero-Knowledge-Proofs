const snarkjs = require('snarkjs');
const path = require('path');

// Helper function to load circuit
const loadCircuit = async (circuitName) => {
  const circuitPath = path.join(__dirname, '..', 'circuits', circuitName);
  return {
    wasm: `${circuitPath}.wasm`,
    zkey: `${circuitPath}.zkey`
  };
};

// Helper function to generate proof
const generateProof = async (circuit, input) => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    circuit.wasm,
    circuit.zkey
  );
  return { proof, publicSignals };
};

// Helper function to verify proof
const verifyProof = async (circuit, proof, publicSignals) => {
  const verificationKey = await snarkjs.zKey.exportVerificationKey(circuit.zkey);
  return await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
};

module.exports = {
  loadCircuit,
  generateProof,
  verifyProof
}; 