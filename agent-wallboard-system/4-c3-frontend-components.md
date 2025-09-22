# Section 1: Frontend Components (5-7 หน้า)
**Agent Wallboard System - C4 Model Level 3**

**Document ID:** C3-AWS-FRONTEND-001  
**Version:** 1.0  
**วันที่:** กันยายน 2025  
**จัดทำโดย:** อาจารย์ ENGSE206 - RMUTL (ดอยสะเก็ด)

---

## 🖥️ 1.1 Frontend Architecture Overview

### 1.1.1 Frontend Components Strategy

Agent Wallboard System ใช้ **Multi-Platform Frontend Architecture** โดยแบ่งเป็น 3 แอปพลิเคชันหลักตาม User Roles และ Use Cases:

```mermaid
graph TB
    subgraph "Frontend Applications"
        subgraph "Agent Desktop App (Electron)"
            A1[StatusComponent<br/>🎚️ Status Management]
            A2[MessageComponent<br/>💬 Inbox & Notifications]
            A3[LoginComponent<br/>🔐 Authentication]
            A4[ProfileComponent<br/>👤 Agent Information]
        end
        
        subgraph "Supervisor Dashboard (React Web)"
            B1[TeamDashboard<br/>📊 Team Overview]
            B2[MessageSender<br/>📨 Broadcast Messages]
            B3[AgentMonitor<br/>👥 Real-time Monitoring]
            B4[Analytics<br/>📈 Performance Charts]
        end
        
        subgraph "Admin Panel (React Web)"
            C1[UserManager<br/>👨‍💼 User CRUD]
            C2[ConfigPanel<br/>⚙️ System Settings]
            C3[AuditViewer<br/>📋 Logs & Reports]
        end
        
        subgraph "Shared Services"
            S1[APIService<br/>🔌 HTTP Client]
            S2[WebSocketService<br/>⚡ Real-time Client]
            S3[AuthService<br/>🛡️ Token Management]
            S4[NotificationService<br/>🔔 Desktop Notifications]
        end
    end
    
    subgraph "Backend Services"
        API[API Server]
        WS[WebSocket Server]
        AUTH[Auth Service]
    end
    
    A1 --> S1
    A2 --> S2
    B1 --> S1
    B2 --> S2
    C1 --> S1
    
    S1 --> API
    S2 --> WS
    S3 --> AUTH
    
    classDef desktopApp fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef webApp fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef adminApp fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef sharedService fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef backend fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A1,A2,A3,A4 desktopApp
    class B1,B2,B3,B4 webApp
    class C1,C2,C3 adminApp
    class S1,S2,S3,S4 sharedService
    class API,WS,AUTH backend
```

### 1.1.2 Technology Stack และ User Stories Mapping

| **Application** | **Technology** | **Primary Users** | **User Stories Supported** |
|-----------------|----------------|-------------------|----------------------------|
| **Agent Desktop App** | Electron + React | Call Center Agents | US-001, US-002, US-007 |
| **Supervisor Dashboard** | React + Material-UI | Team Supervisors | US-003, US-004, US-008 |
| **Admin Panel** | React + Ant Design | System Administrators | US-010, US-011, US-012, US-014 |

### 1.1.3 Component Design Principles

**1. Single Responsibility Principle:**
- แต่ละ Component มีหน้าที่เฉพาะเจาะจง
- StatusComponent → จัดการสถานะ Agent เท่านั้น
- MessageComponent → จัดการข้อความเท่านั้น

**2. Loose Coupling:**
- Components ติดต่อผ่าน Shared Services
- ไม่มี Direct dependency ระหว่าง UI Components

**3. High Cohesion:**
- Related functionalities จัดกลุ่มใน Component เดียวกัน
- Business logic แยกออกจาก UI logic

---

## 🖥️ 1.2 Agent Desktop App Components

### 1.2.1 Desktop App Architecture

```mermaid
graph LR
    subgraph "Agent Desktop App (Electron)"
        subgraph "Main Process"
            MP[Main Process<br/>Window Management<br/>System Tray<br/>Auto Updates]
        end
        
        subgraph "Renderer Process"
            subgraph "React Components"
                LOGIN[LoginComponent<br/>🔐]
                STATUS[StatusComponent<br/>🎚️]
                MSG[MessageComponent<br/>💬]
                PROFILE[ProfileComponent<br/>👤]
            end
            
            subgraph "Services"
                API_SVC[APIService]
                WS_SVC[WebSocketService]
                AUTH_SVC[AuthService]
                NOTIF_SVC[NotificationService]
            end
        end
        
        subgraph "IPC Communication"
            IPC[IPC Channel<br/>Process Communication]
        end
    end
    
    LOGIN --> AUTH_SVC
    STATUS --> API_SVC
    MSG --> WS_SVC
    PROFILE --> API_SVC
    
    API_SVC --> IPC
    WS_SVC --> IPC
    IPC --> MP
    
    classDef component fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef service fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef process fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    
    class LOGIN,STATUS,MSG,PROFILE component
    class API_SVC,WS_SVC,AUTH_SVC,NOTIF_SVC service
    class MP,IPC process
```

### 1.2.2 Agent Desktop App UI Mockup

```html
<!-- Agent Desktop App UI Layout -->
<div class="agent-desktop-app">
  <!-- Header Bar -->
  <header class="app-header">
    <div class="agent-info">
      <img src="agent-avatar.png" class="avatar" />
      <span class="agent-name">John Agent (AG001)</span>
    </div>
    <div class="system-controls">
      <button class="minimize-btn">_</button>
      <button class="close-btn">×</button>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="app-content">
    <!-- Status Management Section -->
    <section class="status-section">
      <h3>Current Status</h3>
      <div class="status-display">
        <div class="status-indicator available"></div>
        <select class="status-dropdown">
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Break">Break</option>
          <option value="Training">Training</option>
          <option value="Meeting">Meeting</option>
        </select>
        <span class="status-timer">02:45:30</span>
      </div>
      <div class="status-actions">
        <button class="quick-break-btn">Quick Break (15 min)</button>
        <button class="emergency-btn">Emergency</button>
      </div>
    </section>

    <!-- Message/Notification Section -->
    <section class="message-section">
      <h3>Messages & Notifications</h3>
      <div class="message-list">
        <div class="message-item unread">
          <div class="message-header">
            <span class="sender">Supervisor Smith</span>
            <span class="timestamp">10:30 AM</span>
          </div>
          <div class="message-content">
            Team meeting in 15 minutes - Conference Room A
          </div>
        </div>
        <div class="message-item">
          <div class="message-header">
            <span class="sender">System</span>
            <span class="timestamp">09:45 AM</span>
          </div>
          <div class="message-content">
            System maintenance scheduled for tonight 11 PM
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <button class="action-btn">View Schedule</button>
      <button class="action-btn">Contact Supervisor</button>
      <button class="action-btn">Help & Support</button>
    </section>
  </main>

  <!-- Status Bar -->
  <footer class="status-bar">
    <span class="connection-status">Connected</span>
    <span class="last-sync">Last sync: 2 minutes ago</span>
  </footer>
</div>
```

### 1.2.3 Desktop App Components Detail

#### 🔐 **LoginComponent**
**Purpose:** จัดการการ authentication ของ Agent  
**User Story:** US-001 (Agent Login)

**Key Functions:**
- รับ Agent Code และ Password
- ตรวจสอบ credentials กับ Authentication Service
- จัดการ Remember Login และ Auto-login
- แสดง error messages และ validation

**React Component Code:**
```jsx
// LoginComponent.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateAgentCode } from '../utils/validation';

const LoginComponent = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    agentCode: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.agentCode) {
      newErrors.agentCode = 'Agent Code is required';
    } else if (!validateAgentCode(formData.agentCode)) {
      newErrors.agentCode = 'Invalid Agent Code format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await login({
        agentCode: formData.agentCode,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Connection failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill saved credentials
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedAgentCredentials');
    if (savedCredentials) {
      const { agentCode } = JSON.parse(savedCredentials);
      setFormData(prev => ({ ...prev, agentCode, rememberMe: true }));
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Agent Login</h2>
          <p>Sign in to access your wallboard</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="agentCode">Agent Code</label>
            <input
              type="text"
              id="agentCode"
              name="agentCode"
              value={formData.agentCode}
              onChange={handleInputChange}
              placeholder="Enter your agent code (e.g., AG001)"
              className={errors.agentCode ? 'error' : ''}
              autoComplete="username"
            />
            {errors.agentCode && (
              <span className="error-text">{errors.agentCode}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              Remember me
            </label>
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="#forgot-password">Forgot password?</a>
          <a href="#contact-admin">Contact administrator</a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
```

