import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';

function Navigation() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon />}
            color="inherit"
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/applications"
            startIcon={<ListAltIcon />}
            color="inherit"
          >
            Applications
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 