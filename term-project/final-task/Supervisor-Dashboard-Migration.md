# 📘 6.6.3.2 Supervisor Dashboard Migration Guide v4.0

**คู่มือการ Migrate Supervisor Dashboard ให้รองรับ Backend v1.2**

---

## 📋 สารบัญ

1. [ภาพรวม Supervisor Dashboard](#ภาพรวม-supervisor-dashboard)
2. [การเปลี่ยนแปลงที่สำคัญ](#การเปลี่ยนแปลงที่สำคัญ)
3. [Migration Checklist](#migration-checklist)
4. [ไฟล์ที่ต้องแก้ไข](#ไฟล์ที่ต้องแก้ไข)
5. [การทดสอบ](#การทดสอบ)
6. [Troubleshooting](#troubleshooting)

---

## ภาพรวม Supervisor Dashboard

### 🎯 ความสามารถหลัก

**Supervisor Dashboard** เป็น **React Web Application** สำหรับ Supervisors จัดการและติดตามทีม:

```
ฟีเจอร์หลัก:
├─ 🔐 Login (Supervisor accounts)
├─ 👥 View team agents (real-time)
├─ 📊 Monitor agent status
├─ 💬 Send messages (Direct + Broadcast)
├─ 📜 View message history
└─ 🔔 Real-time notifications
```

### 📁 โครงสร้างโปรเจค (Existing)

```
supervisor-dashboard/
├─ public/
│   └─ index.html
├─ src/
│   ├─ index.js
│   ├─ App.js
│   ├─ components/
│   │   ├─ LoginForm.js
│   │   ├─ Dashboard.js
│   │   ├─ AgentList.js
│   │   ├─ AgentCard.js
│   │   ├─ MessagePanel.js
│   │   ├─ SendMessageForm.js
│   │   └─ MessageHistory.js
│   ├─ services/
│   │   ├─ api.js
│   │   ├─ socket.js
│   │   └─ notifications.js
│   ├─ utils/
│   │   ├─ logger.js
│   │   └─ validation.js
│   └─ styles/
│       ├─ App.css
│       └─ components.css
└─ package.json
```

---

## การเปลี่ยนแปลงที่สำคัญ

### 🔄 Summary Table

| Component | เดิม (v3.2) | ใหม่ (v4.0) | ระดับความยาก |
|-----------|-------------|-------------|--------------|
| **Login** | `agentCode` (SP001) | `username` (SP001) | ⭐ ง่าย |
| **Agent List API** | `/api/agents` | `/api/agents` (structure เปลี่ยน) | ⭐⭐ ปานกลาง |
| **Agent Object** | `agentCode`, `agentName` | `username`, `fullName`, `role` | ⭐⭐ ปานกลาง |
| **Send Message** | `toCode` | `toCode` (ยังเหมือนเดิม) | ⭐ ง่าย |
| **WebSocket** | `agentCode` | `agentCode` (ไม่เปลี่ยน) | ⭐ ง่าย (อ่านเข้าใจ) |
| **Filter Agents** | By team ID | By `role` AND `teamId` | ⭐⭐ ปานกลาง |

### 📊 Impact Analysis

```
🔴 Critical Changes (ต้องแก้ทันที):
├─ Login API request/response
├─ Agent list display (property names)
└─ Supervisor info display

🟡 Medium Changes:
├─ Filter logic (เพิ่ม role filter)
├─ Agent card component
└─ Real-time updates handling

🟢 Low/No Changes:
├─ Send message API (structure เหมือนเดิม)
├─ WebSocket events (ยังใช้ agentCode)
└─ Message history display
```

---

## Migration Checklist

### ✅ Pre-Migration Checklist

```bash
Before Starting:
├─ [ ] Backend v1.2 running และทดสอบแล้ว
├─ [ ] Database มี users table พร้อม sample data
├─ [ ] Git commit current state
├─ [ ] Backup supervisor-dashboard folder
└─ [ ] Read this guide completely

Environment Check:
├─ [ ] Node.js v18+
├─ [ ] npm dependencies installed
├─ [ ] Backend API health check ผ่าน
└─ [ ] Postman collection ready
```

### 📋 Migration Steps Checklist

```bash
Phase 1: Services Layer (30 นาที)
├─ [ ] api.js - Update API calls
├─ [ ] socket.js - Review (no changes needed)
└─ [ ] Test API calls with console.log

Phase 2: Components (60 นาที)
├─ [ ] LoginForm.js - Update login flow
├─ [ ] Dashboard.js - Update supervisor info
├─ [ ] AgentList.js - Update filtering logic
├─ [ ] AgentCard.js - Update property names
├─ [ ] MessagePanel.js - Update if needed
└─ [ ] SendMessageForm.js - Verify compatibility

Phase 3: App.js (30 นาที)
├─ [ ] Update state management
├─ [ ] Update WebSocket handlers
└─ [ ] Update error handling

Phase 4: Testing (30 นาที)
├─ [ ] Login test
├─ [ ] Agent list display test
├─ [ ] Send message test
└─ [ ] Real-time updates test

Total Time: ~2.5 hours
```

---

## ไฟล์ที่ต้องแก้ไข

### 1️⃣ **src/services/api.js** (ปานกลาง - 30 นาที)

#### 📍 A. Function: `loginSupervisor`

```javascript
// ❌ เดิม (Version 3.2)
export const loginSupervisor = async (agentCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentCode })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};
```

```javascript
// ✅ ใหม่ (Version 4.0)
export const loginSupervisor = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })  // ✅ เปลี่ยนเป็น username
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // ✅ Validate response structure
    if (!data.success || !data.user) {
      throw new Error('Invalid response structure');
    }

    // ✅ Check if user is Supervisor
    if (data.user.role !== 'Supervisor') {
      throw new Error('Access denied. Supervisor role required.');
    }

    // ✅ Handle token
    const token = data.user.token || data.token;
    if (token) {
      setAuthToken(token);
    }
    
    console.log('✅ Supervisor login successful');
    return data;
  } catch (error) {
    console.error('❌ Login API Error:', error);
    throw error;
  }
};
```

**🎓 สิ่งที่เรียนรู้:**
- เปลี่ยน `agentCode` → `username`
- ตรวจสอบ `role === 'Supervisor'`
- Validate response structure
- รองรับ token ทั้ง 2 ตำแหน่ง

---

#### 📍 B. Function: `getAgents` (สำคัญ!)

```javascript
// ❌ เดิม (Version 3.2)
export const getAgents = async (teamId = null) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    let url = `${API_BASE_URL}/agents`;
    if (teamId) {
      url += `?teamId=${teamId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get agents');
    }
    
    return data;
  } catch (error) {
    console.error('Get Agents API Error:', error);
    throw error;
  }
};
```

```javascript
// ✅ ใหม่ (Version 4.0)
export const getAgents = async (filters = {}) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    // ✅ Build query string with multiple filters
    const params = new URLSearchParams();
    
    if (filters.teamId) {
      params.append('teamId', filters.teamId);
    }
    
    if (filters.role) {
      params.append('role', filters.role);  // ✅ เพิ่ม role filter
    }
    
    if (filters.status) {
      params.append('status', filters.status);
    }

    const url = `${API_BASE_URL}/agents?${params.toString()}`;
    console.log('📡 Fetching agents:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get agents');
    }
    
    // ✅ Log for debugging
    console.log('✅ Loaded', data.agents?.length || 0, 'agents');
    
    return data;
  } catch (error) {
    console.error('❌ Get Agents API Error:', error);
    throw error;
  }
};
```

**🎓 สิ่งที่เรียนรู้:**
- รองรับ multiple filters (`teamId`, `role`, `status`)
- ใช้ `URLSearchParams` สร้าง query string
- เพิ่ม logging เพื่อ debug
- Response structure: `data.agents` เป็น array of users

---

#### 📍 C. Function: `sendMessage`

```javascript
// ✅ ฟังก์ชันนี้ไม่ต้องเปลี่ยน!
// เพราะ Backend message API ยังใช้ toCode/fromCode

export const sendMessage = async (messageData) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        fromCode: messageData.fromCode,     // ✅ ยังใช้ code
        toCode: messageData.toCode,         // ✅ ยังใช้ code (optional for broadcast)
        content: messageData.content,
        type: messageData.type,             // 'direct' or 'broadcast'
        priority: messageData.priority || 'normal'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }
    
    console.log('✅ Message sent successfully');
    return data;
  } catch (error) {
    console.error('❌ Send Message API Error:', error);
    throw error;
  }
};
```

**🎓 สิ่งที่เรียนรู้:**
- Message API **ไม่เปลี่ยน** (ยังใช้ `fromCode`, `toCode`)
- ต้องใช้ `username` เป็น `code` (เพราะ format เดียวกัน)

---

#### 📍 D. Function: `getMessageHistory`

```javascript
// ✅ ต้องเปลี่ยน parameter name

