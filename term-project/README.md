# 🎯 ENGCE301 Task Board Project Timeline
## Software Architecture - Semester-Long Progressive Development

---

## 📋 Project Overview

### โปรเจกต์: **Task Board System** (ระบบจัดการงานแบบ Trello/Jira)

**แนวคิดหลัก:**
พัฒนาระบบเดียวกันตลอดทั้งเทอม แต่ละสัปดาห์จะ **Refactor และ Evolve** Architecture Style ที่แตกต่างกัน เพื่อให้นักศึกษาเห็นความแตกต่าง ข้อดี-ข้อเสีย ของแต่ละแบบจากการทำจริง

**จุดประสงค์:**
1. ✅ เข้าใจ **Architectural Styles** จากประสบการณ์จริง
2. ✅ เรียนรู้การ **Refactor** และปรับปรุงสถาปัตยกรรม
3. ✅ ฝึก **Modern Development Tools** (Git, Docker, REST API, Microservices)
4. ✅ เตรียมความพร้อมสำหรับ **Final Project** (สามารถนำไปต่อยอดหรือเริ่มใหม่)

---

## 🗓️ Timeline Overview (13 สัปดาห์)

```
┌─────────────────────────────────────────────────────────────────┐
│                   ENGCE301 TASK BOARD JOURNEY                   │
│                  From Monolith to Microservices                 │
└─────────────────────────────────────────────────────────────────┘

Week 3  ──►  Week 4  ──►  Week 5  ──►  Week 6  ──►  Week 7
  📦           🏛️           🖥️           🏗️           📡
Monolith    Layered   Client-Server   N-Tier    Event-Driven

        ──►  Week 8-9  ──►  Week 10-13  ──►  Week 14-15
              🔧              🚀                 📊
           Microservices   Final Project    Presentation
```

---

## 📅 Detailed Weekly Breakdown

---

### 🟢 **PHASE 1: Foundation & Basic Architectures (Week 3-5)**

---

## 📦 Week 3: Monolithic Architecture

**Theme:** "Everything in One Place"

### 🎯 Learning Objectives
- ตั้งค่า Development Environment (WSL/Ubuntu + Node.js)
- สร้างแอปพลิเคชันแบบ Monolithic จาก scratch
- เข้าใจโครงสร้าง All-in-one codebase
- CRUD operations พื้นฐาน

### 🛠️ Technical Stack
```
├─ Backend: Node.js + Express.js
├─ Database: SQLite (ไฟล์เดียว ง่าย)
├─ Frontend: HTML + CSS + Vanilla JavaScript
└─ Tools: Git, VS Code, Thunder Client
```

### 📂 Project Structure
```
task-board-monolith/
├─ server.js              # ทุกอย่างอยู่ไฟล์เดียว
├─ database.db            # SQLite database
├─ public/
│  ├─ index.html         # UI หน้าเดียว
│  ├─ style.css
│  └─ app.js             # Client-side JS
├─ package.json
└─ README.md
```

### ⚙️ Features to Implement
- ✅ View all tasks (แสดงรายการงานทั้งหมด)
- ✅ Create new task (สร้างงานใหม่)
- ✅ Update task status (TODO → IN_PROGRESS → DONE)
- ✅ Delete task (ลบงาน)
- ✅ Simple UI (ไม่ต้องสวย เน้นทำงานได้)

### 📊 Architecture Characteristics
```
┌──────────────────────────────────┐
│   Monolithic Application         │
│                                  │
│  ┌────────────────────────────┐  │
│  │  UI (HTML/CSS/JS)          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  Business Logic            │  │
│  │  (Route handlers)          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  Database Access           │  │
│  │  (SQLite queries)          │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
                 │
                 ▼
           ┌───────────┐
           │ SQLite DB │
           └───────────┘
```

### 🎓 Lab Activities (3 hours)
1. **Setup Environment** (60 min)
   - Install WSL2/Ubuntu
   - Install Node.js, npm, Git, SQLite
   - Setup VS Code + Extensions

2. **Build Monolithic App** (90 min)
   - Create database schema
   - Write server.js with all routes
   - Build simple HTML interface
   - Test CRUD operations

