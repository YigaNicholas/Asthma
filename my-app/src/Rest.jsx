import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Battery80, 
  Cloud, 
  Thermostat, 
  Opacity, 
  Air, 
  LocalFireDepartment 
} from '@mui/icons-material';

const Rest = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const metrics = [
    {
      title: "Battery Status",
      value: "78%",
      status: "Optimal level",
      icon: <Battery80 fontSize="large" />,
      color: "primary",
      update: "2 mins ago",
      statusLevel: "Normal"
    },
    {
      title: "Carbon Monoxide",
      value: "2.4ppm",
      status: "Safe level",
      icon: <Cloud fontSize="large" />,
      color: "warning",
      update: "5 mins ago",
      statusLevel: "Safe"
    },
    {
      title: "Temperature",
      value: "24.5°C",
      status: "Comfortable",
      icon: <Thermostat fontSize="large" />,
      color: "error",
      update: "1 min ago",
      statusLevel: "Ideal"
    },
    {
      title: "Humidity",
      value: "65%",
      status: "Moderate",
      icon: <Opacity fontSize="large" />,
      color: "info",
      update: "3 mins ago",
      statusLevel: "Normal"
    },
    {
      title: "Dust Particles",
      value: "35µg/m³",
      status: "Good air quality",
      icon: <Air fontSize="large" />,
      color: "default",
      update: "7 mins ago",
      statusLevel: "Clean"
    },
    {
      title: "Gas Level",
      value: "0.8%",
      status: "No leakage",
      icon: <LocalFireDepartment fontSize="large" />,
      color: "secondary",
      update: "4 mins ago",
      statusLevel: "Safe"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Normal":
      case "Safe":
      case "Clean":
        return "success";
      case "Ideal":
        return "info";
      default:
        return "primary";
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Environmental Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    {metric.title}
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }} color={`${metric.color}.main`}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {metric.status}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${metric.color}.light`,
                  borderRadius: '50%',
                  color: `${metric.color}.main`
                }}>
                  {metric.icon}
                </Box>
              </Box>
              <Box sx={{ 
                backgroundColor: 'grey.100',
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated {metric.update}
                </Typography>
                <Chip 
                  label={metric.statusLevel} 
                  size="small"
                  color={getStatusColor(metric.statusLevel)}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Rest;