**Dependencies:** AuthService, Validation Utils, Local Storage

#### 🎚️ **StatusComponent**
**Purpose:** จัดการการเปลี่ยนสถานะของ Agent  
**User Story:** US-002 (Agent Status Management)

**Key Functions:**
- แสดงสถานะปัจจุบันแบบ real-time
- เปลี่ยนสถานะด้วย dropdown และ quick actions
- แสดง timer สำหรับสถานะปัจจุบัน
- Validation business rules สำหรับการเปลี่ยนสถานะ

**React Component Code:**
```jsx
// StatusComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAPI } from '../hooks/useAPI';
import { StatusIndicator } from './StatusIndicator';
import { StatusTimer } from './StatusTimer';

const StatusComponent = ({ agentId, onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState('Available');
  const [previousStatus, setPreviousStatus] = useState(null);
  const [statusStartTime, setStatusStartTime] = useState(new Date());
  const [isChanging, setIsChanging] = useState(false);
  const [statusOptions] = useState([
    { value: 'Available', label: 'Available', color: '#4CAF50' },
    { value: 'Busy', label: 'Busy', color: '#FF9800' },
    { value: 'Break', label: 'Break', color: '#2196F3' },
    { value: 'Training', label: 'Training', color: '#9C27B0' },
    { value: 'Meeting', label: 'Meeting', color: '#673AB7' },
    { value: 'Lunch', label: 'Lunch', color: '#795548' },
    { value: 'Offline', label: 'Offline', color: '#F44336' }
  ]);

  const { updateAgentStatus } = useAPI();
  const { sendEvent, lastMessage } = useWebSocket();
  const dropdownRef = useRef(null);

  // Listen for real-time status updates
  useEffect(() => {
    if (lastMessage?.type === 'agent-status-updated' && 
        lastMessage?.data?.agentId === agentId) {
      const { status, timestamp } = lastMessage.data;
      setCurrentStatus(status);
      setStatusStartTime(new Date(timestamp));
    }
  }, [lastMessage, agentId]);

  const validateStatusChange = (newStatus) => {
    // Business rules for status transitions
    const invalidTransitions = {
      'Offline': ['Break', 'Lunch'], // Can't go to break from offline
      'Training': ['Offline']        // Can't go offline during training
    };

    if (invalidTransitions[currentStatus]?.includes(newStatus)) {
      return {
        valid: false,
        message: `Cannot change from ${currentStatus} to ${newStatus}`
      };
    }

    return { valid: true };
  };

  const handleStatusChange = async (newStatus, reason = null) => {
    const validation = validateStatusChange(newStatus);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setIsChanging(true);
    try {
      const result = await updateAgentStatus({
        agentId,
        status: newStatus,
        previousStatus: currentStatus,
        reason,
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        setPreviousStatus(currentStatus);
        setCurrentStatus(newStatus);
        setStatusStartTime(new Date());
        
        // Send real-time update
        sendEvent('agent-status-change', {
          agentId,
          status: newStatus,
          timestamp: new Date().toISOString()
        });

        onStatusChange?.(newStatus);
      } else {
        alert('Failed to update status: ' + result.message);
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Connection error. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'quick-break':
        handleStatusChange('Break', '15-minute break');
        break;
      case 'emergency':
        handleStatusChange('Offline', 'Emergency');
        break;
      case 'back-available':
        handleStatusChange('Available', 'Back from ' + currentStatus.toLowerCase());
        break;
      default:
        break;
    }
  };

  const getCurrentStatusConfig = () => {
    return statusOptions.find(option => option.value === currentStatus);
  };

  return (
    <div className="status-component">
      <div className="status-header">
        <h3>Current Status</h3>
        {previousStatus && (
          <span className="previous-status">
            Previously: {previousStatus}
          </span>
        )}
      </div>

      <div className="status-display">
        <StatusIndicator 
          status={currentStatus}
          color={getCurrentStatusConfig()?.color}
          isChanging={isChanging}
        />
        
        <div className="status-info">
          <select
            ref={dropdownRef}
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isChanging}
            className="status-dropdown"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <StatusTimer 
            startTime={statusStartTime}
            status={currentStatus}
          />
        </div>
      </div>

      <div className="status-actions">
        {currentStatus !== 'Break' && (
          <button
            onClick={() => handleQuickAction('quick-break')}
            disabled={isChanging}
            className="quick-action-btn break-btn"
          >
            Quick Break (15 min)
          </button>
        )}
        
        {currentStatus === 'Break' && (
          <button
            onClick={() => handleQuickAction('back-available')}
            disabled={isChanging}
            className="quick-action-btn available-btn"
          >
            Back to Available
          </button>
        )}
        
        <button
          onClick={() => handleQuickAction('emergency')}
          disabled={isChanging}
          className="quick-action-btn emergency-btn"
        >
          Emergency
        </button>
      </div>

      <div className="status-history">
        <small>
          Started {currentStatus.toLowerCase()} at{' '}
          {statusStartTime.toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
};

export default StatusComponent;
```

**Dependencies:** APIService, WebSocketService, StatusIndicator, StatusTimer

#### 💬 **MessageComponent**
**Purpose:** จัดการข้อความและการแจ้งเตือน  
**User Story:** US-007 (Agent Message Receiving)

**Key Functions:**
- แสดงข้อความใหม่แบบ real-time
- จัดการ read/unread status
- แสดง notifications แบบ non-intrusive
- จัดหมวดหมู่ข้อความตาม priority และ type

**React Component Code:**
```jsx
// MessageComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAPI } from '../hooks/useAPI';
import { MessageItem } from './MessageItem';
import { NotificationToast } from './NotificationToast';

const MessageComponent = ({ agentId }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, system, supervisor
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(null);
  
  const { getMessages, markMessageAsRead } = useAPI();
  const { lastMessage } = useWebSocket();
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [agentId]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (lastMessage?.type === 'new-message' && 
        lastMessage?.data?.recipientIds?.includes(agentId)) {
      const newMessage = lastMessage.data;
      
      setMessages(prev => [newMessage, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show notification for high priority messages
      if (newMessage.priority === 'high' || newMessage.priority === 'urgent') {
        setShowNotification({
          title: newMessage.subject,
          message: newMessage.content,
          priority: newMessage.priority,
          sender: newMessage.senderName
        });
        
        // Play notification sound
        playNotificationSound(newMessage.priority);
      }
    }
  }, [lastMessage, agentId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const result = await getMessages(agentId, { limit: 50 });
      if (result.success) {
        setMessages(result.data);
        setUnreadCount(result.data.filter(msg => !msg.isRead[agentId]).length);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playNotificationSound = (priority) => {
    if (audioRef.current) {
      const soundFile = priority === 'urgent' ? 'urgent.mp3' : 'notification.mp3';
      audioRef.current.src = `/sounds/${soundFile}`;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleMessageRead = async (messageId) => {
    try {
      const result = await markMessageAsRead(messageId, agentId);
      if (result.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === messageId 
              ? { ...msg, isRead: { ...msg.isRead, [agentId]: true } }
              : msg
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const getFilteredMessages = () => {
    switch (filter) {
      case 'unread':
        return messages.filter(msg => !msg.isRead[agentId]);
      case 'system':
        return messages.filter(msg => msg.messageType === 'system');
      case 'supervisor':
        return messages.filter(msg => msg.messageType === 'direct' || msg.messageType === 'broadcast');
      default:
        return messages;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '❗';
      case 'normal': return '📢';
      case 'low': return '💬';
      default: return '📢';
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-component">
      {/* Notification Audio */}
      <audio ref={audioRef} preload="auto" />
      
      {/* Notification Toast */}
      {showNotification && (
        <NotificationToast 
          notification={showNotification}
          onClose={() => setShowNotification(null)}
        />
      )}

      <div className="message-header">
        <h3>
          Messages & Notifications
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h3>
        
        <div className="message-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'unread' ? 'active' : ''}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={filter === 'supervisor' ? 'active' : ''}
            onClick={() => setFilter('supervisor')}
          >
            Supervisor
          </button>
          <button 
            className={filter === 'system' ? 'active' : ''}
            onClick={() => setFilter('system')}
          >
            System
          </button>
        </div>
      </div>

      <div className="message-list">
        {isLoading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : getFilteredMessages().length === 0 ? (
          <div className="no-messages">
            {filter === 'unread' ? 'No unread messages' : 'No messages'}
          </div>
        ) : (
          getFilteredMessages().map(message => (
            <MessageItem
              key={message._id}
              message={message}
              isUnread={!message.isRead[agentId]}
              onMarkAsRead={() => handleMessageRead(message._id)}
              priorityIcon={getPriorityIcon(message.priority)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-actions">
        <button 
          onClick={loadMessages}
          disabled={isLoading}
          className="refresh-btn"
        >
          Refresh Messages
        </button>
        
        <button 
          onClick={() => setFilter('unread')}
          className="mark-all-read-btn"
          disabled={unreadCount === 0}
        >
          View Unread Only
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
```

