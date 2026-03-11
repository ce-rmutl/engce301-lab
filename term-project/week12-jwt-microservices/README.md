# 🔐 คู่มือปฏิบัติการ ENGCE301 — สัปดาห์ที่ 12
## Security-Aware Architecture: Task Board พร้อม Auth, JWT และ Centralized Logging

**สัปดาห์:** 12 | **ระยะเวลา:** 3 ชั่วโมง | **ระดับความยาก:** ⭐⭐⭐⭐ | **Version:** 2.0

> 🔗 **ต่อเนื่องจาก:** Week 6 (N-Tier Docker) → Week 7 (Cloud Deploy) → **Week 12 (Secure Architecture)**

---

## 📋 สารบัญ

1. [วัตถุประสงค์และ CLO](#-วัตถุประสงค์การเรียนรู้)
2. [ภาพรวม: จาก Week 6-7 → Week 12](#-ภาพรวม-week-6-7--week-12)
3. [สถาปัตยกรรมที่จะสร้าง](#-สถาปัตยกรรม-task-board-ที่เพิ่ม-security-components)
4. [ทฤษฎีสั้น: JWT, Auth Flow, Zero-Trust พื้นฐาน](#-ทฤษฎีสั้น-ก่อนลงมือทำ)
5. [เตรียม Project Structure](#-สิ่งที่ต้องเตรียม)
6. [Part 1: สร้าง Auth Service](#-part-1-สร้าง-auth-service-40-นาที)
7. [Part 2: สร้าง User Service](#-part-2-สร้าง-user-service-20-นาที)
8. [Part 3: สร้าง Task Service พร้อม JWT Guard](#-part-3-สร้าง-task-service-พร้อม-jwt-guard-20-นาที)
9. [Part 4: API Gateway (Nginx) + Rate Limiting](#-part-4-api-gateway-nginx--rate-limiting-15-นาที)
10. [Part 5: Centralized Logging ด้วย Loki + Grafana](#-part-5-centralized-logging-ด้วย-loki--grafana-20-นาที)
11. [Part 6: Docker Compose รวมทุก Service](#-part-6-docker-compose-รวมทุก-service-15-นาที)
12. [Part 7: Frontend — Task Board UI แบบแยกไฟล์](#-part-7-frontend--task-board-ui-20-นาที)
13. [Part 8: Security Test Cases](#-part-8-security-test-cases-40-นาที)
14. [ใบงาน + ส่งงาน Git](#-ใบงาน--การส่งงาน)
15. [Challenge: ต่อยอด](#-challenge-ต่อยอด)
16. [Draw.io Diagrams](#-drawio-xml-diagrams)
17. [Troubleshooting](#-troubleshooting)

---

## 🎯 วัตถุประสงค์การเรียนรู้

| ✅ | วัตถุประสงค์ | CLO |
|---|------------|-----|
| ☐ | อธิบายบทบาทของ Auth Service, JWT, API Gateway ในสถาปัตยกรรมได้ | CLO3, CLO5 |
| ☐ | เพิ่ม Auth Service เข้าใน Docker Compose ของ Task Board ได้ | CLO6, CLO14 |
| ☐ | ออกแบบ JWT Authentication Flow ระหว่าง Services ได้ | CLO6, CLO7 |
| ☐ | ทดสอบ API ทั้งแบบ มี และ ไม่มี JWT Token ได้ | CLO5, CLO14 |
| ☐ | ตั้งค่า Centralized Logging ด้วย Loki + Grafana ได้ | CLO14 |
| ☐ | เปรียบเทียบ Architecture ก่อน/หลังเพิ่ม Security ได้ | CLO3, CLO6 |

---

## 🔄 ภาพรวม: Week 6-7 → Week 12

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  วิวัฒนาการสถาปัตยกรรม Task Board                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   WEEK 6: N-Tier บน Docker (Local)                                          │
│   ─────────────────────────────────                                         │
│   nginx → api (Node.js) → PostgreSQL                                        │
│   ❌ ไม่มี Authentication                                                     │
│   ❌ ทุกคนเรียก API ได้โดยตรง                                                  │
│   ❌ ไม่มี Logging รวมศูนย์                                                     │
│                                                                             │
│   WEEK 7: Deploy บน Railway (Cloud)                                         │
│   ──────────────────────────────────                                        │
│   Frontend + Backend + DB → Railway PaaS                                    │
│   ⚠️ HTTPS อัตโนมัติ แต่ยังไม่มี Auth                                              │
│                                                                             │
│   ─────────────────────────────────────────────────────────────             │
│                           ↓  Week 12  ↓                                     │
│   ─────────────────────────────────────────────────────────────             │
│                                                                             │
│   WEEK 12: Security-Aware Architecture (Docker Compose)                     │
│   ──────────────────────────────────────────────────────                    │
│   ✅ Auth Service  → ออก JWT Token                                          │
│   ✅ API Gateway   → Rate Limit + Security Headers                          │
│   ✅ Task Service  → Protected Endpoints (JWT verify)                       │
│   ✅ User Service  → User Management + Role-based Access                    │
│   ✅ Loki+Grafana  → Centralized Logging ผ่าน Docker Driver                  │
│   ✅ Rate Limiting → กันโจมตี Brute-force                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ สถาปัตยกรรม Task Board ที่เพิ่ม Security Components

```
┌────────────────────────────────────────────────────────────────────────────┐
│         C2: Container Diagram — Task Board Security Architecture           │
│                     (Week 12 — Version 2.0)                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   🌐 Browser                                                               │
│        │                                                                   │
│        │ HTTP :80                                                          │
│        ▼                                                                   │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │   🛡️ Nginx (API Gateway + Rate Limiter)                           │    │
│   │   Port: 80  |  Rate: 20r/m auth, 60r/m api                        │    │
│   │   • Route: /api/auth/*  → auth-service:3001   (public)            │    │
│   │   • Route: /api/tasks/* → task-service:3002   (JWT required)      │    │
│   │   • Route: /api/users/* → user-service:3003   (JWT required)      │    │
│   │   • Route: /          → frontend (static HTML/CSS/JS)             │    │
│   └─────────────────────┬─────────────────────────────────────────────┘    │
│                         │  Docker Network: taskboard-net                   │
│         ┌───────────────┼───────────────────────┐                          │
│         │               │                       │                          │
│         ▼               ▼                       ▼                          │
│   ┌───────────┐   ┌──────────────┐         ┌───────────┐                   │
│   │  🔑 Auth  │   │  📋 Task     │         │  👤 User  │                   │
│   │  Service  │   │  Service     │         │  Service  │                   │
│   │  :3001    │   │  :3002       │         │  :3003    │                   │
│   │           │   │              │         │           │                   │
│   │ • Login   │   │ • CRUD Tasks │         │ • Profile │                   │
│   │ • Register│   │ • JWT verify │         │ • Roles   │                   │
│   │ • Issue   │   │   (middleware│         │ • JWT     │                   │
│   │   JWT     │   │   check)     │         │   verify  │                   │
│   └─────┬─────┘   └──────┬───────┘         └─────┬─────┘                   │
│         │                │                       │                         │
│         ▼                ▼                       ▼                         │
│   ┌───────────┐   ┌─────────────┐         ┌───────────┐                    │
│   │  auth-db  │   │  task-db    │         │  user-db  │                    │
│   │ PostgreSQL│   │ PostgreSQL  │         │ PostgreSQL│                    │
│   └───────────┘   └─────────────┘         └───────────┘                    │
│                                                                            │
│   ┌──────────────────────────────────────────────────────────────┐         │
│   │   📊 Logging Stack (Loki Docker Driver — cross-platform)     │         │
│   │                                                              │         │
│   │   Container stdout → [Loki Docker Driver Plugin]             │         │
│   │                              │                               │         │
│   │                    ┌─────────┴──────────┐                    │         │
│   │                    │  Loki :3100        │                    │         │
│   │                    │  (log storage)     │                    │         │
│   │                    └─────────┬──────────┘                    │         │
│   │                              │                               │         │
│   │                    ┌─────────┴──────────┐                    │         │
│   │                    │  Grafana :3030     │                    │         │
│   │                    │  (dashboard)       │                    │         │
│   │                    └────────────────────┘                    │         │
│   └──────────────────────────────────────────────────────────────┘         │
│                                                                            │
│   🔑 Legend:                                                               │
│   • แต่ละ Service มี DB แยก (Database-per-Service pattern)                   │
│   • JWT Secret ใช้ร่วมกัน (shared via Docker env)                             │
│   • Log ส่งผ่าน Loki Docker Driver Plugin (ไม่ใช้ Promtail)                    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 📚 ทฤษฎีสั้น ก่อนลงมือทำ

### 🔐 JWT คืออะไร? (5 นาที)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       JWT ในการปฏิบัติ                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   JWT = Header . Payload . Signature                                        │
│                                                                             │
│   ┌───────────────┐  ┌──────────────────────┐  ┌──────────────────────┐     │
│   │   HEADER      │  │      PAYLOAD         │  │     SIGNATURE        │     │
│   │  (Red)        │  │     (Purple)         │  │      (Blue)          │     │
│   │               │  │                      │  │                      │     │
│   │  {            │  │  {                   │  │  HMACSHA256(         │     │
│   │  "alg":"HS256"│  │  "sub": "user-001",  │  │    base64(header)    │     │
│   │  "typ":"JWT"  │  │  "email":"alice@...",│  │  + "."               │     │
│   │  }            │  │  "role":"member",    │  │  + base64(payload),  │     │
│   │               │  │  "iat":1700000000,   │  │    your-secret       │     │
│   │               │  │  "exp":1700003600    │  │  )                   │     │
│   │               │  │  }                   │  │                      │     │
│   └───────────────┘  └──────────────────────┘  └──────────────────────┘     │
│           │                     │                          │                │
│        อ่านได้            อ่านได้ (แค่ encode)         ตรวจสอบว่าถูกปลอมแปลง       │
│                         ❗อย่าใส่ password          หรือเปล่า                   │
│                                                                             │
│   ขั้นตอนการใช้งาน:                                                            │
│                                                                             │
│   1. User Login → Auth Service ตรวจ password → ออก JWT ให้                   │
│   2. User เก็บ JWT (ใน localStorage)                                         │
│   3. ทุก Request ส่ง JWT ใน Header: Authorization: Bearer <token>             │
│   4. API Service ตรวจ JWT: Signature ถูกต้อง? หมดอายุหรือยัง?                    │
│   5. ถ้าผ่าน → อนุญาต | ถ้าไม่ผ่าน → 401 Unauthorized                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🏗️ ทำไมต้องมี Auth Service แยก?

```
┌──────────────────────────────────────────────────────┐
│         Without Auth Service (Week 6)                │
│                                                      │
│  Browser ──► Nginx ──► Task API                      │
│                            │                         │
│                       ตรวจ password                  │
│                       ออก token                      │
│                       จัดการ user                     │
│                       จัดการ task  ← too many jobs!   │
│                                                      │
├──────────────────────────────────────────────────────┤
│         With Auth Service (Week 12)                  │
│                                                      │
│  Browser ──► Gateway ──► Auth Service  (login only)  │
│                  │                                   │
│                  ├──────► Task Service (tasks only)  │
│                  │                                   │
│                  └──────► User Service (users only)  │
│                                                      │
│  ✅ Single Responsibility                            │
│  ✅ ถ้า Auth โดน compromise → ไม่กระทบ Task Service    │
│  ✅ Scale Auth Service แยกได้                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 สิ่งที่ต้องเตรียม

### Software ที่ต้องมี

```bash
# ตรวจสอบ docker
docker --version         # Docker 24+
docker compose version   # Docker Compose v2+

# ตรวจสอบ node
node --version           # v18+
npm --version            # v9+
```

### ⚠️ ติดตั้ง Loki Docker Driver Plugin (ครั้งแรกต่อเครื่อง)

> **สำคัญมาก:** ต้องรันคำสั่งนี้ **ก่อน** `docker compose up` — ทำครั้งเดียวต่อเครื่อง

```bash
# ติดตั้ง Plugin
docker plugin install grafana/loki-docker-driver:latest \
  --alias loki \
  --grant-all-permissions

# ตรวจสอบว่าติดตั้งสำเร็จ (ต้องเห็น ENABLED: true)
docker plugin ls
```

**ผลที่ถูกต้อง:**
```
ID             NAME                                   DESCRIPTION              ENABLED
abc123def456   grafana/loki-docker-driver:latest      Loki Logging Driver      true
```

### โครงสร้าง Project ที่จะสร้าง

```
task-board-security/          ← root ของ project
├── docker-compose.yml        ← รวมทุก service
├── .env                      ← secret ทั้งหมด (อย่า commit!)
├── .env.example              ← template สำหรับทีม
├── .gitignore
├── nginx/
│   ├── nginx.conf            ← API Gateway config
│   └── Dockerfile
├── auth-service/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/auth.js
│   │   ├── middleware/jwtUtils.js
│   │   └── db/
│   │       ├── db.js
│   │       ├── init.sql      ← สร้าง table เท่านั้น (ไม่มี INSERT)
│   │       └── seed.js       ← ✨ NEW: generate bcrypt hash จริงตอน startup
│   ├── package.json
│   └── Dockerfile
├── task-service/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/tasks.js
│   │   ├── middleware/authMiddleware.js  ← mount จาก shared/
│   │   └── db/
│   │       ├── db.js
│   │       └── init.sql
│   ├── package.json
│   └── Dockerfile
├── user-service/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/users.js
│   │   ├── middleware/authMiddleware.js  ← mount จาก shared/
│   │   └── db/
│   │       ├── db.js
│   │       └── init.sql
│   ├── package.json
│   └── Dockerfile
├── shared/
│   └── authMiddleware.js     ← ✨ NEW: ไฟล์เดียวใช้ร่วมกันทุก service
├── frontend/
│   ├── index.html            ← ✨ NEW: HTML โครงสร้างเท่านั้น
│   ├── logs.html             ← ✨ NEW: HTML โครงสร้างเท่านั้น
│   ├── css/
│   │   ├── shared.css        ← ✨ NEW: CSS variables + reset ร่วมกัน
│   │   ├── app.css           ← ✨ NEW: CSS เฉพาะ Task Board
│   │   └── logs.css          ← ✨ NEW: CSS เฉพาะ Log Dashboard
│   └── js/
│       ├── app.js            ← ✨ NEW: JavaScript Task Board
│       └── logs.js           ← ✨ NEW: JavaScript Log Dashboard
└── monitoring/
    ├── loki-config.yaml      ← ✨ UPDATED: fixed path + permissions
    └── grafana/
        ├── datasource.yml
        └── dashboards/
            ├── dashboard.yaml ← ✨ NEW: provisioning config
            └── security.json  ← ✨ NEW: pre-built dashboard
```

### เริ่มต้น

```bash
# สร้าง project
mkdir task-board-security && cd task-board-security
git init

# สร้าง folders ทั้งหมด
mkdir -p nginx
mkdir -p auth-service/src/routes auth-service/src/middleware auth-service/src/db
mkdir -p task-service/src/routes task-service/src/middleware task-service/src/db
mkdir -p user-service/src/routes user-service/src/middleware user-service/src/db
mkdir -p shared
mkdir -p frontend/css frontend/js
mkdir -p monitoring/grafana/dashboards

# สร้าง .gitignore
cat > .gitignore << 'EOF'
.env
node_modules/
*.log
EOF
```

---

## 🔑 Part 1: สร้าง Auth Service (40 นาที)

Auth Service มีหน้าที่เดียว: **ตรวจสอบ username/password → ออก JWT Token**

### 1.1 สร้าง package.json

```bash
cd auth-service
npm init -y
npm install express jsonwebtoken bcryptjs pg dotenv cors morgan
cd ..
```

**`auth-service/package.json`** (แก้ scripts section):
```json
{
  "name": "auth-service",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "pg": "^8.11.3"
  }
}
```

### 1.2 Database Schema

**`auth-service/src/db/init.sql`:**
```sql
-- สร้าง table สำหรับ users (auth data เท่านั้น)
-- ⚠️ Version 2.0: ไม่มี INSERT ที่นี่แล้ว!
-- ข้อมูลทดสอบสร้างโดย seed.js เพื่อให้ bcrypt hash ถูกต้อง 100%
CREATE TABLE IF NOT EXISTS auth_users (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  DEFAULT 'member',
  created_at    TIMESTAMP    DEFAULT NOW(),
  last_login    TIMESTAMP
);
```

### 1.3 Seed Script (✨ ใหม่ใน v2.0)

> 🔑 **ทำไมต้องใช้ seed.js แทน hardcoded hash?**
> bcrypt hash ที่เห็นในตัวอย่าง tutorial ทั่วไปมักจะ**ไม่ตรง**กับ password จริง
> เพราะถูก generate ด้วย library เวอร์ชันต่างกัน หรือ copy มาโดยไม่ได้ verify
> seed.js แก้ปัญหานี้โดย **generate hash จริงทุกครั้งที่ service เริ่มทำงาน**

**`auth-service/src/db/seed.js`:**
```javascript
/**
 * seed.js — สร้าง test users ด้วย bcrypt hash จริง
 * รันอัตโนมัติเมื่อ auth-service เริ่มต้น (ครั้งแรก)
 *
 * ทำไมแยกจาก init.sql?
 * - init.sql ทำได้แค่ INSERT ค่าคงที่ (hardcoded hash)
 * - bcrypt hash ที่ถูกต้องต้องสร้างด้วย bcrypt.hash() เท่านั้น
 * - seed.js generate hash จริงทุกครั้ง → รับประกัน login ได้แน่นอน
 */
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function seedUsers() {
  const password = 'password123';

  // Generate hash จริงด้วย bcrypt (เหมือนกับตอน login check)
  const hash = await bcrypt.hash(password, 10);

  const testUsers = [
    { user_id: 'user-001',   email: 'alice@example.com', role: 'member' },
    { user_id: 'user-002',   email: 'bob@example.com',   role: 'member' },
    { user_id: 'user-admin', email: 'admin@example.com', role: 'admin'  },
  ];

  for (const u of testUsers) {
    await pool.query(
      `INSERT INTO auth_users (user_id, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [u.user_id, u.email, hash, u.role]
    );
  }

  console.log('[auth-db] ✅ Seed users created:');
  console.log('[auth-db]    alice@example.com  (member) | password: password123');
  console.log('[auth-db]    bob@example.com    (member) | password: password123');
  console.log('[auth-db]    admin@example.com  (admin)  | password: password123');
}

module.exports = { seedUsers };
```

### 1.4 Database Connection

**`auth-service/src/db/db.js`:**
```javascript
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'auth-db',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'auth_db',
  user:     process.env.DB_USER     || 'auth_user',
  password: process.env.DB_PASSWORD || 'auth_secret',
});

// Auto-create tables on startup
async function initDB() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'init.sql'), 'utf8'
  );
  await pool.query(sql);
  console.log('[auth-db] Tables initialized');
}

module.exports = { pool, initDB };
```

### 1.5 JWT Utility

**`auth-service/src/middleware/jwtUtils.js`:**
```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'dev-secret-change-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

/**
 * สร้าง JWT Token
 * @param {object} payload - ข้อมูลที่จะฝังใน token
 * @returns {string} JWT token string
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * ตรวจสอบ JWT Token
 * @param {string} token
 * @returns {object} decoded payload หรือ throw error
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
```

### 1.6 Auth Routes (Login + Register)

**`auth-service/src/routes/auth.js`:**
```javascript
const express  = require('express');
const bcrypt   = require('bcryptjs');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/auth/register — สมัครสมาชิกใหม่
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'กรุณากรอก email, password และ name'
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password ต้องมีอย่างน้อย 6 ตัวอักษร'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'user-' + Date.now();

    const result = await pool.query(
      `INSERT INTO auth_users (user_id, email, password_hash, role)
       VALUES ($1, $2, $3, 'member')
       RETURNING id, user_id, email, role`,
      [userId, email.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken({
      sub:   user.user_id,
      email: user.email,
      role:  user.role,
      name
    });

    console.log(`[AUTH] Register success: ${email}`);
    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: { id: user.user_id, email: user.email, role: user.role, name }
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email นี้ถูกใช้แล้ว' });
    }
    console.error('[AUTH] Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login — เข้าสู่ระบบ
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณากรอก email และ password' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM auth_users WHERE email = $1',
      [email.toLowerCase()]
    );
    const user = result.rows[0];

    // ⚠️ Timing Attack prevention: ใช้เวลาเท่ากันไม่ว่า user จะมีหรือไม่
    const dummyHash = '$2b$10$invalidhashpadding000000000000000000000000000000000000';
    const passwordHash = user ? user.password_hash : dummyHash;
    const isValid = await bcrypt.compare(password, passwordHash);

    if (!user || !isValid) {
      console.log(`[AUTH] Login failed: ${email}`);
      return res.status(401).json({ error: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    await pool.query(
      'UPDATE auth_users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    const token = generateToken({
      sub:   user.user_id,
      email: user.email,
      role:  user.role
    });

    console.log(`[AUTH] Login success: ${email} (role: ${user.role})`);
    res.json({
      message: 'Login สำเร็จ',
      token,
      user: { id: user.user_id, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/verify — ตรวจสอบ token (internal)
// ─────────────────────────────────────────────
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: err.message });
  }
});

// GET /api/auth/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service', time: new Date() });
});

module.exports = router;
```

### 1.7 Main App Entry Point (✨ เพิ่ม seedUsers)

**`auth-service/src/index.js`:**
```javascript
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const { seedUsers } = require('./db/seed');   // ← ✨ v2.0: เพิ่ม seed
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms', {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

app.use('/api/auth', authRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await initDB();
      await seedUsers();   // ← ✨ v2.0: สร้าง test users หลัง table พร้อม
      break;
    } catch (err) {
      console.log(`[auth-service] Waiting for DB... (${retries} retries left): ${err.message}`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => {
    console.log(`[auth-service] Running on port ${PORT}`);
    console.log(`[auth-service] JWT_EXPIRES: ${process.env.JWT_EXPIRES || '1h'}`);
  });
}

start();
```

### 1.8 Dockerfile

**`auth-service/Dockerfile`:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/auth/health || exit 1

CMD ["node", "src/index.js"]
```

---

## 👤 Part 2: สร้าง User Service (20 นาที)

### 2.1 Setup

```bash
cd user-service
npm init -y
npm install express jsonwebtoken pg dotenv cors morgan
cd ..
```

### 2.2 Database Schema

**`user-service/src/db/init.sql`:**
```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  role        VARCHAR(20) DEFAULT 'member',
  avatar_url  VARCHAR(500),
  bio         TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ข้อมูลทดสอบ (ตรงกับ auth service seed users)
INSERT INTO user_profiles (user_id, name, email, role) VALUES
  ('user-001',   'Alice Smith', 'alice@example.com', 'member'),
  ('user-002',   'Bob Jones',   'bob@example.com',   'member'),
  ('user-admin', 'Admin User',  'admin@example.com', 'admin')
ON CONFLICT DO NOTHING;
```

### 2.3 Shared Auth Middleware (✨ v2.0 ใช้ไฟล์เดียวกัน)

> ✨ **v2.0:** แทนที่จะ copy authMiddleware.js ไปทุก service (เสี่ยงผิดพลาด)
> ตอนนี้ใช้ไฟล์เดียวจาก `shared/authMiddleware.js` mount เข้า Docker container

**สร้างไฟล์ `shared/authMiddleware.js`:**
```javascript
/**
 * authMiddleware.js — JWT Verification Middleware
 * ใช้ร่วมกันระหว่าง task-service และ user-service
 * mount เข้า container ผ่าน docker-compose volumes
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * requireAuth — ตรวจสอบ JWT Token
 * ถ้าผ่าน → ใส่ req.user = decoded payload แล้ว next()
 * ถ้าไม่ผ่าน → ส่ง 401 Unauthorized
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'กรุณา Login ก่อน — ไม่พบ Token ใน Authorization header'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Token หมดอายุ กรุณา Login ใหม่'
      });
    }
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Token ไม่ถูกต้อง'
    });
  }
}

/**
 * requireRole — ตรวจสอบ Role
 * @param {...string} roles - roles ที่อนุญาต เช่น 'admin', 'member'
 *
 * ต้องใช้หลังจาก requireAuth เสมอ
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `ต้องการสิทธิ์: ${roles.join(' หรือ ')} (คุณมีสิทธิ์: ${req.user.role})`
      });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
```

> ไฟล์ `user-service/src/middleware/authMiddleware.js` และ `task-service/src/middleware/authMiddleware.js`
> **ไม่ต้องสร้างเอง** — Docker จะ mount `shared/authMiddleware.js` เข้าไปให้อัตโนมัติ
> (ดู Part 6 docker-compose.yml)

### 2.4 Database Connection

**`user-service/src/db/db.js`:**
```javascript
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'user-db',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'user_db',
  user:     process.env.DB_USER     || 'user_user',
  password: process.env.DB_PASSWORD || 'user_secret',
});

async function initDB() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await pool.query(sql);
  console.log('[user-db] Tables initialized');
}

module.exports = { pool, initDB };
```

### 2.5 User Routes

**`user-service/src/routes/users.js`:**
```javascript
const express = require('express');
const { pool } = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/me — ดูโปรไฟล์ตัวเอง (ต้อง login)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user.sub]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล profile' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[USER] /me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users — ดู users ทั้งหมด (admin only)
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id, name, email, role, created_at FROM user_profiles ORDER BY created_at DESC'
    );
    res.json({ users: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

module.exports = router;
```

### 2.6 Main Entry + Dockerfile

**`user-service/src/index.js`:**
```javascript
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const userRoutes = require('./routes/users');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

app.use('/api/users', userRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

async function start() {
  let retries = 10;
  while (retries > 0) {
    try { await initDB(); break; }
    catch (err) {
      console.log(`[user-service] Waiting for DB... (${retries} retries left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`[user-service] Running on port ${PORT}`));
}

start();
```

**`user-service/Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3003/api/users/health || exit 1
CMD ["node", "src/index.js"]
```

---

## 📋 Part 3: สร้าง Task Service พร้อม JWT Guard (20 นาที)

### 3.1 Setup

```bash
cd task-service
npm init -y
npm install express jsonwebtoken pg dotenv cors morgan
cd ..
```

### 3.2 Database Schema

**`task-service/src/db/init.sql`:**
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'TODO'
              CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
  priority    VARCHAR(10) DEFAULT 'medium'
              CHECK (priority IN ('low','medium','high')),
  owner_id    VARCHAR(50) NOT NULL,
  assignee_id VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ข้อมูลทดสอบ
INSERT INTO tasks (title, description, status, priority, owner_id) VALUES
  ('ออกแบบ Database Schema', 'วาด ERD สำหรับ Task Board', 'DONE', 'high', 'user-001'),
  ('สร้าง Auth Service', 'Implement JWT login/register', 'IN_PROGRESS', 'high', 'user-001'),
  ('เขียน Unit Tests', 'เพิ่ม test coverage ให้ถึง 80%', 'TODO', 'medium', 'user-002'),
  ('ทำ Docker Setup', 'สร้าง docker-compose.yml', 'DONE', 'high', 'user-admin')
ON CONFLICT DO NOTHING;
```

### 3.3 Database Connection

**`task-service/src/db/db.js`:**
```javascript
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'task-db',
  port:     5432,
  database: process.env.DB_NAME     || 'task_db',
  user:     process.env.DB_USER     || 'task_user',
  password: process.env.DB_PASSWORD || 'task_secret',
});

async function initDB() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await pool.query(sql);
  console.log('[task-db] Tables initialized');
}

module.exports = { pool, initDB };
```

### 3.4 Task Routes

**`task-service/src/routes/tasks.js`:**
```javascript
const express = require('express');
const { pool } = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/tasks — ดู tasks (member เห็นของตัวเอง, admin เห็นทั้งหมด)
router.get('/', requireAuth, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query  = 'SELECT * FROM tasks ORDER BY created_at DESC';
      params = [];
    } else {
      query  = 'SELECT * FROM tasks WHERE owner_id = $1 OR assignee_id = $1 ORDER BY created_at DESC';
      params = [req.user.sub];
    }
    const result = await pool.query(query, params);
    res.json({ tasks: result.rows, total: result.rowCount });
  } catch (err) {
    console.error('[TASK] GET / error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks — สร้าง task ใหม่
router.post('/', requireAuth, async (req, res) => {
  const { title, description, priority, assignee_id } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title ห้ามว่าง' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, owner_id, assignee_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title.trim(), description || '', priority || 'medium', req.user.sub, assignee_id || null]
    );
    console.log(`[TASK] Created by ${req.user.sub}: "${title}"`);
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/:id — อัพเดท task (เจ้าของหรือ admin)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assignee_id } = req.body;
  try {
    const checkResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!checkResult.rows[0]) {
      return res.status(404).json({ error: 'ไม่พบ Task' });
    }
    const task = checkResult.rows[0];
    if (req.user.role !== 'admin' && task.owner_id !== req.user.sub) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'คุณไม่มีสิทธิ์แก้ไข Task นี้'
      });
    }
    const result = await pool.query(
      `UPDATE tasks
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           status      = COALESCE($3, status),
           priority    = COALESCE($4, priority),
           assignee_id = COALESCE($5, assignee_id),
           updated_at  = NOW()
       WHERE id = $6 RETURNING *`,
      [title, description, status, priority, assignee_id, id]
    );
    res.json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tasks/:id — ลบ task (admin หรือเจ้าของ)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const checkResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!checkResult.rows[0]) {
      return res.status(404).json({ error: 'ไม่พบ Task' });
    }
    if (req.user.role !== 'admin' && checkResult.rows[0].owner_id !== req.user.sub) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    console.log(`[TASK] Deleted task ${id} by ${req.user.sub}`);
    res.json({ message: 'ลบ Task สำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-service' });
});

module.exports = router;
```

### 3.5 Main Entry + Dockerfile

**`task-service/src/index.js`:**
```javascript
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

app.use('/api/tasks', taskRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

async function start() {
  let retries = 10;
  while (retries > 0) {
    try { await initDB(); break; }
    catch (err) {
      console.log(`[task-service] Waiting for DB... (${retries} retries left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`[task-service] Running on port ${PORT}`));
}

start();
```

**`task-service/Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3002/api/tasks/health || exit 1
CMD ["node", "src/index.js"]
```

---

## 🚪 Part 4: API Gateway (Nginx) + Rate Limiting (15 นาที)

Nginx ทำหน้าที่เป็น "ประตูเดียว" ที่รับ request ทุกอย่าง ก่อนส่งต่อไปยัง service ที่ถูกต้อง

### 4.1 Nginx Config (✨ v2.0: rate limit ปรับเพื่อ dev)

**`nginx/nginx.conf`:**
```nginx
# ─────────────────────────────────────────────
# Nginx: API Gateway + Rate Limiter
# Task Board Security — Week 12 v2.0
# ─────────────────────────────────────────────
# ✅ v2.0: ปรับ auth rate limit จาก 5r/m → 20r/m
#    เหตุผล: 5r/m ต่ำเกินไปสำหรับ development
#    นักศึกษา login ผิด 6 ครั้งติดกันขณะทดสอบ = 429 ทันที
#    20r/m ยังคงสาธิต Test Case 7 ได้ แต่ไม่รบกวนการพัฒนา

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=20r/m;
limit_req_zone $binary_remote_addr zone=api_limit:10m  rate=60r/m;

upstream auth_service { server auth-service:3001; }
upstream task_service { server task-service:3002; }
upstream user_service { server user-service:3003; }

server {
    listen 80;
    server_name localhost;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer" always;

    # ─── Auth routes (public - ไม่ต้อง JWT) ───
    location /api/auth/ {
        limit_req zone=auth_limit burst=5 nodelay;
        limit_req_status 429;

        proxy_pass         http://auth_service;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # ─── Task routes (protected - ต้อง JWT) ───
    location /api/tasks/ {
        limit_req zone=api_limit burst=10 nodelay;

        proxy_pass         http://task_service;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   Authorization $http_authorization;
    }

    # ─── User routes (protected - ต้อง JWT) ───
    location /api/users/ {
        limit_req zone=api_limit burst=10 nodelay;

        proxy_pass         http://user_service;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   Authorization $http_authorization;
    }

    # ─── Frontend (static files: HTML, CSS, JS) ───
    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        # ✅ รองรับ static files แยก (css/, js/)
        try_files $uri $uri/ /index.html;
    }

    # ─── Health check ───
    location /health {
        access_log off;
        return 200 '{"status":"ok","gateway":"nginx"}';
        add_header Content-Type application/json;
    }

    # ─── Rate limit error ───
    error_page 429 /429.json;
    location /429.json {
        internal;
        return 429 '{"error":"Too Many Requests","message":"ส่ง request มากเกินไป กรุณารอสักครู่"}';
        add_header Content-Type application/json;
    }
}
```

### 4.2 Nginx Dockerfile

**`nginx/Dockerfile`:**
```dockerfile
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 📊 Part 5: Centralized Logging ด้วย Loki + Grafana (20 นาที)

### 5.1 ทำไม Loki ไม่ใช่ ELK?

```
┌────────────────────────────────────────────────────────────────┐
│              Loki vs ELK: สำหรับนักศึกษามือใหม่                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ELK Stack (Elasticsearch + Logstash + Kibana)                 │
│  ✅ Full-text search, มีฟีเจอร์เยอะ                               │
│  ❌ RAM 4GB+, ตั้งค่ายาก, เหมาะ Production scale                  │
│                                                                │
│  Loki + Grafana                                                │
│  ✅ RAM แค่ 512MB, ตั้งค่าง่าย                                      │
│  ✅ เหมาะสำหรับเรียนรู้ระบบ logging                                │
│  ✅ Grafana ใช้ดู Metrics ได้ด้วย                                  │
│  ❌ ไม่มี full-text search                                       │
│                                                                │
│  → เราเลือก Loki สำหรับ Lab นี้ 🎯                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.2 วิธีส่ง Logs เข้า Loki: Docker Driver vs Promtail

> ⚠️ **ปัญหาที่พบใน v1.0:** Promtail (ที่เอกสารเดิมใช้) อาศัยการอ่านไฟล์จาก
> `/var/lib/docker/containers/` — path นี้มีอยู่บน Linux เท่านั้น
> บน **macOS** และ **WSL2** path นี้อยู่ภายใน VM ของ Docker Desktop
> ทำให้ Promtail mount ไม่เจอ → ไม่มี log ส่งเข้า Loki เลย

```
┌─────────────────────────────────────────────────────────────┐
│           การเปรียบเทียบ 2 วิธีส่ง logs เข้า Loki                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  วิธีที่ 1: Promtail (v1.0 เดิม)                                 │
│  ─────────────────────────────────                          │
│  Container stdout                                           │
│       │                                                     │
│       ▼ (เขียนไฟล์)                                           │
│  /var/lib/docker/containers/*.log  ← ❌ ไม่มีบน macOS/WSL2    │
│       │                                                     │
│       ▼ (Promtail อ่านไฟล์)                                   │
│  Loki                                                       │
│                                                             │
│  วิธีที่ 2: Loki Docker Driver Plugin (v2.0) ✅                 │
│  ─────────────────────────────────────────────              │
│  Container stdout                                           │
│       │                                                     │
│       ▼ (Docker intercept โดยตรง)                           │
│  [Loki Docker Driver Plugin]                                │
│       │ (ส่งผ่าน HTTP โดยตรง)                                 │
│       ▼                                                     │
│  Loki                                                       │
│                                                             │
│  ✅ ทำงานได้บน macOS, WSL2, Linux ทุก platform                │
│  ✅ ไม่ต้องมี container เพิ่ม                                    │
│  ✅ ตั้งค่าง่ายกว่า                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 ติดตั้ง Loki Docker Driver Plugin

> **ทำครั้งเดียวต่อเครื่อง** — ถ้าติดตั้งแล้วข้ามขั้นตอนนี้ได้เลย

```bash
# ติดตั้ง plugin
docker plugin install grafana/loki-docker-driver:latest \
  --alias loki \
  --grant-all-permissions

# ตรวจสอบ (ต้องเห็น ENABLED: true)
docker plugin ls

# ถ้าต้องการอัพเดท plugin ในอนาคต
docker plugin disable loki
docker plugin upgrade loki grafana/loki-docker-driver:latest
docker plugin enable loki
```

### 5.4 Loki Config (✨ v2.0: fixed path + permissions)

**`monitoring/loki-config.yaml`:**
```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096
  log_level: warn          # ลด noise ใน logs

common:
  instance_addr: 127.0.0.1
  path_prefix: /loki        # ✅ v2.0: เปลี่ยนจาก /tmp/loki เพื่อให้ใช้ named volume ได้
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

limits_config:
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  ingestion_rate_mb: 4
  ingestion_burst_size_mb: 8

query_range:
  results_cache:
    cache:
      embedded_cache:
        enabled: true
        max_size_mb: 100

ruler:
  alertmanager_url: http://localhost:9093
```

### 5.5 Grafana Datasource

**`monitoring/grafana/datasource.yml`:**
```yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: true
    version: 1
    editable: true
    jsonData:
      timeout: 60
      maxLines: 1000
```

### 5.6 Grafana Dashboard Provisioning (✨ ใหม่ใน v2.0)

**`monitoring/grafana/dashboards/dashboard.yaml`:**
```yaml
apiVersion: 1

providers:
  - name: 'taskboard'
    orgId: 1
    folder: 'Task Board'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/provisioning/dashboards
```

**`monitoring/grafana/dashboards/security.json`:**
```json
{
  "title": "Task Board — Security Logs",
  "uid": "taskboard-security",
  "schemaVersion": 38,
  "version": 1,
  "refresh": "10s",
  "panels": [
    {
      "id": 1,
      "title": "🔑 Auth Events (Login / Register)",
      "type": "logs",
      "gridPos": { "h": 8, "w": 24, "x": 0, "y": 0 },
      "datasource": { "type": "loki", "uid": "loki" },
      "targets": [{
        "expr": "{service=\"taskboard-auth\"}",
        "refId": "A"
      }],
      "options": { "showTime": true, "wrapLogMessage": true }
    },
    {
      "id": 2,
      "title": "🚫 Login Failed (401)",
      "type": "logs",
      "gridPos": { "h": 8, "w": 12, "x": 0, "y": 8 },
      "datasource": { "type": "loki", "uid": "loki" },
      "targets": [{
        "expr": "{service=\"taskboard-auth\"} |= \"Login failed\"",
        "refId": "A"
      }]
    },
    {
      "id": 3,
      "title": "📋 Task Service Logs",
      "type": "logs",
      "gridPos": { "h": 8, "w": 12, "x": 12, "y": 8 },
      "datasource": { "type": "loki", "uid": "loki" },
      "targets": [{
        "expr": "{service=\"taskboard-task\"}",
        "refId": "A"
      }]
    },
    {
      "id": 4,
      "title": "👥 User Service Logs",
      "type": "logs",
      "gridPos": { "h": 8, "w": 12, "x": 0, "y": 16 },
      "datasource": { "type": "loki", "uid": "loki" },
      "targets": [{
        "expr": "{service=\"taskboard-user\"}",
        "refId": "A"
      }]
    },
    {
      "id": 5,
      "title": "🌐 All Services — All Logs",
      "type": "logs",
      "gridPos": { "h": 10, "w": 12, "x": 12, "y": 16 },
      "datasource": { "type": "loki", "uid": "loki" },
      "targets": [{
        "expr": "{compose_project=\"task-board-security\"}",
        "refId": "A"
      }]
    }
  ],
  "templating": { "list": [] },
  "time": { "from": "now-1h", "to": "now" },
  "timepicker": {}
}
```

### 5.7 วิธีดู Logs ใน Grafana

```
1. เปิด http://localhost:3030  (Grafana)
2. Login: admin / admin
3. ซ้ายมือ → Dashboards → Task Board → Security Logs
   (Dashboard โหลดอัตโนมัติจาก provisioning)

หรือ Explore แบบ manual:
4. ซ้ายบน → Explore → เลือก Loki
5. ใส่ LogQL query
```

**LogQL Queries ที่มีประโยชน์:**
```logql
# ดู logs ทั้งหมดจาก project
{compose_project="task-board-security"}

# ดู auth service เท่านั้น
{service="taskboard-auth"}

# ดู failed login
{service="taskboard-auth"} |= "Login failed"

# ดู 403 Forbidden
{compose_project="task-board-security"} |= "403"

# ดู task ที่ถูกสร้าง
{service="taskboard-task"} |= "Created by"

# กรองตาม method
{compose_project="task-board-security"} |= "POST"
```

---

## 🐳 Part 6: Docker Compose รวมทุก Service (15 นาที)

### 6.1 Environment Variables

**`.env`** (อย่า commit ไปใน Git!):
```env
# ─── JWT Config ───
JWT_SECRET=super-secret-key-change-in-production-min-32-chars
JWT_EXPIRES=1h

# ─── Auth DB ───
AUTH_DB_HOST=auth-db
AUTH_DB_NAME=auth_db
AUTH_DB_USER=auth_user
AUTH_DB_PASSWORD=auth_db_password_2024

# ─── Task DB ───
TASK_DB_HOST=task-db
TASK_DB_NAME=task_db
TASK_DB_USER=task_user
TASK_DB_PASSWORD=task_db_password_2024

# ─── User DB ───
USER_DB_HOST=user-db
USER_DB_NAME=user_db
USER_DB_USER=user_user
USER_DB_PASSWORD=user_db_password_2024

# ─── Ports ───
GATEWAY_PORT=80
GRAFANA_PORT=3030
```

**`.env.example`** (✨ ใหม่ใน v2.0 — commit ได้):
```env
# คัดลอกไฟล์นี้เป็น .env แล้วแก้ค่า secret ก่อนใช้งาน
# cp .env.example .env

JWT_SECRET=CHANGE_THIS_TO_RANDOM_32_CHARS_MINIMUM
JWT_EXPIRES=1h

AUTH_DB_NAME=auth_db
AUTH_DB_USER=auth_user
AUTH_DB_PASSWORD=CHANGE_THIS_PASSWORD

TASK_DB_NAME=task_db
TASK_DB_USER=task_user
TASK_DB_PASSWORD=CHANGE_THIS_PASSWORD

USER_DB_NAME=user_db
USER_DB_USER=user_user
USER_DB_PASSWORD=CHANGE_THIS_PASSWORD

GATEWAY_PORT=80
GRAFANA_PORT=3030
```

### 6.2 Docker Compose (✨ v2.0: Loki Driver, ไม่มี Promtail)

**`docker-compose.yml`:**
```yaml
name: task-board-security

# ─────────────────────────────────────────────────────────────────
# ✅ v2.0: ใช้ Loki Docker Driver Plugin แทน Promtail
# ทำงานได้ทั้ง macOS, WSL2, Linux
#
# ⚠️ ต้องติดตั้ง plugin ก่อน:
# docker plugin install grafana/loki-docker-driver:latest \
#   --alias loki --grant-all-permissions
# ─────────────────────────────────────────────────────────────────

# ─── Logging config template (ใช้ซ้ำใน x-logging) ───────────────
x-logging: &loki-logging
  driver: loki
  options:
    loki-url: "http://localhost:3100/loki/api/v1/push"
    loki-external-labels: "compose_project=task-board-security,service={{.Name}}"
    loki-retries: "5"
    loki-batch-size: "400"
    max-size: "10m"
    max-file: "3"

services:

  # ─────────── API Gateway ───────────
  nginx:
    build: ./nginx
    container_name: taskboard-gateway
    ports:
      - "${GATEWAY_PORT:-80}:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    depends_on:
      auth-service:
        condition: service_healthy
      task-service:
        condition: service_healthy
      user-service:
        condition: service_healthy
    networks:
      - taskboard-net
    logging: *loki-logging

  # ─────────── Auth Service ───────────
  auth-service:
    build: ./auth-service
    container_name: taskboard-auth
    environment:
      PORT: 3001
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES: ${JWT_EXPIRES:-1h}
      DB_HOST: auth-db
      DB_NAME: ${AUTH_DB_NAME}
      DB_USER: ${AUTH_DB_USER}
      DB_PASSWORD: ${AUTH_DB_PASSWORD}
    depends_on:
      auth-db:
        condition: service_healthy
    networks:
      - taskboard-net
    logging: *loki-logging
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3001/api/auth/health || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  auth-db:
    image: postgres:15-alpine
    container_name: taskboard-auth-db
    environment:
      POSTGRES_DB: ${AUTH_DB_NAME}
      POSTGRES_USER: ${AUTH_DB_USER}
      POSTGRES_PASSWORD: ${AUTH_DB_PASSWORD}
    volumes:
      - auth-db-data:/var/lib/postgresql/data
    networks:
      - taskboard-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${AUTH_DB_USER} -d ${AUTH_DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 10

  # ─────────── Task Service ───────────
  task-service:
    build: ./task-service
    container_name: taskboard-task
    environment:
      PORT: 3002
      JWT_SECRET: ${JWT_SECRET}
      DB_HOST: task-db
      DB_NAME: ${TASK_DB_NAME}
      DB_USER: ${TASK_DB_USER}
      DB_PASSWORD: ${TASK_DB_PASSWORD}
    volumes:
      # ✨ v2.0: mount shared authMiddleware แทนการ copy
      - ./shared/authMiddleware.js:/app/src/middleware/authMiddleware.js:ro
    depends_on:
      task-db:
        condition: service_healthy
    networks:
      - taskboard-net
    logging: *loki-logging
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3002/api/tasks/health || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  task-db:
    image: postgres:15-alpine
    container_name: taskboard-task-db
    environment:
      POSTGRES_DB: ${TASK_DB_NAME}
      POSTGRES_USER: ${TASK_DB_USER}
      POSTGRES_PASSWORD: ${TASK_DB_PASSWORD}
    volumes:
      - task-db-data:/var/lib/postgresql/data
    networks:
      - taskboard-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${TASK_DB_USER} -d ${TASK_DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 10

  # ─────────── User Service ───────────
  user-service:
    build: ./user-service
    container_name: taskboard-user
    environment:
      PORT: 3003
      JWT_SECRET: ${JWT_SECRET}
      DB_HOST: user-db
      DB_NAME: ${USER_DB_NAME}
      DB_USER: ${USER_DB_USER}
      DB_PASSWORD: ${USER_DB_PASSWORD}
    volumes:
      # ✨ v2.0: mount shared authMiddleware แทนการ copy
      - ./shared/authMiddleware.js:/app/src/middleware/authMiddleware.js:ro
    depends_on:
      user-db:
        condition: service_healthy
    networks:
      - taskboard-net
    logging: *loki-logging
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3003/api/users/health || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  user-db:
    image: postgres:15-alpine
    container_name: taskboard-user-db
    environment:
      POSTGRES_DB: ${USER_DB_NAME}
      POSTGRES_USER: ${USER_DB_USER}
      POSTGRES_PASSWORD: ${USER_DB_PASSWORD}
    volumes:
      - user-db-data:/var/lib/postgresql/data
    networks:
      - taskboard-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${USER_DB_USER} -d ${USER_DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 10

  # ─────────── Monitoring: Loki ───────────
  # ✅ v2.0: ลบ user: "0000:0000" ที่ผิด syntax
  # ใช้ default user ของ Loki image (10001) ซึ่งตรงกับ volume permission
  loki:
    image: grafana/loki:2.9.0
    container_name: taskboard-loki
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki-config.yaml:/etc/loki/local-config.yaml:ro
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - taskboard-net
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3100/ready || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

  # ─────────── Monitoring: Grafana ───────────
  # ✅ v2.0: เพิ่ม dashboards provisioning volume
  grafana:
    image: grafana/grafana:10.2.0
    container_name: taskboard-grafana
    ports:
      - "${GRAFANA_PORT:-3030}:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: "false"
      GF_LOG_LEVEL: warn
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/datasource.yml:/etc/grafana/provisioning/datasources/datasource.yml:ro
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
    networks:
      - taskboard-net
    depends_on:
      loki:
        condition: service_healthy

networks:
  taskboard-net:
    driver: bridge

volumes:
  auth-db-data:
  task-db-data:
  user-db-data:
  grafana-data:
  loki-data:
```

### 6.3 เริ่มระบบ

```bash
# Step 1: ตรวจสอบ Loki Plugin (ต้องทำก่อนเสมอ!)
docker plugin ls | grep loki
# ถ้าไม่เห็น → ติดตั้งก่อน (ดู Part 5.3)

# Step 2: คัดลอก .env
cp .env.example .env
# แก้ค่า secrets ตามต้องการ

# Step 3: Build และ start
docker compose up --build

# หรือ background
docker compose up --build -d

# ดู logs ทั้งหมด
docker compose logs -f

# ดู logs เฉพาะ service
docker compose logs -f auth-service
docker compose logs -f loki
```

**ผล output ที่ถูกต้อง:**
```
NAME                    STATUS
taskboard-gateway       Up
taskboard-auth          Up (healthy)
taskboard-auth-db       Up (healthy)
taskboard-task          Up (healthy)
taskboard-task-db       Up (healthy)
taskboard-user          Up (healthy)
taskboard-user-db       Up (healthy)
taskboard-loki          Up (healthy)
taskboard-grafana       Up

# ใน auth-service log ควรเห็น:
[auth-db] Tables initialized
[auth-db] ✅ Seed users created:
[auth-db]    alice@example.com  (member) | password: password123
[auth-db]    bob@example.com    (member) | password: password123
[auth-db]    admin@example.com  (admin)  | password: password123
[auth-service] Running on port 3001
```

**URL ที่ใช้งาน:**
| Service | URL |
|---------|-----|
| Task Board UI | http://localhost |
| Log Dashboard | http://localhost/logs.html |
| Grafana | http://localhost:3030 (admin/admin) |
| Loki API | http://localhost:3100/ready |

