# 🐳 คู่มือปฏิบัติการ ENGSE207 - สัปดาห์ที่ 6
## N-Tier Architecture: Multi-Tier on Docker (Version 2)

**สัปดาห์:** 6 | **ระยะเวลา:** 4 ชั่วโมง | **ระดับความยาก:** ⭐⭐⭐⭐

---

## 📋 สารบัญ

1. [วัตถุประสงค์การเรียนรู้](#วัตถุประสงค์การเรียนรู้)
2. [ทำไมต้องเปลี่ยนจาก VM เป็น Docker?](#ทำไมต้องเปลี่ยนจาก-vm-เป็น-docker)
3. [เปรียบเทียบ Version 1 (VM) vs Version 2 (Docker)](#เปรียบเทียบ-version-1-vm-vs-version-2-docker)
4. [สิ่งที่ต้องเตรียม](#สิ่งที่ต้องเตรียม)
5. [ภาพรวมสถาปัตยกรรม Docker](#ภาพรวมสถาปัตยกรรม-docker)
6. [ส่วนที่ 1: ตรวจสอบและติดตั้ง Docker (15 นาที)](#ส่วนที่-1-ตรวจสอบและติดตั้ง-docker)
7. [ส่วนที่ 2: สร้างโครงสร้างโปรเจกต์ (15 นาที)](#ส่วนที่-2-สร้างโครงสร้างโปรเจกต์)
8. [ส่วนที่ 3: สร้าง Backend API Container (60 นาที)](#ส่วนที่-3-สร้าง-backend-api-container)
9. [ส่วนที่ 4: สร้าง PostgreSQL Container (30 นาที)](#ส่วนที่-4-สร้าง-postgresql-container)
10. [ส่วนที่ 5: สร้าง Nginx Container (30 นาที)](#ส่วนที่-5-สร้าง-nginx-container)
11. [ส่วนที่ 6: สร้าง Docker Compose (30 นาที)](#ส่วนที่-6-สร้าง-docker-compose)
12. [ส่วนที่ 7: Testing และ Verification (30 นาที)](#ส่วนที่-7-testing-และ-verification)
13. [ส่วนที่ 8: การวิเคราะห์เปรียบเทียบ VM vs Docker (30 นาที)](#ส่วนที่-8-การวิเคราะห์เปรียบเทียบ)
14. [การส่งงานและเกณฑ์การให้คะแนน](#การส่งงานและเกณฑ์การให้คะแนน)
15. [แก้ปัญหาเบื้องต้น](#แก้ปัญหาเบื้องต้น)

---

## 🎯 วัตถุประสงค์การเรียนรู้

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:

✅ อธิบายข้อดีของการใช้ Docker แทน Traditional VM Deployment ได้  
✅ เขียน Dockerfile สำหรับ Node.js Application ได้  
✅ ใช้งาน Docker Compose เพื่อจัดการ Multi-Container Application ได้  
✅ ตั้งค่า Network ระหว่าง Containers ได้  
✅ สร้าง Docker volumes สำหรับ persistent data ได้  
✅ **วิเคราะห์และเปรียบเทียบ VM Deployment vs Docker Deployment ได้** ⭐

---

## 🔄 ทำไมต้องเปลี่ยนจาก VM เป็น Docker?

### ❌ ปัญหาที่พบใน Version 1 (Single VM):

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 PROBLEMS WITH VM DEPLOYMENT (Week 6 V1)                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. 😰 Environment Setup ยาก                                            │
│     ┌─────────────────────────────────────────────────────────────┐     │
│     │  ต้องติดตั้งทีละตัว:                                              │     │
│     │  • sudo apt install postgresql          (5-10 นาที)          │     │
│     │  • sudo apt install nginx               (2-3 นาที)           │     │
│     │  • Install Node.js + PM2                (5 นาที)             │     │
│     │  • Configure each service               (20-30 นาที)         │     │
│     │  ─────────────────────────────────────────────────          │     │
│     │  Total: 30-50 นาที (ถ้าไม่มีปัญหา!)                              │     │
│     └─────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  2. 🔧 "Works on my machine!" Problem                                   │
│     ┌───────────────┐              ┌───────────────┐                    │
│     │ นักศึกษา A      │              │ นักศึกษา B      │                    │
│     │ Ubuntu 24.04  │     ≠        │ Ubuntu 22.04  │                    │
│     │ PG 16         │              │ PG 14         │                    │
│     │ Node 20.10    │              │ Node 18.19    │                    │
│     └───────────────┘              └───────────────┘                    │
│                                                                         │
│  3. 📦 ย้ายไป Machine อื่นยาก                                              │
│     • ต้อง setup ใหม่ทุกครั้ง                                                │
│     • Configuration อาจไม่เหมือนกัน                                        │
│     • Version ของ software อาจต่างกัน                                     │
│                                                                         │
│  4. 🧹 ลบยาก / Cleanup ยุ่งยาก                                            │
│     • PostgreSQL ติดตั้งลึกใน system                                        │
│     • Nginx config กระจายหลายที่                                          │
│     • อาจมี dependency ตกค้าง                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### ✅ Docker แก้ปัญหาเหล่านี้ได้อย่างไร:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 DOCKER SOLUTIONS (Week 6 V2)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. ⚡ Environment Setup ง่ายและเร็ว                                       │
│     ┌─────────────────────────────────────────────────────────────┐     │
│     │  $ docker compose up -d                                     │     │
│     │                                                             │     │
│     │  ✅ PostgreSQL    - Started (5 วินาที)                        │     │
│     │  ✅ Node.js API   - Started (10 วินาที)                       │     │
│     │  ✅ Nginx         - Started (3 วินาที)                        │     │
│     │  ─────────────────────────────────────────────────          │     │
│     │  Total: < 1 นาที (ครั้งแรก 3-5 นาที เพราะ download images)      │     │
│     └─────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  2. 📦 Consistent Environment ทุกเครื่อง                                   │
│     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐       │
│     │ นักศึกษา A      │     │ นักศึกษา B      │     │  Production   │       │
│     │               │  =  │               │  =  │               │       │
│     │ Same Image    │     │ Same Image    │     │ Same Image    │       │
│     │ Same Config   │     │ Same Config   │     │ Same Config   │       │
│     └───────────────┘     └───────────────┘     └───────────────┘       │
│                                                                         │
│  3. 🚀 Portable - ย้ายไปไหนก็ได้                                           │
│     • Share docker-compose.yml                                          │
│     • Push images to Docker Hub                                         │
│     • Clone repo + docker compose up = Done!                            │
│                                                                         │
│  4. 🧹 Cleanup ง่ายมาก                                                   │
│     $ docker compose down -v                                            │
│     ✅ ลบทุกอย่างออกหมด - ไม่เหลือ traces                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 เปรียบเทียบ Version 1 (VM) vs Version 2 (Docker)

```
┌────────────────────────────────────────────────────────────────────────────┐
│              VERSION 1 (VM)                  VERSION 2 (DOCKER)            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ╔═══════════════════════════════╗    ╔═══════════════════════════════╗    │
│  ║      Ubuntu VM                ║    ║      Docker Host              ║    │
│  ║  ┌───────────────────────┐    ║    ║  ┌───────────────────────┐    ║    │
│  ║  │      Nginx            │    ║    ║  │  nginx Container      │    ║    │
│  ║  │  (apt install nginx)  │    ║    ║  │  (nginx:alpine)       │    ║    │
│  ║  └───────────────────────┘    ║    ║  └───────────────────────┘    ║    │
│  ║  ┌───────────────────────┐    ║    ║  ┌───────────────────────┐    ║    │
│  ║  │      Node.js          │    ║    ║  │  api Container        │    ║    │
│  ║  │  (nvm install 20)     │    ║    ║  │  (node:20-alpine)     │    ║    │
│  ║  │  + PM2 process mgr    │    ║    ║  └───────────────────────┘    ║    │
│  ║  └───────────────────────┘    ║    ║  ┌───────────────────────┐    ║    │
│  ║  ┌───────────────────────┐    ║    ║  │  db Container         │    ║    │
│  ║  │     PostgreSQL        │    ║    ║  │  (postgres:16-alpine) │    ║    │
│  ║  │  (apt install pg)     │    ║    ║  └───────────────────────┘    ║    │
│  ║  └───────────────────────┘    ║    ║                               ║    │
│  ║                               ║    ║      Docker Network           ║    │
│  ║   Shared: OS, Libraries       ║    ║   Isolated: Each container    ║    │
│  ╚═══════════════════════════════╝    ╚═══════════════════════════════╝    │
│                                                                            │
│  Setup Time:     30-50 minutes         Setup Time:     1-5 minutes         │
│  Cleanup:        Complex               Cleanup:        docker compose down │
│  Portability:    Low                   Portability:    High                │
│  Consistency:    Varies                Consistency:    100% same           │
│  Resources:      1 VM (heavy)          Resources:      Containers (light)  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### สิ่งที่เปลี่ยนแปลงใน Version 2:

| Component | Version 1 (VM) | Version 2 (Docker) |
|-----------|----------------|-------------------|
| **PostgreSQL** | `apt install postgresql` | `postgres:16-alpine` image |
| **Node.js** | `nvm install 20` + PM2 | `node:20-alpine` + Dockerfile |
| **Nginx** | `apt install nginx` | `nginx:alpine` image |
| **SSL** | Self-signed certificate | Self-signed ใน Nginx container |
| **Network** | localhost + ports | Docker internal network |
| **Data** | Files on VM | Docker volumes |
| **Config** | Files in /etc/ | Mounted config files |
| **Management** | systemctl, pm2 | docker compose |

---

## 📚 สิ่งที่ต้องเตรียม

### ต้องมีก่อนเริ่ม Lab:

✅ **Week 6 Version 1** - ทำสำเร็จและทำงานได้ (เข้าใจ N-Tier Architecture)  
✅ **Docker Desktop** - ติดตั้งแล้ว (Windows/Mac) หรือ Docker Engine (Linux)  
✅ **Docker Compose** - มากับ Docker Desktop หรือติดตั้งแยก  
✅ **VS Code** - พร้อม Docker Extension  
✅ **Git** - สำหรับ version control  

### ตรวจสอบว่า Docker พร้อมใช้งาน:

```bash
# ตรวจสอบ Docker version
docker --version
# ควรเห็น: Docker version 24.x.x หรือใหม่กว่า

# ตรวจสอบ Docker Compose version
docker compose version
# ควรเห็น: Docker Compose version v2.x.x

# ทดสอบรัน container
docker run hello-world
# ควรเห็น: Hello from Docker!
```

---

## 🏗️ ภาพรวมสถาปัตยกรรม Docker

### Architecture Diagram - Docker Version:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  เครื่อง Local (Host Machine)                                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Browser (Client)                                                 │  │
│  │  - เข้าผ่าน https://localhost                                       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (Port 443)
                              ▼
╔═════════════════════════════════════════════════════════════════════════╗
║                     Docker Host - 3 Containers                          ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │  🌐 Container: nginx                                              │  ║
║  │  Image: nginx:alpine                                              │  ║
║  │  ┌─────────────────────────────────────────────────────────────┐  │  ║
║  │  │  • Port 80 → Redirect to 443                                │  │  ║
║  │  │  • Port 443 → HTTPS with SSL                                │  │  ║
║  │  │  • Serve Static Files (HTML, CSS, JS)                       │  │  ║
║  │  │  • Reverse Proxy /api/* → api:3000                          │  │  ║
║  │  └─────────────────────────────────────────────────────────────┘  │  ║
║  └───────────────────────────────┬───────────────────────────────────┘  ║
║                                  │ HTTP (api:3000)                      ║
║                                  ▼                                      ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │  ⚙️ Container: api                                                │  ║
║  │  Image: week6-api:latest (custom Dockerfile)                      │  ║
║  │  ┌─────────────────────────────────────────────────────────────┐  │  ║
║  │  │  • Port 3000 (internal only)                                │  │  ║
║  │  │  • REST API Endpoints                                       │  │  ║
║  │  │  • Business Logic (Layered Architecture)                    │  │  ║
║  │  │  │  ├── Controllers (Presentation)                          │  │  ║
║  │  │  │  ├── Services (Business Logic)                           │  │  ║
║  │  │  │  └── Repositories (Data Access)                          │  │  ║
║  │  └─────────────────────────────────────────────────────────────┘  │  ║
║  └───────────────────────────────┬───────────────────────────────────┘  ║
║                                  │ TCP (db:5432)                        ║
║                                  ▼                                      ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │  🗄️ Container: db                                                 │  ║
║  │  Image: postgres:16-alpine                                        │  ║
║  │  ┌─────────────────────────────────────────────────────────────┐  │  ║
║  │  │  • Port 5432 (internal only)                                │  │  ║
║  │  │  • Database: taskboard_db                                   │  │  ║
║  │  │  • Volume: postgres_data (persistent)                       │  │  ║
║  │  └─────────────────────────────────────────────────────────────┘  │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │  🔗 Docker Network: taskboard-network (bridge)                  │    ║
║  │  Containers สื่อสารกันผ่าน container name (dns resolution)          │    ║
║  │  • nginx → api:3000                                             │    ║
║  │  • api → db:5432                                                │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │  💾 Docker Volumes:                                             │    ║
║  │  • postgres_data → /var/lib/postgresql/data                     │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
╚═════════════════════════════════════════════════════════════════════════╝
```

### โครงสร้างโปรเจกต์ Docker Version:

```
week6-ntier-docker/
├── docker-compose.yml              # 🎯 Main orchestration file
├── .env                            # Environment variables
├── .env.example                    # Template
├── .gitignore
├── .dockerignore                   # Files to exclude from Docker build
├── README.md
│
├── api/                            # 📦 Backend API Container
│   ├── Dockerfile                  # Build instructions
│   ├── package.json
│   ├── server.js                   # Entry point
│   └── src/
│       ├── config/
│       │   └── database.js
│       ├── models/
│       │   └── Task.js
│       ├── repositories/
│       │   └── taskRepository.js
│       ├── services/
│       │   └── taskService.js
│       ├── controllers/
│       │   └── taskController.js
│       ├── routes/
│       │   └── taskRoutes.js
│       └── middleware/
│           ├── errorHandler.js
│           └── validator.js
│
├── nginx/                          # 🌐 Nginx Container Config
│   ├── nginx.conf                  # Main nginx config
│   ├── conf.d/
│   │   └── default.conf            # Site configuration
│   └── ssl/
│       ├── server.crt              # SSL certificate
│       └── server.key              # SSL private key
│
├── frontend/                       # 📱 Static Files (served by Nginx)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── database/                       # 🗄️ PostgreSQL Init Scripts
│   └── init.sql                    # Create tables & seed data
│
├── scripts/                        # 🛠️ Helper Scripts
│   ├── start.sh                    # Start all containers
│   ├── stop.sh                     # Stop all containers
│   ├── logs.sh                     # View logs
│   ├── test-api.sh                 # Test API endpoints
│   └── generate-ssl.sh             # Generate SSL certificates
│
└── docs/
    ├── ANALYSIS.md                 # Analysis (student work)
    └── DOCKER_COMMANDS.md          # Docker quick reference
```

---

## ส่วนที่ 1: ตรวจสอบและติดตั้ง Docker (15 นาที)

### 1.1 ตรวจสอบ Docker Installation

```bash
# ตรวจสอบ Docker
docker --version
docker compose version

# ตรวจสอบว่า Docker daemon ทำงาน
docker info

# ทดสอบ Docker
docker run hello-world
```

### ✅ Checkpoint 1: Docker พร้อมใช้งาน

```bash
# คุณควรเห็น output คล้ายนี้:
Docker version 24.0.7, build afdd53b
Docker Compose version v2.23.3

# และ hello-world ทำงานได้
Hello from Docker!
```

### 1.2 ติดตั้ง Docker (ถ้ายังไม่มี)

**สำหรับ Ubuntu/WSL2:**
```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group (ไม่ต้องใช้ sudo)
sudo usermod -aG docker $USER

# Restart terminal หรือ run:
newgrp docker

# Verify
docker run hello-world
```

**สำหรับ macOS/Windows:**
- Download และติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- เปิด Docker Desktop และรอจน Whale icon เป็นสีเขียว

---

## ส่วนที่ 2: สร้างโครงสร้างโปรเจกต์ (15 นาที)

### 2.1 สร้างโฟลเดอร์โปรเจกต์

```bash
# สร้างโฟลเดอร์หลัก
mkdir -p ~/engse207-labs/week6-ntier-docker
cd ~/engse207-labs/week6-ntier-docker

# สร้างโครงสร้างโฟลเดอร์
mkdir -p api/src/{config,controllers,services,repositories,models,middleware,routes}
mkdir -p nginx/{conf.d,ssl}
mkdir -p frontend/{css,js}
mkdir -p database
mkdir -p scripts
mkdir -p docs

# ตรวจสอบโครงสร้าง
tree -L 3
# หรือ
ls -la
```

### 2.2 สร้างไฟล์ .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment
.env
*.env.local

# Database
*.db
*.sqlite

# Logs
logs/
*.log
npm-debug.log*

# SSL Certificates (don't commit these!)
nginx/ssl/*.key
nginx/ssl/*.crt
nginx/ssl/*.pem

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Docker
.docker/
EOF
```

### 2.3 สร้างไฟล์ .dockerignore

```bash
cat > .dockerignore << 'EOF'
# Git
.git
.gitignore

# Documentation
docs/
*.md
!README.md

# Development
.vscode/
.idea/

# Logs
logs/
*.log

# Environment files
.env
.env.*
!.env.example

# Node modules (จะ install ใหม่ใน container)
node_modules/

# Test files
__tests__/
*.test.js

# Build artifacts
dist/
build/
EOF
```

### 2.4 เริ่มต้น Git Repository

```bash
git init
git add .gitignore .dockerignore
git commit -m "Initial project structure for Week 6 Docker version"
```

### ✅ Checkpoint 2: โครงสร้างโปรเจกต์พร้อม

```bash
# ตรวจสอบโครงสร้าง
ls -la

# ควรเห็น:
# drwxr-xr-x  api/
# drwxr-xr-x  nginx/
# drwxr-xr-x  frontend/
# drwxr-xr-x  database/
# drwxr-xr-x  scripts/
# drwxr-xr-x  docs/
# -rw-r--r--  .gitignore
# -rw-r--r--  .dockerignore
```

---

## ส่วนที่ 3: สร้าง Backend API Container (60 นาที)

### 3.1 สร้าง package.json

```bash
cat > api/package.json << 'EOF'
{
  "name": "week6-ntier-docker-api",
  "version": "2.0.0",
  "description": "ENGSE207 Week 6 - N-Tier Architecture with Docker",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["n-tier", "docker", "nodejs", "postgresql"],
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
EOF
```

### 3.2 สร้าง Dockerfile สำหรับ API

```bash
cat > api/Dockerfile << 'EOF'
# ============================================
# Dockerfile for Task Board API
# ENGSE207 - Week 6 Docker Version
# ============================================

# Stage 1: Base image
# ใช้ Node.js Alpine version (เล็กกว่า ~5x)
FROM node:20-alpine

# ตั้งค่า metadata
LABEL maintainer="ENGSE207 Student"
LABEL description="Task Board API - N-Tier Architecture"
LABEL version="2.0.0"

# ตั้งค่า Working Directory
WORKDIR /app

# Copy package files ก่อน (สำหรับ layer caching)
COPY package*.json ./

# Install dependencies
# --omit=dev = ไม่ install devDependencies ใน production
RUN npm ci --omit=dev

# Copy source code
COPY . .

# สร้าง non-root user เพื่อความปลอดภัย
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# เปลี่ยน ownership ของ app files
RUN chown -R nodejs:nodejs /app

# ใช้ non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start command
CMD ["node", "server.js"]
EOF
```

**💡 อธิบาย Dockerfile:**

| Instruction | คำอธิบาย |
|-------------|---------|
| `FROM node:20-alpine` | ใช้ Node.js 20 บน Alpine Linux (image เล็ก ~50MB) |
| `WORKDIR /app` | กำหนด directory ทำงานใน container |
| `COPY package*.json ./` | Copy package.json ก่อน (ใช้ cache) |
| `RUN npm ci --omit=dev` | Install dependencies แบบ clean |
| `USER nodejs` | รันด้วย non-root user (ปลอดภัยกว่า) |
| `HEALTHCHECK` | ให้ Docker ตรวจสอบว่า container healthy |

### 3.3 สร้าง Database Connection

```bash
cat > api/src/config/database.js << 'EOF'
// src/config/database.js
// PostgreSQL Database Connection for Docker Environment

const { Pool } = require('pg');

// สร้าง connection pool
// ใน Docker ใช้ชื่อ container แทน localhost
const pool = new Pool({
    host: process.env.DB_HOST || 'db',           // ชื่อ container
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'taskboard_db',
    user: process.env.DB_USER || 'taskboard',
    password: process.env.DB_PASSWORD || 'taskboard123',
    
    // Pool settings
    max: 10,                      // Maximum connections
    idleTimeoutMillis: 30000,     // Close idle connections after 30s
    connectionTimeoutMillis: 5000  // Timeout after 5s
});

// Connection events
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL pool error:', err.message);
});

// Query helper
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`📊 Query: ${duration}ms | Rows: ${result.rowCount}`);
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
            idleCount: pool.idleCount
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message
        };
    }
};

module.exports = { pool, query, healthCheck };
EOF
```

### 3.4 สร้าง Task Model

```bash
cat > api/src/models/Task.js << 'EOF'
// src/models/Task.js
// Task Model - Data structure definition

class Task {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description || '';
        this.status = data.status || 'TODO';
        this.priority = data.priority || 'MEDIUM';
        this.createdAt = data.created_at || data.createdAt;
        this.updatedAt = data.updated_at || data.updatedAt;
    }

    // Valid statuses
    static STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
    
    // Valid priorities
    static PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

    // Validate task data
    static validate(data) {
        const errors = [];

        if (!data.title || data.title.trim().length === 0) {
            errors.push('Title is required');
        }
        if (data.title && data.title.length > 200) {
            errors.push('Title must be less than 200 characters');
        }
        if (data.status && !Task.STATUSES.includes(data.status)) {
            errors.push(`Status must be one of: ${Task.STATUSES.join(', ')}`);
        }
        if (data.priority && !Task.PRIORITIES.includes(data.priority)) {
            errors.push(`Priority must be one of: ${Task.PRIORITIES.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convert to JSON
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Task;
EOF
```

### 3.5 สร้าง Repository Layer

```bash
cat > api/src/repositories/taskRepository.js << 'EOF'
// src/repositories/taskRepository.js
// Data Access Layer - PostgreSQL queries

const { query } = require('../config/database');
const Task = require('../models/Task');

class TaskRepository {
    
    // Get all tasks
    async findAll() {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            ORDER BY 
                CASE priority 
                    WHEN 'HIGH' THEN 1 
                    WHEN 'MEDIUM' THEN 2 
                    WHEN 'LOW' THEN 3 
                END,
                created_at DESC
        `;
        const result = await query(sql);
        return result.rows.map(row => new Task(row));
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
        if (result.rows.length === 0) return null;
        return new Task(result.rows[0]);
    }

    // Create new task
    async create(taskData) {
        const sql = `
            INSERT INTO tasks (title, description, status, priority)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, description, status, priority, 
                      created_at, updated_at
        `;
        const values = [
            taskData.title,
            taskData.description || '',
            taskData.status || 'TODO',
            taskData.priority || 'MEDIUM'
        ];
        const result = await query(sql, values);
        return new Task(result.rows[0]);
    }

    // Update task
    async update(id, taskData) {
        const sql = `
            UPDATE tasks 
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                status = COALESCE($3, status),
                priority = COALESCE($4, priority),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, title, description, status, priority, 
                      created_at, updated_at
        `;
        const values = [
            taskData.title,
            taskData.description,
            taskData.status,
            taskData.priority,
            id
        ];
        const result = await query(sql, values);
        if (result.rows.length === 0) return null;
        return new Task(result.rows[0]);
    }

    // Delete task
    async delete(id) {
        const sql = 'DELETE FROM tasks WHERE id = $1 RETURNING id';
        const result = await query(sql, [id]);
        return result.rowCount > 0;
    }

    // Get tasks by status
    async findByStatus(status) {
        const sql = `
            SELECT id, title, description, status, priority, 
                   created_at, updated_at 
            FROM tasks 
            WHERE status = $1
            ORDER BY created_at DESC
        `;
        const result = await query(sql, [status]);
        return result.rows.map(row => new Task(row));
    }

    // Count tasks by status
    async countByStatus() {
        const sql = `
            SELECT status, COUNT(*) as count 
            FROM tasks 
            GROUP BY status
        `;
        const result = await query(sql);
        return result.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, { TODO: 0, IN_PROGRESS: 0, DONE: 0 });
    }
}

module.exports = new TaskRepository();
EOF
```

### 3.6 สร้าง Service Layer

```bash
cat > api/src/services/taskService.js << 'EOF'
// src/services/taskService.js
// Business Logic Layer

const taskRepository = require('../repositories/taskRepository');
const Task = require('../models/Task');

class TaskService {
    
    // Get all tasks
    async getAllTasks() {
        return await taskRepository.findAll();
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

    // Create new task
    async createTask(taskData) {
        // Validate
        const validation = Task.validate(taskData);
        if (!validation.isValid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        return await taskRepository.create(taskData);
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

        // Business rule: Cannot change status back from DONE
        if (existingTask.status === 'DONE' && taskData.status && taskData.status !== 'DONE') {
            const error = new Error('Cannot change status of completed task');
            error.statusCode = 400;
            throw error;
        }

        // Validate if provided
        if (taskData.title || taskData.status || taskData.priority) {
            const validation = Task.validate({
                ...existingTask,
                ...taskData
            });
            if (!validation.isValid) {
                const error = new Error(validation.errors.join(', '));
                error.statusCode = 400;
                throw error;
            }
        }

        return await taskRepository.update(id, taskData);
    }

    // Delete task
    async deleteTask(id) {
        // Check if task exists
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Business rule: Cannot delete IN_PROGRESS tasks
        if (existingTask.status === 'IN_PROGRESS') {
            const error = new Error('Cannot delete task that is in progress');
            error.statusCode = 400;
            throw error;
        }

        return await taskRepository.delete(id);
    }

    // Get statistics
    async getStatistics() {
        const counts = await taskRepository.countByStatus();
        const total = counts.TODO + counts.IN_PROGRESS + counts.DONE;
        
        return {
            total,
            byStatus: counts,
            completionRate: total > 0 ? Math.round((counts.DONE / total) * 100) : 0
        };
    }
}

module.exports = new TaskService();
EOF
```

### 3.7 สร้าง Controller Layer

```bash
cat > api/src/controllers/taskController.js << 'EOF'
// src/controllers/taskController.js
// Presentation Layer - Handle HTTP requests

const taskService = require('../services/taskService');

class TaskController {
    
    // GET /api/tasks
    async getAllTasks(req, res, next) {
        try {
            const tasks = await taskService.getAllTasks();
            res.json({
                success: true,
                count: tasks.length,
                data: tasks
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tasks/:id
    async getTaskById(req, res, next) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tasks
    async createTask(req, res, next) {
        try {
            const task = await taskService.createTask(req.body);
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/tasks/:id
    async updateTask(req, res, next) {
        try {
            const task = await taskService.updateTask(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Task updated successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/tasks/:id
    async deleteTask(req, res, next) {
        try {
            await taskService.deleteTask(req.params.id);
            res.json({
                success: true,
                message: 'Task deleted successfully'
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
}

module.exports = new TaskController();
EOF
```

### 3.8 สร้าง Routes

```bash
cat > api/src/routes/taskRoutes.js << 'EOF'
// src/routes/taskRoutes.js
// API Route definitions

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks/stats - Statistics (ต้องอยู่ก่อน /:id)
router.get('/stats', taskController.getStatistics.bind(taskController));

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks.bind(taskController));

// GET /api/tasks/:id - Get single task
router.get('/:id', taskController.getTaskById.bind(taskController));

// POST /api/tasks - Create task
router.post('/', taskController.createTask.bind(taskController));

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask.bind(taskController));

module.exports = router;
EOF
```

### 3.9 สร้าง Error Handler Middleware

```bash
cat > api/src/middleware/errorHandler.js << 'EOF'
// src/middleware/errorHandler.js
// Centralized error handling

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// 404 handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.originalUrl} not found`,
            statusCode: 404
        }
    });
};

module.exports = { errorHandler, notFoundHandler };
EOF
```

### 3.10 สร้าง Main Server File

```bash
cat > api/server.js << 'EOF'
// server.js
// Main entry point for Task Board API
// ENGSE207 - Week 6 Docker Version

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { healthCheck } = require('./src/config/database');
const taskRoutes = require('./src/routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

// CORS - อนุญาต requests จาก Nginx
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// ============================================
// Routes
// ============================================

// Health check endpoint (สำหรับ Docker health check)
app.get('/api/health', async (req, res) => {
    const dbHealth = await healthCheck();
    const healthy = dbHealth.status === 'healthy';
    
    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: dbHealth
    });
});

// API info
app.get('/api', (req, res) => {
    res.json({
        name: 'Task Board API',
        version: '2.0.0',
        description: 'ENGSE207 Week 6 - N-Tier Architecture (Docker)',
        endpoints: {
            health: 'GET /api/health',
            tasks: {
                list: 'GET /api/tasks',
                get: 'GET /api/tasks/:id',
                create: 'POST /api/tasks',
                update: 'PUT /api/tasks/:id',
                delete: 'DELETE /api/tasks/:id',
                stats: 'GET /api/tasks/stats'
            }
        }
    });
});

// Task routes
app.use('/api/tasks', taskRoutes);

// ============================================
// Error Handling
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

// Wait for database connection before starting
const startServer = async () => {
    try {
        // Test database connection
        const dbHealth = await healthCheck();
        if (dbHealth.status !== 'healthy') {
            console.error('❌ Database connection failed:', dbHealth.error);
            console.log('⏳ Waiting for database...');
            // Retry after 5 seconds
            setTimeout(startServer, 5000);
            return;
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log('=========================================');
            console.log('🚀 Task Board API Started');
            console.log('=========================================');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🗄️  Database: ${dbHealth.database}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('=========================================');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        setTimeout(startServer, 5000);
    }
};

startServer();
EOF
```

### ✅ Checkpoint 3: Backend API พร้อม

```bash
# ตรวจสอบไฟล์ที่สร้าง
ls -la api/
ls -la api/src/

# ควรเห็น:
# api/
# ├── Dockerfile
# ├── package.json
# ├── server.js
# └── src/
#     ├── config/database.js
#     ├── models/Task.js
#     ├── repositories/taskRepository.js
#     ├── services/taskService.js
#     ├── controllers/taskController.js
#     ├── routes/taskRoutes.js
#     └── middleware/errorHandler.js
```

---

## ส่วนที่ 4: สร้าง PostgreSQL Container (30 นาที)

### 4.1 สร้าง Database Initialization Script

```bash
cat > database/init.sql << 'EOF'
-- ============================================
-- Database Initialization Script
-- ENGSE207 - Week 6 Docker Version
-- ============================================

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_timestamp ON tasks;
CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert sample data
INSERT INTO tasks (title, description, status, priority) VALUES
    ('Setup Docker Environment', 'Install Docker and Docker Compose', 'DONE', 'HIGH'),
    ('Create Dockerfile', 'Write Dockerfile for API container', 'DONE', 'HIGH'),
    ('Configure PostgreSQL', 'Setup database container with init script', 'DONE', 'HIGH'),
    ('Setup Nginx', 'Configure reverse proxy and SSL', 'IN_PROGRESS', 'HIGH'),
    ('Create Docker Compose', 'Orchestrate all containers', 'IN_PROGRESS', 'MEDIUM'),
    ('Test API Endpoints', 'Verify all CRUD operations work', 'TODO', 'MEDIUM'),
    ('Write Documentation', 'Complete ANALYSIS.md', 'TODO', 'LOW'),
    ('Push to Git', 'Commit and push to repository', 'TODO', 'MEDIUM');

-- Verify data
SELECT 'Database initialized successfully!' as message;
SELECT COUNT(*) as total_tasks FROM tasks;
SELECT status, COUNT(*) as count FROM tasks GROUP BY status;
EOF
```

**💡 หมายเหตุ:**
- PostgreSQL container จะรัน script นี้อัตโนมัติเมื่อเริ่มต้นครั้งแรก
- ไฟล์ `.sql` ใน `/docker-entrypoint-initdb.d/` จะถูกรันตามลำดับ
- ข้อมูลจะถูกเก็บใน Docker volume (persistent)

### ✅ Checkpoint 4: Database Script พร้อม

```bash
# ตรวจสอบ
cat database/init.sql | head -20

# ควรเห็น CREATE TABLE และ INSERT statements
```

---

## ส่วนที่ 5: สร้าง Nginx Container (30 นาที)

### 5.1 Generate SSL Certificate

```bash
# สร้าง script สำหรับ generate SSL
cat > scripts/generate-ssl.sh << 'EOF'
#!/bin/bash
# Generate self-signed SSL certificate for development

SSL_DIR="./nginx/ssl"
mkdir -p $SSL_DIR

echo "🔐 Generating SSL certificate..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $SSL_DIR/server.key \
    -out $SSL_DIR/server.crt \
    -subj "/C=TH/ST=ChiangMai/L=ChiangMai/O=RMUTL/OU=SoftwareEngineering/CN=localhost"

echo "✅ SSL certificate generated!"
echo "   Certificate: $SSL_DIR/server.crt"
echo "   Private Key: $SSL_DIR/server.key"
EOF

chmod +x scripts/generate-ssl.sh

# รัน script
./scripts/generate-ssl.sh
```

### 5.2 สร้าง Nginx Configuration

```bash
cat > nginx/nginx.conf << 'EOF'
# ============================================
# Main Nginx Configuration
# ENGSE207 - Week 6 Docker Version
# ============================================

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript 
               application/xml application/xml+rss text/javascript;

    # Include site configurations
    include /etc/nginx/conf.d/*.conf;
}
EOF
```

### 5.3 สร้าง Site Configuration

```bash
cat > nginx/conf.d/default.conf << 'EOF'
# ============================================
# Task Board Site Configuration
# ENGSE207 - Week 6 Docker Version
# ============================================

# Upstream backend (API container)
upstream api_backend {
    server api:3000;
}

# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name localhost;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name localhost;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory for static files
    root /usr/share/nginx/html;
    index index.html;

    # ============================================
    # API Proxy - Forward /api/* to backend
    # ============================================
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # CORS headers (backup)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    }

    # ============================================
    # Static Files - Serve frontend
    # ============================================
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
```

### ✅ Checkpoint 5: Nginx Configuration พร้อม

```bash
# ตรวจสอบไฟล์
ls -la nginx/
ls -la nginx/ssl/
ls -la nginx/conf.d/

# ควรเห็น:
# nginx/
# ├── nginx.conf
# ├── conf.d/
# │   └── default.conf
# └── ssl/
#     ├── server.crt
#     └── server.key
```

---

## ส่วนที่ 6: สร้าง Docker Compose (30 นาที)

### 6.1 สร้าง Environment File

```bash
cat > .env << 'EOF'
# ============================================
# Docker Environment Variables
# ENGSE207 - Week 6 Docker Version
# ============================================

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=taskboard_db
DB_USER=taskboard
DB_PASSWORD=taskboard123
POSTGRES_DB=taskboard_db
POSTGRES_USER=taskboard
POSTGRES_PASSWORD=taskboard123

# API Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=https://localhost

# Nginx Configuration
NGINX_HOST=localhost
NGINX_PORT=443
EOF
```

```bash
cat > .env.example << 'EOF'
# ============================================
# Docker Environment Variables Template
# Copy this file to .env and update values
# ============================================

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=taskboard_db
DB_USER=taskboard
DB_PASSWORD=your_secure_password_here
POSTGRES_DB=taskboard_db
POSTGRES_USER=taskboard
POSTGRES_PASSWORD=your_secure_password_here

# API Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=https://localhost

# Nginx Configuration
NGINX_HOST=localhost
NGINX_PORT=443
EOF
```

### 6.2 สร้าง Docker Compose File

```bash
cat > docker-compose.yml << 'EOF'
# ============================================
# Docker Compose - N-Tier Architecture
# ENGSE207 - Week 6 Docker Version
# ============================================
# 
# Services:
# 1. db     - PostgreSQL Database
# 2. api    - Node.js Backend API
# 3. nginx  - Web Server & Reverse Proxy
#
# Usage:
#   docker compose up -d      # Start all services
#   docker compose down       # Stop all services
#   docker compose logs -f    # View logs
# ============================================

version: '3.8'

services:
  # ============================================
  # Database Service - PostgreSQL
  # ============================================
  db:
    image: postgres:16-alpine
    container_name: taskboard-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-taskboard_db}
      POSTGRES_USER: ${POSTGRES_USER:-taskboard}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-taskboard123}
    volumes:
      # Persistent data storage
      - postgres_data:/var/lib/postgresql/data
      # Initialization scripts (run once on first start)
      - ./database/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-taskboard} -d ${POSTGRES_DB:-taskboard_db}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - taskboard-network
    # Only expose port for debugging (optional)
    # ports:
    #   - "5432:5432"

  # ============================================
  # API Service - Node.js Backend
  # ============================================
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: taskboard-api
    restart: unless-stopped
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=${PORT:-3000}
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=${DB_NAME:-taskboard_db}
      - DB_USER=${DB_USER:-taskboard}
      - DB_PASSWORD=${DB_PASSWORD:-taskboard123}
      - CORS_ORIGIN=${CORS_ORIGIN:-https://localhost}
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    networks:
      - taskboard-network
    # Only expose port for debugging (optional)
    # ports:
    #   - "3000:3000"

  # ============================================
  # Nginx Service - Web Server & Reverse Proxy
  # ============================================
  nginx:
    image: nginx:alpine
    container_name: taskboard-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Nginx configuration
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      # SSL certificates
      - ./nginx/ssl:/etc/nginx/ssl:ro
      # Frontend static files
      - ./frontend:/usr/share/nginx/html:ro
    depends_on:
      api:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - taskboard-network

# ============================================
# Networks
# ============================================
networks:
  taskboard-network:
    driver: bridge
    name: taskboard-network

# ============================================
# Volumes
# ============================================
volumes:
  postgres_data:
    name: taskboard-postgres-data
EOF
```

**💡 อธิบาย Docker Compose:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE STRUCTURE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  docker-compose.yml                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  services:                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  db:                                                     │   │    │
│  │  │    image: postgres:16-alpine                             │   │    │
│  │  │    volumes: postgres_data                                │   │    │
│  │  │    healthcheck: pg_isready                               │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │         │                                                       │    │
│  │         │ depends_on (wait until healthy)                       │    │
│  │         ▼                                                       │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  api:                                                    │   │    │
│  │  │    build: ./api/Dockerfile                               │   │    │
│  │  │    environment: DB_HOST=db                               │   │    │
│  │  │    healthcheck: /api/health                              │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │         │                                                       │    │
│  │         │ depends_on (wait until healthy)                       │    │
│  │         ▼                                                       │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  nginx:                                                  │   │    │
│  │  │    image: nginx:alpine                                   │   │    │
│  │  │    ports: 80, 443                                        │   │    │
│  │  │    volumes: config, ssl, frontend                        │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │                                                                 │    │
│  │  networks:                                                      │    │
│  │    taskboard-network (bridge)                                   │    │
│  │                                                                 │    │
│  │  volumes:                                                       │    │
│  │    postgres_data (persistent)                                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 สร้าง Frontend Files

```bash
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Board - N-Tier Docker</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1>📋 Task Board</h1>
            <p class="subtitle">N-Tier Architecture with Docker (Version 2)</p>
            <div class="stats" id="stats">
                <span class="stat-item">📊 Loading...</span>
            </div>
        </header>

        <!-- Add Task Form -->
        <section class="add-task-section">
            <h2>➕ Add New Task</h2>
            <form id="taskForm" class="task-form">
                <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" name="title" required 
                           placeholder="Enter task title" maxlength="200">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" 
                              placeholder="Enter task description"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status">
                            <option value="TODO">📝 TODO</option>
                            <option value="IN_PROGRESS">🔄 In Progress</option>
                            <option value="DONE">✅ Done</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="priority">Priority</label>
                        <select id="priority" name="priority">
                            <option value="LOW">🟢 Low</option>
                            <option value="MEDIUM" selected>🟡 Medium</option>
                            <option value="HIGH">🔴 High</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Create Task</button>
            </form>
        </section>

        <!-- Task Board -->
        <section class="board-section">
            <h2>📌 Task Board</h2>
            <div class="board" id="board">
                <div class="column" id="todo-column">
                    <h3>📝 TODO</h3>
                    <div class="task-list" id="todo-list"></div>
                </div>
                <div class="column" id="progress-column">
                    <h3>🔄 In Progress</h3>
                    <div class="task-list" id="progress-list"></div>
                </div>
                <div class="column" id="done-column">
                    <h3>✅ Done</h3>
                    <div class="task-list" id="done-list"></div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <p>ENGSE207 Software Architecture - Week 6 Docker Version</p>
            <p>🐳 Powered by Docker Containers</p>
        </footer>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
EOF
```

```bash
cat > frontend/css/style.css << 'EOF'
/* ============================================
   Task Board Styles
   ENGSE207 - Week 6 Docker Version
   ============================================ */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    min-height: 100vh;
    color: #e8e8e8;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
.header {
    text-align: center;
    padding: 30px 0;
    margin-bottom: 30px;
}

.header h1 {
    font-size: 2.5rem;
    color: #00d9ff;
    margin-bottom: 10px;
}

.subtitle {
    color: #888;
    font-size: 1.1rem;
    margin-bottom: 20px;
}

.stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.stat-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 0.9rem;
}

/* Add Task Section */
.add-task-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 30px;
}

.add-task-section h2 {
    margin-bottom: 20px;
    color: #00d9ff;
}

.task-form {
    display: grid;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-weight: 500;
    color: #aaa;
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: 12px;
    border: 1px solid #333;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #00d9ff;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #00d9ff, #0099cc);
    color: #fff;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 217, 255, 0.3);
}

/* Board Section */
.board-section {
    margin-bottom: 30px;
}

.board-section h2 {
    margin-bottom: 20px;
    color: #00d9ff;
}

.board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.column {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    min-height: 400px;
}

.column h3 {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

#todo-column h3 { color: #ffcc00; }
#progress-column h3 { color: #00ccff; }
#done-column h3 { color: #00ff88; }

.task-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Task Card */
.task-card {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 15px;
    border-left: 4px solid #666;
    transition: all 0.3s ease;
}

.task-card:hover {
    transform: translateX(5px);
    background: rgba(0, 0, 0, 0.4);
}

.task-card.priority-high { border-left-color: #ff4444; }
.task-card.priority-medium { border-left-color: #ffcc00; }
.task-card.priority-low { border-left-color: #00ff88; }

.task-title {
    font-weight: 600;
    margin-bottom: 8px;
}

.task-description {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 10px;
}

.task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #666;
}

.task-actions {
    display: flex;
    gap: 5px;
}

.task-actions button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
}

.btn-status {
    background: #333;
    color: #fff;
}

.btn-status:hover {
    background: #00d9ff;
}

.btn-delete {
    background: #ff4444;
    color: #fff;
}

.btn-delete:hover {
    background: #ff6666;
}

/* Footer */
.footer {
    text-align: center;
    padding: 20px;
    color: #666;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
    .board {
        grid-template-columns: 1fr;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}

/* Loading Animation */
.loading {
    text-align: center;
    padding: 20px;
    color: #888;
}

/* Error Message */
.error-message {
    background: rgba(255, 68, 68, 0.2);
    border: 1px solid #ff4444;
    color: #ff6666;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
}
EOF
```

```bash
cat > frontend/js/app.js << 'EOF'
// ============================================
// Task Board Frontend Application
// ENGSE207 - Week 6 Docker Version
// ============================================

const API_BASE = '/api';

// ============================================
// API Functions
// ============================================

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API Error');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Get all tasks
async function getTasks() {
    const response = await fetchAPI('/tasks');
    return response.data;
}

// Create task
async function createTask(taskData) {
    const response = await fetchAPI('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
    return response.data;
}

// Update task
async function updateTask(id, taskData) {
    const response = await fetchAPI(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
    });
    return response.data;
}

// Delete task
async function deleteTask(id) {
    await fetchAPI(`/tasks/${id}`, {
        method: 'DELETE'
    });
}

// Get statistics
async function getStats() {
    const response = await fetchAPI('/tasks/stats');
    return response.data;
}

// ============================================
// UI Functions
// ============================================

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority.toLowerCase()}`;
    card.dataset.id = task.id;
    
    const statusEmoji = {
        'TODO': '📝',
        'IN_PROGRESS': '🔄',
        'DONE': '✅'
    };
    
    const priorityEmoji = {
        'LOW': '🟢',
        'MEDIUM': '🟡',
        'HIGH': '🔴'
    };
    
    card.innerHTML = `
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
            <span>${priorityEmoji[task.priority]} ${task.priority}</span>
            <div class="task-actions">
                ${task.status !== 'DONE' ? `
                    <button class="btn-status" onclick="moveTask(${task.id}, '${getNextStatus(task.status)}')">
                        Move →
                    </button>
                ` : ''}
                ${task.status !== 'IN_PROGRESS' ? `
                    <button class="btn-delete" onclick="removeTask(${task.id})">
                        Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function getNextStatus(currentStatus) {
    const flow = {
        'TODO': 'IN_PROGRESS',
        'IN_PROGRESS': 'DONE',
        'DONE': 'DONE'
    };
    return flow[currentStatus];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function renderTasks() {
    const todoList = document.getElementById('todo-list');
    const progressList = document.getElementById('progress-list');
    const doneList = document.getElementById('done-list');
    
    todoList.innerHTML = '<div class="loading">Loading...</div>';
    progressList.innerHTML = '<div class="loading">Loading...</div>';
    doneList.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const tasks = await getTasks();
        
        todoList.innerHTML = '';
        progressList.innerHTML = '';
        doneList.innerHTML = '';
        
        tasks.forEach(task => {
            const card = createTaskCard(task);
            
            switch (task.status) {
                case 'TODO':
                    todoList.appendChild(card);
                    break;
                case 'IN_PROGRESS':
                    progressList.appendChild(card);
                    break;
                case 'DONE':
                    doneList.appendChild(card);
                    break;
            }
        });
        
        if (todoList.children.length === 0) {
            todoList.innerHTML = '<div class="loading">No tasks</div>';
        }
        if (progressList.children.length === 0) {
            progressList.innerHTML = '<div class="loading">No tasks</div>';
        }
        if (doneList.children.length === 0) {
            doneList.innerHTML = '<div class="loading">No tasks</div>';
        }
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        todoList.innerHTML = '<div class="error-message">Failed to load tasks</div>';
    }
}

async function renderStats() {
    const statsDiv = document.getElementById('stats');
    
    try {
        const stats = await getStats();
        
        statsDiv.innerHTML = `
            <span class="stat-item">📊 Total: ${stats.total}</span>
            <span class="stat-item">📝 TODO: ${stats.byStatus.TODO}</span>
            <span class="stat-item">🔄 In Progress: ${stats.byStatus.IN_PROGRESS}</span>
            <span class="stat-item">✅ Done: ${stats.byStatus.DONE}</span>
            <span class="stat-item">📈 Completion: ${stats.completionRate}%</span>
        `;
    } catch (error) {
        console.error('Error loading stats:', error);
        statsDiv.innerHTML = '<span class="stat-item">❌ Failed to load stats</span>';
    }
}

// ============================================
// Event Handlers
// ============================================

async function moveTask(id, newStatus) {
    try {
        await updateTask(id, { status: newStatus });
        await renderTasks();
        await renderStats();
    } catch (error) {
        alert('Error moving task: ' + error.message);
    }
}

async function removeTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        await deleteTask(id);
        await renderTasks();
        await renderStats();
    } catch (error) {
        alert('Error deleting task: ' + error.message);
    }
}

// Form submit
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value
    };
    
    try {
        await createTask(formData);
        e.target.reset();
        await renderTasks();
        await renderStats();
    } catch (error) {
        alert('Error creating task: ' + error.message);
    }
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🐳 Task Board - Docker Version Initialized');
    renderTasks();
    renderStats();
    
    // Auto refresh every 30 seconds
    setInterval(() => {
        renderTasks();
        renderStats();
    }, 30000);
});
EOF
```

### 6.4 สร้าง Helper Scripts

```bash
# Start script
cat > scripts/start.sh << 'EOF'
#!/bin/bash
echo "🐳 Starting Task Board (Docker Version)..."
docker compose up -d
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "✅ Task Board is running!"
echo "🌐 Open https://localhost in your browser"
echo ""
echo "📝 Useful commands:"
echo "   docker compose logs -f     # View logs"
echo "   docker compose ps          # Check status"
echo "   docker compose down        # Stop all"
EOF

# Stop script
cat > scripts/stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping Task Board..."
docker compose down
echo "✅ All services stopped"
EOF

# Logs script
cat > scripts/logs.sh << 'EOF'
#!/bin/bash
echo "📋 Viewing logs (Ctrl+C to exit)..."
docker compose logs -f
EOF

# Test API script
cat > scripts/test-api.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing API Endpoints..."
echo ""

BASE_URL="https://localhost"
# Use -k to ignore SSL certificate warning for self-signed cert

echo "1. Health Check:"
curl -k -s $BASE_URL/api/health | jq .
echo ""

echo "2. Get All Tasks:"
curl -k -s $BASE_URL/api/tasks | jq .
echo ""

echo "3. Get Statistics:"
curl -k -s $BASE_URL/api/tasks/stats | jq .
echo ""

echo "4. Create New Task:"
curl -k -s -X POST $BASE_URL/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Test from script","description":"Created by test-api.sh","priority":"HIGH"}' | jq .
echo ""

echo "✅ API tests completed!"
EOF

# Make scripts executable
chmod +x scripts/*.sh
```

### ✅ Checkpoint 6: Docker Compose และ Frontend พร้อม

```bash
# ตรวจสอบไฟล์ทั้งหมด
ls -la
ls -la frontend/
ls -la scripts/

# ควรเห็น:
# docker-compose.yml
# .env
# frontend/index.html, css/style.css, js/app.js
# scripts/start.sh, stop.sh, logs.sh, test-api.sh
```

---

## ส่วนที่ 7: Testing และ Verification (30 นาที)

### 7.1 Start All Containers

```bash
# เริ่ม containers ทั้งหมด
docker compose up -d

# หรือใช้ script
./scripts/start.sh
```

**Output ที่คาดหวัง:**
```
[+] Running 4/4
 ✔ Network taskboard-network       Created
 ✔ Volume "taskboard-postgres-data" Created
 ✔ Container taskboard-db          Started
 ✔ Container taskboard-api         Started
 ✔ Container taskboard-nginx       Started
```

### 7.2 ตรวจสอบ Container Status

```bash
# ดู status ของ containers
docker compose ps

# Output ที่คาดหวัง:
# NAME              IMAGE                COMMAND                  SERVICE   STATUS
# taskboard-api     week6-ntier-docker-api   "docker-entrypoint.s…"   api       Up (healthy)
# taskboard-db      postgres:16-alpine       "docker-entrypoint.s…"   db        Up (healthy)
# taskboard-nginx   nginx:alpine             "/docker-entrypoint.…"   nginx     Up (healthy)
```

### 7.3 ตรวจสอบ Logs

```bash
# ดู logs ทั้งหมด
docker compose logs

# ดู logs แต่ละ service
docker compose logs db
docker compose logs api
docker compose logs nginx

# ดู logs แบบ follow
docker compose logs -f api
```

### 7.4 ทดสอบแต่ละ Container

**ทดสอบ Database Container:**
```bash
# เข้าไปใน container
docker exec -it taskboard-db psql -U taskboard -d taskboard_db

# รัน SQL commands
SELECT * FROM tasks;
SELECT COUNT(*) FROM tasks;
\q
```

**ทดสอบ API Container:**
```bash
# ดู logs
docker logs taskboard-api

# ทดสอบ health endpoint
docker exec taskboard-api wget -q -O - http://localhost:3000/api/health
```

**ทดสอบ Nginx Container:**
```bash
# ดู nginx config
docker exec taskboard-nginx cat /etc/nginx/conf.d/default.conf

# ดู nginx status
docker exec taskboard-nginx nginx -t
```

### 7.5 ทดสอบ API Endpoints

```bash
# รัน test script
./scripts/test-api.sh

# หรือทดสอบ manual ด้วย curl
curl -k https://localhost/api/health | jq .
curl -k https://localhost/api/tasks | jq .
curl -k https://localhost/api/tasks/stats | jq .
```

### 7.6 ทดสอบผ่าน Browser

1. เปิด Browser ไปที่ `https://localhost`
2. Accept self-signed certificate warning
3. ตรวจสอบว่า:
   - ✅ หน้าเว็บแสดงผลถูกต้อง
   - ✅ Tasks แสดงในแต่ละ column
   - ✅ Statistics แสดงถูกต้อง
   - ✅ สามารถสร้าง Task ใหม่ได้
   - ✅ สามารถย้าย Task ได้
   - ✅ สามารถลบ Task ได้

### ✅ Checkpoint 7: ระบบทำงานสมบูรณ์

```
✅ Checklist:
[ ] docker compose ps - ทุก container มี status "Up (healthy)"
[ ] https://localhost/api/health - ตอบ {"status": "healthy"}
[ ] https://localhost/api/tasks - แสดงรายการ tasks
[ ] https://localhost - หน้าเว็บแสดงผลถูกต้อง
[ ] Create Task - สร้าง task ใหม่ได้
[ ] Update Task - ย้าย status ได้
[ ] Delete Task - ลบ task ได้
```

---

## ส่วนที่ 8: การวิเคราะห์เปรียบเทียบ VM vs Docker (30 นาที) ⭐

### 8.1 สร้างเอกสาร ANALYSIS.md

**⭐ ส่วนนี้นักศึกษาต้องเขียนเอง:**

```bash
cat > docs/ANALYSIS.md << 'EOF'
# 📊 การวิเคราะห์เปรียบเทียบ: VM vs Docker Deployment
## ENGSE207 - Week 6 N-Tier Architecture

**ชื่อ-นามสกุล:** [กรอกชื่อนักศึกษา]  
**รหัสนักศึกษา:** [กรอกรหัส]  
**วันที่:** [กรอกวันที่]

---

## 1. ตารางเปรียบเทียบ Setup Process

| ขั้นตอน | Version 1 (VM) | Version 2 (Docker) |
|---------|----------------|-------------------|
| ติดตั้ง PostgreSQL | [อธิบาย] | [อธิบาย] |
| ติดตั้ง Node.js | [อธิบาย] | [อธิบาย] |
| ติดตั้ง Nginx | [อธิบาย] | [อธิบาย] |
| Configure Database | [อธิบาย] | [อธิบาย] |
| Configure SSL | [อธิบาย] | [อธิบาย] |
| Start Services | [อธิบาย] | [อธิบาย] |
| **เวลาทั้งหมด** | [ประมาณกี่นาที] | [ประมาณกี่นาที] |

---

## 2. ตารางเปรียบเทียบ Resource Usage

| Resource | Version 1 (VM) | Version 2 (Docker) |
|----------|----------------|-------------------|
| Memory Usage | [ใช้ `free -h`] | [ใช้ `docker stats`] |
| Disk Usage | [ใช้ `df -h`] | [ใช้ `docker system df`] |
| CPU Usage | [ประมาณการ] | [ประมาณการ] |
| Startup Time | [กี่วินาที] | [กี่วินาที] |

---

## 3. ข้อดีของ Docker Deployment (เขียน 5 ข้อ)

1. **[หัวข้อ]:** [อธิบายรายละเอียด]

2. **[หัวข้อ]:** [อธิบายรายละเอียด]

3. **[หัวข้อ]:** [อธิบายรายละเอียด]

4. **[หัวข้อ]:** [อธิบายรายละเอียด]

5. **[หัวข้อ]:** [อธิบายรายละเอียด]

---

## 4. ข้อเสียของ Docker Deployment (เขียน 3 ข้อ)

1. **[หัวข้อ]:** [อธิบายรายละเอียด]

2. **[หัวข้อ]:** [อธิบายรายละเอียด]

3. **[หัวข้อ]:** [อธิบายรายละเอียด]

---

## 5. เมื่อไหร่ควรใช้ VM vs Docker?

### ควรใช้ VM เมื่อ:
- [เขียน 3 สถานการณ์]

### ควรใช้ Docker เมื่อ:
- [เขียน 3 สถานการณ์]

---

## 6. สิ่งที่ได้เรียนรู้จาก Lab นี้

[เขียน 3-5 ประโยค สรุปสิ่งที่ได้เรียนรู้]

---

## 7. คำสั่ง Docker ที่ใช้บ่อย (Quick Reference)

```bash
# รายการคำสั่งที่นักศึกษาจดไว้
[เขียนคำสั่งที่ใช้บ่อย]
```

### 8 คำสั่งสำหรับเก็บข้อมูล

```bash
# ดู memory usage ของ Docker
docker stats --no-stream

# ดู disk usage
docker system df

# ดู container sizes
docker ps -s

# ดู image sizes
docker images

# ดู network
docker network ls
docker network inspect taskboard-network
```
---

*สร้างโดย: [ชื่อนักศึกษา]*  
*ENGSE207 Software Architecture - Week 6*
EOF
```


---

## 📝 การส่งงานและเกณฑ์การให้คะแนน

### วิธีการส่งงานบน Git

```bash
# ตรวจสอบว่าอยู่ใน project directory
cd ~/engse207-labs/week6-ntier-docker

# ตรวจสอบ status
git status

# Add ไฟล์ทั้งหมด (ยกเว้น .env และ ssl keys)
git add .

# Commit
git commit -m "Week 6: N-Tier Architecture with Docker (Version 2)"

# สร้าง repository บน GitHub แล้ว push
git remote add origin https://github.com/YOUR_USERNAME/week6-ntier-docker.git
git branch -M main
git push -u origin main
```

### สิ่งที่ต้องส่ง:

| รายการ | คำอธิบาย |
|--------|---------|
| **Source Code** | ทุกไฟล์ใน repository |
| **docker-compose.yml** | ไฟล์ orchestration |
| **ANALYSIS.md** | การวิเคราะห์เปรียบเทียบ (⭐ต้องเขียนเอง) |
| **Screenshots** | หลักฐานว่าระบบทำงาน |
| **README.md** | วิธีการรันโปรเจกต์ |

### เกณฑ์การให้คะแนน (40 คะแนน):

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|-----------|
| **Docker Setup** | 8 | Dockerfile, docker-compose.yml ถูกต้อง |
| **Backend API** | 8 | CRUD operations ทำงานได้ |
| **Nginx + SSL** | 6 | Reverse proxy และ HTTPS ทำงาน |
| **Frontend** | 4 | แสดงผลและใช้งานได้ |
| **ANALYSIS.md** ⭐ | 10 | การวิเคราะห์เปรียบเทียบ VM vs Docker |
| **Code Quality** | 2 | โค้ดอ่านง่าย, มี comments |
| **Git** | 2 | Commit history สมเหตุสมผล |
| **รวม** | **40** | |

---

## 🛠️ แก้ปัญหาเบื้องต้น

### Docker Compose Issues

**Containers ไม่ start:**
```bash
# ดู error logs
docker compose logs

# Restart ใหม่
docker compose down
docker compose up -d
```

**Port already in use:**
```bash
# ตรวจสอบ port
sudo lsof -i :80
sudo lsof -i :443

# หยุด process ที่ใช้ port
sudo systemctl stop nginx  # ถ้า nginx รันบน host
```

### Database Issues

**Cannot connect to database:**
```bash
# ตรวจสอบว่า db container ทำงาน
docker compose ps db

# ดู logs
docker compose logs db

# เข้าไปทดสอบ
docker exec -it taskboard-db psql -U taskboard -d taskboard_db
```

**Database ไม่มีข้อมูล:**
```bash
# ลบ volume และเริ่มใหม่
docker compose down -v
docker compose up -d
```

### API Issues

**API ไม่ respond:**
```bash
# ตรวจสอบ health
docker compose logs api

# Restart api
docker compose restart api
```

### Nginx Issues

**502 Bad Gateway:**
```bash
# API container อาจยังไม่พร้อม
docker compose logs api
docker compose restart nginx
```

**SSL Certificate Error:**
```bash
# Generate certificate ใหม่
./scripts/generate-ssl.sh
docker compose restart nginx
```

### Clean Restart

```bash
# ลบทุกอย่างและเริ่มใหม่
docker compose down -v
docker system prune -f
./scripts/generate-ssl.sh
docker compose up -d --build
```

---

## 📁 สรุปไฟล์ทั้งหมดที่ต้องสร้าง

```
week6-ntier-docker/
├── docker-compose.yml          ✅
├── .env                        ✅
├── .env.example                ✅
├── .gitignore                  ✅
├── .dockerignore               ✅
│
├── api/
│   ├── Dockerfile              ✅
│   ├── package.json            ✅
│   ├── server.js               ✅
│   └── src/
│       ├── config/database.js  ✅
│       ├── models/Task.js      ✅
│       ├── repositories/taskRepository.js  ✅
│       ├── services/taskService.js         ✅
│       ├── controllers/taskController.js   ✅
│       ├── routes/taskRoutes.js            ✅
│       └── middleware/errorHandler.js      ✅
│
├── nginx/
│   ├── nginx.conf              ✅
│   ├── conf.d/default.conf     ✅
│   └── ssl/
│       ├── server.crt          ✅ (generated)
│       └── server.key          ✅ (generated)
│
├── frontend/
│   ├── index.html              ✅
│   ├── css/style.css           ✅
│   └── js/app.js               ✅
│
├── database/
│   └── init.sql                ✅
│
├── scripts/
│   ├── start.sh                ✅
│   ├── stop.sh                 ✅
│   ├── logs.sh                 ✅
│   ├── test-api.sh             ✅
│   └── generate-ssl.sh         ✅
│
└── docs/
    └── ANALYSIS.md             ⭐ (นักศึกษาต้องเขียน)
```

---

## 🎉 ยินดีด้วย!

คุณได้สำเร็จ:
- ✅ Containerize N-Tier Application ด้วย Docker
- ✅ ใช้ Docker Compose จัดการ Multi-Container Application
- ✅ Setup Docker Network สำหรับ Internal Communication
- ✅ ใช้ Docker Volumes สำหรับ Persistent Data
- ✅ **วิเคราะห์และเปรียบเทียบ VM vs Docker Deployment** ⭐

**ทักษะเหล่านี้ใช้จริงใน:**
- Cloud deployments (AWS ECS, Google Cloud Run, Azure Container)
- Kubernetes / Container Orchestration
- CI/CD Pipelines
- DevOps practices
- Microservices Architecture

---

## 📚 ขั้นตอนต่อไป

**เตรียมตัวสำหรับ Week 7: Cloud & Containerization**
- ศึกษา 12-Factor App Principles
- เรียนรู้ Cloud Service Models (IaaS/PaaS/SaaS)
- ทำความเข้าใจ Kubernetes basics

---

*ENGSE207 - Software Architecture*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