3. **Documentation** (30 min)
   - Write README.md
   - Git commit and push
   - Reflect: What works? What's difficult?

### 📝 Homework
- เพิ่ม feature: Task Priority (Low, Medium, High)
- เพิ่ม feature: Task Due Date
- ศึกษา: ข้อเสียของ Monolithic ที่พบ

### 🎯 Deliverables
- ✅ Working Task Board application
- ✅ Git repository
- ✅ README with setup instructions
- ✅ Screenshot of running app

---

## 🏛️ Week 4: Layered (3-Tier) Architecture

**Theme:** "Separation of Concerns"

### 🎯 Learning Objectives
- Refactor Monolithic เป็น Layered Architecture
- เข้าใจ Presentation → Business → Data layers
- ฝึกการแยก responsibilities ชัดเจน
- เรียนรู้ Dependency Injection

### 🛠️ Technical Stack
```
├─ Backend: Node.js + Express.js (Same)
├─ Database: SQLite → (Same)
├─ Frontend: HTML + CSS + JS (เหมือนเดิม)
└─ New Tools: dotenv
```

### 📂 Project Structure
```
task-board-layered/
├─ src/
│  ├─ presentation/           # Layer 1: Presentation
│  │  ├─ routes/
│  │  │  ├─ taskRoutes.js
│  │  │  └─ index.js
│  │  ├─ controllers/
│  │  │  └─ taskController.js
│  │  └─ middlewares/
│  │     └─ errorHandler.js
│  │
│  ├─ business/               # Layer 2: Business Logic
│  │  ├─ services/
│  │  │  └─ taskService.js
│  │  ├─ validators/
│  │  │  └─ taskValidator.js
│  │  └─ models/
│  │     └─ Task.js
│  │
│  └─ data/                   # Layer 3: Data Access
│     ├─ repositories/
│     │  └─ taskRepository.js
│     ├─ database/
│     │  ├─ connection.js
│     │  └─ schema.sql
│     └─ migrations/
│
├─ public/                    # Frontend (unchanged)
├─ server.js                  # Entry point
├─ config.js
└─ .env
```

### ⚙️ New Features
- ✅ **Validation Rules** (Title required, max length 200)
- ✅ **Business Logic** (Cannot delete IN_PROGRESS tasks)
- ✅ **Error Handling** (Proper error responses)


### 📊 Architecture Characteristics
```
┌─────────────────────────────────────┐
│  Presentation Layer                 │
│  ┌───────────────────────────────┐  │
│  │ Routes → Controllers          │  │
│  │ (Handle HTTP, Validation)     │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Business Logic Layer               │
│  ┌───────────────────────────────┐  │
│  │ Services → Models             │  │
│  │ (Business Rules, Workflows)   │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Data Access Layer                  │
│  ┌───────────────────────────────┐  │
│  │ Repositories → Database       │  │
│  │ (SQL Queries, Connections)    │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
          ┌──────────┐
          │  SQLite  │
          └──────────┘
```

### 🎓 Lab Activities (3 hours)
1. **Refactoring** (90 min)
   - Create layer folders
   - Move code to appropriate layers
   - Implement dependency injection

2. **PostgreSQL Migration** (45 min)
   - Setup PostgreSQL in Docker
   - Migrate data from SQLite
   - Update queries

3. **Testing & Comparison** (45 min)
   - Test all features still work
   - Compare with Week 3 code
   - Document differences

### 🎯 Deliverables
- ✅ Refactored codebase (3 layers)
- ✅ PostgreSQL working
- ✅ Comparison document (Monolithic vs Layered)

---

## 🖥️ Week 5: Client-Server Architecture (REST API)

**Theme:** "Separation of Frontend and Backend"

### 🎯 Learning Objectives
- แยก Frontend และ Backend เป็น 2 โปรเจกต์
- สร้าง RESTful API
- เข้าใจ HTTP Methods, Status Codes
- ทำ API Documentation

### 🛠️ Technical Stack
```
├─ Backend: Node.js + Express.js (API Only)
├─ Frontend: HTML + Vanilla JS (Fetch API)
├─ Database: PostgreSQL
└─ New Tools: Postman/Thunder Client, Swagger
```

