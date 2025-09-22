# Database Setup Guide - SQLite & MongoDB

## 📋 Overview
ตั้งค่าฐานข้อมูล 2 ตัวสำหรับ Agent Wallboard System:
- **SQLite**: Master data (Users, Teams, Configuration)
- **MongoDB**: Real-time data (Status, Messages, Logs)

## 🏗️ Database Architecture

### Data Distribution Strategy
```
📊 SQLite (Master Data)
├── agents          # Agent information
├── teams           # Team structure
├── supervisors     # Supervisor mapping
└── system_config   # System configuration

📈 MongoDB (Real-time Data)
├── agent_status    # Current and historical status
├── messages        # Direct and broadcast messages
└── connection_logs # Connection history
```

## 📁 Project Structure
```
database/
├── sqlite/
│   ├── wallboard.db        # SQLite database file
│   ├── init.sql           # Database initialization
│   └── sample_data.sql    # Sample data for testing
├── mongodb/
│   ├── collections.js     # MongoDB schema definitions
│   └── sample_data.js     # Sample data for MongoDB
└── README.md              # Database documentation
```

## 🛠️ SQLite Setup

### 1. Create SQLite Schema (sqlite/init.sql)
```sql
-- Agent Wallboard System Database Schema
-- SQLite Database for Master Data

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name VARCHAR(50) NOT NULL UNIQUE,
    supervisor_code VARCHAR(10),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    agent_code VARCHAR(10) PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    team_id INTEGER,
    role VARCHAR(20) NOT NULL CHECK (role IN ('agent', 'supervisor', 'admin')),
    email VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    config_key VARCHAR(50) PRIMARY KEY,
    config_value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agent sessions table (for tracking login/logout)
CREATE TABLE IF NOT EXISTS agent_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_code VARCHAR(10) NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (agent_code) REFERENCES agents(agent_code)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_team ON agents(team_id);
CREATE INDEX IF NOT EXISTS idx_agents_role ON agents(role);
CREATE INDEX IF NOT EXISTS idx_sessions_agent ON agent_sessions(agent_code);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON agent_sessions(is_active);
```

### 2. Sample Data (sqlite/sample_data.sql)
```sql
-- Sample Data for Agent Wallboard System
-- Run this after creating the schema

-- Insert Teams
INSERT OR REPLACE INTO teams (team_id, team_name, supervisor_code, description) VALUES
(1, 'Customer Service', 'SP001', 'Main customer service team'),
(2, 'Technical Support', 'SP002', 'Technical support specialists'),
(3, 'Sales Team', 'SP003', 'Sales and marketing team');

-- Insert Agents and Supervisors
INSERT OR REPLACE INTO agents (agent_code, agent_name, team_id, role, email, phone, hire_date) VALUES
-- Supervisors
('SP001', 'Sarah Wilson', 1, 'supervisor', 'sarah.wilson@company.com', '555-0101', '2022-01-15'),
('SP002', 'Mike Johnson', 2, 'supervisor', 'mike.johnson@company.com', '555-0102', '2022-02-20'),
('SP003', 'Lisa Chen', 3, 'supervisor', 'lisa.chen@company.com', '555-0103', '2022-03-10'),

-- Customer Service Agents
('AG001', 'John Smith', 1, 'agent', 'john.smith@company.com', '555-0201', '2023-01-10'),
('AG002', 'Emma Davis', 1, 'agent', 'emma.davis@company.com', '555-0202', '2023-01-15'),
('AG003', 'Robert Brown', 1, 'agent', 'robert.brown@company.com', '555-0203', '2023-02-01'),
('AG004', 'Jennifer Wilson', 1, 'agent', 'jennifer.wilson@company.com', '555-0204', '2023-02-10'),

-- Technical Support Agents
('AG005', 'David Miller', 2, 'agent', 'david.miller@company.com', '555-0301', '2023-01-20'),
('AG006', 'Amanda Taylor', 2, 'agent', 'amanda.taylor@company.com', '555-0302', '2023-02-05'),
('AG007', 'Chris Anderson', 2, 'agent', 'chris.anderson@company.com', '555-0303', '2023-02-15'),

-- Sales Team Agents
('AG008', 'Michelle Garcia', 3, 'agent', 'michelle.garcia@company.com', '555-0401', '2023-01-25'),
('AG009', 'Kevin Martinez', 3, 'agent', 'kevin.martinez@company.com', '555-0402', '2023-02-20'),
('AG010', 'Jessica Rodriguez', 3, 'agent', 'jessica.rodriguez@company.com', '555-0403', '2023-03-01'),

-- Admin User
('AD001', 'System Admin', NULL, 'admin', 'admin@company.com', '555-0001', '2022-01-01');

-- System Configuration
INSERT OR REPLACE INTO system_config (config_key, config_value, description, data_type) VALUES
('max_break_time_minutes', '120', 'Maximum break time allowed per day', 'integer'),
('auto_logout_hours', '8', 'Auto logout after inactive hours', 'integer'),
('status_update_interval_seconds', '30', 'Status update broadcast interval', 'integer'),
('max_message_length', '500', 'Maximum message length for direct messages', 'integer'),
('max_broadcast_length', '1000', 'Maximum message length for broadcast messages', 'integer'),
('enable_desktop_notifications', 'true', 'Enable desktop notifications', 'boolean'),
('system_timezone', 'Asia/Bangkok', 'System timezone', 'string'),
('company_name', 'RMUTL Agent Wallboard', 'Company name for display', 'string');

-- Sample session data (for testing)
INSERT OR REPLACE INTO agent_sessions (agent_code, login_time, ip_address, user_agent) VALUES
('AG001', '2024-09-22 08:00:00', '192.168.1.101', 'Electron Agent App'),
('AG002', '2024-09-22 08:15:00', '192.168.1.102', 'Electron Agent App'),
('SP001', '2024-09-22 07:45:00', '192.168.1.201', 'Chrome Browser');
```