// ❌ เดิม
export const getMessageHistory = async (agentCode, limit = 50) => {
  const url = `${API_BASE_URL}/messages/agent/${agentCode}?limit=${limit}`;
  // ...
};

// ✅ ใหม่
export const getMessageHistory = async (username, limit = 50) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const url = `${API_BASE_URL}/messages/agent/${username}?limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get message history');
    }
    
    console.log('✅ Loaded', data.messages?.length || 0, 'messages');
    return data;
  } catch (error) {
    console.error('❌ Get Message History Error:', error);
    throw error;
  }
};
```

---

**📝 ไฟล์สมบูรณ์: `src/services/api.js`**

<details>
<summary>คลิกเพื่อดูไฟล์เต็ม</summary>

```javascript
// services/api.js - Version 4.0 (Supervisor Dashboard)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
let authToken = null;

// ========================================
// Token Management
// ========================================

export const setAuthToken = (token) => {
  authToken = token;
  console.log('✅ Auth token set');
};

export const clearAuthToken = () => {
  authToken = null;
  console.log('🗑️ Auth token cleared');
};

export const getAuthToken = () => authToken;

// ========================================
// Authentication
// ========================================

/**
 * ✅ Login for Supervisors (Backend v1.2)
 */
export const loginSupervisor = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (!data.success || !data.user) {
      throw new Error('Invalid response structure');
    }

    // Check role
    if (data.user.role !== 'Supervisor') {
      throw new Error('Access denied. Supervisor role required.');
    }

    const token = data.user.token || data.token;
    if (token) {
      setAuthToken(token);
    }
    
    console.log('✅ Supervisor login successful');
    return data;
  } catch (error) {
    console.error('❌ Login API Error:', error);
    throw error;
  }
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    clearAuthToken();
    console.log('✅ Logout successful');
    return data;
  } catch (error) {
    console.error('❌ Logout API Error:', error);
    clearAuthToken();
    throw error;
  }
};

// ========================================
// Agent APIs
// ========================================

/**
 * ✅ Get agents with filters (Backend v1.2)
 */
export const getAgents = async (filters = {}) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const params = new URLSearchParams();
    
    if (filters.teamId) {
      params.append('teamId', filters.teamId);
    }
    
    if (filters.role) {
      params.append('role', filters.role);
    }
    
    if (filters.status) {
      params.append('status', filters.status);
    }

    const url = `${API_BASE_URL}/agents?${params.toString()}`;
    console.log('📡 Fetching agents:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get agents');
    }
    
    console.log('✅ Loaded', data.agents?.length || 0, 'agents');
    return data;
  } catch (error) {
    console.error('❌ Get Agents API Error:', error);
    throw error;
  }
};

/**
 * Get agent by username
 */
export const getAgentByUsername = async (username) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/agents/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get agent');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Get Agent Error:', error);
    throw error;
  }
};

// ========================================
// Message APIs
// ========================================

/**
 * ✅ Send message (ไม่เปลี่ยนแปลง - ยังใช้ code)
 */
export const sendMessage = async (messageData) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        fromCode: messageData.fromCode,
        toCode: messageData.toCode,
        content: messageData.content,
        type: messageData.type,
        priority: messageData.priority || 'normal'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }
    
    console.log('✅ Message sent successfully');
    return data;
  } catch (error) {
    console.error('❌ Send Message API Error:', error);
    throw error;
  }
};

/**
 * ✅ Get message history by username
 */
export const getMessageHistory = async (username, limit = 50) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const url = `${API_BASE_URL}/messages/agent/${username}?limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get message history');
    }
    
    console.log('✅ Loaded', data.messages?.length || 0, 'messages');
    return data;
  } catch (error) {
    console.error('❌ Get Message History Error:', error);
    throw error;
  }
};