### 📂 Project Structure
```
task-board-client-server/
├─ backend/                   # Server
│  ├─ src/
│  │  ├─ api/
│  │  │  ├─ routes/
│  │  │  ├─ controllers/
│  │  │  └─ middlewares/
│  │  ├─ services/
│  │  ├─ repositories/
│  │  └─ database/
│  ├─ server.js
│  ├─ package.json
│  └─ swagger.json          # API Documentation
│
└─ frontend/                  # Client
   ├─ index.html
   ├─ styles.css
   ├─ app.js
   ├─ services/
   │  └─ apiClient.js       # API calls
   └─ components/
      ├─ taskList.js
      └─ taskForm.js
```

### ⚙️ REST API Endpoints
```http
GET    /api/tasks              # Get all tasks
GET    /api/tasks/:id          # Get single task
POST   /api/tasks              # Create task
PUT    /api/tasks/:id          # Update task
DELETE /api/tasks/:id          # Delete task
PATCH  /api/tasks/:id/status   # Update status only
```

### 📊 Architecture Characteristics
```
┌──────────────────┐          ┌──────────────────┐
│  Frontend        │          │  Backend         │
│  (Client)        │          │  (Server)        │
│                  │          │                  │
│  ┌────────────┐  │          │  ┌────────────┐  │
│  │   HTML     │  │          │  │ REST API   │  │
│  │   CSS      │◄─┼── HTTP ──┼─►│ Express.js │  │
│  │   JS       │  │   JSON   │  │            │  │
│  └────────────┘  │          │  └──────┬─────┘  │
│                  │          │         │        │
│  localhost:8080  │          │    localhost:3000│
└──────────────────┘          └─────────┼────────┘
                                        │
                                        ▼
                              ┌─────────────────┐
                              │SQLite (tasks.db)│
                              │    Migration    │
                              │        to       │
                              │   'PostgreSQL'  │
                              └─────────────────┘
```

### 🎓 Lab Activities (3 hours)
1. **Backend: Create REST API** (90 min)
   - Implement all CRUD endpoints
   - Add CORS middleware
   - Test with Postman

2. **Frontend: API Integration** (60 min)
   - Fetch API calls
   - Update UI based on responses
   - Error handling

3. **Documentation** (30 min)
   - Postman collection
   - README update

### 🛠️ Technical Stack
```
├─ Backend: Node.js + Express.js (Same)
├─ Database: SQLite → PostgreSQL (Migration)
├─ Frontend: HTML + CSS + JS (เหมือนเดิม)
└─ New Tools: pg (PostgreSQL driver), dotenv
```

### 🎯 Deliverables
- ✅ **Migration to PostgreSQL** (More professional DB)
- ✅ RESTful API (tested with Postman)
- ✅ Separate Frontend project
- ✅ API Documentation (Swagger)

---

### 🔵 **PHASE 2: Modern Architectures (Week 6-7)**

---

## 🏗️ Week 6: N-Tier Architecture (Multi-tier)

**Theme:** "Physical Separation with Docker"

### 🎯 Learning Objectives
- เข้าใจ Tier (Physical) vs Layer (Logical)
- ใช้ Docker Compose รัน multi-tier
- เพิ่ม Caching layer (Redis)
- Load Balancing basics

### 🛠️ Technical Stack
```
├─ Backend: Node.js + Express.js
├─ Database: PostgreSQL (Docker container)
├─ Cache: Redis (New!)
├─ Reverse Proxy: Nginx (New!)
├─ Tools: Docker, Docker Compose
```

### 📂 Project Structure
```
task-board-n-tier/
├─ docker-compose.yml        # Orchestration
├─ nginx/
│  └─ nginx.conf            # Load balancer config
├─ backend/
│  ├─ Dockerfile
│  └─ src/
├─ frontend/
│  ├─ Dockerfile
│  └─ public/
└─ database/
   └─ init.sql
```

### 📊 Architecture Characteristics
```
┌───────────────┐
│ Tier 1: Nginx │ ← Reverse Proxy / Load Balancer
│   (Port 80)   │
└───────┬───────┘
        │
        ├─────────┬─────────────┐
        │         │             │
        ▼         ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ App #1    │ │ App #2    │ │ App #3    │ ← Tier 2: App Servers
│(Port 3001)│ │(Port 3002)│ │(Port 3003)│   (Scalable)
└────┬──────┘ └────┬──────┘ └────┬──────┘
     │             │             │
     └─────────────┴─────────────┘
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
     ┌─────────┐      ┌──────────┐
     │  Redis  │      │PostgreSQL│ ← Tier 3: Data Tier
     │ (Cache) │      │ (Storage)│
     └─────────┘      └──────────┘
```

