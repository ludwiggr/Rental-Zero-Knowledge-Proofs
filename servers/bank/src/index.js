const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const path = require('path');

const app = express();
app.use(express.json());

// JWT secret for signing attestations
const JWT_SECRET = process.env.JWT_SECRET || 'bank-secret-key';

// Schema for credit score attestation request
const CreditScoreAttestationSchema = z.object({
  customerId: z.string(),
  creditScore: z.number().min(300).max(850)
});

// Store for customer data (in production, this would be a database)
const customers = new Map();

// Endpoint to publish circuit and verification key
app.get('/circuit', (req, res) => {
  res.json({
    circuit: path.join(__dirname, '../circuits/credit_score.circom'),
    verificationKey: path.join(__dirname, '../circuits/artifacts/credit_score.vkey.json')
  });
});

// Endpoint to create credit score attestation
app.post('/attestation', async (req, res) => {
  try {
    const { customerId, creditScore } = CreditScoreAttestationSchema.parse(req.body);
    
    // In production, verify customer identity and credit score data
    // For demo, we'll just store it
    customers.set(customerId, { creditScore });
    
    // Create attestation payload
    const attestation = {
      type: 'credit_score',
      customerId,
      creditScore,
      timestamp: Date.now()
    };
    
    // Sign the attestation
    const token = jwt.sign(attestation, JWT_SECRET, { expiresIn: '1y' });
    
    res.json({
      attestation: token,
      publicInputs: {
        minimumScore: 700 // Example minimum credit score threshold
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to verify attestation
app.post('/verify', async (req, res) => {
  try {
    const { attestation } = req.body;
    const decoded = jwt.verify(attestation, JWT_SECRET);
    res.json({ valid: true, data: decoded });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Bank server running on port ${PORT}`);
}); 