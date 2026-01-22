# 🏗️ คู่มือปฏิบัติการ ENGSE207 - สัปดาห์ที่ 6
## N-Tier Architecture: Multi-Tier on Single VM (Version 1)

**สัปดาห์:** 6 | **ระยะเวลา:** 4 ชั่วโมง | **ระดับความยาก:** ⭐⭐⭐⭐

---

## 📋 สารบัญ

1. [วัตถุประสงค์การเรียนรู้](#วัตถุประสงค์การเรียนรู้)
2. [สิ่งที่ต้องเตรียม](#สิ่งที่ต้องเตรียม)
3. [ภาพรวมสถาปัตยกรรม](#ภาพรวมสถาปัตยกรรม)
4. [ส่วนที่ 1: ทำความเข้าใจ N-Tier (30 นาที)](#ส่วนที่-1-ทำความเข้าใจ-n-tier)
5. [ส่วนที่ 2: ออกแบบ Architecture - C4 Model (30 นาที)](#ส่วนที่-2-ออกแบบ-architecture)
6. [ส่วนที่ 3: ติดตั้ง PostgreSQL และ Nginx (40 นาที)](#ส่วนที่-3-ติดตั้ง-postgresql-และ-nginx)
7. [ส่วนที่ 4: สร้าง Backend API (60 นาที)](#ส่วนที่-4-สร้าง-backend-api)
8. [ส่วนที่ 5: สร้าง Frontend (40 นาที)](#ส่วนที่-5-สร้าง-frontend)
9. [ส่วนที่ 6: ตั้งค่า Nginx Reverse Proxy และ HTTPS (30 นาที)](#ส่วนที่-6-ตั้งค่า-nginx)
10. [ส่วนที่ 7: Testing และ Verification (20 นาที)](#ส่วนที่-7-testing-และ-verification)
11. [ส่วนที่ 8: การวิเคราะห์และเปรียบเทียบ (40 นาที)](#ส่วนที่-8-การวิเคราะห์และเปรียบเทียบ) ⭐ **ต้องทำเอง**
12. [การส่งงานและเกณฑ์การให้คะแนน](#การส่งงานและเกณฑ์การให้คะแนน)
13. [การบ้าน: Multi-VM Version](#การบ้าน-multi-vm-version)
14. [แก้ปัญหาเบื้องต้น](#แก้ปัญหาเบื้องต้น)

---

## 🎯 วัตถุประสงค์การเรียนรู้

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:

✅ อธิบายความแตกต่างระหว่าง Tier (Physical) กับ Layer (Logical) ได้  
✅ ติดตั้งและตั้งค่า N-Tier Architecture บน Single VM ได้  
✅ ใช้งาน Nginx เป็น Reverse Proxy และ SSL Termination ได้  
✅ Migrate ฐานข้อมูลจาก SQLite เป็น PostgreSQL ได้  
✅ สร้าง Self-signed SSL Certificate สำหรับ HTTPS ได้  
✅ วาด C4 Diagrams (C1, C2) สำหรับ N-Tier Architecture ได้  
✅ **วิเคราะห์และเปรียบเทียบ 4 Architectures (Week 3-6) ได้** ⭐

---

## 📚 สิ่งที่ต้องเตรียม

### ต้องมีก่อนเริ่ม Lab:

✅ **สัปดาห์ที่ 5 Client-Server App** - ทำสำเร็จและทำงานได้  
✅ **Ubuntu VM** - จากสัปดาห์ที่ 5 (หรือ WSL2/Ubuntu Desktop)  
✅ **Node.js 20+** - ติดตั้งแล้ว  
✅ **Git** - สำหรับ version control  
✅ **VS Code** - พร้อม Remote-SSH extension

### สร้างโปรเจกต์ใหม่:

```bash
# สร้างโฟลเดอร์ใหม่
mkdir -p ~/engse207-labs/week6-ntier
cd ~/engse207-labs/week6-ntier

# สร้างโครงสร้างโฟลเดอร์
mkdir -p src/{config,controllers,services,repositories,models,middleware,routes}
mkdir -p public/{css,js}
mkdir -p database
mkdir -p nginx
mkdir -p scripts
mkdir -p docs

# เริ่มต้น Git
git init
```

---

## 📚 ทบทวน Phase 1: สิ่งที่เราทำมาแล้ว

### Week 3: Monolithic Architecture
```
┌──────────────────────────────────────┐
│         Monolithic App               │
│  ┌──────────────────────────────┐    │
│  │   Frontend (HTML/CSS/JS)     │    │
│  ├──────────────────────────────┤    │
│  │   Backend (Node.js/Express)  │    │
│  ├──────────────────────────────┤    │
│  │   Database (SQLite)          │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
            Single Process
```

### Week 4: Layered Architecture
```
┌─────────────────────────────────────────┐
│  Presentation Layer (Routes/Controllers)│
├─────────────────────────────────────────┤
│  Business Logic Layer (Services)        │
├─────────────────────────────────────────┤
│  Data Access Layer (Repositories)       │
└─────────────────────────────────────────┘
                   │
                   ▼
             ┌──────────┐
             │  SQLite  │
             └──────────┘
        Still Single Process!
```

### Week 5: Client-Server Architecture
```
┌─────────────┐           ┌─────────────┐
│   Client    │  HTTP/    │   Server    │
│ (Browser)   │◄─────────►│ (Node.js)   │
│  Frontend   │   REST    │  Backend    │
└─────────────┘           └─────────────┘
                                │
                                ▼
                          ┌──────────┐
                          │  SQLite  │
                          └──────────┘
                       Separate Processes!
```

---

## 🏗️ ภาพรวมสถาปัตยกรรม

### ความแตกต่างระหว่าง Tier vs Layer

```
┌──────────────────────────────────────────────────────────────────────┐
│                         TIER vs LAYER                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   LAYER (Logical Separation)         TIER (Physical Separation)      │
│   ───────────────────────────        ─────────────────────────────   │
│                                                                      │
│   • แยกตาม Responsibility            • แยกตาม Physical Location      │
│   • รันใน Process เดียวกันได้            • รันคนละ Process/Machine        │
│   • Compile-time separation          • Runtime separation            │
│   • เช่น MVC, 3-Layer                 • เช่น Web Server, App Server    │
│                                                                      │
│       Week 4:                                  Week 6:               │
│   ┌──────────────┐                   ┌─────┐   ┌─────┐   ┌─────┐     │
│   │ Controller   │                   │Nginx│ → │Node │ → │ DB  │     │
│   │ Service      │  = 1 Process      │     │   │     │   │     │     │
│   │ Repository   │                   │Port │   │Port │   │Port │     │
│   └──────────────┘                   │ 443 │   │3000 │   │5432 │     │
│                                      └─────┘   └─────┘   └─────┘     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### สถาปัตยกรรม Week 6 - N-Tier (Single VM):

```
┌─────────────────────────────────────────────────────────────────┐
│  เครื่อง Local (Host Machine)                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Browser (Client)                                         │  │
│  │  - เข้าผ่าน https://taskboard.local                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (Port 443)
                              ▼
╔═════════════════════════════════════════════════════════════════╗
║                  Ubuntu VM - 3 Tiers                            ║
║  ┌───────────────────────────────────────────────────────────┐  ║
║  │  🌐 TIER 1: Nginx (Web Server)                            │  ║
║  │  • Port 80 → Redirect to 443                              │  ║
║  │  • Port 443 → HTTPS with SSL                              │  ║
║  │  • SSL Termination                                        │  ║
║  │  • Serve Static Files (HTML, CSS, JS)                     │  ║
║  │  • Reverse Proxy /api/* → localhost:3000                  │  ║
║  └─────────────────────────┬─────────────────────────────────┘  ║
║                            │ HTTP (localhost:3000)              ║
║                            ▼                                    ║
║  ┌───────────────────────────────────────────────────────────┐  ║
║  │  ⚙️ TIER 2: Node.js + Express (Application Server)        │  ║
║  │  • Port 3000 (internal only)                              │  ║
║  │  • REST API Endpoints                                     │  ║
║  │  • Business Logic (Layered Architecture)                  │  ║
║  │  │  ├── Controllers (Presentation)                        │  ║
║  │  │  ├── Services (Business Logic)                         │  ║
║  │  │  └── Repositories (Data Access)                        │  ║
║  │  • Managed by PM2                                         │  ║
║  └─────────────────────────┬─────────────────────────────────┘  ║
║                            │ TCP (localhost:5432)               ║
║                            ▼                                    ║
║  ┌───────────────────────────────────────────────────────────┐  ║
║  │  🗄️ TIER 3: PostgreSQL (Database Server)                  │  ║
║  │  • Port 5432 (internal only)                              │  ║
║  │  • tasks table                                            │  ║
║  │  • ACID Transactions                                      │  ║
║  │  • Connection Pooling                                     │  ║
║  └───────────────────────────────────────────────────────────┘  ║
╚═════════════════════════════════════════════════════════════════╝
```

### โครงสร้างโปรเจกต์:

```
week6-ntier/
├── server.js                      # Application entry point
├── package.json                   # Dependencies
├── .env                           # Environment variables
├── .env.example                   # Template
├── .gitignore
├── README.md
│
├── src/
│   ├── config/
│   │   └── database.js            # PostgreSQL connection
│   │
│   ├── models/
│   │   └── Task.js                # Task model
│   │
│   ├── repositories/
│   │   └── taskRepository.js      # Data Access Layer
│   │
│   ├── services/
│   │   └── taskService.js         # Business Logic Layer
│   │
│   ├── controllers/
│   │   └── taskController.js      # Presentation Layer
│   │
│   ├── routes/
│   │   └── taskRoutes.js          # API Routes
│   │
│   └── middleware/
│       ├── errorHandler.js        # Error handling
│       └── validator.js           # Input validation
│
├── public/
│   ├── index.html                 # Main HTML
│   ├── css/
│   │   └── style.css              # Styles
│   └── js/
│       └── app.js                 # Frontend JavaScript
│
├── database/
│   └── init.sql                   # PostgreSQL schema
│
├── nginx/
│   └── taskboard.conf             # Nginx configuration
│
├── scripts/
│   ├── setup.sh                   # Full setup script
│   ├── start-all.sh               # Start all services
│   └── test-api.sh                # API tests
│
└── docs/
    ├── ANALYSIS.md                # Analysis (student work)
    └── ARCHITECTURE.md            # Architecture documentation
```

---

## ส่วนที่ 1: ทำความเข้าใจ N-Tier (30 นาที)

### 1.1 N-Tier Architecture คืออะไร?

**❌ ปัญหาที่พบใน Week 3-5:**

| ปัญหา | ผลกระทบ |
|-------|---------|
| **SQLite ไม่รองรับ Concurrent Write** | ใช้งานพร้อมกันหลายคนไม่ได้ |
| **ไม่มี HTTPS** | ข้อมูลไม่ปลอดภัย, ถูก Sniff ได้ |
| **Node.js รับ Request โดยตรง** | ไม่มี Load Balancing, Static File Serving ช้า |
| **Scale ยาก** | ต้อง Scale ทั้งระบบ ไม่สามารถแยก Scale ได้ |


**N-Tier Architecture** คือการแบ่งระบบออกเป็น **Physical Tiers** (ชั้นทางกายภาพ) ที่แยกจากกัน

| Tier | Component | หน้าที่ |
|------|-----------|--------|
| **Tier 1** | Web Server (Nginx) | รับ request, SSL, static files |
| **Tier 2** | App Server (Node.js) | Business logic, API |
| **Tier 3** | Database (PostgreSQL) | Data storage |

**รูปแบบที่นิยม:**

| Tiers | โครงสร้าง | ตัวอย่างการใช้งาน |
|-------|----------|-------------------|
| **2-Tier** | Client → Database | Desktop App + SQL Server |
| **3-Tier** | Client → App Server → Database | Web App ทั่วไป |
| **4-Tier** | Client → Web Server → App Server → Database | Enterprise Apps |
| **N-Tier** | หลาย Tier ตามความต้องการ | Microservices |

### 1.2 ข้อดีของ N-Tier Architecture

**✅ ข้อดี:**

| ข้อดี | คำอธิบาย |
|-------|---------|
| **Scalability** | Scale แต่ละ Tier อิสระ (เพิ่ม App Server โดยไม่ต้องเพิ่ม DB) |
| **Security** | แยก Network Zones, Database ไม่ถูกเข้าถึงโดยตรง |
| **Maintainability** | แก้ไข/Update แต่ละ Tier แยกกัน |
| **Performance** | Nginx จัดการ Static Files, Load Balance, Caching |
| **Reliability** | ถ้า App Server ล่ม 1 ตัว ยังมีตัวอื่น |

**❌ ข้อเสีย:**

| ข้อเสีย | คำอธิบาย |
|--------|---------|
| **Complexity** | ซับซ้อนขึ้น, ต้องจัดการหลาย Components |
| **Network Latency** | มี Hop ระหว่าง Tiers |
| **Cost** | ต้องใช้ Resources มากขึ้น |
| **Debugging** | ตามหาปัญหายากขึ้น |

---

---

## ส่วนที่ 2: ออกแบบ Architecture (30 นาที)

### 2.1 Requirements สำหรับ Week 6

**Functional Requirements:**
- ✅ CRUD Tasks (Create, Read, Update, Delete)
- ✅ Task มี status: TODO, IN_PROGRESS, DONE
- ✅ ดู Task ทั้งหมดแบบ Real-time

**Non-Functional Requirements (เพิ่มเติมจาก Week 5):**
- ✅ **Security:** HTTPS (SSL/TLS)
- ✅ **Performance:** Static files served by Nginx
- ✅ **Reliability:** Production-grade Database (PostgreSQL)
- ✅ **Maintainability:** แยก Concerns ชัดเจน

**Technical Constraints:**
- ✅ ทำงานบน Single VM (Ubuntu 22.04/24.04)
- ✅ ใช้ Nginx เป็น Reverse Proxy
- ✅ ใช้ PostgreSQL แทน SQLite
- ✅ รองรับ HTTPS (Self-signed Certificate)

### 2.2 C4 Level 1: System Context Diagram

```
                        ┌─────────────────┐
                        │                 │
                        │   👤 User       │
                        │   (Developer)   │
                        │                 │
                        └────────┬────────┘
                                 │
                                 │ Uses (HTTPS)
                                 ▼
                ┌────────────────────────────────┐
                │                                │
                │    📋 Task Board System        │
                │    [Software System]           │
                │                                │
                │    จัดการ Tasks สำหรับทีม         │
                │    พัฒนาซอฟต์แวร์                 │
                │                                │
                └────────────────────────────────┘
```

### 2.3 C4 Level 2: Container Diagram

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    Task Board System (N-Tier V1)                      ║
║                           [Single VM]                                 ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║    👤 User                                                            ║
║       │                                                               ║
║       │ HTTPS (443)                                                   ║
║       ▼                                                               ║
║  ┌──────────────────────────────────────────────────────────────────┐ ║
║  │  🌐 Nginx [Web Server]                                           │ ║
║  │  - SSL Termination                                               │ ║
║  │  - Static Files (HTML/CSS/JS)                                    │ ║
║  │  - Reverse Proxy → :3000                                         │ ║
║  └──────────────────────┬───────────────────────────────────────────┘ ║
║                         │ HTTP (localhost:3000)                       ║
║                         ▼                                             ║
║  ┌──────────────────────────────────────────────────────────────────┐ ║
║  │  ⚙️ Backend API [Node.js + Express]                              │ ║
║  │  - REST API Endpoints                                            │ ║
║  │  - Business Logic (Layered)                                      │ ║
║  │  - Validation                                                    │ ║
║  └──────────────────────┬───────────────────────────────────────────┘ ║
║                         │ TCP (localhost:5432)                        ║
║                         ▼                                             ║
║  ┌──────────────────────────────────────────────────────────────────┐ ║
║  │  🗄️ PostgreSQL [Database]                                        │ ║
║  │  - tasks table                                                   │ ║
║  │  - ACID Transactions                                             │ ║
║  └──────────────────────────────────────────────────────────────────┘ ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

**Container Details:**

| Container | Technology | Purpose | Port |
|-----------|------------|---------|------|
| **Nginx** | Nginx 1.24+ | Web Server, Reverse Proxy, SSL | 80, 443 |
| **Backend API** | Node.js 20 + Express.js | REST API, Business Logic | 3000 |
| **PostgreSQL** | PostgreSQL 16 | Production Database | 5432 |

**Communication Protocols:**

| From | To | Protocol | Description |
|------|-----|----------|-------------|
| Browser | Nginx | HTTPS (443) | Encrypted connection |
| Nginx | Backend | HTTP (3000) | Internal proxy |
| Backend | PostgreSQL | TCP (5432) | Database connection |

---

### 2.4 Request Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW DIAGRAM                             │
└──────────────────────────────────────────────────────────────────────────┘

   User Request                                               Response
       │                                                          ▲
       ▼                                                          │
   ┌───────┐                                                  ┌───────┐
   │Browser│                                                  │Browser│
   └───┬───┘                                                  └───▲───┘
       │ 1. HTTPS Request                                         │
       │    GET https://taskboard.local/                          │
       ▼                                                          │ 8
   ┌──────────────────────────────────────────────────────────────┴────┐
   │                           NGINX                                   │
   │                                                                   │
   │  2. SSL Termination (Decrypt HTTPS)                               │
   │                                                                   │
   │  3. Route Decision:                                               │
   │     • /api/* → Proxy to Backend (Port 3000)                       │
   │     • /*     → Serve Static Files                                 │
   │                                                                   │
   │  7. SSL Encryption (Encrypt Response)                             │
   └───────────────────────────────┬───────────────────────────────────┘
                                   │
                                   │ 4. HTTP (if /api/*)
                                   ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │                        BACKEND API                                │
   │                                                                   │
   │  5. Process Request:                                              │
   │     • Parse Request                                               │
   │     • Execute Business Logic                                      │
   │     • Query Database                                              │
   │                                                                   │
   │  6. Return Response (JSON)                                        │
   └───────────────────────────────┬───────────────────────────────────┘
                                   │
                                   │ 5a. SQL Query
                                   ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │                        POSTGRESQL                                 │
   │                                                                   │
   │  5b. Execute Query & Return Results                               │
   │                                                                   │
   └───────────────────────────────────────────────────────────────────┘
```

```
Request Flow: POST /api/tasks (สร้าง Task ใหม่)
═══════════════════════════════════════════════════

   Browser                  Nginx                   Node.js                PostgreSQL
      │                       │                       │                       │
      │  1. HTTPS POST        │                       │                       │
      │  /api/tasks           │                       │                       │
      │──────────────────────>│                       │                       │
      │                       │                       │                       │
      │                       │  2. SSL Decrypt       │                       │
      │                       │  (HTTPS → HTTP)       │                       │
      │                       │                       │                       │
      │                       │  3. Proxy to :3000    │                       │
      │                       │──────────────────────>│                       │
      │                       │                       │                       │
      │                       │                       │  4. Parse Request     │
      │                       │                       │  Validate Input       │
      │                       │                       │                       │
      │                       │                       │  5. Business Logic    │
      │                       │                       │  Check rules          │
      │                       │                       │                       │
      │                       │                       │  6. SQL INSERT        │
      │                       │                       │──────────────────────>│
      │                       │                       │                       │
      │                       │                       │  7. Return new task   │
      │                       │                       │<──────────────────────│
      │                       │                       │                       │
      │                       │  8. JSON Response     │                       │
      │                       │<──────────────────────│                       │
      │                       │                       │                       │
      │  9. SSL Encrypt       │                       │                       │
      │  HTTPS Response       │                       │                       │
      │<──────────────────────│                       │                       │
      │                       │                       │                       │
```

---

## ส่วนที่ 3: ติดตั้ง PostgreSQL และ Nginx (40 นาที)

### 3.1 ติดตั้ง PostgreSQL

```bash
# SSH เข้า VM
ssh devlab@VM_IP

# อัพเดท packages
sudo apt update && sudo apt upgrade -y

# ติดตั้ง PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# ตรวจสอบ version และ status
psql --version
sudo systemctl status postgresql
sudo systemctl enable postgresql
```

### 3.2 สร้าง Database และ User

```bash
# เข้า PostgreSQL shell
sudo -u postgres psql
```

**ใน psql shell:**
```sql
-- สร้าง user
CREATE USER taskboard WITH PASSWORD 'taskboard123';

-- สร้าง database
CREATE DATABASE taskboard_db OWNER taskboard;

-- ให้สิทธิ์
GRANT ALL PRIVILEGES ON DATABASE taskboard_db TO taskboard;

-- ออก
\q
```

### 3.3 สร้าง Database Schema

**สร้างไฟล์ `database/init.sql`:**

```sql
-- database/init.sql
-- Task Board PostgreSQL Schema

-- Drop existing table
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_status CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    CONSTRAINT chk_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT chk_title_length CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 200)
);

-- Create indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert sample data
INSERT INTO tasks (title, description, status, priority) VALUES
('Setup PostgreSQL', 'Install and configure PostgreSQL database', 'DONE', 'HIGH'),
('Configure Nginx', 'Setup Nginx as reverse proxy with SSL', 'DONE', 'HIGH'),
('Create Backend API', 'Implement REST API with Express.js', 'IN_PROGRESS', 'HIGH'),
('Build Frontend', 'Create Task Board UI', 'IN_PROGRESS', 'MEDIUM'),
('Test HTTPS', 'Verify SSL certificate works', 'TODO', 'MEDIUM'),
('Write Documentation', 'Complete ANALYSIS.md', 'TODO', 'LOW'),
('Deploy to Production', 'Final deployment and testing', 'TODO', 'HIGH');

-- Verify
SELECT * FROM tasks ORDER BY id;
```

**รัน SQL script:**
```bash
PGPASSWORD=taskboard123 psql -h localhost -U taskboard -d taskboard_db -f database/init.sql
```

### 3.4 ติดตั้ง Nginx

```bash
# ติดตั้ง Nginx
sudo apt install -y nginx

# ตรวจสอบ
nginx -v
sudo systemctl status nginx
sudo systemctl enable nginx
```

### 3.5 สร้าง SSL Certificate (Self-signed)

```bash
# สร้าง directory
sudo mkdir -p /etc/nginx/ssl

# สร้าง certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/taskboard.key \
    -out /etc/nginx/ssl/taskboard.crt \
    -subj "/C=TH/ST=ChiangMai/L=ChiangMai/O=RMUTL/OU=SoftwareEngineering/CN=taskboard.local"

# ตรวจสอบ
sudo ls -la /etc/nginx/ssl/
```

### 3.6 ตั้งค่า Firewall

```bash
# เปิด ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Node.js (สำหรับ debug)

# ตรวจสอบ
sudo ufw status
```

---

## ส่วนที่ 4: สร้าง Backend API (60 นาที)

### 4.1 สร้าง package.json

```bash
cd ~/engse207-labs/week6-ntier
npm init -y
```

**แก้ไข `package.json`:**

```json
{
  "name": "week6-ntier",
  "version": "1.0.0",
  "description": "ENGSE207 Week 6 - N-Tier Architecture Task Board",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "bash scripts/test-api.sh"
  },
  "keywords": ["n-tier", "architecture", "nodejs", "postgresql", "nginx"],
  "author": "ENGSE207 Student",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "morgan": "^1.10.0",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

**ติดตั้ง dependencies:**
```bash
npm install
```

### 4.2 สร้าง Environment Variables

**สร้างไฟล์ `.env`:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskboard_db
DB_USER=taskboard
DB_PASSWORD=taskboard123

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=https://taskboard.local
```

**สร้างไฟล์ `.env.example`:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskboard_db
DB_USER=taskboard
DB_PASSWORD=your_password_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=https://taskboard.local
```

### 4.3 สร้าง Database Connection

**สร้างไฟล์ `src/config/database.js`:**

```javascript
// src/config/database.js
// PostgreSQL Database Connection with Connection Pooling

const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'taskboard_db',
    user: process.env.DB_USER || 'taskboard',
    password: process.env.DB_PASSWORD || 'taskboard123',
    
    // Pool settings
    max: 10,                      // Maximum connections in pool
    idleTimeoutMillis: 30000,     // Close idle connections after 30s
    connectionTimeoutMillis: 5000  // Timeout after 5s
});

// Connection events
pool.on('connect', (client) => {
    console.log('✅ New client connected to PostgreSQL');
});

pool.on('error', (err, client) => {
    console.error('❌ PostgreSQL pool error:', err.message);
});

// Query helper with logging
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`📊 Query executed: ${duration}ms | Rows: ${result.rowCount}`);
        return result;
    } catch (error) {
        console.error('❌ Query error:', error.message);
        throw error;
    }
};

// Health check
const healthCheck = async () => {
    try {
        const result = await pool.query('SELECT NOW() as time, current_database() as database');
        return {
            status: 'healthy',
            database: result.rows[0].database,
            timestamp: result.rows[0].time,
            poolSize: pool.totalCount,
            idleCount: pool.idleCount,
            waitingCount: pool.waitingCount
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message
        };
    }
};

// Graceful shutdown
const closePool = async () => {
    console.log('🔄 Closing database pool...');
    await pool.end();
    console.log('✅ Database pool closed');
};

module.exports = {
    pool,
    query,
    healthCheck,
    closePool
};
```

### 4.4 สร้าง Task Model

**สร้างไฟล์ `src/models/Task.js`:**

```javascript
// src/models/Task.js
// Task Data Model with Validation

class Task {
    constructor(data) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.status = data.status || 'TODO';
        this.priority = data.priority || 'MEDIUM';
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Valid status values
    static VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
    
    // Valid priority values
    static VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

    // Status transitions (finite state machine)
    static STATUS_TRANSITIONS = {
        'TODO': ['IN_PROGRESS'],
        'IN_PROGRESS': ['TODO', 'DONE'],
        'DONE': ['IN_PROGRESS']
    };

    // Validate the task
    validate() {
        const errors = [];

        // Title validation
        if (!this.title || typeof this.title !== 'string') {
            errors.push('Title is required');
        } else if (this.title.trim().length < 3) {
            errors.push('Title must be at least 3 characters');
        } else if (this.title.trim().length > 200) {
            errors.push('Title must be less than 200 characters');
        }

        // Status validation
        if (!Task.VALID_STATUSES.includes(this.status)) {
            errors.push(`Status must be one of: ${Task.VALID_STATUSES.join(', ')}`);
        }

        // Priority validation
        if (!Task.VALID_PRIORITIES.includes(this.priority)) {
            errors.push(`Priority must be one of: ${Task.VALID_PRIORITIES.join(', ')}`);
        }

        // Business rule: HIGH priority tasks should have description
        if (this.priority === 'HIGH' && (!this.description || this.description.trim() === '')) {
            errors.push('HIGH priority tasks should have a description');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Check if status transition is valid
    canTransitionTo(newStatus) {
        if (!Task.VALID_STATUSES.includes(newStatus)) {
            return false;
        }
        const allowedTransitions = Task.STATUS_TRANSITIONS[this.status] || [];
        return allowedTransitions.includes(newStatus);
    }

    // Get next possible statuses
    getNextStatuses() {
        return Task.STATUS_TRANSITIONS[this.status] || [];
    }

    // Convert to plain object
    toJSON() {
        return {
            id: this.id,
            title: this.title.trim(),
            description: this.description ? this.description.trim() : '',
            status: this.status,
            priority: this.priority,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    // Create from database row
    static fromDatabase(row) {
        return new Task({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            priority: row.priority,
            created_at: row.created_at,
            updated_at: row.updated_at
        });
    }
}

module.exports = Task;
```

### 4.5 สร้าง Task Repository (Data Access Layer)

**สร้างไฟล์ `src/repositories/taskRepository.js`:**

```javascript
// src/repositories/taskRepository.js
// Data Access Layer - PostgreSQL Operations

const { query } = require('../config/database');
const Task = require('../models/Task');

class TaskRepository {
    
    // Get all tasks with optional filtering
    async findAll(filters = {}) {
        let sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks
        `;
        const params = [];
        const conditions = [];

        // Filter by status
        if (filters.status) {
            conditions.push(`status = $${params.length + 1}`);
            params.push(filters.status);
        }

        // Filter by priority
        if (filters.priority) {
            conditions.push(`priority = $${params.length + 1}`);
            params.push(filters.priority);
        }

        // Add WHERE clause if conditions exist
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Order by priority (HIGH first) then by created_at
        sql += `
            ORDER BY 
                CASE priority 
                    WHEN 'HIGH' THEN 1 
                    WHEN 'MEDIUM' THEN 2 
                    WHEN 'LOW' THEN 3 
                END,
                created_at DESC
        `;

        const result = await query(sql, params);
        return result.rows.map(row => Task.fromDatabase(row));
    }

    // Get task by ID
    async findById(id) {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            WHERE id = $1
        `;
        const result = await query(sql, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return Task.fromDatabase(result.rows[0]);
    }

    // Get tasks by status
    async findByStatus(status) {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            WHERE status = $1
            ORDER BY 
                CASE priority 
                    WHEN 'HIGH' THEN 1 
                    WHEN 'MEDIUM' THEN 2 
                    WHEN 'LOW' THEN 3 
                END,
                created_at DESC
        `;
        const result = await query(sql, [status]);
        return result.rows.map(row => Task.fromDatabase(row));
    }

    // Create new task
    async create(taskData) {
        const sql = `
            INSERT INTO tasks (title, description, status, priority) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, description, status, priority, created_at, updated_at
        `;
        const params = [
            taskData.title.trim(),
            taskData.description ? taskData.description.trim() : '',
            taskData.status || 'TODO',
            taskData.priority || 'MEDIUM'
        ];
        
        const result = await query(sql, params);
        return Task.fromDatabase(result.rows[0]);
    }

    // Update task
    async update(id, taskData) {
        // Build dynamic update query
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (taskData.title !== undefined) {
            updates.push(`title = $${paramIndex++}`);
            params.push(taskData.title.trim());
        }
        if (taskData.description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            params.push(taskData.description ? taskData.description.trim() : '');
        }
        if (taskData.status !== undefined) {
            updates.push(`status = $${paramIndex++}`);
            params.push(taskData.status);
        }
        if (taskData.priority !== undefined) {
            updates.push(`priority = $${paramIndex++}`);
            params.push(taskData.priority);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        params.push(id);
        const sql = `
            UPDATE tasks 
            SET ${updates.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING id, title, description, status, priority, created_at, updated_at
        `;

        const result = await query(sql, params);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return Task.fromDatabase(result.rows[0]);
    }

    // Update status only
    async updateStatus(id, status) {
        const sql = `
            UPDATE tasks 
            SET status = $1 
            WHERE id = $2 
            RETURNING id, title, description, status, priority, created_at, updated_at
        `;
        const result = await query(sql, [status, id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return Task.fromDatabase(result.rows[0]);
    }

    // Delete task
    async delete(id) {
        const sql = 'DELETE FROM tasks WHERE id = $1 RETURNING id';
        const result = await query(sql, [id]);
        return result.rowCount > 0;
    }

    // Get statistics
    async getStatistics() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'TODO') as todo,
                COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
                COUNT(*) FILTER (WHERE status = 'DONE') as done,
                COUNT(*) FILTER (WHERE priority = 'HIGH') as high_priority,
                COUNT(*) FILTER (WHERE priority = 'MEDIUM') as medium_priority,
                COUNT(*) FILTER (WHERE priority = 'LOW') as low_priority
            FROM tasks
        `;
        const result = await query(sql);
        return result.rows[0];
    }
}

module.exports = new TaskRepository();
```

### 4.6 สร้าง Task Service (Business Logic Layer)

**สร้างไฟล์ `src/services/taskService.js`:**

```javascript
// src/services/taskService.js
// Business Logic Layer

const taskRepository = require('../repositories/taskRepository');
const Task = require('../models/Task');

class TaskService {
    
    // Get all tasks
    async getAllTasks(filters = {}) {
        return await taskRepository.findAll(filters);
    }

    // Get task by ID
    async getTaskById(id) {
        const task = await taskRepository.findById(id);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        return task;
    }

    // Get tasks by status
    async getTasksByStatus(status) {
        if (!Task.VALID_STATUSES.includes(status)) {
            const error = new Error(`Invalid status. Must be one of: ${Task.VALID_STATUSES.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }
        return await taskRepository.findByStatus(status);
    }

    // Create new task
    async createTask(taskData) {
        const task = new Task(taskData);
        
        // Validate
        const validation = task.validate();
        if (!validation.valid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        return await taskRepository.create(task.toJSON());
    }

    // Update task
    async updateTask(id, taskData) {
        // Check if task exists
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Create updated task for validation
        const updatedData = {
            ...existingTask.toJSON(),
            ...taskData
        };
        const task = new Task(updatedData);

        // Validate
        const validation = task.validate();
        if (!validation.valid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        // Check status transition if status is being changed
        if (taskData.status && taskData.status !== existingTask.status) {
            if (!existingTask.canTransitionTo(taskData.status)) {
                const error = new Error(
                    `Invalid status transition from ${existingTask.status} to ${taskData.status}. ` +
                    `Allowed: ${existingTask.getNextStatuses().join(', ') || 'none'}`
                );
                error.statusCode = 400;
                throw error;
            }
        }

        return await taskRepository.update(id, taskData);
    }

    // Update status only
    async updateTaskStatus(id, status) {
        // Check if task exists
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Validate status
        if (!Task.VALID_STATUSES.includes(status)) {
            const error = new Error(`Invalid status. Must be one of: ${Task.VALID_STATUSES.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }

        // Check transition
        if (!existingTask.canTransitionTo(status)) {
            const error = new Error(
                `Invalid status transition from ${existingTask.status} to ${status}. ` +
                `Allowed: ${existingTask.getNextStatuses().join(', ') || 'none'}`
            );
            error.statusCode = 400;
            throw error;
        }

        return await taskRepository.updateStatus(id, status);
    }

    // Move to next status
    async moveToNextStatus(id) {
        const task = await taskRepository.findById(id);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        const nextStatuses = task.getNextStatuses();
        if (nextStatuses.length === 0) {
            const error = new Error(`Task is already at final status: ${task.status}`);
            error.statusCode = 400;
            throw error;
        }

        // Move to first available next status
        const nextStatus = nextStatuses[0];
        return await taskRepository.updateStatus(id, nextStatus);
    }

    // Delete task
    async deleteTask(id) {
        // Check if task exists
        const task = await taskRepository.findById(id);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Business rule: Cannot delete IN_PROGRESS tasks
        if (task.status === 'IN_PROGRESS') {
            const error = new Error('Cannot delete task that is IN_PROGRESS. Move to TODO or DONE first.');
            error.statusCode = 400;
            throw error;
        }

        const deleted = await taskRepository.delete(id);
        return deleted;
    }

    // Get statistics
    async getStatistics() {
        return await taskRepository.getStatistics();
    }
}

module.exports = new TaskService();
```

### 4.7 สร้าง Task Controller (Presentation Layer)

**สร้างไฟล์ `src/controllers/taskController.js`:**

```javascript
// src/controllers/taskController.js
// Presentation Layer - HTTP Request Handlers

const taskService = require('../services/taskService');

class TaskController {
    
    // GET /api/tasks
    async getAllTasks(req, res, next) {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.priority) filters.priority = req.query.priority;

            const tasks = await taskService.getAllTasks(filters);
            
            res.json({
                success: true,
                count: tasks.length,
                data: tasks.map(t => t.toJSON())
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tasks/stats
    async getStatistics(req, res, next) {
        try {
            const stats = await taskService.getStatistics();
            
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tasks/:id
    async getTaskById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid task ID'
                });
            }

            const task = await taskService.getTaskById(id);
            
            res.json({
                success: true,
                data: task.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tasks
    async createTask(req, res, next) {
        try {
            const taskData = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                priority: req.body.priority
            };

            const task = await taskService.createTask(taskData);
            
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/tasks/:id
    async updateTask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid task ID'
                });
            }

            const taskData = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                priority: req.body.priority
            };

            // Remove undefined values
            Object.keys(taskData).forEach(key => {
                if (taskData[key] === undefined) {
                    delete taskData[key];
                }
            });

            const task = await taskService.updateTask(id, taskData);
            
            res.json({
                success: true,
                message: 'Task updated successfully',
                data: task.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/tasks/:id/status
    async updateTaskStatus(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid task ID'
                });
            }

            const { status } = req.body;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'Status is required'
                });
            }

            const task = await taskService.updateTaskStatus(id, status);
            
            res.json({
                success: true,
                message: `Task status updated to ${status}`,
                data: task.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/tasks/:id/next
    async moveToNextStatus(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid task ID'
                });
            }

            const task = await taskService.moveToNextStatus(id);
            
            res.json({
                success: true,
                message: `Task moved to ${task.status}`,
                data: task.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/tasks/:id
    async deleteTask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid task ID'
                });
            }

            await taskService.deleteTask(id);
            
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
```

### 4.8 สร้าง Routes

**สร้างไฟล์ `src/routes/taskRoutes.js`:**

```javascript
// src/routes/taskRoutes.js
// API Route Definitions

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task routes
router.get('/tasks', (req, res, next) => taskController.getAllTasks(req, res, next));
router.get('/tasks/stats', (req, res, next) => taskController.getStatistics(req, res, next));
router.get('/tasks/:id', (req, res, next) => taskController.getTaskById(req, res, next));
router.post('/tasks', (req, res, next) => taskController.createTask(req, res, next));
router.put('/tasks/:id', (req, res, next) => taskController.updateTask(req, res, next));
router.patch('/tasks/:id/status', (req, res, next) => taskController.updateTaskStatus(req, res, next));
router.patch('/tasks/:id/next', (req, res, next) => taskController.moveToNextStatus(req, res, next));
router.delete('/tasks/:id', (req, res, next) => taskController.deleteTask(req, res, next));

module.exports = router;
```

### 4.9 สร้าง Middleware

**สร้างไฟล์ `src/middleware/errorHandler.js`:**

```javascript
// src/middleware/errorHandler.js
// Global Error Handler

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // PostgreSQL errors
    if (err.code) {
        switch (err.code) {
            case '23505': // Unique violation
                statusCode = 409;
                message = 'Duplicate entry';
                break;
            case '23503': // Foreign key violation
                statusCode = 400;
                message = 'Invalid reference';
                break;
            case '23502': // Not null violation
                statusCode = 400;
                message = 'Required field missing';
                break;
            case '22P02': // Invalid text representation
                statusCode = 400;
                message = 'Invalid data format';
                break;
            case 'ECONNREFUSED':
                statusCode = 503;
                message = 'Database connection refused';
                break;
        }
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            code: err.code
        })
    });
};

module.exports = errorHandler;
```

**สร้างไฟล์ `src/middleware/validator.js`:**

```javascript
// src/middleware/validator.js
// Request Validation Middleware

const validateTaskCreate = (req, res, next) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Title is required'
        });
    }

    next();
};

const validateTaskUpdate = (req, res, next) => {
    // At least one field should be provided
    const { title, description, status, priority } = req.body;
    
    if (title === undefined && description === undefined && 
        status === undefined && priority === undefined) {
        return res.status(400).json({
            success: false,
            error: 'At least one field is required for update'
        });
    }

    next();
};

module.exports = {
    validateTaskCreate,
    validateTaskUpdate
};
```

### 4.10 สร้าง Main Server

**สร้างไฟล์ `server.js`:**

```javascript
// server.js
// Main Application Entry Point - N-Tier Architecture

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import modules
const taskRoutes = require('./src/routes/taskRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const { healthCheck, closePool } = require('./src/config/database');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================================
// MIDDLEWARE
// ===========================================

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Static files (for development - in production, Nginx serves these)
app.use(express.static(path.join(__dirname, 'public')));

// ===========================================
// ROUTES
// ===========================================

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const dbHealth = await healthCheck();
    const status = dbHealth.status === 'healthy' ? 200 : 503;
    
    res.status(status).json({
        success: dbHealth.status === 'healthy',
        service: 'Task Board API',
        version: '1.0.0',
        architecture: 'N-Tier (Week 6)',
        timestamp: new Date().toISOString(),
        database: dbHealth
    });
});

// API routes
app.use('/api', taskRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Error handler
app.use(errorHandler);

// ===========================================
// SERVER START
// ===========================================

const server = app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🏗️  N-TIER ARCHITECTURE - TASK BOARD API');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  📡 Server running on port ${PORT}`);
    console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('  📍 Endpoints:');
    console.log(`     GET    /api/health`);
    console.log(`     GET    /api/tasks`);
    console.log(`     GET    /api/tasks/stats`);
    console.log(`     GET    /api/tasks/:id`);
    console.log(`     POST   /api/tasks`);
    console.log(`     PUT    /api/tasks/:id`);
    console.log(`     PATCH  /api/tasks/:id/status`);
    console.log(`     PATCH  /api/tasks/:id/next`);
    console.log(`     DELETE /api/tasks/:id`);
    console.log('═══════════════════════════════════════════════════════');
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);
    
    server.close(async () => {
        console.log('🔌 HTTP server closed');
        await closePool();
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Forcing shutdown...');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
```

---

## ส่วนที่ 5: สร้าง Frontend (40 นาที)

### 5.1 สร้าง HTML

**สร้างไฟล์ `public/index.html`:**

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Board - N-Tier Architecture</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <h1>📋 Task Board</h1>
                <p class="subtitle">N-Tier Architecture - Week 6</p>
            </div>
            <div class="connection-status" id="connectionStatus">
                <span class="status-dot"></span>
                <span class="status-text">Connecting...</span>
            </div>
        </header>

        <!-- Statistics -->
        <section class="stats-section">
            <div class="stat-card" id="statTotal">
                <span class="stat-number">0</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-card stat-todo" id="statTodo">
                <span class="stat-number">0</span>
                <span class="stat-label">To Do</span>
            </div>
            <div class="stat-card stat-progress" id="statProgress">
                <span class="stat-number">0</span>
                <span class="stat-label">In Progress</span>
            </div>
            <div class="stat-card stat-done" id="statDone">
                <span class="stat-number">0</span>
                <span class="stat-label">Done</span>
            </div>
        </section>

        <!-- Add Task Form -->
        <section class="add-task-section">
            <h2>➕ Add New Task</h2>
            <form id="addTaskForm" class="task-form">
                <div class="form-row">
                    <div class="form-group flex-grow">
                        <label for="taskTitle">Title *</label>
                        <input type="text" id="taskTitle" placeholder="Enter task title..." 
                               required minlength="3" maxlength="200">
                    </div>
                    <div class="form-group">
                        <label for="taskPriority">Priority</label>
                        <select id="taskPriority">
                            <option value="LOW">🟢 Low</option>
                            <option value="MEDIUM" selected>🟡 Medium</option>
                            <option value="HIGH">🔴 High</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="taskDescription">Description</label>
                    <textarea id="taskDescription" placeholder="Enter description (required for HIGH priority)..." rows="2"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                    <span>Create Task</span>
                </button>
            </form>
        </section>

        <!-- Task Board -->
        <section class="board-section">
            <div class="board">
                <!-- TODO Column -->
                <div class="board-column" data-status="TODO">
                    <div class="column-header">
                        <h3>📝 To Do</h3>
                        <span class="task-count" id="countTodo">0</span>
                    </div>
                    <div class="task-list" id="todoTasks">
                        <!-- Tasks will be inserted here -->
                    </div>
                </div>

                <!-- IN_PROGRESS Column -->
                <div class="board-column" data-status="IN_PROGRESS">
                    <div class="column-header">
                        <h3>🔄 In Progress</h3>
                        <span class="task-count" id="countProgress">0</span>
                    </div>
                    <div class="task-list" id="progressTasks">
                        <!-- Tasks will be inserted here -->
                    </div>
                </div>

                <!-- DONE Column -->
                <div class="board-column" data-status="DONE">
                    <div class="column-header">
                        <h3>✅ Done</h3>
                        <span class="task-count" id="countDone">0</span>
                    </div>
                    <div class="task-list" id="doneTasks">
                        <!-- Tasks will be inserted here -->
                    </div>
                </div>
            </div>
        </section>

        <!-- Edit Modal -->
        <div class="modal" id="editModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>✏️ Edit Task</h2>
                    <button class="modal-close" onclick="closeEditModal()">&times;</button>
                </div>
                <form id="editTaskForm">
                    <input type="hidden" id="editTaskId">
                    <div class="form-group">
                        <label for="editTitle">Title *</label>
                        <input type="text" id="editTitle" required minlength="3" maxlength="200">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus">
                                <option value="TODO">📝 To Do</option>
                                <option value="IN_PROGRESS">🔄 In Progress</option>
                                <option value="DONE">✅ Done</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editPriority">Priority</label>
                            <select id="editPriority">
                                <option value="LOW">🟢 Low</option>
                                <option value="MEDIUM">🟡 Medium</option>
                                <option value="HIGH">🔴 High</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editDescription">Description</label>
                        <textarea id="editDescription" rows="3"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Toast Notification -->
        <div class="toast" id="toast">
            <span class="toast-message"></span>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <p>ENGCE301 Software Design and Development - Week 6 N-Tier Architecture</p>
            <p>🗄️ PostgreSQL | ⚙️ Node.js + Express | 🌐 Nginx | 🔒 HTTPS</p>
        </footer>
    </div>

    <script src="/js/app.js"></script>
</body>
</html>
```

### 5.2 สร้าง CSS

**สร้างไฟล์ `public/css/style.css`:**

```css
/* public/css/style.css */
/* Task Board - N-Tier Architecture Styles */

/* ===== Variables ===== */
:root {
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --bg-color: #f3f4f6;
    --card-bg: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
    --shadow: 0 1px 3px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    --radius: 8px;
    --transition: all 0.2s ease;
}

/* ===== Reset & Base ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-primary);
    line-height: 1.6;
}

/* ===== App Container ===== */
.app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

/* ===== Header ===== */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px;
    background: linear-gradient(135deg, var(--primary-color), #7c3aed);
    border-radius: var(--radius);
    color: white;
}

.header h1 {
    font-size: 1.8rem;
}

.header .subtitle {
    opacity: 0.9;
    font-size: 0.9rem;
}

.connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(255,255,255,0.2);
    border-radius: 20px;
    font-size: 0.85rem;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fbbf24;
    animation: pulse 2s infinite;
}

.connection-status.connected .status-dot {
    background: #34d399;
    animation: none;
}

.connection-status.error .status-dot {
    background: #f87171;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* ===== Statistics ===== */
.stats-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

.stat-card {
    background: var(--card-bg);
    padding: 20px;
    border-radius: var(--radius);
    text-align: center;
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary-color);
}

.stat-card.stat-todo { border-left-color: var(--warning-color); }
.stat-card.stat-progress { border-left-color: var(--primary-color); }
.stat-card.stat-done { border-left-color: var(--success-color); }

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-primary);
}

.stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

/* ===== Add Task Form ===== */
.add-task-section {
    background: var(--card-bg);
    padding: 24px;
    border-radius: var(--radius);
    margin-bottom: 24px;
    box-shadow: var(--shadow);
}

.add-task-section h2 {
    margin-bottom: 16px;
    font-size: 1.2rem;
}

.task-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group.flex-grow {
    flex: 1;
}

.form-group label {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 10px 14px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 1rem;
    transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* ===== Buttons ===== */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-hover);
}

.btn-secondary {
    background: var(--bg-color);
    color: var(--text-primary);
}

.btn-secondary:hover {
    background: var(--border-color);
}

.btn-danger {
    background: var(--danger-color);
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}

/* ===== Board ===== */
.board-section {
    margin-bottom: 24px;
}

.board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.board-column {
    background: var(--bg-color);
    border-radius: var(--radius);
    padding: 16px;
    min-height: 400px;
}

.column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border-color);
}

.column-header h3 {
    font-size: 1.1rem;
}

.task-count {
    background: var(--primary-color);
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* ===== Task Card ===== */
.task-card {
    background: var(--card-bg);
    padding: 16px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary-color);
    transition: var(--transition);
}

.task-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.task-card.priority-high { border-left-color: var(--danger-color); }
.task-card.priority-medium { border-left-color: var(--warning-color); }
.task-card.priority-low { border-left-color: var(--success-color); }

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.task-title {
    font-weight: 600;
    font-size: 1rem;
    word-break: break-word;
}

.task-priority {
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
}

.task-priority.high { background: #fee2e2; color: #991b1b; }
.task-priority.medium { background: #fef3c7; color: #92400e; }
.task-priority.low { background: #d1fae5; color: #065f46; }

.task-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 12px;
    word-break: break-word;
}

.task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.task-actions {
    display: flex;
    gap: 8px;
}

.task-actions button {
    padding: 4px 8px;
    font-size: 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition);
}

.task-actions .btn-move {
    background: var(--primary-color);
    color: white;
}

.task-actions .btn-edit {
    background: var(--warning-color);
    color: white;
}

.task-actions .btn-delete {
    background: var(--danger-color);
    color: white;
}

/* ===== Modal ===== */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal.show {
    display: flex;
}

.modal-content {
    background: var(--card-bg);
    padding: 24px;
    border-radius: var(--radius);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-secondary);
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
}

/* ===== Toast ===== */
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background: var(--text-primary);
    color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    transform: translateY(100px);
    opacity: 0;
    transition: var(--transition);
    z-index: 2000;
}

.toast.show {
    transform: translateY(0);
    opacity: 1;
}

.toast.success { background: var(--success-color); }
.toast.error { background: var(--danger-color); }
.toast.warning { background: var(--warning-color); }

/* ===== Footer ===== */
.footer {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.footer p {
    margin-bottom: 4px;
}

/* ===== Loading ===== */
.loading {
    text-align: center;
    padding: 40px;
    color: var(--text-secondary);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
    .board {
        grid-template-columns: 1fr;
    }
    
    .stats-section {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }
    
    .form-row {
        flex-direction: column;
    }
    
    .stats-section {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

### 5.3 สร้าง JavaScript

**สร้างไฟล์ `public/js/app.js`:**

```javascript
// public/js/app.js
// Task Board Frontend - N-Tier Architecture

// ===== Configuration =====
const API_BASE_URL = '/api';  // Relative URL (Nginx proxies to backend)

// ===== State =====
let tasks = [];

// ===== DOM Elements =====
const elements = {
    connectionStatus: document.getElementById('connectionStatus'),
    addTaskForm: document.getElementById('addTaskForm'),
    editModal: document.getElementById('editModal'),
    editTaskForm: document.getElementById('editTaskForm'),
    toast: document.getElementById('toast'),
    
    // Stats
    statTotal: document.getElementById('statTotal'),
    statTodo: document.getElementById('statTodo'),
    statProgress: document.getElementById('statProgress'),
    statDone: document.getElementById('statDone'),
    
    // Task lists
    todoTasks: document.getElementById('todoTasks'),
    progressTasks: document.getElementById('progressTasks'),
    doneTasks: document.getElementById('doneTasks'),
    
    // Counts
    countTodo: document.getElementById('countTodo'),
    countProgress: document.getElementById('countProgress'),
    countDone: document.getElementById('countDone')
};

// ===== API Functions =====
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== Task API =====
const taskAPI = {
    getAll: () => apiRequest('/tasks'),
    getStats: () => apiRequest('/tasks/stats'),
    getById: (id) => apiRequest(`/tasks/${id}`),
    create: (data) => apiRequest('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id, status) => apiRequest(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    moveNext: (id) => apiRequest(`/tasks/${id}/next`, { method: 'PATCH' }),
    delete: (id) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
    healthCheck: () => apiRequest('/health')
};

// ===== UI Functions =====
function showToast(message, type = 'success') {
    elements.toast.querySelector('.toast-message').textContent = message;
    elements.toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        elements.toast.className = 'toast';
    }, 3000);
}

function updateConnectionStatus(connected, message = '') {
    elements.connectionStatus.className = `connection-status ${connected ? 'connected' : 'error'}`;
    elements.connectionStatus.querySelector('.status-text').textContent = 
        connected ? 'Connected' : (message || 'Disconnected');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== Render Functions =====
function renderTask(task) {
    const priorityClass = task.priority.toLowerCase();
    const nextStatuses = getNextStatuses(task.status);
    
    return `
        <div class="task-card priority-${priorityClass}" data-id="${task.id}">
            <div class="task-header">
                <span class="task-title">${escapeHtml(task.title)}</span>
                <span class="task-priority ${priorityClass}">${task.priority}</span>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <span>${formatDate(task.created_at)}</span>
                <div class="task-actions">
                    ${nextStatuses.length > 0 ? 
                        `<button class="btn-move" onclick="moveTask(${task.id})" title="Move to ${nextStatuses[0]}">→</button>` : ''
                    }
                    <button class="btn-edit" onclick="openEditModal(${task.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

function getNextStatuses(currentStatus) {
    const transitions = {
        'TODO': ['IN_PROGRESS'],
        'IN_PROGRESS': ['DONE'],
        'DONE': []
    };
    return transitions[currentStatus] || [];
}

function renderTasks() {
    const todoList = tasks.filter(t => t.status === 'TODO');
    const progressList = tasks.filter(t => t.status === 'IN_PROGRESS');
    const doneList = tasks.filter(t => t.status === 'DONE');
    
    elements.todoTasks.innerHTML = todoList.map(renderTask).join('') || '<p class="loading">No tasks</p>';
    elements.progressTasks.innerHTML = progressList.map(renderTask).join('') || '<p class="loading">No tasks</p>';
    elements.doneTasks.innerHTML = doneList.map(renderTask).join('') || '<p class="loading">No tasks</p>';
    
    // Update counts
    elements.countTodo.textContent = todoList.length;
    elements.countProgress.textContent = progressList.length;
    elements.countDone.textContent = doneList.length;
}

async function updateStats() {
    try {
        const response = await taskAPI.getStats();
        const stats = response.data;
        
        elements.statTotal.querySelector('.stat-number').textContent = stats.total;
        elements.statTodo.querySelector('.stat-number').textContent = stats.todo;
        elements.statProgress.querySelector('.stat-number').textContent = stats.in_progress;
        elements.statDone.querySelector('.stat-number').textContent = stats.done;
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

// ===== Task Actions =====
async function loadTasks() {
    try {
        elements.todoTasks.innerHTML = '<p class="loading">Loading...</p>';
        elements.progressTasks.innerHTML = '<p class="loading">Loading...</p>';
        elements.doneTasks.innerHTML = '<p class="loading">Loading...</p>';
        
        const response = await taskAPI.getAll();
        tasks = response.data;
        renderTasks();
        await updateStats();
        updateConnectionStatus(true);
    } catch (error) {
        showToast('Failed to load tasks', 'error');
        updateConnectionStatus(false, error.message);
    }
}

async function createTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    if (!title) {
        showToast('Title is required', 'error');
        return;
    }
    
    try {
        await taskAPI.create({ title, description, priority });
        showToast('Task created successfully');
        
        // Reset form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'MEDIUM';
        
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function moveTask(id) {
    try {
        await taskAPI.moveNext(id);
        showToast('Task moved');
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        await taskAPI.delete(id);
        showToast('Task deleted');
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== Modal Functions =====
async function openEditModal(id) {
    try {
        const response = await taskAPI.getById(id);
        const task = response.data;
        
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTitle').value = task.title;
        document.getElementById('editDescription').value = task.description || '';
        document.getElementById('editStatus').value = task.status;
        document.getElementById('editPriority').value = task.priority;
        
        elements.editModal.classList.add('show');
    } catch (error) {
        showToast('Failed to load task', 'error');
    }
}

function closeEditModal() {
    elements.editModal.classList.remove('show');
}

async function saveTask(event) {
    event.preventDefault();
    
    const id = document.getElementById('editTaskId').value;
    const data = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        status: document.getElementById('editStatus').value,
        priority: document.getElementById('editPriority').value
    };
    
    try {
        await taskAPI.update(id, data);
        showToast('Task updated');
        closeEditModal();
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function checkHealth() {
    try {
        const response = await taskAPI.healthCheck();
        updateConnectionStatus(response.success);
        console.log('Health check:', response);
    } catch (error) {
        updateConnectionStatus(false, 'API Unavailable');
    }
}

// ===== Event Listeners =====
elements.addTaskForm.addEventListener('submit', createTask);
elements.editTaskForm.addEventListener('submit', saveTask);

// Close modal on outside click
elements.editModal.addEventListener('click', (e) => {
    if (e.target === elements.editModal) {
        closeEditModal();
    }
});

// Close modal on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditModal();
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Task Board - N-Tier Architecture');
    console.log('📡 API Base URL:', API_BASE_URL);
    
    await checkHealth();
    await loadTasks();
    
    // Auto-refresh every 30 seconds
    setInterval(loadTasks, 30000);
});
```

---

## ส่วนที่ 6: ตั้งค่า Nginx (30 นาที)

### 6.1 สร้าง Nginx Configuration

**สร้างไฟล์ `nginx/taskboard.conf`:**

```nginx
# nginx/taskboard.conf
# Nginx Configuration for Task Board - N-Tier Architecture

# HTTP Server (redirect to HTTPS)
server {
    listen 80;
    server_name taskboard.local;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name taskboard.local;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/taskboard.crt;
    ssl_certificate_key /etc/nginx/ssl/taskboard.key;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Root for static files
    root /var/www/taskboard;
    index index.html;

    # Logging
    access_log /var/log/nginx/taskboard_access.log;
    error_log /var/log/nginx/taskboard_error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # Static files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 7d;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Reverse Proxy to Backend (Node.js)
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Health check endpoint
    location /nginx-health {
        access_log off;
        return 200 'Nginx OK';
        add_header Content-Type text/plain;
    }
}
```

### 6.2 Deploy Nginx Configuration

```bash
# Copy configuration
sudo cp nginx/taskboard.conf /etc/nginx/sites-available/taskboard

# Enable site
sudo ln -sf /etc/nginx/sites-available/taskboard /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6.3 Deploy Frontend to Nginx

```bash
# Create directory
sudo mkdir -p /var/www/taskboard

# Copy frontend files
sudo cp -r public/* /var/www/taskboard/

# Set permissions
sudo chown -R www-data:www-data /var/www/taskboard
sudo chmod -R 755 /var/www/taskboard

# Verify
ls -la /var/www/taskboard/
```

### 6.4 Setup hosts file

**ใน VM:**
```bash
echo "127.0.0.1 taskboard.local" | sudo tee -a /etc/hosts
```

**ในเครื่อง Local:**
- Windows: แก้ไข `C:\Windows\System32\drivers\etc\hosts`
- Mac/Linux: แก้ไข `/etc/hosts`

เพิ่มบรรทัด:
```
VM_IP    taskboard.local
```

---

## ส่วนที่ 7: Testing และ Verification (20 นาที)

### 7.1 สร้าง Test Script

**สร้างไฟล์ `scripts/test-api.sh`:**

```bash
#!/bin/bash
# scripts/test-api.sh
# API Test Script for Task Board

echo "═══════════════════════════════════════════════════════"
echo "  🧪 Task Board API Test Suite"
echo "═══════════════════════════════════════════════════════"
echo ""

BASE_URL="http://localhost:3000/api"
HTTPS_URL="https://taskboard.local/api"
PASSED=0
FAILED=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local expected="$5"
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$url")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "PATCH" ]; then
        response=$(curl -s -X PATCH -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -X DELETE "$url")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Response: $response"
        ((FAILED++))
    fi
}

echo "=== Testing Backend (Direct) ==="
echo ""

# Test 1: Health Check
test_endpoint "Health Check" "GET" "$BASE_URL/health" "" "healthy"

# Test 2: Get All Tasks
test_endpoint "Get All Tasks" "GET" "$BASE_URL/tasks" "" "success"

# Test 3: Get Statistics
test_endpoint "Get Statistics" "GET" "$BASE_URL/tasks/stats" "" "total"

# Test 4: Create Task
test_endpoint "Create Task" "POST" "$BASE_URL/tasks" \
    '{"title":"Test Task from Script","priority":"MEDIUM"}' \
    "Task created"

# Test 5: Get Task by ID
test_endpoint "Get Task by ID" "GET" "$BASE_URL/tasks/1" "" "success"

# Test 6: Update Task Status
test_endpoint "Update Status" "PATCH" "$BASE_URL/tasks/1/status" \
    '{"status":"IN_PROGRESS"}' \
    "success"

echo ""
echo "=== Testing via HTTPS (Nginx) ==="
echo ""

# Test 7: HTTPS Health Check
test_endpoint "HTTPS Health" "GET" "-k $HTTPS_URL/health" "" "healthy"

# Test 8: HTTPS Get Tasks
test_endpoint "HTTPS Get Tasks" "GET" "-k $HTTPS_URL/tasks" "" "success"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Test Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "═══════════════════════════════════════════════════════"
```

### 7.2 สร้าง Start Script

**สร้างไฟล์ `scripts/start-all.sh`:**

```bash
#!/bin/bash
# scripts/start-all.sh
# Start all N-Tier services

echo "═══════════════════════════════════════════════════════"
echo "  🚀 Starting N-Tier Task Board Services"
echo "═══════════════════════════════════════════════════════"

# Start PostgreSQL
echo "1. Starting PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl status postgresql --no-pager | head -3

# Start Nginx
echo ""
echo "2. Starting Nginx..."
sudo systemctl start nginx
sudo systemctl status nginx --no-pager | head -3

# Start Node.js with PM2
echo ""
echo "3. Starting Node.js Backend..."
cd ~/engse207-labs/week6-ntier
pm2 start server.js --name "taskboard-api" --watch
pm2 status

# Verify all services
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ All services started!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  📍 Access URLs:"
echo "     - HTTPS: https://taskboard.local"
echo "     - API:   https://taskboard.local/api/health"
echo "     - Direct: http://localhost:3000/api/health"
echo ""
echo "  📊 Monitoring:"
echo "     - pm2 logs"
echo "     - sudo tail -f /var/log/nginx/taskboard_access.log"
echo ""
```

### 7.3 Test Checklist

```
┌────────────────────────────────────────────────────────────────────┐
│                    ✅ TEST CHECKLIST                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  TIER 3 - Database (PostgreSQL)                                    │
│  [ ] sudo systemctl status postgresql                              │
│  [ ] psql -h localhost -U taskboard -d taskboard_db -c "SELECT 1"  │
│                                                                    │
│  TIER 2 - Backend (Node.js)                                        │
│  [ ] pm2 status                                                    │
│  [ ] curl http://localhost:3000/api/health                         │
│  [ ] curl http://localhost:3000/api/tasks                          │
│                                                                    │
│  TIER 1 - Web Server (Nginx)                                       │
│  [ ] sudo systemctl status nginx                                   │
│  [ ] curl http://taskboard.local (should redirect)                 │
│  [ ] curl -k https://taskboard.local                               │
│  [ ] curl -k https://taskboard.local/api/health                    │
│                                                                    │
│  FULL STACK                                                        │
│  [ ] Open browser: https://taskboard.local                         │
│  [ ] Accept SSL warning                                            │
│  [ ] Create new task                                               │
│  [ ] Edit task                                                     │
│  [ ] Move task status                                              │
│  [ ] Delete task                                                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 7.4 Run Tests

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Start all services
./scripts/start-all.sh

# Run tests
./scripts/test-api.sh
```

---

## ส่วนที่ 8: การวิเคราะห์และเปรียบเทียบ (40 นาที) ⭐

### 🎯 สำคัญมาก: นักศึกษาต้องทำเอง!

**สร้างไฟล์ `docs/ANALYSIS.md` และตอบคำถามให้ครบถ้วน**

(ดูรายละเอียดในไฟล์ ANALYSIS_TEMPLATE.md ที่ให้ไว้)

---

## 📤 การส่งงานและเกณฑ์การให้คะแนน

### Checklist:

- [ ] PostgreSQL ทำงาน
- [ ] Nginx ทำงาน
- [ ] HTTPS ทำงาน
- [ ] Backend API ทำงาน
- [ ] Frontend ทำงาน
- [ ] CRUD operations ครบ
- [ ] **ANALYSIS.md เสร็จสมบูรณ์**
- [ ] README.md อัพเดท
- [ ] Screenshots ครบ

### เกณฑ์คะแนน (40 คะแนน):

| หัวข้อ | คะแนน |
|--------|-------|
| Infrastructure (PostgreSQL, Nginx, SSL) | 5 |
| Backend API | 5 |
| Frontend | 3 |
| Integration | 4 |
| **การวิเคราะห์ (ANALYSIS.md)** | **15** |
| Documentation | 3 |
| Code Quality | 3 |
| Git | 2 |
| **รวม** | **40** |

---

## 📁 ไฟล์เพิ่มเติม

### .gitignore

```gitignore
# Dependencies
node_modules/

# Environment
.env

# Database
*.db
*.sqlite

# Logs
logs/
*.log
npm-debug.log*

# SSL Certificates (don't commit these!)
*.key
*.crt
*.pem

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# PM2
.pm2/
```

### README.md Template

```markdown
# 📋 Task Board - N-Tier Architecture (Week 6)

## 🏗️ Architecture

```
Browser → Nginx (HTTPS) → Node.js (API) → PostgreSQL (Data)
```

## 🚀 Quick Start

```bash
# Start all services
./scripts/start-all.sh

# Access
https://taskboard.local
```

## 📁 Project Structure

```
week6-ntier/
├── src/           # Backend source code
├── public/        # Frontend files
├── database/      # SQL scripts
├── nginx/         # Nginx config
└── scripts/       # Helper scripts
```

## 🛠️ Technologies

| Tier | Technology |
|------|------------|
| Web Server | Nginx |
| Backend | Node.js + Express |
| Database | PostgreSQL |

## 👨‍💻 Author

[Your Name] - ENGSE207 Week 6
```

---

## 🛠️ แก้ปัญหาเบื้องต้น

### PostgreSQL
```bash
# ตรวจสอบ status
sudo systemctl status postgresql

# ดู logs
sudo tail -50 /var/log/postgresql/postgresql-*-main.log

# Reset password
sudo -u postgres psql -c "ALTER USER taskboard PASSWORD 'taskboard123';"
```

### Nginx
```bash
# Test config
sudo nginx -t

# ดู logs
sudo tail -f /var/log/nginx/taskboard_error.log

# Restart
sudo systemctl restart nginx
```

### Node.js
```bash
# ดู PM2 logs
pm2 logs taskboard-api

# Restart
pm2 restart taskboard-api

# ดู process
pm2 show taskboard-api
```

---

## 📝 การบ้าน: Multi-VM Version

### Assignment: แยก N-Tier เป็น 3 VMs

**เปลี่ยนจาก Single VM เป็น:**

```
┌─────────────┐      ┌─────────────┐      ┌───────────────┐
│    VM 1     │      │    VM 2     │      │     VM 3      │
│             │      │             │      │               │
│   🌐 Nginx  │─────►│  ⚙️ Node.js │─────►│ 🗄️ PostgreSQL │
│   Port 443  │      │   Port 3000 │      │   Port 5432   │
│             │      │             │      │               │
│  10.0.0.10  │      │  10.0.0.20  │      │  10.0.0.30    │
└─────────────┘      └─────────────┘      └───────────────┘
    Web Tier            App Tier              Data Tier
```

### Requirements:

| VM | Component | IP | Configuration |
|----|-----------|-----|---------------|
| **VM1** | Nginx | 10.0.0.10 | Proxy to VM2:3000 |
| **VM2** | Node.js | 10.0.0.20 | DB_HOST=10.0.0.30 |
| **VM3** | PostgreSQL | 10.0.0.30 | Allow VM2 connection |

### Deliverables:

1. ✅ 3 VMs ทำงานได้
2. ✅ Network communication ระหว่าง VMs
3. ✅ CRUD operations ผ่าน HTTPS
4. ✅ Documentation อัพเดท
5. ✅ MULTI_VM_SETUP.md

### Bonus Points (+5):

- [ ] ใช้ Vagrant หรือ Terraform สร้าง VMs
- [ ] เพิ่ม Load Balancer (2 App Servers)
- [ ] เพิ่ม Database Replication

---

## 🛠️ แก้ปัญหาเบื้องต้น

### PostgreSQL Issues

**ไม่สามารถ connect:**
```bash
# ตรวจสอบ service
sudo systemctl status postgresql

# ตรวจสอบ logs
sudo tail -50 /var/log/postgresql/postgresql-14-main.log

# ตรวจสอบ port
sudo ss -tlnp | grep 5432
```

**Authentication failed:**
```bash
# Reset password
sudo -u postgres psql
ALTER USER taskboard WITH PASSWORD 'taskboard123';
\q
```

### Nginx Issues

**502 Bad Gateway:**
```bash
# Backend ไม่ทำงาน
pm2 status
pm2 restart task-board

# ตรวจสอบ proxy_pass
sudo cat /etc/nginx/sites-available/taskboard | grep proxy_pass
```

**SSL Certificate Error:**
```bash
# ตรวจสอบ certificate
sudo openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -dates

# สร้างใหม่ถ้าหมดอายุ
sudo openssl req -x509 -nodes -days 365 ...
```

### Connection Issues

**Cannot access from browser:**
```bash
# ตรวจสอบ firewall
sudo ufw status
sudo ufw allow 443/tcp

# ตรวจสอบ hosts file
cat /etc/hosts | grep taskboard

# ตรวจสอบ nginx listening
sudo ss -tlnp | grep nginx
```

---

## 🎯 Best Practices ที่ได้เรียนรู้

### 1. Security
- ใช้ HTTPS เสมอ (แม้แต่ development)
- Database ไม่ควรถูกเข้าถึงจากภายนอกโดยตรง
- ใช้ Environment Variables สำหรับ credentials

### 2. Performance
- Nginx serve static files ดีกว่า Node.js
- ใช้ Connection Pooling สำหรับ database
- Enable Gzip compression

### 3. Maintainability
- แยก Tier ชัดเจน
- Document ทุก configuration
- ใช้ version control

### 4. Deployment
- Test locally ก่อน deploy
- มี rollback plan
- Monitor logs

---
## 🎉 ยินดีด้วย!

คุณได้สำเร็จ:
- ✅ ติดตั้ง N-Tier Architecture บน Single VM
- ✅ ใช้งาน PostgreSQL แทน SQLite
- ✅ ตั้งค่า Nginx เป็น Reverse Proxy
- ✅ สร้าง SSL Certificate สำหรับ HTTPS
- ✅ **วิเคราะห์และเปรียบเทียบ 4 Architectures** ⭐

**ทักษะเหล่านี้ใช้จริงใน:**
- Cloud deployments (AWS, GCP, Azure)
- Enterprise applications
- Production web services
- DevOps practices

## 📚 สัปดาห์หน้า: N-Tier Version 2 (Docker)

**เตรียมตัว:**
- ติดตั้ง Docker Desktop
- อ่าน Docker basics
- ทบทวน Week 6 code

---

*ENGCE301 - Software Design and Development*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
