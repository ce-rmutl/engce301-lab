# ENGCE301 Software Design and Development
# Final Lab — ชุดที่ 1: Microservices + HTTPS + Lightweight Logging

> **งานกลุ่ม (2 คน/กลุ่ม) | ทำที่บ้าน 1 วัน | คะแนนเต็ม 100 คะแนน**
>
> 💡 ใช้ code จาก **Week 6, Week 7 และ Week 12** เป็นฐานได้เลย  
> 📌 **ส่งผ่าน Git Repository เท่านั้น**

---

## สารบัญ

- [ENGCE301 Software Design and Development](#engce301-software-design-and-development)
- [Final Lab — ชุดที่ 1: Microservices + HTTPS + Lightweight Logging](#final-lab--ชุดที่-1-microservices--https--lightweight-logging)
  - [สารบัญ](#สารบัญ)
  - [1. ภาพรวมและวัตถุประสงค์](#1-ภาพรวมและวัตถุประสงค์)
    - [วัตถุประสงค์การเรียนรู้](#วัตถุประสงค์การเรียนรู้)
    - [ข้อกำหนดหลัก](#ข้อกำหนดหลัก)
  - [2. สถาปัตยกรรมที่ต้องสร้าง](#2-สถาปัตยกรรมที่ต้องสร้าง)
    - [Services ที่ต้องสร้าง](#services-ที่ต้องสร้าง)
  - [3. โครงสร้าง Repository](#3-โครงสร้าง-repository)
  - [4. Part 1: HTTPS Nginx (API Gateway)](#4-part-1-https-nginx-api-gateway)
    - [4.1 สร้าง Self-Signed Certificate](#41-สร้าง-self-signed-certificate)
    - [4.2 Nginx Config](#42-nginx-config)
  - [5. Part 2: Database Schema + Seed Users](#5-part-2-database-schema--seed-users)
  - [6. Part 3: Auth Service](#6-part-3-auth-service)
  - [7. Part 4: Task Service](#7-part-4-task-service)
  - [8. Part 5: Log Service](#8-part-5-log-service)
    - [Log Events ที่ต้องบันทึก (บังคับ)](#log-events-ที่ต้องบันทึก-บังคับ)
  - [9. Part 6: Docker Compose รวมทุก Service](#9-part-6-docker-compose-รวมทุก-service)
  - [10. Part 7: Frontend — Task Board UI](#10-part-7-frontend--task-board-ui)
  - [11. Part 8: Frontend — Log Dashboard](#11-part-8-frontend--log-dashboard)
  - [12. Part 9: Test Cases และ Screenshots](#12-part-9-test-cases-และ-screenshots)
    - [curl Commands สำหรับทดสอบ](#curl-commands-สำหรับทดสอบ)
    - [Test Cases และคะแนน](#test-cases-และคะแนน)
  - [13. วิธีการส่งงาน](#13-วิธีการส่งงาน)
    - [Git Repository](#git-repository)
    - [✅ Checklist ก่อนส่ง](#-checklist-ก่อนส่ง)
    - [❌ ห้าม](#-ห้าม)
    - [README.md ต้องมี](#readmemd-ต้องมี)

---

## 1. ภาพรวมและวัตถุประสงค์

Final Lab ชุดที่ 1 สร้างระบบ Task Board Microservices แบบ **ไม่มี Register** (ใช้ Seed Users เท่านั้น) พร้อม HTTPS, JWT Authentication และ Lightweight Logging ที่เก็บลงฐานข้อมูล

### วัตถุประสงค์การเรียนรู้

| วัตถุประสงค์ | CLO |
|---|---|
| ตั้งค่า HTTPS ด้วย Self-Signed Certificate ใน Nginx ได้ | CLO6 |
| ออกแบบ Auth Service ด้วย Seed Users + JWT ได้ | CLO3, CLO6 |
| ออกแบบ Lightweight Logging เก็บลง DB ด้วย REST API ได้ | CLO14 |
| ต่อ Frontend กับ Backend ผ่าน HTTPS ได้ | CLO5, CLO7 |
| จัดโครงสร้าง Microservices Repository ได้ถูกต้อง | CLO5 |

### ข้อกำหนดหลัก

- **ไม่มี Register** — ใช้เฉพาะ Seed Users ที่กำหนดไว้ล่วงหน้า
- **HTTPS** — Nginx ใช้ Self-Signed Certificate (port 443), redirect HTTP → HTTPS
- **Logging** — เก็บลง PostgreSQL ผ่าน Log Service REST API (ไม่ใช้ Loki/Grafana)
- **Frontend** — 2 หน้า: `index.html` (Task Board) และ `logs.html` (Log Dashboard)

---

## 2. สถาปัตยกรรมที่ต้องสร้าง

```
Browser / Postman
       │
       │ HTTPS :443  (HTTP :80 redirect → HTTPS)
       ▼
┌─────────────────────────────────────────────────────────────┐
│  🛡️ Nginx (API Gateway + TLS Termination + Rate Limiter)    │
│                                                             │
│  /api/auth/*   → auth-service:3001    (ไม่ต้องมี JWT)          │
│  /api/tasks/*  → task-service:3002   [JWT required]         │
│  /api/logs/*   → log-service:3003    [JWT required]         │
│  /             → frontend:80         (Static HTML)          │
└───────┬────────────────┬──────────────────┬─────────────────┘
        │                │                  │
        ▼                ▼                  ▼
┌──────────────┐ ┌───────────────┐ ┌──────────────────┐
│ 🔑 Auth Svc  │ │ 📋 Task Svc   │ │ 📝 Log Service   │
│   :3001      │ │   :3002       │ │   :3003          │
│              │ │               │ │                  │
│ • Login      │ │ • CRUD Tasks  │ │ • POST /api/logs │
│ • /verify    │ │ • JWT Guard   │ │ • GET  /api/logs │
│ • /me        │ │ • Log events  │ │ • เก็บลง DB       │
└──────┬───────┘ └───────┬───────┘ └──────────────────┘
       │                 │
       └────────┬────────┘
                ▼
     ┌─────────────────────┐
     │  🗄️ PostgreSQL      │
     │  (1 shared DB)      │
     │  • users   table    │
     │  • tasks   table    │
     │  • logs    table    │
     └─────────────────────┘
```

### Services ที่ต้องสร้าง

| Service | Port | หน้าที่ |
|---|---|---|
| **nginx** | 80 (→443), 443 | TLS termination, reverse proxy, rate limit |
| **frontend** | 3000 | Nginx serve static HTML/CSS/JS |
| **auth-service** | 3001 | Login (seed users only), ออก JWT |
| **task-service** | 3002 | CRUD Tasks + JWT middleware |
| **log-service** | 3003 | รับ log, เก็บ DB, API ดึง log |
| **postgres** | 5432 | ฐานข้อมูลเดียว |

---

## 3. โครงสร้าง Repository

```
final-lab-set1/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── nginx/
│   ├── nginx.conf              ← HTTPS + reverse proxy config
│   ├── Dockerfile
│   └── certs/                  ← Self-signed cert (generate ด้วย script)
│       ├── cert.pem
│       └── key.pem
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html              ← Task Board UI (Login + CRUD Tasks + JWT inspector)
│   └── logs.html               ← Log Dashboard (ดึงจาก /api/logs)
│
├── auth-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── routes/auth.js
│       ├── middleware/jwtUtils.js
│       └── db/db.js
│
├── task-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── routes/tasks.js
│       └── middleware/authMiddleware.js
│
├── log-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
│
├── db/
│   └── init.sql                ← Schema + Seed Users ทั้งหมด
│
├── scripts/
│   └── gen-certs.sh            ← สร้าง self-signed cert
│
└── screenshots/
    ├── 01_docker_running.png
    ├── 02_https_browser.png
    ├── 03_login_success.png
    ├── 04_login_fail.png
    ├── 05_create_task.png
    ├── 06_get_tasks.png
    ├── 07_update_task.png
    ├── 08_delete_task.png
    ├── 09_no_jwt_401.png
    ├── 10_logs_api.png
    ├── 11_rate_limit.png
    └── 12_frontend_screenshot.png
```

---

## 4. Part 1: HTTPS Nginx (API Gateway)

### 4.1 สร้าง Self-Signed Certificate

**`scripts/gen-certs.sh`:**
```bash
#!/bin/bash
# สร้าง self-signed certificate สำหรับ development
mkdir -p nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/key.pem \
  -out    nginx/certs/cert.pem \
  -subj "/C=TH/ST=Bangkok/L=Bangkok/O=RMUTL/OU=ENGCE301/CN=localhost"
echo "✅ Certificate created in nginx/certs/"
```

```bash
# รันครั้งเดียวก่อน docker compose up
chmod +x scripts/gen-certs.sh
./scripts/gen-certs.sh
```

### 4.2 Nginx Config

**`nginx/nginx.conf`:**
```nginx
# ── Rate limiting zones ──────────────────────────────────────────────
limit_req_zone $binary_remote_addr zone=login_limit:10m   rate=5r/m;
limit_req_zone $binary_remote_addr zone=api_limit:10m     rate=30r/m;

# ── HTTP → HTTPS redirect ────────────────────────────────────────────
server {
    listen 80;
    server_name localhost;
    return 301 https://$host$request_uri;
}

# ── HTTPS server ─────────────────────────────────────────────────────
server {
    listen 443 ssl;
    server_name localhost;

    # TLS certificates (self-signed สำหรับ dev)
    ssl_certificate     /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    # TLS hardening
    ssl_protocols             TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache         shared:SSL:10m;
    ssl_session_timeout       1d;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options           DENY;
    add_header X-Content-Type-Options    nosniff;
    add_header X-XSS-Protection          "1; mode=block";

    # ── Frontend (static files) ────────────────────────────────────
    location / {
        proxy_pass         http://frontend:3000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
    }

    # ── Auth Service (rate-limited ที่ login) ──────────────────────
    location /api/auth/login {
        limit_req zone=login_limit burst=3 nodelay;
        limit_req_status 429;
        proxy_pass         http://auth-service:3001;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    location /api/auth/ {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass         http://auth-service:3001;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # ── Task Service ───────────────────────────────────────────────
    location /api/tasks/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass         http://task-service:3002;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # ── Log Service ────────────────────────────────────────────────
    location /api/logs/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass         http://log-service:3003;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # ── 429 custom response ────────────────────────────────────────
    error_page 429 /429.json;
    location = /429.json {
        return 429 '{"error":"Too Many Requests","retryAfter":60}';
        add_header Content-Type application/json;
    }
}
```

**`nginx/Dockerfile`:**
```dockerfile
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY certs/     /etc/nginx/certs/
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

---

## 5. Part 2: Database Schema + Seed Users

**`db/init.sql`:**
```sql
-- ═══════════════════════════════════════════════
--  USERS TABLE (auth-service ใช้)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  DEFAULT 'member',   -- 'member' | 'admin'
  created_at    TIMESTAMP    DEFAULT NOW(),
  last_login    TIMESTAMP
);

-- ═══════════════════════════════════════════════
--  TASKS TABLE (task-service ใช้)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  DEFAULT 'TODO'    CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
  priority    VARCHAR(10)  DEFAULT 'medium'  CHECK (priority IN ('low','medium','high')),
  created_at  TIMESTAMP    DEFAULT NOW(),
  updated_at  TIMESTAMP    DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
--  LOGS TABLE (log-service ใช้)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL       PRIMARY KEY,
  service    VARCHAR(50)  NOT NULL,   -- 'auth-service' | 'task-service'
  level      VARCHAR(10)  NOT NULL    CHECK (level IN ('INFO','WARN','ERROR')),
  event      VARCHAR(100) NOT NULL,   -- 'LOGIN_SUCCESS' | 'JWT_INVALID' | ...
  user_id    INTEGER,                 -- nullable
  ip_address VARCHAR(45),
  method     VARCHAR(10),             -- HTTP method
  path       VARCHAR(255),            -- request path
  status_code INTEGER,                -- HTTP response code
  message    TEXT,
  meta       JSONB,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- Index สำหรับ query เร็ว
CREATE INDEX IF NOT EXISTS idx_logs_service    ON logs(service);
CREATE INDEX IF NOT EXISTS idx_logs_level      ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);

-- ═══════════════════════════════════════════════
--  SEED USERS
--  ⚠️  Plain-text passwords (สำหรับอาจารย์/นักศึกษารู้)
--  bcrypt hash ด้านล่างคือ bcrypt(password, saltRounds=10)
-- ═══════════════════════════════════════════════
-- alice123      → $2a$10$YourHashHere...
-- bob456        → $2a$10$YourHashHere...
-- adminpass     → $2a$10$YourHashHere...
--
-- วิธีสร้าง hash ใหม่ (node REPL):
--   const b = require('bcryptjs');
--   console.log(b.hashSync('alice123', 10));
-- ═══════════════════════════════════════════════

INSERT INTO users (username, email, password_hash, role) VALUES
  (
    'alice',
    'alice@lab.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    -- plain-text password: alice123
    'member'
  ),
  (
    'bob',
    'bob@lab.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    -- plain-text password: bob456
    'member'
  ),
  (
    'admin',
    'admin@lab.local',
    '$2a$10$TbAyBo.OirXRwMvBVMGgXeuHfzaOGicB5K3jZ1WZUD/pDYdm6GS7C',
    -- plain-text password: adminpass
    'admin'
  )
ON CONFLICT DO NOTHING;

-- Seed tasks (optional — ให้มีข้อมูลตั้งต้น)
INSERT INTO tasks (user_id, title, description, status, priority)
SELECT u.id, 'ออกแบบ UI หน้า Login', 'ใช้ Figma ออกแบบ mockup', 'TODO', 'high'
FROM users u WHERE u.username = 'alice'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, status, priority)
SELECT u.id, 'เขียน API สำหรับ Task CRUD', 'Express.js + PostgreSQL', 'IN_PROGRESS', 'high'
FROM users u WHERE u.username = 'alice'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, status, priority)
SELECT u.id, 'ทดสอบ JWT Authentication', 'ใช้ Postman ทดสอบทุก endpoint', 'TODO', 'medium'
FROM users u WHERE u.username = 'bob'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, status, priority)
SELECT u.id, 'Deploy บน Railway', 'ทำ Final Lab ชุดที่ 2', 'TODO', 'medium'
FROM users u WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;
```

> ### 🔑 Seed Users — ข้อมูลสำหรับทดสอบ
>
> | Username | Email | Password (plain-text) | Role |
> |---|---|---|---|
> | alice | alice@lab.local | `alice123` | member |
> | bob | bob@lab.local | `bob456` | member |
> | admin | admin@lab.local | `adminpass` | admin |
>
> ⚠️ Hash ที่ใส่ใน SQL ด้านบนเป็นตัวอย่าง — **ต้องสร้าง hash ใหม่เอง** ด้วยคำสั่งด้านล่าง:
>
> ```bash
> # สร้าง hash จริง (รันใน node)
> node -e "const b=require('bcryptjs'); ['alice123','bob456','adminpass'].forEach(p=>console.log(p+' →',b.hashSync(p,10)))"
> ```

---

## 6. Part 3: Auth Service

> ใช้ code จาก Week 12 `auth-service` เป็นฐาน **ลบ `/register` route ออก**  
> เพิ่ม `logEvent()` helper สำหรับส่ง log ไปที่ Log Service

**`auth-service/src/routes/auth.js`** — เฉพาะส่วนที่เพิ่ม/เปลี่ยน:

```javascript
const express  = require('express');
const bcrypt   = require('bcryptjs');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();

// ── Helper: ส่ง log ไปที่ Log Service ────────────────────────────────
async function logEvent({ service='auth-service', level, event, userId, ip, method, path, statusCode, message, meta }) {
  try {
    await fetch(`http://log-service:3003/api/logs/internal`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, level, event, user_id: userId, ip_address: ip,
                             method, path, status_code: statusCode, message, meta })
    });
  } catch (_) {
    // ถ้า log service ไม่ตอบ ไม่ต้องหยุดการทำงาน
  }
}

// ─────────────────────────────────────────────
// POST /api/auth/login
// ❌ ไม่มี /register — ใช้ Seed Users เท่านั้น
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณากรอก email และ password' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email.toLowerCase()]
    );
    const user = result.rows[0];

    // Timing attack prevention
    const dummyHash = '$2b$10$invalidhashpaddinginvalidhashpaddinginvalidhashpadding00';
    const passwordHash = user ? user.password_hash : dummyHash;
    const isValid = await bcrypt.compare(password, passwordHash);

    if (!user || !isValid) {
      await logEvent({ level:'WARN', event:'LOGIN_FAILED',
        ip, method:'POST', path:'/api/auth/login', statusCode:401,
        message: `Login failed for: ${email}`, meta: { email } });
      return res.status(401).json({ error: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    // อัปเดต last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = generateToken({ sub: user.id, email: user.email, role: user.role, username: user.username });

    await logEvent({ level:'INFO', event:'LOGIN_SUCCESS', userId: user.id,
      ip, method:'POST', path:'/api/auth/login', statusCode:200,
      message: `User ${user.username} logged in`, meta: { username: user.username, role: user.role } });

    res.json({
      message: 'Login สำเร็จ',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ valid: false, error: 'No token' });
  try {
    const decoded = verifyToken(token);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: err.message });
  }
});

// GET /api/auth/me (ต้องมี JWT)
router.get('/me', async (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = verifyToken(token);
    const result  = await pool.query(
      'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1',
      [decoded.sub]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /api/auth/health
router.get('/health', (_, res) => res.json({ status:'ok', service:'auth-service', time: new Date() }));

module.exports = router;
```

---

## 7. Part 4: Task Service

> ใช้ code จาก Week 12 `task-service` เป็นฐาน  
> เพิ่ม `logEvent()` helper เหมือน Auth Service

**`task-service/src/middleware/authMiddleware.js`:**
```javascript
const { verifyToken } = require('../jwtUtils');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    req.user = verifyToken(token);  // { sub, email, role, username }
    next();
  } catch (err) {
    // ส่ง log JWT error ไปยัง Log Service (fire-and-forget)
    fetch('http://log-service:3003/api/logs/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'task-service', level: 'ERROR', event: 'JWT_INVALID',
        ip_address: req.headers['x-real-ip'] || req.ip,
        message: 'Invalid JWT token: ' + err.message,
        meta: { error: err.message }
      })
    }).catch(() => {});
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};
```

**`task-service/src/routes/tasks.js`** — โครงสร้างหลัก:
```javascript
const express       = require('express');
const { pool }      = require('../db/db');
const requireAuth   = require('../middleware/authMiddleware');

const router = express.Router();

// Helper: ส่ง log
async function logEvent(data) {
  try {
    await fetch('http://log-service:3003/api/logs/internal', {
      method:  'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: 'task-service', ...data })
    });
  } catch (_) {}
}

// ทุก route ต้องผ่าน JWT middleware
router.use(requireAuth);

// GET /api/tasks/ — ดึง tasks (admin เห็นทั้งหมด, member เห็นแค่ของตัวเอง)
router.get('/', async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query(`
        SELECT t.*, u.username FROM tasks t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC`);
    } else {
      result = await pool.query(`
        SELECT t.*, u.username FROM tasks t
        JOIN users u ON t.user_id = u.id
        WHERE t.user_id = $1 ORDER BY t.created_at DESC`, [req.user.sub]);
    }
    res.json({ tasks: result.rows, count: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks/ — สร้าง task ใหม่
router.post('/', async (req, res) => {
  const { title, description, status = 'TODO', priority = 'medium' } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.sub, title, description, status, priority]
    );
    const task = result.rows[0];
    await logEvent({ level:'INFO', event:'TASK_CREATED', userId: req.user.sub,
      method:'POST', path:'/api/tasks', statusCode:201,
      message: `Task created: "${title}"`, meta: { task_id: task.id, title } });
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/:id — แก้ไข task (เฉพาะเจ้าของหรือ admin)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Task not found' });
    if (check.rows[0].user_id !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, description, status, priority } = req.body;
    const result = await pool.query(
      `UPDATE tasks SET title=COALESCE($1,title), description=COALESCE($2,description),
       status=COALESCE($3,status), priority=COALESCE($4,priority), updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [title, description, status, priority, id]
    );
    res.json({ task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tasks/:id — ลบ task (เฉพาะเจ้าของหรือ admin)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Task not found' });
    if (check.rows[0].user_id !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    await logEvent({ level:'INFO', event:'TASK_DELETED', userId: req.user.sub,
      method:'DELETE', path:`/api/tasks/${id}`, statusCode:200,
      message: `Task ${id} deleted` });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks/health
router.get('/health', (_, res) => res.json({ status:'ok', service:'task-service' }));

module.exports = router;
```

---

## 8. Part 5: Log Service

Log Service เป็น service ใหม่ที่ไม่มีใน Week 12 — สร้างใหม่ทั้งหมด

**`log-service/src/index.js`:**
```javascript
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// DB connection (ใช้ shared DB เดียวกัน)
const pool = new Pool({
  host:     process.env.DB_HOST     || 'postgres',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'taskboard',
  user:     process.env.DB_USER     || 'admin',
  password: process.env.DB_PASSWORD || 'secret123',
});

const jwt = require('jsonwebtoken');
function verifyJWT(req, res, next) {
  const token = (req.headers['authorization']||'').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ══════════════════════════════════════════════════════
// POST /api/logs/internal — รับ log จาก services อื่น
// (internal — ไม่ต้อง JWT เพราะ call ภายใน Docker network)
// ══════════════════════════════════════════════════════
app.post('/api/logs/internal', async (req, res) => {
  const { service, level, event, user_id, ip_address,
          method, path, status_code, message, meta } = req.body;

  if (!service || !level || !event) {
    return res.status(400).json({ error: 'service, level, event are required' });
  }

  try {
    await pool.query(
      `INSERT INTO logs (service, level, event, user_id, ip_address,
                         method, path, status_code, message, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [service, level, event, user_id || null, ip_address || null,
       method || null, path || null, status_code || null,
       message || null, meta ? JSON.stringify(meta) : null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('[LOG] Insert error:', err.message);
    res.status(500).json({ error: 'DB error' });
  }
});

// ══════════════════════════════════════════════════════
// GET /api/logs/ — ดึง logs (ต้องมี JWT)
// Query params: ?service=auth-service&level=ERROR&limit=50&offset=0
// ══════════════════════════════════════════════════════
app.get('/api/logs/', verifyJWT, async (req, res) => {
  const { service, level, event, limit = 100, offset = 0 } = req.query;

  // Build dynamic WHERE clause
  const conditions = [];
  const values     = [];
  let   idx = 1;

  if (service) { conditions.push(`service = $${idx++}`); values.push(service); }
  if (level)   { conditions.push(`level = $${idx++}`);   values.push(level);   }
  if (event)   { conditions.push(`event = $${idx++}`);   values.push(event);   }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const countResult = await pool.query(`SELECT COUNT(*) FROM logs ${where}`, values);
    const total       = parseInt(countResult.rows[0].count);

    values.push(parseInt(limit));
    values.push(parseInt(offset));
    const result = await pool.query(
      `SELECT * FROM logs ${where}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx+1}`,
      values
    );

    res.json({
      logs:   result.rows,
      total,
      limit:  parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('[LOG] Query error:', err.message);
    res.status(500).json({ error: 'DB error' });
  }
});

// ══════════════════════════════════════════════════════
// GET /api/logs/stats — สถิติ logs (ต้องมี JWT)
// ══════════════════════════════════════════════════════
app.get('/api/logs/stats', verifyJWT, async (req, res) => {
  try {
    const byLevel = await pool.query(
      `SELECT level, COUNT(*) as count FROM logs GROUP BY level`
    );
    const byService = await pool.query(
      `SELECT service, COUNT(*) as count FROM logs GROUP BY service`
    );
    const byEvent = await pool.query(
      `SELECT event, COUNT(*) as count FROM logs GROUP BY event ORDER BY count DESC LIMIT 10`
    );
    const recent24h = await pool.query(
      `SELECT COUNT(*) as count FROM logs WHERE created_at > NOW() - INTERVAL '24 hours'`
    );
    res.json({
      by_level:   byLevel.rows,
      by_service: byService.rows,
      top_events: byEvent.rows,
      last_24h:   parseInt(recent24h.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/logs/health
app.get('/api/logs/health', (_, res) => res.json({ status:'ok', service:'log-service' }));

// Start
async function start() {
  let retries = 10;
  while (retries > 0) {
    try { await pool.query('SELECT 1'); break; }
    catch (e) {
      console.log(`[log-service] Waiting for DB... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`[log-service] Running on :${PORT}`));
}
start();
```

**`log-service/package.json`:**
```json
{
  "name": "log-service",
  "version": "1.0.0",
  "scripts": { "start": "node src/index.js" },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3"
  }
}
```

**`log-service/Dockerfile`:**
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
  CMD wget -qO- http://localhost:3003/api/logs/health || exit 1
CMD ["node", "src/index.js"]
```

### Log Events ที่ต้องบันทึก (บังคับ)

| Event | Service | Level | เมื่อไหร่ |
|---|---|---|---|
| `LOGIN_SUCCESS` | auth-service | INFO | login ถูกต้อง |
| `LOGIN_FAILED` | auth-service | WARN | username/password ผิด |
| `JWT_INVALID` | task-service | ERROR | token ผิดหรือหมดอายุ |
| `TASK_CREATED` | task-service | INFO | สร้าง task สำเร็จ |
| `TASK_DELETED` | task-service | INFO | ลบ task |

---

## 9. Part 6: Docker Compose รวมทุก Service

**`docker-compose.yml`:**
```yaml
services:

  # ── PostgreSQL ─────────────────────────────────────────────────────
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB:       ${POSTGRES_DB}
      POSTGRES_USER:     ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout:  5s
      retries:  5
    networks: [taskboard-net]

  # ── Auth Service ────────────────────────────────────────────────────
  auth-service:
    build: ./auth-service
    environment:
      DB_HOST:      postgres
      DB_PORT:      5432
      DB_NAME:      ${POSTGRES_DB}
      DB_USER:      ${POSTGRES_USER}
      DB_PASSWORD:  ${POSTGRES_PASSWORD}
      JWT_SECRET:   ${JWT_SECRET}
      JWT_EXPIRES:  ${JWT_EXPIRES}
      PORT:         3001
    depends_on:
      postgres: { condition: service_healthy }
    networks: [taskboard-net]
    restart: unless-stopped

  # ── Task Service ─────────────────────────────────────────────────────
  task-service:
    build: ./task-service
    environment:
      DB_HOST:      postgres
      DB_PORT:      5432
      DB_NAME:      ${POSTGRES_DB}
      DB_USER:      ${POSTGRES_USER}
      DB_PASSWORD:  ${POSTGRES_PASSWORD}
      JWT_SECRET:   ${JWT_SECRET}
      PORT:         3002
    depends_on:
      postgres:     { condition: service_healthy }
      auth-service: { condition: service_started }
    networks: [taskboard-net]
    restart: unless-stopped

  # ── Log Service ──────────────────────────────────────────────────────
  log-service:
    build: ./log-service
    environment:
      DB_HOST:      postgres
      DB_PORT:      5432
      DB_NAME:      ${POSTGRES_DB}
      DB_USER:      ${POSTGRES_USER}
      DB_PASSWORD:  ${POSTGRES_PASSWORD}
      JWT_SECRET:   ${JWT_SECRET}
      PORT:         3003
    depends_on:
      postgres: { condition: service_healthy }
    networks: [taskboard-net]
    restart: unless-stopped

  # ── Frontend (Static) ────────────────────────────────────────────────
  frontend:
    build: ./frontend
    networks: [taskboard-net]

  # ── Nginx (API Gateway + TLS) ────────────────────────────────────────
  nginx:
    build: ./nginx
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - auth-service
      - task-service
      - log-service
      - frontend
    networks: [taskboard-net]
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  taskboard-net:
    driver: bridge
```

**`.env.example`:**
```env
# Database
POSTGRES_DB=taskboard
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123

# JWT (เปลี่ยนก่อน deploy จริงเสมอ)
JWT_SECRET=engce301-super-secret-change-in-production-abc123
JWT_EXPIRES=1h
```

**`.gitignore`:**
```
node_modules/
.env
nginx/certs/*.pem
*.log
```

---

## 10. Part 7: Frontend — Task Board UI

> ปรับจาก Week 12 `index.html` — **ลบ Register tab** และ **Users page** ออก  
> เพิ่มลิงก์ไปหน้า Log Dashboard  
> ใช้ `fetch('https://localhost/api/...')` แทน `http://` เพราะ HTTPS

**`frontend/index.html`** — แสดงเฉพาะส่วนที่เปลี่ยน (สร้างต่อจาก Week 12):

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔐 Task Board — Final Lab</title>
  <style>
    /* ── นำ CSS จาก Week 12 index.html มาทั้งหมด ── */
    /* ── (copy จาก :root { } ถึง @keyframes spin) ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f172a; --surface: #1e293b; --surface2: #273448;
      --border: #334155; --text: #e2e8f0; --muted: #94a3b8;
      --blue: #3b82f6; --green: #22c55e; --yellow: #f59e0b;
      --red: #ef4444; --purple: #a855f7;
    }
    /* ... (copy CSS จาก Week 12) ... */
  </style>
</head>
<body>

<!-- ════ AUTH PAGE ════ -->
<div id="auth-page">
  <div class="auth-box">
    <div class="auth-logo">🔐</div>
    <div class="auth-title">Task Board</div>
    <div class="auth-subtitle">Final Lab — Security Architecture</div>

    <!-- Login Form เท่านั้น (ไม่มี Register tab) -->
    <div id="login-form">
      <div class="form-group">
        <label>Email</label>
        <input id="login-email" type="email" value="alice@lab.local" placeholder="you@lab.local">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input id="login-password" type="password" value="alice123" placeholder="password">
      </div>
      <button class="btn-primary" onclick="doLogin()">เข้าสู่ระบบ</button>
    </div>

    <div id="auth-msg"></div>

    <!-- Seed users hint -->
    <div class="auth-hint" style="margin-top:1rem;padding:.75rem;background:rgba(59,130,246,.1);border-radius:.5rem;font-size:.82rem">
      <strong>🔑 Seed Users:</strong><br>
      alice@lab.local / alice123 (member)<br>
      bob@lab.local / bob456 (member)<br>
      admin@lab.local / adminpass (admin)
    </div>
  </div>
</div>

<!-- ════ MAIN APP ════ -->
<div id="app-page" class="hidden">
  <nav class="sidebar">
    <div class="sidebar-logo">📋 Task Board</div>
    <div class="sidebar-nav">
      <button class="nav-item active" data-page="tasks" onclick="showPage('tasks')">
        <span class="nav-icon">✅</span> Tasks
        <span class="badge-count" id="task-count">0</span>
      </button>
      <button class="nav-item" data-page="profile" onclick="showPage('profile')">
        <span class="nav-icon">👤</span> Profile & JWT
      </button>
      <!-- Log Dashboard (เปิดหน้าใหม่) -->
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

  <div class="main-content">
    <!-- TASKS PAGE — copy จาก Week 12 ทั้งหมด -->
    <div id="page-tasks"> <!-- ... เหมือน Week 12 ... --> </div>

    <!-- PROFILE PAGE — copy จาก Week 12 ทั้งหมด -->
    <div id="page-profile" class="hidden"> <!-- ... เหมือน Week 12 ... --> </div>
  </div>
</div>

<!-- Modals + Toast — copy จาก Week 12 -->

<script>
/* ── STATE ── */
const API  = '';           // ใช้ relative URL (Nginx จัดการ)
let token  = localStorage.getItem('jwt_token');
let currentUser = null;
let allTasks = [];
let currentFilter = 'ALL';

/* ── AUTH ── (ลบ doRegister() ออก) ── */
async function doLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showAuthMsg('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }

  const res  = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (res.ok) {
    token = data.token;
    localStorage.setItem('jwt_token', token);
    initApp(data.user);
  } else {
    showAuthMsg('❌ ' + (data.error || 'Login ล้มเหลว'), 'error');
  }
}

function showAuthMsg(msg, type) {
  const el = document.getElementById('auth-msg');
  el.className = `auth-msg ${type}`;
  el.textContent = msg;
}

function doLogout() {
  localStorage.removeItem('jwt_token');
  token = null; currentUser = null; allTasks = [];
  document.getElementById('app-page').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
}

/* ── APP INIT ── */
async function initApp(user) {
  currentUser = user;
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('app-page').classList.remove('hidden');
  const initials = (user.username || user.email || '?').charAt(0).toUpperCase();
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('sidebar-name').textContent   = user.username || user.email;
  const rb = document.getElementById('sidebar-role-badge');
  rb.textContent = user.role;
  rb.className   = `role-badge role-${user.role}`;
  showPage('tasks');
}

/* ── NAVIGATION ── (ลบ users page ออก) ── */
function showPage(page) {
  ['tasks','profile'].forEach(p => {
    document.getElementById(`page-${p}`).classList.toggle('hidden', p !== page);
    const btn = document.querySelector(`[data-page="${p}"]`);
    if (btn) btn.classList.toggle('active', p === page);
  });
  if (page === 'tasks')   loadTasks();
  if (page === 'profile') loadProfile();
}

/* ── TASKS, PROFILE, JWT INSPECTOR ──
   Copy ทั้งหมดจาก Week 12 app.js
   (loadTasks, renderTasks, openCreateModal,
    submitTask, confirmDelete, loadProfile,
    renderJwtInspector, escHtml)
*/

// ... (copy functions จาก Week 12) ...

/* ── AUTO-LOGIN ── */
if (token) {
  (async () => {
    const res  = await fetch(`${API}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.valid) initApp(data.user);
    else { localStorage.removeItem('jwt_token'); token = null; }
  })();
}
</script>
</body>
</html>
```

**`frontend/Dockerfile`:**
```dockerfile
FROM nginx:1.25-alpine
COPY index.html /usr/share/nginx/html/index.html
COPY logs.html  /usr/share/nginx/html/logs.html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]
```

> หรือใช้ `nginx` default port 80 แล้วปรับ docker-compose ให้ frontend:80

---

## 11. Part 8: Frontend — Log Dashboard

Log Dashboard อ่านข้อมูลจาก **`GET /api/logs/`** บน server — ไม่ใช่ localStorage เหมือน Week 12

**`frontend/logs.html`:**

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📊 Log Dashboard — Final Lab</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f172a; --surface: #1e293b; --border: #334155;
      --text: #e2e8f0; --muted: #94a3b8;
      --blue: #3b82f6; --green: #22c55e; --yellow: #f59e0b;
      --red: #ef4444; --purple: #a855f7;
    }
    body { font-family:'Segoe UI',system-ui,sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
    .header { background:var(--surface); border-bottom:1px solid var(--border); padding:1rem 1.5rem; display:flex; justify-content:space-between; align-items:center; }
    .header h1 { font-size:1.2rem; font-weight:700; }
    .header a  { color:var(--blue); font-size:.85rem; text-decoration:none; }
    .container { max-width:1400px; margin:0 auto; padding:1.5rem; }

    /* Stats */
    .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:.75rem; padding:1rem 1.25rem; }
    .stat-label { color:var(--muted); font-size:.75rem; text-transform:uppercase; letter-spacing:.05em; }
    .stat-value { font-size:1.75rem; font-weight:700; margin-top:.25rem; }

    /* Filter bar */
    .filter-bar { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1rem; }
    .filter-bar input, .filter-bar select {
      background:var(--surface); border:1px solid var(--border); color:var(--text);
      padding:.45rem .75rem; border-radius:.5rem; font-size:.85rem; outline:none;
    }
    .filter-bar input { flex:1; min-width:200px; }
    .btn { padding:.45rem 1rem; border-radius:.5rem; border:none; cursor:pointer; font-size:.85rem; font-weight:600; }
    .btn-primary { background:var(--blue); color:#fff; }
    .btn-secondary { background:var(--surface); color:var(--text); border:1px solid var(--border); }

    /* Log table */
    .log-table { background:var(--surface); border:1px solid var(--border); border-radius:.75rem; overflow:hidden; }
    .log-table-header { display:grid; grid-template-columns:160px 90px 70px 120px 1fr; gap:.5rem; padding:.6rem 1rem; background:#1a2d45; font-size:.72rem; color:var(--muted); font-weight:700; text-transform:uppercase; }
    .log-row { display:grid; grid-template-columns:160px 90px 70px 120px 1fr; gap:.5rem; padding:.65rem 1rem; border-top:1px solid var(--border); font-size:.82rem; align-items:center; }
    .log-row:hover { background:rgba(255,255,255,.03); }

    /* Level badges */
    .badge { padding:.15rem .55rem; border-radius:.3rem; font-size:.7rem; font-weight:700; }
    .badge-INFO  { background:rgba(34,197,94,.15);  color:#4ade80; }
    .badge-WARN  { background:rgba(245,158,11,.15); color:#fbbf24; }
    .badge-ERROR { background:rgba(239,68,68,.15);  color:#f87171; }

    .service-tag { font-size:.72rem; padding:.1rem .45rem; border-radius:.3rem; background:rgba(59,130,246,.15); color:var(--blue); }
    .time-text   { color:var(--muted); font-size:.75rem; font-family:'Courier New',monospace; }
    .msg-text    { color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

    .empty { text-align:center; padding:3rem; color:var(--muted); }
    .refresh-info { font-size:.75rem; color:var(--muted); text-align:right; margin-top:.5rem; }

    /* Login overlay */
    #login-overlay { position:fixed; inset:0; background:var(--bg); display:flex; align-items:center; justify-content:center; z-index:100; }
    .login-box { background:var(--surface); border:1px solid var(--border); border-radius:1rem; padding:2rem; width:340px; }
    .login-box h2 { margin-bottom:1.25rem; font-size:1.1rem; }
    .form-group { margin-bottom:1rem; }
    .form-group label { display:block; font-size:.82rem; color:var(--muted); margin-bottom:.35rem; }
    .form-group input { width:100%; background:#0f172a; border:1px solid var(--border); color:var(--text); padding:.6rem .75rem; border-radius:.5rem; font-size:.9rem; outline:none; }
  </style>
</head>
<body>

<!-- Login overlay (ถ้ายังไม่มี token) -->
<div id="login-overlay">
  <div class="login-box">
    <h2>📊 Log Dashboard Login</h2>
    <div class="form-group">
      <label>Email</label>
      <input id="l-email" type="email" value="admin@lab.local">
    </div>
    <div class="form-group">
      <label>Password</label>
      <input id="l-pass" type="password" value="adminpass">
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="dashLogin()">เข้าสู่ระบบ</button>
    <p id="l-err" style="color:var(--red);font-size:.82rem;margin-top:.5rem"></p>
    <p style="margin-top:.75rem;font-size:.75rem;color:var(--muted)">ต้องใช้บัญชีที่มี JWT token อยู่แล้ว หรือ login ใหม่</p>
  </div>
</div>

<!-- Main Dashboard -->
<div class="header">
  <h1>📊 Log Dashboard — Task Board Final Lab</h1>
  <div style="display:flex;gap:1rem;align-items:center">
    <span id="logged-as" style="font-size:.82rem;color:var(--muted)"></span>
    <button class="btn btn-secondary" onclick="toggleAutoRefresh()" id="refresh-btn">⏸ Auto Refresh ON</button>
    <a href="index.html">← กลับ Task Board</a>
  </div>
</div>

<div class="container">
  <!-- Stats -->
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Total Logs</div>
      <div class="stat-value" id="stat-total">—</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" style="color:var(--green)">INFO</div>
      <div class="stat-value" style="color:var(--green)" id="stat-info">—</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" style="color:var(--yellow)">WARN</div>
      <div class="stat-value" style="color:var(--yellow)" id="stat-warn">—</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" style="color:var(--red)">ERROR</div>
      <div class="stat-value" style="color:var(--red)" id="stat-error">—</div>
    </div>
  </div>

  <!-- Filter bar -->
  <div class="filter-bar">
    <input id="f-search" type="text" placeholder="🔍 ค้นหา event / message...">
    <select id="f-service">
      <option value="">Service: ทั้งหมด</option>
      <option value="auth-service">auth-service</option>
      <option value="task-service">task-service</option>
    </select>
    <select id="f-level">
      <option value="">Level: ทั้งหมด</option>
      <option value="INFO">INFO</option>
      <option value="WARN">WARN</option>
      <option value="ERROR">ERROR</option>
    </select>
    <button class="btn btn-primary" onclick="loadLogs()">🔄 โหลดใหม่</button>
    <button class="btn btn-secondary" onclick="clearFilters()">✕ ล้าง Filter</button>
  </div>

  <!-- Log Table -->
  <div class="log-table">
    <div class="log-table-header">
      <div>เวลา</div>
      <div>Service</div>
      <div>Level</div>
      <div>Event</div>
      <div>Message</div>
    </div>
    <div id="log-rows">
      <div class="empty">⏳ กำลังโหลด...</div>
    </div>
  </div>
  <p class="refresh-info" id="last-refresh"></p>
</div>

<script>
const API = '';
let token        = localStorage.getItem('jwt_token');
let autoRefresh  = true;
let refreshTimer = null;
let allLogs      = [];

// ── Login ─────────────────────────────────────────────
async function dashLogin() {
  const email    = document.getElementById('l-email').value.trim();
  const password = document.getElementById('l-pass').value;
  const res  = await fetch(`${API}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    token = data.token;
    localStorage.setItem('jwt_token', token);
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('logged-as').textContent = `👤 ${data.user.username} (${data.user.role})`;
    loadStats();
    loadLogs();
    startAutoRefresh();
  } else {
    document.getElementById('l-err').textContent = data.error || 'Login ล้มเหลว';
  }
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

// ── Stats ─────────────────────────────────────────────
async function loadStats() {
  const res  = await fetch(`${API}/api/logs/stats`, { headers: authHeaders() });
  if (!res.ok) return;
  const data = await res.json();

  const total = data.by_level.reduce((s, r) => s + parseInt(r.count), 0);
  document.getElementById('stat-total').textContent = total;

  const find = level => {
    const r = data.by_level.find(r => r.level === level);
    return r ? r.count : 0;
  };
  document.getElementById('stat-info').textContent  = find('INFO');
  document.getElementById('stat-warn').textContent  = find('WARN');
  document.getElementById('stat-error').textContent = find('ERROR');
}

// ── Load Logs ─────────────────────────────────────────
async function loadLogs() {
  const service = document.getElementById('f-service').value;
  const level   = document.getElementById('f-level').value;
  const search  = document.getElementById('f-search').value.trim();

  const params = new URLSearchParams({ limit: 200 });
  if (service) params.set('service', service);
  if (level)   params.set('level',   level);

  const res  = await fetch(`${API}/api/logs/?${params}`, { headers: authHeaders() });
  if (res.status === 401) {
    document.getElementById('login-overlay').style.display = 'flex';
    return;
  }
  if (!res.ok) return;
  const data = await res.json();

  allLogs = data.logs || [];

  // Client-side search filter
  let filtered = allLogs;
  if (search) {
    const q = search.toLowerCase();
    filtered = allLogs.filter(l =>
      (l.event   || '').toLowerCase().includes(q) ||
      (l.message || '').toLowerCase().includes(q) ||
      (l.service || '').toLowerCase().includes(q)
    );
  }

  renderLogs(filtered);
  document.getElementById('last-refresh').textContent =
    `อัปเดตล่าสุด: ${new Date().toLocaleTimeString('th-TH')} | แสดง ${filtered.length} / ${data.total} รายการ`;

  loadStats();
}

// ── Render Logs ───────────────────────────────────────
function renderLogs(logs) {
  const container = document.getElementById('log-rows');
  if (!logs.length) {
    container.innerHTML = '<div class="empty">📭 ไม่พบ log ที่ตรงกับเงื่อนไข</div>';
    return;
  }
  container.innerHTML = logs.map(log => {
    const time = new Date(log.created_at).toLocaleString('th-TH', {
      dateStyle: 'short', timeStyle: 'medium'
    });
    return `
      <div class="log-row">
        <div class="time-text">${escHtml(time)}</div>
        <div><span class="service-tag">${escHtml(log.service)}</span></div>
        <div><span class="badge badge-${log.level}">${log.level}</span></div>
        <div style="font-family:'Courier New',monospace;font-size:.75rem;color:var(--purple)">${escHtml(log.event)}</div>
        <div class="msg-text" title="${escHtml(log.message||'')}">
          ${escHtml(log.message || '—')}
          ${log.meta ? `<span style="color:var(--muted);font-size:.72rem"> • ${escHtml(JSON.stringify(log.meta))}</span>` : ''}
        </div>
      </div>`;
  }).join('');
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Auto Refresh ──────────────────────────────────────
function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => { if (autoRefresh) loadLogs(); }, 5000);
}

function toggleAutoRefresh() {
  autoRefresh = !autoRefresh;
  document.getElementById('refresh-btn').textContent =
    autoRefresh ? '⏸ Auto Refresh ON' : '▶ Auto Refresh OFF';
}

function clearFilters() {
  document.getElementById('f-service').value = '';
  document.getElementById('f-level').value   = '';
  document.getElementById('f-search').value  = '';
  loadLogs();
}

// ── Init ──────────────────────────────────────────────
if (token) {
  (async () => {
    const res  = await fetch(`${API}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.valid) {
      document.getElementById('login-overlay').style.display = 'none';
      document.getElementById('logged-as').textContent =
        `👤 ${data.user.username || data.user.email} (${data.user.role})`;
      loadStats();
      loadLogs();
      startAutoRefresh();
    }
  })();
}
</script>
</body>
</html>
```

---

## 12. Part 9: Test Cases และ Screenshots

ทดสอบด้วย **Postman หรือ curl** บน **HTTPS (`https://localhost`)** — screenshot ทุกข้อ

### curl Commands สำหรับทดสอบ

```bash
# ── ตัวแปร ───────────────────────────────────
BASE="https://localhost"    # ใช้ --insecure เพราะ self-signed cert

# ── T3: Login ────────────────────────────────
TOKEN=$(curl -sk -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@lab.local","password":"alice123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
echo $TOKEN

# ── T4: Login (ผิด password) ──────────────────
curl -sk -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@lab.local","password":"wrong"}'

# ── T5: Create Task ───────────────────────────
curl -sk -X POST $BASE/api/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"from curl","priority":"high"}'

# ── T6: Get Tasks ─────────────────────────────
curl -sk $BASE/api/tasks/ -H "Authorization: Bearer $TOKEN"

# ── T9: No JWT → 401 ─────────────────────────
curl -sk $BASE/api/tasks/

# ── T10: View Logs ────────────────────────────
curl -sk $BASE/api/logs/ -H "Authorization: Bearer $TOKEN"

# ── T11: Rate Limit ───────────────────────────
for i in {1..8}; do
  echo -n "Attempt $i: "
  curl -sk -o /dev/null -w "%{http_code}\n" -X POST $BASE/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@lab.local","password":"wrong"}'
  sleep 0.1
done
```

### Test Cases และคะแนน

| Test | รายการ | คะแนน |
|---|---|---|
| T1 | `docker compose up --build` สำเร็จ ทุก container healthy | 10 |
| T2 | Browser เข้า `https://localhost` ได้ (แม้มี cert warning) และ HTTP → HTTPS redirect | 10 |
| T3 | POST `/api/auth/login` (alice/bob/admin) → 200 + JWT token | 10 |
| T4 | POST `/api/auth/login` (ผิด password) → 401 | 5 |
| T5 | POST `/api/tasks/` (มี JWT) → 201 Created | 10 |
| T6 | GET `/api/tasks/` (มี JWT) → 200 + task list | 10 |
| T7 | PUT `/api/tasks/:id` (มี JWT) → 200 Updated | 5 |
| T8 | DELETE `/api/tasks/:id` (มี JWT) → 200 Deleted | 5 |
| T9 | GET `/api/tasks/` (ไม่มี JWT) → 401 Unauthorized | 10 |
| T10 | GET `/api/logs/` (มี JWT) → เห็น log entries ใน DB | 10 |
| T11 | ส่ง login ผิดเร็ว ๆ > 5 ครั้ง/นาที → 429 Too Many Requests | 5 |
| **รวม** | | **90** |
| Bonus | README.md มี Architecture diagram + วิธีรัน + อธิบาย HTTPS flow | 10 |

---

## 13. วิธีการส่งงาน

### Git Repository

1. ตั้งชื่อ: `engce301-final-lab1-[รหัส1]-[รหัส2]`
2. ทั้ง 2 คน commit อย่างน้อย **คนละ 3 commits**
3. ส่ง URL ผ่านระบบมหาวิทยาลัย

### ✅ Checklist ก่อนส่ง

- [ ] `./scripts/gen-certs.sh` รันแล้ว มี `nginx/certs/cert.pem` และ `key.pem`
- [ ] `docker compose up --build` รันสำเร็จ ทุก container status = healthy
- [ ] HTTPS ทำงาน: `https://localhost` ขึ้น Task Board
- [ ] HTTP redirect: `http://localhost` → `https://localhost`
- [ ] Seed users login ได้ทั้ง 3 คน
- [ ] Task CRUD ทำงานได้
- [ ] `/api/logs/` ตอบด้วย log จาก DB (ไม่ใช่ localStorage)
- [ ] Screenshots ครบ 12 รูป ตามชื่อที่กำหนด
- [ ] ไม่มี `.env` จริงใน repository
- [ ] ไม่มี `nginx/certs/*.pem` ใน repository (อยู่ใน `.gitignore`)

### ❌ ห้าม

- ห้าม commit `.env` จริง, `node_modules/`, `nginx/certs/*.pem`
- ห้ามใช้ Loki/Grafana/Promtail
- ห้ามมี `/api/auth/register` (ใช้ seed users เท่านั้น)

### README.md ต้องมี

- ชื่อ + รหัสนักศึกษาทั้ง 2 คน
- Architecture diagram (ASCII หรือ draw.io)
- วิธีรัน: `./scripts/gen-certs.sh` → `cp .env.example .env` → `docker compose up --build`
- Seed users table
- อธิบายสั้น ๆ ว่า HTTPS ทำงานอย่างไรในระบบนี้

---

> 🚀 **โชคดีกับการทำ Final Lab ครับ!**
>
> *ENGCE301 Software Design and Development | มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
