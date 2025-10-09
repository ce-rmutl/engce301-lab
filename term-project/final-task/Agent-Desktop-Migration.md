# 📘 6.6.3.1 Frontend - Electron Agent Desktop App (Version 4.0 - Backend v1.2 Compatible)

**เอกสารปรับปรุง Agent Desktop App ให้รองรับ Backend v1.2**

---

## 📋 สารบัญ

1. [ภาพรวมการเปลี่ยนแปลง](#ภาพรวมการเปลี่ยนแปลง)
2. [Migration Checklist](#migration-checklist)
3. [ไฟล์ที่ต้องแก้ไข](#ไฟล์ที่ต้องแก้ไข)
4. [การทดสอบ](#การทดสอบ)
5. [Troubleshooting](#troubleshooting)

---

## ภาพรวมการเปลี่ยนแปลง

### 🔄 Backend v1.2 Changes Summary

| Component | Version 3.2 (เดิม) | Version 4.0 (ใหม่) | Impact |
|-----------|-------------------|-------------------|---------|
| **Database** | `agents` table | `users` table | ⚠️ Structure เปลี่ยน |
| **Login API** | `agentCode` field | `username` field | ⚠️ Request body เปลี่ยน |
| **Response** | `agent` object | `user` object | ⚠️ Property names เปลี่ยน |
| **User Fields** | `agentName`, `agentCode` | `fullName`, `username` | ⚠️ Field names เปลี่ยน |
| **New Fields** | - | `role`, `teamId` | ✅ เพิ่ม fields ใหม่ |
| **WebSocket** | `agentCode` | `agentCode` (เหมือนเดิม) | ✅ ไม่ต้องเปลี่ยน |
| **Status API** | `agentCode` | `username` | ⚠️ Parameter เปลี่ยน |
| **Messages API** | `agentCode` | `username` | ⚠️ Parameter เปลี่ยน |

### 🎯 สิ่งที่ต้องทำ

```
✅ เปลี่ยน field names ใน API calls
✅ เปลี่ยน property names ใน components
✅ เพิ่ม validation สำหรับ fields ใหม่
✅ Update error handling
❌ WebSocket ไม่ต้องเปลี่ยน (ยังใช้ agentCode)
```

### 📊 ระดับความยาก

| ไฟล์ | ความยาก | เวลา | คะแนน |
|------|---------|------|-------|
| `AgentInfo.js` | ⭐ ง่าย | 10 นาที | 5% |
| `MessagePanel.js` | ⭐ ง่าย | 5 นาที | 3% |
| `LoginForm.js` | ⭐⭐ ปานกลาง | 20 นาที | 10% |
| `api.js` | ⭐⭐ ปานกลาง | 20 นาที | 12% |
| `App.js` | ⭐⭐⭐ ค่อนข้างยาก | 40 นาที | 20% |
| `socket.js` | ⭐ ง่าย (อ่านเข้าใจ) | 10 นาที | 5% |

**รวมเวลา: ~2 ชั่วโมง**

---

## Migration Checklist

### ✅ ขั้นตอนการ Migrate

```bash
Phase 1: เตรียมความพร้อม (15 นาที)
├─ [ ] Backup project เดิม
├─ [ ] ตรวจสอบ Backend v1.2 running
├─ [ ] ตรวจสอบ Database มี users table
└─ [ ] Postman test APIs

Phase 2: แก้ไข Services (30 นาที)
├─ [ ] api.js - เปลี่ยน API calls
└─ [ ] socket.js - เข้าใจว่าทำไมไม่เปลี่ยน

Phase 3: แก้ไข Components (45 นาที)
├─ [ ] LoginForm.js - เปลี่ยน variable names
├─ [ ] AgentInfo.js - เปลี่ยน property names
└─ [ ] MessagePanel.js - เปลี่ยน prop names

Phase 4: แก้ไข App.js (40 นาที)
├─ [ ] แก้ไข function calls ทั้งหมด
├─ [ ] เพิ่ม validation
└─ [ ] Update error handling

Phase 5: Testing (20 นาที)
├─ [ ] Login test
├─ [ ] WebSocket test
├─ [ ] Messages test
└─ [ ] Status update test

รวมเวลา: ~2.5 ชั่วโมง
```

---

## ไฟล์ที่ต้องแก้ไข

### 1️⃣ **src/services/api.js** (ปานกลาง - 20 นาที)

#### 📍 จุดที่ต้องแก้ไข

**A. Function: `loginAgent`**

```javascript
// ❌ เดิม (Version 3.2)
export const loginAgent = async (agentCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentCode })  // ❌ ชื่อ field ผิด
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
export const loginAgent = async (username) => {  // ✅ เปลี่ยนชื่อ parameter
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })  // ✅ เปลี่ยนเป็น username
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');  // ✅ เปลี่ยนจาก data.error
    }
    
    // ✅ ปรับ response structure
    if (data.success && data.user) {
      const token = data.user.token || data.token;  // ✅ รองรับทั้ง 2 format
      if (token) {
        setAuthToken(token);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};
```

**🎓 สิ่งที่เรียนรู้:**
- เปลี่ยนชื่อ parameter จาก `agentCode` → `username`
- เปลี่ยน request body field
- ปรับ response handling เพราะ structure เปลี่ยน
- รองรับ token อยู่ทั้ง `data.user.token` และ `data.token`

---

**B. Function: `getMessages`**

```javascript
// ❌ เดิม
export const getMessages = async (agentCode, limit = 50, unreadOnly = false) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const url = `${API_BASE_URL}/messages/agent/${agentCode}?limit=${limit}&unreadOnly=${unreadOnly}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get messages');
    }
    
    return data;
  } catch (error) {
    console.error('Get Messages API Error:', error);
    throw error;
  }
};
```

```javascript
// ✅ ใหม่
export const getMessages = async (username, limit = 50, unreadOnly = false) => {  // ✅ เปลี่ยน parameter
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    // ✅ เปลี่ยน URL path
    const url = `${API_BASE_URL}/messages/agent/${username}?limit=${limit}&unreadOnly=${unreadOnly}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get messages');  // ✅ เปลี่ยนจาก data.error
    }
    
    return data;
  } catch (error) {
    console.error('Get Messages API Error:', error);
    throw error;
  }
};
```

---

**C. Function: `updateAgentStatus`**

```javascript
// ❌ เดิม
export const updateAgentStatus = async (agentCode, status) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/agents/${agentCode}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update status');
    }
    
    return data;
  } catch (error) {
    console.error('Update Status API Error:', error);
    throw error;
  }
};
```

```javascript
// ✅ ใหม่
export const updateAgentStatus = async (username, status) => {  // ✅ เปลี่ยน parameter
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    // ✅ เปลี่ยน URL path
    const response = await fetch(`${API_BASE_URL}/agents/${username}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update status');  // ✅ เปลี่ยนจาก data.error
    }
    
    return data;
  } catch (error) {
    console.error('Update Status API Error:', error);
    throw error;
  }
};
```

**📝 ไฟล์สมบูรณ์: `src/services/api.js`**

<details>
<summary>คลิกเพื่อดูไฟล์เต็ม</summary>

```javascript
// services/api.js - Version 4.0 (Backend v1.2 Compatible)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
let authToken = null;