### ⚙️ New Features
- ✅ Redis caching (Cache frequently accessed tasks)
- ✅ Multiple app instances (Scale horizontally)
- ✅ Nginx load balancing (Round-robin)
- ✅ Health check endpoint

### 🎓 Lab Activities (3 hours)
1. **Docker Setup** (60 min)
   - Write Dockerfiles
   - Create docker-compose.yml
   - Test individual containers

2. **Multi-tier Deployment** (60 min)
   - Configure Nginx
   - Implement Redis caching
   - Scale app to 3 instances

3. **Testing & Monitoring** (60 min)
   - Load testing
   - Check Redis cache hits
   - Monitor container logs

### 📝 Homework
- เพิ่ม Monitoring (Prometheus + Grafana)
- เพิ่ม Database Replication
- ศึกษา Kubernetes basics

### 🎯 Deliverables
- ✅ Docker Compose setup
- ✅ Multi-tier architecture working
- ✅ Load testing results

---

## 📡 Week 7: Event-Driven Architecture

**Theme:** "Asynchronous Communication"

### 🎯 Learning Objectives
- เข้าใจ Event-Driven Pattern
- ใช้ Message Queue (RabbitMQ)
- Implement Pub/Sub pattern
- Handle asynchronous workflows

### 🛠️ Technical Stack
```
├─ Backend: Node.js + Express.js
├─ Message Queue: RabbitMQ (New!)
├─ Database: PostgreSQL
├─ Tools: Docker Compose
```

### 📂 Project Structure
```
task-board-event-driven/
├─ docker-compose.yml
├─ api-gateway/
│  └─ src/
├─ task-service/           # Handles task CRUD
│  └─ src/
├─ notification-service/   # Sends notifications (New!)
│  └─ src/
├─ audit-service/         # Logs events (New!)
│  └─ src/
└─ shared/
   └─ events/             # Event definitions
```

### 📊 Architecture Characteristics
```
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
       ├──────────────┬───────────────┐
       │              │               │
       ▼              ▼               ▼
┌────────────┐  ┌────────────┐  ┌──────────┐
│Task Service│  │Notification│  │  Audit   │
│            │  │  Service   │  │ Service  │
└─────┬──────┘  └─────┬──────┘  └─────┬────┘
      │               │               │
      └───────────────┴───────────────┘
                      │
                      ▼
              ┌──────────────┐
              │  RabbitMQ    │ ← Event Bus
              │ (Message Q)  │
              └──────────────┘

Events:
• TaskCreated
• TaskUpdated
• TaskDeleted
• TaskCompleted
```

### ⚙️ Event Examples
```javascript
// Events
TaskCreated → Send email notification
TaskCompleted → Update user stats, Log audit
TaskDeleted → Archive data, Send notification
```

### 🎓 Lab Activities (3 hours)
1. **RabbitMQ Setup** (45 min)
   - Setup RabbitMQ in Docker
   - Create exchanges and queues
   - Test pub/sub

2. **Implement Event Publishers** (60 min)
   - Task service publishes events
   - Event schemas/contracts

3. **Implement Event Consumers** (75 min)
   - Notification service
   - Audit service
   - Test end-to-end flow

### 📝 Homework
- เพิ่ม Event Replay mechanism
- เพิ่ม Dead Letter Queue
- Implement Event Sourcing (bonus)

### 🎯 Deliverables
- ✅ Event-driven system working
- ✅ Multiple services communicating via events
- ✅ Event flow diagram

---

### 🟣 **PHASE 3: Microservices (Week 8-9)**

---

## 🔧 Week 8-9: Microservices Architecture (2 weeks)

**Theme:** "Independent Services"

### 🎯 Learning Objectives
- แบ่งระบบเป็น Microservices
- Service Discovery pattern
- API Gateway pattern
- Inter-service communication

