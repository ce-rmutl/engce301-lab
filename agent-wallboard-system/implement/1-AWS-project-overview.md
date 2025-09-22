# Agent Wallboard System - Project Overview & Structure

## 📋 โครงสร้างโปรเจค (Project Structure)

```
agent-wallboard-system/
│
├── 📁 agent-desktop/           # Electron.js Desktop App สำหรับ Agent
│   ├── main.js                 # Electron Main Process
│   ├── package.json
│   └── src/
│       ├── renderer/           # React Components
│       ├── assets/
│       └── utils/
│
├── 📁 supervisor-dashboard/    # React.js Web App สำหรับ Supervisor
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
│
├── 📁 backend-server/          # Node.js Backend Server
│   ├── package.json
│   ├── server.js               # Main Server File
│   ├── routes/                 # REST API Routes
│   ├── models/                 # Database Models
│   ├── middleware/             # Express Middleware
│   └── utils/
│
├── 📁 database/                # Database Files & Scripts
│   ├── sqlite/
│   │   ├── wallboard.db        # SQLite Database File
│   │   └── init.sql            # Initial Data Script
│   └── mongodb/
│       └── collections.js      # MongoDB Schema
│
├── 📁 docs/                    # Documentation
│   ├── setup-guide.md
│   ├── api-documentation.md
│   └── user-manual.md
│
└── 📄 README.md                # Main Project README
```

## 🎯 Project Overview

### **System Architecture**
- **Agent Desktop App**: Electron.js + React
- **Supervisor Dashboard**: React.js (Web)
- **Backend Server**: Node.js + Express + Socket.io
- **Databases**: SQLite (Master Data) + MongoDB (Real-time)

### **Core Features (MVP)**
1. **Agent Login**: ใช้ Agent Code (ไม่มี password)
2. **Status Management**: Available/Busy/Break/Offline
3. **Real-time Monitoring**: Supervisor ดูสถานะทีมแบบ Real-time
4. **Direct Messaging**: Supervisor ส่งข้อความถึง Agent
5. **Desktop Notifications**: Agent รับแจ้งเตือนบน Desktop

## 👥 Team Roles & Responsibilities

### **Role 1: Electron Developer**
- สร้าง Agent Desktop Application
- การทำงาน: Login UI, Status Management, WebSocket Integration
- **หลักสูตร**: `agent-desktop/` folder

### **Role 2: React Developer**
- สร้าง Supervisor Web Dashboard
- การทำงาน: Team Overview, Real-time Updates, Message UI
- **หลักสูตร**: `supervisor-dashboard/` folder

### **Role 3: Backend Developer**
- สร้าง REST API และ WebSocket Server
- การทำงาน: Authentication, Status API, Message Routing
- **หลักสูตร**: `backend-server/` folder

### **Role 4: Database Developer**
- ออกแบบและจัดการฐานข้อมูล
- การทำงาน: SQLite Schema, MongoDB Collections, Data Access
- **หลักสูตร**: `database/` folder + Models

### **Role 5: Integration & Testing**
- Integration Testing และ Documentation
- การทำงาน: API Testing, End-to-end Testing, User Manual
- **หลักสูตร**: `docs/` folder + Testing

## 📅 Development Timeline (2 Weeks)

### **Week 1: Foundation & Core Development**
| Day | Focus | Deliverables |
|-----|-------|-------------|
| 1-2 | Project Setup | Basic structure, Database setup |
| 3-4 | Core Features | Login, Status management |
| 5 | Week 1 Integration | Basic functionality working |

### **Week 2: Real-time & Integration**
| Day | Focus | Deliverables |
|-----|-------|-------------|
| 6-7 | Real-time Features | WebSocket, Notifications |
| 8-9 | System Integration | End-to-end testing |
| 10 | Demo & Documentation | Final presentation |

## 🛠️ Technology Stack

### **Frontend Technologies**
- **Electron.js 28+**: Cross-platform desktop apps
- **React 18+**: User interface library
- **Material-UI 5+**: React component library
- **Socket.io Client**: Real-time communication

### **Backend Technologies**
- **Node.js 18+**: JavaScript runtime
- **Express.js 4+**: Web application framework
- **Socket.io 4+**: Real-time bidirectional communication
- **SQLite3**: Embedded database
- **MongoDB 6+**: NoSQL database

### **Development Tools**
- **Git**: Version control
- **VS Code**: Code editor
- **Postman**: API testing
- **MongoDB Compass**: Database GUI

## ⚡ Quick Start

### **Prerequisites**
- Node.js 18+ installed
- Git installed
- MongoDB installed (local or Atlas)
- VS Code (recommended)

### **Initial Setup Steps**
1. Clone project repository
2. Install dependencies for all modules
3. Initialize databases
4. Start backend server
5. Start frontend applications

### **Next Steps**
- Read specific setup guides for your role:
  - [Backend Setup Guide](./docs/backend-setup.md)
  - [Agent Desktop Setup](./docs/agent-desktop-setup.md)
  - [Supervisor Dashboard Setup](./docs/supervisor-dashboard-setup.md)
  - [Database Setup Guide](./docs/database-setup.md)

## 🎯 Success Criteria

### **Minimum Working System**
- ✅ Agent can login and change status
- ✅ Supervisor can see team status real-time
- ✅ Supervisor can send messages to agents
- ✅ Messages appear as desktop notifications
- ✅ System handles basic error cases

### **Bonus Features (If Time Permits)**
- 🔥 Broadcast messages to all agents
- 🔥 Status history tracking
- 🔥 Team performance statistics
- 🔥 Enhanced UI/UX
- 🔥 Mobile responsive dashboard

---

## 📞 Support & Communication

### **Team Communication**
- Use Git for code collaboration
- Create issues for bugs and feature requests
- Regular team meetings for integration

### **Resources**
- Official documentation for each technology
- Stack Overflow for troubleshooting
- Team knowledge sharing sessions

**Ready to start building! 🚀**