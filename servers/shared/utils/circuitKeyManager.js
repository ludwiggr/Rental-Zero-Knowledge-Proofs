const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class CircuitKeyManager {
    constructor(circuitsDir, secureStoragePath) {
        this.circuitsDir = circuitsDir;
        this.secureStoragePath = secureStoragePath;
        this.circuitKeys = new Map();
        this.verificationKeys = new Map();
        
        // Create secure storage directory if it doesn't exist
        if (!fs.existsSync(this.secureStoragePath)) {
            fs.mkdirSync(this.secureStoragePath, { recursive: true, mode: 0o700 });
        }
        
        this.loadCircuitKeys();
    }

    /**
     * Load all circuit keys from the secure storage
     */
    loadCircuitKeys() {
        const circuitFiles = fs.readdirSync(this.secureStoragePath);
        
        for (const file of circuitFiles) {
            if (file.endsWith('.zkey')) {
                const circuitName = path.basename(file, '.zkey');
                const zkeyPath = path.join(this.secureStoragePath, file);
                const vkeyPath = path.join(this.secureStoragePath, `${circuitName}.vkey.json`);
                
                if (fs.existsSync(vkeyPath)) {
                    const vkeyData = JSON.parse(fs.readFileSync(vkeyPath, 'utf8'));
                    this.verificationKeys.set(circuitName, vkeyData);
                }
                
                // Store zkey path for later use
                this.circuitKeys.set(circuitName, zkeyPath);
            }
        }
    }

    /**
     * Store a new circuit key securely
     * @param {string} circuitName - The name of the circuit
     * @param {Buffer} zkeyData - The zkey file data
     * @param {Object} vkeyData - The verification key data
     */
    async storeCircuitKey(circuitName, zkeyData, vkeyData) {
        const zkeyPath = path.join(this.secureStoragePath, `${circuitName}.zkey`);
        const vkeyPath = path.join(this.secureStoragePath, `${circuitName}.vkey.json`);
        
        // Write files with restricted permissions
        fs.writeFileSync(zkeyPath, zkeyData, { mode: 0o600 });
        fs.writeFileSync(vkeyPath, JSON.stringify(vkeyData), { mode: 0o600 });
        
        // Update in-memory cache
        this.circuitKeys.set(circuitName, zkeyPath);
        this.verificationKeys.set(circuitName, vkeyData);
    }

    /**
     * Get the path to a circuit's proving key
     * @param {string} circuitName - The name of the circuit
     * @returns {string} - The path to the proving key
     */
    getProvingKeyPath(circuitName) {
        const keyPath = this.circuitKeys.get(circuitName);
        if (!keyPath) {
            throw new Error(`No proving key found for circuit: ${circuitName}`);
        }
        return keyPath;
    }

    /**
     * Get a circuit's verification key
     * @param {string} circuitName - The name of the circuit
     * @returns {Object} - The verification key
     */
    getVerificationKey(circuitName) {
        const vkey = this.verificationKeys.get(circuitName);
        if (!vkey) {
            throw new Error(`No verification key found for circuit: ${circuitName}`);
        }
        return vkey;
    }

    /**
     * Verify a proof against a circuit's verification key
     * @param {string} circuitName - The name of the circuit
     * @param {Object} proof - The proof to verify
     * @param {Object} publicInputs - The public inputs for verification
     * @returns {boolean} - Whether the proof is valid
     */
    verifyProof(circuitName, proof, publicInputs) {
        const verificationKey = this.getVerificationKey(circuitName);
        if (!verificationKey) {
            throw new Error(`No verification key found for circuit: ${circuitName}`);
        }

        try {
            // TODO: Implement actual proof verification using your ZK library
            return true;
        } catch (error) {
            console.error(`Proof verification failed for circuit ${circuitName}:`, error);
            return false;
        }
    }

    /**
     * Verify the integrity of a powers of tau file
     * @param {string} ptauPath - Path to the ptau file
     * @returns {boolean} - Whether the file is valid
     */
    verifyPowersOfTau(ptauPath) {
        try {
            // Read the file
            const ptauData = fs.readFileSync(ptauPath);
            
            // Calculate SHA-256 hash
            const hash = crypto.createHash('sha256').update(ptauData).digest('hex');
            
            // TODO: Compare with known good hash from trusted source
            // This should be implemented with a list of known good hashes
            return true;
        } catch (error) {
            console.error('Error verifying powers of tau file:', error);
            return false;
        }
    }
}

module.exports = CircuitKeyManager; 