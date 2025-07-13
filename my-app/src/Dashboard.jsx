import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { 
  Battery80, 
  Cloud, 
  Thermostat, 
  Opacity, 
  Air, 
  LocalFireDepartment,
  Refresh
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock API endpoints (replace with your actual endpoints in production)
  const API_ENDPOINTS = {
    battery: '/api/battery',
    carbonMonoxide: '/api/carbon-monoxide',
    temperature: '/api/temperature',
    humidity: '/api/humidity',
    dust: '/api/dust',
    gas: '/api/gas'
  };

  // Dashboard metrics configuration
  const METRICS_CONFIG = [
    {
      id: 'battery',
      title: 'Battery Status',
      unit: '%',
      icon: <Battery80 fontSize="large" />,
      color: 'primary',
      safeRange: { min: 20, max: 100 }
    },
    {
      id: 'carbonMonoxide',
      title: 'Carbon Monoxide',
      unit: 'ppm',
      icon: <Cloud fontSize="large" />,
      color: 'warning',
      safeRange: { min: 0, max: 9 }
    },
    {
      id: 'temperature',
      title: 'Temperature',
      unit: '°C',
      icon: <Thermostat fontSize="large" />,
      color: 'error',
      safeRange: { min: 18, max: 27 }
    },
    {
      id: 'humidity',
      title: 'Humidity',
      unit: '%',
      icon: <Opacity fontSize="large" />,
      color: 'info',
      safeRange: { min: 30, max: 70 }
    },
    {
      id: 'dust',
      title: 'Dust Particles',
      unit: 'µg/m³',
      icon: <Air fontSize="large" />,
      color: 'default',
      safeRange: { min: 0, max: 50 }
    },
    {
      id: 'gas',
      title: 'Gas Level',
      unit: '%',
      icon: <LocalFireDepartment fontSize="large" />,
      color: 'secondary',
      safeRange: { min: 0, max: 1 }
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const metricsData = await Promise.all(
        METRICS_CONFIG.map(async metric => {
          try {
            const response = await fetch(API_ENDPOINTS[metric.id]);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
              ...metric,
              value: data.value,
              timestamp: data.timestamp || new Date().toISOString(),
              status: data.status || 'normal'
            };
          } catch (err) {
            console.error(`Error fetching ${metric.title} data:`, err);
            return {
              ...metric,
              value: null,
              timestamp: new Date().toISOString(),
              status: 'error'
            };
          }
        })
      );
      
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (metric) => {
    if (metric.value === null) {
      return { text: 'Error', color: 'error' };
    }
    
    const isSafe = (
      metric.value >= metric.safeRange.min && 
      metric.value <= metric.safeRange.max
    );
    
    return isSafe 
      ? { text: 'Normal', color: 'success' }
      : { text: 'Warning', color: 'warning' };
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Environmental Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading && metrics.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {metrics.map((metric, index) => {
            const statusInfo = getStatusInfo(metric);
            const isError = metric.value === null;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ mt: 1, fontWeight: 'bold' }} 
                        color={isError ? 'text.disabled' : `${metric.color}.main`}
                      >
                        {isError ? '--' : metric.value}{metric.unit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {isError ? 'Data unavailable' : metric.status}
                      </Typography>
                    </Box>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isError ? 'action.disabledBackground' : `${metric.color}.light`,
                      borderRadius: '50%',
                      color: isError ? 'text.disabled' : `${metric.color}.main`
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
                      Updated at {formatTimestamp(metric.timestamp)}
                    </Typography>
                    <Chip 
                      label={statusInfo.text} 
                      size="small"
                      color={statusInfo.color}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;