# Supervisor Dashboard - Real-time Integration (WebSocket)

## 4. Real-time Integration (WebSocket)

### 📡 ภาพรวม WebSocket Integration

WebSocket ช่วยให้ Supervisor Dashboard สามารถรับข้อมูล Real-time ได้:
- **Agent Status Updates** - สถานะ agent เปลี่ยนแปลงทันที
- **New Messages** - แจ้งเตือนเมื่อมีข้อความใหม่
- **Connection Status** - ติดตาม agent ที่เชื่อมต่อ/ตัดการเชื่อมต่อ

### 🎯 เป้าหมายการเรียนรู้
- เข้าใจการทำงานของ WebSocket
- การจัดการ Real-time events
- Error handling และ reconnection logic
- Integration กับ React components

---

## 🔧 Socket Service Implementation

### 1. Basic Socket Service (src/services/socket.js)

```javascript
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // เชื่อมต่อ WebSocket
  connect(supervisorCode) {
    const socketURL = process.env.REACT_APP_SOCKET_URL || window.location.origin;
    
    this.socket = io(socketURL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 10000
    });

    this.setupEventListeners(supervisorCode);
    return this.socket;
  }

  // ตั้งค่า Event listeners
  setupEventListeners(supervisorCode) {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      
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
      socketId: this.socket?.id
    };
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;
```

### 2. Custom Hook สำหรับ Socket (src/hooks/useSocket.js)

```javascript
import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = (supervisorCode) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

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
    sendMessage,
    useSocketEvent,
    connectionStatus: socketService.getConnectionStatus()
  };
};
```

### 3. Real-time Agent Status Hook (src/hooks/useRealtimeAgents.js)

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

---

## 🔄 Integration กับ Components

### 4. Updated Dashboard.js with Real-time

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

### 5. Real-time Status Indicators

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

เพิ่มใน MessagePanel.js:
```javascript
// เพิ่มใน Send Button
<Button
  variant="contained"
  endIcon={<SendIcon />}
  onClick={handleSendMessage}
  disabled={sending || !message.trim() || (messageType === 'direct' && !selectedAgent)}
  color={isRealtime ? 'primary' : 'secondary'}
>
  {sending ? 'กำลังส่ง...' : 'ส่งข้อความ'}
  {isRealtime && ' (Real-time)'}
</Button>
```

---

## 🧪 Testing Real-time Features

### 6. Mock Socket for Testing

สร้าง `src/__mocks__/socket.js`:
```javascript
export class MockSocket {
  constructor() {
    this.callbacks = {};
    this.connected = false;
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  emit(event, data) {
    console.log(`Mock socket emit: ${event}`, data);
  }

  disconnect() {
    this.connected = false;
    this.trigger('disconnect', 'client disconnect');
  }

  connect() {
    this.connected = true;
    this.trigger('connect');
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }
}

const mockSocketService = {
  socket: new MockSocket(),
  connect: jest.fn().mockImplementation((supervisorCode) => {
    mockSocketService.socket.connect();
    return mockSocketService.socket;
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  disconnect: jest.fn(),
  sendMessage: jest.fn().mockReturnValue({ success: true }),
  getConnectionStatus: jest.fn().mockReturnValue({ 
    connected: true, 
    socketId: 'mock-socket-id' 
  }),
};

export default mockSocketService;
```

### 7. Test Real-time Updates

```javascript
import { renderHook, act } from '@testing-library/react';
import { useRealtimeAgents } from '../hooks/useRealtimeAgents';

// Mock the useSocket hook
jest.mock('../hooks/useSocket', () => ({
  useSocket: () => ({
    useSocketEvent: jest.fn(),
  }),
}));

describe('useRealtimeAgents', () => {
  const mockAgents = [
    { agentCode: 'AG001', currentStatus: 'Available' },
    { agentCode: 'AG002', currentStatus: 'Busy' },
  ];

  test('updates agent status in real-time', () => {
    const { result } = renderHook(() => 
      useRealtimeAgents(mockAgents, 'SP001')
    );

    expect(result.current.agents).toHaveLength(2);
    expect(result.current.teamStats.totalAgents).toBe(2);
  });
});
```

---

## 🔧 Troubleshooting WebSocket

### 8. Common Issues & Solutions

#### Connection Issues
```javascript
// ใน socket service, เพิ่ม connection retry logic
setupConnectionRetry() {
  let retryCount = 0;
  const maxRetries = 5;
  
  const retry = () => {
    if (retryCount < maxRetries && !this.isConnected) {
      retryCount++;
      console.log(`🔄 Retry connection attempt ${retryCount}/${maxRetries}`);
      
      setTimeout(() => {
        if (!this.isConnected) {
          this.connect(this.lastSupervisorCode);
        }
      }, retryCount * 2000); // Exponential backoff
    } else if (retryCount >= maxRetries) {
      console.error('❌ Max retry attempts reached');
      this.notifyListeners('max_retries_reached', { retryCount });
    }
  };

  this.socket.on('connect_error', retry);
  this.socket.on('disconnect', retry);
}
```

#### Error Handling
```javascript
// เพิ่มใน useSocket hook
const [retryCount, setRetryCount] = useState(0);

useEffect(() => {
  const handleMaxRetries = ({ retryCount }) => {
    setRetryCount(retryCount);
    setConnectionError(`ไม่สามารถเชื่อมต่อได้หลังจากพยายาม ${retryCount} ครั้ง`);
  };

  socketService.addEventListener('max_retries_reached', handleMaxRetries);
  
  return () => {
    socketService.removeEventListener('max_retries_reached', handleMaxRetries);
  };
}, []);
```

### 9. Performance Optimization

```javascript
// ใน useRealtimeAgents, เพิ่ม debouncing
import { useMemo, debounce } from 'lodash';

const debouncedUpdateStats = useMemo(
  () => debounce(() => {
    setLastUpdate(new Date());
  }, 1000),
  []
);

// ใช้ในการอัปเดต agent status
const handleAgentStatusChange = useCallback((data) => {
  // ... update logic
  debouncedUpdateStats();
}, [debouncedUpdateStats]);
```

---

## ✅ การทดสอบ Real-time Integration

### 10. Manual Testing Steps

1. **Connection Test**
   - เปิด browser developer tools
   - ดูใน Network tab ว่า WebSocket connection สร้างสำเร็จ
   - ตรวจสอบ console logs

2. **Status Update Test**
   - เปิด Agent desktop app
   - เปลี่ยนสถานะใน Agent app
   - ดูใน Supervisor dashboard ว่าสถานะเปลี่ยนทันที

3. **Message Test**
   - ส่งข้อความจาก Supervisor dashboard
   - ตรวจสอบใน Agent app ว่าได้รับข้อความ

4. **Error Handling Test**
   - ปิด backend server ชั่วคราว
   - ดูว่า dashboard แสดง error message
   - เปิด server กลับมาและดูว่า reconnect ได้

### ✅ Checklist
- [ ] WebSocket connection สร้างสำเร็จ
- [ ] Agent status updates แบบ real-time
- [ ] Message sending ผ่าน WebSocket
- [ ] Connection error handling ทำงาน
- [ ] Reconnection logic ทำงาน
- [ ] UI แสดง connection status ถูกต้อง

---

**Real-time Integration เสร็จสมบูรณ์! พร้อมสำหรับการใช้งาน** 🚀