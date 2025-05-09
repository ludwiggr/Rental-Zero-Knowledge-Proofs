const express = require('express');
const { groth16 } = require('snarkjs');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

const app = express();
app.use(express.json());
app.use(cors());

// Store attestations and proofs
let attestations = {
    income: null,
    creditScore: null
};

let proofs = {
    income: null,
    creditScore: null
};

// Fetch public circuit and verification key from employer
async function fetchEmployerPublicInfo() {
    try {
        const response = await axios.get('http://localhost:3001/public-info');
        return response.data;
    } catch (error) {
        logger.error('Error fetching employer public info:', error);
        throw error;
    }
}

// Fetch public circuit and verification key from bank
async function fetchBankPublicInfo() {
    try {
        const response = await axios.get('http://localhost:3002/public-info');
        return response.data;
    } catch (error) {
        logger.error('Error fetching bank public info:', error);
        throw error;
    }
}

// Generate income proof
async function generateIncomeProof(attestation, signature) {
    try {
        const employerInfo = await fetchEmployerPublicInfo();
        
        // Verify signature
        const isValidSignature = crypto.verify(
            null,
            Buffer.from(JSON.stringify(attestation)),
            Buffer.from(signature, 'base64'),
            employerInfo.verificationKey
        );

        if (!isValidSignature) {
            throw new Error('Invalid income attestation signature');
        }

        // Generate proof
        const { proof, publicSignals } = await groth16.fullProve(
            {
                income: attestation.value,
                threshold: employerInfo.issuerMetadata.threshold
            },
            employerInfo.circuit,
            employerInfo.verificationKey
        );

        return { proof, publicSignals };
    } catch (error) {
        logger.error('Error generating income proof:', error);
        throw error;
    }
}

// Generate credit score proof
async function generateCreditScoreProof(attestation, signature) {
    try {
        const bankInfo = await fetchBankPublicInfo();
        
        // Verify signature
        const isValidSignature = crypto.verify(
            null,
            Buffer.from(JSON.stringify(attestation)),
            Buffer.from(signature, 'base64'),
            bankInfo.verificationKey
        );

        if (!isValidSignature) {
            throw new Error('Invalid credit score attestation signature');
        }

        // Generate proof
        const { proof, publicSignals } = await groth16.fullProve(
            {
                creditScore: attestation.value,
                threshold: bankInfo.issuerMetadata.threshold
            },
            bankInfo.circuit,
            bankInfo.verificationKey
        );

        return { proof, publicSignals };
    } catch (error) {
        logger.error('Error generating credit score proof:', error);
        throw error;
    }
}

// Endpoint to store income attestation
app.post('/store-income-attestation', async (req, res) => {
    try {
        const { attestation, signature } = req.body;
        
        // Store attestation
        attestations.income = { attestation, signature };
        
        // Generate proof
        const proof = await generateIncomeProof(attestation, signature);
        proofs.income = proof;

        res.json({ message: 'Income attestation stored and proof generated' });
    } catch (error) {
        logger.error('Error storing income attestation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to store credit score attestation
app.post('/store-credit-score-attestation', async (req, res) => {
    try {
        const { attestation, signature } = req.body;
        
        // Store attestation
        attestations.creditScore = { attestation, signature };
        
        // Generate proof
        const proof = await generateCreditScoreProof(attestation, signature);
        proofs.creditScore = proof;

        res.json({ message: 'Credit score attestation stored and proof generated' });
    } catch (error) {
        logger.error('Error storing credit score attestation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get all proofs
app.get('/proofs', (req, res) => {
    try {
        if (!proofs.income || !proofs.creditScore) {
            return res.status(400).json({ error: 'Not all proofs are available yet' });
        }

        res.json({
            incomeProof: proofs.income,
            creditScoreProof: proofs.creditScore
        });
    } catch (error) {
        logger.error('Error getting proofs:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    logger.info(`Renter client running on port ${PORT}`);
}); 