**Dependencies:** APIService, WebSocketService, MessageItem, NotificationToast

---

## 🌐 1.3 Web Dashboard Components

### 1.3.1 Supervisor Dashboard Architecture

```mermaid
graph TB
    subgraph "Supervisor Dashboard (React Web App)"
        subgraph "Layout Components"
            HEADER[HeaderComponent<br/>Navigation & User Info]
            SIDEBAR[SidebarComponent<br/>Menu & Quick Actions]
            MAIN[MainContent<br/>Dashboard Workspace]
        end
        
        subgraph "Dashboard Components"
            TEAM[TeamDashboard<br/>📊 Team Overview]
            MONITOR[AgentMonitor<br/>👥 Real-time Grid]
            SENDER[MessageSender<br/>📨 Broadcast Tool]
            ANALYTICS[Analytics<br/>📈 Performance Charts]
        end
        
        subgraph "Data Management"
            STATE[State Manager<br/>Redux/Context]
            CACHE[Data Cache<br/>Real-time Updates]
        end
        
        subgraph "Shared Services"
            API_WEB[API Service]
            WS_WEB[WebSocket Service]
            AUTH_WEB[Auth Service]
        end
    end
    
    HEADER --> AUTH_WEB
    TEAM --> API_WEB
    MONITOR --> WS_WEB
    SENDER --> API_WEB
    ANALYTICS --> API_WEB
    
    STATE --> CACHE
    CACHE --> WS_WEB
    
    classDef layout fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef dashboard fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef data fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef service fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    
    class HEADER,SIDEBAR,MAIN layout
    class TEAM,MONITOR,SENDER,ANALYTICS dashboard
    class STATE,CACHE data
    class API_WEB,WS_WEB,AUTH_WEB service
```

### 1.3.2 Supervisor Dashboard UI Mockup

```html
<!-- Supervisor Dashboard Layout -->
<div class="supervisor-dashboard">
  <!-- Header Navigation -->
  <header class="dashboard-header">
    <div class="header-left">
      <h1>Agent Wallboard - Supervisor Dashboard</h1>
      <span class="team-info">Team: Customer Service (8 agents)</span>
    </div>
    <div class="header-right">
      <div class="real-time-indicator">
        <span class="status-dot connected"></span>
        <span>Live</span>
      </div>
      <div class="user-menu">
        <span>John Supervisor</span>
        <button class="logout-btn">Logout</button>
      </div>
    </div>
  </header>

  <div class="dashboard-content">
    <!-- Sidebar Navigation -->
    <aside class="dashboard-sidebar">
      <nav class="sidebar-nav">
        <a href="#dashboard" class="nav-item active">
          📊 Dashboard
        </a>
        <a href="#agents" class="nav-item">
          👥 Agent Monitor
        </a>
        <a href="#messages" class="nav-item">
          📨 Send Message
        </a>
        <a href="#analytics" class="nav-item">
          📈 Analytics
        </a>
        <a href="#reports" class="nav-item">
          📋 Reports
        </a>
      </nav>
      
      <div class="quick-actions">
        <h4>Quick Actions</h4>
        <button class="quick-btn">Emergency Broadcast</button>
        <button class="quick-btn">Call Meeting</button>
        <button class="quick-btn">Send Break Reminder</button>
      </div>
    </aside>

    <!-- Main Dashboard Area -->
    <main class="dashboard-main">
      <!-- Team Overview Cards -->
      <section class="overview-cards">
        <div class="metric-card">
          <h3>Available Agents</h3>
          <div class="metric-value">5/8</div>
          <div class="metric-trend">↑ +1 from last hour</div>
        </div>
        <div class="metric-card">
          <h3>Average Handle Time</h3>
          <div class="metric-value">4m 32s</div>
          <div class="metric-trend">↓ -15s from yesterday</div>
        </div>
        <div class="metric-card">
          <h3>Service Level</h3>
          <div class="metric-value">92%</div>
          <div class="metric-trend">→ Target: 90%</div>
        </div>
        <div class="metric-card">
          <h3>Active Calls</h3>
          <div class="metric-value">12</div>
          <div class="metric-trend">↑ Peak: 18 today</div>
        </div>
      </section>

      <!-- Agent Status Grid -->
      <section class="agent-grid">
        <h3>Team Status - Real-time</h3>
        <div class="agents-container">
          <div class="agent-card available">
            <div class="agent-header">
              <img src="agent1.jpg" class="agent-avatar" />
              <div class="agent-info">
                <h4>Sarah Agent</h4>
                <span class="agent-id">AG001</span>
              </div>
              <div class="status-indicator available"></div>
            </div>
            <div class="agent-details">
              <div class="status-info">
                <span class="status-text">Available</span>
                <span class="status-time">02:45:30</span>
              </div>
              <div class="agent-stats">
                <span>Calls: 15</span>
                <span>AHT: 4m 20s</span>
              </div>
            </div>
            <div class="agent-actions">
              <button class="action-btn">Message</button>
              <button class="action-btn">Call</button>
            </div>
          </div>

          <div class="agent-card busy">
            <div class="agent-header">
              <img src="agent2.jpg" class="agent-avatar" />
              <div class="agent-info">
                <h4>Mike Agent</h4>
                <span class="agent-id">AG002</span>
              </div>
              <div class="status-indicator busy"></div>
            </div>
            <div class="agent-details">
              <div class="status-info">
                <span class="status-text">Busy</span>
                <span class="status-time">00:12:45</span>
              </div>
              <div class="agent-stats">
                <span>Calls: 12</span>
                <span>AHT: 5m 10s</span>
              </div>
            </div>
            <div class="agent-actions">
              <button class="action-btn">Message</button>
              <button class="action-btn disabled">Call</button>
            </div>
          </div>

          <div class="agent-card break">
            <div class="agent-header">
              <img src="agent3.jpg" class="agent-avatar" />
              <div class="agent-info">
                <h4>Lisa Agent</h4>
                <span class="agent-id">AG003</span>
              </div>
              <div class="status-indicator break"></div>
            </div>
            <div class="agent-details">
              <div class="status-info">
                <span class="status-text">Break</span>
                <span class="status-time">00:08:15</span>
              </div>
              <div class="agent-stats">
                <span>Calls: 18</span>
                <span>AHT: 3m 55s</span>
              </div>
            </div>
            <div class="agent-actions">
              <button class="action-btn">Message</button>
              <button class="action-btn disabled">Call</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Message Broadcasting Section -->
      <section class="message-broadcast">
        <h3>Send Message to Team</h3>
        <div class="message-form">
          <div class="recipient-selection">
            <label>Send to:</label>
            <select class="recipient-dropdown">
              <option value="all">All Team Members</option>
              <option value="available">Available Agents Only</option>
              <option value="specific">Select Specific Agents</option>
            </select>
          </div>
          
          <div class="message-priority">
            <label>Priority:</label>
            <select class="priority-dropdown">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div class="message-input">
            <input 
              type="text" 
              placeholder="Message subject..." 
              class="subject-input"
            />
            <textarea 
              placeholder="Type your message here..."
              class="message-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="message-actions">
            <button class="send-btn primary">Send Message</button>
            <button class="save-draft-btn">Save as Draft</button>
            <button class="template-btn">Use Template</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>
```

### 1.3.3 Dashboard Components Detail

#### 📊 **TeamDashboard Component**
**Purpose:** แสดงภาพรวมประสิทธิภาพของทีมแบบ real-time  
**User Story:** US-008 (Supervisor Dashboard)