### 3. SQLite Database Creation Script
```bash
#!/bin/bash
# create_sqlite_db.sh

echo "Creating SQLite database..."

# Create database directory if it doesn't exist
mkdir -p sqlite

# Remove existing database (for fresh start)
rm -f sqlite/wallboard.db

# Create database and run initialization scripts
sqlite3 sqlite/wallboard.db < init.sql
sqlite3 sqlite/wallboard.db < sample_data.sql

echo "✅ SQLite database created successfully!"
echo "📍 Database location: $(pwd)/sqlite/wallboard.db"

# Verify data
echo "📊 Verification - Agent count:"
sqlite3 sqlite/wallboard.db "SELECT role, COUNT(*) as count FROM agents GROUP BY role;"

echo "📊 Verification - Team count:"
sqlite3 sqlite/wallboard.db "SELECT team_name, COUNT(a.agent_code) as agent_count FROM teams t LEFT JOIN agents a ON t.team_id = a.team_id GROUP BY t.team_id;"
```

## 🍃 MongoDB Setup

### 1. MongoDB Models (mongodb/collections.js)
```javascript
const mongoose = require('mongoose');

// Agent Status Schema
const agentStatusSchema = new mongoose.Schema({
  agentCode: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Busy', 'Break', 'Meeting', 'Offline'],
    default: 'Offline'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  sessionId: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  collection: 'agent_status',
  timestamps: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
  fromCode: {
    type: String,
    required: true,
    index: true
  },
  toCode: {
    type: String,
    index: true,
    default: null // null for broadcast messages
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['direct', 'broadcast'],
    default: 'direct'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'messages',
  timestamps: true
});

// Connection Log Schema
const connectionLogSchema = new mongoose.Schema({
  agentCode: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: ['connect', 'disconnect', 'reconnect'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    default: 'unknown'
  },
  sessionId: {
    type: String,
    required: true
  },
  connectionDuration: {
    type: Number, // in seconds
    default: 0
  }
}, {
  collection: 'connection_logs',
  timestamps: true
});

// Performance Metrics Schema (for reporting)
const performanceMetricsSchema = new mongoose.Schema({
  teamId: {
    type: Number,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  metrics: {
    totalAgents: { type: Number, default: 0 },
    activeAgents: { type: Number, default: 0 },
    utilization: { type: Number, default: 0 }, // percentage
    avgResponseTime: { type: Number, default: 0 }, // seconds
    statusBreakdown: {
      available: { type: Number, default: 0 },
      busy: { type: Number, default: 0 },
      break: { type: Number, default: 0 },
      meeting: { type: Number, default: 0 },
      offline: { type: Number, default: 0 }
    },
    totalMessages: { type: Number, default: 0 },
    totalStatusChanges: { type: Number, default: 0 }
  }
}, {
  collection: 'performance_metrics',
  timestamps: true
});

// Create compound indexes for better query performance
agentStatusSchema.index({ agentCode: 1, timestamp: -1 });
messageSchema.index({ toCode: 1, timestamp: -1 });
messageSchema.index({ fromCode: 1, timestamp: -1 });
connectionLogSchema.index({ agentCode: 1, timestamp: -1 });
performanceMetricsSchema.index({ teamId: 1, date: -1 });

// Export models
const AgentStatus = mongoose.model('AgentStatus', agentStatusSchema);
const Message = mongoose.model('Message', messageSchema);
const ConnectionLog = mongoose.model('ConnectionLog', connectionLogSchema);
const PerformanceMetrics = mongoose.model('PerformanceMetrics', performanceMetricsSchema);

module.exports = {
  AgentStatus,
  Message,
  ConnectionLog,
  PerformanceMetrics
};
```