/**
 * Get sent messages (by supervisor)
 */
export const getSentMessages = async (username, limit = 50) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const url = `${API_BASE_URL}/messages/sent/${username}?limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get sent messages');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Get Sent Messages Error:', error);
    throw error;
  }
};

// ========================================
// Health Check
// ========================================

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Server health check failed');
    }
    
    console.log('✅ Server healthy');
    return data;
  } catch (error) {
    console.error('❌ Health Check Error:', error);
    throw error;
  }
};
```

</details>

---

### 2️⃣ **src/services/socket.js** (ง่าย - 10 นาที - อ่านเข้าใจ)

#### ⚠️ **สำคัญ: ไฟล์นี้ไม่ต้องแก้ไข!**

```javascript
// services/socket.js - Version 4.0
// ⚠️ WebSocket ยังใช้ agentCode ตาม Backend socketHandler
// ไม่ต้องแก้ไขไฟล์นี้!

import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
let socket = null;

/**
 * ✅ Connect as Supervisor
 * ยังใช้ code (username) ตามเดิม
 */
export const connectSocket = (supervisorCode, role = 'Supervisor') => {
  if (!supervisorCode) {
    console.error('❌ connectSocket: supervisorCode is required');
    return null;
  }

  if (socket) {
    console.log('Disconnecting existing socket...');
    disconnectSocket();
  }

  console.log('🔌 Connecting to WebSocket...', SOCKET_URL);
  console.log('📋 Supervisor Code:', supervisorCode, 'Role:', role);

  try {
    socket = io(SOCKET_URL, {
      query: {
        agentCode: supervisorCode.toUpperCase(),  // ⬅️ ยังใช้ agentCode
        role: role,
        type: 'supervisor'  // ⬅️ ระบุเป็น supervisor
      },
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      socket.emit('supervisor_connect', { 
        agentCode: supervisorCode.toUpperCase(),
        role: role 
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    window.socket = socket;
    return socket;
    
  } catch (error) {
    console.error('❌ Failed to create socket:', error);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting WebSocket...');
    socket.disconnect();
    socket = null;
    window.socket = null;
  }
};

export const isSocketConnected = () => {
  return socket && socket.connected;
};

export const getSocket = () => socket;
```

