import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Chip,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import {
  Warning,
  LocationOn,
  ArrowUpward,
  ArrowDownward,
  Cloud,
  Air,
  Thermostat,
  Opacity
} from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#f44336',
      dark: '#2c1212',
    },
    warning: {
      main: '#ffa726',
      dark: '#2c1810',
    },
    success: {
      main: '#66bb6a',
      dark: '#0f2312',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 28,
        },
      },
    },
  },
});

const DataCard = ({ title, children }) => (
  <Card sx={{ height: '100%', backgroundColor: 'background.paper' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const DataRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {Icon && <Icon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />}
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Box>
    <Typography variant="body1" sx={{ ml: Icon ? 3.5 : 0 }}>
      {value}
    </Typography>
  </Box>
);

const AlertLevel = ({ color, label, value }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        mb: 2, 
        backgroundColor: `${color}.dark`,
        border: 1,
        borderColor: `${color}.main`,
        borderRadius: 2,
        '&:last-child': { mb: 0 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Warning sx={{ fontSize: 20, mr: 1 }} />
        <Typography variant="body2">
          {label}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ ml: 3.5 }}>
        {value} feet
      </Typography>
    </Paper>
  );
};

const Detail = () => {
  const data = {
    name: "POONJAR",
    waterLevel: 4.2,
    previousLevel: 3.8,
    rainfall: 12.5,
    windSpeed: 15.3,
    humidity: 75,
    temperature: 28.5,
    latitude: 9.675,
    longitude: 76.60278,
    alerts: {
      green: 4,
      yellow: 6,
      warning: 7,
      red: 8.75
    },
    status: "Normal"
  };

  const isRising = data.waterLevel > data.previousLevel;
  const statusColor = {
    Normal: 'success',
    Warning: 'warning',
    Danger: 'error'
  }[data.status];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Typography variant="h1" component="h1">
              {data.name}
            </Typography>
            <Chip
              label={data.status}
              color={statusColor}
              variant="outlined"
              sx={{ 
                borderWidth: 2,
                px: 1,
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          </Box>
          
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DataCard title="Current Status">
                <Box sx={{ mb: 4 }}>
                  <Typography color="text.secondary" variant="body2">
                    Water Level
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                    <Typography variant="h2" component="span">
                      {data.waterLevel} ft
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        ml: 2,
                        color: isRising ? 'error.main' : 'success.main'
                      }}
                    >
                      {isRising ? (
                        <ArrowUpward sx={{ fontSize: 20 }} />
                      ) : (
                        <ArrowDownward sx={{ fontSize: 20 }} />
                      )}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {Math.abs(data.waterLevel - data.previousLevel).toFixed(1)} ft
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <DataRow
                  icon={Cloud}
                  label="Rainfall"
                  value={`${data.rainfall} mm`}
                />
                <DataRow
                  icon={Air}
                  label="Wind Speed"
                  value={`${data.windSpeed} km/h`}
                />
                <DataRow
                  icon={Opacity}
                  label="Humidity"
                  value={`${data.humidity}%`}
                />
                <DataRow
                  icon={Thermostat}
                  label="Temperature"
                  value={`${data.temperature}°C`}
                />
                <DataRow
                  icon={LocationOn}
                  label="Location"
                  value={`${data.latitude}° N, ${data.longitude}° E`}
                />
              </DataCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <DataCard title="Alert Levels">
                <AlertLevel
                  color="success"
                  label="Green Alert Level"
                  value={data.alerts.green}
                />
                <AlertLevel
                  color="warning"
                  label="Yellow Alert Level"
                  value={data.alerts.yellow}
                />
                <AlertLevel
                  color="warning"
                  label="Orange Alert Level"
                  value={data.alerts.warning}
                />
                <AlertLevel
                  color="error"
                  label="Red Alert Level"
                  value={data.alerts.red}
                />
              </DataCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Detail;