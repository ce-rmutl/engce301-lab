# Backend Setup Guide - Node.js Server

## 📋 Overview
สร้าง Node.js Backend Server ที่รองรับ REST API และ WebSocket สำหรับ Real-time communication

## 🛠️ Prerequisites
- Node.js 18+ installed
- npm package manager
- Basic knowledge of Express.js

## 📁 Project Structure
```
backend-server/
├── package.json
├── server.js                  # Main server file
├── config/
│   └── database.js            # Database configuration
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── agents.js             # Agent management routes
│   └── messages.js           # Message routes
├── models/
│   ├── Agent.js              # SQLite Agent model
│   └── Message.js            # MongoDB Message model
├── middleware/
│   └── auth.js               # Authentication middleware
├── utils/
│   └── logger.js             # Logging utility
└── socket/
    └── socketHandler.js      # WebSocket event handlers
```

## ⚡ Quick Setup

### 1. Initialize Project
```bash
# Create backend directory
mkdir backend-server
cd backend-server

# Initialize npm project
npm init -y

# Install dependencies
npm install express socket.io sqlite3 mongoose cors dotenv
npm install -D nodemon
```

### 2. Create package.json
```json
{
  "name": "agent-wallboard-backend",
  "version": "1.0.0",
  "description": "Backend server for Agent Wallboard System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "sqlite3": "^5.1.6",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 3. Environment Configuration
Create `.env` file:
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
SQLITE_DB_PATH=../database/sqlite/wallboard.db
MONGODB_URI=mongodb://localhost:27017/wallboard

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 📝 Core Server Implementation

### Main Server File (server.js)
```javascript
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const messageRoutes = require('./routes/messages');

// Import socket handler
const socketHandler = require('./socket/socketHandler');

// Import database config
const { connectMongoDB, initSQLite } = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io handling
socketHandler(io);

// Initialize databases and start server
async function startServer() {
  try {
    // Initialize databases
    await initSQLite();
    await connectMongoDB();
    
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app, io };
```

## 🗄️ Database Configuration

### Database Config (config/database.js)
```javascript
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const path = require('path');

let sqliteDb = null;

// SQLite Connection
function initSQLite() {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.SQLITE_DB_PATH || '../database/sqlite/wallboard.db';
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ SQLite connection error:', err);
        reject(err);
      } else {
        console.log('✅ Connected to SQLite database');
        resolve();
      }
    });
  });
}

// MongoDB Connection
async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wallboard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

function getSQLiteDB() {
  return sqliteDb;
}

module.exports = {
  initSQLite,
  connectMongoDB,
  getSQLiteDB
};
```

## 🔐 Authentication Routes

### Auth Routes (routes/auth.js)
```javascript
const express = require('express');
const { getSQLiteDB } = require('../config/database');
const router = express.Router();

// Agent Login
router.post('/login', (req, res) => {
  const { agentCode } = req.body;
  
  if (!agentCode) {
    return res.status(400).json({ error: 'Agent code is required' });
  }

  const db = getSQLiteDB();
  const query = `
    SELECT a.*, t.team_name 
    FROM agents a 
    LEFT JOIN teams t ON a.team_id = t.team_id 
    WHERE a.agent_code = ? AND a.is_active = 1
  `;

  db.get(query, [agentCode], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid agent code' });
    }

    // Return agent info (no password needed)
    res.json({
      success: true,
      agent: {
        agentCode: row.agent_code,
        agentName: row.agent_name,
        teamId: row.team_id,
        teamName: row.team_name,
        role: row.role
      }
    });
  });
});

// Agent Logout
router.post('/logout', (req, res) => {
  const { agentCode } = req.body;
  
  // Here you could update last_logout_time or handle session cleanup
  res.json({ success: true, message: 'Logged out successfully' });
});

// Validate Agent (for middleware)
router.get('/validate/:agentCode', (req, res) => {
  const { agentCode } = req.params;
  
  const db = getSQLiteDB();
  const query = 'SELECT agent_code, agent_name, role FROM agents WHERE agent_code = ? AND is_active = 1';

  db.get(query, [agentCode], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, agent: row });
  });
});

module.exports = router;
```

## 👥 Agent Management Routes

### Agent Routes (routes/agents.js)
```javascript
const express = require('express');
const { getSQLiteDB } = require('../config/database');
const Message = require('../models/Message');
const router = express.Router();

