# 🔍 การตรวจสอบ Supervisor Dashboard Migration Guide

## ✅ ไฟล์ที่ครบถ้วนแล้ว (8 ไฟล์)

| # | ไฟล์ | สถานะ | หมายเหตุ |
|---|------|--------|----------|
| 1 | `src/services/api.js` | ✅ ครบ | 5 functions updated |
| 2 | `src/services/socket.js` | ✅ ครบ | No changes needed |
| 3 | `src/components/LoginForm.js` | ✅ ครบ | Username + role validation |
| 4 | `src/components/AgentCard.js` | ✅ ครบ | Property names updated |
| 5 | `src/components/AgentList.js` | ✅ ครบ | Filters + role filter |
| 6 | `src/components/SendMessageForm.js` | ✅ ครบ | Username as code |
| 7 | `src/App.js` | ✅ ครบ | State + WebSocket |
| 8 | `src/components/Dashboard.js` | ⚠️ **ขาด** | ยังไม่ได้เขียนเนื้อหา |

---

## ❌ ไฟล์ที่ขาดหายไป

### **src/components/Dashboard.js** - สำคัญมาก!

Component นี้แสดงข้อมูล Supervisor และควบคุม header ของ dashboard

---

## ⚠️ ส่วนอื่นที่ควรเพิ่มเติม

### 1. **src/components/MessageHistory.js**

ในเอกสารมีการ reference แต่ไม่มีเนื้อหาครบ

### 2. **CSS/Styling**

ยังไม่มีคำแนะนำเรื่อง CSS สำหรับ Supervisor Dashboard

### 3. **Environment Configuration**

ยังไม่มี `.env` setup guide

### 4. **Complete Testing Script**

Test script ยังไม่ละเอียดพอ

---

# 📝 เอกสารเพิ่มเติม - ไฟล์ที่ขาดหายไป

## 8️⃣ **src/components/Dashboard.js** (สำคัญ! - 15 นาที)

```javascript
// components/Dashboard.js - Version 4.0

import React from 'react';

function Dashboard({ supervisor, onLogout, connectionStatus }) {
  if (!supervisor) return null;

  const getConnectionColor = (status) => {
    const colors = {
      connected: '#4CAF50',
      disconnected: '#9E9E9E',
      error: '#F44336'
    };
    return colors[status] || colors.disconnected;
  };

  return (
    <div className="dashboard-header">
      <div className="dashboard-left">
        {/* Supervisor Avatar */}
        <div className="supervisor-avatar">
          <span>👨‍💼</span>
        </div>

        {/* Supervisor Info */}
        <div className="supervisor-info">
          {/* ✅ เปลี่ยนจาก agentName เป็น fullName */}
          <h2 className="supervisor-name">{supervisor.fullName}</h2>
          
          <div className="supervisor-meta">
            {/* ✅ เปลี่ยนจาก agentCode เป็น username */}
            <div className="meta-item">
              <span className="label">Code:</span>
              <span className="value">{supervisor.username}</span>
            </div>

            {/* ✅ แสดง role badge */}
            <div className="meta-item">
              <span className="label">Role:</span>
              <span className="role-badge supervisor">
                {supervisor.role}
              </span>
            </div>

            {/* ✅ แสดง team */}
            {supervisor.teamId && (
              <div className="meta-item">
                <span className="label">Team:</span>
                <span className="value">
                  {supervisor.teamName || `Team ${supervisor.teamId}`}
                </span>
              </div>
            )}
          </div>

          {/* Connection Status Indicator */}
          <div className="connection-info">
            <span 
              className="connection-dot"
              style={{ backgroundColor: getConnectionColor(connectionStatus) }}
            ></span>
            <span className="connection-text">
              {connectionStatus === 'connected' && 'Real-time Connected'}
              {connectionStatus === 'disconnected' && 'Disconnected'}
              {connectionStatus === 'error' && 'Connection Error'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-right">
        {/* Quick Stats (Optional) */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-label">My Team</div>
              <div className="stat-value">
                {supervisor.teamName || `Team ${supervisor.teamId}`}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={onLogout} className="logout-btn">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
```