### 2. MongoDB Sample Data (mongodb/sample_data.js)
```javascript
const mongoose = require('mongoose');
const { AgentStatus, Message, ConnectionLog } = require('./collections');

async function insertSampleData() {
  try {
    console.log('🌱 Inserting MongoDB sample data...');

    // Clear existing data
    await AgentStatus.deleteMany({});
    await Message.deleteMany({});
    await ConnectionLog.deleteMany({});

    // Sample Agent Status Data
    const statusData = [
      {
        agentCode: 'AG001',
        status: 'Available',
        sessionId: 'session_001',
        timestamp: new Date('2024-09-22T08:00:00Z')
      },
      {
        agentCode: 'AG002',
        status: 'Busy',
        sessionId: 'session_002',
        timestamp: new Date('2024-09-22T08:15:00Z')
      },
      {
        agentCode: 'AG003',
        status: 'Break',
        sessionId: 'session_003',
        timestamp: new Date('2024-09-22T09:00:00Z')
      },
      {
        agentCode: 'AG004',
        status: 'Available',
        sessionId: 'session_004',
        timestamp: new Date('2024-09-22T08:30:00Z')
      },
      {
        agentCode: 'AG005',
        status: 'Offline',
        sessionId: 'session_005',
        timestamp: new Date('2024-09-22T07:45:00Z')
      }
    ];

    // Sample Messages
    const messageData = [
      {
        fromCode: 'SP001',
        toCode: 'AG001',
        message: 'Please check your queue, there are 3 pending tickets.',
        type: 'direct',
        priority: 'normal',
        timestamp: new Date('2024-09-22T09:15:00Z'),
        isRead: false
      },
      {
        fromCode: 'SP001',
        toCode: 'AG002',
        message: 'Great job on handling the difficult customer!',
        type: 'direct',
        priority: 'low',
        timestamp: new Date('2024-09-22T10:00:00Z'),
        isRead: true,
        readAt: new Date('2024-09-22T10:02:00Z')
      },
      {
        fromCode: 'SP001',
        toCode: null,
        message: 'Team meeting at 2 PM today. Please join the conference room.',
        type: 'broadcast',
        priority: 'high',
        timestamp: new Date('2024-09-22T11:00:00Z'),
        isRead: false
      },
      {
        fromCode: 'SP002',
        toCode: 'AG005',
        message: 'Can you help with the technical issue in ticket #12345?',
        type: 'direct',
        priority: 'urgent',
        timestamp: new Date('2024-09-22T11:30:00Z'),
        isRead: false
      },
      {
        fromCode: 'SP003',
        toCode: null,
        message: 'New sales target for this month has been updated. Check your dashboard.',
        type: 'broadcast',
        priority: 'normal',
        timestamp: new Date('2024-09-22T12:00:00Z'),
        isRead: false
      }
    ];

    // Sample Connection Logs
    const connectionData = [
      {
        agentCode: 'AG001',
        eventType: 'connect',
        timestamp: new Date('2024-09-22T08:00:00Z'),
        ipAddress: '192.168.1.101',
        userAgent: 'Electron Agent App v1.0',
        sessionId: 'session_001'
      },
      {
        agentCode: 'AG002',
        eventType: 'connect',
        timestamp: new Date('2024-09-22T08:15:00Z'),
        ipAddress: '192.168.1.102',
        userAgent: 'Electron Agent App v1.0',
        sessionId: 'session_002'
      },
      {
        agentCode: 'SP001',
        eventType: 'connect',
        timestamp: new Date('2024-09-22T07:45:00Z'),
        ipAddress: '192.168.1.201',
        userAgent: 'Mozilla/5.0 Chrome/118.0.0.0',
        sessionId: 'supervisor_session_001'
      }
    ];

    // Insert data
    await AgentStatus.insertMany(statusData);
    console.log('✅ Agent status data inserted');

    await Message.insertMany(messageData);
    console.log('✅ Message data inserted');

    await ConnectionLog.insertMany(connectionData);
    console.log('✅ Connection log data inserted');

    console.log('🎉 MongoDB sample data insertion completed!');

    // Verify data
    const statusCount = await AgentStatus.countDocuments();
    const messageCount = await Message.countDocuments();
    const logCount = await ConnectionLog.countDocuments();

    console.log(`📊 Verification:
    - Agent Status records: ${statusCount}
    - Message records: ${messageCount}
    - Connection Log records: ${logCount}`);

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

// MongoDB Connection and Setup
async function setupMongoDB() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wallboard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Insert sample data
    await insertSampleData();
    
    console.log('🚀 MongoDB setup completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Export for use in other files
module.exports = {
  setupMongoDB,
  insertSampleData
};

// Run setup if called directly
if (require.main === module) {
  setupMongoDB();
}
```

