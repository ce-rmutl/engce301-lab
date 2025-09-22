# API Documentation & Complete Source Code Guide

## 📋 Overview
Complete API documentation สำหรับ Agent Wallboard System พร้อม source code พื้นฐานสำหรับ 2 สัปดาห์การพัฒนา

## 🌐 API Architecture

### Base URLs
- **Backend API**: `http://localhost:3001/api`
- **WebSocket**: `http://localhost:3001`
- **Agent Desktop**: `http://localhost:3002` (development)
- **Supervisor Dashboard**: `http://localhost:3000`

### Authentication
- **No JWT required** - Simple Agent Code validation
- **Agent Code format**: AG001-AG999, SP001-SP999
- **Validation**: Check against SQLite database

## 📚 REST API Endpoints

### 🔐 Authentication Endpoints

#### POST `/api/auth/login`
Agent/Supervisor login

**Request:**
```json
{
  "agentCode": "AG001"
}
```

**Response:**
```json
{
  "success": true,
  "agent": {
    "agentCode": "AG001",
    "agentName": "John Smith",
    "teamId": 1,
    "teamName": "Customer Service",
    "role": "agent"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid agent code"
}
```

#### POST `/api/auth/logout`
Agent logout

**Request:**
```json
{
  "agentCode": "AG001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/validate/:agentCode`
Validate agent code

**Response:**
```json
{
  "valid": true,
  "agent": {
    "agentCode": "AG001",
    "agentName": "John Smith",
    "role": "agent"
  }
}
```

### 👥 Agent Management Endpoints

#### GET `/api/agents`
Get all active agents

**Response:**
```json
{
  "agents": [
    {
      "agentCode": "AG001",
      "agentName": "John Smith",
      "teamId": 1,
      "teamName": "Customer Service",
      "role": "agent"
    }
  ]
}
```

#### GET `/api/agents/team/:teamId`
Get agents by team

**Response:**
```json
{
  "agents": [
    {
      "agentCode": "AG001",
      "agentName": "John Smith",
      "role": "agent"
    }
  ]
}
```

#### GET `/api/agents/:agentCode`
Get specific agent details

**Response:**
```json
{
  "agent": {
    "agentCode": "AG001",
    "agentName": "John Smith",
    "teamId": 1,
    "teamName": "Customer Service",
    "role": "agent",
    "email": "john.smith@company.com",
    "phone": "555-0201"
  }
}
```

### 💬 Message Endpoints

#### POST `/api/messages/send`
Send message to agent(s)

**Request (Direct Message):**
```json
{
  "fromCode": "SP001",
  "toCode": "AG001",
  "message": "Please check your queue",
  "type": "direct",
  "priority": "normal"
}
```

**Request (Broadcast Message):**
```json
{
  "fromCode": "SP001",
  "toCode": null,
  "message": "Team meeting at 2 PM",
  "type": "broadcast",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "507f1f77bcf86cd799439011"
}
```

#### GET `/api/messages/inbox/:agentCode`
Get messages for agent

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fromCode": "SP001",
      "toCode": "AG001",
      "message": "Please check your queue",
      "type": "direct",
      "priority": "normal",
      "timestamp": "2024-09-22T10:00:00Z",
      "isRead": false,
      "readAt": null
    }
  ]
}
```

#### PUT `/api/messages/:messageId/read`
Mark message as read

**Response:**
```json
{
  "success": true
}
```

### 🔧 System Endpoints

#### GET `/api/health`
Health check

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-09-22T10:00:00Z"
}
```

## 🔌 WebSocket Events

### Connection Events

#### Client → Server Events

**`join_agent_room`**
```javascript
socket.emit('join_agent_room', 'AG001');
```

**`join_supervisor_room`**
```javascript
socket.emit('join_supervisor_room', 'SP001');
```

**`update_agent_status`**
```javascript
socket.emit('update_agent_status', {
  agentCode: 'AG001',
  status: 'Available',
  timestamp: new Date()
});
```

