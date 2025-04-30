import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import axios from 'axios';
import { groth16 } from 'snarkjs';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [income, setIncome] = useState('');
  const [generatingProof, setGeneratingProof] = useState(false);
  const [proofStatus, setProofStatus] = useState({
    hasVerifiedProof: false,
    lastVerified: null
  });

  const fetchProperty = useCallback(async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching property details');
      setLoading(false);
    }
  }, [id]);

  const checkProofStatus = useCallback(async () => {
    try {
      const response = await axios.get(`/api/proofs/status/${id}`);
      setProofStatus(response.data);
    } catch (err) {
      console.error('Error checking proof status:', err);
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      await fetchProperty();
      await checkProofStatus();
    };
    loadData();
  }, [fetchProperty, checkProofStatus]);

  const generateProof = async () => {
    if (!income || isNaN(income)) {
      setError('Please enter a valid income amount');
      return;
    }

    setGeneratingProof(true);
    setError('');

    try {
      // Generate the proof using snarkjs
      const { proof, publicSignals } = await groth16.fullProve(
        {
          income: income,
          minimumIncome: property.minimumIncome
        },
        'circuits/income_proof.wasm',
        'circuits/income_proof.zkey'
      );

      // Verify the proof
      const verificationKey = await axios.get('/api/proofs/verification-key');
      const isValid = await groth16.verify(
        verificationKey.data,
        publicSignals,
        proof
      );

      if (isValid) {
        // Submit the proof to the server
        await axios.post('/api/proofs/verify', {
          propertyId: id,
          proof,
          publicSignals
        });

        setProofStatus({
          hasVerifiedProof: true,
          lastVerified: new Date().toISOString()
        });
      } else {
        setError('Proof verification failed');
      }
    } catch (err) {
      setError('Error generating or verifying proof');
      console.error(err);
    } finally {
      setGeneratingProof(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container>
        <Alert severity="error">Property not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {property.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {property.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Typography variant="body1">
          Price: ${property.price}/month
        </Typography>
        <Typography variant="body1">
          Bedrooms: {property.bedrooms}
        </Typography>
        <Typography variant="body1">
          Bathrooms: {property.bathrooms}
        </Typography>
        <Typography variant="body1" paragraph>
          Minimum Income Required: ${property.minimumIncome}/month
        </Typography>

        {!proofStatus.hasVerifiedProof ? (
          <>
            <TextField
              fullWidth
              label="Your Monthly Income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generateProof}
              disabled={generatingProof}
              sx={{ mt: 2 }}
            >
              {generatingProof ? 'Generating Proof...' : 'Generate Income Proof'}
            </Button>
          </>
        ) : (
          <Alert severity="success" sx={{ mt: 2 }}>
            Income requirement verified! Last verified: {new Date(proofStatus.lastVerified).toLocaleString()}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PropertyDetail; 