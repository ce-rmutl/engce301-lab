# 🔧 การกำหนด Port แยก Frontend Applications

## 📊 Port Configuration Strategy

### แนวทางที่แนะนำ: แยก Port ให้แต่ละ Application

```
Backend Server:          http://localhost:3001
├─ API:                 http://localhost:3001/api
└─ WebSocket:           http://localhost:3001

Agent Desktop App:       http://localhost:3000
Supervisor Dashboard:    http://localhost:3002
Admin Panel:             http://localhost:3003
```

---

## 🎯 Solution: กำหนด Port ใน package.json

### 1️⃣ **Agent Desktop App (Port 3000)**

#### `agent-desktop/package.json`

```json
{
  "name": "agent-desktop-app",
  "version": "4.0.0",
  "description": "Agent Desktop Application",
  "scripts": {
    "start": "PORT=3000 react-scripts start",
    "start:windows": "set PORT=3000 && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.2"
  }
}
```

#### `agent-desktop/.env`

```bash
# Agent Desktop App - Port Configuration
PORT=3000

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001

# Application Info
REACT_APP_NAME=Agent Desktop
REACT_APP_VERSION=4.0
```

---

### 2️⃣ **Supervisor Dashboard (Port 3002)**

#### `supervisor-dashboard/package.json`

```json
{
  "name": "supervisor-dashboard",
  "version": "4.0.0",
  "description": "Supervisor Dashboard Application",
  "scripts": {
    "start": "PORT=3002 react-scripts start",
    "start:windows": "set PORT=3002 && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.2"
  }
}
```

#### `supervisor-dashboard/.env`

```bash
# Supervisor Dashboard - Port Configuration
PORT=3002

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001

# Application Info
REACT_APP_NAME=Supervisor Dashboard
REACT_APP_VERSION=4.0
```

---

### 3️⃣ **Admin Panel (Port 3003)**

#### `admin-panel/package.json`