**`send_direct_message`**
```javascript
socket.emit('send_direct_message', {
  fromCode: 'SP001',
  toCode: 'AG001',
  message: 'Please check your queue',
  timestamp: new Date()
});
```

#### Server → Client Events

**`agent_status_change`**
```javascript
socket.on('agent_status_change', (data) => {
  // data: { agentCode, status, timestamp }
  console.log(`${data.agentCode} changed status to ${data.status}`);
});
```

**`new_direct_message`**
```javascript
socket.on('new_direct_message', (message) => {
  // Display notification to agent
  showNotification(message.fromCode, message.message);
});
```

**`new_broadcast_message`**
```javascript
socket.on('new_broadcast_message', (message) => {
  // Display broadcast to all agents
  showBroadcastNotification(message.message);
});
```

**`agent_connected`**
```javascript
socket.on('agent_connected', (data) => {
  // data: { agentCode, timestamp }
  console.log(`${data.agentCode} connected`);
});
```

**`agent_disconnected`**
```javascript
socket.on('agent_disconnected', (data) => {
  // data: { agentCode, timestamp }
  console.log(`${data.agentCode} disconnected`);
});
```

## 📦 Complete Project Setup

### 1. Project Root Structure
```
agent-wallboard-system/
├── README.md
├── docker-compose.yml
├── .gitignore
├── package.json (root)
├── agent-desktop/          # Electron App
├── supervisor-dashboard/   # React Web App
├── backend-server/         # Node.js Backend
├── database/              # Database files & scripts
├── docs/                  # Documentation
└── scripts/               # Setup & deployment scripts
```

### 2. Root Package.json
```json
{
  "name": "agent-wallboard-system",
  "version": "1.0.0",
  "description": "Complete Agent Wallboard System for RMUTL",
  "scripts": {
    "install:all": "npm run install:backend && npm run install:agent && npm run install:supervisor",
    "install:backend": "cd backend-server && npm install",
    "install:agent": "cd agent-desktop && npm install",
    "install:supervisor": "cd supervisor-dashboard && npm install",
    "setup": "npm run install:all && npm run setup:db",
    "setup:db": "cd database && chmod +x setup_databases.sh && ./setup_databases.sh",
    "dev:backend": "cd backend-server && npm run dev",
    "dev:agent": "cd agent-desktop && npm run dev:electron",
    "dev:supervisor": "cd supervisor-dashboard && npm start",
    "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev:supervisor\" \"npm run dev:agent\"",
    "build:all": "npm run build:backend && npm run build:agent && npm run build:supervisor",
    "build:backend": "cd backend-server && npm run build",
    "build:agent": "cd agent-desktop && npm run build:electron",
    "build:supervisor": "cd supervisor-dashboard && npm run build",
    "test:all": "npm run test:backend && npm run test:supervisor",
    "test:backend": "cd backend-server && npm test",
    "test:supervisor": "cd supervisor-dashboard && npm test",
    "clean": "rm -rf */node_modules */build */dist",
    "reset": "npm run clean && npm run setup"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "workspaces": [
    "backend-server",
    "agent-desktop",
    "supervisor-dashboard"
  ]
}
```

### 3. Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:6.0
    container_name: wallboard-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: wallboard
    volumes:
      - mongodb_data:/data/db
      - ./database/mongodb:/docker-entrypoint-initdb.d
    networks:
      - wallboard-network

  # Backend Server
  backend:
    build: ./backend-server
    container_name: wallboard-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongodb:27017/wallboard
      SQLITE_DB_PATH: /app/database/wallboard.db
      PORT: 3001
    volumes:
      - ./database/sqlite:/app/database
    depends_on:
      - mongodb
    networks:
      - wallboard-network

  # Supervisor Dashboard
  supervisor-dashboard:
    build: ./supervisor-dashboard
    container_name: wallboard-dashboard
    restart: unless-stopped
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api
      REACT_APP_SOCKET_URL: http://localhost:3001
    depends_on:
      - backend
    networks:
      - wallboard-network