// Get all agents (for supervisor dashboard)
router.get('/', (req, res) => {
  const db = getSQLiteDB();
  const query = `
    SELECT a.agent_code, a.agent_name, a.team_id, t.team_name, a.role
    FROM agents a
    LEFT JOIN teams t ON a.team_id = t.team_id
    WHERE a.is_active = 1
    ORDER BY a.agent_name
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ agents: rows });
  });
});

// Get agents by team (for team-specific views)
router.get('/team/:teamId', (req, res) => {
  const { teamId } = req.params;
  const db = getSQLiteDB();
  
  const query = `
    SELECT agent_code, agent_name, role
    FROM agents 
    WHERE team_id = ? AND is_active = 1
    ORDER BY agent_name
  `;

  db.all(query, [teamId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ agents: rows });
  });
});

// Get agent details
router.get('/:agentCode', (req, res) => {
  const { agentCode } = req.params;
  const db = getSQLiteDB();
  
  const query = `
    SELECT a.*, t.team_name 
    FROM agents a 
    LEFT JOIN teams t ON a.team_id = t.team_id 
    WHERE a.agent_code = ?
  `;

  db.get(query, [agentCode], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ agent: row });
  });
});

module.exports = router;
```

## 📧 Message Routes

### Message Routes (routes/messages.js)
```javascript
const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Send message
router.post('/send', async (req, res) => {
  try {
    const { fromCode, toCode, message, type = 'direct' } = req.body;

    if (!fromCode || !message) {
      return res.status(400).json({ error: 'From code and message are required' });
    }

    // Create new message
    const newMessage = new Message({
      fromCode,
      toCode: type === 'broadcast' ? null : toCode,
      message,
      type,
      timestamp: new Date(),
      isRead: false
    });

    await newMessage.save();

    // Emit real-time event (handled by socket)
    const io = req.app.get('io');
    if (io) {
      if (type === 'broadcast') {
        io.emit('new_broadcast_message', newMessage);
      } else {
        io.to(toCode).emit('new_direct_message', newMessage);
      }
    }

    res.json({ success: true, messageId: newMessage._id });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for agent
router.get('/inbox/:agentCode', async (req, res) => {
  try {
    const { agentCode } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({
      $or: [
        { toCode: agentCode },
        { type: 'broadcast' }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(limit);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Mark message as read
router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.findByIdAndUpdate(messageId, { 
      isRead: true,
      readAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router;
```

## 🔌 WebSocket Handler

### Socket Handler (socket/socketHandler.js)
```javascript
const Message = require('../models/Message');

// Store active connections
const activeConnections = new Map();

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('👤 New client connected:', socket.id);

    // Agent joins their room
    socket.on('join_agent_room', (agentCode) => {
      socket.join(agentCode);
      activeConnections.set(agentCode, socket.id);
      console.log(`👤 Agent ${agentCode} joined room`);
      
      // Broadcast agent online status
      socket.broadcast.emit('agent_status_change', {
        agentCode,
        status: 'online',
        timestamp: new Date()
      });
    });

    // Handle status updates
    socket.on('update_agent_status', (data) => {
      const { agentCode, status } = data;
      
      // Broadcast status change to all supervisors
      io.emit('agent_status_change', {
        agentCode,
        status,
        timestamp: new Date()
      });

      console.log(`📊 Status update: ${agentCode} -> ${status}`);
    });

    // Handle supervisor joining team room
    socket.on('join_supervisor_room', (supervisorCode) => {
      socket.join(`supervisor_${supervisorCode}`);
      console.log(`👔 Supervisor ${supervisorCode} joined`);
    });

    // Handle direct messages
    socket.on('send_direct_message', async (data) => {
      try {
        const { fromCode, toCode, message } = data;
        
        // Save to database
        const newMessage = new Message({
          fromCode,
          toCode,
          message,
          type: 'direct',
          timestamp: new Date(),
          isRead: false
        });
        
        await newMessage.save();
        
        // Send to target agent
        io.to(toCode).emit('new_direct_message', newMessage);
        
        console.log(`💬 Message sent: ${fromCode} -> ${toCode}`);
      } catch (error) {
        console.error('Socket message error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('👋 Client disconnected:', socket.id);
      
      // Find and remove from active connections
      for (const [agentCode, socketId] of activeConnections.entries()) {
        if (socketId === socket.id) {
          activeConnections.delete(agentCode);
          
          // Broadcast agent offline status
          socket.broadcast.emit('agent_status_change', {
            agentCode,
            status: 'offline',
            timestamp: new Date()
          });
          break;
        }
      }
    });
  });
}

module.exports = socketHandler;
```

## 🚀 Running the Server

### Start Development Server
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

### Test Server
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test agent login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"agentCode":"AG001"}'
```

## 📋 Next Steps
1. Create database setup with sample data
2. Test all API endpoints with Postman
3. Implement error handling and logging
4. Add input validation and sanitization
5. Set up MongoDB models

---
**Backend server is ready! Next: Database Setup Guide** 🗄️