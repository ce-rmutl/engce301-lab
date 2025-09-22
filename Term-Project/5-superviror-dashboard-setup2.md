# Supervisor Dashboard Setup Guide - React.js Web App

## 📋 Overview
สร้าง Web Dashboard สำหรับ Supervisor ด้วย React.js สำหรับ:
- ดูสถานะทีม Real-time
- ส่งข้อความถึง Agent (Direct & Broadcast)
- แสดงสถิติทีมแบบง่าย
- จัดการการสื่อสาร

## 🛠️ Prerequisites
- Node.js 18+ installed
- React.js fundamentals
- Material-UI knowledge (optional)
- Backend server running on port 3001

## 📁 Project Structure
```
supervisor-dashboard/
├── package.json
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js                    # Main application
│   ├── index.js                  # Entry point
│   ├── index.css                 # Global styles
│   ├── components/
│   │   ├── Login.js              # Supervisor login
│   │   ├── Dashboard.js          # Main dashboard
│   │   ├── TeamOverview.js       # Team status overview
│   │   ├── AgentCard.js          # Individual agent display
│   │   ├── MessagePanel.js       # Send messages
│   │   ├── StatsPanel.js         # Team statistics
│   │   ├── Header.js             # Navigation header
│   │   └── ErrorBoundary.js      # Error handling
│   ├── hooks/
│   │   ├── useSocket.js         # Socket custom hook
│   │   ├── useAuth.js           # Authentication hook
│   │   └── useAgentStatus.js    # Agent status management
│   ├── services/
│   │   ├── api.js               # API communication
│   │   ├── socket.js            # WebSocket connection
│   │   └── storage.js           # Local storage utils
│   ├── utils/
│   │   ├── constants.js         # App constants
│   │   └── helpers.js           # Utility functions
│   └── styles/
│       └── components/          # Component-specific styles
└── build/                       # Built files
```

## ⚡ Quick Setup

### 1. Initialize Project
```bash
# Create supervisor dashboard directory
mkdir supervisor-dashboard
cd supervisor-dashboard

# Initialize React app
npx create-react-app . --template typescript

# Install additional dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install socket.io-client axios
npm install recharts
```

### 2. Package.json Configuration
```json
{
  "name": "supervisor-dashboard",
  "version": "1.0.0",
  "description": "Supervisor Dashboard for Agent Wallboard System",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0",
    "socket.io-client": "^4.7.2",
    "axios": "^1.5.0",
    "recharts": "^2.8.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "BROWSER=none PORT=3000 react-scripts start",
    "build:prod": "NODE_ENV=production react-scripts build",
    "preview": "npx serve -s build -l 3000"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:3001"
}
```

### 3. Environment Configuration
```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_REFRESH_INTERVAL=30000
REACT_APP_DEBUG=true

# .env.production
REACT_APP_API_URL=/api
REACT_APP_SOCKET_URL=
REACT_APP_REFRESH_INTERVAL=30000
REACT_APP_DEBUG=false
```

## ⚛️ Core Application Files

### 1. Entry Point (src/index.js)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 2. Global Styles (src/index.css)
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.status-online {
  animation: pulse 2s infinite;
}
```

### 3. Main App Component (src/App.js)
```javascript
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Alert, Snackbar } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { SocketProvider } from './hooks/useSocket';

// MUI Theme Configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

// Authentication Context
const AuthContext = React.createContext();

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