volumes:
  mongodb_data:

networks:
  wallboard-network:
    driver: bridge
```

### 4. Environment Configuration Files

#### Global .env
```bash
# Global Environment Configuration
NODE_ENV=development
LOG_LEVEL=debug

# Database URLs
MONGODB_URI=mongodb://localhost:27017/wallboard
SQLITE_DB_PATH=./database/sqlite/wallboard.db

# Server Ports
BACKEND_PORT=3001
SUPERVISOR_PORT=3000
AGENT_PORT=3002

# CORS Settings
CORS_ORIGIN=http://localhost:3000,http://localhost:3002

# System Settings
MESSAGE_RETENTION_DAYS=90
SESSION_TIMEOUT_HOURS=8
STATUS_UPDATE_INTERVAL=30
```

### 5. Main README.md
```markdown
# Agent Wallboard System

Complete real-time agent monitoring and communication system for RMUTL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd agent-wallboard-system

# Install all dependencies
npm run setup

# Start development environment
npm run dev:all
```

### Applications
- **Agent Desktop**: Electron app for agents (port 3002)
- **Supervisor Dashboard**: Web dashboard for supervisors (port 3000)
- **Backend API**: Node.js server with WebSocket (port 3001)

### Default Login Codes
**Agents:**
- AG001 - John Smith
- AG002 - Emma Davis
- AG003 - Robert Brown

**Supervisors:**
- SP001 - Sarah Wilson
- SP002 - Mike Johnson

## 📚 Documentation
- [API Documentation](./docs/api-documentation.md)
- [Agent Desktop Setup](./docs/agent-desktop-setup.md)
- [Supervisor Dashboard Setup](./docs/supervisor-dashboard-setup.md)
- [Database Setup](./docs/database-setup.md)

## 🛠️ Development

### Individual Applications
```bash
# Backend only
npm run dev:backend

# Supervisor dashboard only
npm run dev:supervisor

# Agent desktop only
npm run dev:agent
```

### Testing
```bash
# Test all applications
npm run test:all

# Test specific application
npm run test:backend
npm run test:supervisor
```

### Building
```bash
# Build all applications
npm run build:all

# Build specific application
npm run build:backend
npm run build:agent
npm run build:supervisor
```

## 🐳 Docker Deployment

```bash
# Start with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📋 Features

### Core Features ✅
- [x] Agent authentication with agent codes
- [x] Real-time status management
- [x] Direct messaging between supervisor and agents
- [x] Broadcast messaging to team
- [x] Desktop notifications for agents
- [x] Real-time team dashboard for supervisors

### Bonus Features 🔥
- [ ] Status history tracking
- [ ] Team performance analytics
- [ ] Export functionality
- [ ] Mobile responsive design
- [ ] Multi-team support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.
```

## 📋 Setup Scripts

### Master Setup Script (setup.sh)
```bash
#!/bin/bash
echo "🚀 Setting up Agent Wallboard System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    print_status "Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed."
        exit 1
    fi
    
    # Check MongoDB
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB not found. Please install MongoDB or use Docker."
    else
        print_status "MongoDB found"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is required but not installed."
        exit 1
    fi
    
    print_status "All prerequisites satisfied ✅"
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies for all modules..."
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend-server && npm install && cd ..
    
    # Supervisor dashboard dependencies
    print_status "Installing supervisor dashboard dependencies..."
    cd supervisor-dashboard && npm install && cd ..
    
    # Agent desktop dependencies
    print_status "Installing agent desktop dependencies..."
    cd agent-desktop && npm install && cd ..
    
    print_status "All dependencies installed ✅"
}

# Setup databases
setup_databases() {
    print_step "Setting up databases..."
    
    cd database
    
    # Make scripts executable
    chmod +x sqlite/create_sqlite_db.sh
    chmod +x setup_databases.sh
    
    # Run database setup
    ./setup_databases.sh
    
    cd ..
    
    print_status "Databases setup completed ✅"
}