### 🛠️ Technical Stack
```
├─ Services: Node.js (Express/Fastify)
├─ API Gateway: Express Gateway / Kong
├─ Service Discovery: Consul (Optional)
├─ Database: PostgreSQL (per service)
├─ Message Queue: RabbitMQ
└─ Tools: Docker Compose, Postman
```

### 📂 Project Structure
```
task-board-microservices/
├─ docker-compose.yml
├─ api-gateway/
│  ├─ Dockerfile
│  └─ src/
│
├─ user-service/           # Service 1
│  ├─ Dockerfile
│  ├─ src/
│  └─ database/
│     └─ users.db
│
├─ task-service/           # Service 2
│  ├─ Dockerfile
│  ├─ src/
│  └─ database/
│     └─ tasks.db
│
├─ notification-service/   # Service 3
│  ├─ Dockerfile
│  └─ src/
│
├─ audit-service/         # Service 4
│  ├─ Dockerfile
│  └─ src/
│
└─ shared/
   ├─ events/
   └─ utils/
```

### 📊 Architecture Characteristics
```
                 ┌─────────────┐
     Client  ──► │ API Gateway │
                 └──────┬──────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │  User   │     │  Task   │     │  Notif  │
   │ Service │     │ Service │     │ Service │
   └────┬────┘     └────┬────┘     └────┬────┘
        │               │               │
        ▼               ▼               ▼
   ┌────────┐      ┌────────┐      ┌────────┐
   │User DB │      │Task DB │      │ Queue  │
   └────────┘      └────────┘      └────────┘
```

### ⚙️ Features to Implement
- ✅ **User Service**: Authentication, User profiles
- ✅ **Task Service**: CRUD tasks, Assign to users
- ✅ **Notification Service**: Email/Push notifications
- ✅ **Audit Service**: Log all activities
- ✅ **API Gateway**: Single entry point, Routing
- ✅ **Service-to-service communication**: REST + Events

### 🎓 Lab Activities (6 hours total - 2 weeks)

**Week 8:**
1. **Decompose Monolith** (90 min)
   - Identify bounded contexts
   - Design service boundaries
   - Define APIs

2. **Build User Service** (90 min)
   - JWT authentication
   - User CRUD
   - Own database

**Week 9:**
3. **Build Task Service** (90 min)
   - Task CRUD
   - Call User Service for user info
   - Event publishing

4. **API Gateway + Testing** (90 min)
   - Setup gateway
   - Route configuration
   - End-to-end testing

### 📝 Homework
- เพิ่ม Service Health Checks
- Implement Circuit Breaker pattern
- Add Distributed Tracing (Zipkin/Jaeger)

### 🎯 Deliverables
- ✅ 4+ working microservices
- ✅ API Gateway routing
- ✅ Services can communicate
- ✅ Architecture documentation

---

### 🟠 **PHASE 4: Final Project (Week 10-15)**

---

## 🚀 Week 10-13: Final Project Development (4 weeks)

**Theme:** "Apply Everything You've Learned"

### 🎯 Objectives
นักศึกษาเลือก 1 จาก 3 ทางเลือก:

#### **ตัวเลือก 1: ต่อยอด Task Board**
เพิ่ม features ขั้นสูง:
- Real-time updates (WebSocket)
- Team collaboration
- File attachments
- Advanced reporting/analytics
- Mobile responsive

#### **ตัวเลือก 2: โปรเจกต์ใหม่ (แต่ใช้ Architecture ที่เรียน)**
ทำระบบใหม่ที่น่าสนใจ:
- E-learning Platform
- Food Delivery System
- Social Media Platform
- IoT Smart Home
- Healthcare Appointment System
- Hotel Booking System

#### **ตัวเลือก 3: Improve Existing Project**
เลือกสัปดาห์ที่ชอบ แล้วพัฒนาต่อ:
- Week 6 N-Tier → เพิ่ม features
- Week 7 Event-Driven → เพิ่ม services
- Week 8-9 Microservices → Production-ready

### 📋 Requirements (ทุกตัวเลือก)
1. **Architecture Document (SAD)**
   - Context Diagram (C4-C1)
   - Container Diagram (C4-C2)
   - Component Diagram (C4-C3)
   - Architecture Decision Records (ADR)