**🎓 สิ่งที่เรียนรู้:**
- WebSocket ยังใช้ `agentCode` (ไม่เปลี่ยน)
- ต้องระบุ `type: 'supervisor'`
- Supervisor ใช้ `username` เป็น `agentCode`

---

### 3️⃣ **src/components/LoginForm.js** (ปานกลาง - 20 นาที)

```javascript
// components/LoginForm.js - Version 4.0

import React, { useState, useEffect } from 'react';
import { loginSupervisor, checkServerHealth } from '../services/api';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');  // ✅ เปลี่ยนจาก agentCode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      await checkServerHealth();
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
      setError('Backend server is not running.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!username || username.trim().length === 0) {
      setError('Username is required');
      return;
    }

    // ✅ Format validation (SP001-SP999)
    const supervisorRegex = /^SP\d{3}$/i;
    if (!supervisorRegex.test(username)) {
      setError('Invalid username format. Use SP001-SP999');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ Login with username
      const result = await loginSupervisor(username.toUpperCase());
      
      console.log('🔐 Login response:', result);
      
      // ✅ Validate response
      if (!result || !result.success) {
        throw new Error(result?.message || 'Login failed');
      }

      if (!result.user || !result.user.username) {
        throw new Error('Invalid response structure');
      }

      // ✅ Check role
      if (result.user.role !== 'Supervisor') {
        throw new Error('Access denied. Supervisor role required.');
      }

      const token = result.user.token || result.token;
      if (!token) {
        throw new Error('Missing authentication token');
      }

      console.log('✅ Supervisor login successful');
      
      // ✅ Send validated data
      onLogin(result.user, token);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      if (err.message.includes('fetch')) {
        setError('Cannot connect to server. Check if backend is running.');
        setServerStatus('offline');
      } else if (err.message.includes('Access denied')) {
        setError('Access denied. This account is not a Supervisor.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>👥 Supervisor Dashboard</h2>
          <p>Enter your supervisor username</p>
          
          <div className={`server-status ${serverStatus}`}>
            <span className="status-dot"></span>
            <span>Server: {serverStatus}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Supervisor Username</label>
            <input
              id="username"
              type="text"
              placeholder="e.g., SP001"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              disabled={loading || serverStatus === 'offline'}
              maxLength={5}
              autoFocus
            />
            <small className="hint">Format: SP001-SP999</small>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !username.trim() || serverStatus === 'offline'}
            className="login-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
              {serverStatus === 'offline' && (
                <button 
                  type="button" 
                  onClick={checkHealth} 
                  className="retry-btn"
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}
        </form>
        
        <div className="login-footer">
          <p>Sample accounts: SP001, SP002, SP003</p>
          <p className="help-text">
            Backend must be running on port 3001
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
```

---

### 4️⃣ **src/components/AgentCard.js** (ง่าย - 10 นาที)

