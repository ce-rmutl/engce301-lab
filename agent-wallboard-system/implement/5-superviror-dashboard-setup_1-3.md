# Supervisor Dashboard Setup Guide - React.js Web App

## 1. Overview & Setup

### 📋 ภาพรวม Supervisor Dashboard
Supervisor Dashboard เป็น Web Application ที่ให้ Supervisor สามารถ:
- **ดูสถานะทีม** - ติดตามสถานะ Agent แบบ Real-time
- **ส่งข้อความ** - ส่งข้อความถึง Agent แบบ Direct หรือ Broadcast
- **จัดการทีม** - ดูสถิติและข้อมูลทีมแบบง่าย

### 🎯 เป้าหมายการเรียนรู้
นักศึกษาจะได้เรียนรู้:
- การพัฒนา React.js Web Application
- การใช้ Material-UI สำหรับ UI Components
- WebSocket integration สำหรับ Real-time updates
- การเชื่อมต่อกับ Backend API

### 🛠️ Technology Stack
- **React.js 18+** - JavaScript library สำหรับ UI
- **Material-UI 5+** - React component library
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client สำหรับ API calls

### 📋 Prerequisites
- **Node.js 18+** installed
- **Basic React knowledge** - useState, useEffect, components
- **Basic JavaScript/ES6** - arrow functions, promises, async/await
- **Backend server** running on port 3001

### 📁 Project Structure Overview
```
supervisor-dashboard/
├── package.json              # Dependencies และ scripts
├── public/
│   └── index.html            # HTML template
├── src/
│   ├── App.js                # Main application component
│   ├── index.js              # Entry point
│   ├── components/           # React components
│   │   ├── Login.js          # Login form
│   │   ├── Dashboard.js      # Main dashboard
│   │   ├── TeamOverview.js   # Team status display
│   │   └── MessagePanel.js   # Message sending
│   ├── services/
│   │   ├── api.js           # API communication
│   │   └── socket.js        # WebSocket connection
│   └── utils/
│       └── constants.js     # App constants
└── build/                   # Built files (after npm run build)
```

---

## 2. Quick Start

### ⚡ การติดตั้งเริ่มต้น

#### 1. สร้างโปรเจค React
```bash
# สร้าง React app
npx create-react-app supervisor-dashboard
cd supervisor-dashboard

# ติดตั้ง dependencies เพิ่มเติม
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install socket.io-client axios
```

#### 2. ปรับแต่ง package.json
```json
{
  "name": "supervisor-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0",
    "socket.io-client": "^4.7.2",
    "axios": "^1.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "dev": "PORT=3000 react-scripts start"
  },
  "proxy": "http://localhost:3001"
}
```

#### 3. Environment Configuration
สร้างไฟล์ `.env` ในโฟลเดอร์ root:
```bash
# .env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_DEBUG=true
```

#### 4. ลบไฟล์ที่ไม่จำเป็น
```bash
# ลบไฟล์ที่ไม่ใช้
rm src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js
```

#### 5. สร้างโฟลเดอร์ที่จำเป็น
```bash
# สร้างโฟลเดอร์
mkdir src/components src/services src/utils
```

### 🧪 ทดสอบการติดตั้ง
```bash
# เริ่มต้น development server
npm start

# เปิดเบราว์เซอร์ที่ http://localhost:3000
# ถ้าเห็นหน้า React default แสดงว่าติดตั้งสำเร็จ
```

### ✅ เช็คลิสต์การติดตั้ง
- [ ] React app สร้างสำเร็จ
- [ ] Material-UI dependencies ติดตั้งแล้ว
- [ ] Environment variables ตั้งค่าแล้ว
- [ ] npm start ทำงานได้
- [ ] Backend server รันที่ port 3001

---

## 3. Core Components (Main Development)

### 🔧 App.js - Main Application

