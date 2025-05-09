const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class AttestationService {
    constructor(privateKeyPath) {
        this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    }

    /**
     * Sign an attestation with the server's private key
     * @param {Object} attestation - The attestation data to sign
     * @returns {Object} - The signed attestation with signature
     */
    signAttestation(attestation) {
        const attestationString = JSON.stringify(attestation);
        const signature = crypto.sign(
            'sha256',
            Buffer.from(attestationString),
            {
                key: this.privateKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            }
        );

        return {
            ...attestation,
            signature: signature.toString('base64'),
            timestamp: Date.now()
        };
    }

    /**
     * Verify a signed attestation
     * @param {Object} signedAttestation - The signed attestation to verify
     * @param {string} publicKey - The public key to verify against
     * @returns {boolean} - Whether the signature is valid
     */
    verifyAttestation(signedAttestation, publicKey) {
        const { signature, ...attestation } = signedAttestation;
        const attestationString = JSON.stringify(attestation);
        
        return crypto.verify(
            'sha256',
            Buffer.from(attestationString),
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            Buffer.from(signature, 'base64')
        );
    }
}

module.exports = AttestationService; 