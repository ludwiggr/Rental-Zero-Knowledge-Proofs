import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import * as snarkjs from 'snarkjs';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [income, setIncome] = useState('');
  const [proofStatus, setProofStatus] = useState(null);
  const [generatingProof, setGeneratingProof] = useState(false);

  useEffect(() => {
    fetchProperty();
    if (user) {
      checkProofStatus();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching property details');
      setLoading(false);
    }
  };

  const checkProofStatus = async () => {
    try {
      const response = await axios.get(`/api/proofs/status/${id}`);
      setProofStatus(response.data);
    } catch (err) {
      console.error('Error checking proof status:', err);
    }
  };

  const generateProof = async () => {
    if (!income || isNaN(income)) {
      setError('Please enter a valid income amount');
      return;
    }

    setGeneratingProof(true);
    setError('');

    try {
      // Generate the proof using snarkjs
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
          income: income,
          minimumIncome: property.minimumIncome
        },
        'circuits/income_proof.wasm',
        'circuits/income_proof.zkey'
      );

      // Verify the proof
      const verificationKey = await axios.get('/api/proofs/verification-key');
      const isValid = await snarkjs.groth16.verify(
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {property.title}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${property.price}/month
            </Typography>
            <Typography variant="body1" paragraph>
              {property.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Bedrooms:</strong> {property.bedrooms}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Bathrooms:</strong> {property.bathrooms}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Square Feet:</strong> {property.squareFeet}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Minimum Income:</strong> ${property.minimumIncome}/month
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body2">
              {property.address.street}<br />
              {property.address.city}, {property.address.state} {property.address.zipCode}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Income Verification
            </Typography>
            {proofStatus?.hasVerifiedProof ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Income verified on {new Date(proofStatus.lastVerified).toLocaleDateString()}
              </Alert>
            ) : (
              <>
                <Typography variant="body2" gutterBottom>
                  Minimum required income: ${property.minimumIncome}/month
                </Typography>
                <TextField
                  fullWidth
                  label="Your Monthly Income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateProof}
                  disabled={generatingProof}
                >
                  {generatingProof ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Generating Proof...
                    </>
                  ) : (
                    'Verify Income'
                  )}
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Photos
            </Typography>
            <ImageList cols={3} gap={8}>
              {property.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    loading="lazy"
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyDetail; 