สร้างไฟล์ `src/App.js`:
```javascript
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Alert, Snackbar } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Material-UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // ไม่ใช้ตัวพิมพ์ใหญ่
        },
      },
    },
  },
});

function App() {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // เช็ค stored supervisor เมื่อเริ่มแอป
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = () => {
    try {
      const stored = localStorage.getItem('supervisor_data');
      if (stored) {
        const supervisorData = JSON.parse(stored);
        setSupervisor(supervisorData);
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleLogin = async (agentCode) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentCode })
      });

      const result = await response.json();
      
      if (result.success && result.agent.role === 'supervisor') {
        setSupervisor(result.agent);
        localStorage.setItem('supervisor_data', JSON.stringify(result.agent));
        showNotification('เข้าสู่ระบบสำเร็จ!', 'success');
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.agent?.role !== 'supervisor' 
            ? 'คุณไม่มีสิทธิ์เข้าใช้ระบบ supervisor' 
            : 'รหัส supervisor ไม่ถูกต้อง'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาตรวจสอบ backend server' 
      };
    }
  };

  const handleLogout = () => {
    setSupervisor(null);
    localStorage.removeItem('supervisor_data');
    showNotification('ออกจากระบบแล้ว', 'info');
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
        >
          <div>กำลังโหลด...</div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {supervisor ? (
          <Dashboard 
            supervisor={supervisor}
            onNotification={showNotification}
            onLogout={handleLogout}
          />
        ) : (
          <Login 
            onLogin={handleLogin} 
            onNotification={showNotification} 
          />
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
    </ThemeProvider>
  );
}

export default App;
```

### 🔐 Login Component

สร้างไฟล์ `src/components/Login.js`:
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
      setError('กรุณาใส่รหัส supervisor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onLogin(agentCode.trim().toUpperCase());
      
      if (!result.success) {
        setError(result.error || 'รหัส supervisor ไม่ถูกต้อง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
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
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <SupervisorIcon 
              sx={{ 
                fontSize: 64, 
                color: 'primary.main',
                mb: 2 
              }} 
            />
            
            <Typography variant="h4" component="h1" gutterBottom>
              Supervisor Dashboard
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              ใส่รหัส supervisor เพื่อเข้าสู่ระบบ
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="รหัส Supervisor"
                value={agentCode}
                onChange={(e) => setAgentCode(e.target.value)}
                placeholder="เช่น SP001"
                margin="normal"
                autoFocus
                disabled={loading}
                sx={{ mb: 2 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{ mb: 2, py: 1.5 }}
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </form>

            <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="caption" color="text.secondary">
                รหัสทดสอบ: SP001, SP002, SP003
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;
```

### 📊 Dashboard Component

สร้างไฟล์ `src/components/Dashboard.js`:
```javascript
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import TeamOverview from './TeamOverview';
import MessagePanel from './MessagePanel';

function Dashboard({ supervisor, onNotification, onLogout }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // โหลดข้อมูล agents
  useEffect(() => {
    fetchAgents();
    
    // Auto refresh ทุก 30 วินาที
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, [supervisor.teamId]);

  const fetchAgents = async () => {
    if (!supervisor.teamId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/agents/team/${supervisor.teamId}`);
      if (response.ok) {
        const result = await response.json();
        
        // เพิ่มข้อมูล mock สำหรับ demo
        const agentsWithStatus = (result.agents || []).map(agent => ({
          ...agent,
          currentStatus: ['Available', 'Busy', 'Break', 'Offline'][Math.floor(Math.random() * 4)],
          lastUpdate: new Date()
        }));
        
        setAgents(agentsWithStatus);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      onNotification('ไม่สามารถโหลดข้อมูล agents ได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAgents();
    onNotification('อัปเดตข้อมูลแล้ว', 'success');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {supervisor.agentName} - Dashboard
          </Typography>
          
          <Chip
            size="small"
            label={isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
            color={isConnected ? 'success' : 'error'}
            sx={{ mr: 2 }}
          />
          
          <IconButton 
            color="inherit" 
            onClick={handleRefresh}
            title="รีเฟรช"
          >
            <RefreshIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={onLogout}
            title="ออกจากระบบ"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Team Overview */}
          <Grid item xs={12} md={8}>
            <TeamOverview 
              agents={agents}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </Grid>

          {/* Message Panel */}
          <Grid item xs={12} md={4}>
            <MessagePanel 
              supervisor={supervisor}
              agents={agents}
              onMessageSent={(message) => {
                onNotification(
                  message.type === 'broadcast' 
                    ? 'ส่งข้อความกระจายเสียงแล้ว' 
                    : `ส่งข้อความถึง ${message.toCode} แล้ว`, 
                  'success'
                );
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
```

### 👥 Team Overview Component

สร้างไฟล์ `src/components/TeamOverview.js`:
```javascript
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Card,
  CardContent,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton
} from '@mui/material';
import {
  Person as PersonIcon,
  Message as MessageIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const STATUS_CONFIG = {
  'Available': { color: '#4caf50', icon: '✅' },
  'Busy': { color: '#ff9800', icon: '🔄' },
  'Break': { color: '#2196f3', icon: '☕' },
  'Offline': { color: '#757575', icon: '🔴' }
};

function TeamOverview({ agents, loading, onRefresh }) {
  const [statusFilter, setStatusFilter] = useState('all');

  // กรองข้อมูล agents ตาม status
  const filteredAgents = agents.filter(agent => 
    statusFilter === 'all' || agent.currentStatus === statusFilter
  );

  // นับจำนวนตาม status
  const getStatusCount = (status) => {
    return agents.filter(agent => agent.currentStatus === status).length;
  };

  const AgentCard = ({ agent }) => {
    const statusConfig = STATUS_CONFIG[agent.currentStatus] || STATUS_CONFIG['Offline'];
    
    return (
      <Card sx={{ height: '100%', position: 'relative' }}>
        {/* Status Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: statusConfig.color
          }}
        />
        
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: statusConfig.color, mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                {agent.agentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {agent.agentCode}
              </Typography>
            </Box>
            <IconButton size="small" color="primary">
              <MessageIcon />
            </IconButton>
          </Box>
          
          <Chip
            label={`${statusConfig.icon} ${agent.currentStatus}`}
            size="small"
            sx={{ bgcolor: statusConfig.color, color: 'white' }}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          ภาพรวมทีม ({filteredAgents.length} คน)
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>กรองสถานะ</InputLabel>
            <Select
              value={statusFilter}
              label="กรองสถานะ"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Busy">Busy</MenuItem>
              <MenuItem value="Break">Break</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton onClick={onRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Status Summary */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {Object.keys(STATUS_CONFIG).map(status => (
          <Chip
            key={status}
            label={`${status}: ${getStatusCount(status)}`}
            size="small"
            color={statusFilter === status ? 'primary' : 'default'}
            onClick={() => setStatusFilter(status)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* Agents Grid */}
      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {filteredAgents.length === 0 ? (
            <Grid item xs={12}>
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  ไม่พบ agent ที่ตรงกับเงื่อนไข
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredAgents.map(agent => (
              <Grid item xs={12} sm={6} md={4} key={agent.agentCode}>
                <AgentCard agent={agent} />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Paper>
  );
}

export default TeamOverview;
```

### 💬 Message Panel Component

สร้างไฟล์ `src/components/MessagePanel.js`:
```javascript
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Send as SendIcon,
  Broadcast as BroadcastIcon,
  Person as PersonIcon
} from '@mui/icons-material';

function MessagePanel({ supervisor, agents, onMessageSent }) {
  const [messageType, setMessageType] = useState('direct');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // กรอง agents ที่ออนไลน์
  const onlineAgents = agents.filter(agent => agent.currentStatus !== 'Offline');

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('กรุณาใส่ข้อความ');
      return;
    }

    if (messageType === 'direct' && !selectedAgent) {
      setError('กรุณาเลือก agent');
      return;
    }

    setSending(true);
    setError('');

    try {
      const messageData = {
        fromCode: supervisor.agentCode,
        toCode: messageType === 'direct' ? selectedAgent : null,
        message: message.trim(),
        type: messageType
      };

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        setMessage('');
        setSelectedAgent('');
        onMessageSent?.(messageData);
      } else {
        throw new Error('ส่งข้อความไม่สำเร็จ');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการส่งข้อความ');
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  const getMessageLimit = () => {
    return messageType === 'broadcast' ? 1000 : 500;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ส่งข้อความ
        </Typography>

        {/* Message Type */}
        <FormControl fullWidth margin="normal">
          <InputLabel>ประเภทข้อความ</InputLabel>
          <Select
            value={messageType}
            label="ประเภทข้อความ"
            onChange={(e) => {
              setMessageType(e.target.value);
              setSelectedAgent('');
              setError('');
            }}
          >
            <MenuItem value="direct">
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" />
                ส่งถึงคนเดียว
              </Box>
            </MenuItem>
            <MenuItem value="broadcast">
              <Box display="flex" alignItems="center" gap={1}>
                <BroadcastIcon fontSize="small" />
                ส่งกระจายทั้งทีม
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Agent Selection */}
        {messageType === 'direct' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>เลือก Agent</InputLabel>
            <Select
              value={selectedAgent}
              label="เลือก Agent"
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {onlineAgents.map(agent => (
                <MenuItem key={agent.agentCode} value={agent.agentCode}>
                  {agent.agentName} ({agent.agentCode}) - {agent.currentStatus}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Message Input */}
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="ข้อความ"
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= getMessageLimit()) {
              setMessage(e.target.value);
              setError('');
            }
          }}
          placeholder={
            messageType === 'broadcast' 
              ? 'ข้อความที่จะส่งให้ทั้งทีม...'
              : 'ข้อความที่จะส่ง...'
          }
          helperText={`${message.length}/${getMessageLimit()} ตัวอักษร`}
        />

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {/* Send Button */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={sending || !message.trim() || (messageType === 'direct' && !selectedAgent)}
          >
            {sending ? 'กำลังส่ง...' : 'ส่งข้อความ'}
          </Button>
        </Box>

        {/* Agent Summary */}
        <Box mt={3} pt={2} borderTop="1px solid #eee">
          <Typography variant="body2" color="text.secondary">
            Agent ออนไลน์: {onlineAgents.length} คน
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default MessagePanel;
```

### ✅ เช็คลิสต์ Core Components
- [x] App.js - Main application with theme & authentication
- [x] Login.js - Supervisor login form  
- [x] Dashboard.js - Main dashboard layout
- [x] TeamOverview.js - Agent status display with filtering
- [x] MessagePanel.js - Message sending interface

### 🧪 ทดสอบ Core Components

#### 1. ทดสอบ Login Component
```bash
# เริ่ม development server
npm start

# ทดสอบการเข้าสู่ระบบด้วยรหัสเหล่านี้:
# SP001, SP002, SP003
```

#### 2. ทดสอบ Dashboard
- ตรวจสอบว่า header แสดงชื่อ supervisor
- ตรวจสอบว่า refresh button ทำงาน
- ตรวจสอบว่า logout button ทำงาน

#### 3. ทดสอบ Team Overview  
- ตรวจสอบว่าแสดง agent cards ได้
- ทดสอบ filter ตาม status
- ตรวจสอบ status summary chips

#### 4. ทดสอบ Message Panel
- ทดสอบส่งข้อความ direct
- ทดสอบส่งข้อความ broadcast  
- ตรวจสอบ validation (ข้อความเปล่า, ไม่เลือก agent)

### 🎨 การปรับแต่ง Styling

เพิ่มไฟล์ `src/index.css` สำหรับ global styles:
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

### 🔧 Services & Utils

#### API Service (src/services/api.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// ฟังก์ชันสำหรับเรียก API
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific API functions
export const login = (agentCode) => 
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ agentCode }),
  });

export const getTeamAgents = (teamId) => 
  apiCall(`/agents/team/${teamId}`);

export const sendMessage = (messageData) => 
  apiCall('/messages/send', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
```

#### Socket Service (src/services/socket.js)
```javascript
import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (supervisorCode) => {
  const socketURL = process.env.REACT_APP_SOCKET_URL || window.location.origin;
  
  socket = io(socketURL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('join_supervisor_room', supervisorCode);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

#### Constants (src/utils/constants.js)
```javascript
export const STATUS_TYPES = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  BREAK: 'Break',
  OFFLINE: 'Offline'
};

export const MESSAGE_TYPES = {
  DIRECT: 'direct',
  BROADCAST: 'broadcast'
};

export const STATUS_COLORS = {
  Available: '#4caf50',
  Busy: '#ff9800', 
  Break: '#2196f3',
  Offline: '#757575'
};

export const STATUS_ICONS = {
  Available: '✅',
  Busy: '🔄',
  Break: '☕', 
  Offline: '🔴'
};
```

### 📱 การทำให้ Responsive

เพิ่มใน Dashboard.js:
```javascript
// เพิ่ม import
import { useTheme, useMediaQuery } from '@mui/material';

// ใน component
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// ปรับ Grid layout
<Grid container spacing={3}>
  <Grid item xs={12} md={isMobile ? 12 : 8}>
    <TeamOverview />
  </Grid>
  <Grid item xs={12} md={isMobile ? 12 : 4}>
    <MessagePanel />
  </Grid>
</Grid>
```

### 🐛 การจัดการ Error

เพิ่ม Error Boundary component `src/components/ErrorBoundary.js`:
```javascript
import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
          p={3}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            เกิดข้อผิดพลาดในแอปพลิเคชัน
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            รีเฟรชหน้า
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 📝 Entry Point (src/index.js)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

### 🚀 การรัน Development

```bash
# ติดตั้ง dependencies
npm install

# เริ่ม development server
npm start

# เปิดเบราว์เซอร์ที่ http://localhost:3000
```

### ✅ Final Checklist

**Core Functionality:**
- [x] Supervisor login ด้วย agent code
- [x] Dashboard layout พร้อม header และ navigation  
- [x] Team overview แสดง agent cards พร้อม status
- [x] Message panel ส่งข้อความ direct และ broadcast
- [x] Status filtering และ refresh functionality
- [x] Error handling และ loading states
- [x] Responsive design basics
- [x] Material-UI theming

**Ready for Integration:**
- [x] API service structure
- [x] Socket service structure  
- [x] Constants และ utilities
- [x] Error boundary
- [x] Environment configuration

### 🎯 สิ่งที่นักศึกษาจะได้เรียนรู้

1. **React Fundamentals** - Components, State, Props, Hooks
2. **Material-UI** - Component library, Theming, Icons
3. **API Integration** - Fetch API, Error handling, Loading states
4. **State Management** - useState, useEffect, Local storage
5. **Form Handling** - Input validation, Form submission
6. **Responsive Design** - Grid system, Breakpoints
7. **Error Handling** - Try-catch, Error boundaries
8. **Code Organization** - Component structure, Services, Utils

### 📋 Next Steps สำหรับการพัฒนาต่อ

1. **Real-time Integration** - เชื่อมต่อ WebSocket สำหรับ live updates
2. **Advanced Features** - Status history, Performance metrics  
3. **Testing** - Unit tests, Integration tests
4. **Deployment** - Build และ deploy production

**Core Components พร้อมใช้งานแล้ว! 🎉**