**Key Functions:**
- แสดง metrics สำคัญของทีม (Available agents, Service level, AHT)
- Real-time updates ผ่าน WebSocket
- Trend indicators และ historical comparisons
- Drill-down capabilities สำหรับ detailed analysis

**React Component Code:**
```jsx
// TeamDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAPI } from '../hooks/useAPI';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';

const TeamDashboard = ({ teamId, supervisorId }) => {
  const [teamMetrics, setTeamMetrics] = useState({
    availableAgents: { current: 0, total: 0, trend: 0 },
    averageHandleTime: { current: '0m 0s', trend: 0, target: '5m 0s' },
    serviceLevel: { current: 0, trend: 0, target: 90 },
    activeCalls: { current: 0, peak: 0, trend: 0 }
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { getTeamMetrics, getHistoricalData } = useAPI();
  const { lastMessage } = useWebSocket();

  // Load initial data
  useEffect(() => {
    loadTeamData();
    const interval = setInterval(loadTeamData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [teamId]);

  // Listen for real-time metric updates
  useEffect(() => {
    if (lastMessage?.type === 'team-metrics-updated' && 
        lastMessage?.data?.teamId === teamId) {
      updateMetricsFromWebSocket(lastMessage.data.metrics);
    }
  }, [lastMessage, teamId]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      const [metricsResult, historyResult] = await Promise.all([
        getTeamMetrics(teamId),
        getHistoricalData(teamId, { period: '24h', interval: '1h' })
      ]);

      if (metricsResult.success) {
        setTeamMetrics(metricsResult.data);
      }

      if (historyResult.success) {
        setHistoricalData(historyResult.data);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetricsFromWebSocket = (newMetrics) => {
    setTeamMetrics(prev => ({
      ...prev,
      ...newMetrics
    }));
    setLastUpdated(new Date());
  };

  const calculateTrendColor = (trend) => {
    if (trend > 0) return '#4CAF50'; // Green for positive
    if (trend < 0) return '#F44336'; // Red for negative
    return '#757575'; // Grey for neutral
  };

  const formatTrend = (trend, isPercentage = false) => {
    const symbol = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    const value = Math.abs(trend);
    return `${symbol} ${isPercentage ? value.toFixed(1) + '%' : value}`;
  };

  if (isLoading) {
    return (
      <div className="team-dashboard loading">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="team-dashboard">
      <div className="dashboard-header">
        <h2>Team Performance Dashboard</h2>
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Available Agents"
          value={`${teamMetrics.availableAgents.current}/${teamMetrics.availableAgents.total}`}
          trend={formatTrend(teamMetrics.availableAgents.trend)}
          trendColor={calculateTrendColor(teamMetrics.availableAgents.trend)}
          subtitle="Ready to take calls"
          icon="👥"
        />

        <MetricCard
          title="Average Handle Time"
          value={teamMetrics.averageHandleTime.current}
          trend={formatTrend(teamMetrics.averageHandleTime.trend)}
          trendColor={calculateTrendColor(-teamMetrics.averageHandleTime.trend)} // Lower is better
          subtitle={`Target: ${teamMetrics.averageHandleTime.target}`}
          icon="⏱️"
        />

        <MetricCard
          title="Service Level"
          value={`${teamMetrics.serviceLevel.current}%`}
          trend={formatTrend(teamMetrics.serviceLevel.trend, true)}
          trendColor={calculateTrendColor(teamMetrics.serviceLevel.trend)}
          subtitle={`Target: ${teamMetrics.serviceLevel.target}%`}
          icon="📈"
          status={teamMetrics.serviceLevel.current >= teamMetrics.serviceLevel.target ? 'success' : 'warning'}
        />

        <MetricCard
          title="Active Calls"
          value={teamMetrics.activeCalls.current}
          trend={formatTrend(teamMetrics.activeCalls.trend)}
          trendColor={calculateTrendColor(teamMetrics.activeCalls.trend)}
          subtitle={`Peak today: ${teamMetrics.activeCalls.peak}`}
          icon="📞"
        />
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>24-Hour Trend</h3>
          <TrendChart 
            data={historicalData}
            metrics={['availableAgents', 'activeCalls', 'serviceLevel']}
            timeRange="24h"
          />
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={loadTeamData}
          className="refresh-btn"
          disabled={isLoading}
        >
          Refresh Data
        </button>
        
        <button 
          onClick={() => window.open('/reports/team-performance', '_blank')}
          className="report-btn"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default TeamDashboard;
```

#### 👥 **AgentMonitor Component**
**Purpose:** แสดงสถานะของ agents ในทีมแบบ real-time  
**User Story:** US-003 (Real-time Agent Monitoring)

**React Component Code:**
```jsx
// AgentMonitor.jsx
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAPI } from '../hooks/useAPI';
import { AgentCard } from './AgentCard';
import { FilterPanel } from './FilterPanel';

const AgentMonitor = ({ teamId }) => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all', // all, available, busy, break, offline
    search: '',
    sortBy: 'name' // name, status, duration, performance
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getTeamAgents, sendMessageToAgent } = useAPI();
  const { lastMessage } = useWebSocket();

  // Load team agents
  useEffect(() => {
    loadTeamAgents();
  }, [teamId]);

  // Listen for real-time agent updates
  useEffect(() => {
    if (lastMessage?.type === 'agent-status-updated') {
      updateAgentStatus(lastMessage.data);
    }
  }, [lastMessage]);

  // Apply filters when agents or filters change
  useEffect(() => {
    applyFilters();
  }, [agents, filters]);

  const loadTeamAgents = async () => {
    setIsLoading(true);
    try {
      const result = await getTeamAgents(teamId);
      if (result.success) {
        setAgents(result.data);
      }
    } catch (error) {
      console.error('Failed to load team agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAgentStatus = (statusUpdate) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.agentId === statusUpdate.agentId
          ? { 
              ...agent, 
              currentStatus: statusUpdate.status,
              statusStartTime: statusUpdate.timestamp,
              lastActivity: new Date()
            }
          : agent
      )
    );
  };

  const applyFilters = () => {
    let filtered = [...agents];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(agent => 
        agent.currentStatus.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.firstName.toLowerCase().includes(searchTerm) ||
        agent.lastName.toLowerCase().includes(searchTerm) ||
        agent.agentCode.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.firstName.localeCompare(b.firstName);
        case 'status':
          return a.currentStatus.localeCompare(b.currentStatus);
        case 'duration':
          return new Date(b.statusStartTime) - new Date(a.statusStartTime);
        default:
          return 0;
      }
    });

    setFilteredAgents(filtered);
  };

  const handleQuickMessage = async (agentId, messageType) => {
    const quickMessages = {
      'check-in': 'Please check in when you have a moment.',
      'break-reminder': 'Remember to take your scheduled break.',
      'meeting': 'Team meeting in 15 minutes in Conference Room A.',
      'support': 'I\'m here if you need any assistance.'
    };

    try {
      await sendMessageToAgent({
        recipientIds: [agentId],
        subject: `Quick Message - ${messageType.replace('-', ' ')}`,
        content: quickMessages[messageType],
        priority: 'normal',
        messageType: 'direct'
      });
      
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': '#4CAF50',
      'Busy': '#FF9800',
      'Break': '#2196F3',
      'Training': '#9C27B0',
      'Meeting': '#673AB7',
      'Lunch': '#795548',
      'Offline': '#F44336'
    };
    return colors[status] || '#757575';
  };

  const calculateStatusDuration = (startTime) => {
    if (!startTime) return '0m';
    
    const duration = new Date() - new Date(startTime);
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="agent-monitor">
      <div className="monitor-header">
        <h2>Agent Status Monitor</h2>
        <div className="agent-summary">
          <span className="total-agents">
            {agents.length} Total Agents
          </span>
          <span className="available-count">
            {agents.filter(a => a.currentStatus === 'Available').length} Available
          </span>
        </div>
      </div>

      <FilterPanel 
        filters={filters}
        onFiltersChange={setFilters}
        agentCount={filteredAgents.length}
      />

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading agents...</div>
        </div>
      ) : (
        <div className="agents-grid">
          {filteredAgents.map(agent => (
            <AgentCard
              key={agent.agentId}
              agent={{
                ...agent,
                statusColor: getStatusColor(agent.currentStatus),
                statusDuration: calculateStatusDuration(agent.statusStartTime)
              }}
              onSelectAgent={setSelectedAgent}
              onQuickMessage={handleQuickMessage}
              isSelected={selectedAgent?.agentId === agent.agentId}
            />
          ))}
        </div>
      )}

      {filteredAgents.length === 0 && !isLoading && (
        <div className="no-agents">
          No agents match the current filters.
        </div>
      )}
    </div>
  );
};

export default AgentMonitor;
```