**🎓 Key Changes:**
- ✅ `supervisor.agentName` → `supervisor.fullName`
- ✅ `supervisor.agentCode` → `supervisor.username`
- ✅ แสดง `role` badge
- ✅ แสดง `teamId` และ `teamName`
- ✅ Connection status indicator

---

## 9️⃣ **src/components/MessageHistory.js** (ปานกลาง - 20 นาที)

```javascript
// components/MessageHistory.js - Version 4.0

import React, { useState, useEffect } from 'react';
import { getMessageHistory } from '../services/api';
import { formatTime, getTimeAgo } from '../utils/dateUtils';

function MessageHistory({ agent, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'sent', 'received'

  useEffect(() => {
    if (agent) {
      loadHistory();
    }
  }, [agent]);

  const loadHistory = async () => {
    if (!agent?.username) {
      setError('Invalid agent data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📜 Loading message history for:', agent.username);
      
      // ✅ ใช้ username แทน agentCode
      const result = await getMessageHistory(agent.username, 50);

      if (result.success) {
        setMessages(result.messages || []);
        console.log('✅ Loaded', result.messages?.length || 0, 'messages');
      }
    } catch (err) {
      console.error('❌ Failed to load history:', err);
      setError(err.message || 'Failed to load message history');
    } finally {
      setLoading(false);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'sent') return msg.fromCode !== agent.username;
    if (filter === 'received') return msg.fromCode === agent.username;
    return true;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#F44336',
      normal: '#2196F3',
      low: '#9E9E9E'
    };
    return colors[priority] || colors.normal;
  };

  return (
    <div className="message-history">
      {/* Header */}
      <div className="history-header">
        <div className="header-info">
          <h3>Message History</h3>
          <p className="agent-info">
            {/* ✅ ใช้ fullName และ username */}
            {agent.fullName} ({agent.username})
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-close">✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="history-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({messages.length})
        </button>
        <button
          className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
          onClick={() => setFilter('sent')}
        >
          Sent ({messages.filter(m => m.fromCode !== agent.username).length})
        </button>
        <button
          className={`filter-btn ${filter === 'received' ? 'active' : ''}`}
          onClick={() => setFilter('received')}
        >
          Received ({messages.filter(m => m.fromCode === agent.username).length})
        </button>
        <button
          className="btn-refresh"
          onClick={loadHistory}
          disabled={loading}
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Content */}
      <div className="history-content">
        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading message history...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
            <button onClick={loadHistory} className="btn-retry">
              Retry
            </button>
          </div>
        )}

        {/* Messages */}
        {!loading && !error && (
          <div className="message-list">
            {filteredMessages.length === 0 ? (
              <div className="no-messages">
                <div className="no-messages-icon">📭</div>
                <p>No messages found</p>
                <small>
                  {filter === 'all' 
                    ? 'No message history available'
                    : `No ${filter} messages`
                  }
                </small>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div 
                  key={message._id || message.messageId}
                  className={`message-item ${
                    message.fromCode === agent.username ? 'outgoing' : 'incoming'
                  } ${message.type}`}
                >
                  {/* Message Header */}
                  <div className="message-header">
                    <div className="message-from">
                      {message.type === 'broadcast' && (
                        <span className="broadcast-icon">📢</span>
                      )}
                      <span className="from-label">
                        {message.fromCode === agent.username ? 'From Agent:' : 'To Agent:'}
                      </span>
                      <strong>{message.fromCode}</strong>
                    </div>

                    <div className="message-meta">
                      {/* Priority Indicator */}
                      {message.priority && message.priority !== 'normal' && (
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(message.priority) }}
                        >
                          {message.priority}
                        </span>
                      )}

                      {/* Time */}
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                      </span>
                      <span className="time-ago">
                        ({getTimeAgo(message.createdAt)})
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="message-content">
                    {message.content}
                  </div>

                  {/* Message Footer */}
                  <div className="message-footer">
                    <span className="message-type">{message.type}</span>
                    {message.isRead && (
                      <span className="read-status">✓ Read</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="history-footer">
        <p className="message-count">
          Showing {filteredMessages.length} of {messages.length} messages
        </p>
      </div>
    </div>
  );
}

export default MessageHistory;
```

