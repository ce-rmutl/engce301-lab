# Supervisor Dashboard - Advanced Features (Part 2)

## 4. Real-time Integration (WebSocket)

### 📡 ภาพรวม WebSocket Integration
WebSocket ช่วยให้ Supervisor Dashboard สามารถรับข้อมูล Real-time ได้:
- **Agent Status Updates** - สถานะ agent เปลี่ยนแปลงทันที
- **New Messages** - แจ้งเตือนเมื่อมีข้อความใหม่
- **Connection Status** - ติดตาม agent ที่เชื่อมต่อ/ตัดการเชื่อมต่อ

### 🔧 Socket Service Implementation

#### 1. Enhanced Socket Service (src/services/socket.js)
```javascript
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  // เชื่อมต่อ WebSocket
  connect(supervisorCode) {
    const socketURL = process.env.REACT_APP_SOCKET_URL || window.location.origin;
    
    this.socket = io(socketURL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 10000,
      forceNew: true
    });

    this.setupEventListeners(supervisorCode);
    return this.socket;
  }

  // ตั้งค่า Event listeners
  setupEventListeners(supervisorCode) {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join supervisor room
      this.socket.emit('join_supervisor_room', supervisorCode);
      
      // แจ้ง listeners ว่าเชื่อมต่อแล้ว
      this.notifyListeners('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
      this.notifyListeners('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      this.isConnected = false;
      this.notifyListeners('connection_error', { error });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = attemptNumber;
      
      // Rejoin supervisor room
      this.socket.emit('join_supervisor_room', supervisorCode);
    });

    // Agent status change events
    this.socket.on('agent_status_change', (data) => {
      console.log('📊 Agent status changed:', data);
      this.notifyListeners('agent_status_change', data);
    });

    // Agent connection events  
    this.socket.on('agent_connected', (data) => {
      console.log('🟢 Agent connected:', data);
      this.notifyListeners('agent_connected', data);
    });

    this.socket.on('agent_disconnected', (data) => {
      console.log('🔴 Agent disconnected:', data);
      this.notifyListeners('agent_disconnected', data);
    });

    // Message events
    this.socket.on('message_delivered', (data) => {
      console.log('📨 Message delivered:', data);
      this.notifyListeners('message_delivered', data);
    });

    this.socket.on('message_read', (data) => {
      console.log('👁️ Message read:', data);
      this.notifyListeners('message_read', data);
    });
  }

  // เพิ่ม event listener
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // ลบ event listener
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // แจ้ง listeners
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // ส่งข้อความ
  sendMessage(messageData) {
    if (!this.isConnected) {
      throw new Error('Socket not connected');
    }

    if (messageData.type === 'broadcast') {
      this.socket.emit('send_broadcast_message', messageData);
    } else {
      this.socket.emit('send_direct_message', messageData);
    }
  }

  // ตัดการเชื่อมต่อ
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // สถานะการเชื่อมต่อ
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;
```

#### 2. Custom Hook สำหรับ Socket (src/hooks/useSocket.js)
```javascript
import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = (supervisorCode) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    if (!supervisorCode) return;

    // Event handlers
    const handleConnectionStatus = ({ connected, reason }) => {
      setIsConnected(connected);
      if (!connected && reason) {
        setConnectionError(reason);
      } else {
        setConnectionError(null);
      }
    };

    const handleConnectionError = ({ error }) => {
      setConnectionError(error.message || 'Connection failed');
    };

    // เชื่อมต่อ socket
    socketService.connect(supervisorCode);
    
    // ลงทะเบียน event listeners
    socketService.addEventListener('connection_status', handleConnectionStatus);
    socketService.addEventListener('connection_error', handleConnectionError);

    // Cleanup
    return () => {
      socketService.removeEventListener('connection_status', handleConnectionStatus);
      socketService.removeEventListener('connection_error', handleConnectionError);
      socketService.disconnect();
    };
  }, [supervisorCode]);

  // ส่งข้อความ
  const sendMessage = useCallback((messageData) => {
    try {
      socketService.sendMessage(messageData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Subscribe to events
  const useSocketEvent = useCallback((event, callback) => {
    useEffect(() => {
      socketService.addEventListener(event, callback);
      return () => {
        socketService.removeEventListener(event, callback);
      };
    }, [event, callback]);
  }, []);

  return {
    isConnected,
    connectionError,
    reconnectAttempts,
    sendMessage,
    useSocketEvent,
    connectionStatus: socketService.getConnectionStatus()
  };
};
```