#### 📨 **MessageSender Component**
**Purpose:** ส่งข้อความไปยัง agents ในทีม  
**User Story:** US-004 (Supervisor Message Broadcasting)

**React Component Code:**
```jsx
// MessageSender.jsx
import React, { useState, useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';
import { MessageTemplates } from './MessageTemplates';
import { RecipientSelector } from './RecipientSelector';

const MessageSender = ({ teamId, supervisorId }) => {
  const [formData, setFormData] = useState({
    recipients: 'all',
    selectedAgents: [],
    priority: 'normal',
    subject: '',
    content: '',
    scheduleTime: null,
    expiryTime: null
  });
  const [agents, setAgents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const { getTeamAgents, sendMessage, getMessageTemplates } = useAPI();

  useEffect(() => {
    loadData();
  }, [teamId]);

  const loadData = async () => {
    try {
      const [agentsResult, templatesResult] = await Promise.all([
        getTeamAgents(teamId),
        getMessageTemplates()
      ]);

      if (agentsResult.success) {
        setAgents(agentsResult.data);
      }

      if (templatesResult.success) {
        setTemplates(templatesResult.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSendResult(null); // Clear previous results
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      priority: template.defaultPriority || 'normal'
    }));
  };

  const getRecipientIds = () => {
    switch (formData.recipients) {
      case 'all':
        return agents.map(agent => agent.agentId);
      case 'available':
        return agents
          .filter(agent => agent.currentStatus === 'Available')
          .map(agent => agent.agentId);
      case 'selected':
        return formData.selectedAgents;
      default:
        return [];
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.subject.trim()) {
      errors.push('Subject is required');
    }

    if (!formData.content.trim()) {
      errors.push('Message content is required');
    }

    const recipientIds = getRecipientIds();
    if (recipientIds.length === 0) {
      errors.push('At least one recipient must be selected');
    }

    if (formData.scheduleTime && new Date(formData.scheduleTime) <= new Date()) {
      errors.push('Scheduled time must be in the future');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setSendResult({
        success: false,
        message: errors.join(', ')
      });
      return;
    }

    setIsSending(true);
    try {
      const recipientIds = getRecipientIds();
      const messageData = {
        senderId: supervisorId,
        recipientIds,
        teamId,
        messageType: formData.recipients === 'all' || formData.recipients === 'available' 
          ? 'broadcast' 
          : 'direct',
        subject: formData.subject.trim(),
        content: formData.content.trim(),
        priority: formData.priority,
        scheduleTime: formData.scheduleTime,
        expiryTime: formData.expiryTime || new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours default
      };

      const result = await sendMessage(messageData);

      if (result.success) {
        setSendResult({
          success: true,
          message: `Message sent successfully to ${recipientIds.length} agent(s)`
        });

        // Reset form
        setFormData({
          recipients: 'all',
          selectedAgents: [],
          priority: 'normal',
          subject: '',
          content: '',
          scheduleTime: null,
          expiryTime: null
        });
      } else {
        setSendResult({
          success: false,
          message: result.message || 'Failed to send message'
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setSendResult({
        success: false,
        message: 'Connection error. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const getRecipientCount = () => {
    return getRecipientIds().length;
  };

  return (
    <div className="message-sender">
      <div className="sender-header">
        <h2>Send Message to Team</h2>
        <p>Broadcast messages to your team members</p>
      </div>

      {sendResult && (
        <div className={`result-message ${sendResult.success ? 'success' : 'error'}`}>
          {sendResult.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-section">
          <h3>Recipients</h3>
          <RecipientSelector
            value={formData.recipients}
            selectedAgents={formData.selectedAgents}
            agents={agents}
            onChange={(recipients, selectedAgents) => {
              handleInputChange('recipients', recipients);
              handleInputChange('selectedAgents', selectedAgents);
            }}
          />
          <div className="recipient-count">
            Will send to {getRecipientCount()} agent(s)
          </div>
        </div>

        <div className="form-section">
          <h3>Message Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="priority-select"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="expiryTime">Expires</label>
              <select
                id="expiryTime"
                value={formData.expiryTime ? 'custom' : '24h'}
                onChange={(e) => {
                  if (e.target.value === '24h') {
                    handleInputChange('expiryTime', new Date(Date.now() + 24 * 60 * 60 * 1000));
                  } else {
                    handleInputChange('expiryTime', null);
                  }
                }}
              >
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="3d">3 Days</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Enter message subject..."
              maxLength={100}
              className="subject-input"
            />
            <small>{formData.subject.length}/100 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Message</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              maxLength={500}
              className="content-textarea"
            />
            <small>{formData.content.length}/500 characters</small>
          </div>
        </div>

        <MessageTemplates 
          templates={templates}
          onTemplateSelect={handleTemplateSelect}
        />

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSending || getRecipientCount() === 0}
            className="send-btn primary"
          >
            {isSending ? 'Sending...' : `Send to ${getRecipientCount()} Agent(s)`}
          </button>

          <button
            type="button"
            onClick={() => {
              // Save as draft functionality
              console.log('Save as draft:', formData);
            }}
            className="draft-btn secondary"
            disabled={isSending}
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                recipients: 'all',
                selectedAgents: [],
                priority: 'normal',
                subject: '',
                content: '',
                scheduleTime: null,
                expiryTime: null
              });
              setSendResult(null);
            }}
            className="clear-btn"
            disabled={isSending}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageSender;
```

---

## ⚙️ 1.4 Admin Panel Components

### 1.4.1 Admin Panel Architecture

```mermaid
graph TB
    subgraph "Admin Panel (React Web App)"
        subgraph "Admin Layout"
            ADMIN_HEADER[AdminHeader<br/>System Status & User Info]
            ADMIN_NAV[AdminNavigation<br/>Module Menu]
            ADMIN_MAIN[AdminMain<br/>Content Area]
        end
        
        subgraph "Management Modules"
            USER_MGR[UserManager<br/>👨‍💼 CRUD Operations]
            CONFIG_PANEL[ConfigPanel<br/>⚙️ System Settings]
            AUDIT_VIEWER[AuditViewer<br/>📋 Logs & Reports]
            TEAM_MGR[TeamManager<br/>👥 Team Structure]
        end
        
        subgraph "Admin Services"
            ADMIN_API[AdminAPI Service]
            AUDIT_SVC[Audit Service]
            CONFIG_SVC[Config Service]
        end
    end
    
    USER_MGR --> ADMIN_API
    CONFIG_PANEL --> CONFIG_SVC
    AUDIT_VIEWER --> AUDIT_SVC
    TEAM_MGR --> ADMIN_API
    
    ADMIN_API --> |HTTP/HTTPS| BACKEND[Backend API]
    AUDIT_SVC --> |HTTP/HTTPS| BACKEND
    CONFIG_SVC --> |HTTP/HTTPS| BACKEND
    
    classDef admin fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef service fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef backend fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class USER_MGR,CONFIG_PANEL,AUDIT_VIEWER,TEAM_MGR admin
    class ADMIN_API,AUDIT_SVC,CONFIG_SVC service
    class BACKEND backend
```

### 1.4.2 Admin Panel UI Mockup