# Create environment files
create_env_files() {
    print_step "Creating environment files..."
    
    # Backend .env
    if [ ! -f backend-server/.env ]; then
        cat > backend-server/.env << EOF
PORT=3001
NODE_ENV=development
SQLITE_DB_PATH=../database/sqlite/wallboard.db
MONGODB_URI=mongodb://localhost:27017/wallboard
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
EOF
        print_status "Created backend-server/.env"
    fi
    
    # Supervisor dashboard .env
    if [ ! -f supervisor-dashboard/.env ]; then
        cat > supervisor-dashboard/.env << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_REFRESH_INTERVAL=30000
REACT_APP_DEBUG=true
EOF
        print_status "Created supervisor-dashboard/.env"
    fi
    
    # Agent desktop .env
    if [ ! -f agent-desktop/.env ]; then
        cat > agent-desktop/.env << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
ELECTRON_IS_DEV=true
EOF
        print_status "Created agent-desktop/.env"
    fi
    
    print_status "Environment files created ✅"
}

# Create start scripts
create_start_scripts() {
    print_step "Creating start scripts..."
    
    # Start backend script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Backend Server..."
cd backend-server
npm run dev
EOF
    chmod +x start-backend.sh
    
    # Start supervisor dashboard script
    cat > start-supervisor.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting Supervisor Dashboard..."
cd supervisor-dashboard
npm start
EOF
    chmod +x start-supervisor.sh
    
    # Start agent desktop script
    cat > start-agent.sh << 'EOF'
#!/bin/bash
echo "🖥️ Starting Agent Desktop..."
cd agent-desktop
npm run dev:electron
EOF
    chmod +x start-agent.sh
    
    # Start all script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting all services..."

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log --dbpath /tmp/mongodb-data &
    sleep 3
fi

# Start backend in background
echo "🔧 Starting Backend..."
cd backend-server && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start supervisor dashboard in background
echo "🌐 Starting Supervisor Dashboard..."
cd ../supervisor-dashboard && npm start &
SUPERVISOR_PID=$!

# Start agent desktop
echo "🖥️ Starting Agent Desktop..."
cd ../agent-desktop && npm run dev:electron &
AGENT_PID=$!

echo "✅ All services started!"
echo "🔧 Backend: http://localhost:3001"
echo "🌐 Supervisor: http://localhost:3000"
echo "🖥️ Agent Desktop: Running as Electron app"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $SUPERVISOR_PID $AGENT_PID; exit" INT
wait
EOF
    chmod +x start-all.sh
    
    print_status "Start scripts created ✅"
}

# Test installation
test_installation() {
    print_step "Testing installation..."
    
    # Test backend
    print_status "Testing backend server..."
    cd backend-server
    if npm run test --silent; then
        print_status "Backend tests passed ✅"
    else
        print_warning "Backend tests failed (this might be normal if no tests are configured)"
    fi
    cd ..
    
    # Test supervisor dashboard
    print_status "Testing supervisor dashboard..."
    cd supervisor-dashboard
    if npm run build --silent; then
        print_status "Supervisor dashboard builds successfully ✅"
        rm -rf build/
    else
        print_warning "Supervisor dashboard build failed"
    fi
    cd ..
    
    print_status "Installation testing completed ✅"
}

# Main setup function
main() {
    echo "======================================"
    echo "  Agent Wallboard System Setup"
    echo "  RMUTL Software Engineering Course"
    echo "======================================"
    echo ""
    
    check_prerequisites
    echo ""
    
    install_dependencies
    echo ""
    
    setup_databases
    echo ""
    
    create_env_files
    echo ""
    
    create_start_scripts
    echo ""
    
    test_installation
    echo ""
    
    echo "======================================"
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Start all services: ./start-all.sh"
    echo "2. Or start individually:"
    echo "   - Backend: ./start-backend.sh"
    echo "   - Supervisor: ./start-supervisor.sh"
    echo "   - Agent: ./start-agent.sh"
    echo ""
    echo "🔐 Default login codes:"
    echo "   Agents: AG001, AG002, AG003"
    echo "   Supervisors: SP001, SP002"
    echo ""
    echo "🌐 URLs:"
    echo "   - Backend API: http://localhost:3001"
    echo "   - Supervisor Dashboard: http://localhost:3000"
    echo "   - Agent Desktop: Electron app"
    echo "======================================"
}