```javascript
// components/AgentCard.js - Version 4.0

import React from 'react';

function AgentCard({ agent, onSendMessage, onViewHistory }) {
  if (!agent) return null;

  const getStatusColor = (status) => {
    const colors = {
      Available: '#4CAF50',
      Busy: '#FF9800',
      Break: '#2196F3',
      Offline: '#9E9E9E'
    };
    return colors[status] || colors.Offline;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      Agent: '#2196F3',
      Supervisor: '#FF9800',
      Admin: '#F44336'
    };
    return colors[role] || '#9E9E9E';
  };

  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <div className="agent-avatar">
          <span>👤</span>
        </div>
        
        <div className="agent-info">
          {/* ✅ เปลี่ยนจาก agentName เป็น fullName */}
          <h4 className="agent-name">{agent.fullName}</h4>
          
          <div className="agent-meta">
            {/* ✅ เปลี่ยนจาก agentCode เป็น username */}
            <span className="agent-code">{agent.username}</span>
            
            {/* ✅ เพิ่มการแสดง role */}
            <span 
              className="role-badge"
              style={{ backgroundColor: getRoleBadgeColor(agent.role) }}
            >
              {agent.role}
            </span>
          </div>
        </div>
        
        <div 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(agent.status) }}
          title={agent.status}
        >
          <span className="status-dot"></span>
        </div>
      </div>
      
      <div className="agent-card-body">
        <div className="agent-details">
          {/* ✅ แสดง team info */}
          {agent.teamId && (
            <div className="detail-item">
              <span className="label">Team:</span>
              <span className="value">
                {agent.teamName || `Team ${agent.teamId}`}
              </span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="label">Status:</span>
            <span 
              className="value"
              style={{ color: getStatusColor(agent.status) }}
            >
              {agent.status}
            </span>
          </div>
          
          {agent.lastSeen && (
            <div className="detail-item">
              <span className="label">Last Seen:</span>
              <span className="value">
                {new Date(agent.lastSeen).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="agent-card-actions">
        <button
          className="btn btn-primary"
          onClick={() => onSendMessage(agent)}
          disabled={agent.status === 'Offline'}
        >
          💬 Send Message
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={() => onViewHistory(agent)}
        >
          📜 View History
        </button>
      </div>
    </div>
  );
}

export default AgentCard;
```

---

### 5️⃣ **src/components/AgentList.js** (ปานกลาง - 20 นาที)

```javascript
// components/AgentList.js - Version 4.0

import React, { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import { getAgents } from '../services/api';

function AgentList({ supervisor, onSendMessage, onViewHistory }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ✅ เพิ่ม filter states
  const [roleFilter, setRoleFilter] = useState('Agent'); // เฉพาะ Agent by default
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load agents on mount และเมื่อ filter เปลี่ยน
  useEffect(() => {
    loadAgents();
  }, [roleFilter, statusFilter, supervisor?.teamId]);

  const loadAgents = async () => {
    if (!supervisor?.teamId) {
      console.log('⏸️ No team ID, skipping agent load');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Build filters object
      const filters = {
        teamId: supervisor.teamId,  // เฉพาะทีมของ supervisor
        role: roleFilter,            // ✅ Filter by role
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      console.log('📡 Loading agents with filters:', filters);
      
      const result = await getAgents(filters);

      if (result.success) {
        setAgents(result.agents || []);
        console.log('✅ Loaded', result.agents?.length || 0, 'agents');
      }
    } catch (err) {
      console.error('❌ Failed to load agents:', err);
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Client-side search filter
  const filteredAgents = agents.filter(agent => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      agent.username.toLowerCase().includes(term) ||
      agent.fullName.toLowerCase().includes(term)
    );
  });

  // ✅ Group agents by status
  const groupedAgents = {
    Available: filteredAgents.filter(a => a.status === 'Available'),
    Busy: filteredAgents.filter(a => a.status === 'Busy'),
    Break: filteredAgents.filter(a => a.status === 'Break'),
    Offline: filteredAgents.filter(a => a.status === 'Offline')
  };

  return (
    <div className="agent-list">
      {/* Header */}
      <div className="agent-list-header">
        <h3>
          Team Agents ({filteredAgents.length})
        </h3>
        
        <button 
          onClick={loadAgents} 
          className="btn-refresh"
          disabled={loading}
          title="Refresh agent list"
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Filters */}
      <div className="agent-filters">
        {/* ✅ Role Filter */}
        <div className="filter-group">
          <label>Role:</label>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="Agent">Agents Only</option>
            <option value="Supervisor">Supervisors Only</option>
            <option value="">All Roles</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Break">Break</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* ✅ Search */}
        <div className="filter-group search-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Username or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
          <button onClick={loadAgents} className="btn-retry">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading agents...</p>
        </div>
      )}

      {/* Agent Cards */}
      {!loading && !error && (
        <div className="agent-list-content">
          {filteredAgents.length === 0 ? (
            <div className="no-agents">
              <div className="no-agents-icon">🔍</div>
              <p>No agents found</p>
              <small>
                {searchTerm 
                  ? 'Try a different search term'
                  : 'No agents in your team'
                }
              </small>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="agent-stats">
                <div className="stat-item available">
                  <span className="stat-label">Available:</span>
                  <span className="stat-value">{groupedAgents.Available.length}</span>
                </div>
                <div className="stat-item busy">
                  <span className="stat-label">Busy:</span>
                  <span className="stat-value">{groupedAgents.Busy.length}</span>
                </div>
                <div className="stat-item break">
                  <span className="stat-label">Break:</span>
                  <span className="stat-value">{groupedAgents.Break.length}</span>
                </div>
                <div className="stat-item offline">
                  <span className="stat-label">Offline:</span>
                  <span className="stat-value">{groupedAgents.Offline.length}</span>
                </div>
              </div>

              {/* Agent Cards Grid */}
              <div className="agent-grid">
                {filteredAgents.map(agent => (
                  <AgentCard
                    key={agent.id || agent.username}
                    agent={agent}
                    onSendMessage={onSendMessage}
                    onViewHistory={onViewHistory}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentList;
```