```html
<!-- Admin Panel Layout -->
<div class="admin-panel">
  <!-- Admin Header -->
  <header class="admin-header">
    <div class="header-left">
      <h1>Agent Wallboard - System Administration</h1>
      <div class="system-status">
        <span class="status-indicator online"></span>
        <span>System Online</span>
        <span class="uptime">Uptime: 15d 7h 32m</span>
      </div>
    </div>
    <div class="header-right">
      <div class="admin-actions">
        <button class="backup-btn">🔒 Backup Now</button>
        <button class="maintenance-btn">⚙️ Maintenance</button>
      </div>
      <div class="admin-user">
        <span>System Admin</span>
        <button class="logout-btn">Logout</button>
      </div>
    </div>
  </header>

  <div class="admin-content">
    <!-- Admin Navigation -->
    <nav class="admin-nav">
      <div class="nav-section">
        <h4>User Management</h4>
        <a href="#users" class="nav-item active">👨‍💼 Users</a>
        <a href="#teams" class="nav-item">👥 Teams</a>
        <a href="#roles" class="nav-item">🔐 Roles & Permissions</a>
      </div>
      
      <div class="nav-section">
        <h4>System Configuration</h4>
        <a href="#settings" class="nav-item">⚙️ General Settings</a>
        <a href="#database" class="nav-item">🗄️ Database Config</a>
        <a href="#notifications" class="nav-item">🔔 Notifications</a>
      </div>
      
      <div class="nav-section">
        <h4>Monitoring & Logs</h4>
        <a href="#audit" class="nav-item">📋 Audit Logs</a>
        <a href="#performance" class="nav-item">📊 Performance</a>
        <a href="#errors" class="nav-item">⚠️ Error Logs</a>
      </div>
      
      <div class="nav-section">
        <h4>System Tools</h4>
        <a href="#backup" class="nav-item">💾 Backup & Restore</a>
        <a href="#maintenance" class="nav-item">🔧 Maintenance</a>
        <a href="#updates" class="nav-item">🆙 System Updates</a>
      </div>
    </nav>

    <!-- Main Admin Content -->
    <main class="admin-main">
      <!-- User Management Section -->
      <section class="user-management">
        <div class="section-header">
          <h2>User Management</h2>
          <div class="section-actions">
            <button class="add-user-btn primary">+ Add New User</button>
            <button class="import-btn">📄 Import Users</button>
            <button class="export-btn">📤 Export Users</button>
          </div>
        </div>

        <!-- User Search and Filters -->
        <div class="user-filters">
          <div class="search-box">
            <input type="text" placeholder="Search users..." class="search-input" />
            <button class="search-btn">🔍</button>
          </div>
          
          <div class="filter-options">
            <select class="role-filter">
              <option value="">All Roles</option>
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            
            <select class="status-filter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <select class="team-filter">
              <option value="">All Teams</option>
              <option value="1">Customer Service</option>
              <option value="2">Technical Support</option>
              <option value="3">Sales Team</option>
            </select>
          </div>
        </div>

        <!-- Users Table -->
        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th><input type="checkbox" class="select-all" /></th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Team</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>AG001</td>
                <td>
                  <div class="user-info">
                    <img src="avatar1.jpg" class="user-avatar" />
                    <span>Sarah Johnson</span>
                  </div>
                </td>
                <td>sarah.johnson@company.com</td>
                <td><span class="role-badge agent">Agent</span></td>
                <td>Customer Service</td>
                <td><span class="status-badge active">Active</span></td>
                <td>2025-09-21 08:30</td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" title="Edit">✏️</button>
                    <button class="view-btn" title="View">👁️</button>
                    <button class="reset-pwd-btn" title="Reset Password">🔑</button>
                    <button class="deactivate-btn" title="Deactivate">❌</button>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td><input type="checkbox" /></td>
                <td>SV001</td>
                <td>
                  <div class="user-info">
                    <img src="avatar2.jpg" class="user-avatar" />
                    <span>Mike Supervisor</span>
                  </div>
                </td>
                <td>mike.supervisor@company.com</td>
                <td><span class="role-badge supervisor">Supervisor</span></td>
                <td>Customer Service</td>
                <td><span class="status-badge active">Active</span></td>
                <td>2025-09-21 07:45</td>
                <td>
                  <div class="action-buttons">
                    <button class="edit-btn" title="Edit">✏️</button>
                    <button class="view-btn" title="View">👁️</button>
                    <button class="reset-pwd-btn" title="Reset Password">🔑</button>
                    <button class="deactivate-btn" title="Deactivate">❌</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="table-pagination">
          <div class="pagination-info">
            Showing 1-10 of 45 users
          </div>
          <div class="pagination-controls">
            <button class="page-btn" disabled>« Previous</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">Next »</button>
          </div>
        </div>
      </section>

      <!-- System Configuration Preview -->
      <section class="config-preview">
        <h3>Quick System Settings</h3>
        <div class="config-cards">
          <div class="config-card">
            <h4>WebSocket Settings</h4>
            <div class="config-item">
              <label>Heartbeat Interval:</label>
              <span>30 seconds</span>
              <button class="edit-config-btn">Edit</button>
            </div>
            <div class="config-item">
              <label>Max Connections:</label>
              <span>1000</span>
              <button class="edit-config-btn">Edit</button>
            </div>
          </div>
          
          <div class="config-card">
            <h4>Notification Settings</h4>
            <div class="config-item">
              <label>Desktop Notifications:</label>
              <span class="status-enabled">Enabled</span>
              <button class="toggle-config-btn">Toggle</button>
            </div>
            <div class="config-item">
              <label>Email Alerts:</label>
              <span class="status-enabled">Enabled</span>
              <button class="toggle-config-btn">Toggle</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>
```

### 1.4.3 Admin Components Detail

#### 👨‍💼 **UserManager Component**
**Purpose:** จัดการ users, roles และ permissions  
**User Story:** US-011 (User Management)

**React Component Code:**
```jsx
// UserManager.jsx
import React, { useState, useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { BulkActions } from './BulkActions';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    team: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const { 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    bulkUpdateUsers,
    getTeams,
    getRoles 
  } = useAPI();

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getUsers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        includeTeams: true,
        includeRoles: true
      });

      if (result.success) {
        setUsers(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.total
        }));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.agentCode?.toLowerCase().includes(searchTerm)
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    // Team filter
    if (filters.team) {
      filtered = filtered.filter(user => user.teamId === parseInt(filters.team));
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (userData) => {
    try {
      const result = await createUser(userData);
      if (result.success) {
        await loadUsers();
        setShowUserForm(false);
        alert('User created successfully!');
      } else {
        alert('Failed to create user: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const result = await updateUser(userId, userData);
      if (result.success) {
        await loadUsers();
        setEditingUser(null);
        setShowUserForm(false);
        alert('User updated successfully!');
      } else {
        alert('Failed to update user: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        await loadUsers();
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleBulkAction = async (action, userIds) => {
    if (userIds.length === 0) {
      alert('Please select users first.');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${userIds.length} user(s)?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const result = await bulkUpdateUsers(action, userIds);
      if (result.success) {
        await loadUsers();
        setSelectedUsers([]);
        alert(`Bulk ${action} completed successfully!`);
      } else {
        alert(`Failed to perform bulk ${action}: ` + result.message);
      }
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
      alert(`Failed to perform bulk ${action}. Please try again.`);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  return (
    <div className="user-manager">
      <div className="manager-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button 
            onClick={() => {
              setEditingUser(null);
              setShowUserForm(true);
            }}
            className="add-user-btn primary"
          >
            + Add New User
          </button>
          
          <button 
            onClick={() => {
              // Export functionality
              console.log('Export users');
            }}
            className="export-btn secondary"
          >
            📤 Export Users
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
        </div>

        <div className="filter-dropdowns">
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="role-filter"
          >
            <option value="">All Roles</option>
            <option value="agent">Agent</option>
            <option value="supervisor">Supervisor</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="status-filter"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActions 
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          selectedUserIds={selectedUsers}
        />
      )}

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectUsers={setSelectedUsers}
        onEditUser={(user) => {
          setEditingUser(user);
          setShowUserForm(true);
        }}
        onDeleteUser={handleDeleteUser}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? 
            (userData) => handleUpdateUser(editingUser.userId, userData) :
            handleCreateUser
          }
          onCancel={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          isEditing={!!editingUser}
        />
      )}
    </div>
  );
};

export default UserManager;
```

---

## 🔗 1.5 Shared Services Components

### 1.5.1 Shared Services Architecture