### 3. Database Initialization Script
```bash
#!/bin/bash
# setup_databases.sh

echo "🗄️ Setting up Agent Wallboard Databases..."

# Setup SQLite
echo "📊 Setting up SQLite database..."
cd sqlite
chmod +x create_sqlite_db.sh
./create_sqlite_db.sh
cd ..

# Setup MongoDB
echo "🍃 Setting up MongoDB database..."
node mongodb/sample_data.js

echo "✅ Database setup completed!"
echo ""
echo "📍 Database locations:"
echo "   SQLite: $(pwd)/sqlite/wallboard.db"
echo "   MongoDB: localhost:27017/wallboard"
echo ""
echo "🔍 Quick verification:"
echo "   SQLite agents: $(sqlite3 sqlite/wallboard.db 'SELECT COUNT(*) FROM agents;')"
echo "   MongoDB collections created: agent_status, messages, connection_logs"
```

## 🔧 Backend Model Integration

### SQLite Model (models/Agent.js)
```javascript
const { getSQLiteDB } = require('../config/database');

class Agent {
  static async findByCode(agentCode) {
    return new Promise((resolve, reject) => {
      const db = getSQLiteDB();
      const query = `
        SELECT a.*, t.team_name 
        FROM agents a 
        LEFT JOIN teams t ON a.team_id = t.team_id 
        WHERE a.agent_code = ? AND a.is_active = 1
      `;
      
      db.get(query, [agentCode], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findByTeam(teamId) {
    return new Promise((resolve, reject) => {
      const db = getSQLiteDB();
      const query = `
        SELECT agent_code, agent_name, role 
        FROM agents 
        WHERE team_id = ? AND is_active = 1 
        ORDER BY agent_name
      `;
      
      db.all(query, [teamId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async getAllActive() {
    return new Promise((resolve, reject) => {
      const db = getSQLiteDB();
      const query = `
        SELECT a.agent_code, a.agent_name, a.team_id, t.team_name, a.role
        FROM agents a
        LEFT JOIN teams t ON a.team_id = t.team_id
        WHERE a.is_active = 1
        ORDER BY a.agent_name
      `;
      
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async createSession(agentCode, ipAddress, userAgent) {
    return new Promise((resolve, reject) => {
      const db = getSQLiteDB();
      const query = `
        INSERT INTO agent_sessions (agent_code, ip_address, user_agent)
        VALUES (?, ?, ?)
      `;
      
      db.run(query, [agentCode, ipAddress, userAgent], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  static async endSession(sessionId) {
    return new Promise((resolve, reject) => {
      const db = getSQLiteDB();
      const query = `
        UPDATE agent_sessions 
        SET logout_time = CURRENT_TIMESTAMP, is_active = 0 
        WHERE session_id = ?
      `;
      
      db.run(query, [sessionId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
}

module.exports = Agent;
```