**🎓 สิ่งที่เรียนรู้:**
- Filter agents by `role` และ `status`
- Client-side search by `username` หรือ `fullName`
- Group agents by status
- Display summary statistics
- Handle loading และ error states

---

### 6️⃣ **src/components/SendMessageForm.js** (ง่าย - 15 นาที)

```javascript
// components/SendMessageForm.js - Version 4.0

import React, { useState } from 'react';
import { sendMessage } from '../services/api';

function SendMessageForm({ supervisor, selectedAgent, onClose, onSuccess }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState('direct'); // 'direct' or 'broadcast'
  const [priority, setPriority] = useState('normal');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!content.trim()) {
      setError('Message content is required');
      return;
    }

    if (content.length > 500) {
      setError('Message is too long (max 500 characters)');
      return;
    }

    if (type === 'direct' && !selectedAgent) {
      setError('Please select an agent');
      return;
    }

    setSending(true);
    setError('');

    try {
      // ✅ Build message data
      const messageData = {
        fromCode: supervisor.username,  // ✅ ใช้ username เป็น code
        content: content.trim(),
        type: type,
        priority: priority
      };

      // ✅ Add toCode for direct messages
      if (type === 'direct') {
        messageData.toCode = selectedAgent.username;  // ✅ ใช้ username
      }

      console.log('📤 Sending message:', messageData);

      const result = await sendMessage(messageData);

      if (result.success) {
        console.log('✅ Message sent successfully');
        
        // Clear form
        setContent('');
        setType('direct');
        setPriority('normal');
        
        // Callback
        if (onSuccess) {
          onSuccess(result.message);
        }
        
        // Close modal after short delay
        setTimeout(() => {
          if (onClose) onClose();
        }, 500);
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-message-form">
      <div className="form-header">
        <h3>
          {type === 'direct' 
            ? `📩 Send to ${selectedAgent?.fullName || 'Agent'}` 
            : '📢 Broadcast Message'
          }
        </h3>
        {onClose && (
          <button onClick={onClose} className="btn-close">✕</button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Message Type */}
        <div className="form-group">
          <label>Message Type:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="direct"
                checked={type === 'direct'}
                onChange={(e) => setType(e.target.value)}
                disabled={!selectedAgent}
              />
              <span>Direct Message</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="broadcast"
                checked={type === 'broadcast'}
                onChange={(e) => setType(e.target.value)}
              />
              <span>Broadcast to Team</span>
            </label>
          </div>
        </div>

        {/* Recipient Info (Direct only) */}
        {type === 'direct' && selectedAgent && (
          <div className="recipient-info">
            <strong>To:</strong> {selectedAgent.fullName} ({selectedAgent.username})
          </div>
        )}

        {/* Priority */}
        <div className="form-group">
          <label>Priority:</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="low">🔵 Low</option>
            <option value="normal">⚪ Normal</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        {/* Message Content */}
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
            placeholder="Type your message here..."
            rows={5}
            maxLength={500}
            className="form-textarea"
            disabled={sending}
          />
          <div className="char-count">
            {content.length}/500 characters
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Actions */}
        <div className="form-actions">
          {onClose && (
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary"
              disabled={sending}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={sending || !content.trim()}
          >
            {sending ? 'Sending...' : `Send ${type === 'broadcast' ? 'Broadcast' : 'Message'}`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SendMessageForm;
```

**🎓 สิ่งที่เรียนรู้:**
- ใช้ `supervisor.username` เป็น `fromCode`
- ใช้ `selectedAgent.username` เป็น `toCode`
- Support both direct และ broadcast messages
- Validation และ character count

---

### 7️⃣ **src/App.js** (ปานกลาง - 30 นาที)

