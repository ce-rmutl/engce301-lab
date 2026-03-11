# 🔐 คู่มือปฏิบัติการ ENGCE301 — สัปดาห์ที่ 12
## Security-Aware Architecture: Task Board พร้อม Auth, JWT และ Centralized Logging

**สัปดาห์:** 12 | **ระยะเวลา:** 3 ชั่วโมง | **ระดับความยาก:** ⭐⭐⭐⭐

> 🔗 **ต่อเนื่องจาก:** Week 6 (N-Tier Docker) → Week 7 (Cloud Deploy) → **Week 12 (Secure Architecture)**

---

## 📋 สารบัญ

1. [วัตถุประสงค์และ CLO](#-วัตถุประสงค์การเรียนรู้)
2. [ภาพรวม: จาก Week 6-7 → Week 12](#-ภาพรวม-week-6-7--week-12)
3. [สถาปัตยกรรมที่จะสร้าง](#-สถาปัตยกรรม-task-board-ที่เพิ่ม-security-components-c2-ปรับปรุง)
4. [ทฤษฎีสั้น: JWT, Auth Flow, Zero-Trust พื้นฐาน](#-ทฤษฎีสั้น-ก่อนลงมือทำ)
5. [เตรียม Project Structure](#-สิ่งที่ต้องเตรียม)
6. [Part 1: สร้าง Auth Service](#-part-1-สร้าง-auth-service-40-นาที)
7. [Part 2: สร้าง User Service](#-part-2-สร้าง-user-service-20-นาที)
8. [Part 3: สร้าง Task Service พร้อม JWT Guard](#-part-3-สร้าง-task-service-พร้อม-jwt-guard-20-นาที)
9. [Part 4: API Gateway (Nginx) + Rate Limiting](#-part-4-api-gateway-nginx--rate-limiting-15-นาที)
10. [Part 5: Centralized Logging ด้วย Loki + Grafana พื้นฐาน](#-part-5-centralized-logging-ด้วย-loki--grafana-20-นาที)
11. [Part 6: Docker Compose รวมทุก Service](#-part-6-docker-compose-รวมทุก-service-15-นาที)
12. [Part 7: Security Test Cases (มี/ไม่มี Security)](#-part-7-security-test-cases-40-นาที)
13. [ใบงาน + ส่งงาน Git](#-ใบงาน--การส่งงาน)
14. [Challenge: ต่อยอด](#-challenge-ต่อยอด-ถ้าเวลาเหลือ)
15. [Draw.io Diagrams](#-drawio-xml-diagrams)
16. [Troubleshooting](#-troubleshooting)

---

## 🎯 วัตถุประสงค์การเรียนรู้

| ✅ | วัตถุประสงค์ | CLO |
|---|------------|-----|
| ☐ | อธิบายบทบาทของ Auth Service, JWT, API Gateway ในสถาปัตยกรรมได้ | CLO3, CLO5 |
| ☐ | เพิ่ม Auth Service เข้าใน Docker Compose ของ Task Board ได้ | CLO6, CLO14 |
| ☐ | ออกแบบ JWT Authentication Flow ระหว่าง Services ได้ | CLO6, CLO7 |
| ☐ | ทดสอบ API ทั้งแบบ มี และ ไม่มี JWT Token ได้ | CLO5, CLO14 |
| ☐ | ตั้งค่า Basic Logging เพื่อดู security events ได้ | CLO14 |
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
│   ✅ API Gateway   → ตรวจ JWT ทุก Request                                    │
│   ✅ Task Service  → Protected Endpoints                                    │
│   ✅ User Service  → User Management                                        │
│   ✅ Loki+Grafana  → Centralized Logging                                    │
│   ✅ Rate Limiting → กันโจมตี Brute-force                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ สถาปัตยกรรม Task Board ที่เพิ่ม Security Components (C2 ปรับปรุง)

```
┌────────────────────────────────────────────────────────────────────────────┐
│         C2: Container Diagram — Task Board Security Architecture           │
│                     (Week 12 Updated)                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   🌐 Internet                                                              │
│        │                                                                   │
│        │ HTTPS :443                                                        │
│        ▼                                                                   │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │   🛡️ Nginx (API Gateway + Rate Limiter)                           │    │
│   │   Port: 80/443   |   Rate: 10 req/s per IP                        │    │
│   │   • ตรวจ JWT Token (validate signature + expiry)                  │    │
│   │   • Route: /api/auth/*  → auth-service:3001                       │    │
│   │   • Route: /api/tasks/* → task-service:3002 (JWT required)        │    │
│   │   • Route: /api/users/* → user-service:3003 (JWT required)        │    │
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
│   │  :5432    │   │  :5433      │         │  :5434    │                    │
│   └───────────┘   └─────────────┘         └───────────┘                    │
│                                                                            │
│   ┌──────────────────────────────────────────────┐                         │
│   │   📊 Logging Stack                           │                         │
│   │   Loki (log storage) + Grafana (dashboard)   │                         │
│   │   ← รับ logs จากทุก Service ผ่าน Docker driver  │                         │
│   └──────────────────────────────────────────────┘                         │
│                                                                            │
│   🔑 Legend:                                                               │
│   • แต่ละ Service มี DB แยก (Database-per-Service pattern)                   │
│   • JWT Secret ใช้ร่วมกัน (shared via Docker env)                             │
│   • ทุก Service Log ผ่าน Docker Logging Driver                               │
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
│   │  "alg":"HS256"│  │  "sub": "user-123",  │  │    base64(header)    │     │
│   │  "typ":"JWT"  │  │  "name":"สมชาย",     │  │  + "."               │     │
│   │  }            │  │  "role":"member",    │  │  + base64(payload),  │     │
│   │               │  │  "iat":1700000000,   │  │    your-secret       │     │
│   │               │  │  "exp":1700003600    │  │  )                   │     │
│   │               │  │  }                   │  │                      │     │
│   └───────────────┘  └──────────────────────┘  └──────────────────────┘     │
│           │                     │                          │                │
│        อ่านได้            อ่านได้ (แค่ encode)         ตรวจสอบว่าถูกปลอมแปลง       │
│                         ❗อย่าใส่ password                   หรือเปล่า          │
│                                                                             │
│   ขั้นตอนการใช้งาน:                                                            │
│                                                                             │
│   1. User Login → Auth Service ตรวจ password → ออก JWT ให้                   │
│   2. User เก็บ JWT (ใน localStorage หรือ Cookie)                              │
│   3. ทุก Request ส่ง JWT ใน Header: Authorization: Bearer <token>             │
│   4. API Gateway / Service ตรวจ JWT: Signature ถูกต้อง? หมดอายุหรือยัง?          │
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

### โครงสร้าง Project ที่จะสร้าง

```
task-board-security/          ← root ของ project
├── docker-compose.yml        ← รวมทุก service
├── .env                      ← secret ทั้งหมด
├── nginx/
│   ├── nginx.conf            ← API Gateway config
│   └── Dockerfile
├── auth-service/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/auth.js
│   │   ├── middleware/
│   │   └── db/init.sql
│   ├── package.json
│   └── Dockerfile
├── task-service/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/tasks.js
│   │   ├── middleware/authMiddleware.js
│   │   └── db/init.sql
│   ├── package.json
│   └── Dockerfile
├── user-service/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/users.js
│   │   ├── middleware/authMiddleware.js
│   │   └── db/init.sql
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── monitoring/
    ├── loki-config.yaml
    ├── promtail-config.yaml      ← ดึง logs จาก Docker → ส่งให้ Loki
    └── grafana/
        └── datasource.yml
```

### เริ่มต้น

```bash
# สร้าง project
mkdir task-board-security && cd task-board-security
git init

# สร้าง folders
mkdir -p nginx auth-service/src/routes auth-service/src/middleware auth-service/src/db
mkdir -p task-service/src/routes task-service/src/middleware task-service/src/db
mkdir -p user-service/src/routes user-service/src/middleware user-service/src/db
mkdir -p frontend/css frontend/js
mkdir -p monitoring/grafana
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
CREATE TABLE IF NOT EXISTS auth_users (
  id        SERIAL PRIMARY KEY,
  user_id   VARCHAR(50) UNIQUE NOT NULL,   -- shared ID กับ user-service
  email     VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role      VARCHAR(20) DEFAULT 'member',  -- member, admin
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- ข้อมูลทดสอบ (password: "password123" → bcrypt hash)
INSERT INTO auth_users (user_id, email, password_hash, role) VALUES
  ('user-001', 'alice@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'member'),
  ('user-002', 'bob@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'member'),
  ('user-admin', 'admin@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin')
ON CONFLICT DO NOTHING;
```

> 📝 **หมายเหตุ:** password hash ข้างบนคือ bcrypt ของ `"password123"` — ใช้ทดสอบเท่านั้น

### 1.3 Database Connection

**`auth-service/src/db/db.js`:**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'auth-db',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'auth_db',
  user:     process.env.DB_USER     || 'auth_user',
  password: process.env.DB_PASSWORD || 'auth_secret',
});

// Auto-create tables on startup
async function initDB() {
  const fs = require('fs');
  const path = require('path');
  const sql = fs.readFileSync(
    path.join(__dirname, 'init.sql'), 'utf8'
  );
  await pool.query(sql);
  console.log('[auth-db] Tables initialized');
}

module.exports = { pool, initDB };
```

### 1.4 JWT Utility

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

### 1.5 Auth Routes (Login + Register)

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

  // Validate input
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
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // สร้าง user_id ง่ายๆ
    const userId = 'user-' + Date.now();

    const result = await pool.query(
      `INSERT INTO auth_users (user_id, email, password_hash, role)
       VALUES ($1, $2, $3, 'member')
       RETURNING id, user_id, email, role`,
      [userId, email.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];

    // ออก JWT ให้เลย
    const token = generateToken({
      sub:    user.user_id,
      email:  user.email,
      role:   user.role,
      name:   name
    });

    console.log(`[AUTH] Register success: ${email}`);
    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: {
        id:    user.user_id,
        email: user.email,
        role:  user.role,
        name
      }
    });

  } catch (err) {
    if (err.code === '23505') {  // unique violation
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

    // ⚠️ Security: ใช้เวลาเท่ากันไม่ว่า user จะมีหรือไม่ (Timing Attack prevention)
    // ใช้ bcrypt hash จริงๆ (ของ string ที่ไม่มีใครรู้) เพื่อป้องกัน Timing Attack
    // ป้องกัน Timing Attack: ใช้ bcrypt.compare กับ dummy hash แม้ว่า user ไม่มีในระบบ
    // ทำให้ response time เท่ากัน ไม่ว่า email จะมีในระบบหรือไม่
    const dummyHash = '$2b$10$invalidhashpadding000000000000000000000000000000000000';
    const passwordHash = user ? user.password_hash : dummyHash;

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!user || !isValid) {
      console.log(`[AUTH] Login failed: ${email} — wrong credentials`);
      return res.status(401).json({ error: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    // อัพเดท last_login
    await pool.query(
      'UPDATE auth_users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // ออก JWT
    const token = generateToken({
      sub:   user.user_id,
      email: user.email,
      role:  user.role
    });

    console.log(`[AUTH] Login success: ${email} (role: ${user.role})`);
    res.json({
      message: 'Login สำเร็จ',
      token,
      user: {
        id:    user.user_id,
        email: user.email,
        role:  user.role
      }
    });

  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/verify — ตรวจสอบ token (internal use)
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

// ─────────────────────────────────────────────
// GET /api/auth/health — health check
// ─────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service', time: new Date() });
});

module.exports = router;
```

### 1.6 Main App Entry Point

**`auth-service/src/index.js`:**
```javascript
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { initDB } = require('./db/db');
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// Morgan: log ทุก request ในรูปแบบที่ Loki อ่านได้
morgan.token('body-size', (req) => {
  return req.body ? JSON.stringify(req.body).length + 'b' : '0b';
});
app.use(morgan(':method :url :status :response-time ms - body::body-size', {
  stream: {
    write: (msg) => console.log(msg.trim())  // stdout → Docker log driver
  }
}));

// ── Routes ──
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Start ──
async function start() {
  // รอ DB พร้อม
  let retries = 10;
  while (retries > 0) {
    try {
      await initDB();
      break;
    } catch (err) {
      console.log(`[auth-service] Waiting for DB... (${retries} retries left)`);
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

### 1.7 Dockerfile

**`auth-service/Dockerfile`:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src/ ./src/

# Non-root user (security best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/auth/health || exit 1

CMD ["node", "src/index.js"]
```

---

## 👤 Part 2: สร้าง User Service (20 นาที)

User Service จัดการข้อมูล Profile ของ User (ไม่ใช่ password — อยู่ที่ Auth Service)

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
  user_id     VARCHAR(50) UNIQUE NOT NULL,  -- ตรงกับ auth_users.user_id
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  role        VARCHAR(20) DEFAULT 'member',
  avatar_url  VARCHAR(500),
  bio         TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ข้อมูลทดสอบ (ตรงกับ auth service)
INSERT INTO user_profiles (user_id, name, email, role) VALUES
  ('user-001', 'Alice Smith', 'alice@example.com', 'member'),
  ('user-002', 'Bob Jones',   'bob@example.com',   'member'),
  ('user-admin', 'Admin User', 'admin@example.com', 'admin')
ON CONFLICT DO NOTHING;
```

### 2.3 Auth Middleware (ใช้ร่วมกับ Task Service)

**`user-service/src/middleware/authMiddleware.js`:**
```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Middleware ตรวจสอบ JWT Token
 * ถ้าผ่าน → ใส่ req.user = decoded payload
 * ถ้าไม่ผ่าน → ส่ง 401
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
    req.user = decoded;  // ต่อ pipeline
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
 * Middleware ตรวจสอบ Role
 * @param  {...string} roles - roles ที่อนุญาต เช่น 'admin', 'member'
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

### 2.4 User Routes

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

### 2.5 Main Entry + Dockerfile

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
    catch {
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`[user-service] Running on port ${PORT}`));
}

start();
```

**`user-service/src/db/db.js`:** (เหมือน auth-service แต่เปลี่ยน env var prefix)
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

**`user-service/Dockerfile`:** (เหมือนกันเปลี่ยนแค่ EXPOSE)
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
  owner_id    VARCHAR(50) NOT NULL,     -- user_id จาก JWT
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

### 3.3 Task Routes

**`task-service/src/routes/tasks.js`:**
```javascript
const express = require('express');
const { pool } = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/tasks — ดู tasks ทั้งหมด (ต้อง login)
router.get('/', requireAuth, async (req, res) => {
  try {
    // member เห็นแค่ tasks ของตัวเอง, admin เห็นทั้งหมด
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

// POST /api/tasks — สร้าง task ใหม่ (ต้อง login)
router.post('/', requireAuth, async (req, res) => {
  const { title, description, priority, assignee_id } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title ห้ามว่าง' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, owner_id, assignee_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title.trim(), description || '', priority || 'medium', req.user.sub, assignee_id || null]
    );
    console.log(`[TASK] Created by ${req.user.sub}: "${title}"`);
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/:id — อัพเดท task (ต้อง login + เป็นเจ้าของหรือ admin)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assignee_id } = req.body;

  try {
    // ตรวจสอบเจ้าของ task
    const checkResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1', [id]
    );
    if (!checkResult.rows[0]) {
      return res.status(404).json({ error: 'ไม่พบ Task' });
    }

    const task = checkResult.rows[0];
    // Authorization: admin ทำได้ทุก task, member ทำได้เฉพาะของตัวเอง
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
       WHERE id = $6
       RETURNING *`,
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

### 3.4 Main Entry

**`task-service/src/index.js`:** (copy จาก user-service แก้ PORT=3002 และ routes)
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
    catch { retries--; await new Promise(r => setTimeout(r, 3000)); }
  }
  app.listen(PORT, () => console.log(`[task-service] Running on port ${PORT}`));
}

start();
```

**`task-service/src/db/db.js`:** (เหมือน user-service แก้ env vars เป็น task-db)
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

**หมายเหตุ:** Copy `authMiddleware.js` จาก user-service ไปวางใน `task-service/src/middleware/` (ใช้ code เดิมได้เลย)

```bash
cp user-service/src/middleware/authMiddleware.js task-service/src/middleware/authMiddleware.js
```

**`task-service/Dockerfile`:** (เหมือน auth-service เปลี่ยน EXPOSE 3002)
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

### 4.1 Nginx Config

**`nginx/nginx.conf`:**
```nginx
# ─────────────────────────────────────────────
# Nginx: API Gateway + Rate Limiter สำหรับ Task Board
# Week 12 Security Architecture
# ─────────────────────────────────────────────

# Rate limiting zones
# auth zone: จำกัด 5 requests/นาที ต่อ IP (กัน Brute-force)
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
# api zone: จำกัด 30 requests/นาที ต่อ IP
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;

upstream auth_service {
    server auth-service:3001;
}

upstream task_service {
    server task-service:3002;
}

upstream user_service {
    server user-service:3003;
}

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
        limit_req zone=auth_limit burst=3 nodelay;
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

        # Nginx ส่งต่อ Authorization header ไปด้วย
        # JWT verify จะเกิดที่ task-service middleware
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

    # ─── Frontend (static files) ───
    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    # ─── Health check ───
    location /health {
        access_log off;
        return 200 '{"status":"ok","gateway":"nginx"}';
        add_header Content-Type application/json;
    }

    # ─── Rate limit error page ───
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

# ลบ config เดิม
RUN rm /etc/nginx/conf.d/default.conf

# Copy config ใหม่
COPY nginx.conf /etc/nginx/conf.d/default.conf

# รอ services ก่อน start
EXPOSE 80
```

---

## 📊 Part 5: Centralized Logging ด้วย Loki + Grafana (20 นาที)

> 🔑 **Stack ที่ใช้:** `Loki` (เก็บ logs) + `Promtail` (ดึง logs จาก Docker) + `Grafana` (แสดงผล)
> ทั้งสามทำงานร่วมกัน — ขาดอันใดอันหนึ่งระบบ logging จะไม่ทำงาน!

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
│  ✅ Grafana ใช้ดู Metrics ได้ด้วย (ใช้ต่อยอดได้)                      │
│  ❌ ไม่มี full-text search                                       │
│                                                                │
│  → เราเลือก Loki สำหรับ Lab นี้ 🎯                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.2 Loki Config

**`monitoring/loki-config.yaml`:**
```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  instance_addr: 127.0.0.1
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

query_range:
  results_cache:
    cache:
      embedded_cache:
        enabled: true
        max_size_mb: 100

schema_config:
  configs:
    - from: 2020-10-24
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093

limits_config:
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

### 5.3 Grafana Datasource

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

### 5.4 Promtail Config (สำคัญมาก!)

> ⚠️ **Loki ไม่ได้รับ logs จาก Docker โดยอัตโนมัติ** — ต้องมี **Promtail** ทำหน้าที่เป็น log collector ที่อ่าน Docker log files แล้วส่งเข้า Loki

**`monitoring/promtail-config.yaml`:**
```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: docker-containers
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
        filters:
          - name: label
            values: ["com.docker.compose.project=task-board-security"]
    relabel_configs:
      # ใช้ container name เป็น label
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      # ใช้ compose service name
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: 'service'
    pipeline_stages:
      # แยก level จาก logs (morgan format: GET /api/auth/login 200)
      - regex:
          expression: '(?P<method>GET|POST|PUT|DELETE|PATCH) (?P<path>/\S*) (?P<status>\d{3})'
      - labels:
          method:
          status:
```

### 5.4 วิธีดู Logs ใน Grafana

หลัง `docker compose up` เสร็จ:

```
1. เปิด http://localhost:3000  (Grafana)
2. Login: admin / admin
3. ซ้ายบน → Explore (icon กล้อง)
4. เลือก datasource: Loki
5. ใส่ LogQL query:
```

**Query ที่มีประโยชน์สำหรับ Security:**

```logql
# ดู logs ทั้งหมดจาก auth-service
{container_name="task-board-security-auth-service-1"}

# ดู failed login
{container_name=~".*auth.*"} |= "Login failed"

# ดู 401 errors
{container_name=~".*task.*"} |= "401"

# ดู requests ทุกอย่าง
{compose_service=~"auth-service|task-service|user-service"}

# กรองเฉพาะ error
{compose_service="task-service"} |= "error" | logfmt
```

---

## 🐳 Part 6: Docker Compose รวมทุก Service (15 นาที)

### 6.1 Environment Variables

**`.env`:**
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
AUTH_SERVICE_PORT=3001
TASK_SERVICE_PORT=3002
USER_SERVICE_PORT=3003
GATEWAY_PORT=80
GRAFANA_PORT=3030   # ← เปลี่ยนจาก 3000 เพื่อไม่สับสนกับ Node.js services
```

### 6.2 Docker Compose

**`docker-compose.yml`:**
```yaml
name: task-board-security

services:

  # ─────────── API Gateway ───────────
  nginx:
    build: ./nginx
    container_name: taskboard-gateway
    ports:
      - "80:80"
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
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=nginx"

  # ─────────── Auth Service ───────────
  auth-service:
    build: ./auth-service
    container_name: taskboard-auth
    environment:
      PORT: 3001
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES: ${JWT_EXPIRES}
      DB_HOST: auth-db
      DB_NAME: ${AUTH_DB_NAME}
      DB_USER: ${AUTH_DB_USER}
      DB_PASSWORD: ${AUTH_DB_PASSWORD}
    depends_on:
      auth-db:
        condition: service_healthy
    networks:
      - taskboard-net
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        tag: "auth-service"

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
    depends_on:
      task-db:
        condition: service_healthy
    networks:
      - taskboard-net
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        tag: "task-service"

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
    depends_on:
      user-db:
        condition: service_healthy
    networks:
      - taskboard-net
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        tag: "user-service"

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
  loki:
    image: grafana/loki:2.9.0
    container_name: taskboard-loki
    user: "0000:0000" # รันด้วย user ปกติ (ไม่มช่ root) เพิ่อความปลอดภัย
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki-config.yaml:/etc/loki/local-config.yaml:ro
      - loki-data:/tmp/loki
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - taskboard-net
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3100/ready || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─────────── Monitoring: Promtail ─────────────────────────────────────────
  # ⚠️ สำคัญ: Loki ไม่รับ Docker logs โดยตรง — ต้องมี Promtail ดึงให้
  # Promtail อ่าน container log files แล้วส่งไป Loki
  promtail:
    image: grafana/promtail:2.9.0
    container_name: taskboard-promtail
    volumes:
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./monitoring/promtail-config.yaml:/etc/promtail/config.yaml:ro
    command: -config.file=/etc/promtail/config.yaml
    networks:
      - taskboard-net
    depends_on:
      loki:
        condition: service_healthy

  # ─────────── Monitoring: Grafana ───────────
  grafana:
    image: grafana/grafana:10.0.0
    container_name: taskboard-grafana
    ports:
      - "${GRAFANA_PORT:-3000}:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana:/etc/grafana/provisioning/datasources:ro
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
# Build และ start ทุก service
docker compose up --build

# หรือ background
docker compose up --build -d

# ดู logs
docker compose logs -f

# ดู logs เฉพาะ service
docker compose logs -f auth-service
docker compose logs -f task-service

# ตรวจสอบ containers
docker compose ps

# ตรวจสอบ Loki พร้อมรับ logs หรือยัง
curl http://localhost:3100/ready   # ควรได้: "ready"

# ตรวจสอบ Promtail กำลังดึง logs
curl http://localhost:9080/metrics | grep "promtail_" | head -5
```

**ผล output ที่ถูกต้อง:**
```
NAME                      STATUS
taskboard-gateway         Up
taskboard-auth            Up
taskboard-auth-db         Up (healthy)
taskboard-task            Up
taskboard-task-db         Up (healthy)
taskboard-user            Up
taskboard-user-db         Up (healthy)
taskboard-loki            Up
taskboard-grafana         Up
```

---

## 🧪 Part 7: Security Test Cases (40 นาที)

นี่คือส่วนที่สำคัญที่สุด — นักศึกษาจะเห็นผลต่างระหว่าง **มี** และ **ไม่มี** Security

### 🔧 เครื่องมือทดสอบ

ใช้ **curl** (command line) หรือ **Thunder Client** (VS Code extension) หรือ **Postman**

### Test Case 1: ❌ เรียก Protected API โดยไม่มี Token

```bash
# ทดสอบ: เรียก tasks โดยไม่ login
curl -X GET http://localhost/api/tasks/

# ผลที่คาดหวัง: 401 Unauthorized
```

**Expected Response:**
```json
{
  "error": "Unauthorized",
  "message": "กรุณา Login ก่อน — ไม่พบ Token ใน Authorization header"
}
```

**📝 บันทึก:**
```
Status Code ที่ได้: ______
เป็นไปตามที่คาดหวังหรือไม่: ______
เพราะเหตุใด: ______________________________
```

---

### Test Case 2: ✅ Register และ Login เพื่อรับ Token

**Step 1: Register**
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "mypassword123",
    "name": "Test User"
  }'
```

**Expected:** `201 Created` พร้อม JWT token

**Step 2: Login ด้วย user ที่มีอยู่แล้ว**
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login สำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-001",
    "email": "alice@example.com",
    "role": "member"
  }
}
```

**📝 บันทึก Token:** (เอาไว้ใช้ Test Cases ต่อไป)
```
TOKEN=<copy token มาใส่ที่นี่>
```

```bash
# Save token เป็น variable (Linux/Mac)
TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token saved: ${TOKEN:0:30}..."
```

---

### Test Case 3: ✅ เรียก Protected API ด้วย Token

```bash
# ดู tasks ทั้งหมด (ต้องมี token)
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** `200 OK` พร้อมรายการ tasks

**📝 บันทึก:**
```
จำนวน tasks ที่ได้: ______
Tasks แสดงเฉพาะของ alice หรือทั้งหมด: ______
เพราะเหตุใด (ดู authMiddleware.js ประกอบ): ___________
```

---

### Test Case 4: ❌ ใช้ Token ที่หมดอายุหรือ Invalid

```bash
# ทดสอบด้วย token ปลอม
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.INVALID.SIGNATURE"
```

**Expected:** `401 Invalid Token`

```bash
# ทดสอบด้วย token ที่ถูกแก้ไข (เพิ่ม x ท้าย token จริง)
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer ${TOKEN}xxx"
```

**📝 บันทึก:**
```
ทั้ง 2 กรณีให้ผลอย่างไร: ______
JWT Signature ทำงานอย่างไร: ________________________________
```

---

### Test Case 5: ❌ Authorization — Member ลบ Task ของคนอื่น

```bash
# Login เป็น Alice ก่อน
ALICE_TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# ลอง DELETE task id=4 (เจ้าของคือ user-admin ไม่ใช่ alice)
curl -X DELETE http://localhost/api/tasks/4 \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**Expected:** `403 Forbidden`

**📝 บันทึก:**
```
ผลที่ได้: ______
Authentication vs Authorization ต่างกันอย่างไรในกรณีนี้: 
_________________________________________________
```

---

### Test Case 6: ✅ Admin ทำได้ทุกอย่าง

```bash
# Login เป็น Admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Admin ดู tasks ทั้งหมด (ไม่จำกัดเฉพาะของตัวเอง)
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Admin ดู users ทั้งหมด
curl -X GET http://localhost/api/users/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Alice ลอง ดู users ทั้งหมด (ไม่มีสิทธิ์)
curl -X GET http://localhost/api/users/ \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**📝 บันทึก:**
```
Admin เห็น tasks กี่รายการ: ______
Alice เห็น tasks กี่รายการ: ______
Alice เรียก /api/users/ ได้ status: ______
สรุป Role-Based Access Control ทำงานอย่างไร: ______
```

---

### Test Case 7: ❌ Brute-force Attack (Rate Limiting)

```bash
# ส่ง login ผิดหลายครั้งติดกัน (เกิน 5 ครั้ง/นาที)
for i in {1..8}; do
  echo "Attempt $i:"
  curl -s -o /dev/null -w "%{http_code}" \
    -X POST http://localhost/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"wrongpassword"}'
  echo ""
  sleep 0.2
done
```

**Expected:** หลัง attempt ที่ 5 จะได้ `429 Too Many Requests`

**📝 บันทึก:**
```
Attempt ที่เท่าไหร่ที่เริ่มได้ 429: ______
Rate Limiting ช่วยป้องกัน Attack ชนิดใด: ______
ข้อเสียของ Rate Limiting ที่อาจเกิดขึ้น: ______
```

---

### Test Case 8: 🔍 SQL Injection Attempt

```bash
# ลอง SQL Injection ผ่าน login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com'\''-- ",
    "password": "anything"
  }'

# ลอง SQL Injection ผ่าน task query
curl -X GET "http://localhost/api/tasks/?id=1;DROP TABLE tasks--" \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**Expected:** ทั้งสองกรณีควรไม่สามารถ inject ได้ เพราะใช้ Parameterized Queries

**📝 บันทึก:**
```
ได้ผลลัพธ์อย่างไร: ______
Parameterized Query ป้องกัน SQL Injection อย่างไร:
_________________________________________________
(ดูใน auth.js: pool.query('...WHERE email = $1', [email]))
```

---

### 📊 สรุปผลการทดสอบ

กรอกตารางนี้หลังทำ Test Cases ครบ:

| Test Case | Expected | Actual | ✅/❌ | หมายเหตุ |
|-----------|----------|--------|------|---------|
| 1. ไม่มี Token | 401 | | | |
| 2. Login สำเร็จ | 200 + Token | | | |
| 3. มี Token ถูกต้อง | 200 + data | | | |
| 4. Token Invalid | 401 | | | |
| 5. Forbidden (403) | 403 | | | |
| 6. Admin access | 200 | | | |
| 7. Rate Limit | 429 | | | |
| 8. SQL Injection | Safe | | | |

---

### 🔍 เปรียบเทียบ: Week 6 vs Week 12

```
┌────────────────────────────────────────────────────────────────┐
│            ก่อน (Week 6)          หลัง (Week 12)                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  GET /api/tasks          GET /api/tasks                        │
│        │                       │                               │
│        ▼                       ▼                               │
│   ✅ ได้ข้อมูล           ❌ 401 Unauthorized                      │
│   (ไม่มีการตรวจสอบ)        (ถ้าไม่มี token)                         │
│                                                                │
│  ใครก็เรียกได้          ต้อง Login ก่อนเสมอ                         │
│  ลบ task ใครก็ได้        ลบได้เฉพาะของตัวเอง                       │
│  ไม่รู้ว่าใคร access     รู้ชัดเจนว่าใคร access                        │
│  ไม่มี log รวมศูนย์        มี Grafana dashboard                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---


## 🖥️ Frontend — Task Board UI + Log Dashboard

> ไฟล์ Frontend แบ่งเป็น **2 หน้า** ต่างกันโดยสิ้นเชิง:
> - `index.html` — Task Board UI เต็มรูปแบบ (Login + CRUD Tasks + User Management)
> - `logs.html` — Security Log Dashboard (API Activity + Security Events + JWT Inspector)

---

### `frontend/index.html` — Task Board UI ครบทุก API

> 📌 Self-contained file (CSS + JS อยู่ในไฟล์เดียว) — ไม่ต้องสร้างไฟล์แยก

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔐 Task Board — Week 12 Security</title>
  <style>
    /* ═══════════════════════════════════════════════════════
       GLOBAL RESET & BASE
    ═══════════════════════════════════════════════════════ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:       #0f172a;
      --surface:  #1e293b;
      --surface2: #273448;
      --border:   #334155;
      --text:     #e2e8f0;
      --muted:    #94a3b8;
      --blue:     #3b82f6;
      --blue2:    #2563eb;
      --green:    #22c55e;
      --yellow:   #f59e0b;
      --red:      #ef4444;
      --purple:   #a855f7;
      --radius:   10px;
    }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg); color: var(--text);
      min-height: 100vh; line-height: 1.5;
    }
    button { cursor: pointer; font-family: inherit; transition: all .15s; }
    input, select, textarea { font-family: inherit; }
    .hidden { display: none !important; }

    /* ═══════════════════════════════════════════════════════
       AUTH PAGE
    ═══════════════════════════════════════════════════════ */
    #auth-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: 1.5rem;
    }
    .auth-box {
      background: var(--surface); border-radius: 16px;
      padding: 2.5rem; width: 100%; max-width: 420px;
      border: 1px solid var(--border);
      box-shadow: 0 20px 60px rgba(0,0,0,.5);
    }
    .auth-logo { font-size: 2.5rem; text-align: center; margin-bottom: .5rem; }
    .auth-title { text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: .25rem; }
    .auth-subtitle { text-align: center; color: var(--muted); font-size: .9rem; margin-bottom: 1.5rem; }
    .auth-tabs { display: flex; background: var(--bg); border-radius: 8px; padding: 4px; margin-bottom: 1.5rem; gap: 4px; }
    .auth-tab {
      flex: 1; padding: .6rem; border: none; border-radius: 6px;
      background: transparent; color: var(--muted); font-size: .9rem; font-weight: 500;
    }
    .auth-tab.active { background: var(--blue); color: white; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: var(--muted); font-size: .85rem; margin-bottom: .4rem; font-weight: 500; }
    .form-group input {
      width: 100%; padding: .75rem 1rem;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-size: 1rem;
      transition: border-color .2s;
    }
    .form-group input:focus { outline: none; border-color: var(--blue); }
    .btn-primary {
      width: 100%; padding: .85rem; background: var(--blue);
      color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600;
      margin-top: .5rem;
    }
    .btn-primary:hover { background: var(--blue2); transform: translateY(-1px); }
    .auth-hint {
      background: var(--bg); border-radius: 8px; padding: 1rem;
      margin-top: 1.2rem; font-size: .8rem; color: var(--muted);
      border: 1px solid var(--border);
    }
    .auth-hint strong { color: var(--text); }
    .auth-msg {
      padding: .7rem 1rem; border-radius: 8px; margin-top: 1rem;
      font-size: .9rem; text-align: center;
    }
    .auth-msg.error { background: rgba(239,68,68,.15); color: #fca5a5; border: 1px solid rgba(239,68,68,.3); }
    .auth-msg.success { background: rgba(34,197,94,.15); color: #86efac; border: 1px solid rgba(34,197,94,.3); }

    /* ═══════════════════════════════════════════════════════
       MAIN APP LAYOUT
    ═══════════════════════════════════════════════════════ */
    #app-page { display: flex; height: 100vh; }

    /* Sidebar */
    .sidebar {
      width: 220px; background: var(--surface); border-right: 1px solid var(--border);
      display: flex; flex-direction: column; flex-shrink: 0;
    }
    .sidebar-logo {
      padding: 1.25rem 1.5rem; font-size: 1.1rem; font-weight: 700;
      border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: .6rem;
    }
    .sidebar-nav { flex: 1; padding: .75rem; }
    .nav-item {
      display: flex; align-items: center; gap: .75rem;
      padding: .65rem 1rem; border-radius: 8px;
      cursor: pointer; color: var(--muted); font-size: .9rem; font-weight: 500;
      border: none; background: none; width: 100%; text-align: left;
      transition: all .15s; margin-bottom: 2px;
    }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: rgba(59,130,246,.15); color: var(--blue); }
    .nav-item .nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }
    .nav-item .badge-count {
      margin-left: auto; background: var(--blue); color: white;
      font-size: .7rem; padding: 2px 7px; border-radius: 999px; font-weight: 700;
    }
    .sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); }
    .user-chip {
      display: flex; align-items: center; gap: .75rem;
      padding: .65rem .75rem; background: var(--bg); border-radius: 8px;
    }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--blue); display: flex; align-items: center;
      justify-content: center; font-weight: 700; font-size: .9rem; flex-shrink: 0;
    }
    .user-info-small { flex: 1; min-width: 0; }
    .user-info-small .name { font-size: .85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-info-small .role-badge {
      font-size: .7rem; color: white; padding: 1px 6px; border-radius: 4px; font-weight: 600;
    }
    .role-admin { background: var(--purple); }
    .role-member { background: var(--blue); }
    .role-viewer { background: var(--muted); }
    .btn-logout {
      background: none; border: none; color: var(--muted); padding: 4px;
      font-size: .9rem; border-radius: 6px;
    }
    .btn-logout:hover { color: var(--red); background: rgba(239,68,68,.1); }

    /* Main content */
    .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
    .page-header {
      padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      background: var(--surface);
    }
    .page-title { font-size: 1.3rem; font-weight: 700; display: flex; align-items: center; gap: .5rem; }
    .page-body { padding: 2rem; flex: 1; }

    /* ═══════════════════════════════════════════════════════
       STATS BAR
    ═══════════════════════════════════════════════════════ */
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem;
    }
    .stat-icon { font-size: 1.6rem; }
    .stat-value { font-size: 1.6rem; font-weight: 700; }
    .stat-label { font-size: .78rem; color: var(--muted); }

    /* ═══════════════════════════════════════════════════════
       TOOLBAR / FILTER
    ═══════════════════════════════════════════════════════ */
    .toolbar {
      display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: .5rem 1rem; border-radius: 8px; border: 1px solid var(--border);
      background: var(--surface); color: var(--muted); font-size: .85rem; font-weight: 500;
    }
    .filter-btn.active { border-color: var(--blue); background: rgba(59,130,246,.15); color: var(--blue); }
    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }
    .spacer { flex: 1; }
    .btn-add {
      padding: .55rem 1.2rem; background: var(--blue); color: white;
      border: none; border-radius: 8px; font-size: .9rem; font-weight: 600;
      display: flex; align-items: center; gap: .4rem;
    }
    .btn-add:hover { background: var(--blue2); transform: translateY(-1px); }

    /* ═══════════════════════════════════════════════════════
       TASK CARDS
    ═══════════════════════════════════════════════════════ */
    .task-list { display: flex; flex-direction: column; gap: .75rem; }
    .task-card {
      background: var(--surface); border: 1px solid var(--border);
      border-left: 4px solid var(--border); border-radius: var(--radius);
      padding: 1rem 1.25rem; transition: border-color .2s, transform .15s;
    }
    .task-card:hover { transform: translateX(2px); }
    .task-card.status-TODO       { border-left-color: #64748b; }
    .task-card.status-IN_PROGRESS{ border-left-color: var(--yellow); }
    .task-card.status-DONE       { border-left-color: var(--green); }
    .task-header { display: flex; align-items: flex-start; gap: .75rem; }
    .task-header .title { flex: 1; font-weight: 600; font-size: .95rem; }
    .task-header .title.done { text-decoration: line-through; color: var(--muted); }
    .task-meta { display: flex; align-items: center; gap: .5rem; margin-top: .5rem; flex-wrap: wrap; }
    .chip {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 2px 8px; border-radius: 5px; font-size: .72rem; font-weight: 600;
    }
    .chip-todo       { background: rgba(100,116,139,.2); color: #94a3b8; }
    .chip-inprogress { background: rgba(245,158,11,.2);  color: #fbbf24; }
    .chip-done       { background: rgba(34,197,94,.2);   color: #4ade80; }
    .chip-low        { background: rgba(100,116,139,.15); color: #94a3b8; }
    .chip-medium     { background: rgba(59,130,246,.15);  color: #7dd3fc; }
    .chip-high       { background: rgba(239,68,68,.2);    color: #fca5a5; }
    .chip-owner      { background: rgba(168,85,247,.15); color: #c4b5fd; }
    .task-actions { display: flex; gap: .4rem; margin-left: auto; }
    .btn-icon {
      padding: .3rem .5rem; border-radius: 6px; border: none;
      background: transparent; color: var(--muted); font-size: .85rem;
    }
    .btn-icon:hover { background: var(--surface2); }
    .btn-icon.edit:hover { color: var(--blue); }
    .btn-icon.delete:hover { color: var(--red); background: rgba(239,68,68,.1); }
    .task-desc { font-size: .82rem; color: var(--muted); margin-top: .4rem; }
    .empty-state {
      text-align: center; padding: 4rem 2rem;
      color: var(--muted); font-size: 1rem;
    }
    .empty-state .emoji { font-size: 3rem; margin-bottom: 1rem; }

    /* Select in task card */
    .status-select {
      background: var(--surface2); border: 1px solid var(--border);
      color: var(--text); border-radius: 6px; padding: 2px 6px; font-size: .78rem;
      cursor: pointer;
    }

    /* ═══════════════════════════════════════════════════════
       MODAL
    ═══════════════════════════════════════════════════════ */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 1rem;
    }
    .modal {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; width: 100%; max-width: 500px;
      box-shadow: 0 25px 50px rgba(0,0,0,.6); max-height: 90vh; overflow-y: auto;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
    }
    .modal-header h3 { font-size: 1.1rem; font-weight: 700; }
    .btn-close {
      background: none; border: none; color: var(--muted); font-size: 1.2rem;
      padding: .2rem .4rem; border-radius: 6px;
    }
    .btn-close:hover { background: var(--surface2); color: var(--text); }
    .modal-body { padding: 1.5rem; }
    .modal-body .form-group { margin-bottom: 1.1rem; }
    .modal-body input,
    .modal-body select,
    .modal-body textarea {
      width: 100%; padding: .7rem 1rem;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-size: .9rem;
    }
    .modal-body textarea { min-height: 80px; resize: vertical; }
    .modal-body select option { background: var(--surface); }
    .modal-footer {
      display: flex; gap: .75rem; justify-content: flex-end;
      padding: 1rem 1.5rem; border-top: 1px solid var(--border);
    }
    .btn-secondary {
      padding: .6rem 1.2rem; background: var(--surface2);
      color: var(--text); border: 1px solid var(--border); border-radius: 8px; font-size: .9rem;
    }
    .btn-danger {
      padding: .6rem 1.2rem; background: rgba(239,68,68,.15);
      color: #fca5a5; border: 1px solid rgba(239,68,68,.3); border-radius: 8px; font-size: .9rem;
    }
    .btn-submit {
      padding: .6rem 1.4rem; background: var(--blue);
      color: white; border: none; border-radius: 8px; font-size: .9rem; font-weight: 600;
    }
    .btn-submit:hover { background: var(--blue2); }

    /* ═══════════════════════════════════════════════════════
       USERS PAGE
    ═══════════════════════════════════════════════════════ */
    .user-table { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .user-row {
      display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr;
      padding: .9rem 1.25rem; border-bottom: 1px solid var(--border);
      align-items: center; font-size: .88rem;
    }
    .user-row.header { background: var(--surface2); color: var(--muted); font-size: .78rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
    .user-row:last-child { border-bottom: none; }
    .user-row:not(.header):hover { background: var(--surface2); }
    .user-email { color: var(--muted); font-size: .82rem; }

    /* ═══════════════════════════════════════════════════════
       PROFILE PAGE
    ═══════════════════════════════════════════════════════ */
    .profile-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 2rem; max-width: 600px;
    }
    .profile-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; }
    .profile-avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue), var(--purple));
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; font-weight: 700;
    }
    .profile-info h2 { font-size: 1.25rem; }
    .profile-info p { color: var(--muted); font-size: .9rem; margin-top: 2px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .info-item label { display: block; font-size: .75rem; color: var(--muted); margin-bottom: .2rem; text-transform: uppercase; letter-spacing: .06em; }
    .info-item p { font-size: .95rem; font-weight: 500; }

    /* JWT Panel */
    .jwt-panel {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1.25rem; margin-top: 1.5rem;
    }
    .jwt-panel h3 { font-size: .9rem; color: var(--muted); margin-bottom: 1rem; display: flex; align-items: center; gap: .4rem; }
    .jwt-parts { display: flex; gap: .4rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .jwt-part { padding: 4px 8px; border-radius: 5px; font-family: monospace; font-size: .7rem; word-break: break-all; }
    .jwt-header-part  { background: rgba(239,68,68,.2);  color: #fca5a5; }
    .jwt-payload-part { background: rgba(168,85,247,.2); color: #c4b5fd; }
    .jwt-sig-part     { background: rgba(59,130,246,.2); color: #93c5fd; }
    .jwt-decoded { font-size: .8rem; }
    .jwt-decoded pre { background: var(--surface); padding: .75rem 1rem; border-radius: 8px; overflow-x: auto; color: var(--text); border: 1px solid var(--border); }
    .token-exp { margin-top: .75rem; font-size: .82rem; }
    .exp-ok  { color: var(--green); }
    .exp-bad { color: var(--red); }
    .logs-link {
      display: inline-flex; align-items: center; gap: .4rem;
      margin-top: 1rem; padding: .5rem 1rem;
      background: rgba(168,85,247,.15); color: #c4b5fd;
      border: 1px solid rgba(168,85,247,.3); border-radius: 8px;
      font-size: .85rem; text-decoration: none; font-weight: 500;
    }

    /* Toast */
    .toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999; display: flex; flex-direction: column; gap: .5rem; }
    .toast {
      padding: .75rem 1.25rem; border-radius: 10px; font-size: .88rem; font-weight: 500;
      animation: fadeIn .2s ease; box-shadow: 0 8px 25px rgba(0,0,0,.3);
      max-width: 320px;
    }
    .toast.success { background: rgba(34,197,94,.15); color: #4ade80; border: 1px solid rgba(34,197,94,.3); }
    .toast.error   { background: rgba(239,68,68,.15);  color: #fca5a5; border: 1px solid rgba(239,68,68,.3); }
    .toast.info    { background: rgba(59,130,246,.15); color: #93c5fd; border: 1px solid rgba(59,130,246,.3); }
    @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

    /* Loading spinner */
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: spin .6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Confirm dialog */
    .confirm-msg { text-align: center; padding: .5rem 0; }
    .confirm-msg .warn-icon { font-size: 2.5rem; margin-bottom: .75rem; }
    .confirm-msg p { color: var(--muted); font-size: .9rem; margin-top: .4rem; }
  </style>
</head>
<body>

<!-- ════════════════════════════════════
     AUTH PAGE
════════════════════════════════════ -->
<div id="auth-page">
  <div class="auth-box">
    <div class="auth-logo">🔐</div>
    <div class="auth-title">Task Board</div>
    <div class="auth-subtitle">Week 12 — Security Architecture</div>

    <div class="auth-tabs">
      <button class="auth-tab active" onclick="switchTab('login')">Login</button>
      <button class="auth-tab" onclick="switchTab('register')">Register</button>
    </div>

    <!-- Login Form -->
    <div id="login-form">
      <div class="form-group">
        <label>Email</label>
        <input id="login-email" type="email" value="alice@example.com" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input id="login-password" type="password" value="password123" placeholder="password">
      </div>
      <button class="btn-primary" onclick="doLogin()">เข้าสู่ระบบ</button>
    </div>

    <!-- Register Form -->
    <div id="register-form" class="hidden">
      <div class="form-group">
        <label>ชื่อ</label>
        <input id="reg-name" type="text" placeholder="ชื่อ-นามสกุล">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input id="reg-email" type="email" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label>Password (อย่างน้อย 6 ตัว)</label>
        <input id="reg-password" type="password" placeholder="password">
      </div>
      <button class="btn-primary" onclick="doRegister()">สมัครสมาชิก</button>
    </div>

    <div id="auth-msg"></div>

    <div class="auth-hint">
      <strong>ข้อมูลทดสอบ:</strong><br>
      👤 alice@example.com / password123 (member)<br>
      👑 admin@example.com / password123 (admin)
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     MAIN APP
════════════════════════════════════ -->
<div id="app-page" class="hidden">
  <!-- Sidebar -->
  <nav class="sidebar">
    <div class="sidebar-logo">📋 Task Board</div>
    <div class="sidebar-nav">
      <button class="nav-item active" data-page="tasks" onclick="showPage('tasks')">
        <span class="nav-icon">✅</span> Tasks
        <span class="badge-count" id="task-count">0</span>
      </button>
      <button class="nav-item" data-page="users" id="nav-users" onclick="showPage('users')">
        <span class="nav-icon">👥</span> Users
        <span class="badge-count" id="user-count" style="display:none">0</span>
      </button>
      <button class="nav-item" data-page="profile" onclick="showPage('profile')">
        <span class="nav-icon">👤</span> Profile & JWT
      </button>
      <a href="logs.html" target="_blank" class="nav-item" style="text-decoration:none;">
        <span class="nav-icon">📊</span> Log Dashboard
        <span style="margin-left:auto;font-size:.7rem;color:var(--muted)">↗</span>
      </a>
    </div>
    <div class="sidebar-footer">
      <div class="user-chip">
        <div class="user-avatar" id="sidebar-avatar">?</div>
        <div class="user-info-small">
          <div class="name" id="sidebar-name">—</div>
          <span class="role-badge" id="sidebar-role-badge">—</span>
        </div>
        <button class="btn-logout" onclick="doLogout()" title="Logout">✕</button>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <div class="main-content">
    <!-- ── TASKS PAGE ── -->
    <div id="page-tasks">
      <div class="page-header">
        <div class="page-title">✅ Tasks</div>
        <button class="btn-add" onclick="openCreateModal()">＋ สร้าง Task ใหม่</button>
      </div>
      <div class="page-body">
        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div>
              <div class="stat-value" id="st-total">—</div>
              <div class="stat-label">ทั้งหมด</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color:#64748b">⬜</div>
            <div>
              <div class="stat-value" id="st-todo">—</div>
              <div class="stat-label">TODO</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color:#f59e0b">🔄</div>
            <div>
              <div class="stat-value" id="st-inprog">—</div>
              <div class="stat-label">In Progress</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="color:#22c55e">✅</div>
            <div>
              <div class="stat-value" id="st-done">—</div>
              <div class="stat-label">Done</div>
            </div>
          </div>
        </div>
        <!-- Filter toolbar -->
        <div class="toolbar">
          <button class="filter-btn active" onclick="setFilter('ALL')">ทั้งหมด</button>
          <button class="filter-btn" onclick="setFilter('TODO')">TODO</button>
          <button class="filter-btn" onclick="setFilter('IN_PROGRESS')">In Progress</button>
          <button class="filter-btn" onclick="setFilter('DONE')">Done</button>
          <div class="spacer"></div>
          <button class="filter-btn" onclick="loadTasks()" title="Refresh">🔄 Refresh</button>
        </div>
        <!-- Task list -->
        <div class="task-list" id="task-list">
          <div class="empty-state"><div class="spinner"></div><p style="margin-top:1rem">กำลังโหลด...</p></div>
        </div>
      </div>
    </div>

    <!-- ── USERS PAGE ── -->
    <div id="page-users" class="hidden">
      <div class="page-header">
        <div class="page-title">👥 Users</div>
      </div>
      <div class="page-body">
        <div id="users-admin-only" class="hidden">
          <div class="user-table">
            <div class="user-row header">
              <div>ผู้ใช้</div><div>Email</div><div>Role</div><div>สมัครเมื่อ</div>
            </div>
            <div id="user-rows"></div>
          </div>
        </div>
        <div id="users-forbidden" class="empty-state hidden">
          <div class="emoji">🚫</div>
          <p style="font-size:1.1rem;color:var(--text);font-weight:600">403 Forbidden</p>
          <p>เฉพาะ <strong>admin</strong> เท่านั้นที่ดูรายชื่อผู้ใช้ทั้งหมดได้</p>
          <p style="margin-top:.5rem;font-size:.85rem">API ตอบกลับ: <code style="background:var(--surface);padding:2px 6px;border-radius:4px">{"error":"Forbidden"}</code></p>
        </div>
      </div>
    </div>

    <!-- ── PROFILE PAGE ── -->
    <div id="page-profile" class="hidden">
      <div class="page-header">
        <div class="page-title">👤 Profile & JWT</div>
      </div>
      <div class="page-body">
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar" id="prof-avatar">?</div>
            <div class="profile-info">
              <h2 id="prof-name">—</h2>
              <p id="prof-email">—</p>
              <span class="role-badge" id="prof-role-badge" style="margin-top:4px;display:inline-block">—</span>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item"><label>User ID</label><p id="prof-id">—</p></div>
            <div class="info-item"><label>Role</label><p id="prof-role">—</p></div>
            <div class="info-item"><label>สมัครเมื่อ</label><p id="prof-created">—</p></div>
            <div class="info-item"><label>API Endpoint</label><p style="font-size:.8rem;color:var(--muted)">GET /api/users/me</p></div>
          </div>

          <!-- JWT Inspector -->
          <div class="jwt-panel">
            <h3>🔍 JWT Token Inspector (เพื่อการเรียนรู้)</h3>
            <div class="jwt-parts" id="jwt-parts"></div>
            <div class="jwt-decoded" id="jwt-decoded"></div>
            <div class="token-exp" id="token-exp"></div>
          </div>

          <a href="logs.html" target="_blank" class="logs-link">
            📊 ไปดู Log Dashboard →
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════
     MODALS
════════════════════════════════════ -->
<!-- Create/Edit Task Modal -->
<div id="task-modal" class="modal-overlay hidden">
  <div class="modal">
    <div class="modal-header">
      <h3 id="modal-title">สร้าง Task ใหม่</h3>
      <button class="btn-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="modal-task-id">
      <div class="form-group">
        <label>ชื่อ Task *</label>
        <input id="modal-task-title" placeholder="เช่น: ออกแบบ UI หน้า Login">
      </div>
      <div class="form-group">
        <label>รายละเอียด</label>
        <textarea id="modal-task-desc" placeholder="อธิบายงานที่ต้องทำ..."></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group">
          <label>สถานะ</label>
          <select id="modal-task-status">
            <option value="TODO">⬜ TODO</option>
            <option value="IN_PROGRESS">🔄 In Progress</option>
            <option value="DONE">✅ Done</option>
          </select>
        </div>
        <div class="form-group">
          <label>ความสำคัญ</label>
          <select id="modal-task-priority">
            <option value="low">🟢 Low</option>
            <option value="medium" selected>🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">ยกเลิก</button>
      <button class="btn-submit" id="modal-submit-btn" onclick="submitTask()">💾 บันทึก</button>
    </div>
  </div>
</div>

<!-- Confirm Delete Modal -->
<div id="confirm-modal" class="modal-overlay hidden">
  <div class="modal" style="max-width:400px">
    <div class="modal-body">
      <div class="confirm-msg">
        <div class="warn-icon">🗑️</div>
        <p style="font-size:1rem;font-weight:700">ลบ Task นี้?</p>
        <p>ไม่สามารถกู้คืนได้หลังลบแล้ว</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeConfirm()">ยกเลิก</button>
      <button class="btn-danger" id="confirm-delete-btn">🗑️ ลบเลย</button>
    </div>
  </div>
</div>

<!-- Toast Container -->
<div class="toast-container" id="toast-container"></div>

<!-- ════════════════════════════════════
     JAVASCRIPT
════════════════════════════════════ -->
<script>
/* ─────────────────────────────────────
   STATE & CONFIG
───────────────────────────────────── */
const API = '';
let currentUser = null;
let token       = localStorage.getItem('jwt_token');
let allTasks    = [];
let currentFilter = 'ALL';

/* ─────────────────────────────────────
   API LOG (shared with logs.html)
───────────────────────────────────── */
const LOG_KEY = 'taskboard_api_log';
function logApiCall(method, url, status, duration, body = null) {
  const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  logs.unshift({
    time: new Date().toISOString(),
    method, url, status, duration, body,
    ok: status >= 200 && status < 300
  });
  if (logs.length > 300) logs.length = 300;
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

async function apiFetch(url, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, options);
    logApiCall(options.method || 'GET', url, res.status, Date.now() - start,
      options.body ? JSON.parse(options.body) : null);
    return res;
  } catch(err) {
    logApiCall(options.method || 'GET', url, 0, Date.now() - start);
    throw err;
  }
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/* ─────────────────────────────────────
   TOAST
───────────────────────────────────── */
function toast(msg, type = 'info', duration = 3000) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.getElementById('toast-container').prepend(t);
  setTimeout(() => t.remove(), duration);
}

/* ─────────────────────────────────────
   AUTH
───────────────────────────────────── */
function switchTab(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
  document.querySelectorAll('.auth-tab').forEach((el, i) => {
    el.classList.toggle('active', (i===0 && tab==='login') || (i===1 && tab==='register'));
  });
  document.getElementById('auth-msg').textContent = '';
}

function showAuthMsg(msg, type) {
  const el = document.getElementById('auth-msg');
  el.className = `auth-msg ${type}`;
  el.textContent = msg;
}

async function doLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showAuthMsg('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }

  const btn = document.querySelector('#login-form .btn-primary');
  btn.innerHTML = '<span class="spinner"></span> กำลังเข้าสู่ระบบ...';
  btn.disabled = true;

  const res  = await apiFetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  btn.textContent = 'เข้าสู่ระบบ';
  btn.disabled = false;

  if (res.ok) {
    token = data.token;
    localStorage.setItem('jwt_token', token);
    initApp(data.user);
  } else {
    showAuthMsg('❌ ' + (data.error || 'Login ล้มเหลว'), 'error');
  }
}

async function doRegister() {
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!name || !email || !password) { showAuthMsg('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }

  const res  = await apiFetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();

  if (res.ok) {
    token = data.token;
    localStorage.setItem('jwt_token', token);
    initApp(data.user);
  } else {
    showAuthMsg('❌ ' + (data.error || 'สมัครไม่สำเร็จ'), 'error');
  }
}

function doLogout() {
  localStorage.removeItem('jwt_token');
  token = null; currentUser = null; allTasks = [];
  document.getElementById('app-page').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  logApiCall('POST', '/api/auth/logout (client-side)', 200, 0);
}

/* ─────────────────────────────────────
   APP INIT
───────────────────────────────────── */
async function initApp(user) {
  currentUser = user;
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('app-page').classList.remove('hidden');

  // Sidebar user info
  const initials = (user.name||user.email||'?').charAt(0).toUpperCase();
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('sidebar-name').textContent   = user.name || user.email;
  const rb = document.getElementById('sidebar-role-badge');
  rb.textContent = user.role;
  rb.className   = `role-badge role-${user.role}`;

  // Show/hide Users nav
  document.getElementById('nav-users').style.display =
    user.role === 'admin' ? 'flex' : 'none';

  showPage('tasks');
}

/* ─────────────────────────────────────
   NAVIGATION
───────────────────────────────────── */
function showPage(page) {
  ['tasks','users','profile'].forEach(p => {
    document.getElementById(`page-${p}`).classList.toggle('hidden', p !== page);
    const btn = document.querySelector(`[data-page="${p}"]`);
    if (btn) btn.classList.toggle('active', p === page);
  });

  if (page === 'tasks')   loadTasks();
  if (page === 'users')   loadUsers();
  if (page === 'profile') loadProfile();
}

/* ─────────────────────────────────────
   TASKS — LOAD & RENDER
───────────────────────────────────── */
async function loadTasks() {
  const res  = await apiFetch(`${API}/api/tasks/`, { headers: authHeaders() });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) { toast('Session หมดอายุ กรุณา Login ใหม่', 'error'); doLogout(); }
    return;
  }

  allTasks = data.tasks || [];
  updateStats();
  renderTasks();
  document.getElementById('task-count').textContent = allTasks.length;
}

function updateStats() {
  const todo   = allTasks.filter(t => t.status === 'TODO').length;
  const inprog = allTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const done   = allTasks.filter(t => t.status === 'DONE').length;
  document.getElementById('st-total').textContent  = allTasks.length;
  document.getElementById('st-todo').textContent   = todo;
  document.getElementById('st-inprog').textContent = inprog;
  document.getElementById('st-done').textContent   = done;
}

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.includes(f) ||
      (f === 'ALL' && b.textContent === 'ทั้งหมด'));
  });
  renderTasks();
}

function renderTasks() {
  const tasks = currentFilter === 'ALL'
    ? allTasks
    : allTasks.filter(t => t.status === currentFilter);

  const list = document.getElementById('task-list');
  if (tasks.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="emoji">📭</div><p>ไม่มี Task ในหมวดนี้</p></div>`;
    return;
  }

  const priorityIcon = { low:'🟢', medium:'🟡', high:'🔴' };
  const statusChip   = {
    TODO:        '<span class="chip chip-todo">⬜ TODO</span>',
    IN_PROGRESS: '<span class="chip chip-inprogress">🔄 In Progress</span>',
    DONE:        '<span class="chip chip-done">✅ Done</span>',
  };

  list.innerHTML = tasks.map(t => `
    <div class="task-card status-${t.status}" id="task-${t.id}">
      <div class="task-header">
        <div class="title ${t.status==='DONE'?'done':''}">${escHtml(t.title)}</div>
        <div class="task-actions">
          <button class="btn-icon edit" onclick="openEditModal(${t.id})" title="แก้ไข">✏️</button>
          <button class="btn-icon delete" onclick="confirmDelete(${t.id})" title="ลบ">🗑️</button>
        </div>
      </div>
      ${t.description ? `<div class="task-desc">${escHtml(t.description)}</div>` : ''}
      <div class="task-meta">
        ${statusChip[t.status] || ''}
        <span class="chip chip-${t.priority}">${priorityIcon[t.priority]||'·'} ${t.priority}</span>
        <span class="chip chip-owner">👤 ${escHtml(t.owner_id||t.created_by||'?')}</span>
        <select class="status-select" onchange="quickStatusUpdate(${t.id}, this.value)">
          <option value="TODO"        ${t.status==='TODO'?'selected':''}>⬜ TODO</option>
          <option value="IN_PROGRESS" ${t.status==='IN_PROGRESS'?'selected':''}>🔄 In Progress</option>
          <option value="DONE"        ${t.status==='DONE'?'selected':''}>✅ Done</option>
        </select>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────
   TASKS — CREATE / EDIT / DELETE
───────────────────────────────────── */
function openCreateModal() {
  document.getElementById('modal-title').textContent    = '➕ สร้าง Task ใหม่';
  document.getElementById('modal-task-id').value        = '';
  document.getElementById('modal-task-title').value     = '';
  document.getElementById('modal-task-desc').value      = '';
  document.getElementById('modal-task-status').value    = 'TODO';
  document.getElementById('modal-task-priority').value  = 'medium';
  document.getElementById('modal-submit-btn').textContent = '💾 สร้าง Task';
  document.getElementById('task-modal').classList.remove('hidden');
  document.getElementById('modal-task-title').focus();
}

function openEditModal(id) {
  const t = allTasks.find(x => x.id === id);
  if (!t) return;
  document.getElementById('modal-title').textContent    = '✏️ แก้ไข Task';
  document.getElementById('modal-task-id').value        = t.id;
  document.getElementById('modal-task-title').value     = t.title;
  document.getElementById('modal-task-desc').value      = t.description || '';
  document.getElementById('modal-task-status').value    = t.status;
  document.getElementById('modal-task-priority').value  = t.priority;
  document.getElementById('modal-submit-btn').textContent = '💾 อัปเดต';
  document.getElementById('task-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('task-modal').classList.add('hidden'); }

async function submitTask() {
  const id    = document.getElementById('modal-task-id').value;
  const title = document.getElementById('modal-task-title').value.trim();
  if (!title) { toast('กรุณาใส่ชื่อ Task', 'error'); return; }

  const body = {
    title,
    description: document.getElementById('modal-task-desc').value,
    status:      document.getElementById('modal-task-status').value,
    priority:    document.getElementById('modal-task-priority').value,
  };

  const btn = document.getElementById('modal-submit-btn');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled  = true;

  let res;
  if (id) {
    // PUT — update existing
    res = await apiFetch(`${API}/api/tasks/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
  } else {
    // POST — create new
    res = await apiFetch(`${API}/api/tasks/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
  }

  btn.disabled  = false;
  btn.textContent = id ? '💾 อัปเดต' : '💾 สร้าง Task';

  if (res.ok) {
    toast(id ? '✅ อัปเดต Task แล้ว' : '✅ สร้าง Task แล้ว', 'success');
    closeModal();
    loadTasks();
  } else {
    const data = await res.json();
    if (res.status === 403) toast('🚫 403 Forbidden: คุณไม่มีสิทธิ์แก้ไข Task นี้', 'error', 4000);
    else toast('❌ ' + (data.error || 'เกิดข้อผิดพลาด'), 'error');
  }
}

async function quickStatusUpdate(id, newStatus) {
  const res = await apiFetch(`${API}/api/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status: newStatus })
  });
  if (res.ok) {
    toast(`🔄 เปลี่ยนสถานะเป็น ${newStatus}`, 'success', 2000);
    loadTasks();
  } else {
    const data = await res.json();
    if (res.status === 403) toast('🚫 403 Forbidden', 'error');
    else toast('❌ ' + (data.error || 'Error'), 'error');
    loadTasks(); // reset the select
  }
}

let deleteTargetId = null;
function confirmDelete(id) {
  deleteTargetId = id;
  document.getElementById('confirm-modal').classList.remove('hidden');
  document.getElementById('confirm-delete-btn').onclick = async () => {
    const res = await apiFetch(`${API}/api/tasks/${deleteTargetId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) {
      toast('🗑️ ลบ Task แล้ว', 'info');
      closeConfirm();
      loadTasks();
    } else {
      const data = await res.json();
      if (res.status === 403) toast('🚫 403 Forbidden: คุณลบ Task ของคนอื่นไม่ได้', 'error', 4000);
      else toast('❌ ' + (data.error || 'Error'), 'error');
      closeConfirm();
    }
  };
}
function closeConfirm() {
  document.getElementById('confirm-modal').classList.add('hidden');
  deleteTargetId = null;
}

/* ─────────────────────────────────────
   USERS
───────────────────────────────────── */
async function loadUsers() {
  const res  = await apiFetch(`${API}/api/users/`, { headers: authHeaders() });
  const data = await res.json();

  const adminDiv    = document.getElementById('users-admin-only');
  const forbiddenDiv = document.getElementById('users-forbidden');

  if (res.status === 403) {
    adminDiv.classList.add('hidden');
    forbiddenDiv.classList.remove('hidden');
    return;
  }
  if (!res.ok) { toast('❌ Error loading users', 'error'); return; }

  forbiddenDiv.classList.add('hidden');
  adminDiv.classList.remove('hidden');

  const users = data.users || [];
  document.getElementById('user-count').textContent   = users.length;
  document.getElementById('user-count').style.display = 'inline-block';

  document.getElementById('user-rows').innerHTML = users.map(u => `
    <div class="user-row">
      <div>
        <div style="font-weight:600">${escHtml(u.name||'—')}</div>
        <div class="user-email">${escHtml(u.email)}</div>
      </div>
      <div style="color:var(--muted);font-size:.82rem">${escHtml(u.email)}</div>
      <div><span class="role-badge role-${u.role}">${u.role}</span></div>
      <div style="color:var(--muted);font-size:.82rem">${new Date(u.created_at).toLocaleDateString('th-TH')}</div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────
   PROFILE
───────────────────────────────────── */
async function loadProfile() {
  const res  = await apiFetch(`${API}/api/users/me`, { headers: authHeaders() });
  const data = await res.json();
  const u    = data.user || currentUser;
  if (!u) return;

  const initial = (u.name || u.email || '?').charAt(0).toUpperCase();
  document.getElementById('prof-avatar').textContent    = initial;
  document.getElementById('prof-name').textContent      = u.name || '—';
  document.getElementById('prof-email').textContent     = u.email;
  document.getElementById('prof-id').textContent        = u.user_id || u.id || '—';
  document.getElementById('prof-role').textContent      = u.role;
  document.getElementById('prof-created').textContent   =
    u.created_at ? new Date(u.created_at).toLocaleDateString('th-TH') : '—';
  const rb = document.getElementById('prof-role-badge');
  rb.textContent = u.role;
  rb.className   = `role-badge role-${u.role}`;

  renderJwtInspector();
}

/* ─────────────────────────────────────
   JWT INSPECTOR
───────────────────────────────────── */
function renderJwtInspector() {
  if (!token) return;
  const parts = token.split('.');
  if (parts.length !== 3) return;

  // Colored token parts
  document.getElementById('jwt-parts').innerHTML = `
    <span class="jwt-part jwt-header-part"  title="Header">${parts[0]}</span>
    <span style="color:var(--muted)">.</span>
    <span class="jwt-part jwt-payload-part" title="Payload">${parts[1]}</span>
    <span style="color:var(--muted)">.</span>
    <span class="jwt-part jwt-sig-part"     title="Signature">${parts[2]}</span>
  `;

  try {
    const payload = JSON.parse(atob(parts[1]));
    const expDate = new Date(payload.exp * 1000);
    const nowMs   = Date.now();
    const msLeft  = expDate - nowMs;
    const minLeft = Math.round(msLeft / 60000);
    const isExp   = msLeft < 0;

    document.getElementById('jwt-decoded').innerHTML = `
      <p style="font-size:.78rem;color:var(--muted);margin-bottom:.4rem">🟣 Payload (decoded — ใครก็อ่านได้!):</p>
      <pre>${JSON.stringify(payload, null, 2)}</pre>
    `;
    document.getElementById('token-exp').innerHTML = isExp
      ? `<span class="exp-bad">⚠️ Token หมดอายุแล้ว!</span>`
      : `<span class="exp-ok">✅ Token ยังใช้ได้ — หมดอายุใน ${minLeft} นาที (${expDate.toLocaleTimeString('th-TH')})</span>`;
  } catch(e) {
    document.getElementById('jwt-decoded').innerHTML = '<p style="color:var(--red)">ไม่สามารถ decode ได้</p>';
  }
}

/* ─────────────────────────────────────
   UTILS
───────────────────────────────────── */
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Close modals on overlay click
document.getElementById('task-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.getElementById('confirm-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeConfirm();
});

/* ─────────────────────────────────────
   AUTO-LOGIN ON PAGE LOAD
───────────────────────────────────── */
if (token) {
  (async () => {
    const res  = await apiFetch(`${API}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.valid) {
      initApp(data.user);
    } else {
      localStorage.removeItem('jwt_token');
      token = null;
    }
  })();
}
</script>
</body>
</html>
```

---

### `frontend/logs.html` — Security Log Dashboard

> 📊 หน้านี้แสดง: **API Activity Log**, **Security Events**, **Request Stats**, **JWT Inspector**
> อ่าน log จาก `localStorage` ที่ `index.html` บันทึกไว้ — รีเฟรชทุก 3 วินาทีอัตโนมัติ

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📊 Log Dashboard — Task Board Week 12</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:      #0f172a;
      --surface: #1e293b;
      --s2:      #273448;
      --border:  #334155;
      --text:    #e2e8f0;
      --muted:   #94a3b8;
      --blue:    #3b82f6;
      --green:   #22c55e;
      --yellow:  #f59e0b;
      --red:     #ef4444;
      --purple:  #a855f7;
    }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg); color: var(--text);
      min-height: 100vh;
    }
    a { color: var(--blue); text-decoration: none; }

    /* ── HEADER ── */
    .header {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 1rem 2rem; display: flex; align-items: center; gap: 1.5rem;
    }
    .header h1 { font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: .5rem; }
    .live-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--green); display: inline-block;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: .6; transform: scale(1.3); }
    }
    .header-actions { margin-left: auto; display: flex; gap: .75rem; align-items: center; }
    .btn-sm {
      padding: .4rem .9rem; border-radius: 7px; font-size: .82rem;
      cursor: pointer; font-family: inherit; transition: all .15s;
    }
    .btn-outline {
      background: none; border: 1px solid var(--border); color: var(--muted);
    }
    .btn-outline:hover { border-color: var(--blue); color: var(--blue); }
    .btn-red {
      background: rgba(239,68,68,.15); border: 1px solid rgba(239,68,68,.3);
      color: #fca5a5;
    }
    .btn-red:hover { background: rgba(239,68,68,.25); }
    .refresh-info { font-size: .78rem; color: var(--muted); }
    .countdown { color: var(--blue); font-weight: 600; }

    /* ── LAYOUT ── */
    .layout { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; padding: 1.5rem; min-height: calc(100vh - 60px); }

    /* ── SECTION ── */
    .section { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
    .section-header {
      padding: .9rem 1.25rem; background: var(--s2);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .section-header h2 { font-size: .95rem; font-weight: 700; display: flex; align-items: center; gap: .5rem; }
    .count-badge {
      background: var(--blue); color: white; padding: 1px 8px;
      border-radius: 999px; font-size: .72rem; font-weight: 700;
    }

    /* ── STATS STRIP ── */
    .stats-strip { display: grid; grid-template-columns: repeat(5,1fr); gap: .75rem; margin-bottom: 1.25rem; }
    .stat-tile {
      background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
      padding: .9rem 1rem; text-align: center;
    }
    .stat-tile .num { font-size: 1.7rem; font-weight: 800; line-height: 1; }
    .stat-tile .lbl { font-size: .72rem; color: var(--muted); margin-top: 4px; }
    .green { color: var(--green); }
    .red   { color: var(--red); }
    .yellow{ color: var(--yellow); }
    .blue  { color: var(--blue); }
    .purple{ color: var(--purple); }

    /* ── LOG TABLE ── */
    .log-scroll { overflow-y: auto; max-height: 480px; }
    .log-row {
      display: grid; grid-template-columns: 80px 50px 180px 60px 70px;
      align-items: center; padding: .5rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,.04);
      font-family: monospace; font-size: .78rem;
      transition: background .15s;
    }
    .log-row:hover { background: var(--s2); }
    .log-row .time { color: var(--muted); }
    .method-GET    { color: #93c5fd; font-weight: 700; }
    .method-POST   { color: #86efac; font-weight: 700; }
    .method-PUT    { color: #fde68a; font-weight: 700; }
    .method-DELETE { color: #fca5a5; font-weight: 700; }
    .url-cell { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .status-ok  { color: var(--green); font-weight: 700; }
    .status-4xx { color: var(--red);   font-weight: 700; }
    .status-5xx { color: var(--yellow);font-weight: 700; }
    .ms-cell    { color: var(--muted); text-align: right; }
    .log-header {
      display: grid; grid-template-columns: 80px 50px 180px 60px 70px;
      padding: .4rem 1.25rem; background: var(--s2);
      font-size: .7rem; color: var(--muted); text-transform: uppercase;
      letter-spacing: .06em; border-bottom: 1px solid var(--border); position: sticky; top: 0;
    }

    /* ── SECURITY EVENTS ── */
    .sec-list { max-height: 200px; overflow-y: auto; }
    .sec-row {
      padding: .55rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,.04);
      font-size: .8rem; display: flex; align-items: center; gap: .75rem;
    }
    .sec-icon { font-size: 1rem; flex-shrink: 0; }
    .sec-info { flex: 1; min-width: 0; }
    .sec-time { color: var(--muted); font-size: .7rem; font-family: monospace; flex-shrink: 0; }

    /* ── ENDPOINT STATS BAR ── */
    .endpoint-list { padding: 1rem 1.25rem; }
    .ep-row { margin-bottom: .75rem; }
    .ep-label { display: flex; justify-content: space-between; font-size: .78rem; margin-bottom: 3px; }
    .ep-label .ep-name { font-family: monospace; }
    .ep-label .ep-count { color: var(--muted); }
    .ep-bar-wrap { height: 6px; background: var(--s2); border-radius: 3px; overflow: hidden; }
    .ep-bar { height: 100%; border-radius: 3px; transition: width .3s; }
    .ep-color-0 { background: #3b82f6; }
    .ep-color-1 { background: #22c55e; }
    .ep-color-2 { background: #f59e0b; }
    .ep-color-3 { background: #a855f7; }
    .ep-color-4 { background: #ef4444; }

    /* ── JWT INSPECTOR ── */
    .jwt-section { padding: 1.25rem; }
    .jwt-token-text {
      font-family: monospace; font-size: .7rem; word-break: break-all;
      background: var(--bg); padding: .75rem; border-radius: 8px; border: 1px solid var(--border);
      line-height: 1.6; margin-bottom: 1rem;
    }
    .jwt-part-h { color: #fca5a5; }
    .jwt-part-p { color: #c4b5fd; }
    .jwt-part-s { color: #93c5fd; }
    .jwt-payload-display {
      background: var(--bg); border-radius: 8px; padding: .75rem;
      border: 1px solid var(--border);
    }
    .jwt-payload-display table { width: 100%; border-collapse: collapse; font-size: .78rem; }
    .jwt-payload-display td { padding: .3rem .4rem; vertical-align: top; }
    .jwt-payload-display td:first-child { color: var(--muted); font-weight: 600; width: 60px; white-space: nowrap; }
    .jwt-payload-display td:last-child { color: var(--text); word-break: break-all; }
    .exp-ok  { color: var(--green); font-weight: 600; }
    .exp-warn{ color: var(--yellow); font-weight: 600; }
    .exp-bad { color: var(--red);   font-weight: 600; }
    .no-token { padding: 1.5rem; text-align: center; color: var(--muted); font-size: .85rem; }

    /* ── SIDE COLUMN ── */
    .side-col { display: flex; flex-direction: column; gap: 1.25rem; }

    /* ── EMPTY ── */
    .empty-log { padding: 2.5rem; text-align: center; color: var(--muted); }
    .empty-log .big { font-size: 2rem; margin-bottom: .5rem; }
  </style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <h1>📊 Log Dashboard <span class="live-dot"></span></h1>
  <span class="refresh-info">Auto-refresh ใน <span class="countdown" id="countdown">3</span>s</span>
  <div class="header-actions">
    <a href="index.html" class="btn-sm btn-outline">← กลับ Task Board</a>
    <button class="btn-sm btn-outline" onclick="refreshNow()">🔄 Refresh</button>
    <button class="btn-sm btn-red" onclick="clearLogs()">🗑️ ล้าง Logs</button>
  </div>
</div>

<!-- MAIN LAYOUT -->
<div class="layout">

  <!-- LEFT COLUMN: Stats + Log Table -->
  <div style="display:flex;flex-direction:column;gap:1.25rem;">

    <!-- Stats Strip -->
    <div class="stats-strip">
      <div class="stat-tile">
        <div class="num blue"  id="s-total">0</div>
        <div class="lbl">Total Requests</div>
      </div>
      <div class="stat-tile">
        <div class="num green" id="s-2xx">0</div>
        <div class="lbl">2xx Success</div>
      </div>
      <div class="stat-tile">
        <div class="num red"   id="s-4xx">0</div>
        <div class="lbl">4xx Error</div>
      </div>
      <div class="stat-tile">
        <div class="num yellow" id="s-401">0</div>
        <div class="lbl">401 Unauth</div>
      </div>
      <div class="stat-tile">
        <div class="num purple" id="s-403">0</div>
        <div class="lbl">403 Forbidden</div>
      </div>
    </div>

    <!-- API Activity Log -->
    <div class="section">
      <div class="section-header">
        <h2>📡 API Activity Log</h2>
        <span class="count-badge" id="log-count">0</span>
      </div>
      <div class="log-header">
        <span>เวลา</span><span>Method</span><span>URL</span><span>Status</span><span>ms</span>
      </div>
      <div class="log-scroll" id="log-table">
        <div class="empty-log"><div class="big">📭</div><p>ยังไม่มี API calls<br>ไปใช้งาน Task Board แล้วกลับมาดู</p></div>
      </div>
    </div>

    <!-- Security Events -->
    <div class="section">
      <div class="section-header">
        <h2>🛡️ Security Events</h2>
        <span class="count-badge" id="sec-count" style="background:var(--red)">0</span>
      </div>
      <div class="sec-list" id="sec-list">
        <div class="sec-row" style="color:var(--muted);font-size:.82rem;justify-content:center;padding:1.5rem">
          ✅ ยังไม่มี Security Events
        </div>
      </div>
    </div>

  </div>

  <!-- RIGHT COLUMN -->
  <div class="side-col">

    <!-- Endpoint Hit Counter -->
    <div class="section">
      <div class="section-header">
        <h2>📈 Endpoint Hits</h2>
      </div>
      <div class="endpoint-list" id="endpoint-stats">
        <p style="color:var(--muted);font-size:.82rem;text-align:center;padding:1rem">รอ data...</p>
      </div>
    </div>

    <!-- JWT Inspector -->
    <div class="section">
      <div class="section-header">
        <h2>🔍 JWT Inspector</h2>
      </div>
      <div id="jwt-section">
        <div class="no-token">ยังไม่มี Token<br><a href="index.html">ไป Login ก่อน →</a></div>
      </div>
    </div>

    <!-- Legend -->
    <div class="section">
      <div class="section-header"><h2>📖 Legend</h2></div>
      <div style="padding:1rem 1.25rem;font-size:.8rem;line-height:2">
        <div><span class="method-GET">GET</span> — ดึงข้อมูล (Read)</div>
        <div><span class="method-POST">POST</span> — สร้างข้อมูลใหม่</div>
        <div><span class="method-PUT">PUT</span> — แก้ไขข้อมูล</div>
        <div><span class="method-DELETE">DELETE</span> — ลบข้อมูล</div>
        <hr style="border-color:var(--border);margin:.5rem 0">
        <div><span class="status-ok">2xx</span> — สำเร็จ</div>
        <div><span class="status-4xx">401</span> — ไม่มี / Token หมดอายุ</div>
        <div><span class="status-4xx">403</span> — ไม่มีสิทธิ์ (Role)</div>
        <div><span class="status-4xx">429</span> — Rate Limit เกิน</div>
        <div><span class="status-5xx">5xx</span> — Server Error</div>
      </div>
    </div>

  </div>
</div>

<script>
const LOG_KEY = 'taskboard_api_log';
let countdown  = 3;
let timer      = null;

function getLogs() {
  return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
}

function clearLogs() {
  if (confirm('ล้าง API log ทั้งหมดหรือ?')) {
    localStorage.removeItem(LOG_KEY);
    renderAll();
  }
}

function refreshNow() {
  countdown = 3;
  renderAll();
}

/* ─── MAIN RENDER ─── */
function renderAll() {
  const logs = getLogs();
  renderStats(logs);
  renderLogTable(logs);
  renderSecurityEvents(logs);
  renderEndpointStats(logs);
  renderJwt();
  document.getElementById('log-count').textContent = logs.length;
}

/* ─── STATS ─── */
function renderStats(logs) {
  const total = logs.length;
  const s2xx  = logs.filter(l => l.status >= 200 && l.status < 300).length;
  const s4xx  = logs.filter(l => l.status >= 400 && l.status < 500).length;
  const s401  = logs.filter(l => l.status === 401).length;
  const s403  = logs.filter(l => l.status === 403).length;
  document.getElementById('s-total').textContent = total;
  document.getElementById('s-2xx').textContent   = s2xx;
  document.getElementById('s-4xx').textContent   = s4xx;
  document.getElementById('s-401').textContent   = s401;
  document.getElementById('s-403').textContent   = s403;
}

/* ─── LOG TABLE ─── */
function renderLogTable(logs) {
  const el = document.getElementById('log-table');
  if (logs.length === 0) {
    el.innerHTML = '<div class="empty-log"><div class="big">📭</div><p>ยังไม่มี API calls<br>ไปใช้งาน Task Board แล้วกลับมาดู</p></div>';
    return;
  }

  el.innerHTML = logs.slice(0, 100).map(l => {
    const t    = new Date(l.time).toLocaleTimeString('th-TH');
    const mCls = `method-${l.method}`;
    const sCls = l.status >= 500 ? 'status-5xx' : l.status >= 400 ? 'status-4xx' : 'status-ok';
    const path = (l.url || '/').replace(/^https?:\/\/[^/]+/, '');
    const ms   = l.duration || 0;
    return `<div class="log-row">
      <span class="time">${t}</span>
      <span class="${mCls}">${l.method}</span>
      <span class="url-cell" title="${esc(l.url)}">${esc(path)}</span>
      <span class="${sCls}">${l.status || 'ERR'}</span>
      <span class="ms-cell">${ms}ms</span>
    </div>`;
  }).join('');
}

/* ─── SECURITY EVENTS ─── */
function renderSecurityEvents(logs) {
  const events = logs.filter(l => [401, 403, 429, 0].includes(l.status));
  document.getElementById('sec-count').textContent = events.length;

  const el = document.getElementById('sec-list');
  if (events.length === 0) {
    el.innerHTML = '<div class="sec-row" style="color:var(--muted);justify-content:center;padding:1.5rem">✅ ไม่มี Security Events</div>';
    return;
  }

  const secConfig = {
    401: { icon: '🔑', label: 'Unauthorized',   color: '#fbbf24' },
    403: { icon: '🚫', label: 'Forbidden',       color: '#fca5a5' },
    429: { icon: '⚡', label: 'Rate Limited',    color: '#f97316' },
    0:   { icon: '❌', label: 'Network Error',   color: '#94a3b8' },
  };

  el.innerHTML = events.slice(0, 30).map(l => {
    const cfg  = secConfig[l.status] || { icon: '⚠️', label: `HTTP ${l.status}`, color: '#94a3b8' };
    const t    = new Date(l.time).toLocaleTimeString('th-TH');
    const path = (l.url || '/').replace(/^https?:\/\/[^/]+/, '');
    return `<div class="sec-row">
      <span class="sec-icon">${cfg.icon}</span>
      <div class="sec-info">
        <div style="font-weight:600;color:${cfg.color}">${cfg.label} (${l.status})</div>
        <div style="color:var(--muted);font-size:.72rem;font-family:monospace">${l.method} ${esc(path)}</div>
      </div>
      <span class="sec-time">${t}</span>
    </div>`;
  }).join('');
}

/* ─── ENDPOINT STATS ─── */
function renderEndpointStats(logs) {
  if (logs.length === 0) {
    document.getElementById('endpoint-stats').innerHTML =
      '<p style="color:var(--muted);font-size:.82rem;text-align:center;padding:1rem">รอ data...</p>';
    return;
  }

  // Count by normalized endpoint
  const counts = {};
  logs.forEach(l => {
    const path = (l.url || '/').replace(/^https?:\/\/[^/]+/, '').replace(/\/\d+/g, '/:id');
    const key  = `${l.method} ${path}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 8);
  const maxVal = sorted[0]?.[1] || 1;

  document.getElementById('endpoint-stats').innerHTML = sorted.map(([ep, cnt], i) => `
    <div class="ep-row">
      <div class="ep-label">
        <span class="ep-name">${esc(ep)}</span>
        <span class="ep-count">${cnt} hits</span>
      </div>
      <div class="ep-bar-wrap">
        <div class="ep-bar ep-color-${i % 5}" style="width:${Math.round(cnt/maxVal*100)}%"></div>
      </div>
    </div>
  `).join('');
}

/* ─── JWT INSPECTOR ─── */
function renderJwt() {
  const token = localStorage.getItem('jwt_token');
  const el    = document.getElementById('jwt-section');
  if (!token) {
    el.innerHTML = '<div class="no-token">ยังไม่มี Token<br><a href="index.html">ไป Login ก่อน →</a></div>';
    return;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    el.innerHTML = '<div class="no-token">Token format ผิด</div>';
    return;
  }

  let payload;
  try { payload = JSON.parse(atob(parts[1])); }
  catch(e) { el.innerHTML = '<div class="no-token">Decode ไม่ได้</div>'; return; }

  const expMs   = payload.exp * 1000;
  const msLeft  = expMs - Date.now();
  const minLeft = Math.round(msLeft / 60000);
  let expCls, expTxt;
  if (msLeft < 0)       { expCls = 'exp-bad';  expTxt = '❌ หมดอายุแล้ว!'; }
  else if (minLeft < 5) { expCls = 'exp-warn'; expTxt = `⚠️ หมดใน ${minLeft} นาที`; }
  else                  { expCls = 'exp-ok';   expTxt = `✅ หมดใน ${minLeft} นาที`; }

  el.innerHTML = `
    <div class="jwt-section">
      <p style="font-size:.72rem;color:var(--muted);margin-bottom:.6rem">🔴 Header . 🟣 Payload . 🔵 Signature</p>
      <div class="jwt-token-text">
        <span class="jwt-part-h">${parts[0]}</span><span style="color:var(--muted)">.</span><span class="jwt-part-p">${parts[1]}</span><span style="color:var(--muted)">.</span><span class="jwt-part-s">${parts[2]}</span>
      </div>
      <div class="jwt-payload-display">
        <table>
          <tr><td>sub</td><td>${esc(payload.sub||'—')}</td></tr>
          <tr><td>email</td><td>${esc(payload.email||'—')}</td></tr>
          <tr><td>role</td><td>${esc(payload.role||'—')}</td></tr>
          <tr><td>iat</td><td>${new Date(payload.iat*1000).toLocaleString('th-TH')}</td></tr>
          <tr><td>exp</td><td><span class="${expCls}">${expTxt}</span></td></tr>
        </table>
      </div>
      <p style="font-size:.72rem;color:var(--muted);margin-top:.75rem">
        💡 Payload อ่านได้โดยไม่ต้องมี Secret — ห้ามใส่ข้อมูลลับ!
      </p>
    </div>
  `;
}

/* ─── UTILS ─── */
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─── AUTO-REFRESH ─── */
function tick() {
  countdown--;
  document.getElementById('countdown').textContent = countdown;
  if (countdown <= 0) {
    countdown = 3;
    renderAll();
  }
}

renderAll();
timer = setInterval(tick, 1000);
</script>
</body>
</html>
```

---

### สรุป: API Endpoints ที่ Frontend ใช้งาน

| หน้า | Action | Method | Endpoint | Auth |
|------|--------|--------|----------|------|
| Login | เข้าสู่ระบบ | `POST` | `/api/auth/login` | ❌ |
| Login | สมัครสมาชิก | `POST` | `/api/auth/register` | ❌ |
| Auto-login | ตรวจ Token | `GET` | `/api/auth/verify` | ✅ Bearer |
| Tasks | ดู Tasks ทั้งหมด | `GET` | `/api/tasks/` | ✅ Bearer |
| Tasks | สร้าง Task | `POST` | `/api/tasks/` | ✅ Bearer |
| Tasks | แก้ไข Task | `PUT` | `/api/tasks/:id` | ✅ Bearer |
| Tasks | เปลี่ยน Status | `PUT` | `/api/tasks/:id` | ✅ Bearer |
| Tasks | ลบ Task | `DELETE` | `/api/tasks/:id` | ✅ Bearer |
| Users | ดู Users (admin) | `GET` | `/api/users/` | ✅ Admin |
| Profile | ดูข้อมูลตัวเอง | `GET` | `/api/users/me` | ✅ Bearer |
| Log Dashboard | ดู JWT | — | `localStorage` | — |



## 📝 ใบงาน + การส่งงาน

### ใบงาน Week 12: Security Architecture Analysis

กรอกคำตอบลงใน `REPORT.md` ใน git repository

**ส่วนที่ 1: Test Results (40 คะแนน)**
> กรอกตาราง Test Cases 8 ข้อ พร้อม screenshot ของ Response

**ส่วนที่ 2: Architecture Comparison (30 คะแนน)**
> วาด C2 Diagram ก่อน (Week 6) และหลัง (Week 12) ใน draw.io พร้อมอธิบาย:
> - Components ที่เพิ่มมา
> - ทำไมถึงเพิ่ม Component นั้น (จาก STRIDE threats อะไร)

**ส่วนที่ 3: ADR — Architecture Decision Record (30 คะแนน)**
> เขียน ADR สำหรับการตัดสินใจ "เพิ่ม Auth Service แยก" ลงใน `docs/ADR-001-auth-service.md` ตามรูปแบบ:

```markdown
# ADR-001: เพิ่ม Auth Service แยกจาก Task Service

## Status
Accepted

## Context
(อธิบายปัญหาที่เจอ เช่น Task Service ทำ authentication ด้วย...)

## Decision
(บอกว่าตัดสินใจทำอะไร เช่น แยก Auth Service ออกเป็น service แยก...)

## Consequences
**Positive:**
- ...
**Negative:**
- ...
**Trade-offs:**
- ...
```

### การส่งงานผ่าน Git

```bash
# โครงสร้างที่ต้อง commit
task-board-security/
├── docker-compose.yml
├── .env.example              ← .env ต้นฉบับที่ไม่มี secret จริง
├── auth-service/
├── task-service/
├── user-service/
├── nginx/
├── frontend/
├── monitoring/
├── docs/
│   └── ADR-001-auth-service.md
├── REPORT.md                 ← ใบงาน + test results
└── README.md

# ขั้นตอน
git add .
git commit -m "feat: Week 12 - Security Architecture with JWT Auth"
git push origin main
```

> ⚠️ **สำคัญ:** เพิ่ม `.env` ใน `.gitignore` — อย่า push secret จริง!

**`.gitignore`:**
```
# Secrets — ห้าม push ทุกกรณี!
.env
.env.*
!.env.example

# Dependencies
node_modules/
*/node_modules/

# Logs
*.log
logs/

# Docker data volumes
*-db-data/

# OS files
.DS_Store
Thumbs.db
```

---

## 🚀 Challenge: ต่อยอด (ถ้าเวลาเหลือ)

### Challenge 1: Token Refresh (Medium 🔥🔥)
เพิ่ม Refresh Token เพื่อให้ผู้ใช้ไม่ต้อง Login ใหม่ทุกครั้ง token หมดอายุ
```
Hint: ออก 2 tokens:
- accessToken: อายุสั้น (15 นาที)  
- refreshToken: อายุยาว (7 วัน), เก็บใน DB
POST /api/auth/refresh → ตรวจ refreshToken → ออก accessToken ใหม่
```

### Challenge 2: Log Dashboard ใน Grafana (Easy 🔥)
สร้าง Dashboard ใน Grafana แสดง:
- จำนวน login สำเร็จ/ล้มเหลวต่อชั่วโมง
- Top IPs ที่ request มากที่สุด
- Graph แสดง API response time

### Challenge 3: Role Permission System (Hard 🔥🔥🔥)
เพิ่ม Permission table เพื่อให้ Admin กำหนด permission แบบ fine-grained:
```
permissions: create_task, edit_task, delete_task, view_all_tasks
roles: admin (all), lead (all except delete), member (create+edit own)
```

---

## 🖼️ Draw.io XML Diagrams

### Diagram 1: C2 Container Diagram (Week 12)

บันทึกเป็น `docs/c2-security-architecture.drawio`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1"
  tooltips="1" connect="1" arrows="1" fold="1" page="1"
  pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

    <!-- Title -->
    <mxCell id="title" value="C2: Task Board Security Architecture (Week 12)"
      style="text;html=1;strokeColor=none;fillColor=none;align=center;
             verticalAlign=middle;whiteSpace=wrap;rounded=0;
             fontSize=18;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="20" width="760" height="40" as="geometry" />
    </mxCell>

    <!-- Internet/User -->
    <mxCell id="user" value="🌐 Browser / User" 
      style="shape=mxgraph.c4.person2;whiteSpace=wrap;html=1;
             fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
      <mxGeometry x="40" y="200" width="120" height="80" as="geometry" />
    </mxCell>

    <!-- Nginx API Gateway -->
    <mxCell id="nginx" value="🛡️ Nginx API Gateway&#xa;[Container: nginx:alpine]&#xa;&#xa;- Rate Limiting (5r/m auth)&#xa;- Route /api/auth → auth-svc&#xa;- Route /api/tasks → task-svc&#xa;- Route /api/users → user-svc"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f0a30a;
             fontColor=#000000;strokeColor=#BD7000;fontSize=12;" vertex="1" parent="1">
      <mxGeometry x="230" y="170" width="220" height="130" as="geometry" />
    </mxCell>

    <!-- Auth Service -->
    <mxCell id="auth-svc" value="🔑 Auth Service&#xa;[Container: Node.js]&#xa;&#xa;- POST /api/auth/login&#xa;- POST /api/auth/register&#xa;- GET /api/auth/verify&#xa;- Issues JWT Token"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;
             strokeColor=#82b366;fontSize=12;" vertex="1" parent="1">
      <mxGeometry x="520" y="80" width="200" height="130" as="geometry" />
    </mxCell>

    <!-- Task Service -->
    <mxCell id="task-svc" value="📋 Task Service&#xa;[Container: Node.js]&#xa;&#xa;- CRUD /api/tasks&#xa;- JWT Middleware&#xa;- Role-based access"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;
             strokeColor=#82b366;fontSize=12;" vertex="1" parent="1">
      <mxGeometry x="520" y="235" width="200" height="120" as="geometry" />
    </mxCell>

    <!-- User Service -->
    <mxCell id="user-svc" value="👤 User Service&#xa;[Container: Node.js]&#xa;&#xa;- GET /api/users/me&#xa;- GET /api/users (admin)&#xa;- JWT Middleware"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;
             strokeColor=#82b366;fontSize=12;" vertex="1" parent="1">
      <mxGeometry x="520" y="375" width="200" height="120" as="geometry" />
    </mxCell>

    <!-- Auth DB -->
    <mxCell id="auth-db" value="🗄️ auth-db&#xa;[PostgreSQL]&#xa;auth_users table"
      style="shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;
             fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="790" y="100" width="120" height="90" as="geometry" />
    </mxCell>

    <!-- Task DB -->
    <mxCell id="task-db" value="🗄️ task-db&#xa;[PostgreSQL]&#xa;tasks table"
      style="shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;
             fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="790" y="250" width="120" height="90" as="geometry" />
    </mxCell>

    <!-- User DB -->
    <mxCell id="user-db" value="🗄️ user-db&#xa;[PostgreSQL]&#xa;user_profiles table"
      style="shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;
             fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;" vertex="1" parent="1">
      <mxGeometry x="790" y="390" width="120" height="90" as="geometry" />
    </mxCell>

    <!-- Loki -->
    <mxCell id="loki" value="📊 Loki + Grafana&#xa;[Monitoring Stack]&#xa;&#xa;- Centralized Logs&#xa;- Security Events&#xa;- Failed logins alert"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;
             strokeColor=#9673a6;fontSize=12;" vertex="1" parent="1">
      <mxGeometry x="230" y="370" width="200" height="110" as="geometry" />
    </mxCell>

    <!-- Edges -->
    <mxCell id="e1" value="HTTPS :80" style="edgeStyle=orthogonalEdgeStyle;"
      edge="1" source="user" target="nginx" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e2" value="/api/auth/*" style="edgeStyle=orthogonalEdgeStyle;"
      edge="1" source="nginx" target="auth-svc" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e3" value="/api/tasks/* (JWT)" style="edgeStyle=orthogonalEdgeStyle;"
      edge="1" source="nginx" target="task-svc" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e4" value="/api/users/* (JWT)" style="edgeStyle=orthogonalEdgeStyle;"
      edge="1" source="nginx" target="user-svc" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e5" edge="1" source="auth-svc" target="auth-db" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e6" edge="1" source="task-svc" target="task-db" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e7" edge="1" source="user-svc" target="user-db" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e8" value="stdout logs" style="dashed=1;"
      edge="1" source="auth-svc" target="loki" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
    <mxCell id="e9" value="stdout logs" style="dashed=1;"
      edge="1" source="task-svc" target="loki" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>
  </root>
</mxGraphModel>
```

---

## 🔧 Troubleshooting

### ปัญหา: Service ไม่ start เพราะ DB ยังไม่พร้อม

```bash
# รอแล้วลอง restart
docker compose restart auth-service

# หรือ recreate
docker compose up --force-recreate auth-service
```

### ปัญหา: 401 ทั้งที่ส่ง Token ถูกต้อง

```bash
# ตรวจสอบ JWT_SECRET เหมือนกันทุก service
docker compose exec auth-service printenv JWT_SECRET
docker compose exec task-service printenv JWT_SECRET

# ต้องตรงกัน! ถ้าไม่ตรง:
# แก้ .env แล้ว docker compose up --force-recreate
```

### ปัญหา: Grafana ไม่แสดง logs

```bash
# ตรวจว่า Loki พร้อมหรือยัง
curl http://localhost:3100/ready

# ดู Grafana logs
docker compose logs grafana

# ลอง query ใน Grafana ด้วย: {job="varlogs"}
```

### ปัญหา: Rate Limit ติด 429 ระหว่างทดสอบ

```bash
# รอ 1 นาที หรือ restart nginx เพื่อ reset counter
docker compose restart nginx
```

### ปัญหา: Port conflict

```bash
# ตรวจว่า port 80, 3000, 3100 ถูกใช้งานหรือไม่
sudo lsof -i :80
sudo lsof -i :3000

# แก้ ports ใน docker-compose.yml ถ้าจำเป็น
# เช่น "8080:80" แทน "80:80"
```

---

## 📊 สรุปสิ่งที่เรียนรู้


```
┌────────────────────────────────────────────────────────────────────┐
│                Week 12 Lab: สรุปสิ่งที่เรียนรู้                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ✅ Authentication vs Authorization                                │
│     • AuthN = พิสูจน์ตัวตน (JWT Login)                                 │
│     • AuthZ = ตรวจสิทธิ์ (Role-based access)                          │
│                                                                    │
│  ✅ JWT Token Structure                                            │
│     • Header.Payload.Signature                                     │
│     • Payload อ่านได้ แต่ปลอมแปลงไม่ได้                                 │
│     • มีอายุ (exp) — token หมดอายุ ต้อง login ใหม่                      │
│                                                                    │
│  ✅ Auth Service Pattern                                           │
│     • แยก Authentication ออกเป็น service เดียว                       │
│     • Single Responsibility Principle                              │
│     • JWT Secret ใช้ร่วมกันผ่าน environment variable                   │
│                                                                    │
│  ✅ Defense in Depth                                               │
│     • Rate Limiting (Nginx) — ชั้นที่ 1                                │
│     • JWT Validation — ชั้นที่ 2                                       │
│     • Role-based Authorization — ชั้นที่ 3                             │
│     • Parameterized Queries (SQL Injection) — ชั้นที่ 4                │
│                                                                    │
│  ✅ Centralized Logging                                            │
│     • ทุก service log ผ่าน stdout                                    │
│     • Docker log driver รวบรวม logs                                │
│     • Loki + Grafana ดูและค้นหา logs ได้                              │
│                                                                    │
│  ✅ Trade-offs ที่พบ                                                 │
│     • Complexity เพิ่ม (9 containers แทน 3)                          │
│     • JWT adds ~5ms latency ต่อ request                             │
│     • Rate Limit อาจกวนผู้ใช้ที่ใช้งานปกติ                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

*Document Version: 1.1 (Revised — Promtail Added, Bug Fixes Applied)*
*Course: ENGCE301 Software Design and Development — Week 12 Lab*
*Instructor: นายธนิต เกตุแก้ว*
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
