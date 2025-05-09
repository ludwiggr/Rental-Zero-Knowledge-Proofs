import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function ApplicationDetails() {
  const { renterId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3004/application-status/${renterId}`);
        if (!response.ok) {
          throw new Error('Application not found');
        }
        const data = await response.json();
        setApplication(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [renterId]);

  const handleVerifyProofs = async () => {
    try {
      const response = await fetch('http://localhost:3004/verify-proofs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          renterId,
          incomeProof: application.incomeProof,
          creditScoreProof: application.creditScoreProof,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh application details
        const updatedResponse = await fetch(`http://localhost:3004/application-status/${renterId}`);
        const updatedData = await updatedResponse.json();
        setApplication(updatedData);
      }
    } catch (error) {
      setError('Error verifying proofs');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!application) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No application found for this renter ID.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Application Details</Typography>
            <Chip
              label={application.status}
              color={
                application.status === 'approved'
                  ? 'success'
                  : application.status === 'rejected'
                  ? 'error'
                  : 'warning'
              }
            />
          </Box>
          <Typography variant="body1" gutterBottom>
            Renter ID: {application.renterId}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Created: {new Date(application.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Updated: {new Date(application.updatedAt).toLocaleString()}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Income Proof" />
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              {application.incomeProofValid ? (
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              ) : (
                <CancelIcon color="error" sx={{ mr: 1 }} />
              )}
              <Typography>
                Status: {application.incomeProofValid ? 'Valid' : 'Invalid'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Proof Hash: {application.incomeProof?.hash || 'N/A'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Credit Score Proof" />
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              {application.creditScoreProofValid ? (
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              ) : (
                <CancelIcon color="error" sx={{ mr: 1 }} />
              )}
              <Typography>
                Status: {application.creditScoreProofValid ? 'Valid' : 'Invalid'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Proof Hash: {application.creditScoreProof?.hash || 'N/A'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyProofs}
            disabled={application.status !== 'pending'}
          >
            Verify Proofs
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ApplicationDetails; 