**🎓 Key Changes:**
- ✅ ใช้ `agent.username` แทน `agent.agentCode`
- ✅ ใช้ `agent.fullName` แทน `agent.agentName`
- ✅ Filter messages (all/sent/received)
- ✅ Display priority และ message type
- ✅ Show read status

---

## 🔟 **src/utils/dateUtils.js** (ง่าย - 5 นาที)

```javascript
// utils/dateUtils.js - Date formatting utilities

/**
 * Format time to HH:MM:SS
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format datetime to DD/MM/YYYY HH:MM
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid datetime';
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 30) {
      return `${diffDays}d ago`;
    } else {
      return formatDate(timestamp);
    }
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'N/A';
  }
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp) => {
  if (!timestamp) return false;
  
  try {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Format time range
 */
export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return 'N/A';
  
  try {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  } catch (error) {
    return 'Invalid range';
  }
};
```

---

## 1️⃣1️⃣ **Environment Configuration** (.env)

```bash
# .env - Supervisor Dashboard Configuration

# API Base URL
REACT_APP_API_URL=http://localhost:3001/api

# WebSocket URL
REACT_APP_SOCKET_URL=http://localhost:3001

# App Configuration
REACT_APP_NAME=Supervisor Dashboard
REACT_APP_VERSION=4.0

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_MESSAGE_HISTORY=true

# Polling Intervals (milliseconds)
REACT_APP_AGENT_LIST_REFRESH=30000
REACT_APP_STATUS_CHECK_INTERVAL=10000

# Limits
REACT_APP_MESSAGE_MAX_LENGTH=500
REACT_APP_MESSAGE_HISTORY_LIMIT=50
```

**📝 .env.example:**
```bash
# Copy this file to .env and update values

REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
```

---

## 1️⃣2️⃣ **CSS - Supervisor Dashboard Styles**

### **src/styles/supervisor.css** (เพิ่มเติม)

```css
/* ========================================
   Supervisor Dashboard Specific Styles
   ======================================== */

/* Dashboard Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.supervisor-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.supervisor-info {
  flex: 1;
}

.supervisor-name {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.supervisor-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.meta-item .label {
  opacity: 0.8;
  font-weight: 500;
}

.meta-item .value {
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.supervisor {
  background: rgba(255, 152, 0, 0.3);
  color: #FFF3E0;
  border: 1px solid rgba(255, 152, 0, 0.5);
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.9;
}

.connection-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Dashboard Right */
.dashboard-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quick-stats {
  display: flex;
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  text-align: left;
}

.stat-label {
  font-size: 11px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  margin-top: 2px;
}

/* Logout Button */
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #D32F2F;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

/* Agent Grid */
.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Agent Card */
.agent-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.agent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.agent-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 2px solid #e0e0e0;
}

.agent-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.agent-info {
  flex: 1;
  min-width: 0;
}

.agent-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.agent-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.agent-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #666;
}

.status-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Agent Card Body */
.agent-card-body {
  padding: 16px;
}

.agent-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.detail-item .label {
  color: #999;
  font-weight: 500;
}

.detail-item .value {
  color: #333;
  font-weight: 700;
}

/* Agent Card Actions */
.agent-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Agent Stats */
.agent-stats {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  white-space: nowrap;
  border: 2px solid;
}

.stat-item.available {
  border-color: #4CAF50;
}

.stat-item.busy {
  border-color: #FF9800;
}

.stat-item.break {
  border-color: #2196F3;
}

.stat-item.offline {
  border-color: #9E9E9E;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Message History */
.message-history {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.history-header h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #333;
}

.agent-info {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #F44336;
  color: white;
  transform: scale(1.1);
}

.history-filters {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
}

.message-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.message-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-item.outgoing {
  border-left: 5px solid #4CAF50;
  background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
}

.message-item.incoming {
  border-left: 5px solid #2196F3;
  background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
}

.message-item.broadcast {
  border-left: 5px solid #FF9800;
  background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-from {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.broadcast-icon {
  font-size: 16px;
}

.from-label {
  color: #999;
  font-weight: 500;
}

.message-from strong {
  color: #333;
  font-family: 'Courier New', monospace;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 10px;
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.message-time {
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.time-ago {
  color: #bbb;
  font-style: italic;
}

.message-content {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
  word-wrap: break-word;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  font-size: 11px;
}

.message-type {
  padding: 3px 8px;
  background: #f5f5f5;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  color: #666;
}

.read-status {
  color: #4CAF50;
  font-weight: 700;
}

.history-footer {
  padding: 12px 20px;
  border-top: 2px solid #e0e0e0;
  background: #f8f9fa;
  text-align: center;
}

.message-count {
  margin: 0;
  font-size: 13px;
  color: #666;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .agent-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }

  .dashboard-right {
    width: 100%;
    flex-direction: column;
  }

  .quick-stats {
    width: 100%;
    justify-content: space-around;
  }

  .logout-btn {
    width: 100%;
  }
}
```