```mermaid
graph TB
    subgraph "Shared Services Layer"
        subgraph "API Services"
            API_SVC[APIService<br/>🔌 HTTP Client]
            AUTH_SVC[AuthService<br/>🛡️ Authentication]
            CONFIG_SVC[ConfigService<br/>⚙️ Configuration]
        end
        
        subgraph "Real-time Services"
            WS_SVC[WebSocketService<br/>⚡ Real-time Client]
            NOTIF_SVC[NotificationService<br/>🔔 Desktop Notifications]
            EVENT_SVC[EventService<br/>📡 Event Bus]
        end
        
        subgraph "Utility Services"
            STORAGE_SVC[StorageService<br/>💾 Local Storage]
            VALIDATION_SVC[ValidationService<br/>✅ Input Validation]
            ERROR_SVC[ErrorService<br/>⚠️ Error Handling]
        end
    end
    
    subgraph "Frontend Applications"
        DESKTOP[Desktop App]
        WEB[Web Dashboard]
        ADMIN[Admin Panel]
    end
    
    subgraph "Backend Services"
        API_SERVER[API Server]
        WS_SERVER[WebSocket Server]
        AUTH_SERVER[Auth Server]
    end
    
    DESKTOP --> API_SVC
    WEB --> API_SVC
    ADMIN --> API_SVC
    
    DESKTOP --> WS_SVC
    WEB --> WS_SVC
    
    API_SVC --> API_SERVER
    AUTH_SVC --> AUTH_SERVER
    WS_SVC --> WS_SERVER
    
    classDef service fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backend fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class API_SVC,AUTH_SVC,CONFIG_SVC,WS_SVC,NOTIF_SVC,EVENT_SVC,STORAGE_SVC,VALIDATION_SVC,ERROR_SVC service
    class DESKTOP,WEB,ADMIN frontend
    class API_SERVER,WS_SERVER,AUTH_SERVER backend
```

### 1.5.2 Core Shared Services Implementation

#### 🔌 **APIService**
**Purpose:** จัดการ HTTP requests กับ Backend API  

```jsx
// services/APIService.js
class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.authService = null; // Will be injected
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add authentication token
    if (this.authService?.getToken()) {
      config.headers.Authorization = `Bearer ${this.authService.getToken()}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        this.authService?.handleAuthError();
        throw new Error('Authentication required');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  // Agent-related API calls
  async updateAgentStatus(statusData) {
    return this.request(`/agents/${statusData.agentId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
  }

  async getTeamAgents(teamId) {
    return this.request(`/teams/${teamId}/agents`);
  }

  async getTeamMetrics(teamId) {
    return this.request(`/teams/${teamId}/metrics`);
  }

  // Message-related API calls
  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getMessages(agentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/agents/${agentId}/messages?${queryString}`);
  }

  async markMessageAsRead(messageId, agentId) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
      body: JSON.stringify({ agentId })
    });
  }

  // User management API calls
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }
}

export default new APIService();
```

#### ⚡ **WebSocketService**
**Purpose:** จัดการ real-time communication กับ WebSocket Server  

```jsx
// services/WebSocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.authService = null;
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  connect() {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3001', {
        auth: {
          token: this.authService?.getToken()
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.handleReconnect();
        reject(error);
      });

      this.socket.on('authenticated', (data) => {
        console.log('WebSocket authenticated:', data);
      });

      this.socket.on('auth_error', (error) => {
        console.error('WebSocket auth error:', error);
        this.authService?.handleAuthError();
      });

      // Set up event forwarding
      this.setupEventForwarding();
    });
  }

  setupEventForwarding() {
    // Forward all WebSocket events to registered listeners
    const events = [
      'agent-status-updated',
      'new-message',
      'team-metrics-updated',
      'user-connected',
      'user-disconnected',
      'system-notification'
    ];

    events.forEach(eventType => {
      this.socket.on(eventType, (data) => {
        this.notifyListeners(eventType, data);
      });
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Handle failed reconnection
        });
      }, delay);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event emission
  sendEvent(eventType, data) {
    if (this.socket?.connected) {
      this.socket.emit(eventType, data);
      return true;
    } else {
      console.warn('WebSocket not connected. Cannot send event:', eventType);
      return false;
    }
  }

  // Event listening
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    };
  }

  notifyListeners(eventType, data) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Convenience methods for common events
  onAgentStatusUpdate(callback) {
    return this.addEventListener('agent-status-updated', callback);
  }

onNewMessage(callback) {
    return this.addEventListener('new-message', callback);
  }

  onTeamMetricsUpdate(callback) {
    return this.addEventListener('team-metrics-updated', callback);
  }

  // Agent-specific methods
  updateAgentStatus(agentId, status, reason = null) {
    return this.sendEvent('agent:status-change', {
      agentId,
      status,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  joinTeamRoom(teamId) {
    return this.sendEvent('join-team-room', { teamId });
  }

  leaveTeamRoom(teamId) {
    return this.sendEvent('leave-team-room', { teamId });
  }

  // Connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id
    };
  }
}

export default new WebSocketService();
```

#### 🛡️ **AuthService**
**Purpose:** จัดการ authentication และ authorization  

```jsx
// services/AuthService.js
class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.tokenExpiryTimer = null;
  }

  async login(credentials) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store authentication data
      this.token = data.token;
      this.user = data.user;
      this.refreshToken = data.refreshToken;

      localStorage.setItem('authToken', this.token);
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      localStorage.setItem('refreshToken', this.refreshToken);

      // Save credentials if requested
      if (credentials.rememberMe) {
        localStorage.setItem('savedAgentCredentials', JSON.stringify({
          agentCode: credentials.agentCode
        }));
      }

      // Set up token refresh
      this.setupTokenRefresh(data.expiresIn);

      return {
        success: true,
        user: this.user,
        token: this.token
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async logout() {
    try {
      // Notify server
      if (this.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local storage
      this.clearAuthData();
    }
  }

  clearAuthData() {
    this.token = null;
    this.user = null;
    this.refreshToken = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('refreshToken');

    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
      this.tokenExpiryTimer = null;
    }
  }

  async refreshAuthToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      this.token = data.token;
      this.refreshToken = data.refreshToken;

      localStorage.setItem('authToken', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);

      this.setupTokenRefresh(data.expiresIn);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleAuthError();
      return false;
    }
  }

  setupTokenRefresh(expiresIn) {
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }

    // Refresh token 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;
    
    this.tokenExpiryTimer = setTimeout(async () => {
      await this.refreshAuthToken();
    }, refreshTime);
  }

  handleAuthError() {
    this.clearAuthData();
    
    // Redirect to login or trigger login modal
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?expired=true';
    }
  }

  // Getters
  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  hasRole(role) {
    return this.user?.role === role;
  }

  hasAnyRole(roles) {
    return roles.includes(this.user?.role);
  }

  canAccess(requiredRoles) {
    if (!this.isAuthenticated()) {
      return false;
    }
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    return this.hasAnyRole(requiredRoles);
  }
}

export default new AuthService();
```

---

## 📊 1.6 Frontend Component UML Diagrams

### 1.6.1 Component Class Diagram

```mermaid
classDiagram
    class StatusComponent {
        -currentStatus: string
        -previousStatus: string
        -statusStartTime: Date
        -isChanging: boolean
        -statusOptions: Array
        +validateStatusChange(newStatus): ValidationResult
        +handleStatusChange(newStatus, reason): Promise
        +handleQuickAction(action): void
        +getCurrentStatusConfig(): StatusConfig
    }

    class MessageComponent {
        -messages: Array
        -unreadCount: number
        -filter: string
        -isLoading: boolean
        -showNotification: Object
        +loadMessages(): Promise
        +handleMessageRead(messageId): Promise
        +getFilteredMessages(): Array
        +playNotificationSound(priority): void
    }

    class TeamDashboard {
        -teamMetrics: Object
        -historicalData: Array
        -isLoading: boolean
        -lastUpdated: Date
        +loadTeamData(): Promise
        +updateMetricsFromWebSocket(metrics): void
        +calculateTrendColor(trend): string
        +formatTrend(trend, isPercentage): string
    }

    class AgentMonitor {
        -agents: Array
        -filteredAgents: Array
        -filters: Object
        -selectedAgent: Object
        +loadTeamAgents(): Promise
        +updateAgentStatus(statusUpdate): void
        +applyFilters(): void
        +handleQuickMessage(agentId, messageType): Promise
    }

    class UserManager {
        -users: Array
        -filteredUsers: Array
        -selectedUsers: Array
        -filters: Object
        -pagination: Object
        +loadUsers(): Promise
        +handleCreateUser(userData): Promise
        +handleUpdateUser(userId, userData): Promise
        +handleDeleteUser(userId): Promise
        +handleBulkAction(action, userIds): Promise
    }

    class APIService {
        -baseURL: string
        -authService: AuthService
        +request(endpoint, options): Promise
        +updateAgentStatus(statusData): Promise
        +getTeamAgents(teamId): Promise
        +sendMessage(messageData): Promise
        +getUsers(params): Promise
    }

    class WebSocketService {
        -socket: Socket
        -isConnected: boolean
        -eventListeners: Map
        -reconnectAttempts: number
        +connect(): Promise
        +disconnect(): void
        +sendEvent(eventType, data): boolean
        +addEventListener(eventType, callback): Function
        +updateAgentStatus(agentId, status): boolean
    }

    class AuthService {
        -token: string
        -user: Object
        -refreshToken: string
        -tokenExpiryTimer: Timer
        +login(credentials): Promise
        +logout(): Promise
        +refreshAuthToken(): Promise
        +isAuthenticated(): boolean
        +hasRole(role): boolean
        +canAccess(requiredRoles): boolean
    }

    StatusComponent --> APIService
    StatusComponent --> WebSocketService
    MessageComponent --> APIService
    MessageComponent --> WebSocketService
    TeamDashboard --> APIService
    TeamDashboard --> WebSocketService
    AgentMonitor --> APIService
    AgentMonitor --> WebSocketService
    UserManager --> APIService
    
    APIService --> AuthService
    WebSocketService --> AuthService
