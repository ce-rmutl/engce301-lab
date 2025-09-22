# Agent Desktop Setup Guide - Electron.js App

## 📋 Overview
สร้าง Desktop Application สำหรับ Agent ด้วย Electron.js + React สำหรับ:
- Login ด้วย Agent Code
- การจัดการสถานะ (Available/Busy/Break/Offline)
- รับข้อความ Real-time จาก Supervisor
- Desktop Notifications

## 🛠️ Prerequisites
- Node.js 18+ installed
- Electron basics knowledge
- React fundamentals

## 📁 Project Structure
```
agent-desktop/
├── package.json
├── main.js                    # Electron main process
├── preload.js                 # Secure communication bridge
├── public/
│   └── index.html            # HTML template
├── src/
│   ├── App.js                # Main React component
│   ├── index.js              # React entry point
│   ├── components/
│   │   ├── Login.js          # Login form
│   │   ├── StatusPanel.js    # Status management
│   │   ├── MessageList.js    # Message display
│   │   └── Notifications.js  # Desktop notifications
│   ├── services/
│   │   ├── api.js           # Backend API communication
│   │   └── socket.js        # WebSocket connection
│   ├── utils/
│   │   ├── storage.js       # Local storage management
│   │   └── constants.js     # App constants
│   └── styles/
│       └── App.css          # Application styles
└── build/                    # Built application files
```

## ⚡ Quick Setup

### 1. Initialize Project
```bash
# Create agent desktop directory
mkdir agent-desktop
cd agent-desktop

# Initialize npm project
npm init -y

# Install Electron and React dependencies
npm install electron react react-dom socket.io-client axios
npm install -D @babel/core @babel/preset-react babel-loader webpack webpack-cli webpack-dev-server html-webpack-plugin
```

### 2. Package.json Configuration
```json
{
  "name": "agent-wallboard-desktop",
  "version": "1.0.0",
  "description": "Agent Desktop App for Wallboard System",
  "main": "main.js",
  "homepage": "./",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "electron": "electron .",
    "electron-dev": "electron . --dev",
    "dist": "npm run build && electron-builder",
    "pack": "electron-builder --dir"
  },
  "dependencies": {
    "electron": "^28.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.2",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "babel-loader": "^9.1.0",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0",
    "html-webpack-plugin": "^5.5.0",
    "css-loader": "^6.8.0",
    "style-loader": "^3.3.0",
    "electron-builder": "^24.6.0"
  },
  "build": {
    "appId": "com.rmutl.agent-wallboard",
    "productName": "Agent Wallboard",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "main.js",
      "preload.js"
    ]
  }
}
```