function App() {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Check for stored supervisor on app load
  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const stored = localStorage.getItem('supervisor_wallboard');
        if (stored) {
          const supervisorData = JSON.parse(stored);
          
          // Validate with server
          const response = await fetch(`/api/auth/validate/${supervisorData.agentCode}`);
          if (response.ok) {
            const result = await response.json();
            if (result.valid) {
              setSupervisor(supervisorData);
            } else {
              localStorage.removeItem('supervisor_wallboard');
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('supervisor_wallboard');
      } finally {
        setLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const login = async (agentCode) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentCode })
      });

      const result = await response.json();
      
      if (result.success && result.agent.role === 'supervisor') {
        setSupervisor(result.agent);
        localStorage.setItem('supervisor_wallboard', JSON.stringify(result.agent));
        showNotification('Login successful!', 'success');
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.agent?.role !== 'supervisor' 
            ? 'Access denied. Supervisor role required.' 
            : 'Invalid supervisor code'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Connection error. Please check if the server is running.' 
      };
    }
  };

  const logout = () => {
    setSupervisor(null);
    localStorage.removeItem('supervisor_wallboard');
    showNotification('Logged out successfully', 'info');
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          bgcolor="background.default"
        >
          <div className="loading-spinner" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthContext.Provider value={{ supervisor, login, logout }}>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {supervisor ? (
              <SocketProvider supervisorCode={supervisor.agentCode}>
                <Dashboard 
                  supervisor={supervisor}
                  onNotification={showNotification}
                  onLogout={logout}
                />
              </SocketProvider>
            ) : (
              <Login onLogin={login} onNotification={showNotification} />
            )}

            <Snackbar
              open={notification.open}
              autoHideDuration={4000}
              onClose={closeNotification}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert 
                onClose={closeNotification} 
                severity={notification.severity}
                sx={{ width: '100%' }}
              >
                {notification.message}
              </Alert>
            </Snackbar>
          </Box>
        </AuthContext.Provider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
```

## 🧩 Core Components

### 1. Login Component (src/components/Login.js)
```javascript
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { 
  SupervisorAccount as SupervisorIcon,
  Login as LoginIcon 
} from '@mui/icons-material';

function Login({ onLogin, onNotification }) {
  const [agentCode, setAgentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agentCode.trim()) {
      setError('Please enter your supervisor code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onLogin(agentCode.trim().toUpperCase());
      
      if (!result.success) {
        setError(result.error || 'Invalid supervisor code');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          padding: 2
        }}
      >
        <Card
          elevation={10}
          sx={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SupervisorIcon 
                sx={{ 
                  fontSize: 64, 
                  color: 'primary.main',
                  mb: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} 
              />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Supervisor Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your supervisor code to access the team dashboard
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Supervisor Code"
                value={agentCode}
                onChange={(e) => setAgentCode(e.target.value)}
                placeholder="e.g., SP001"
                margin="normal"
                autoFocus
                disabled={loading}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { fontSize: '1.1rem' }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{ 
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="caption" color="text.secondary">
                RMUTL Agent Wallboard System v1.0
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Default codes: SP001, SP002, SP003
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;
```

### 2. Dashboard Component (src/components/Dashboard.js)
```javascript
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Chip,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import Header from './Header';
import TeamOverview from './TeamOverview';
import MessagePanel from './MessagePanel';
import StatsPanel from './StatsPanel';
import { useSocket } from '../hooks/useSocket';
import { useAgentStatus } from '../hooks/useAgentStatus';

const DRAWER_WIDTH = 320;

function Dashboard({ supervisor, onNotification, onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { socket, isConnected } = useSocket();
  const { agents, teamStats, updateAgentStatus, loading } = useAgentStatus(supervisor.teamId);

  // Socket event handlers
  useEffect(() => {
    if (socket) {
      const handleAgentStatusChange = (data) => {
        updateAgentStatus(data.agentCode, data.status);
        onNotification(`${data.agentCode} changed status to ${data.status}`, 'info');
      };

      const handleAgentConnected = (data) => {
        onNotification(`${data.agentCode} connected`, 'success');
      };

      const handleAgentDisconnected = (data) => {
        onNotification(`${data.agentCode} disconnected`, 'warning');
      };

      socket.on('agent_status_change', handleAgentStatusChange);
      socket.on('agent_connected', handleAgentConnected);
      socket.on('agent_disconnected', handleAgentDisconnected);

      return () => {
        socket.off('agent_status_change', handleAgentStatusChange);
        socket.off('agent_connected', handleAgentConnected);
        socket.off('agent_disconnected', handleAgentDisconnected);
      };
    }
  }, [socket, updateAgentStatus, onNotification]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    onNotification('Dashboard refreshed', 'success');
  };

  const handleMessageSent = (message) => {
    onNotification(
      message.type === 'broadcast' 
        ? 'Broadcast message sent to all agents' 
        : `Message sent to ${message.toCode}`, 
      'success'
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" gutterBottom>
          Send Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Communicate with your team
        </Typography>
      </Box>
      <Box sx={{ flex: 1, p: 2 }}>
        <MessagePanel 
          supervisorCode={supervisor.agentCode}
          agents={agents}
          onMessageSent={handleMessageSent}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {supervisor.agentName} - Team Dashboard
          </Typography>

          {/* Connection Status */}
          <Chip
            size="small"
            label={isConnected ? 'Connected' : 'Disconnected'}
            color={isConnected ? 'success' : 'error'}
            variant="outlined"
            sx={{ mr: 2 }}
          />

          <IconButton color="inherit" onClick={handleRefresh} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(0,0,0,0.06)'
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(0,0,0,0.06)',
              bgcolor: 'background.default'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Team Statistics */}
            <Grid item xs={12} lg={4}>
              <StatsPanel 
                teamStats={teamStats}
                refreshKey={refreshKey}
                loading={loading}
              />
            </Grid>

            {/* Team Overview */}
            <Grid item xs={12} lg={8}>
              <TeamOverview 
                agents={agents}
                refreshKey={refreshKey}
                loading={loading}
                onAgentSelect={(agent) => {
                  onNotification(`Selected agent: ${agent.agentName}`, 'info');
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
```

### 3. Team Overview Component (src/components/TeamOverview.js)
```javascript
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import AgentCard from './AgentCard';

function TeamOverview({ agents, refreshKey, loading, onAgentSelect }) {
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Filter agents when data changes
  useEffect(() => {
    filterAgents();
    setLastUpdate(new Date());
  }, [agents, statusFilter, refreshKey]);

  const filterAgents = () => {
    let filtered = agents || [];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(agent => 
        agent.currentStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Sort by status priority and name
    filtered.sort((a, b) => {
      const statusPriority = {
        'available': 1,
        'busy': 2,
        'break': 3,
        'meeting': 4,
        'offline': 5
      };
      
      const aPriority = statusPriority[a.currentStatus?.toLowerCase()] || 5;
      const bPriority = statusPriority[b.currentStatus?.toLowerCase()] || 5;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return a.agentName.localeCompare(b.agentName);
    });
    
    setFilteredAgents(filtered);
  };

  const getStatusCount = (status) => {
    return agents?.filter(agent => 
      agent.currentStatus?.toLowerCase() === status.toLowerCase()
    ).length || 0;
  };

  const statusOptions = [
    { value: 'all', label: 'All Agents', color: 'default', count: agents?.length || 0 },
    { value: 'available', label: 'Available', color: 'success', count: getStatusCount('available') },
    { value: 'busy', label: 'Busy', color: 'warning', count: getStatusCount('busy') },
    { value: 'break', label: 'Break', color: 'info', count: getStatusCount('break') },
    { value: 'meeting', label: 'Meeting', color: 'secondary', count: getStatusCount('meeting') },
    { value: 'offline', label: 'Offline', color: 'error', count: getStatusCount('offline') }
  ];

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <PeopleIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Team Overview ({filteredAgents.length})
          </Typography>
        </Box>
        
        <Box display="flex" gap={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <span>{option.label}</span>
                    <Chip 
                      label={option.count} 
                      size="small" 
                      color={option.color}
                      variant="outlined"
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => filterAgents()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Status Summary Chips */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {statusOptions.slice(1).map(status => (
          <Chip
            key={status.value}
            label={`${status.label}: ${status.count}`}
            color={status.color}
            size="small"
            variant={statusFilter === status.value ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter(status.value)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                bgcolor: statusFilter === status.value 
                  ? `${status.color}.dark` 
                  : `${status.color}.50`
              }
            }}
          />
        ))}
      </Box>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            py: 4 
          }}
        >
          {statusFilter === 'all' 
            ? 'No agents found in your team' 
            : `No agents with status: ${statusFilter}`
          }
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredAgents.map(agent => (
            <Grid item xs={12} sm={6} md={4} key={agent.agentCode}>
              <AgentCard 
                agent={agent}
                onClick={() => onAgentSelect(agent)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Last Update Info */}
      <Box mt={3} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          Last updated: {lastUpdate.toLocaleTimeString()} • 
          Auto-refresh every 30 seconds
        </Typography>
      </Box>
    </Paper>
  );
}

export default TeamOverview;