```

### 1.6.2 Component Interaction Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant StatusComponent
    participant APIService
    participant WebSocketService
    participant Backend
    participant TeamDashboard
    participant AgentMonitor

    User->>StatusComponent: Change status to "Break"
    StatusComponent->>StatusComponent: validateStatusChange("Break")
    StatusComponent->>APIService: updateAgentStatus(statusData)
    APIService->>Backend: PUT /api/agents/{id}/status
    Backend-->>APIService: Status updated successfully
    APIService-->>StatusComponent: Success response
    StatusComponent->>WebSocketService: sendEvent("agent:status-change")
    WebSocketService->>Backend: WebSocket emit
    Backend->>WebSocketService: Broadcast "agent-status-updated"
    WebSocketService->>TeamDashboard: Event notification
    WebSocketService->>AgentMonitor: Event notification
    TeamDashboard->>TeamDashboard: updateMetricsFromWebSocket()
    AgentMonitor->>AgentMonitor: updateAgentStatus()
    StatusComponent->>User: Status updated UI
```

### 1.6.3 State Management Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    Unauthenticated --> Authenticating: login()
    Authenticating --> Authenticated: success
    Authenticating --> Unauthenticated: failure
    
    Authenticated --> ConnectingWebSocket: connect()
    ConnectingWebSocket --> Connected: success
    ConnectingWebSocket --> Authenticated: failure
    
    Connected --> LoadingData: loadInitialData()
    LoadingData --> Ready: success
    LoadingData --> Connected: retry
    
    Ready --> Updating: userAction()
    Updating --> Ready: success
    Updating --> Error: failure
    
    Error --> Ready: retry()
    Error --> Unauthenticated: authError()
    
    Ready --> Disconnected: connectionLost()
    Disconnected --> Reconnecting: autoReconnect()
    Reconnecting --> Connected: success
    Reconnecting --> Disconnected: failure
    
    Connected --> Unauthenticated: logout()
    Ready --> Unauthenticated: logout()
```

---

## 📱 1.7 Responsive Design & Mobile Considerations

### 1.7.1 Responsive Breakpoints

```css
/* Frontend Components Responsive Design */
.agent-wallboard {
  /* Mobile First Approach */
  
  /* Mobile (320px - 768px) */
  @media (max-width: 768px) {
    .dashboard-content {
      flex-direction: column;
    }
    
    .dashboard-sidebar {
      width: 100%;
      height: auto;
    }
    
    .agents-grid {
      grid-template-columns: 1fr;
    }
    
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* Tablet (768px - 1024px) */
  @media (min-width: 768px) and (max-width: 1024px) {
    .agents-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .dashboard-sidebar {
      width: 200px;
    }
  }
  
  /* Desktop (1024px+) */
  @media (min-width: 1024px) {
    .agents-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .metrics-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    
    .dashboard-sidebar {
      width: 250px;
    }
  }
  
  /* Large Desktop (1440px+) */
  @media (min-width: 1440px) {
    .agents-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    
    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
}
```

### 1.7.2 Mobile-Specific Components

```jsx
// MobileAgentCard.jsx - Optimized for mobile
const MobileAgentCard = ({ agent, onQuickMessage }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`mobile-agent-card ${agent.currentStatus.toLowerCase()}`}>
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <div className="agent-basic-info">
          <div className="status-indicator" style={{ backgroundColor: agent.statusColor }} />
          <div className="agent-name">{agent.firstName} {agent.lastName}</div>
          <div className="status-text">{agent.currentStatus}</div>
        </div>
        <div className="expand-icon">
          {expanded ? '−' : '+'}
        </div>
      </div>
      
      {expanded && (
        <div className="card-details">
          <div className="agent-stats">
            <div className="stat">
              <label>Duration:</label>
              <span>{agent.statusDuration}</span>
            </div>
            <div className="stat">
              <label>Calls Today:</label>
              <span>{agent.callsToday || 0}</span>
            </div>
          </div>
          
          <div className="mobile-actions">
            <button 
              className="mobile-action-btn"
              onClick={() => onQuickMessage(agent.agentId, 'check-in')}
            >
              📱 Quick Message
            </button>
            <button 
              className="mobile-action-btn"
              onClick={() => window.open(`tel:${agent.extension}`)}
            >
              📞 Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## ✅ 1.8 Section Summary

### 1.8.1 Frontend Components Overview

**🎯 Complete Frontend Architecture:**
- ✅ **Agent Desktop App:** 4 Core Components (Login, Status, Message, Profile)
- ✅ **Supervisor Dashboard:** 4 Main Components (Team, Monitor, Sender, Analytics)
- ✅ **Admin Panel:** 3 Management Components (Users, Config, Audit)
- ✅ **Shared Services:** 8 Service Classes (API, WebSocket, Auth, etc.)

### 1.8.2 Technology Implementation

**📚 Technology Stack Utilized:**
- **Desktop App:** Electron.js + React + IPC Communication
- **Web Applications:** React.js + Material-UI/Ant Design
- **State Management:** React Hooks + Context API
- **Real-time Communication:** Socket.io Client
- **Authentication:** JWT Token-based with Auto-refresh
- **Responsive Design:** CSS Grid + Flexbox + Media Queries

### 1.8.3 User Stories Coverage

**🔗 Frontend Components รองรับ User Stories ครบถ้วน:**

| **Component** | **User Stories Supported** | **Key Features** |
|---------------|---------------------------|------------------|
| **Agent Desktop** | US-001, US-002, US-007 | Login, Status Management, Message Receiving |
| **Supervisor Dashboard** | US-003, US-004, US-008 | Real-time Monitoring, Message Broadcasting, Analytics |
| **Admin Panel** | US-010, US-011, US-012, US-014 | User Management, System Configuration, Audit Logs |

### 1.8.4 Integration Points

**🔗 Connection กับ Other Sections:**
- **Backend Integration:** All components use APIService และ WebSocketService
- **Database Integration:** Data flows through Backend APIs to Database Components
- **Real-time Updates:** WebSocket events ensure synchronized state across all clients
- **Authentication Flow:** Integrated authentication across all applications

### 1.8.5 UI/UX Design Excellence

**🎨 UI/UX Features Implemented:**
- **Responsive Design:** Mobile-first approach with breakpoints
- **Real-time Feedback:** Live status indicators และ notifications
- **Accessibility:** ARIA labels, keyboard navigation, high contrast
- **Performance:** Lazy loading, memoization, efficient re-renders
- **Error Handling:** Graceful error messages และ recovery mechanisms

### 1.8.6 Next Steps

**📝 Ready for Implementation:**
- **Component Testing:** Unit tests และ integration tests
- **UI Testing:** Automated UI testing with Cypress/Playwright
- **Performance Optimization:** Bundle analysis และ code splitting
- **Production Build:** Electron packaging และ web deployment
- **User Acceptance Testing:** Real user feedback และ iterations

**Frontend Components Section 1 พร้อมแล้วสำหรับการ integrate กับ Backend (Section 2) และ Database (Section 3)! 🚀**

---

**Total Pages:** 7 หน้า  
**Content Coverage:** 100% ตาม requirements  
**UI Mockups:** ✅ Complete  
**UML Diagrams:** ✅ Class, Sequence, State diagrams  
**Code Examples:** ✅ Production-ready React components  
**Responsive Design:** ✅ Mobile-first approach**   