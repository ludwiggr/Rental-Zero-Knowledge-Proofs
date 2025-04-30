import { groth16 } from 'snarkjs';
import path from 'path';
import fs from 'fs';

// Helper function to load circuit artifacts
export const loadCircuit = async (circuitName) => {
  const circuitPath = path.join(process.cwd(), 'circuits', 'circuits', circuitName);
  return {
    wasm: `${circuitPath}.wasm`,
    zkey: `${circuitPath}.zkey`,
    vkey: `${circuitPath}.vkey.json`
  };
};

// Helper function to generate proof
export const generateProof = async (circuit, input) => {
  const { proof, publicSignals } = await groth16.fullProve(
    input,
    circuit.wasm,
    circuit.zkey
  );
  return { proof, publicSignals };
};

// Helper function to verify proof
export const verifyProof = async (circuit, proof, publicSignals) => {
  const vkey = JSON.parse(fs.readFileSync(circuit.vkey));
  return await groth16.verify(vkey, publicSignals, proof);
};

// Helper function to convert number to field element
export const toFieldElement = (num) => {
  return BigInt(num).toString();
};

// Helper function to check if proof is valid
export const isValidProof = async (circuit, input) => {
  try {
    const { proof, publicSignals } = await generateProof(circuit, input);
    return await verifyProof(circuit, proof, publicSignals);
  } catch (error) {
    return false;
  }
}; 