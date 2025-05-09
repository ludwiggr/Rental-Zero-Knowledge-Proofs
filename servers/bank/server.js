require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { groth16 } = require('snarkjs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const connectDB = require('../shared/config/database');
const { authenticate, errorHandler, logger } = require('../shared/middleware/security');
const { generateCreditScoreCircuit, issuerMetadata } = require('../shared/utils/circuitGenerator');
const Customer = require('./models/Customer');
const AttestationService = require('../shared/utils/attestationService');
const CircuitKeyManager = require('../shared/utils/circuitKeyManager');
const path = require('path');

const app = express();

// Security middleware
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Connect to database
connectDB();

// Initialize circuit key manager with secure storage
const circuitKeyManager = new CircuitKeyManager(
    path.join(__dirname, 'circuits'),
    path.join(__dirname, 'circuits/secure_storage')
);

// Generate and store circuit and verification key
let circuitAndKeys;
(async () => {
    try {
        // Generate circuit
        const { circuit, provingKey, verificationKey } = await generateCreditScoreCircuit();
        
        // Store keys securely
        await circuitKeyManager.storeCircuitKey('credit_score', provingKey, verificationKey);
        
        logger.info('Circuit and keys generated and stored securely');
    } catch (error) {
        logger.error('Error generating circuit and keys:', error);
        process.exit(1);
    }
})();

// Initialize services
const attestationService = new AttestationService(path.join(__dirname, 'keys', 'private.pem'));

// Validation middleware
const validateAttestationRequest = [
    body('customer_id').isString().notEmpty(),
    body('credit_score').optional().isInt({ min: 300, max: 850 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Endpoint to get public circuit, verification key, and issuer metadata
app.get('/public-info', (req, res) => {
    try {
        res.json({
            circuit: circuitAndKeys.circuit,
            verificationKey: circuitAndKeys.verificationKey,
            issuerMetadata: issuerMetadata.bank
        });
    } catch (error) {
        logger.error('Error fetching public info:', error);
        res.status(500).json({ error: 'Failed to fetch public info' });
    }
});

// Endpoint to create and sign credit score attestation
app.post('/attest-credit-score', authenticate, validateAttestationRequest, async (req, res) => {
    try {
        const { customer_id } = req.body;
        
        // Get credit score from banking system (simulated here)
        const credit_score = await getCreditScoreFromBank(customer_id);
        
        if (!credit_score) {
            return res.status(404).json({ error: 'Credit score not found for customer' });
        }

        // Create attestation with specified format
        const attestation = {
            customer_id,
            credit_score,
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
        };

        // Sign the attestation
        const signed_attestation_credit = crypto.sign(
            null,
            Buffer.from(JSON.stringify(attestation)),
            process.env.PRIVATE_KEY
        );

        // Store in database
        const customer = await Customer.findOneAndUpdate(
            { customerId: customer_id },
            {
                $push: {
                    attestations: {
                        ...attestation,
                        signature: signed_attestation_credit.toString('base64'),
                        created_at: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );

        logger.info(`Credit score attestation created for customer ${customer_id}`, {
            customer_id,
            attestation_id: customer.attestations[customer.attestations.length - 1]._id
        });

        res.json({
            signed_attestation_credit: signed_attestation_credit.toString('base64')
        });
    } catch (error) {
        logger.error('Error creating credit score attestation:', error);
        res.status(500).json({ error: 'Failed to create credit score attestation' });
    }
});

// Helper function to simulate getting credit score from banking system
async function getCreditScoreFromBank(customer_id) {
    // In a real system, this would query the banking database
    // For now, we'll return a simulated credit score
    return 750; // Example credit score
}

// Endpoint to verify an attestation
app.post('/verify-attestation', authenticate, [
    body('attestation').isObject(),
    body('signature').isString(),
    body('proof').optional().isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { attestation, signature, proof } = req.body;

        // Verify the signature
        const isValidSignature = crypto.verify(
            null,
            Buffer.from(JSON.stringify(attestation)),
            Buffer.from(signature, 'base64'),
            process.env.PRIVATE_KEY
        );

        // Verify the SNARK proof if provided
        let isValidProof = true;
        if (proof) {
            isValidProof = await groth16.verify(
                circuitAndKeys.verificationKey,
                proof.publicSignals,
                proof.proof
            );
        }

        // Verify attestation meets threshold
        const meetsThreshold = attestation.value >= issuerMetadata.bank.threshold;

        logger.info(`Attestation verification completed for ${attestation.customerId}`, {
            customerId: attestation.customerId,
            isValid: isValidSignature && isValidProof && meetsThreshold
        });

        res.json({
            isValid: isValidSignature && isValidProof && meetsThreshold,
            details: {
                signatureValid: isValidSignature,
                proofValid: isValidProof,
                meetsThreshold
            }
        });
    } catch (error) {
        logger.error('Error verifying attestation:', error);
        res.status(500).json({ error: 'Failed to verify attestation' });
    }
});

// Attestation signing endpoint
app.post('/api/attestations/sign', authenticate, [
    body('attestationData').isObject(),
    body('circuitName').isString(),
    body('proof').isObject(),
    body('publicInputs').isArray()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { attestationData, circuitName, proof, publicInputs } = req.body;

        // Verify the proof first
        const isProofValid = circuitKeyManager.verifyProof(circuitName, proof, publicInputs);
        if (!isProofValid) {
            return res.status(400).json({ error: 'Invalid proof' });
        }

        // Sign the attestation
        const signedAttestation = attestationService.signAttestation({
            ...attestationData,
            circuitName,
            proofHash: crypto.createHash('sha256').update(JSON.stringify(proof)).digest('hex')
        });

        logger.info('Attestation signed successfully', {
            circuitName,
            attestationId: signedAttestation.id
        });

        res.json(signedAttestation);
    } catch (error) {
        logger.error('Error signing attestation:', error);
        res.status(500).json({ error: 'Failed to sign attestation' });
    }
});

// Verify attestation endpoint
app.post('/api/attestations/verify', authenticate, [
    body('signedAttestation').isObject(),
    body('publicKey').isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { signedAttestation, publicKey } = req.body;
        
        const isValid = attestationService.verifyAttestation(signedAttestation, publicKey);
        
        logger.info('Attestation verification completed', {
            attestationId: signedAttestation.id,
            isValid
        });

        res.json({ isValid });
    } catch (error) {
        logger.error('Error verifying attestation:', error);
        res.status(500).json({ error: 'Failed to verify attestation' });
    }
});

// Update circuit endpoint to use secure key management
app.get('/circuit', (req, res) => {
    try {
        const verificationKey = circuitKeyManager.getVerificationKey('credit_score');
        res.json({
            circuit: path.join(__dirname, 'circuits/credit_score.circom'),
            verificationKey
        });
    } catch (error) {
        logger.error('Error retrieving circuit:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Apply error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    logger.info(`Bank server running on port ${PORT}`);
}); 