# Run main function
main "$@"
```

### Development Helper Scripts

#### Quick Test Script (test-system.sh)
```bash
#!/bin/bash
echo "🧪 Testing Agent Wallboard System..."

# Test backend health
echo "🔧 Testing backend..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Test agent login
echo "👤 Testing agent login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"agentCode":"AG001"}')

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo "✅ Agent login works"
else
    echo "❌ Agent login failed"
    echo "Response: $LOGIN_RESPONSE"
fi

# Test supervisor login
echo "👔 Testing supervisor login..."
SUPER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"agentCode":"SP001"}')

if echo "$SUPER_RESPONSE" | grep -q "success"; then
    echo "✅ Supervisor login works"
else
    echo "❌ Supervisor login failed"
    echo "Response: $SUPER_RESPONSE"
fi

# Test WebSocket (basic check)
echo "🔌 Testing WebSocket availability..."
if nc -z localhost 3001; then
    echo "✅ WebSocket port is accessible"
else
    echo "❌ WebSocket port is not accessible"
fi

echo "✅ System testing completed!"
```

#### Database Reset Script (reset-data.sh)
```bash
#!/bin/bash
echo "⚠️  Database Reset Script"
echo "This will delete ALL data and reset to sample data."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Resetting databases..."
    
    # Reset SQLite
    echo "📊 Resetting SQLite..."
    rm -f database/sqlite/wallboard.db
    cd database/sqlite
    ./create_sqlite_db.sh
    cd ../..
    
    # Reset MongoDB
    echo "🍃 Resetting MongoDB..."
    mongosh wallboard --eval "db.dropDatabase()" --quiet
    node database/mongodb/sample_data.js
    
    echo "✅ Database reset completed!"
    echo "🔐 You can now login with default codes:"
    echo "   - Agents: AG001, AG002, AG003"
    echo "   - Supervisors: SP001, SP002"
else
    echo "❌ Reset cancelled"
fi
```

## 📖 Student Development Guide

### Week 1 Tasks (Days 1-5)

#### Day 1-2: Project Setup & Understanding
```markdown
## 📋 Student Tasks - Days 1-2

### Team Organization
1. **Assign roles** to team members:
   - Backend Developer
   - Agent Desktop Developer  
   - Supervisor Dashboard Developer
   - Database Developer
   - Integration & Testing

### Project Setup
1. **Clone and setup** the project:
   ```bash
   git clone <repository>
   cd agent-wallboard-system
   ./setup.sh
   ```

2. **Understand the architecture**:
   - Review API documentation
   - Understand database schema
   - Study component structure

3. **Test the basic setup**:
   ```bash
   ./test-system.sh
   ```

### Individual Role Setup
- **Backend**: Study Node.js server structure, test API endpoints
- **Agent Desktop**: Understand Electron + React setup
- **Supervisor Dashboard**: Review React + Material-UI components
- **Database**: Understand SQLite + MongoDB structure
- **Testing**: Learn API testing with Postman

### Deliverables
- [ ] Project successfully setup on all machines
- [ ] Each team member understands their role
- [ ] Basic system test passes
- [ ] Team communication channel established
```

#### Day 3-5: Core Development
```markdown
## 📋 Student Tasks - Days 3-5

### Backend Developer
- [ ] Implement remaining API endpoints
- [ ] Add error handling and validation
- [ ] Test all endpoints with Postman
- [ ] Document any API changes

### Agent Desktop Developer
- [ ] Complete login functionality
- [ ] Implement status management UI
- [ ] Add WebSocket connection for real-time updates
- [ ] Test desktop notifications