---

## 1️⃣3️⃣ **Complete Testing Script**

### **testing-guide.md**

```markdown
# 🧪 Supervisor Dashboard Testing Guide

## Pre-Test Setup

### 1. Backend Preparation
```bash
# 1. Start Backend
cd backend-server
npm start

# 2. Verify Backend running
curl http://localhost:3001/health

# Expected:
{
  "status": "healthy",
  "timestamp": "2025-10-10T10:00:00.000Z"
}
```

### 2. Database Preparation
```sql
-- Verify Supervisors exist
SELECT * FROM users WHERE role = 'Supervisor';

-- Expected:
-- SP001, SP002, SP003 with teamId assigned

-- Verify Agents exist
SELECT * FROM users WHERE role = 'Agent';

-- Expected:
-- AG001, AG002, AG003, etc. with teamId assigned

-- Verify teams match
SELECT DISTINCT teamId FROM users WHERE role IN ('Agent', 'Supervisor');
```

### 3. Frontend Preparation
```bash
# 1. Install dependencies
cd supervisor-dashboard
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env if needed

# 3. Start frontend
npm start

# Expected:
# App running on http://localhost:3000
```

---

## Test Scenarios

### Scenario 1: Login Flow ✅

**Test Case 1.1: Valid Supervisor Login**
```
Steps:
1. Open http://localhost:3000
2. Enter username: SP001
3. Click "Sign In"

Expected:
✓ Login successful
✓ Dashboard displayed
✓ Supervisor name shown (fullName, not agentName)
✓ Supervisor code shown (username, not agentCode)
✓ Role badge shows "Supervisor"
✓ Team info displayed
✓ Connection status: "Connected"

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 1.2: Invalid Supervisor Code**
```
Steps:
1. Enter username: SP999 (doesn't exist)
2. Click "Sign In"

Expected:
✓ Error message displayed
✓ "Login failed" or similar error
✓ Stay on login page

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 1.3: Non-Supervisor Account**
```
Steps:
1. Enter username: AG001 (Agent account)
2. Click "Sign In"

Expected:
✓ Error message: "Access denied. Supervisor role required."
✓ Stay on login page

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 1.4: Backend Offline**
```
Steps:
1. Stop backend (Ctrl+C)
2. Enter username: SP001
3. Click "Sign In"

Expected:
✓ Error message: "Cannot connect to server"
✓ Server status shows "offline"
✓ Retry button available

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

### Scenario 2: Agent List Display ✅

**Test Case 2.1: Load Team Agents**
```
Steps:
1. Login as SP001 (Team 1)
2. Wait for agent list to load

Expected:
✓ Only Team 1 agents displayed
✓ Agent cards show:
  - fullName (not agentName)
  - username (not agentCode)
  - role badge
  - current status
✓ No agents from other teams

Database Verification:
SELECT * FROM users WHERE role = 'Agent' AND teamId = 1;

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 2.2: Filter by Status**
```
Steps:
1. Select "Available" from status filter
2. Observe filtered results

Expected:
✓ Only Available agents shown
✓ Count matches filter

Repeat for: Busy, Break, Offline

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 2.3: Filter by Role**
```
Steps:
1. Select "Agents Only" (default)
2. Select "Supervisors Only"
3. Select "All Roles"

