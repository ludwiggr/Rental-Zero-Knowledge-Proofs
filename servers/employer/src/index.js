const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const path = require('path');

const app = express();
app.use(express.json());

// JWT secret for signing attestations
const JWT_SECRET = process.env.JWT_SECRET || 'employer-secret-key';

// Schema for income attestation request
const IncomeAttestationSchema = z.object({
  employeeId: z.string(),
  monthlyIncome: z.number().positive(),
  currency: z.string().length(3)
});

// Store for employee data (in production, this would be a database)
const employees = new Map();

// Endpoint to publish circuit and verification key
app.get('/circuit', (req, res) => {
  res.json({
    circuit: path.join(__dirname, '../circuits/income_proof.circom'),
    verificationKey: path.join(__dirname, '../circuits/artifacts/income_proof.vkey.json')
  });
});

// Endpoint to create income attestation
app.post('/attestation', async (req, res) => {
  try {
    const { employeeId, monthlyIncome, currency } = IncomeAttestationSchema.parse(req.body);
    
    // In production, verify employee identity and income data
    // For demo, we'll just store it
    employees.set(employeeId, { monthlyIncome, currency });
    
    // Create attestation payload
    const attestation = {
      type: 'income',
      employeeId,
      monthlyIncome,
      currency,
      timestamp: Date.now()
    };
    
    // Sign the attestation
    const token = jwt.sign(attestation, JWT_SECRET, { expiresIn: '1y' });
    
    res.json({
      attestation: token,
      publicInputs: {
        minimumIncome: 3000, // Example minimum income threshold
        currency
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Employer server running on port ${PORT}`);
}); 