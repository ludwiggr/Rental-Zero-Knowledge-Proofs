import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper
} from '@mui/material';
import axios from 'axios';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 'any',
    bathrooms: 'any'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/properties');
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching properties');
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         property.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = property.price >= filters.minPrice && property.price <= filters.maxPrice;
    const matchesBedrooms = filters.bedrooms === 'any' || property.bedrooms === parseInt(filters.bedrooms);
    const matchesBathrooms = filters.bathrooms === 'any' || property.bathrooms === parseInt(filters.bathrooms);

    return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms;
  });

  if (loading) {
    return (
      <Container>
        <Typography>Loading properties...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Search Properties
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(_, newValue) => {
                handleFilterChange('minPrice', newValue[0]);
                handleFilterChange('maxPrice', newValue[1]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Bedrooms</InputLabel>
              <Select
                value={filters.bedrooms}
                label="Bedrooms"
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Bathrooms</InputLabel>
              <Select
                value={filters.bathrooms}
                label="Bathrooms"
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {filteredProperties.map((property) => (
          <Grid item key={property._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={property.images[0] || 'https://via.placeholder.com/300x200'}
                alt={property.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {property.address.street}, {property.address.city}, {property.address.state}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${property.price}/month
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.bedrooms} beds • {property.bathrooms} baths • {property.squareFeet} sqft
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/properties/${property._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PropertyList; 