Expected:
✓ Agents Only: Only Agent role users
✓ Supervisors Only: Only Supervisor role users
✓ All Roles: Both displayed

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 2.4: Search Functionality**
```
Steps:
1. Type "AG001" in search box
2. Type "Agent Smith" in search box
3. Clear search

Expected:
✓ Search by username works
✓ Search by fullName works
✓ Clear button works
✓ Results update in real-time

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

### Scenario 3: WebSocket Real-Time Updates ✅

**Test Case 3.1: Connection Establishment**
```
Steps:
1. Login as SP001
2. Check browser console (F12)

Expected Console Logs:
✓ "🔌 Setting up WebSocket for SP001 Supervisor"
✓ "✅ WebSocket connected: [socket_id]"
✓ No error messages

Expected UI:
✓ Connection status: "Connected" (green)

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 3.2: Agent Status Update (Real-time)**
```
Steps:
1. Supervisor Dashboard: Login as SP001
2. Agent Desktop: Login as AG001 (same team)
3. Agent Desktop: Change status to "Busy"
4. Observe Supervisor Dashboard

Expected:
✓ Agent card updates to "Busy" (no refresh needed)
✓ Status indicator color changes
✓ Stats bar updates count

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 3.3: Agent Connect/Disconnect**
```
Steps:
1. Supervisor Dashboard open (SP001)
2. Agent Desktop: Login AG001
3. Agent Desktop: Logout AG001
4. Observe Supervisor Dashboard

Expected:
✓ Agent appears when connected
✓ Agent status changes when disconnected
✓ Real-time updates (no manual refresh)

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

### Scenario 4: Send Messages ✅

**Test Case 4.1: Send Direct Message**
```
Steps:
1. Login as SP001
2. Find AG001 in agent list
3. Click "Send Message"
4. Type message: "Test direct message"
5. Select Priority: "Normal"
6. Click "Send Message"

Expected:
✓ Modal opens with AG001 info
✓ Message sends successfully
✓ Success notification
✓ Modal closes

Backend Verification:
Check MongoDB messages collection:
{
  fromCode: "SP001",
  toCode: "AG001",
  content: "Test direct message",
  type: "direct",
  priority: "normal"
}

Agent Verification:
✓ AG001 receives message in Agent Desktop
✓ Desktop notification appears

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 4.2: Send Broadcast Message**
```
Steps:
1. Click any agent "Send Message"
2. Select "Broadcast to Team"
3. Type: "Team meeting in 15 minutes"
4. Priority: "High"
5. Send

Expected:
✓ Message type changes to broadcast
✓ Recipient field disabled
✓ Message sends to ALL team agents

Backend Verification:
{
  fromCode: "SP001",
  toCode: null or undefined,
  type: "broadcast",
  priority: "high"
}

Agent Verification:
✓ ALL team agents (AG001, AG002, AG003) receive message
✓ Broadcast icon appears in Agent Desktop

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 4.3: Validation**
```
Steps:
1. Try to send empty message
2. Try to send 501+ character message
3. Try to send without selecting agent (direct)

Expected:
✓ Empty message: "Message content is required"
✓ Too long: "Message is too long (max 500 characters)"
✓ No agent: "Please select an agent"
✓ Send button disabled appropriately

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

### Scenario 5: Message History ✅

**Test Case 5.1: View Agent Message History**
```
Steps:
1. Login as SP001
2. Find AG001
3. Click "View History"

Expected:
✓ Modal opens with AG001 info
✓ Messages load (sent + received)
✓ Messages show:
  - Correct username (not agentCode)
  - Timestamp
  - Priority
  - Type (direct/broadcast)
  - Read status

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 5.2: Filter History**
```
Steps:
1. Open history for AG001
2. Click "Sent" filter
3. Click "Received" filter
4. Click "All" filter

Expected:
✓ Sent: Only messages TO agent
✓ Received: Only messages FROM agent
✓ All: All messages
✓ Count badges update

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

### Scenario 6: Error Handling ✅

**Test Case 6.1: Network Disconnection**
```
Steps:
1. Login successfully
2. Stop backend server
3. Try to send message
4. Try to refresh agent list