```javascript
// App.js - Version 4.0 (Supervisor Dashboard)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AgentList from './components/AgentList';
import SendMessageForm from './components/SendMessageForm';
import MessageHistory from './components/MessageHistory';
import {
  setAuthToken,
  logout as apiLogout
} from './services/api';
import {
  connectSocket,
  disconnectSocket,
  getSocket
} from './services/socket';
import logger from './utils/logger';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [supervisor, setSupervisor] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  
  // ✅ Modal states
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showMessageHistory, setShowMessageHistory] = useState(false);

  const socketRef = useRef(null);
  const isLoggedInRef = useRef(false);

  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    logger.info('Supervisor Dashboard initialized');
  }, []);

  /**
   * ✅ WebSocket connection for Supervisors
   */
  useEffect(() => {
    if (!isLoggedIn || !supervisor) {
      console.log('⏸️ Skipping WebSocket - not logged in');
      return;
    }

    if (!supervisor.username) {
      console.error('❌ Supervisor missing username:', supervisor);
      setError('Invalid supervisor data');
      return;
    }

    // ✅ ใช้ username เป็น code สำหรับ WebSocket
    const supervisorCode = supervisor.username;
    logger.log('🔌 Setting up WebSocket for', supervisorCode, supervisor.role);
    
    const socket = connectSocket(supervisorCode, supervisor.role);
    
    if (!socket) {
      console.error('❌ Failed to create socket');
      setError('Failed to connect to server');
      return;
    }

    socketRef.current = socket;

    const handlers = {
      connect: () => {
        logger.log('✅ WebSocket connected');
        setConnectionStatus('connected');
        setError(null);
      },

      disconnect: (reason) => {
        logger.log('🔌 WebSocket disconnected:', reason);
        setConnectionStatus('disconnected');
      },

      connect_error: (error) => {
        logger.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
        setError('Connection error');
      },

      reconnect: (attemptNumber) => {
        logger.log('🔄 Reconnected after', attemptNumber, 'attempts');
        setConnectionStatus('connected');
        setError(null);
      },

      connection_success: (data) => {
        logger.log('✅ Auth successful:', data);
      },

      connection_error: (error) => {
        logger.error('❌ Connection error:', error);
        setError(error.message || 'Connection error');
      },

      // ✅ Agent status updates
      agent_status_updated: (data) => {
        logger.log('📊 Agent status updated:', data);
        // Trigger agent list refresh
        // You can emit custom event here
        window.dispatchEvent(new CustomEvent('agent-status-updated', { detail: data }));
      },

      // ✅ New message notification
      message_sent: (data) => {
        logger.log('✅ Message sent notification:', data);
        // Show toast notification
        window.dispatchEvent(new CustomEvent('message-sent', { detail: data }));
      },

      // ✅ Agent connected/disconnected
      agent_connected: (data) => {
        logger.log('✅ Agent connected:', data);
        window.dispatchEvent(new CustomEvent('agent-connected', { detail: data }));
      },

      agent_disconnected: (data) => {
        logger.log('🔌 Agent disconnected:', data);
        window.dispatchEvent(new CustomEvent('agent-disconnected', { detail: data }));
      }
    };

    // Register handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      logger.log('🧹 Cleanup WebSocket');
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      disconnectSocket();
      socketRef.current = null;
      setConnectionStatus('disconnected');
    };
  }, [isLoggedIn, supervisor]);

  /**
   * ✅ Handle login
   */
  const handleLogin = useCallback(async (userData, token) => {
    console.log('🔐 Supervisor login successful:', userData);

    if (!userData || !userData.username) {
      console.error('❌ Invalid login data:', userData);
      setError('Invalid supervisor data');
      return;
    }

    // ✅ Verify role
    if (userData.role !== 'Supervisor') {
      setError('Access denied. Supervisor role required.');
      return;
    }

    setAuthToken(token);
    setSupervisor(userData);
    setIsLoggedIn(true);
    setError(null);
  }, []);

  /**
   * ✅ Handle logout
   */
  const handleLogout = useCallback(async () => {
    logger.log('👋 Logging out');

    try {
      await apiLogout();
    } catch (error) {
      logger.error('Logout failed:', error);
    }

    disconnectSocket();
    setIsLoggedIn(false);
    setSupervisor(null);
    setConnectionStatus('disconnected');
    setError(null);
    setShowSendMessage(false);
    setSelectedAgent(null);
    setShowMessageHistory(false);
  }, []);

  /**
   * ✅ Handle send message
   */
  const handleSendMessage = useCallback((agent) => {
    setSelectedAgent(agent);
    setShowSendMessage(true);
  }, []);

  /**
   * ✅ Handle view history
   */
  const handleViewHistory = useCallback((agent) => {
    setSelectedAgent(agent);
    setShowMessageHistory(true);
  }, []);

  /**
   * ✅ Handle message sent success
   */
  const handleMessageSent = useCallback((message) => {
    console.log('✅ Message sent:', message);
    // You can show a toast notification here
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="app supervisor-dashboard">
      {/* Connection Status */}
      <div className={`connection-status ${connectionStatus}`}>
        <div className="status-indicator"></div>
        <span>
          {connectionStatus === 'connected' && '✅ Connected'}
          {connectionStatus === 'disconnected' && '⚠️ Disconnected'}
          {connectionStatus === 'error' && '❌ Connection Error'}
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}

      {/* Main Content */}
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          {/* Dashboard Header */}
          <Dashboard 
            supervisor={supervisor}
            onLogout={handleLogout}
            connectionStatus={connectionStatus}
          />

          {/* Agent List */}
          <AgentList
            supervisor={supervisor}
            onSendMessage={handleSendMessage}
            onViewHistory={handleViewHistory}
          />

          {/* Send Message Modal */}
          {showSendMessage && (
            <div className="modal-overlay" onClick={() => setShowSendMessage(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <SendMessageForm
                  supervisor={supervisor}
                  selectedAgent={selectedAgent}
                  onClose={() => setShowSendMessage(false)}
                  onSuccess={handleMessageSent}
                />
              </div>
            </div>
          )}

          {/* Message History Modal */}
          {showMessageHistory && selectedAgent && (
            <div className="modal-overlay" onClick={() => setShowMessageHistory(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <MessageHistory
                  agent={selectedAgent}
                  onClose={() => setShowMessageHistory(false)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
```