// ========================================
// Authentication Token Management
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
// Authentication APIs
// ========================================

/**
 * ✅ Updated: Login with username (Backend v1.2)
 * @param {string} username - User username (AG001, SP001, etc.)
 * @returns {Promise<Object>} Login response
 */
export const loginAgent = async (username) => {
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
    
    // Handle token from response
    if (data.success && data.user) {
      const token = data.user.token || data.token;
      if (token) {
        setAuthToken(token);
      }
    }
    
    console.log('✅ Login successful');
    return data;
  } catch (error) {
    console.error('❌ Login API Error:', error);
    throw error;
  }
};

/**
 * Logout
 */
export const logoutAgent = async () => {
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
// Message APIs
// ========================================

/**
 * ✅ Updated: Get messages by username
 * @param {string} username - User username
 * @param {number} limit - Number of messages to retrieve
 * @param {boolean} unreadOnly - Get only unread messages
 * @returns {Promise<Object>} Messages data
 */
export const getMessages = async (username, limit = 50, unreadOnly = false) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const url = `${API_BASE_URL}/messages/agent/${username}?limit=${limit}&unreadOnly=${unreadOnly}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get messages');
    }
    
    console.log(`✅ Loaded ${data.messages?.length || 0} messages`);
    return data;
  } catch (error) {
    console.error('❌ Get Messages API Error:', error);
    throw error;
  }
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark message as read');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Mark Read API Error:', error);
    throw error;
  }
};

// ========================================
// Agent Status APIs
// ========================================

/**
 * ✅ Updated: Update agent status by username
 * @param {string} username - User username
 * @param {string} status - New status (Available, Busy, Break, Offline)
 * @returns {Promise<Object>} Status update response
 */
export const updateAgentStatus = async (username, status) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/agents/${username}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update status');
    }
    
    console.log('✅ Status updated:', status);
    return data;
  } catch (error) {
    console.error('❌ Update Status API Error:', error);
    throw error;
  }
};

/**
 * Get status history
 */
export const getStatusHistory = async (username, limit = 50) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/agents/${username}/history?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get status history');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Get Status History API Error:', error);
    throw error;
  }
};

// ========================================
// Health Check
// ========================================

/**
 * Check server health
 */
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

**เหตุผล:** Backend WebSocket handler ยังใช้ `agentCode` อยู่

```javascript
// socket/socketHandler.js (Backend)
socket.on('agent_connect', (data) => {
  const { agentCode } = data;  // ⬅️ ยังใช้ agentCode
  // ...
});
```

**✅ ไฟล์ปัจจุบัน: `src/services/socket.js`** (ไม่เปลี่ยนแปลง)

```javascript
// services/socket.js - Version 4.0
// ⚠️ WebSocket ยังใช้ agentCode ตาม Backend socketHandler
// ไม่ต้องแก้ไขไฟล์นี้!

import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
let socket = null;

/**
 * ✅ ยังใช้ agentCode ตามเดิม
 * เพราะ Backend WebSocket handler ยังไม่ได้ update
 */
export const connectSocket = (agentCode, role = 'Agent') => {
  // Validation
  if (!agentCode) {
    console.error('❌ connectSocket: agentCode is required');
    return null;
  }

  if (typeof agentCode !== 'string') {
    console.error('❌ connectSocket: agentCode must be a string', agentCode);
    return null;
  }

  // Disconnect existing
  if (socket) {
    console.log('Disconnecting existing socket...');
    disconnectSocket();
  }

  console.log('🔌 Connecting to WebSocket...', SOCKET_URL);
  console.log('📋 Agent Code:', agentCode, 'Role:', role);

  try {
    socket = io(SOCKET_URL, {
      query: {
        agentCode: agentCode.toUpperCase(),  // ⬅️ ยังใช้ agentCode
        role: role,
        type: 'agent'
      },
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      socket.emit('agent_connect', { 
        agentCode: agentCode.toUpperCase(),  // ⬅️ ยังใช้ agentCode
        role: role 
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('❌ WebSocket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed');
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

/**
 * ✅ ยังใช้ agentCode
 */
export const sendStatusUpdate = (agentCode, status) => {
  if (!agentCode) {
    console.error('❌ sendStatusUpdate: agentCode is required');
    return false;
  }

  if (socket && socket.connected) {
    console.log('📤 Sending status update:', { agentCode, status });
    socket.emit('update_status', {
      agentCode: agentCode.toUpperCase(),
      status: status
    });
    return true;
  }
  
  console.warn('⚠️ Socket not connected');
  return false;
};

export const isSocketConnected = () => {
  return socket && socket.connected;
};

export const getSocket = () => socket;
```

**🎓 สิ่งที่เรียนรู้:**
- WebSocket handler ยังใช้ `agentCode`
- ไม่ต้องแก้ไขไฟล์นี้
- ต้องเข้าใจว่า username = agentCode (format เหมือนกัน: AG001)
- เมื่อ Backend WebSocket update จึงค่อยแก้

---

### 3️⃣ **src/components/LoginForm.js** (ปานกลาง - 20 นาที)

#### 📍 จุดที่ต้องแก้ไข

**A. State และ Variable Names**

```javascript
// ❌ เดิม
const [agentCode, setAgentCode] = useState('');

// ✅ ใหม่
const [username, setUsername] = useState('');
```

**B. Form Input**

```javascript
// ❌ เดิม
<label htmlFor="agentCode">Agent Code</label>
<input
  id="agentCode"
  value={agentCode}
  onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
  placeholder="e.g., AG001"
/>

// ✅ ใหม่
<label htmlFor="username">Username</label>
<input
  id="username"
  value={username}
  onChange={(e) => setUsername(e.target.value.toUpperCase())}
  placeholder="e.g., AG001"
/>
```

**C. Validation**

```javascript
// ❌ เดิม
const validationError = validateAgentCode(agentCode);

// ✅ ใหม่
const validationError = validateAgentCode(username);  // ใช้ function เดิมได้
```

**D. API Call**

```javascript
// ❌ เดิม
const result = await loginAgent(agentCode.toUpperCase());
if (result.success) {
  onLogin(result.data.user, result.data.token);
}

// ✅ ใหม่
const result = await loginAgent(username.toUpperCase());

// ✅ Response validation
if (!result || !result.success) {
  throw new Error(result?.message || 'Login failed');
}

if (!result.user) {
  throw new Error('Invalid response - missing user data');
}

if (!result.user.username) {
  throw new Error('Invalid response - missing username');
}

const token = result.user.token || result.token;
if (!token) {
  throw new Error('Invalid response - missing token');
}

// ✅ ส่งข้อมูลที่ validated แล้ว
onLogin(result.user, token);
```

**📝 ไฟล์สมบูรณ์: `src/components/LoginForm.js`**

<details>
<summary>คลิกเพื่อดูไฟล์เต็ม</summary>

```javascript
// components/LoginForm.js - Version 4.0

import React, { useState, useEffect } from 'react';
import { loginAgent, checkServerHealth } from '../services/api';
import { validateAgentCode } from '../utils/validation';

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
    
    // ✅ Validate username (ใช้ function เดิมได้เพราะ format เหมือนกัน)
    const validationError = validateAgentCode(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ Login with username
      const result = await loginAgent(username.toUpperCase());
      
      console.log('🔐 Login response:', result);
      
      // ✅ Validate response structure
      if (!result || !result.success) {
        throw new Error(result?.message || 'Login failed');
      }

      if (!result.user) {
        throw new Error('Invalid response - missing user data');
      }

      if (!result.user.username) {
        throw new Error('Invalid response - missing username');
      }

      const token = result.user.token || result.token;
      if (!token) {
        throw new Error('Invalid response - missing token');
      }

      console.log('✅ Login successful:', result.user);
      
      // ✅ Send validated data
      onLogin(result.user, token);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      if (err.message.includes('fetch')) {
        setError('Cannot connect to server. Check if backend is running.');
        setServerStatus('offline');
      } else {
        setError(err.message || 'Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    checkHealth();
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Agent Login</h2>
          <p>Enter your username to continue</p>
          
          <div className={`server-status ${serverStatus}`}>
            <span className="status-dot"></span>
            <span>Server: {serverStatus}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* ✅ เปลี่ยน label และ id */}
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="e.g., AG001, SP001, AD001"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              disabled={loading || serverStatus === 'offline'}
              maxLength={5}
              autoFocus
            />
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
                  onClick={handleRetry} 
                  className="retry-btn"
                >
                  Retry Connection
                </button>
              )}
            </div>

        )}
        </form>
        
        <div className="login-footer">
          <p>Sample codes: AG001, AG002, SP001, AD001</p>
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

</details>

---

### 4️⃣ **src/components/AgentInfo.js** (ง่าย - 10 นาที)

#### 📍 จุดที่ต้องแก้ไข

**A. Property Names**

```javascript
// ❌ เดิม
<h3>{agent.agentName}</h3>
<span>{agent.agentCode}</span>
<span>{agent.teamName}</span>

// ✅ ใหม่
<h3>{agent.fullName}</h3>
<span>{agent.username}</span>
<span>{agent.teamName || `Team ${agent.teamId}` || 'N/A'}</span>
```

**B. เพิ่มการแสดง Role**

```javascript
// ✅ ใหม่
<div className="agent-role">
  <span className="label">Role:</span>
  <span className="value">{agent.role}</span>
</div>
```

**📝 ไฟล์สมบูรณ์: `src/components/AgentInfo.js`**

<details>
<summary>คลิกเพื่อดูไฟล์เต็ม</summary>

```javascript
// components/AgentInfo.js - Version 4.0

import React from 'react';

function AgentInfo({ agent, status }) {
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

  return (
    <div className="agent-info">
      <div className="agent-avatar">
        <span>👤</span>
      </div>
      
      <div className="agent-details">
        {/* ✅ เปลี่ยนจาก agentName เป็น fullName */}
        <h3 className="agent-name">{agent.fullName}</h3>
        
        <div className="agent-meta">
          <div className="agent-code">
            <span className="label">Code:</span>
            {/* ✅ เปลี่ยนจาก agentCode เป็น username */}
            <span className="value">{agent.username}</span>
          </div>
          
          {/* ✅ เพิ่มการแสดง role */}
          <div className="agent-role">
            <span className="label">Role:</span>
            <span className="value">{agent.role}</span>
          </div>
          
          {/* ✅ แสดง Team เฉพาะ Agent/Supervisor */}
          {(agent.role === 'Agent' || agent.role === 'Supervisor') && (
            <div className="agent-team">
              <span className="label">Team:</span>
              <span className="value">
                {agent.teamName || `Team ${agent.teamId}` || 'N/A'}
              </span>
            </div>
          )}
        </div>
        
        <div className="agent-status">
          <span 
            className="status-dot"
            style={{ backgroundColor: getStatusColor(status) }}
          ></span>
          {/* ✅ แสดง status จาก user object หรือ prop */}
          <span className="status-text">{agent.status || status}</span>
        </div>
      </div>
    </div>
  );
}

export default AgentInfo;
```

</details>

---

### 5️⃣ **src/components/MessagePanel.js** (ง่าย - 5 นาที)

#### 📍 จุดที่ต้องแก้ไข

**A. Prop Name**

```javascript
// ❌ เดิม
function MessagePanel({ messages, agentCode, loading = false }) {

// ✅ ใหม่
function MessagePanel({ messages, username, loading = false }) {
```

**B. ใช้ใน Component**

```javascript
// ✅ ถ้ามีการใช้ agentCode ใน component
console.log('Messages for:', username);
```

**📝 ไฟล์: `src/components/MessagePanel.js`**

เปลี่ยนแค่บรรทัดแรก:

```javascript
// components/MessagePanel.js - Version 4.0

import React, { useEffect, useRef, useState } from 'react';
import { formatTime, getTimeAgo } from '../utils/dateUtils';
import { markMessageAsRead } from '../services/api';
import './MessagePanel.css';

// ✅ เปลี่ยน prop name
function MessagePanel({ messages, username, loading = false }) {
  // ... rest of the code remains the same
  
  // ถ้ามีใช้ username ใน component
  console.log('Loading messages for:', username);
  
  // ... rest of the component
}

export default MessagePanel;
```

---

### 6️⃣ **src/App.js** (ค่อนข้างยาก - 40 นาที)

#### 📍 จุดที่ต้องแก้ไข

**A. loadMessages function**

```javascript
// ❌ เดิม
const loadMessages = useCallback(async (agentCode) => {
  const messagesData = await getMessages(agentCode, 50);
}, []);

// ✅ ใหม่
const loadMessages = useCallback(async (username) => {
  if (!username) {
    console.error('❌ loadMessages: username is required');
    return;
  }
  
  setLoadingMessages(true);
  try {
    logger.log('Loading messages for', username);
    const messagesData = await getMessages(username, 50);

    if (messagesData.success) {
      const messageList = messagesData.messages || [];
      logger.log('Loaded', messageList.length, 'messages');
      setMessages(messageList);
    }
  } catch (error) {
    logger.error('Failed to load messages:', error);
  } finally {
    setLoadingMessages(false);
  }
}, []);
```

---

**B. WebSocket connection useEffect**

```javascript
// ❌ เดิม
useEffect(() => {
  if (!isLoggedIn || !agent) return;
  
  const socket = connectSocket(agent.agentCode);
}, [isLoggedIn, agent]);

// ✅ ใหม่
useEffect(() => {
  if (!isLoggedIn || !agent) {
    console.log('⏸️ Skipping WebSocket - not logged in');
    return;
  }

  // ✅ Validation
  if (!agent.username) {
    console.error('❌ Agent missing username:', agent);
    setError('Invalid user data');
    return;
  }

  // ✅ ใช้ username เป็น agentCode เพราะ format เดียวกัน
  const agentCode = agent.username;
  logger.log('🔌 Setting up WebSocket for', agentCode, agent.role);
  
  // ✅ WebSocket ยังใช้ agentCode
  const socket = connectSocket(agentCode, agent.role);
  
  if (!socket) {
    console.error('❌ Failed to create socket');
    setError('Failed to connect to server');
    return;
  }

  socketRef.current = socket;

  // ... rest of socket event handlers
  
  return () => {
    logger.log('🧹 Cleanup WebSocket');
    // ... cleanup code
  };
}, [isLoggedIn, agent]);
```

---

**C. handleLogin function**

```javascript
// ❌ เดิม
const handleLogin = useCallback(async (agentData, token) => {
  setAgent(agentData);
  await loadMessages(agentData.agentCode);
}, [loadMessages]);

// ✅ ใหม่
const handleLogin = useCallback(async (userData, token) => {
  console.log('🔐 Login successful:', userData);

  // ✅ Validation
  if (!userData || !userData.username) {
    console.error('❌ Invalid login data:', userData);
    setError('Invalid user data');
    return;
  }

  setAuthToken(token);
  setAgent(userData);
  setIsLoggedIn(true);
  
  // ✅ ใช้ status จาก userData
  setStatus(userData.status === 'Active' ? 'Available' : 'Offline');
  setError(null);

  // ✅ Load messages ด้วย username
  await loadMessages(userData.username);
}, [loadMessages]);
```

---

**D. handleStatusChange function**

```javascript
// ❌ เดิม
const handleStatusChange = useCallback(async (newStatus) => {
  const socketSuccess = sendStatusUpdate(agent.agentCode, newStatus);
  if (!socketSuccess) {
    await updateAgentStatus(agent.agentCode, newStatus);
  }
}, [agent, status]);

// ✅ ใหม่
const handleStatusChange = useCallback(async (newStatus) => {
  if (!agent || !agent.username) {
    console.error('❌ No agent data');
    setError('User data not available');
    return;
  }

  // ✅ ใช้ username เป็น agentCode สำหรับ WebSocket
  const agentCode = agent.username;
  logger.log('📊 Changing status to:', newStatus);

  const previousStatus = status;
  setStatus(newStatus);

  try {
    // ✅ WebSocket ใช้ agentCode
    const socketSuccess = sendStatusUpdate(agentCode, newStatus);

    if (socketSuccess) {
      logger.log('✅ Status sent via WebSocket');
    } else {
      logger.log('🔄 HTTP fallback');
      // ✅ HTTP API ใช้ username
      await updateAgentStatus(agent.username, newStatus);
      logger.log('✅ Status updated via HTTP');
    }
  } catch (error) {
    logger.error('❌ Status update failed:', error);
    setStatus(previousStatus);
    setError('Failed to update status');
    setTimeout(() => setError(null), 3000);
  }
}, [agent, status]);
```

---

**E. JSX Template**

```javascript
// ✅ ส่ง username แทน agentCode
<MessagePanel
  messages={messages}
  username={agent?.username}  // ✅ เปลี่ยนจาก agentCode
  loading={loadingMessages}
/>
```

---

**📝 ไฟล์สมบูรณ์: `src/App.js`**

<details>
<summary>คลิกเพื่อดูไฟล์เต็ม</summary>

```javascript
// App.js - Version 4.0 (Backend v1.2 Compatible)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoginForm from './components/LoginForm';
import AgentInfo from './components/AgentInfo';
import StatusPanel from './components/StatusPanel';
import MessagePanel from './components/MessagePanel';
import {
  setAuthToken,
  getMessages,
  updateAgentStatus,
  logoutAgent
} from './services/api';
import {
  connectSocket,
  disconnectSocket,
  sendStatusUpdate
} from './services/socket';
import {
  showDesktopNotification,
  requestNotificationPermission
} from './services/notifications';
import logger from './utils/logger';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agent, setAgent] = useState(null);
  const [status, setStatus] = useState('Offline');
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const socketRef = useRef(null);
  const isLoggedInRef = useRef(false);

  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    requestNotificationPermission();
    logger.info('App initialized');
  }, []);

  /**
   * ✅ Load messages - ใช้ username
   */
  const loadMessages = useCallback(async (username) => {
    if (!username) {
      console.error('❌ loadMessages: username is required');
      return;
    }

    setLoadingMessages(true);
    try {
      logger.log('Loading messages for', username);
      const messagesData = await getMessages(username, 50);

      if (messagesData.success) {
        const messageList = messagesData.messages || [];
        logger.log('Loaded', messageList.length, 'messages');
        setMessages(messageList);
      }
    } catch (error) {
      logger.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  /**
   * ✅ WebSocket connection
   * username = agentCode (format เดียวกัน)
   */
  useEffect(() => {
    if (!isLoggedIn || !agent) {
      console.log('⏸️ Skipping WebSocket - not logged in');
      return;
    }

    if (!agent.username) {
      console.error('❌ Agent missing username:', agent);
      setError('Invalid user data');
      return;
    }

    // ✅ ใช้ username เป็น agentCode
    const agentCode = agent.username;
    logger.log('🔌 Setting up WebSocket for', agentCode, agent.role);
    
    const socket = connectSocket(agentCode, agent.role);
    
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

      status_updated: (data) => {
        logger.log('📊 Status updated:', data);
        setStatus(data.status);
      },

      status_error: (error) => {
        logger.error('❌ Status error:', error);
        setError(error.message || 'Status update failed');
      },

      new_message: (message) => {
        console.log('📨 New message received:', message);
        
        if (!message || !message.content) {
          console.error('❌ Invalid message');
          return;
        }

        if (!isLoggedInRef.current) {
          console.error('❌ Not logged in');
          return;
        }

        console.log('📝 Adding message...');
        setMessages(prev => {
          const isDuplicate = prev.some(m =>
            m._id === message._id || m.messageId === message.messageId
          );

          if (isDuplicate) {
            console.warn('⚠️ Duplicate');
            return prev;
          }

          console.log('✅ Added');
          return [message, ...prev];
        });

        const title = message.type === 'broadcast'
          ? `Broadcast from ${message.fromCode || message.fromUsername}`
          : `Message from ${message.fromCode || message.fromUsername}`;

        showDesktopNotification(title, message.content);
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
  }, [isLoggedIn, agent]);

  /**
   * ✅ Handle login
   */
  const handleLogin = useCallback(async (userData, token) => {
    console.log('🔐 Login successful:', userData);

    if (!userData || !userData.username) {
      console.error('❌ Invalid login data:', userData);
      setError('Invalid user data');
      return;
    }

    setAuthToken(token);
    setAgent(userData);
    setIsLoggedIn(true);
    setStatus(userData.status === 'Active' ? 'Available' : 'Offline');
    setError(null);

    // ✅ Load messages ด้วย username
    await loadMessages(userData.username);
  }, [loadMessages]);

  /**
   * ✅ Handle logout
   */
  const handleLogout = useCallback(async () => {
    logger.log('👋 Logging out');

    try {
      await logoutAgent();
    } catch (error) {
      logger.error('Logout failed:', error);
    }

    disconnectSocket();
    setIsLoggedIn(false);
    setAgent(null);
    setStatus('Offline');
    setMessages([]);
    setConnectionStatus('disconnected');
    setError(null);
  }, []);

  /**
   * ✅ Handle status change
   */
  const handleStatusChange = useCallback(async (newStatus) => {
    if (!agent || !agent.username) {
      console.error('❌ No agent data');
      setError('User data not available');
      return;
    }

    const agentCode = agent.username;
    logger.log('📊 Changing status to:', newStatus);

    const previousStatus = status;
    setStatus(newStatus);

    try {
      const socketSuccess = sendStatusUpdate(agentCode, newStatus);

      if (socketSuccess) {
        logger.log('✅ Status sent via WebSocket');
      } else {
        logger.log('🔄 HTTP fallback');
        await updateAgentStatus(agent.username, newStatus);
        logger.log('✅ Status updated via HTTP');
      }
    } catch (error) {
      logger.error('❌ Status update failed:', error);
      setStatus(previousStatus);
      setError('Failed to update status');
      setTimeout(() => setError(null), 3000);
    }
  }, [agent, status]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="app">
      <div className={`connection-status ${connectionStatus}`}>
        <div className="status-indicator"></div>
        <span>
          {connectionStatus === 'connected' && '✅ Connected'}
          {connectionStatus === 'disconnected' && '⚠️ Disconnected'}
          {connectionStatus === 'error' && '❌ Connection Error'}
        </span>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}

      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <AgentInfo agent={agent} status={status} />
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>

          <StatusPanel
            currentStatus={status}
            onStatusChange={handleStatusChange}
            disabled={connectionStatus !== 'connected'}
          />

          <MessagePanel
            messages={messages}
            username={agent?.username}
            loading={loadingMessages}
          />
        </div>
      )}
    </div>
  );
}

export default App;
```

</details>

---

## การทดสอบ

### 🧪 Test Checklist

```bash
Phase 1: Pre-Test Setup
├─ [ ] Backend v1.2 running on port 3001
├─ [ ] Database has users table with data
├─ [ ] MongoDB running
└─ [ ] Clear browser cache (Ctrl+Shift+R)

Phase 2: Login Testing
├─ [ ] Enter username: AG001
├─ [ ] Login successful
├─ [ ] See fullName displayed
├─ [ ] See role displayed
├─ [ ] See team displayed (if Agent/Supervisor)
└─ [ ] No errors in console

Phase 3: WebSocket Testing
├─ [ ] Connection status shows "Connected"
├─ [ ] No error: "Cannot read properties of undefined"
└─ [ ] Console shows: "✅ WebSocket connected"

Phase 4: Status Change Testing
├─ [ ] Click Available → Status changes
├─ [ ] Click Busy → Status changes
├─ [ ] Click Break → Status changes
├─ [ ] Click Offline → Status changes
└─ [ ] No errors in console

Phase 5: Messages Testing
├─ [ ] Messages load on startup
├─ [ ] Can see message list
├─ [ ] Send message via Postman
├─ [ ] Receive message in real-time
├─ [ ] Desktop notification shows
└─ [ ] Can mark as read

Phase 6: Error Handling Testing
├─ [ ] Stop backend → Shows disconnected
├─ [ ] Restart backend → Auto-reconnect
├─ [ ] Invalid username → Shows error
└─ [ ] Network error → User-friendly message
```

---

### 📝 Postman Testing

**Test 1: Send Direct Message**

```bash
POST http://localhost:3001/api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromCode": "SP001",
  "toCode": "AG001",
  "content": "Test message from supervisor",
  "type": "direct",
  "priority": "normal"
}
```

**Expected:**
- Message appears in Agent App
- Desktop notification shows
- Message count updates

---

**Test 2: Send Broadcast**

```bash
POST http://localhost:3001/api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromCode": "SP001",
  "content": "Team meeting in 15 minutes",
  "type": "broadcast",
  "priority": "high"
}
```

**Expected:**
- All agents receive message
- Broadcast icon shows
- High priority indicator

---

## Troubleshooting

### ❌ Error: Cannot read properties of undefined (reading 'toUpperCase')

**สาเหตุ:** ส่ง `undefined` ไป `connectSocket`

**แก้ไข:**
```javascript
// ใน App.js useEffect
if (!agent.username) {
  console.error('❌ Missing username');
  return;
}

const agentCode = agent.username;
const socket = connectSocket(agentCode, agent.role);
```

---

### ❌ Error: Invalid response - missing user data

**สาเหตุ:** Backend response structure ไม่ถูกต้อง

**ตรวจสอบ:**
```javascript
// Backend ต้องส่ง:
{
  "success": true,
  "user": {
    "id": 1,
    "username": "AG001",
    "fullName": "Agent Smith",
    "role": "Agent",
    "teamId": 1,
    "status": "Active"
  },
  "token": "jwt_token_here"
}
```

---

### ❌ CSS ไม่ทำงาน

**แก้ไข:**
```javascript
// ใน src/index.js
import './styles/App.css';
import './styles/components.css';

// Clear cache
// Ctrl + Shift + R (Windows/Linux)
// Cmd + Shift + R (Mac)
```

---

### ❌ WebSocket ไม่เชื่อมต่อ

**ตรวจสอบ:**
```bash
# 1. Backend running?
curl http://localhost:3001/health

# 2. Console error?
# F12 → Console tab

# 3. Network tab
# F12 → Network → WS (WebSocket)
```

---

### ❌ Messages ไม่แสดง

**ตรวจสอบ:**
```javascript
// Console
console.log('Messages:', messages);
console.log('Username:', agent?.username);

// Backend
GET http://localhost:3001/api/messages/agent/AG001
```

---

## Summary Table

### 📊 สรุปการเปลี่ยนแปลง

| ไฟล์ | เปลี่ยนแปลง | ใช้เวลา | ความยาก |
|------|------------|---------|---------|
| **api.js** | `agentCode` → `username` ใน 3 functions | 20 นาที | ⭐⭐ |
| **socket.js** | ไม่เปลี่ยน (อ่านเข้าใจ) | 10 นาที | ⭐ |
| **LoginForm.js** | Variable + validation + API call | 20 นาที | ⭐⭐ |
| **AgentInfo.js** | Property names + เพิ่ม role | 10 นาที | ⭐ |
| **MessagePanel.js** | Prop name | 5 นาที | ⭐ |
| **App.js** | Function calls ทั้งหมด + validation | 40 นาที | ⭐⭐⭐ |

**รวมเวลา: ~2 ชั่วโมง**

---

### ✅ Completion Checklist

```bash
Development
├─ [ ] ทุกไฟล์แก้ไขเสร็จ
├─ [ ] ไม่มี TODO comments
├─ [ ] ไม่มี console errors
└─ [ ] ทุก features ทำงานได้

Testing
├─ [ ] Login/Logout works
├─ [ ] WebSocket connects
├─ [ ] Messages load/receive
├─ [ ] Status changes work
├─ [ ] Notifications show
└─ [ ] Error handling works

Documentation
├─ [ ] Git commits meaningful
├─ [ ] README updated
└─ [ ] Test results documented

Deployment
├─ [ ] Build successful
├─ [ ] Production tested
└─ [ ] Ready for submission
```

---

## 🎓 Learning Outcomes

หลังจากทำ migration นี้เสร็จ นักศึกษาจะได้เรียนรู้:

1. ✅ **API Integration** - เข้าใจวิธีเชื่อมต่อ Frontend กับ Backend
2. ✅ **State Management** - จัดการ state ใน React
3. ✅ **WebSocket** - Real-time communication
4. ✅ **Error Handling** - จัดการ errors อย่างเหมาะสม
5. ✅ **Validation** - Validate ข้อมูลทั้ง client และ server
6. ✅ **Debugging** - แก้ไขปัญหาได้เอง
7. ✅ **Migration** - ปรับ code ให้รองรับ API ใหม่

---

**Document Version:** 4.0  
**Compatible with:** Backend v1.2  
**Last Updated:** October 2025  
**Status:** Production Ready ✅

---

**End of Document** 🎉