```json
{
  "name": "admin-panel",
  "version": "1.0.0",
  "description": "Admin Panel Application",
  "scripts": {
    "start": "PORT=3003 react-scripts start",
    "start:windows": "set PORT=3003 && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

#### `admin-panel/.env`

```bash
# Admin Panel - Port Configuration
PORT=3003

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Application Info
REACT_APP_NAME=Admin Panel
REACT_APP_VERSION=1.0
```

---

## 🖥️ Cross-Platform Support

### สำหรับ Windows + Mac/Linux

#### วิธีที่ 1: ใช้ `cross-env` (แนะนำ)

```bash
# ติดตั้ง cross-env
npm install --save-dev cross-env
```

#### แก้ไข `package.json` ทั้ง 3 projects:

**Agent Desktop:**
```json
{
  "scripts": {
    "start": "cross-env PORT=3000 react-scripts start",
    "build": "react-scripts build"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

**Supervisor Dashboard:**
```json
{
  "scripts": {
    "start": "cross-env PORT=3002 react-scripts start",
    "build": "react-scripts build"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

**Admin Panel:**
```json
{
  "scripts": {
    "start": "cross-env PORT=3003 react-scripts start",
    "build": "react-scripts build"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

---

### วิธีที่ 2: แยก Script สำหรับแต่ละ OS

```json
{
  "scripts": {
    "start": "npm run start:unix",
    "start:unix": "PORT=3000 react-scripts start",
    "start:windows": "set PORT=3000 && react-scripts start",
    "start:mac": "PORT=3000 react-scripts start",
    "build": "react-scripts build"
  }
}
```

**การใช้งาน:**
```bash
# Mac/Linux
npm start
# หรือ
npm run start:unix

# Windows
npm run start:windows
```

---

## 🔧 Backend CORS Configuration

### อัพเดท Backend เพื่อรองรับหลาย Ports

#### `backend-server/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS Configuration - รองรับทุก Frontend Apps
const allowedOrigins = [
  'http://localhost:3000',  // Agent Desktop
  'http://localhost:3002',  // Supervisor Dashboard
  'http://localhost:3003',  // Admin Panel
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ... rest of Express setup

const server = app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket available at http://localhost:${PORT}`);
  console.log('');
  console.log('📱 Frontend Applications:');
  console.log(`   Agent Desktop:       http://localhost:3000`);
  console.log(`   Supervisor Dashboard: http://localhost:3002`);
  console.log(`   Admin Panel:         http://localhost:3003`);
});

// ✅ Socket.IO CORS Configuration
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

module.exports = { app, server, io };
```

---

## 📝 การเพิ่มไฟล์ .env.example

### Agent Desktop App

#### `agent-desktop/.env.example`

```bash
# Agent Desktop App Configuration
# Copy this file to .env and customize as needed

# Development Port
PORT=3000

# Backend API
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001

# Application Info
REACT_APP_NAME=Agent Desktop
REACT_APP_VERSION=4.0

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true

# Debug Mode
REACT_APP_DEBUG=true
```

---

### Supervisor Dashboard

#### `supervisor-dashboard/.env.example`

```bash
# Supervisor Dashboard Configuration
# Copy this file to .env and customize as needed

# Development Port
PORT=3002

# Backend API
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001

# Application Info
REACT_APP_NAME=Supervisor Dashboard
REACT_APP_VERSION=4.0

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_BROADCAST=true

# Debug Mode
REACT_APP_DEBUG=true
```

---

### Admin Panel

#### `admin-panel/.env.example`

```bash
# Admin Panel Configuration
# Copy this file to .env and customize as needed

# Development Port
PORT=3003

# Backend API
REACT_APP_API_URL=http://localhost:3001/api

# Application Info
REACT_APP_NAME=Admin Panel
REACT_APP_VERSION=1.0

# Feature Flags
REACT_APP_ENABLE_USER_MANAGEMENT=true

# Debug Mode
REACT_APP_DEBUG=true
```

---

## 🚀 Development Workflow

### การรัน Applications พร้อมกัน

#### วิธีที่ 1: Manual (เปิด Terminal แยก)

```bash
# Terminal 1 - Backend
cd backend-server
npm start

# Terminal 2 - Agent Desktop
cd agent-desktop
npm start

# Terminal 3 - Supervisor Dashboard
cd supervisor-dashboard
npm start

# Terminal 4 - Admin Panel
cd admin-panel
npm start
```

---

#### วิธีที่ 2: ใช้ `concurrently` (แนะนำ)

สร้าง Root-level `package.json`:

#### `package.json` (Root directory)

```json
{
  "name": "contact-center-system",
  "version": "4.0.0",
  "description": "Complete Contact Center System",
  "scripts": {
    "install:all": "npm run install:backend && npm run install:agent && npm run install:supervisor && npm run install:admin",
    "install:backend": "cd backend-server && npm install",
    "install:agent": "cd agent-desktop && npm install",
    "install:supervisor": "cd supervisor-dashboard && npm install",
    "install:admin": "cd admin-panel && npm install",
    
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:agent\" \"npm run dev:supervisor\" \"npm run dev:admin\"",
    "dev:backend": "cd backend-server && npm start",
    "dev:agent": "cd agent-desktop && npm start",
    "dev:supervisor": "cd supervisor-dashboard && npm start",
    "dev:admin": "cd admin-panel && npm start",
    
    "start:backend": "cd backend-server && npm start",
    "start:agent": "cd agent-desktop && npm start",
    "start:supervisor": "cd supervisor-dashboard && npm start",
    "start:admin": "cd admin-panel && npm start",
    
    "build:all": "npm run build:agent && npm run build:supervisor && npm run build:admin",
    "build:agent": "cd agent-desktop && npm run build",
    "build:supervisor": "cd supervisor-dashboard && npm run build",
    "build:admin": "cd admin-panel && npm run build"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**ติดตั้ง:**
```bash
# ที่ root directory
npm install
npm run install:all
```

**รัน Development:**
```bash
# รันทุก applications พร้อมกัน
npm run dev

# หรือรันแยก
npm run start:backend
npm run start:agent
npm run start:supervisor
npm run start:admin
```

---

#### วิธีที่ 3: ใช้ `npm-run-all`

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:backend": "cd backend-server && npm start",
    "dev:agent": "cd agent-desktop && npm start",
    "dev:supervisor": "cd supervisor-dashboard && npm start",
    "dev:admin": "cd admin-panel && npm start"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

---

## 📁 Project Structure

```
contact-center-system/
├── backend-server/              # Port 3001
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── agent-desktop/               # Port 3000
│   ├── .env                     # PORT=3000
│   ├── .env.example
│   ├── package.json             # "start": "cross-env PORT=3000 ..."
│   └── src/
│
├── supervisor-dashboard/        # Port 3002
│   ├── .env                     # PORT=3002
│   ├── .env.example
│   ├── package.json             # "start": "cross-env PORT=3002 ..."
│   └── src/
│
├── admin-panel/                 # Port 3003
│   ├── .env                     # PORT=3003
│   ├── .env.example
│   ├── package.json             # "start": "cross-env PORT=3003 ..."
│   └── src/
│
├── package.json                 # Root package.json
├── .gitignore
└── README.md
```

---

## 📄 Root README.md

```markdown
# Contact Center System v4.0

Multi-application contact center system with Agent Desktop, Supervisor Dashboard, and Admin Panel.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                Backend Server (Port 3001)           │
│  - REST API                                         │
│  - WebSocket                                        │
│  - MongoDB                                          │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────┼────────┬──────────┐
         │        │        │          │
    ┌────▼───┐  ┌─▼────┐ ┌─▼──────┐   │
    │ Agent  │  │ Super│ │ Admin  │   │
    │Desktop │  │visor │ │ Panel  │   │
    │:3000   │  │:3002 │ │:3003   │   │
    └────────┘  └──────┘ └────────┘   │
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB
- npm or yarn

### Installation

```bash
# Install all dependencies
npm install
npm run install:all
```

### Development

```bash
# Run all applications
npm run dev

# Or run individually
npm run start:backend      # Backend only
npm run start:agent        # Agent Desktop only
npm run start:supervisor   # Supervisor Dashboard only
npm run start:admin        # Admin Panel only
```

### Access Applications

- Backend API: http://localhost:3001/api
- Agent Desktop: http://localhost:3000
- Supervisor Dashboard: http://localhost:3002
- Admin Panel: http://localhost:3003

## 📦 Build for Production

```bash
# Build all frontend applications
npm run build:all
```

## 🔧 Configuration

Each application has its own `.env` file:

- `backend-server/.env` - Backend configuration
- `agent-desktop/.env` - Agent app configuration (PORT=3000)
- `supervisor-dashboard/.env` - Supervisor app configuration (PORT=3002)
- `admin-panel/.env` - Admin app configuration (PORT=3003)

Copy `.env.example` to `.env` in each directory and customize as needed.

## 📚 Documentation

- [Backend API Documentation](./backend-server/README.md)
- [Agent Desktop Guide](./agent-desktop/README.md)
- [Supervisor Dashboard Guide](./supervisor-dashboard/README.md)
- [Admin Panel Guide](./admin-panel/README.md)

## 🧪 Testing

```bash
# Test backend
cd backend-server && npm test

# Test frontend apps
cd agent-desktop && npm test
cd supervisor-dashboard && npm test
cd admin-panel && npm test
```

## 📝 License

MIT License
```

---

## 🔍 การ Verify Ports

### สร้าง Script ตรวจสอบ Port

#### `scripts/check-ports.js`

```javascript
const net = require('net');

const ports = [
  { port: 3001, name: 'Backend Server' },
  { port: 3000, name: 'Agent Desktop' },
  { port: 3002, name: 'Supervisor Dashboard' },
  { port: 3003, name: 'Admin Panel' }
];

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve({ port, inUse: true });
      } else {
        resolve({ port, inUse: false });
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve({ port, inUse: false });
    });
    
    server.listen(port);
  });
}

async function checkAllPorts() {
  console.log('🔍 Checking ports...\n');
  
  for (const { port, name } of ports) {
    const result = await checkPort(port);
    const status = result.inUse ? '❌ IN USE' : '✅ AVAILABLE';
    console.log(`Port ${port} (${name}): ${status}`);
  }
}

checkAllPorts();
```

**เพิ่มใน Root `package.json`:**
```json
{
  "scripts": {
    "check-ports": "node scripts/check-ports.js"
  }
}
```

**ใช้งาน:**
```bash
npm run check-ports
```

---

## ✅ Summary Checklist

```markdown
# Port Configuration Checklist

## Agent Desktop (Port 3000)
- [ ] package.json มี "start": "cross-env PORT=3000 ..."
- [ ] .env มี PORT=3000
- [ ] .env มี REACT_APP_API_URL=http://localhost:3001/api
- [ ] ติดตั้ง cross-env: npm install --save-dev cross-env

## Supervisor Dashboard (Port 3002)
- [ ] package.json มี "start": "cross-env PORT=3002 ..."
- [ ] .env มี PORT=3002
- [ ] .env มี REACT_APP_API_URL=http://localhost:3001/api
- [ ] ติดตั้ง cross-env: npm install --save-dev cross-env

## Admin Panel (Port 3003)
- [ ] package.json มี "start": "cross-env PORT=3003 ..."
- [ ] .env มี PORT=3003
- [ ] .env มี REACT_APP_API_URL=http://localhost:3001/api
- [ ] ติดตั้ง cross-env: npm install --save-dev cross-env

## Backend (Port 3001)
- [ ] CORS รองรับ ports 3000, 3002, 3003
- [ ] Socket.IO CORS รองรับ ports 3000, 3002, 3003

## Root Setup (Optional)
- [ ] สร้าง package.json ที่ root
- [ ] ติดตั้ง concurrently: npm install --save-dev concurrently
- [ ] เพิ่ม scripts สำหรับรัน dev:all

## Testing
- [ ] รัน backend: npm start (port 3001)
- [ ] รัน agent: npm start (port 3000)
- [ ] รัน supervisor: npm start (port 3002)
- [ ] รัน admin: npm start (port 3003)
- [ ] ทดสอบ API calls ทำงานทุก apps
- [ ] ทดสอบ WebSocket ทำงานทุก apps
```

---

**สรุป:** ใช้ `cross-env` package กับ `.env` files เพื่อกำหนด ports แยกกันชัดเจน และ setup CORS ใน backend ให้รองรับทุก frontend applications 🎯