### 3. Webpack Configuration (webpack.config.js)
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    port: 3002,
    hot: true
  },
  target: 'electron-renderer'
};
```

## 🖥️ Electron Main Process

### Main Process (main.js)
```javascript
const { app, BrowserWindow, ipcMain, Notification, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');

let mainWindow;
let tray;

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 350,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false,
    titleBarStyle: 'default'
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3002');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle minimize to tray
  mainWindow.on('minimize', (event) => {
    if (process.platform === 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

// Create system tray
function createTray() {
  const trayIcon = nativeImage.createFromPath(path.join(__dirname, 'assets/tray-icon.png'));
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Available',
      type: 'radio',
      click: () => {
        mainWindow.webContents.send('status-change', 'Available');
      }
    },
    {
      label: 'Busy',
      type: 'radio',
      click: () => {
        mainWindow.webContents.send('status-change', 'Busy');
      }
    },
    {
      label: 'Break',
      type: 'radio',
      click: () => {
        mainWindow.webContents.send('status-change', 'Break');
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Agent Wallboard');
  
  tray.on('double-click', () => {
    mainWindow.show();
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('show-notification', async (event, title, body) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title,
      body: body,
      icon: path.join(__dirname, 'assets/icon.png'),
      sound: true
    });
    
    notification.show();
    
    notification.on('click', () => {
      mainWindow.show();
      mainWindow.focus();
    });
    
    return true;
  }
  return false;
});

ipcMain.handle('set-always-on-top', async (event, flag) => {
  mainWindow.setAlwaysOnTop(flag);
  return flag;
});

ipcMain.handle('minimize-to-tray', async (event) => {
  mainWindow.hide();
  return true;
});

ipcMain.handle('get-app-version', async (event) => {
  return app.getVersion();
});

// Handle agent status updates for tray
ipcMain.on('agent-status-updated', (event, status) => {
  if (tray) {
    tray.setToolTip(`Agent Wallboard - ${status}`);
  }
});

// Handle app close
app.on('before-quit', () => {
  app.isQuiting = true;
});
```

### Preload Script (preload.js)
```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Notification methods
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  
  // Window management
  setAlwaysOnTop: (flag) => ipcRenderer.invoke('set-always-on-top', flag),
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Status updates
  updateAgentStatus: (status) => ipcRenderer.send('agent-status-updated', status),
  
  // Listen for status changes from tray menu
  onStatusChange: (callback) => {
    ipcRenderer.on('status-change', (event, status) => {
      callback(status);
    });
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Platform info
contextBridge.exposeInMainWorld('platform', {
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
});
```

## ⚛️ React Application

### Main App Component (src/App.js)
```javascript
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import StatusPanel from './components/StatusPanel';
import MessageList from './components/MessageList';
import './styles/App.css';
import { initializeSocket, disconnectSocket } from './services/socket';
import { getStoredAgent, clearStoredAgent } from './utils/storage';

function App() {
  const [agent, setAgent] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Offline');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // Get app version
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(setAppVersion);
    }

    // Check for stored agent
    const storedAgent = getStoredAgent();
    if (storedAgent) {
      setAgent(storedAgent);
      handleAgentLogin(storedAgent);
    }

    // Listen for status changes from tray menu
    if (window.electronAPI) {
      window.electronAPI.onStatusChange((status) => {
        setCurrentStatus(status);
        handleStatusChange(status);
      });
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('status-change');
      }
    };
  }, []);

  const handleAgentLogin = async (agentData) => {
    try {
      // Initialize socket connection
      const socket = initializeSocket(agentData.agentCode);
      
      socket.on('connect', () => {
        setIsConnected(true);
        setCurrentStatus('Available');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        setCurrentStatus('Offline');
      });

      socket.on('new_direct_message', (message) => {
        setMessages(prev => [message, ...prev]);
        
        // Show desktop notification
        if (window.electronAPI) {
          window.electronAPI.showNotification(
            `Message from ${message.fromCode}`,
            message.message
          );
        }
      });

      socket.on('new_broadcast_message', (message) => {
        setMessages(prev => [message, ...prev]);
        
        // Show desktop notification
        if (window.electronAPI) {
          window.electronAPI.showNotification(
            'Broadcast Message',
            message.message
          );
        }
      });

      setAgent(agentData);
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect to server');
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    
    // Update status via socket
    const socket = window.agentSocket;
    if (socket && socket.connected) {
      socket.emit('update_agent_status', {
        agentCode: agent.agentCode,
        status: newStatus
      });
    }

    // Update tray tooltip
    if (window.electronAPI) {
      window.electronAPI.updateAgentStatus(newStatus);
    }
  };

  const handleLogout = () => {
    disconnectSocket();
    clearStoredAgent();
    setAgent(null);
    setCurrentStatus('Offline');
    setMessages([]);
    setIsConnected(false);
  };

  const markMessageAsRead = async (messageId) => {
    try {
      // Update message in state
      setMessages(prev => 
        prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, isRead: true, readAt: new Date() }
            : msg
        )
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  if (!agent) {
    return <Login onLogin={handleAgentLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="agent-info">
          <h2>{agent.agentName}</h2>
          <span className="agent-code">{agent.agentCode}</span>
          <span className="team-name">{agent.teamName}</span>
        </div>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
          <span className="status-text">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="app-main">
        <StatusPanel 
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
          isConnected={isConnected}
        />
        
        <MessageList 
          messages={messages}
          onMarkAsRead={markMessageAsRead}
        />
      </main>

      <footer className="app-footer">
        <span className="version">v{appVersion}</span>
        <span className="status">{currentStatus}</span>
      </footer>
    </div>
  );
}

export default App;
```

## 🎨 Styling

### Main Styles (src/styles/App.css)
```css
/* Agent Desktop App Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f5f5f5;
  color: #333;
  user-select: none;
  overflow: hidden;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header */
.app-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.agent-info h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.agent-code {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.team-name {
  font-size: 11px;
  color: #888;
  margin-left: 8px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-indicator {
  font-size: 12px;
}

.status-text {
  font-size: 11px;
  font-weight: 500;
}

.logout-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #ff3742;
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Status Panel */
.status-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.current-status h3 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  margin-bottom: 15px;
}

.status-icon {
  font-size: 16px;
}

.status-label {
  font-size: 14px;
}

.status-options h4 {
  font-size: 13px;
  margin-bottom: 10px;
  color: #666;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.status-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  border: 2px solid;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  font-weight: 500;
}

.status-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 14px;
}

.connection-warning {
  background: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
}

/* Message List */
.message-list {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.message-header h3 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

.message-filters {
  display: flex;
  gap: 5px;
}

.message-filters button {
  background: transparent;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.message-filters button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 15px 15px;
}

.message-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.message-item:hover {
  background: #e9ecef;
  transform: translateX(2px);
}

.message-item.unread {
  background: #e3f2fd;
  border-color: #2196F3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.message-item.broadcast {
  border-left: 4px solid #ff9800;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.message-from {
  display: flex;
  align-items: center;
  gap: 6px;
}

.from-code, .broadcast-badge {
  font-size: 11px;
  font-weight: 600;
  color: #666;
}

.broadcast-badge {
  background: #ff9800;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
}

.priority-indicator {
  font-size: 10px;
}

.message-time {
  font-size: 10px;
  color: #999;
}

.message-content {
  font-size: 12px;
  line-height: 1.4;
  color: #333;
  margin-bottom: 5px;
}

.unread-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4757;
  color: white;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.no-messages {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-messages span {
  font-size: 40px;
  margin-top: 10px;
  display: block;
}

/* Login Styles */
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  width: 300px;
  text-align: center;
}

.login-header h1 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}

.login-header p {
  font-size: 12px;
  color: #666;
  margin-bottom: 20px;
}

.login-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.login-form label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.login-form input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.login-form input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 15px;
  border: 1px solid #fcc;
}

.login-btn {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.login-footer p {
  font-size: 10px;
  color: #999;
}

/* Footer */
.app-footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #666;
  backdrop-filter: blur(10px);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive Adjustments */
@media (max-height: 600px) {
  .app-main {
    padding: 10px;
    gap: 10px;
  }
  
  .status-panel {
    padding: 10px;
  }
  
  .message-list {
    min-height: 200px;
  }
}
```

### HTML Template (public/index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#667eea" />
    <meta name="description" content="Agent Wallboard Desktop Application" />
    
    <title>Agent Wallboard</title>
    
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            overflow: hidden;
        }
        
        #root {
            height: 100vh;
        }
        
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: white;
            font-size: 14px;
        }
        
        .loading::after {
            content: '';
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            margin-left: 10px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
        <div class="loading">Loading Agent Wallboard...</div>
    </div>
</body>
</html>
```

### React Entry Point (src/index.js)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '18px', marginBottom: '10px' }}>
            Application Error
          </h1>
          <p style={{ fontSize: '14px', marginBottom: '20px', opacity: 0.8 }}>
            Something went wrong. Please restart the application.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
              <summary>Error Details</summary>
              <pre style={{ marginTop: '10px', textAlign: 'left' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

## 🚀 Build & Development Scripts

### Development Scripts
```bash
# Start development (package.json scripts)
{
  "scripts": {
    "dev:web": "webpack serve --mode development --port 3002",
    "dev:electron": "concurrently \"npm run dev:web\" \"wait-on http://localhost:3002 && electron . --dev\"",
    "build:web": "webpack --mode production",
    "build:electron": "npm run build:web && electron-builder",
    "start": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "clean": "rimraf build dist"
  }
}
```

### Build Configuration (.env files)
```bash
# .env.development
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
ELECTRON_IS_DEV=true

# .env.production
NODE_ENV=production
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
ELECTRON_IS_DEV=false
```

## 🧪 Testing & Debugging

### Test Script (test-app.js)
```javascript
// Simple test script for the agent desktop app
const { spawn } = require('child_process');
const axios = require('axios');

async function testApp() {
  console.log('🧪 Testing Agent Desktop App...');

  // Test 1: Check if backend is running
  try {
    const response = await axios.get('http://localhost:3001/health');
    console.log('✅ Backend server is running');
  } catch (error) {
    console.error('❌ Backend server not running. Start it first!');
    return;
  }

  // Test 2: Test agent login
  try {
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      agentCode: 'AG001'
    });
    console.log('✅ Agent login test passed');
  } catch (error) {
    console.error('❌ Agent login test failed:', error.response?.data);
  }

  // Test 3: Start Electron app
  console.log('🚀 Starting Electron app...');
  const electronProcess = spawn('npm', ['run', 'electron'], {
    stdio: 'inherit',
    shell: true
  });

  // Handle process exit
  process.on('SIGINT', () => {
    electronProcess.kill();
    process.exit();
  });
}

testApp();
```

## 📋 Running the Agent Desktop App

### 1. Development Mode
```bash
# Install dependencies
npm install

# Start development server
npm run dev:web

# In another terminal, start Electron
npm run electron-dev

# Or run both concurrently
npm run dev:electron
```

### 2. Production Build
```bash
# Build the React app
npm run build:web

# Build Electron executable
npm run build:electron

# Or build installer
npm run dist
```

### 3. Quick Start Commands
```bash
# Clone and setup
git clone <repository>
cd agent-desktop
npm install

# Set environment variables
cp .env.development .env

# Start development
npm run dev:electron
```

## 🔧 Troubleshooting

### Common Issues & Solutions

**1. Electron won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Socket connection fails:**
- Check if backend server is running on port 3001
- Verify CORS settings in backend
- Check firewall settings

**3. Build errors:**
```bash
# Update Electron
npm install electron@latest

# Clear webpack cache
rm -rf build/
npm run build:web
```

**4. Desktop notifications not working:**
- Check OS notification permissions
- Verify Electron notification API usage
- Test with `Notification.requestPermission()`

---

## 📋 Next Steps
1. ✅ Electron.js desktop app structure created
2. ✅ React components for Agent interface
3. ✅ WebSocket integration for real-time features
4. ✅ Desktop notifications implementation
5. 🔄 **Next: Supervisor Dashboard Setup (React.js Web App)**

**Agent Desktop App is ready! Next: Supervisor Dashboard Guide** 🌐
