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
const { generateIncomeCircuit, issuerMetadata } = require('../shared/utils/circuitGenerator');
const Employee = require('./models/Employee');
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

// Generate and store circuit and verification key
let circuitAndKeys;
(async () => {
    try {
        circuitAndKeys = await generateIncomeCircuit();
        logger.info('Circuit and keys generated successfully');
    } catch (error) {
        logger.error('Error generating circuit and keys:', error);
        process.exit(1);
    }
})();

// Initialize services
const attestationService = new AttestationService(path.join(__dirname, 'keys', 'private.pem'));
const circuitKeyManager = new CircuitKeyManager(path.join(__dirname, 'circuits'));

// Validation middleware
const validateAttestationRequest = [
    body('renter_id').isString().notEmpty(),
    body('income').optional().isNumeric().isFloat({ min: 0 }),
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
            issuerMetadata: issuerMetadata.employer
        });
    } catch (error) {
        logger.error('Error fetching public info:', error);
        res.status(500).json({ error: 'Failed to fetch public info' });
    }
});

// Endpoint to create and sign income attestation
app.post('/attest-income', authenticate, validateAttestationRequest, async (req, res) => {
    try {
        const { renter_id } = req.body;
        
        // Get income from HR system (simulated here)
        const renter_income = await getIncomeFromHR(renter_id);
        
        if (!renter_income) {
            return res.status(404).json({ error: 'Income not found for renter' });
        }

        // Create attestation with specified format
        const attestation = {
            renter_id,
            income: renter_income,
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
        };

        // Sign the attestation
        const signed_attestation_income = crypto.sign(
            null,
            Buffer.from(JSON.stringify(attestation)),
            process.env.PRIVATE_KEY
        );

        // Store in database
        const employee = await Employee.findOneAndUpdate(
            { employeeId: renter_id },
            {
                $push: {
                    attestations: {
                        ...attestation,
                        signature: signed_attestation_income.toString('base64'),
                        created_at: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );

        logger.info(`Income attestation created for renter ${renter_id}`, {
            renter_id,
            attestation_id: employee.attestations[employee.attestations.length - 1]._id
        });

        res.json({
            signed_attestation_income: signed_attestation_income.toString('base64')
        });
    } catch (error) {
        logger.error('Error creating income attestation:', error);
        res.status(500).json({ error: 'Failed to create income attestation' });
    }
});

// Helper function to simulate getting income from HR system
async function getIncomeFromHR(renter_id) {
    // In a real system, this would query the HR database
    // For now, we'll return a simulated income
    return 75000; // Example income
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
        const meetsThreshold = attestation.value >= issuerMetadata.employer.threshold;

        logger.info(`Attestation verification completed for ${attestation.employeeId}`, {
            employeeId: attestation.employeeId,
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

// Apply error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`Employer server running on port ${PORT}`);
}); 