### MongoDB Model (models/Message.js)
```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromCode: {
    type: String,
    required: true,
    index: true
  },
  toCode: {
    type: String,
    index: true,
    default: null
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['direct', 'broadcast'],
    default: 'direct'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  collection: 'messages',
  timestamps: true
});

// Compound indexes
messageSchema.index({ toCode: 1, timestamp: -1 });
messageSchema.index({ fromCode: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
```

## 🧪 Testing Database Setup

### Database Test Script (test_database.js)
```javascript
const { getSQLiteDB, initSQLite, connectMongoDB } = require('../backend-server/config/database');
const { Message, AgentStatus } = require('./mongodb/collections');

async function testDatabases() {
  console.log('🧪 Testing Database Connections...');

  try {
    // Test SQLite
    console.log('\n📊 Testing SQLite...');
    await initSQLite();
    
    const db = getSQLiteDB();
    db.all('SELECT COUNT(*) as count FROM agents', [], (err, rows) => {
      if (err) {
        console.error('❌ SQLite test failed:', err);
      } else {
        console.log(`✅ SQLite working - ${rows[0].count} agents found`);
      }
    });

    // Test MongoDB
    console.log('\n🍃 Testing MongoDB...');
    await connectMongoDB();
    
    const messageCount = await Message.countDocuments();
    const statusCount = await AgentStatus.countDocuments();
    
    console.log(`✅ MongoDB working - ${messageCount} messages, ${statusCount} status records`);
    
    // Test sample queries
    console.log('\n🔍 Sample Query Tests:');
    
    // Get active agents
    db.all(`
      SELECT agent_code, agent_name, role 
      FROM agents 
      WHERE is_active = 1 
      LIMIT 3
    `, [], (err, agents) => {
      if (!err) {
        console.log('📝 Sample agents:', agents);
      }
    });

    // Get recent messages
    const recentMessages = await Message.find().sort({ timestamp: -1 }).limit(3);
    console.log('💬 Recent messages:', recentMessages.length);

  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

if (require.main === module) {
  testDatabases();
}

module.exports = { testDatabases };
```

## 📚 Usage Instructions

### 1. Initial Setup
```bash
# Create database directories
mkdir -p database/sqlite database/mongodb

# Make scripts executable
chmod +x database/sqlite/create_sqlite_db.sh
chmod +x database/setup_databases.sh

# Run complete database setup
cd database
./setup_databases.sh
```

### 2. Environment Variables
Add to your `.env` file:
```bash
# Database paths
SQLITE_DB_PATH=./database/sqlite/wallboard.db
MONGODB_URI=mongodb://localhost:27017/wallboard
```

### 3. Verification Commands
```bash
# Check SQLite data
sqlite3 database/sqlite/wallboard.db "SELECT * FROM agents LIMIT 5;"

# Check MongoDB data (requires mongo shell)
mongosh wallboard --eval "db.messages.find().limit(3)"
```

## 🔄 Data Management

### Backup Scripts
```bash
#!/bin/bash
# backup_databases.sh

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup SQLite
cp database/sqlite/wallboard.db $BACKUP_DIR/

# Backup MongoDB
mongodump --db wallboard --out $BACKUP_DIR/mongodb/

echo "✅ Backup completed: $BACKUP_DIR"
```

### Reset Data Script
```bash
#!/bin/bash
# reset_data.sh

echo "⚠️  This will delete all data. Continue? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    # Reset SQLite
    rm -f database/sqlite/wallboard.db
    cd database/sqlite && ./create_sqlite_db.sh && cd ../..
    
    # Reset MongoDB
    mongosh wallboard --eval "db.dropDatabase()"
    node database/mongodb/sample_data.js
    
    echo "✅ Data reset completed"
else
    echo "❌ Reset cancelled"
fi
```

---

## 📋 Next Steps
1. ✅ SQLite schema with sample data created
2. ✅ MongoDB collections with sample data created  
3. ✅ Database models for backend integration
4. 🔄 **Next: Agent Desktop App Setup (Electron.js)**
5. 🔄 **Next: Supervisor Dashboard Setup (React.js)**

**Databases are ready! Next: Agent Desktop App Guide** 🖥️