2. **Quality Attributes**
   - เลือก 3 QAs สำคัญ
   - เขียน Quality Attribute Scenarios
   - อธิบายว่า Architecture รองรับอย่างไร

3. **Implementation**
   - Working application
   - Docker Compose deployment
   - CI/CD pipeline (GitHub Actions)
   - Unit + Integration tests

4. **Documentation**
   - README with setup instructions
   - API documentation
   - Architecture diagrams
   - User guide

### 🎓 Weekly Activities

**Week 10: Planning & Design**
- Form teams (3-4 คน)
- Choose project
- Design architecture
- Write SAD (draft)

**Week 11: Core Development**
- Implement core features
- Setup infrastructure
- API development

**Week 12: Integration & Testing**
- Service integration
- End-to-end testing
- Bug fixes

**Week 13: Polish & Documentation**
- UI/UX improvements
- Complete documentation
- Prepare presentation

### 📝 Evaluation Criteria (40% of total grade)
- **Architecture Design (10%)**: SAD, Diagrams, ADRs
- **Implementation (15%)**: Code quality, Working features
- **Documentation (5%)**: README, API docs, User guide
- **Presentation (5%)**: Demo, Q&A
- **Teamwork (5%)**: Git commits, Collaboration

---

## 📊 Week 14-15: Presentation & Reflection

**Theme:** "Show What You've Built"

### Week 14: Final Presentations
- แต่ละทีมนำเสนอ 15 นาที
- Demo live application
- อธิบาย Architecture decisions
- Q&A จากอาจารย์และเพื่อน

### Week 15: Reflection & Retrospective
- Lessons learned
- What would you do differently?
- Industry best practices discussion
- Course feedback

---

## 📈 Learning Progression Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                  SKILL PROGRESSION CHART                        │
└─────────────────────────────────────────────────────────────────┘

Week 3  │█░░░░░░░░░░│ 10%  Basic coding
Week 4  │███░░░░░░░░│ 30%  + Code organization
Week 5  │█████░░░░░░│ 50%  + API design
Week 6  │███████░░░░│ 70%  + Containerization
Week 7  │████████░░░│ 80%  + Event patterns
Week 8-9│██████████░│ 95%  + Microservices
Week 10+│███████████│ 100% + Production ready

