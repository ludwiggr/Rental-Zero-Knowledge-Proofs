import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Zero-Knowledge Proof Rental System
        </Typography>
        <Typography variant="body1" paragraph>
          This system allows tenants to prove they meet income requirements without revealing their actual income.
          Using zero-knowledge proofs, we ensure privacy while maintaining trust in the rental process.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/properties"
          >
            Browse Properties
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/dashboard"
          >
            View Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Home; 