---

## การทดสอบ

### 🧪 Test Checklist

```bash
Pre-Test:
├─ [ ] Backend running on port 3001
├─ [ ] Database has Supervisor users (SP001, SP002, SP003)
├─ [ ] Database has Agent users in teams
└─ [ ] Clear browser cache

Login Tests:
├─ [ ] Login with SP001 successful
├─ [ ] Login with non-supervisor fails
├─ [ ] See supervisor info displayed
├─ [ ] See team name/ID
└─ [ ] Role badge shows "Supervisor"

Agent List Tests:
├─ [ ] See agents in supervisor's team only
├─ [ ] Agent cards show fullName (not agentName)
├─ [ ] Agent cards show username (not agentCode)
├─ [ ] Agent cards show role badge
├─ [ ] Filter by role works
├─ [ ] Filter by status works
└─ [ ] Search works

WebSocket Tests:
├─ [ ] Connection status shows "Connected"
├─ [ ] Real-time status updates work
├─ [ ] Agent connect/disconnect notifications
└─ [ ] No console errors

Send Message Tests:
├─ [ ] Send direct message successful
├─ [ ] Send broadcast message successful
├─ [ ] Message uses username as code
├─ [ ] Validation works
└─ [ ] Success notification shows

Message History Tests:
├─ [ ] Load history for selected agent
├─ [ ] Messages display correctly
└─ [ ] Close modal works
```

---

## Troubleshooting

### ❌ Issue: Cannot see any agents

**Cause:** Supervisor teamId mismatch or wrong filter

**Solution:**
```javascript
// Check supervisor teamId
console.log('Supervisor:', supervisor);
console.log('Team ID:', supervisor.teamId);

// Check API call
console.log('Filters:', { teamId: supervisor.teamId, role: 'Agent' });

// Check response
const result = await getAgents({ teamId: supervisor.teamId, role: 'Agent' });
console.log('Agents:', result.agents);
```

---

### ❌ Issue: Access denied on login

**Cause:** User role is not Supervisor

**Solution:**
```javascript
// Verify user role in database
SELECT * FROM users WHERE username = 'SP001';

// Should show:
// role: 'Supervisor'

// Frontend validation
if (result.user.role !== 'Supervisor') {
  throw new Error('Access denied. Supervisor role required.');
}
```

---

## Summary

### ✅ Files Modified

| File | Changes | Time |
|------|---------|------|
| `api.js` | 5 functions updated | 30 min |
| `socket.js` | No changes (reviewed) | 10 min |
| `LoginForm.js` | Username validation + role check | 20 min |
| `AgentCard.js` | Property names | 10 min |
| `AgentList.js` | Filters + role filter | 20 min |
| `SendMessageForm.js` | Username as code | 15 min |
| `Dashboard.js` | Display supervisor info | 10 min |
| `App.js` | State + WebSocket | 30 min |

**Total Time: ~2.5 hours**

---

**Document Version:** 4.0  
**Component:** Supervisor Dashboard  
**Compatible with:** Backend v1.2  
**Last Updated:** October 2025  
**Status:** Complete ✅

---

**End of Supervisor Dashboard Migration Guide** 🎉