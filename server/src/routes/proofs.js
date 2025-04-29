const express = require('express');
const router = express.Router();
const snarkjs = require('snarkjs');
const auth = require('../middleware/auth');
const { z } = require('zod');

// Validation schema for proof submission
const proofSchema = z.object({
  propertyId: z.string(),
  proof: z.object({
    pi_a: z.array(z.string()),
    pi_b: z.array(z.array(z.string())),
    pi_c: z.array(z.string()),
    protocol: z.string(),
    curve: z.string()
  }),
  publicSignals: z.array(z.string())
});

// Generate proof verification key
router.get('/verification-key', async (req, res) => {
  try {
    const verificationKey = await snarkjs.zKey.exportVerificationKey('circuits/income_proof.zkey');
    res.json(verificationKey);
  } catch (error) {
    res.status(500).json({ message: 'Error generating verification key' });
  }
});

// Verify income proof
router.post('/verify', auth, async (req, res) => {
  try {
    const { propertyId, proof, publicSignals } = proofSchema.parse(req.body);

    // Load verification key
    const verificationKey = await snarkjs.zKey.exportVerificationKey('circuits/income_proof.zkey');

    // Verify the proof
    const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid proof' });
    }

    // Store the verification result
    // In a real application, you would store this in a database
    // and associate it with the user and property

    res.json({
      message: 'Proof verified successfully',
      verified: true
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error verifying proof' });
  }
});

// Get proof status for a property
router.get('/status/:propertyId', auth, async (req, res) => {
  try {
    // In a real application, you would check the database
    // for the proof status associated with the user and property
    res.json({
      hasVerifiedProof: false,
      lastVerified: null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking proof status' });
  }
});

module.exports = router; 