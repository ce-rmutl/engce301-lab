# ENGCE301 Software Design and Development
# Final Lab — ชุดที่ 2: Microservices Scale-Up + Cloud Deploy (Railway)

> **⏱️ งานกลุ่ม (2 คน/กลุ่ม) | ทำตอนสอบจริง 4 ชั่วโมง | คะแนนเต็ม 100 คะแนน**
>
> 💡 นักศึกษาสามารถใช้ code จาก **Final Lab Set 1, Week 6, Week 7 และ Week 12** ได้
>
> 📌 **ส่งผ่าน Git Repository เท่านั้น**

---

## สารบัญ

1. [ภาพรวมและวัตถุประสงค์](#1-ภาพรวมและวัตถุประสงค์)
2. [สถาปัตยกรรมใหม่ (Set 2)](#2-สถาปัตยกรรมใหม่-set-2)
3. [Phase 1: ปรับ Architecture ให้ทำงาน Local](#3-phase-1-ปรับ-architecture-ให้ทำงาน-local)
4. [Phase 2: Deploy Auth Service บน Railway](#4-phase-2-deploy-auth-service-บน-railway)
5. [Phase 3: Deploy Task Service บน Railway](#5-phase-3-deploy-task-service-บน-railway)
6. [Phase 4: Deploy User Service บน Railway](#6-phase-4-deploy-user-service-บน-railway)
7. [Phase 5: Gateway Strategy](#7-phase-5-gateway-strategy)
8. [Phase 6: Test Cases และ Screenshots](#8-phase-6-test-cases-และ-screenshots)
9. [วิธีการส่งงาน](#9-วิธีการส่งงาน)

---

## 1. ภาพรวมและวัตถุประสงค์

Final Lab ชุดที่ 2 เป็นการต่อยอดจาก Set 1 โดยขยาย Architecture จาก **2 Services → 3 Services** และแยก Database ให้แต่ละ Service มี DB ของตัวเอง (**Database-per-Service Pattern**) จากนั้น Deploy ทุก Service ขึ้น **Railway Cloud**

### การแบ่งเวลาแนะนำ (4 ชั่วโมง)

| Phase | งาน | เวลา |
|---|---|---|
| Phase 1 | ปรับ Architecture + เพิ่ม User Service + ทดสอบ Local | 60 นาที |
| Phase 2 | Deploy Auth Service + auth-db บน Railway | 40 นาที |
| Phase 3 | Deploy Task Service + task-db บน Railway | 30 นาที |
| Phase 4 | Deploy User Service + user-db บน Railway | 30 นาที |
| Phase 5 | ตั้งค่า Gateway Strategy + ทดสอบ End-to-End | 30 นาที |
| Phase 6 | Screenshot + README + Push to Repo | 30 นาที |

### วัตถุประสงค์การเรียนรู้

| วัตถุประสงค์ | CLO |
|---|---|
| แยก Database ตาม Database-per-Service Pattern ได้ | CLO3, CLO6 |
| เพิ่ม User Service เข้าสู่ Architecture ที่มีอยู่ได้ | CLO6 |
| Deploy 3 services + 3 databases บน Railway ได้ | CLO7, CLO14 |
| กำหนด Gateway Strategy สำหรับ Cloud Services ได้ | CLO6, CLO7 |
| ทดสอบ end-to-end บน Cloud environment ได้ | CLO14 |

---

## 2. สถาปัตยกรรมใหม่ (Set 2)

เปลี่ยนจาก **1 shared DB → 3 separate DBs** และเพิ่ม User Service

```
Internet
    │
    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│   🌐 Railway Cloud Platform                                              │
│                                                                          │
│  ┌───────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │  🔑 Auth Service  │  │  📋 Task Service      │  │  👤 User Service  │  │
│  │  auth.up.rlwy.net │  │  task.up.rlwy.net    │  │  user.up.rlwy.net │  │
│  │  PORT: 3001       │  │  PORT: 3002          │  │  PORT: 3003       │  │
│  └────────┬──────────┘  └──────────┬───────────┘  └────────┬──────────┘  │
│           │                        │                       │             │
│           ▼                        ▼                       ▼             │
│  ┌────────────────┐   ┌─────────────────────┐  ┌──────────────────────┐  │
│  │  🗄️ auth-db    │   │  🗄️ task-db          │  │  🗄️ user-db          │  │
│  │  PostgreSQL    │   │  PostgreSQL         │  │  PostgreSQL          │  │
│  │  users table   │   │  tasks table        │  │  user_profiles table │  │
│  │  logs table    │   │  logs table         │  │  logs table          │  │
│  └────────────────┘   └─────────────────────┘  └──────────────────────┘  │
│                                                                          │
│  JWT_SECRET ใช้ร่วมกันทุก service (ผ่าน Railway Environment Variables)        │
└──────────────────────────────────────────────────────────────────────────┘
```

### ความแตกต่างจาก Set 1

| หัวข้อ | Set 1 (Local Docker) | Set 2 (Railway Cloud) |
|---|---|---|
| จำนวน DB | 1 shared DB | 3 DB แยกกัน |
| จำนวน Services | 2 (Auth + Task) | 3 (Auth + Task + User) |
| Logging | Log Service แยก | Log เก็บใน DB ของแต่ละ service |
| Environment | Local Docker | Railway Cloud (PaaS) |
| Gateway | Nginx (local) | เลือก Strategy เอง |

---

## 3. Phase 1: ปรับ Architecture ให้ทำงาน Local

ก่อน Deploy ขึ้น Cloud ต้องทดสอบ local ให้ work ก่อน

### User Service — Endpoints ที่ต้องมี

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET    | `/api/users/profile`  | ดู profile ตัวเอง | ✅ JWT |
| PUT    | `/api/users/profile`  | แก้ไข profile | ✅ JWT |
| GET    | `/api/users/all`      | ดูรายชื่อ users ทั้งหมด | ✅ JWT |
| DELETE | `/api/users/:id`      | ลบ user | ✅ JWT |

### DB Schema สำหรับ Set 2

**auth-db** — เก็บข้อมูล authentication เท่านั้น

```sql
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  level      VARCHAR(10)  NOT NULL,
  event      VARCHAR(100) NOT NULL,
  user_id    INTEGER,
  message    TEXT,
  meta       JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**task-db** — เก็บ tasks เท่านั้น

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL,   -- conceptual FK (ไม่มี FK จริง ข้าม DB)
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  -- โครงสร้างเหมือน auth-db
  id SERIAL PRIMARY KEY, level VARCHAR(10), event VARCHAR(100),
  user_id INTEGER, message TEXT, meta JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**user-db** — เก็บ user profiles

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER UNIQUE NOT NULL,  -- reference ไป auth-db (ไม่มี FK จริง)
  display_name VARCHAR(100),
  bio          TEXT,
  avatar_url   VARCHAR(255),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  -- โครงสร้างเหมือน auth-db
  id SERIAL PRIMARY KEY, level VARCHAR(10), event VARCHAR(100),
  user_id INTEGER, message TEXT, meta JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

> 💡 **หมายเหตุ:** เนื่องจากแต่ละ service มี DB ของตัวเอง จึงไม่มี Foreign Key ข้าม Database แต่ใช้ `user_id` เป็น conceptual reference แทน

### docker-compose.yml สำหรับ Local Test

ก่อน deploy ขึ้น Cloud ให้ทดสอบด้วย docker-compose ที่มี **3 postgres services** แยกกัน:

```yaml
# ตัวอย่าง services ใน docker-compose.yml (local test)
services:
  auth-db:
    image: postgres:15
    environment:
      POSTGRES_DB: authdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - ./auth-service/init.sql:/docker-entrypoint-initdb.d/init.sql

  task-db:
    image: postgres:15
    environment:
      POSTGRES_DB: taskdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - ./task-service/init.sql:/docker-entrypoint-initdb.d/init.sql

  user-db:
    image: postgres:15
    environment:
      POSTGRES_DB: userdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - ./user-service/init.sql:/docker-entrypoint-initdb.d/init.sql
  # ... auth-service, task-service, user-service
```

---

## 4. Phase 2: Deploy Auth Service บน Railway

1. ไปที่ [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. เลือก repository → กำหนด **Root Directory** = `auth-service`
3. เพิ่ม **PostgreSQL Plugin** → ตั้งชื่อ `auth-db`
4. ตั้งค่า **Environment Variables:**

```env
DATABASE_URL=${{auth-db.DATABASE_URL}}    ← Railway auto-fill
JWT_SECRET=your-shared-jwt-secret-here
JWT_EXPIRES_IN=1h
PORT=3001
NODE_ENV=production
```

5. รอ Deploy เสร็จ → ทดสอบ URL ที่ได้
6. **บันทึก Auth Service URL** → จะใช้ใน Task/User Service ข้างหน้า

---

## 5. Phase 3: Deploy Task Service บน Railway

1. **New Service** ใน Project เดียวกัน → Deploy from GitHub
2. Root Directory = `task-service`
3. เพิ่ม **PostgreSQL Plugin** → ตั้งชื่อ `task-db`
4. ตั้งค่า **Environment Variables:**

```env
DATABASE_URL=${{task-db.DATABASE_URL}}
JWT_SECRET=your-shared-jwt-secret-here    ← ต้องเหมือน Auth Service!
PORT=3002
NODE_ENV=production
AUTH_SERVICE_URL=https://[auth-service-url-จาก-phase-2]
```

5. รอ Deploy เสร็จ → ทดสอบ Create/Get Tasks ด้วย JWT จาก Auth Service

---

## 6. Phase 4: Deploy User Service บน Railway

1. **New Service** → Root Directory = `user-service`
2. เพิ่ม **PostgreSQL Plugin** → ตั้งชื่อ `user-db`
3. ตั้งค่า **Environment Variables:**

```env
DATABASE_URL=${{user-db.DATABASE_URL}}
JWT_SECRET=your-shared-jwt-secret-here    ← ต้องเหมือนทุก service!
PORT=3003
NODE_ENV=production
AUTH_SERVICE_URL=https://[auth-service-url-จาก-phase-2]
```

4. รอ Deploy เสร็จ → ทดสอบ GET/PUT profile

---

## 7. Phase 5: Gateway Strategy

นักศึกษาต้องเลือก **อย่างน้อย 1 วิธี** และอธิบายใน README ว่าเลือกอะไรและทำไม

| Option | วิธี | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **A** | Frontend เรียก URL ของแต่ละ service โดยตรง | ง่ายที่สุด ไม่ต้อง config เพิ่ม | Frontend ต้องรู้ URL ของทุก service |
| **B** | Deploy Nginx เป็น 1 service บน Railway | Single entry point เหมือน production | ต้องตั้งค่า Nginx + deploy เพิ่ม |
| **C** | ใช้ logic ใน Frontend ตัดสินใจ route ไปแต่ละ service | ยืดหยุ่น | Business logic อยู่ใน Frontend |

### ข้อกำหนด Gateway (ทุก Option)

- JWT_SECRET ต้องเหมือนกันทุก service
- Task Service ต้องปฏิเสธ request ที่ไม่มี JWT → **401**
- User Service ต้องปฏิเสธ request ที่ไม่มี JWT → **401**
- Auth Service ทำงานได้โดยไม่ต้องมี JWT (สำหรับ login/register)

---

## 8. Phase 6: Test Cases และ Screenshots

> ⚠️ ทดสอบบน **Railway (Cloud) เท่านั้น** — ไม่รับ screenshot จาก local

### Test Cases

| Test | รายการ (ทดสอบบน Cloud URL) | คะแนน |
|---|---|---|
| T1 | Railway Dashboard เห็น 3 services + 3 databases ทุกอัน status = Active | 10 |
| T2 | POST `/register` บน Railway Auth URL → 201 + user object | 10 |
| T3 | POST `/login` บน Railway Auth URL → JWT token | 10 |
| T4 | POST `/tasks` บน Railway Task URL (มี JWT) → 201 Created | 10 |
| T5 | GET `/tasks` บน Railway Task URL (มี JWT) → tasks list | 10 |
| T6 | GET `/users/profile` บน Railway User URL (มี JWT) → profile | 10 |
| T7 | PUT `/users/profile` บน Railway → อัปเดตสำเร็จ | 5 |
| T8 | GET `/tasks` บน Cloud โดยไม่มี JWT → 401 | 10 |
| T9 | Screenshot Railway env page แสดง JWT_SECRET เหมือนกันทุก service | 5 |
| T10 | README อธิบาย Gateway Strategy + Architecture Cloud | 10 |
| **รวม** | | **90** |
| Bonus | Deploy Nginx Gateway บน Railway (Option B) ทำงานได้จริง | 10 |

### โครงสร้าง screenshots/

```
screenshots/
├── 01_railway_dashboard.png         ← เห็น 3 services + 3 db ทุกอัน Active
├── 02_auth_register_cloud.png       ← POST /register บน Cloud
├── 03_auth_login_cloud.png          ← POST /login ได้ JWT token
├── 04_task_create_cloud.png         ← POST /tasks มี JWT
├── 05_task_list_cloud.png           ← GET /tasks มี JWT
├── 06_user_profile_cloud.png        ← GET /users/profile
├── 07_user_profile_update_cloud.png ← PUT /users/profile
├── 08_task_no_jwt_401.png           ← GET /tasks ไม่มี JWT → 401
├── 09_railway_env_variables.png     ← เห็น JWT_SECRET (ปิดค่าได้)
└── 10_readme_architecture.png       ← Screenshot ของ README diagram
```

---

## 9. วิธีการส่งงาน

### Git Repository

1. สร้าง Repository: `engce301-final-lab2-[รหัส1]-[รหัส2]`
2. โครงสร้างเหมือน Set 1 แต่เพิ่ม `user-service/` และแยก `init.sql` ต่อ service
3. อัปเดต `README.md` ให้มี **URL จริงของทุก service** บน Railway
4. ส่ง URL Repository ผ่านระบบมหาวิทยาลัย

### README.md สำหรับ Set 2 ต้องมี

- [ ] ชื่อนักศึกษาทั้ง 2 คน + รหัสนักศึกษา
- [ ] **URL จริงของทุก Service บน Railway**
- [ ] Architecture diagram (Cloud version)
- [ ] Gateway Strategy ที่เลือก + เหตุผล
- [ ] วิธีทดสอบ (curl commands หรือ Postman collection)
- [ ] ปัญหาที่เจอระหว่างทำ + วิธีแก้ (optional แต่ได้ bonus)

### ตัวอย่าง curl สำหรับทดสอบบน Cloud

```bash
# แทน [AUTH_URL], [TASK_URL], [USER_URL] ด้วย URL จริงจาก Railway

# Register
curl -X POST https://[AUTH_URL]/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"myuser","password":"mypass","email":"my@email.com"}'

# Login → เก็บ token
TOKEN=$(curl -s -X POST https://[AUTH_URL]/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"myuser","password":"mypass"}' | jq -r '.token')

# Create Task
curl -X POST https://[TASK_URL]/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first cloud task"}'

# Get Profile
curl https://[USER_URL]/api/users/profile \
  -H "Authorization: Bearer $TOKEN"

# Test 401
curl https://[TASK_URL]/api/tasks   # ไม่ใส่ token → ต้องได้ 401
```

---

> 🚀 **โชคดีกับการสอบครับ! ทำทีละ Phase อย่าข้าม**
>
> *ENGCE301 Software Design and Development | มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*

---
---

# คู่มือการตรวจให้คะแนน — Final Lab Set 2
## สำหรับอาจารย์ผู้ตรวจ (ไม่แจกนักศึกษา)

---

## ขั้นตอนการตรวจ

### Step 1: ตรวจ Railway Dashboard (5 นาที)

- [ ] เปิด Railway Dashboard (หรือดูจาก screenshot `01_railway_dashboard.png`)
- [ ] ต้องเห็น 3 services: `auth-service`, `task-service`, `user-service`
- [ ] ต้องเห็น 3 databases: `auth-db`, `task-db`, `user-db`
- [ ] ทุก service status = **Active** (สีเขียว)

### Step 2: ทดสอบ Live บน Cloud (15 นาที)

ใช้ curl commands ด้านล่าง แทน `[AUTH_URL]`, `[TASK_URL]`, `[USER_URL]` ด้วย URL จาก README ของนักศึกษา:

```bash
# 1. Register (T2)
curl -s -X POST https://[AUTH_URL]/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"grader_test","password":"pass1234","email":"grader@test.com"}'

# 2. Login → เก็บ token (T3)
TOKEN=$(curl -s -X POST https://[AUTH_URL]/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"grader_test","password":"pass1234"}' | jq -r '.token')
echo "TOKEN: $TOKEN"

# 3. Create Task (T4)
curl -s -X POST https://[TASK_URL]/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Grader Test Task","description":"Testing"}'

# 4. Get Tasks (T5)
curl -s https://[TASK_URL]/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# 5. Get User Profile (T6)
curl -s https://[USER_URL]/api/users/profile \
  -H "Authorization: Bearer $TOKEN"

# 6. Update Profile (T7)
curl -s -X PUT https://[USER_URL]/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"display_name":"Grader Updated"}'

# 7. Test 401 (T8)
curl -s -o /dev/null -w "%{http_code}\n" https://[TASK_URL]/api/tasks
# ต้องได้ 401
```

### Step 3: ตรวจ DB แยกกัน (5 นาที)

- [ ] Railway → `auth-service` → Variables → `DATABASE_URL` ชี้ไป `auth-db`
- [ ] Railway → `task-service` → Variables → `DATABASE_URL` ชี้ไป `task-db`
- [ ] Railway → `user-service` → Variables → `DATABASE_URL` ชี้ไป `user-db`
- [ ] `JWT_SECRET` ต้องเหมือนกันทุก service (ให้นักศึกษาแสดง env page)

### Step 4: ตรวจ Gateway Strategy (3 นาที)

- [ ] README อธิบาย Option ที่เลือก (A/B/C) และเหตุผล
- [ ] ถ้าทำ Bonus (Option B: Nginx Gateway) → ทดสอบว่า route ทำงานได้จริงผ่าน URL เดียว

### Step 5: ตรวจ README (2 นาที)

- [ ] มี URL จริงของทุก service
- [ ] มี Architecture diagram
- [ ] git log → ทั้ง 2 คน commit

---

## เกณฑ์การให้คะแนน Set 2

| หัวข้อ | รายการประเมิน | คะแนนเต็ม |
|---|---|---|
| G1 | Railway Dashboard: 3 services + 3 DBs ทุกอัน Active | 10 |
| G2 | Auth Service บน Cloud: Register + Login ทำงานได้ | 15 |
| G3 | Task Service บน Cloud: CRUD ทำงานได้ (มี JWT) | 20 |
| G4 | User Service บน Cloud: Profile read/update ทำงานได้ | 15 |
| G5 | JWT Protection: ทุก service ปฏิเสธ request ไม่มี JWT → 401 | 10 |
| G6 | DB แยกกันจริง (ENV proof) + JWT_SECRET เหมือนกัน | 10 |
| G7 | README: URL จริง + Architecture Cloud + Gateway Strategy | 10 |
| **รวม** | | **90** |
| Bonus | Nginx Gateway บน Railway ทำงานได้จริง (route 3 services) | 10 |

### เกณฑ์หักคะแนน Set 2

| กรณี | หักคะแนน |
|---|---|
| Service บน Railway ล่ม/ไม่ตอบสนองตอนตรวจ | หักตาม functionality ที่หายไป |
| DB ยังเป็น shared (ไม่แยก 3 DB) | -20 |
| JWT_SECRET ต่างกันระหว่าง services | -15 |
| README ไม่มี URL จริงของ services | -10 |
| ไม่มี User Service (มีแค่ 2) | -15 |
| Screenshot มาจาก local ไม่ใช่ Cloud | -5 ต่อรูป |

### แนวทางพิจารณา Edge Cases

- เวลาสอบ 4 ชั่วโมงอาจทำไม่ครบทุกส่วน → ประเมินตามสิ่งที่ทำสำเร็จ
- ถ้า deploy ได้ 2/3 services → G1 = 5/10, ให้คะแนนตาม services ที่ work
- Railway อาจ deploy ช้า (5–10 นาที) → ให้ความเห็นใจถ้า CI ค้างระหว่างสอบ
- Bonus ให้เฉพาะ Nginx Gateway บน Railway ที่ route ได้จริง (ไม่ใช่แค่ deploy nginx แต่ไม่ได้ตั้งค่า)
- ตรวจ `git log` ว่าทั้ง 2 คนร่วมกันทำจริง