Expected:
✓ WebSocket status: "Disconnected"
✓ Error messages displayed
✓ Retry options available
✓ App doesn't crash

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

**Test Case 6.2: Invalid Data Response**
```
Steps:
(Requires backend modification for testing)
1. Backend returns malformed response
2. Observe frontend behavior

Expected:
✓ Graceful error handling
✓ User-friendly error message
✓ Console logs error details
✓ App remains functional

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

### Scenario 7: Logout ✅

**Test Case 7.1: Normal Logout**
```
Steps:
1. Login as SP001
2. Click "Logout" button
3. Observe

Expected:
✓ WebSocket disconnects
✓ Return to login page
✓ All state cleared
✓ No errors in console

Actual Result: ___________
Status: [ ] PASS / [ ] FAIL
```

---

## Performance Testing

### Load Time
```
Test: Initial page load
Expected: < 3 seconds

Test: Agent list load
Expected: < 2 seconds

Test: WebSocket connection
Expected: < 1 second

Actual Results:
_____________
```

### Memory Usage
```
Test: Idle for 10 minutes
Expected: Memory stable, no leaks

Test: 50 agent cards displayed
Expected: < 100MB memory increase

Actual Results:
_____________
```

---

## Cross-Browser Testing

### Chrome
```
Version: ___________
Login: [ ] PASS / [ ] FAIL
Agent List: [ ] PASS / [ ] FAIL
WebSocket: [ ] PASS / [ ] FAIL
Send Message: [ ] PASS / [ ] FAIL
```

### Firefox
```
Version: ___________
Login: [ ] PASS / [ ] FAIL
Agent List: [ ] PASS / [ ] FAIL
WebSocket: [ ] PASS / [ ] FAIL
Send Message: [ ] PASS / [ ] FAIL
```

### Safari (if available)
```
Version: ___________
Login: [ ] PASS / [ ] FAIL
Agent List: [ ] PASS / [ ] FAIL
WebSocket: [ ] PASS / [ ] FAIL
Send Message: [ ] PASS / [ ] FAIL
```

---

## Bug Report Template

```markdown
### Bug #___

**Title:** _______________

**Severity:** [ ] Critical / [ ] High / [ ] Medium / [ ] Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
_______________

**Actual Result:**
_______________

**Screenshots:**
(attach if applicable)

**Console Errors:**
```
(paste console output)
```

**Environment:**
- Browser: ___________
- OS: ___________
- Backend Version: ___________
- Frontend Version: ___________

**Status:** [ ] Open / [ ] Fixed / [ ] Closed
```

---

## Sign-Off

```
Tester Name: _______________
Date: _______________
Overall Status: [ ] PASS / [ ] FAIL

Summary:
Total Tests: ___
Passed: ___
Failed: ___
Skipped: ___

Critical Issues: ___
High Priority Issues: ___
Medium Priority Issues: ___
Low Priority Issues: ___

Recommendation: [ ] Ready for Production / [ ] Needs Work

Notes:
_______________________
_______________________
_______________________
```
```

---

## 📊 Summary - ไฟล์ที่เพิ่มเติมทั้งหมด

| # | ไฟล์ | สถานะ | ความสำคัญ |
|---|------|--------|-----------|
| 8 | `Dashboard.js` | ✅ เพิ่มแล้ว | 🔴 Critical |
| 9 | `MessageHistory.js` | ✅ เพิ่มแล้ว | 🟡 Important |
| 10 | `dateUtils.js` | ✅ เพิ่มแล้ว | 🟡 Important |
| 11 | `.env` | ✅ เพิ่มแล้ว | 🟡 Important |
| 12 | `supervisor.css` | ✅ เพิ่มแล้ว | 🟢 Nice to have |
| 13 | `testing-guide.md` | ✅ เพิ่มแล้ว | 🟡 Important |

---

## ✅ สรุปความครบถ้วน

### **