### Supervisor Dashboard Developer
- [ ] Build team overview component
- [ ] Implement real-time status display
- [ ] Create message sending interface
- [ ] Add responsive design elements

### Database Developer
- [ ] Optimize database queries
- [ ] Add indexes for performance
- [ ] Create data backup scripts
- [ ] Test database performance

### Integration & Testing
- [ ] Create integration test scripts
- [ ] Test end-to-end workflows
- [ ] Document known issues
- [ ] Prepare demo scenarios

### End of Week 1 Demo
Each team presents:
- Working core functionality
- Challenges faced and solutions
- Plans for Week 2
```

### Week 2 Tasks (Days 6-10)

#### Day 6-8: Real-time Features & Integration
```markdown
## 📋 Student Tasks - Days 6-8

### All Teams - Integration Focus
1. **WebSocket Integration**:
   - Ensure real-time status updates work
   - Test message delivery
   - Handle connection errors gracefully

2. **Cross-platform Testing**:
   - Test on different operating systems
   - Verify mobile responsiveness
   - Check browser compatibility

3. **Performance Optimization**:
   - Optimize database queries
   - Reduce memory usage
   - Improve loading times

### Additional Features (Choose based on team progress)
- [ ] Message history display
- [ ] Advanced status tracking
- [ ] Team performance metrics
- [ ] Export functionality
- [ ] Enhanced notifications
```

#### Day 9-10: Final Integration & Presentation
```markdown
## 📋 Student Tasks - Days 9-10

### Final Integration
- [ ] End-to-end system testing
- [ ] Bug fixes and performance tuning
- [ ] Documentation completion
- [ ] Demo preparation

### Presentation Preparation
Each team prepares to demonstrate:
1. **System Architecture** (5 min)
   - Component overview
   - Technology choices
   - Database design

2. **Live Demo** (10 min)
   - Agent login and status management
   - Supervisor dashboard monitoring
   - Real-time messaging
   - Error handling

3. **Technical Challenges** (5 min)
   - Problems encountered
   - Solutions implemented
   - Lessons learned

4. **Future Enhancements** (3 min)
   - Features that could be added
   - Scalability considerations
   - Production deployment

### Final Deliverables
- [ ] Complete working system
- [ ] Source code with documentation
- [ ] User manual
- [ ] Technical documentation
- [ ] Presentation slides
```

## 🎯 Evaluation Criteria

### Technical Implementation (60%)
- **Functionality** (20%): Core features working correctly
- **Code Quality** (15%): Clean, documented, maintainable code
- **Architecture** (15%): Proper separation of concerns, good design
- **Integration** (10%): Components work together seamlessly

### Teamwork & Process (25%)
- **Collaboration** (10%): Effective team coordination
- **Version Control** (5%): Proper Git usage
- **Documentation** (10%): Clear documentation and comments

### Presentation & Demo (15%)
- **Demo Quality** (10%): System works during presentation
- **Technical Explanation** (5%): Clear explanation of implementation

## 🚀 Bonus Challenges

### For Advanced Teams
If teams finish early, they can implement additional features:

1. **Advanced Dashboard**:
   - Real-time charts and analytics
   - Performance metrics
   - Historical data visualization

2. **Enhanced Notifications**:
   - Sound notifications
   - Priority-based alerts
   - Custom notification settings

3. **Mobile Support**:
   - Progressive Web App (PWA)
   - Mobile-responsive design
   - Touch-friendly interface

4. **Security Features**:
   - Session management
   - Rate limiting
   - Input sanitization

5. **Deployment**:
   - Docker containerization
   - CI/CD pipeline setup
   - Production environment

---

## 📋 Summary

This complete setup provides:

✅ **Complete API documentation** with examples
✅ **Full project structure** with all components
✅ **Automated setup scripts** for easy installation
✅ **Development guides** for students
✅ **Testing tools** and procedures
✅ **Docker deployment** configuration
✅ **Evaluation criteria** and bonus challenges

**Students can now start development immediately with a complete foundation!** 🎉