Skills Acquired:
✅ Git & Version Control
✅ Docker & Containerization
✅ REST API Design
✅ Database Design (SQL)
✅ Microservices Architecture
✅ Event-Driven Design
✅ DevOps basics (CI/CD)
✅ Testing (Unit, Integration)
✅ Architecture Documentation
```

---

## 🛠️ Tools & Technologies Overview

### Core Technologies (ใช้ตลอดทั้งเทอม)
- **Language**: JavaScript (Node.js)
- **Runtime**: Node.js 20+
- **Web Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Version Control**: Git + GitHub

### Week-by-Week Tools Introduction

| Week | New Tools Introduced |
|------|---------------------|
| Week 3 | SQLite, VS Code, Thunder Client |
| Week 4 | PostgreSQL, pg driver, dotenv |
| Week 5 | Postman, Swagger/OpenAPI, CORS |
| Week 6 | Docker, Docker Compose, Redis, Nginx |
| Week 7 | RabbitMQ, Event Bus pattern |
| Week 8-9 | API Gateway, Service Discovery |
| Week 10+ | Jest, GitHub Actions, Monitoring tools |

---

## 📚 Resources & Support

### 📖 Learning Resources
- **Lecture Slides**: Available on LMS
- **Lab Guides**: Step-by-step instructions each week
- **Video Tutorials**: Recorded demos (optional)
- **Code Examples**: GitHub repository with starter code

### 💬 Getting Help
- **Lab Time**: Ask TA/อาจารย์ during lab hours
- **Discord**: Course Discord server for Q&A
- **Office Hours**: Tuesday & Thursday 14:00-16:00
- **GitHub Issues**: Report problems in lab repo

### 🔍 Additional Study Materials
- **Books**: 
  - "Software Architecture in Practice" (Bass, Clements, Kazman)
  - "Building Microservices" (Sam Newman)
- **Online Courses**:
  - Docker Tutorial (YouTube)
  - Node.js Best Practices (GitHub)
- **Blogs**:
  - Martin Fowler's Blog
  - Microsoft Azure Architecture Center

---

## ✅ Success Criteria

### By the end of this course, you should be able to:

1. **Design** software architecture for medium-scale applications
2. **Implement** different architectural styles (Monolithic → Microservices)
3. **Evaluate** trade-offs between architectural approaches
4. **Use** modern development tools (Docker, Git, APIs)
5. **Document** architecture decisions clearly
6. **Work** effectively in a development team
7. **Present** technical solutions to stakeholders

---

## 🎯 Tips for Success

### 💡 Do's
- ✅ **Start Early**: Don't wait until deadline
- ✅ **Commit Often**: Git commit after each feature
- ✅ **Ask Questions**: No question is stupid
- ✅ **Test Your Code**: Don't assume it works
- ✅ **Read Documentation**: Before asking for help
- ✅ **Collaborate**: Learn from classmates
- ✅ **Take Notes**: Document problems and solutions

### ❌ Don'ts
- ❌ **Copy-Paste Blindly**: Understand the code
- ❌ **Skip Weeks**: Each week builds on previous
- ❌ **Ignore Errors**: Fix them immediately
- ❌ **Work Alone**: Use team and resources
- ❌ **Leave Everything to Last Week**: Impossible to catch up

---

## 📞 Contact Information

**อาจารย์ผู้สอน:**
- **ชื่อ**: นายธนิต เกตุแก้ว
- **Email**: thanit@example.com
- **Office**: Computer Engineering Building, Room 405
- **Office Hours**: Tuesday & Thursday 14:00-16:00

**TA (ผู้ช่วยสอน):**
- TBA

**Course Resources:**
- **LMS**: https://lms.rmutl.ac.th
- **GitHub**: https://github.com/rmutl-engse207
- **Discord**: [Invite Link]

---

## 🚀 Ready to Start?

### Next Steps:
1. ✅ อ่าน Timeline นี้ให้เข้าใจ
2. ✅ เตรียม Laptop/Desktop สำหรับพัฒนา
3. ✅ Install WSL2/Ubuntu (หรือใช้ Ubuntu VM)
4. ✅ Join Discord server
5. ✅ Clone starter code repository
6. ✅ มา Lab Week 3 พร้อม!

---

## 📅 Important Dates

| Date | Event |
|------|-------|
| Week 3 | Lab Start - Monolithic |
| Week 4 | Lab 2 - Layered |
| Week 5 | Lab 3 - Client-Server |
| Week 8 | Midterm Exam |
| Week 10 | Final Project Starts |
| Week 13 | Final Project Due |
| Week 14 | Presentations |
| Week 16 | Final Exam |

---

## 🎓 Course Learning Outcomes (CLO) Mapping

| Week | CLO Covered | Assessment |
|------|-------------|------------|
| 3 | CLO1, CLO2 | Lab 1 |
| 4 | CLO2, CLO6 | Lab 2 |
| 5 | CLO2, CLO6 | Lab 3 |
| 6 | CLO4, CLO6 | Lab 4 |
| 7 | CLO2, CLO6 | Lab 5 |
| 8-9 | CLO2, CLO6, CLO7 | Lab 6 |
| 8 | CLO1-7 | Midterm |
| 10-13 | CLO5-14 | Final Project |
| 14 | CLO11, CLO12 | Presentation |
| 16 | CLO1-7 | Final Exam |

---

## 🌟 Final Thoughts

**การเรียนรู้ Software Architecture เป็นการเดินทางที่ยาวนาน**

คุณจะได้เห็นว่าระบบซอฟต์แวร์เดียวกันสามารถออกแบบได้หลากหลายรูปแบบ แต่ละแบบมีข้อดีข้อเสียที่แตกต่างกัน การเป็น Software Architect ที่ดีคือการรู้ว่าเมื่อไหร่ควรใช้รูปแบบไหน

**เริ่มกันเลย! สู้ๆ นะครับ! 💪**

---

*Document Version: 1.0*  
*Last Updated: 2025-12-15*  
*Course: ENGCE301 Software Design and Development*  
*Instructor: นายธนิต เกตุแก้ว*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
