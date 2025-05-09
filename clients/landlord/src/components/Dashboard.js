import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await fetch('http://localhost:3004/dashboard-stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent applications
        const applicationsResponse = await fetch('http://localhost:3004/recent-applications');
        const applicationsData = await applicationsResponse.json();
        setRecentApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Statistics Cards */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Applications
          </Typography>
          <Typography component="p" variant="h4">
            {stats.totalApplications}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Pending
          </Typography>
          <Typography component="p" variant="h4">
            {stats.pendingApplications}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Approved
          </Typography>
          <Typography component="p" variant="h4">
            {stats.approvedApplications}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Rejected
          </Typography>
          <Typography component="p" variant="h4">
            {stats.rejectedApplications}
          </Typography>
        </Paper>
      </Grid>

      {/* Recent Applications */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Recent Applications" />
          <CardContent>
            <List>
              {recentApplications.map((application) => (
                <ListItem
                  key={application._id}
                  button
                  onClick={() => navigate(`/applications/${application.renterId}`)}
                >
                  <ListItemText
                    primary={`Renter ID: ${application.renterId}`}
                    secondary={`Status: ${application.status}`}
                  />
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard; 