#### 3. Real-time Agent Status Hook (src/hooks/useRealtimeAgents.js)
```javascript
import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

export const useRealtimeAgents = (initialAgents, supervisorCode) => {
  const [agents, setAgents] = useState(initialAgents || []);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { useSocketEvent } = useSocket(supervisorCode);

  // อัปเดต initial agents
  useEffect(() => {
    if (initialAgents) {
      setAgents(initialAgents);
      setLastUpdate(new Date());
    }
  }, [initialAgents]);

  // Handle agent status changes
  const handleAgentStatusChange = useCallback((data) => {
    const { agentCode, status, timestamp } = data;
    
    setAgents(prevAgents => {
      const updatedAgents = prevAgents.map(agent => 
        agent.agentCode === agentCode 
          ? { 
              ...agent, 
              currentStatus: status,
              lastUpdate: new Date(timestamp),
              statusSince: new Date(timestamp)
            }
          : agent
      );
      
      setLastUpdate(new Date());
      return updatedAgents;
    });
  }, []);

  // Handle agent connection
  const handleAgentConnected = useCallback((data) => {
    const { agentCode, timestamp } = data;
    
    setAgents(prevAgents => {
      const updatedAgents = prevAgents.map(agent => 
        agent.agentCode === agentCode 
          ? { 
              ...agent, 
              currentStatus: 'Available',
              lastUpdate: new Date(timestamp),
              isOnline: true
            }
          : agent
      );
      
      setLastUpdate(new Date());
      return updatedAgents;
    });
  }, []);

  // Handle agent disconnection
  const handleAgentDisconnected = useCallback((data) => {
    const { agentCode, timestamp } = data;
    
    setAgents(prevAgents => {
      const updatedAgents = prevAgents.map(agent => 
        agent.agentCode === agentCode 
          ? { 
              ...agent, 
              currentStatus: 'Offline',
              lastUpdate: new Date(timestamp),
              isOnline: false
            }
          : agent
      );
      
      setLastUpdate(new Date());
      return updatedAgents;
    });
  }, []);

  // Subscribe to socket events
  useSocketEvent('agent_status_change', handleAgentStatusChange);
  useSocketEvent('agent_connected', handleAgentConnected);
  useSocketEvent('agent_disconnected', handleAgentDisconnected);

  // คำนวณสถิติ
  const getTeamStats = useCallback(() => {
    const totalAgents = agents.length;
    const onlineAgents = agents.filter(agent => agent.currentStatus !== 'Offline').length;
    
    const statusBreakdown = agents.reduce((acc, agent) => {
      const status = agent.currentStatus || 'Offline';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const utilization = totalAgents > 0 
      ? Math.round(((statusBreakdown.Available || 0) + (statusBreakdown.Busy || 0)) / totalAgents * 100)
      : 0;

    return {
      totalAgents,
      onlineAgents,
      utilization,
      statusBreakdown,
      lastUpdate
    };
  }, [agents, lastUpdate]);

  return {
    agents,
    teamStats: getTeamStats(),
    lastUpdate
  };
};
```

### 🔄 Integration กับ Components

#### 4. Updated Dashboard.js with Real-time
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
  Chip,
  Alert
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  WifiOff as OfflineIcon
} from '@mui/icons-material';
import TeamOverview from './TeamOverview';
import MessagePanel from './MessagePanel';
import { useSocket } from '../hooks/useSocket';
import { useRealtimeAgents } from '../hooks/useRealtimeAgents';

