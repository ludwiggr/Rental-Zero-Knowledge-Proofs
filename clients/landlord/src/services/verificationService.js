const snarkjs = require('snarkjs');
const axios = require('axios');

class VerificationService {
    constructor() {
        this.registryUrl = process.env.REGISTRY_URL;
        this.revocationRegistryUrl = process.env.REVOCATION_REGISTRY_URL;
    }

    async verifyProof(proof, verifyingKey, circuit) {
        try {
            const result = await snarkjs.groth16.verify(verifyingKey, proof.publicSignals, proof.proof);
            return result;
        } catch (error) {
            console.error('Proof verification failed:', error);
            return false;
        }
    }

    async checkExpiration(attestation) {
        const expirationDate = new Date(attestation.expires_at);
        const currentDate = new Date();
        return currentDate < expirationDate;
    }

    async checkRevocation(attestation) {
        try {
            const response = await axios.get(`${this.revocationRegistryUrl}/check`, {
                params: {
                    attestationId: attestation.id,
                    issuer: attestation.issuer
                }
            });
            return !response.data.isRevoked;
        } catch (error) {
            console.error('Revocation check failed:', error);
            return false;
        }
    }

    async verifyRentalApplication(application) {
        const { proof_income, proof_credit, attestation_metadata } = application;

        // Fetch verifying keys from registry
        const employerVerifyingKey = await this.fetchVerifyingKey(attestation_metadata.employer.verifying_key_url);
        const bankVerifyingKey = await this.fetchVerifyingKey(attestation_metadata.bank.verifying_key_url);

        // Verify proofs
        const isIncomeValid = await this.verifyProof(proof_income, employerVerifyingKey, 'income');
        const isCreditValid = await this.verifyProof(proof_credit, bankVerifyingKey, 'credit');

        // Check attestation expiration
        const isIncomeNotExpired = await this.checkExpiration(proof_income.attestation);
        const isCreditNotExpired = await this.checkExpiration(proof_credit.attestation);

        // Check attestation revocation
        const isIncomeNotRevoked = await this.checkRevocation(proof_income.attestation);
        const isCreditNotRevoked = await this.checkRevocation(proof_credit.attestation);

        // Combine all checks
        const isValid = isIncomeValid && 
                       isCreditValid && 
                       isIncomeNotExpired && 
                       isCreditNotExpired && 
                       isIncomeNotRevoked && 
                       isCreditNotRevoked;

        return {
            isValid,
            details: {
                income: {
                    proofValid: isIncomeValid,
                    notExpired: isIncomeNotExpired,
                    notRevoked: isIncomeNotRevoked
                },
                credit: {
                    proofValid: isCreditValid,
                    notExpired: isCreditNotExpired,
                    notRevoked: isCreditNotRevoked
                }
            }
        };
    }

    async fetchVerifyingKey(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch verifying key:', error);
            throw new Error('Failed to fetch verifying key');
        }
    }
}

module.exports = new VerificationService(); 