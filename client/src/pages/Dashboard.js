import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'landlord') {
        fetchProperties();
      } else {
        fetchApplications();
      }
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/properties/my-properties');
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching properties');
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my-applications');
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching applications');
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/properties/${propertyId}`);
        setProperties(properties.filter(p => p._id !== propertyId));
      } catch (err) {
        setError('Error deleting property');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Please log in to access the dashboard</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {user.role === 'landlord' ? (
        <>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/properties/new')}
            >
              Add New Property
            </Button>
          </Box>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Properties
            </Typography>
            <List>
              {properties.map((property) => (
                <React.Fragment key={property._id}>
                  <ListItem>
                    <ListItemText
                      primary={property.title}
                      secondary={`${property.address.city}, ${property.address.state} • $${property.price}/month`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => navigate(`/properties/${property._id}`)}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => navigate(`/properties/${property._id}/edit`)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteProperty(property._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="My Applications" />
            <Tab label="Saved Properties" />
          </Tabs>

          {activeTab === 0 && (
            <List>
              {applications.map((application) => (
                <React.Fragment key={application._id}>
                  <ListItem>
                    <ListItemText
                      primary={application.property.title}
                      secondary={`Status: ${application.status} • Applied on ${new Date(application.createdAt).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => navigate(`/properties/${application.property._id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}

          {activeTab === 1 && (
            <List>
              {properties.map((property) => (
                <React.Fragment key={property._id}>
                  <ListItem>
                    <ListItemText
                      primary={property.title}
                      secondary={`${property.address.city}, ${property.address.state} • $${property.price}/month`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => navigate(`/properties/${property._id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard; 