function Dashboard({ supervisor, onNotification, onLogout }) {
  const [initialAgents, setInitialAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Real-time connection
  const { isConnected, connectionError, sendMessage } = useSocket(supervisor.agentCode);
  
  // Real-time agents data
  const { agents, teamStats, lastUpdate } = useRealtimeAgents(
    initialAgents, 
    supervisor.agentCode
  );

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, [supervisor.teamId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/agents/team/${supervisor.teamId}`);
      if (response.ok) {
        const result = await response.json();
        
        // เพิ่มข้อมูล mock status
        const agentsWithStatus = (result.agents || []).map(agent => ({
          ...agent,
          currentStatus: ['Available', 'Busy', 'Break', 'Offline'][Math.floor(Math.random() * 4)],
          lastUpdate: new Date(),
          isOnline: Math.random() > 0.3 // 70% online
        }));
        
        setInitialAgents(agentsWithStatus);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      onNotification('ไม่สามารถโหลดข้อมูล agents ได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = async (messageData) => {
    try {
      // ส่งผ่าน Socket สำหรับ real-time
      const socketResult = sendMessage(messageData);
      
      if (socketResult.success) {
        onNotification(
          messageData.type === 'broadcast' 
            ? 'ส่งข้อความกระจายเสียงแล้ว' 
            : `ส่งข้อความถึง ${messageData.toCode} แล้ว`, 
          'success'
        );
      } else {
        // Fallback ใช้ API
        const response = await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          onNotification('ส่งข้อความแล้ว (ผ่าน API)', 'success');
        } else {
          throw new Error('ส่งข้อความไม่สำเร็จ');
        }
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการส่งข้อความ', 'error');
    }
  };

  const getConnectionStatusColor = () => {
    if (connectionError) return 'error';
    return isConnected ? 'success' : 'warning';
  };

  const getConnectionStatusText = () => {
    if (connectionError) return 'เกิดข้อผิดพลาด';
    return isConnected ? 'เชื่อมต่อแล้ว' : 'กำลังเชื่อมต่อ...';
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {supervisor.agentName} - Dashboard
          </Typography>
          
          {/* Connection Status */}
          <Chip
            size="small"
            label={getConnectionStatusText()}
            color={getConnectionStatusColor()}
            icon={!isConnected ? <OfflineIcon /> : undefined}
            sx={{ mr: 2 }}
          />
          
          <IconButton color="inherit" onClick={fetchInitialData}>
            <RefreshIcon />
          </IconButton>
          
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Connection Error Alert */}
      {connectionError && (
        <Alert severity="error" sx={{ m: 2 }}>
          การเชื่อมต่อ Real-time มีปัญหา: {connectionError}
        </Alert>
      )}

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TeamOverview 
              agents={agents}
              teamStats={teamStats}
              loading={loading}
              lastUpdate={lastUpdate}
              isRealtime={isConnected}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <MessagePanel 
              supervisor={supervisor}
              agents={agents}
              onMessageSent={handleMessageSent}
              isRealtime={isConnected}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
```

#### 5. Real-time Status Indicators
เพิ่มใน TeamOverview.js:
```javascript
// เพิ่มใน header ของ TeamOverview
<Box display="flex" alignItems="center" gap={1}>
  <Typography variant="h6">
    ภาพรวมทีม ({filteredAgents.length} คน)
  </Typography>
  
  {isRealtime && (
    <Chip 
      size="small" 
      label="Real-time" 
      color="success"
      sx={{ fontSize: '0.7rem' }}
    />
  )}
  
  <Typography variant="caption" color="text.secondary">
    อัปเดตล่าสุด: {lastUpdate.toLocaleTimeString()}
  </Typography>
</Box>
```

---

## 5. Basic Styling (UI/UX)

### 🎨 Material-UI Theme Customization

#### 1. Enhanced Theme (src/theme/index.js)
```javascript
import { createTheme } from '@mui/material/styles';

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
      light: '#ff5983',
      dark: '#9a0036',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
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
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#666666',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    // Button customization
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    
    // Card customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    
    // Paper customization
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.06)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      },
    },
    
    // TextField customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0,0,0,0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    
    // Chip customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        outlined: {
          backgroundColor: 'rgba(255,255,255,0.8)',
        },
      },
    },
    
    // AppBar customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export default theme;
```

#### 2. Status-specific Styling (src/utils/statusStyles.js)
```javascript
export const getStatusStyle = (status) => {
  const statusStyles = {
    Available: {
      color: '#4caf50',
      backgroundColor: '#e8f5e8',
      borderColor: '#4caf50',
      icon: '✅',
      label: 'พร้อมทำงาน'
    },
    Busy: {
      color: '#ff9800',
      backgroundColor: '#fff3e0',
      borderColor: '#ff9800',
      icon: '🔄',
      label: 'ไม่ว่าง'
    },
    Break: {
      color: '#2196f3',
      backgroundColor: '#e3f2fd',
      borderColor: '#2196f3',
      icon: '☕',
      label: 'พักเบรก'
    },
    Meeting: {
      color: '#9c27b0',
      backgroundColor: '#f3e5f5',
      borderColor: '#9c27b0',
      icon: '📋',
      label: 'ประชุม'
    },
    Offline: {
      color: '#757575',
      backgroundColor: '#fafafa',
      borderColor: '#757575',
      icon: '🔴',
      label: 'ออฟไลน์'
    }
  };

  return statusStyles[status] || statusStyles.Offline;
};

export const getStatusAnimation = (status) => {
  const animations = {
    Available: {
      animation: 'pulse 2s infinite',
      '@keyframes pulse': {
        '0%': {
          boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
        },
        '70%': {
          boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
        },
        '100%': {
          boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
        },
      },
    },
    Busy: {
      animation: 'blink 1.5s infinite',
      '@keyframes blink': {
        '0%, 50%': { opacity: 1 },
        '25%, 75%': { opacity: 0.6 },
      },
    },
  };

  return animations[status] || {};
};
```

#### 3. Enhanced Agent Card Component
```javascript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Message as MessageIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getStatusStyle, getStatusAnimation } from '../utils/statusStyles';

function EnhancedAgentCard({ agent, onSendMessage, isRealtime }) {
  const statusStyle = getStatusStyle(agent.currentStatus);
  const statusAnimation = getStatusAnimation(agent.currentStatus);

  const getStatusDuration = () => {
    if (!agent.statusSince) return '0m';
    const now = new Date();
    const since = new Date(agent.statusSince);
    const diffInMinutes = Math.floor((now - since) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const hours = Math.floor(diffInMinutes / 60);
    const mins = diffInMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProductivityScore = () => {
    // Mock productivity calculation
    return Math.floor(Math.random() * 40) + 60;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        background: `linear-gradient(135deg, ${statusStyle.backgroundColor} 0%, white 100%)`,
        border: `2px solid ${statusStyle.borderColor}30`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${statusStyle.color}40`,
          borderColor: statusStyle.color,
        },
        ...statusAnimation,
      }}
    >
      {/* Real-time Indicator */}
      {isRealtime && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#4caf50',
            animation: 'pulse 2s infinite',
          }}
        />
      )}

      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: statusStyle.color,
          boxShadow: `0 0 0 3px ${statusStyle.color}30`,
        }}
      />

      <CardContent sx={{ p: 2 }}>
        {/* Agent Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: statusStyle.color,
              mr: 2,
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: `0 2px 8px ${statusStyle.color}40`,
            }}
          >
            {agent.agentName?.charAt(0) || <PersonIcon />}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {agent.agentName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {agent.agentCode}
            </Typography>
          </Box>
          
          {agent.currentStatus !== 'Offline' && (
            <Tooltip title="ส่งข้อความ">
              <IconButton 
                size="small" 
                onClick={() => onSendMessage?.(agent)}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: