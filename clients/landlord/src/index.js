const express = require('express');
const { groth16 } = require('snarkjs');
const cors = require('cors');
const axios = require('axios');
const winston = require('winston');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

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

// Store verification keys and metadata
let verificationKeys = {
    employer: null,
    bank: null
};

let issuerMetadata = {
    employer: null,
    bank: null
};

// Fetch verification keys and metadata from servers
async function fetchVerificationKeys() {
    try {
        // Fetch employer verification key and metadata
        const employerResponse = await axios.get('http://localhost:3001/public-info');
        verificationKeys.employer = employerResponse.data.verificationKey;
        issuerMetadata.employer = employerResponse.data.metadata;

        // Fetch bank verification key and metadata
        const bankResponse = await axios.get('http://localhost:3002/public-info');
        verificationKeys.bank = bankResponse.data.verificationKey;
        issuerMetadata.bank = bankResponse.data.metadata;

        logger.info('Verification keys and metadata fetched successfully');
    } catch (error) {
        logger.error('Error fetching verification keys and metadata:', error);
        throw error;
    }
}

// Verify income proof
async function verifyIncomeProof(proof, publicSignals) {
    try {
        if (!verificationKeys.employer) {
            await fetchVerificationKeys();
        }

        const isValid = await groth16.verify(
            verificationKeys.employer,
            publicSignals,
            proof
        );

        return isValid;
    } catch (error) {
        logger.error('Error verifying income proof:', error);
        throw error;
    }
}

// Verify credit score proof
async function verifyCreditScoreProof(proof, publicSignals) {
    try {
        if (!verificationKeys.bank) {
            await fetchVerificationKeys();
        }

        const isValid = await groth16.verify(
            verificationKeys.bank,
            publicSignals,
            proof
        );

        return isValid;
    } catch (error) {
        logger.error('Error verifying credit score proof:', error);
        throw error;
    }
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Connected to MongoDB');
}).catch((error) => {
    logger.error('MongoDB connection error:', error);
});

// Define Rental Application Schema
const rentalApplicationSchema = new mongoose.Schema({
    renterId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    incomeProofValid: { type: Boolean, required: true },
    creditScoreProofValid: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const RentalApplication = mongoose.model('RentalApplication', rentalApplicationSchema);

// Email notification setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Handle rental approval/rejection
async function handleRentalApplication(renterId, isApproved, incomeProofValid, creditScoreProofValid) {
    try {
        // Update database
        const application = await RentalApplication.findOneAndUpdate(
            { renterId },
            {
                status: isApproved ? 'approved' : 'rejected',
                incomeProofValid,
                creditScoreProofValid,
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Send notification email
        const emailSubject = isApproved ? 'Rental Application Approved' : 'Rental Application Rejected';
        const emailBody = isApproved
            ? `Dear Renter,\n\nYour rental application has been approved. We look forward to having you as a tenant.\n\nBest regards,\nLandlord Team`
            : `Dear Renter,\n\nWe regret to inform you that your rental application has been rejected.\n\nBest regards,\nLandlord Team`;

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'landlord@example.com',
            to: `${renterId}@example.com`, // In a real application, you would fetch the actual email from user data
            subject: emailSubject,
            text: emailBody
        });

        logger.info(`Rental application ${isApproved ? 'approved' : 'rejected'} for renter ${renterId}`);
        
        return {
            success: true,
            message: `Rental application ${isApproved ? 'approved' : 'rejected'} successfully`,
            applicationId: application._id
        };
    } catch (error) {
        logger.error('Error handling rental application:', error);
        throw error;
    }
}

// Endpoint to verify proofs and handle rental application
app.post('/verify-proofs', async (req, res) => {
    try {
        const { renterId, incomeProof, creditScoreProof } = req.body;

        if (!renterId || !incomeProof || !creditScoreProof) {
            return res.status(400).json({ error: 'Renter ID and both proofs are required' });
        }

        // Verify income proof
        const isIncomeValid = await verifyIncomeProof(
            incomeProof.proof,
            incomeProof.publicSignals
        );

        // Verify credit score proof
        const isCreditScoreValid = await verifyCreditScoreProof(
            creditScoreProof.proof,
            creditScoreProof.publicSignals
        );

        // Check if both proofs are valid
        const isValid = isIncomeValid && isCreditScoreValid;

        // Handle rental application based on proof verification
        const applicationResult = await handleRentalApplication(
            renterId,
            isValid,
            isIncomeValid,
            isCreditScoreValid
        );

        res.json({
            isValid,
            applicationResult,
            details: {
                incomeProof: isIncomeValid,
                creditScoreProof: isCreditScoreValid
            }
        });
    } catch (error) {
        logger.error('Error verifying proofs:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add endpoint to get application status
app.get('/application-status/:renterId', async (req, res) => {
    try {
        const { renterId } = req.params;
        const application = await RentalApplication.findOne({ renterId });
        
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        logger.error('Error fetching application status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get verification status
app.get('/verification-status', (req, res) => {
    try {
        const status = {
            verificationKeys: {
                employer: !!verificationKeys.employer,
                bank: !!verificationKeys.bank
            }
        };

        res.json(status);
    } catch (error) {
        logger.error('Error getting verification status:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    logger.info(`Landlord client running on port ${PORT}`);
    // Fetch verification keys on startup
    fetchVerificationKeys().catch(error => {
        logger.error('Failed to fetch verification keys on startup:', error);
    });
}); 