# ENGSE207 สถาปัตยกรรมซอฟต์แวร์ (Software Architecture)
## เอกสารประกอบการสอน — ทฤษฎีก่อนปฏิบัติ Term Project Week 6

---

## หน่วยเรียน: N-Tier Architecture, Caching Strategy และ Load Balancing

### ข้อมูลทั่วไป
- **จำนวนชั่วโมง:** บรรยาย 2 ชม. (ก่อนเข้า Lab 3 ชม.)
- **ระดับชั้น:** ปีที่ 2 วิศวกรรมซอฟต์แวร์
- **CLO ที่เกี่ยวข้อง:** CLO2, CLO3, CLO4, CLO6, CLO7, CLO13, CLO14
- **ผู้สอน:** นายธนิต เกตุแก้ว
- **เอกสาร Lab ที่สอดคล้อง:** `week6_lab_ntier_redis_loadbalance.md`

---

## ชื่อบทเรียน

### 1.1 N-Tier Architecture: จาก Layer (Logical) สู่ Tier (Physical)
### 1.2 Caching Strategy: ทำไมต้อง Cache และ Pattern ที่นิยมใช้
### 1.3 Load Balancing: การกระจายโหลดและ Horizontal Scaling
### 1.4 Quality Attributes ที่ได้รับผลกระทบ และ Trade-offs Analysis

---

## วัตถุประสงค์การสอน

### 1.1 N-Tier Architecture: จาก Layer สู่ Tier

**1.1.1** นักศึกษาสามารถอธิบายความแตกต่างระหว่าง Layer (Logical Separation) กับ Tier (Physical Separation) ได้อย่างชัดเจน

**1.1.2** นักศึกษาสามารถระบุ Tier ที่จำเป็นสำหรับระบบขนาดกลาง และอธิบายเหตุผลในการแยก Tier ได้

**1.1.3** นักศึกษาสามารถอธิบายว่า Docker Container ถูกใช้เป็นเครื่องมือในการทำ Physical Separation (Tier) อย่างไร

### 1.2 Caching Strategy

**1.2.1** นักศึกษาสามารถอธิบายปัญหาด้าน Performance ที่เกิดขึ้นเมื่อไม่มี Cache และวิเคราะห์สถานการณ์ที่ Cache มีประโยชน์ได้

**1.2.2** นักศึกษาสามารถอธิบาย Caching Patterns (Cache-Aside, Write-Through, Write-Behind) และเลือกใช้ให้เหมาะสมกับสถานการณ์ได้

**1.2.3** นักศึกษาสามารถอธิบายปัญหาที่เกิดจาก Cache (Stale Data, Cache Invalidation, Thundering Herd) ได้

### 1.3 Load Balancing

**1.3.1** นักศึกษาสามารถอธิบายหลักการ Load Balancing และเหตุผลที่ต้องใช้ได้

**1.3.2** นักศึกษาสามารถเปรียบเทียบ Load Balancing Algorithms (Round-Robin, Least Connections, IP Hash) และเลือกใช้ให้เหมาะสมได้

**1.3.3** นักศึกษาสามารถอธิบายความแตกต่างระหว่าง Vertical Scaling (Scale Up) กับ Horizontal Scaling (Scale Out) ได้

### 1.4 Quality Attributes & Trade-offs

**1.4.1** นักศึกษาสามารถวิเคราะห์ผลกระทบของ Caching และ Load Balancing ต่อ Quality Attributes (Performance, Scalability, Availability) ได้

**1.4.2** นักศึกษาสามารถระบุ Trade-offs ที่เกิดจากการเพิ่ม Cache Layer และ Load Balancer เข้าสู่ระบบได้

---

## สรุป CLO ที่เกี่ยวข้อง

### 🎯 CLO2 (Knowledge - K)
**อธิบาย Architectural Styles และ Patterns พื้นฐาน** รวมถึง Trade-offs ของ N-Tier Architecture

> **ความเชื่อมโยง:** สัปดาห์นี้เป็นการต่อยอดจาก Client-Server (Week 5) สู่ N-Tier ที่มี Caching Tier และ Load Balancing Tier เพิ่มเข้ามา ช่วยให้เห็นว่า Tier เพิ่มเติมแต่ละตัวแก้ปัญหาอะไร

### 🎯 CLO3 (Knowledge - K)
**อธิบายคุณลักษณะคุณภาพของซอฟต์แวร์ (Quality Attributes)** — Performance, Scalability, Availability

> **ความเชื่อมโยง:** Redis Cache ส่งผลโดยตรงต่อ Performance (Response Time ลดลง), Load Balancing ส่งผลต่อ Scalability และ Availability

### 🎯 CLO4 (Cognitive Skill - C)
**ประยุกต์ใช้เครื่องมือ (Docker, Redis, Nginx)** ในการสร้าง N-Tier Architecture

> **ความเชื่อมโยง:** ใน Lab จะลงมือใช้ Docker Compose สร้าง 4-Tier System จริง

### 🎯 CLO6 (Cognitive Skill - C)
**ประเมินและเปรียบเทียบทางเลือกสถาปัตยกรรม** — Single Instance vs Multi-Instance, With Cache vs Without Cache

### 🎯 CLO7 (Practical Skill - P)
**ออกแบบสถาปัตยกรรมระดับ High-level** — กำหนด Tiers, เลือก Caching Pattern, เลือก LB Algorithm

### 🎯 CLO13 (Attitude - A)
**ตระหนักถึงความสำคัญของ Non-Functional Requirements** — เข้าใจว่า Performance, Scalability ไม่ได้เกิดขึ้นเอง ต้องออกแบบมา

### 🎯 CLO14 (Attitude - A)
**เห็นความสำคัญของเครื่องมือสมัยใหม่** — Docker, Redis, Nginx ในฐานะ Infrastructure ที่สนับสนุน Architecture

---

## ส่วนที่ 1: ทบทวนสัปดาห์ที่แล้ว (5 นาที)

### 📋 จากที่เราเรียนมา...

| สัปดาห์ | Architecture Style | สิ่งที่ได้เรียน |
|:--:|:--|:--|
| 3 | Monolith | ทุกอย่างอยู่ใน 1 ไฟล์/1 Process |
| 4 | Layered | แบ่ง Code เป็น Layer (Controller → Service → Repository) |
| 5 | Client-Server | แยก Frontend กับ Backend เป็น 2 โปรเจกต์ |
| **6** | **N-Tier + Cache + LB** | **แยก Physical Deployment + เพิ่ม Caching + กระจายโหลด** |

### 🔗 เชื่อมโยงกับสัปดาห์นี้

สัปดาห์ที่แล้ว (Week 5) เราแยก Client กับ Server ออกจากกัน แต่ Server ยังคงเป็น **"จุดเดียว" (Single Point)** ที่ต้องทำทุกอย่าง:

```
สัปดาห์ที่ 5: ปัญหาที่เหลืออยู่
───────────────────────────────────────────
❌ App 1 ตัว → ถ้าล่ม ทั้งระบบล่ม
❌ ทุก Request ต้องถาม DB → ช้าเมื่อมีคนเยอะ
❌ Scale ได้แค่ Vertical (เพิ่ม RAM/CPU) → มีขีดจำกัด
❌ DB ถูก Query ซ้ำๆ ข้อมูลเดิมๆ → เปลืองทรัพยากร
```

สัปดาห์นี้เราจะแก้ปัญหาเหล่านี้ทั้งหมดด้วย 3 เทคนิค:

1. **N-Tier Architecture** → แยก Physical Deployment ให้ Scale แต่ละส่วนอิสระ
2. **Redis Caching** → ลดภาระ Database ด้วยการเก็บผลลัพธ์ใน Memory
3. **Nginx Load Balancing** → กระจาย Request ไปหลายตัว App Server

---

## ส่วนที่ 2: เนื้อหาบทเรียน (90 นาที)

---

## 1.1 N-Tier Architecture: จาก Layer (Logical) สู่ Tier (Physical)

### 🏗️ ทบทวนเร็วๆ — Layer คืออะไร?

**Layer = การแบ่ง Code เชิงตรรกะ (Logical Separation)**

ใน Week 4 เราแบ่ง Code เป็น 3 Layers:

```
┌──────────────────────────────────────────────────────┐
│  ทั้งหมดรันใน 1 Process (node server.js)                │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Controller Layer     (รับ HTTP Request)        │  │
│  │  └─► taskController.js                         │  │
│  ├────────────────────────────────────────────────┤  │
│  │  Service Layer        (Business Logic)         │  │
│  │  └─► taskService.js                            │  │
│  ├────────────────────────────────────────────────┤  │
│  │  Repository Layer     (Database Access)        │  │
│  │  └─► taskRepository.js                         │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  📌 แม้จะแยก Code เป็น 3 ไฟล์ แต่ Runtime เดียวกัน         │
│     ถ้า Process ล่ม → ทุก Layer ล่มหมด                   │
└──────────────────────────────────────────────────────┘
```

**ข้อจำกัดของ Layer:**
- Code แยกเป็นระเบียบ แต่ Deploy เป็น **ก้อนเดียว**
- **Scale ไม่ได้อิสระ** — ถ้า Repository ต้องการ RAM เพิ่ม ต้องเพิ่มให้ทั้ง Process
- **ล่มพร้อมกัน** — ถ้า Node.js process crash ทุก Layer หยุดทำงาน
- **ผูกติดกับเครื่องเดียว** — ไม่สามารถย้าย Layer ไปรันบนเครื่องอื่นได้

---

### 🏗️ Tier คืออะไร?

**Tier = การแบ่งเชิงกายภาพ (Physical Separation)**

แต่ละ Tier รันใน **Process หรือ Machine แยกกัน** สื่อสารกันผ่าน **Network (HTTP, TCP)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Layer (Logical)                    Tier (Physical)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐              ┌───────────────────────┐             │
│  │  Controller     │              │ Container A: Nginx    │ ← Tier 1    │
│  │  Service        │   Deploy     │ (Web Server)          │             │
│  │  Repository     │  ═══════►    ├───────────────────────┤             │
│  │  ─────────      │   แยกเป็น     │ Container B: App ×3   │ ← Tier 2    │
│  │  ทุกอย่างใน       │   Containers │ (Node.js API)         │             │
│  │  1 Process      │              ├───────────────────────┤             │
│  └─────────────────┘              │ Container C: Redis    │ ← Tier 3a   │
│                                   │ (Cache)               │             │
│                                   ├───────────────────────┤             │
│                                   │ Container D: Postgres │ ← Tier 3b   │
│                                   │ (Database)            │             │
│                                   └───────────────────────┘             │
│                                                                         │
│  📌 Key Differences:                                                    │
│  • Layer = Code Organization (จัด Code)                                  │
│  • Tier = Deployment Unit (จัดวาง Runtime)                               │
│  • 1 Tier อาจมีหลาย Layers อยู่ภายใน                                       │
│  • แต่ละ Tier สื่อสารผ่าน Network                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 📊 ทำไมต้องแยก Tier? — แก้ปัญหาอะไรบ้าง?

#### ปัญหาที่ 1: Scale ไม่ได้อิสระ

```
❌ Monolith: ต้อง Scale ทั้งก้อน
┌─────────────────────────┐     ┌─────────────────────────┐
│ App + DB + Static Files │ ──► │ App + DB + Static Files │
│       Server A          │     │     Server B (ใหญ่ขึ้น)    │
│    RAM: 4GB             │     │    RAM: 16GB            │
└─────────────────────────┘     └─────────────────────────┘
                     Scale Up (Vertical) = แพง!

✅ N-Tier: Scale เฉพาะส่วนที่ต้องการ
┌────────┐  ┌────────┐  ┌────────┐     ┌────────┐
│ App #1 │  │ App #2 │  │ App #3 │     │ DB     │
│ 512MB  │  │ 512MB  │  │ 512MB  │     │ 4GB    │
└────────┘  └────────┘  └────────┘     └────────┘
        Scale Out (Horizontal) = ถูกกว่า!
        เพิ่มจำนวน App Server ได้ ไม่ต้องขยาย DB
```

#### ปัญหาที่ 2: Single Point of Failure

```
❌ Single Instance:
Client ──► [ App Server ] ──► DB
              │
              💥 ล่ม!
              │
           ทั้งระบบหยุด!

✅ Multi-Instance + LB:
                ┌──► [ App #1 ] ──┐
Client ──► LB ──┼──► [ App #2 ] ──┼──► DB
                └──► [ App #3 ] ──┘
                       │
                       💥 App #2 ล่ม
                       │
                    LB ส่ง request ไป #1 และ #3 แทน
                    ระบบยังทำงานได้!
```

#### ปัญหาที่ 3: Technology Lock-in

```
❌ ทุกอย่างรวมกัน:
App ผูกกับ SQLite → เปลี่ยน DB ต้องแก้ทั้งระบบ

✅ แยก Tier:
App Tier ←(Network)→ DB Tier
   │                    │
   │                    └─ เปลี่ยนจาก SQLite เป็น PostgreSQL
   │                       App ไม่ต้องแก้ (แค่เปลี่ยน connection string)
   │
   └─ เปลี่ยนจาก Node.js เป็น Go
      DB ไม่ต้องแก้ (ใช้ SQL เหมือนเดิม)
```

---

### 🏗️ 4-Tier Architecture ใน Lab สัปดาห์นี้

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   Browser (Client)                                                     │
│      │                                                                 │
│      │  HTTP :80                                                       │
│      ▼                                                                 │
│   ┌─────────────────────────────────────────────────────┐              │
│   │  TIER 1: Web Tier — Nginx                           │              │
│   │  ─────────────────────────────────────              │              │
│   │  • Load Balancer (Round-Robin)                      │              │
│   │  • Reverse Proxy                                    │              │
│   │  • Static File Serving (HTML/CSS/JS)                │              │
│   │  • SSL Termination (production)                     │              │
│   └─────────────────┬─────────────┬─────────────────────┘              │
│                     │             │                                    │
│      ┌──────────────┼─────────────┼──────────────┐                     │
│      ▼              ▼             ▼              │                     │
│   ┌────────┐  ┌────────┐  ┌────────┐             │                     │
│   │ TIER 2 │  │ TIER 2 │  │ TIER 2 │    Application Tier               │
│   │ App #1 │  │ App #2 │  │ App #3 │    (Node.js Express)              │
│   │ :3000  │  │ :3000  │  │ :3000  │    ─────────────────              │
│   │        │  │        │  │        │   • REST API                      │
│   │ Layers:│  │ Layers:│  │ Layers:│   • Controller → Service → Repo   │
│   │ C→S→R  │  │ C→S→R  │  │ C→S→R  │   • Business Logic                │
│   └───┬────┘  └───┬────┘  └───┬────┘   • Validation                    │
│       │           │           │                                        │
│       └───────────┼───────────┘                                        │
│                   │                                                    │
│       ┌───────────┼───────────┐                                        │
│       ▼                       ▼                                        │
│   ┌────────────┐       ┌────────────┐      Data Tier                   │
│   │ TIER 3a    │       │ TIER 3b    │      ─────────                   │
│   │ Redis      │       │ PostgreSQL │                                  │
│   │ (Cache)    │       │ (Database) │                                  │
│   │ ──────     │       │ ──────     │                                  │
│   │ In-Memory  │       │ Persistent │                                  │
│   │ TTL-based  │       │ ACID       │                                  │
│   │ Key-Value  │       │ Relational │                                  │
│   └────────────┘       └────────────┘                                  │
│                                                                        │
│   🐳 ทุก Tier คือ Docker Container ที่สื่อสารผ่าน Docker Network              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🏪 ตัวอย่างจริง: N-Tier ในระบบที่คุ้นเคย

#### Shopee / Lazada (E-Commerce)

```
Tier 1: CDN (Cloudflare)        ← Cache รูปสินค้า, CSS/JS
Tier 2: Load Balancer (AWS ALB) ← กระจายโหลดไป App Servers
Tier 3: API Gateway             ← Route ไปยัง Service ที่ถูกต้อง
Tier 4: App Servers ×100+       ← Product, Order, Payment Services
Tier 5: Redis Cluster           ← Cache ข้อมูลสินค้า hot items
Tier 6: Database Cluster        ← MySQL/PostgreSQL + Read Replicas

ผลลัพธ์: รองรับ Flash Sale ได้หลายล้าน concurrent users
```

#### LINE Messaging (แอปที่ใช้ทุกวัน)

```
Tier 1: Mobile App / Web Client
Tier 2: Load Balancer
Tier 3: Message API Servers ×1000+
Tier 4: Redis (Online status, Recent messages cache)
Tier 5: Database Shards (Message history)
Tier 6: Object Storage (รูป, วิดีโอ, สติกเกอร์)

ผลลัพธ์: ส่งข้อความถึงกันใน < 100ms
```

#### ระบบ Mobile Banking (SCB, KBank)

```
Tier 1: Mobile App
Tier 2: WAF + Load Balancer (Firewall + กระจายโหลด)
Tier 3: API Gateway (Authentication, Rate Limiting)
Tier 4: Core Banking Services
Tier 5: Cache (บัญชีล่าสุด, อัตราแลกเปลี่ยน)
Tier 6: Oracle Database (ข้อมูลบัญชีจริง)

ผลลัพธ์: โอนเงินเสร็จใน < 3 วินาที, พร้อมใช้ 24/7
```

---

### 📐 N-Tier Design Guidelines

#### เมื่อไหร่ควรเพิ่ม Tier?

| สถานการณ์ | Tier ที่ควรเพิ่ม | เหตุผล |
|:--|:--|:--|
| DB ถูก Query ซ้ำๆ ข้อมูลเดิม | **Cache Tier (Redis)** | ลดภาระ DB, เพิ่ม Response Speed |
| App Server รับ Load ไม่ไหว | **Load Balancer Tier + Scale App** | กระจายโหลด, เพิ่ม Throughput |
| ต้องการ SSL/Static Files | **Web Server Tier (Nginx)** | แยกงาน, ลดภาระ App |
| ต้อง Route ไปหลาย Services | **API Gateway Tier** | Single Entry Point, Auth centralized |
| ต้องการ Async Processing | **Message Queue Tier** | แยก Sync/Async, Loose Coupling |

#### เมื่อไหร่ **ไม่ควร** เพิ่ม Tier?

- ระบบเล็กมาก (ผู้ใช้ < 100 คน) → Over-engineering
- ทีมเล็ก (1-2 คน) → Complexity สูงเกินกว่าจะ Maintain ได้
- ยังไม่มีปัญหาด้าน Performance → Premature Optimization
- Budget จำกัดมาก → แต่ละ Tier = ต้นทุนเพิ่ม

> **📌 หลักการสำคัญ:** "เพิ่ม Tier เมื่อมีปัญหาจริง ไม่ใช่เพราะ 'น่าจะดี'"

---

## 1.2 Caching Strategy: ทำไมต้อง Cache และ Pattern ที่นิยมใช้

### ⚡ ปัญหาที่ Cache แก้ได้

#### สถานการณ์: TaskBoard มีผู้ใช้ 500 คน

```
❌ ไม่มี Cache:
─────────────────────────────────────────────────────────────────

 User A ──GET /tasks──► App ──SELECT * FROM tasks──► DB ──► 50ms
 User B ──GET /tasks──► App ──SELECT * FROM tasks──► DB ──► 50ms
 User C ──GET /tasks──► App ──SELECT * FROM tasks──► DB ──► 50ms
   ...
 User 500 ──GET /tasks──► App ──SELECT * FROM tasks──► DB ──► 200ms
                                                              ↑
                                                        DB เริ่มช้า!

 Total DB Queries = 500 ครั้ง (ทั้งที่ข้อมูลเดียวกัน!)
 Average Response = 50-200ms (ยิ่งเยอะยิ่งช้า)
 DB CPU Usage = 80%+ 😰


✅ มี Redis Cache:
─────────────────────────────────────────────────────────────────

 User A ──GET /tasks──► App ──► Redis (MISS) ──► DB ──► 50ms
                                 │
                              เก็บผลลัพธ์ใน Redis
                                 │
 User B ──GET /tasks──► App ──► Redis (HIT!) ──► 2ms  ✨
 User C ──GET /tasks──► App ──► Redis (HIT!) ──► 2ms  ✨
   ...
 User 500 ──GET /tasks──► App ──► Redis (HIT!) ──► 2ms  ✨

 Total DB Queries = 1 ครั้ง! (ที่เหลือ Redis ตอบแทน)
 Average Response = 2-5ms (เร็วขึ้น 25 เท่า!)
 DB CPU Usage = 5% 😎
```

---

### 🧠 Redis คืออะไร?

**Redis** (Remote Dictionary Server) คือ **In-Memory Data Store** ที่เก็บข้อมูลใน RAM ทำให้อ่าน/เขียนเร็วมาก

```
┌───────────────────────────────────────────────────────────────┐
│  Redis vs PostgreSQL                                          │
├────────────────────────┬──────────────────────────────────────┤
│  Redis                 │  PostgreSQL                          │
├────────────────────────┼──────────────────────────────────────┤
│  เก็บใน RAM (Memory)    │  เก็บใน Disk (Hard Drive)             │
│  อ่าน: ~0.1ms           │  อ่าน: ~5-50ms                        │
│  Key-Value Store       │  Relational (SQL)                    │
│  ไม่มี Schema            │  มี Schema (Table, Column, Type)      │
│  ข้อมูลหายเมื่อ Restart    │  ข้อมูลอยู่ถาวร                          │
│  เหมาะ: Cache, Session │  เหมาะ: ข้อมูลถาวร, Transaction        │
├────────────────────────┴──────────────────────────────────────┤
│                                                               │
│  📌 ใช้คู่กัน: Redis = ตู้เย็น (เก็บของใช้บ่อย เข้าถึงเร็ว)                │
│               PostgreSQL = ห้องเก็บของ (เก็บทุกอย่าง แต่ไกลกว่า)     │
│                                                               │
│  เปรียบเทียบ: ถ้าเราต้องการน้ำดื่มบ่อยๆ                               │
│  • ไม่มีตู้เย็น = ต้องเดินไปห้องเก็บของทุกครั้ง (ช้า)                      │
│  • มีตู้เย็น = หยิบจากตู้เย็นในห้องเลย (เร็ว)                           │
│  • ของในตู้เย็นหมด = ไปเอาจากห้องเก็บของมาเติม (Cache Miss)         │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### 📊 Caching Patterns — วิธีใช้ Cache อย่างถูกต้อง

#### Pattern 1: Cache-Aside (Lazy Loading) ⭐ ใช้ใน Lab สัปดาห์นี้

**หลักการ:** Application เป็นคนจัดการ Cache เอง — ตรวจ Cache ก่อน ถ้าไม่มีค่อย Query DB แล้วเก็บผลลัพธ์ใน Cache

```
┌─────────────────────────────────────────────────────────────────────┐
│  Cache-Aside Pattern (Read Path)                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Client ──► Application                                             │
│                 │                                                   │
│                 ├─ ① ตรวจ Redis: "มี key tasks:all ไหม?"            │
│                 │       │                                           │
│                 │       ├── HIT ✅ → ② ส่งข้อมูลจาก Redis กลับ         │
│                 │       │              (ไม่ต้องถาม DB เลย!)           │
│                 │       │              ⏱️ ~2ms                      │
│                 │       │                                           │
│                 │       └── MISS ❌ → ③ Query PostgreSQL           │
│                 │                     ④ เก็บผลลัพธ์ใน Redis           │
│                 │                        (SET key, value, TTL=60s)  │
│                 │                     ⑤ ส่งข้อมูลกลับ                  │
│                 │                     ⏱️ ~50ms (ครั้งแรก)             │
│                 │                                                   │
│  Cache-Aside (Write Path)                                           │
│  ──────────────────────────                                         │
│                 │                                                   │
│                 ├─ POST/PUT/DELETE (เปลี่ยนข้อมูล)                      │
│                 │       │                                           │
│                 │       ├── ① Write ไป PostgreSQL                  │
│                 │       └── ② Invalidate (ลบ) Key ใน Redis         │
│                 │              DEL tasks:all                        │
│                 │              (ครั้งต่อไปที่อ่าน = MISS → ดึงข้อมูลใหม่)     │
│                 │                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Pseudocode:**

```javascript
// READ: Cache-Aside
async function getTasks() {
    // ① ตรวจ Cache ก่อน
    const cached = await redis.get('tasks:all');
    
    if (cached) {
        console.log('CACHE HIT ✅');     // ② พบใน Cache!
        return JSON.parse(cached);
    }
    
    console.log('CACHE MISS ❌');        // ③ ไม่พบ ต้อง Query DB
    const tasks = await db.query('SELECT * FROM tasks');
    
    // ④ เก็บผลลัพธ์ใน Redis (หมดอายุใน 60 วินาที)
    await redis.setEx('tasks:all', 60, JSON.stringify(tasks));
    
    return tasks;                        // ⑤ ส่งกลับ
}

// WRITE: Invalidate Cache
async function createTask(data) {
    // ① เขียนลง DB
    const task = await db.query('INSERT INTO tasks ...');
    
    // ② ลบ Cache (บังคับให้ครั้งหน้าเป็น MISS → ดึงข้อมูลใหม่)
    await redis.del('tasks:all');
    
    return task;
}
```

**ข้อดี:**
- Application ควบคุม Cache ได้เต็มที่
- Cache เฉพาะข้อมูลที่ถูกเรียกใช้จริง (ประหยัด Memory)
- ง่ายต่อการ Implement

**ข้อเสีย:**
- Request แรกหลัง Cache หมดอายุ (Cold Start) จะช้า
- ถ้า Cache กับ DB ไม่ Sync กัน → อาจได้ข้อมูลเก่า (Stale Data)

---

#### Pattern 2: Write-Through (เปรียบเทียบ)

**หลักการ:** เขียนลง Cache และ DB **พร้อมกัน** ทุกครั้ง

```
Client ──► Application
                │
                ├─ WRITE: ① เขียนลง Redis   ② เขียนลง PostgreSQL
                │          (พร้อมกัน)
                │
                ├─ READ:  อ่านจาก Redis เสมอ (ข้อมูล up-to-date)
```

**ข้อดี:** Cache มีข้อมูลล่าสุดเสมอ
**ข้อเสีย:** เขียนช้าลง (ต้องเขียน 2 ที่), Cache ข้อมูลที่อาจไม่มีใครอ่าน

---

#### Pattern 3: Write-Behind (Write-Back) (เปรียบเทียบ)

**หลักการ:** เขียนลง Cache ก่อน แล้ว **ค่อย** เขียนลง DB ทีหลัง (Async)

```
Client ──► Application
                │
                ├─ WRITE: ① เขียนลง Redis (เร็วมาก!)
                │          ② Redis ค่อยๆ เขียนลง DB ภายหลัง (Async)
                │
                ├─ READ:  อ่านจาก Redis เสมอ
```

**ข้อดี:** เขียนเร็วมาก (ไม่ต้องรอ DB)
**ข้อเสีย:** ถ้า Redis ล่มก่อนเขียนลง DB → **ข้อมูลหาย!** (ไม่เหมาะกับข้อมูลสำคัญ)

---

### 🔄 เปรียบเทียบ Caching Patterns

```
┌────────────────────────────────────────────────────────────────────────┐
│  Caching Patterns Comparison                                           │
├─────────────────┬────────────┬──────────────┬──────────────────────────┤
│                 │Cache-Aside │Write-Through │Write-Behind              │
│                 │⭐ ใช้ใน Lab │              │                          │
├─────────────────┼────────────┼──────────────┼──────────────────────────┤
│  Read Speed     │ HIT: เร็ว   │ เร็วเสมอ      │ เร็วเสมอ                  │
│                 │ MISS: ช้า   │              │                          │
│  Write Speed    │ ปกติ        │ ช้าลงเล็กน้อย   │ เร็วมาก                   │
│  Data Safety    │ ปลอดภัย     │ ปลอดภัย       │ ⚠️ อาจสูญหาย              │
│  Complexity     │ ง่าย        │ ปานกลาง      │ ซับซ้อน                    │
│  Memory Usage   │ ประหยัด     │ สิ้นเปลือง      │ สิ้นเปลือง                  │
│  Best For       │ Read-heavy │ Read+Write   │ Write-heavy              │
│  Example        │ TaskBoard  │ Session Store│ Analytics, Logging       │
└─────────────────┴────────────┴──────────────┴──────────────────────────┘
```

---

### ⚠️ ปัญหาที่ต้องระวังเมื่อใช้ Cache

#### 1. Stale Data (ข้อมูลเก่า)

```
Timeline:
  t=0s   User A อ่าน tasks → Cache MISS → ดึงจาก DB → เก็บใน Cache (TTL=60s)
  t=10s  User B แก้ไข task #5 → ลบ Cache (Invalidate)
  t=10s  User A อ่านอีกครั้ง → Cache MISS → ดึง DB ใหม่ ✅

  แต่ถ้าลืม Invalidate Cache ล่ะ?
  t=10s  User B แก้ไข task #5 → เขียน DB ✅ แต่ไม่ลบ Cache ❌
  t=11s  User C อ่าน tasks → Cache HIT → ได้ข้อมูลเก่า! 😱
  
  วิธีแก้: ① Invalidate Cache ทุกครั้งที่เขียน ② ตั้ง TTL สั้น
```

#### 2. Cache Stampede / Thundering Herd (ฝูงควาย)

```
สถานการณ์: Cache หมดอายุ + มี 1,000 requests พร้อมกัน

  t=60s  Cache หมดอายุ (TTL expired)
  t=60s  Request #1   → Cache MISS → Query DB
  t=60s  Request #2   → Cache MISS → Query DB   ← ทุก Request
  t=60s  Request #3   → Cache MISS → Query DB      ถาม DB พร้อมกัน!
  ...
  t=60s  Request #1000 → Cache MISS → Query DB  ← DB ล่ม! 💀

  วิธีแก้: 
  ① Lock — ให้เฉพาะ Request แรกไป Query DB ที่เหลือรอ
  ② Random TTL — TTL = 60 + random(0-10) วินาที ไม่หมดพร้อมกัน
  ③ Pre-warm — เติม Cache ก่อนหมดอายุ
```

#### 3. Cache Invalidation (ลบ Cache ถูกจุด)

```
"There are only two hard things in Computer Science: 
 cache invalidation and naming things." 
                              — Phil Karlton

  ปัญหา: เมื่อสร้าง Task ใหม่ ต้องลบ Cache key ไหนบ้าง?
  
  ① tasks:all        ← ต้องลบ (รายการทั้งหมดเปลี่ยน)
  ② tasks:stats      ← ต้องลบ (สถิติเปลี่ยน)
  ③ tasks:5          ← ไม่ต้อง (Task #5 ไม่ได้ถูกแก้)
  
  วิธีจัดการ: ใช้ Key Pattern → ลบทุก key ที่ขึ้นต้นด้วย "tasks:*"
```

---

## 1.3 Load Balancing: การกระจายโหลดและ Horizontal Scaling

### 📈 Scaling: ทำให้ระบบรองรับผู้ใช้มากขึ้น

#### Vertical Scaling (Scale Up) vs Horizontal Scaling (Scale Out)

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  Vertical Scaling (Scale Up)         Horizontal Scaling (Scale Out)   │
│  "ซื้อเครื่องใหญ่ขึ้น"                  "ซื้อเครื่องเพิ่ม"                         │
│                                                                       │
│  ┌─────────────┐                     ┌──────┐ ┌──────┐ ┌──────┐       │
│  │             │                     │ App  │ │ App  │ │ App  │       │
│  │  BIG SERVER │                     │  #1  │ │  #2  │ │  #3  │       │
│  │  64GB RAM   │                     │ 4GB  │ │ 4GB  │ │ 4GB  │       │
│  │  32 Cores   │                     └──────┘ └──────┘ └──────┘       │
│  │             │                                                      │
│  └─────────────┘                     Total: 12GB RAM (distributed)    │
│                                                                       │
│  ✅ ง่าย ไม่ต้องเปลี่ยน Code          ✅ ไม่มีขีดจำกัด (เพิ่มได้เรื่อยๆ)            │
│  ✅ ไม่ต้องมี Load Balancer           ✅ Fault Tolerant (เครื่อง 1 ล่ม      │
│  ❌ มีขีดจำกัด (RAM/CPU max)              ยังมีอีก 2 เครื่อง)                 │
│  ❌ แพง (เครื่องใหญ่แพงมาก)           ✅ ถูกกว่า (เครื่องเล็กๆ หลายตัว)        │
│  ❌ Single Point of Failure          ❌ ต้องมี Load Balancer            │
│     (เครื่องเดียวล่ม = ทุกอย่างล่ม)    ❌ ต้องจัดการ State (Session)           │
│                                                                       │
│  เปรียบเทียบ:                                                           │
│  Scale Up = "ซื้อรถบัสคันใหญ่ขึ้น"    Scale Out = "เพิ่มจำนวนรถตู้"              │
│  รถบัส 1 คัน นั่งได้ 50 คน           รถตู้ 5 คัน × 12 คน = 60 คน              │
│                                      ถ้ารถตู้ 1 คันเสีย ยังมี 4 คันเหลือ       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

### 🔀 Load Balancer คืออะไร?

**Load Balancer** = ตัวกลางที่รับ Request จาก Client แล้วกระจายไปยัง Server หลายตัว

```
ถ้าไม่มี Load Balancer:                  มี Load Balancer:
──────────────────────                   ──────────────────────

Client ──► App #1 (Port 3001)            Client ──► LB ──┬──► App #1
Client ──► App #2 (Port 3002)                            ├──► App #2
Client ──► App #3 (Port 3003)                            └──► App #3

Client ต้องรู้จัก IP:Port ทุกตัว!          Client รู้แค่ LB เดียว!
ถ้า App #2 ล่ม → Client ต้องจัดการเอง     ถ้า App #2 ล่ม → LB ส่งไปตัวอื่นอัตโนมัติ
```

**ทำไม Nginx?**
- Open Source, ฟรี, ใช้กันทั่วโลก
- เร็วมาก (Event-driven, Non-blocking)
- ทำได้หลายหน้าที่: Load Balancer + Reverse Proxy + Static Files + SSL

---

### 📊 Load Balancing Algorithms

#### 1. Round-Robin ⭐ (ใช้ใน Lab สัปดาห์นี้)

```
Request #1 ──► App #1
Request #2 ──► App #2
Request #3 ──► App #3
Request #4 ──► App #1   ← วนกลับมา
Request #5 ──► App #2
Request #6 ──► App #3
...

หลักการ: ส่งวนไปทีละตัว เท่าๆ กัน
ข้อดี:    ง่าย, ยุติธรรม, ไม่ต้องเก็บ State
ข้อเสีย:  ไม่สนว่า Server ตัวไหนงานหนักกว่า
เหมาะกับ: ทุก Server spec เท่ากัน (เช่น Docker containers)
```

#### 2. Least Connections

```
App #1: 5 connections (งานเยอะ)
App #2: 2 connections (งานน้อย)  ◄── Request ใหม่ส่งมาที่นี่!
App #3: 4 connections

หลักการ: ส่งไปตัวที่งานน้อยที่สุด
ข้อดี:    ฉลาดกว่า Round-Robin ถ้า Requests ใช้เวลาไม่เท่ากัน
ข้อเสีย:  ต้อง Track จำนวน connection ของทุก Server
เหมาะกับ: Requests ที่ใช้เวลาต่างกันมาก (เช่น file upload + API call)
```

#### 3. IP Hash (Sticky Sessions)

```
Client IP: 192.168.1.10 → hash → App #2  (ไปที่เดิมเสมอ)
Client IP: 192.168.1.20 → hash → App #1
Client IP: 192.168.1.30 → hash → App #3

หลักการ: hash จาก IP ของ Client → ส่งไป Server เดิมเสมอ
ข้อดี:    ดีสำหรับ Stateful Sessions (ไม่ต้องใช้ Session Store)
ข้อเสีย:  ถ้า Server ล่ม → Client ต้อง reconnect ไปตัวอื่น
เหมาะกับ: ระบบที่เก็บ Session ไว้ใน Server Memory
```

#### 4. Weighted Round-Robin

```
App #1 (weight=3): ──► ──► ──►
App #2 (weight=1): ──►
App #3 (weight=2): ──► ──►

หลักการ: Server ที่แรงกว่ารับ Request มากกว่า
ข้อดี:    ดีถ้า Server มี spec ไม่เท่ากัน
ข้อเสีย:  ต้องกำหนด weight ที่เหมาะสม
เหมาะกับ: Mixed hardware environment
```

---

### 🔄 Health Check — ตรวจสอบว่า Server ยังมีชีวิตอยู่

```
Load Balancer ทำ Health Check ทุก 10 วินาที:

  LB ──► App #1 GET /health → 200 OK      ✅ ส่ง request ได้
  LB ──► App #2 GET /health → 200 OK      ✅ ส่ง request ได้
  LB ──► App #3 GET /health → ❌ Timeout   ❌ ไม่ส่ง request!

  ถ้า App #3 กลับมา healthy:
  LB ──► App #3 GET /health → 200 OK      ✅ เริ่มส่ง request อีกครั้ง

  Health Endpoint ที่ดีควรตรวจ:
  ┌───────────────────────────────────────────────┐
  │  GET /health                                  │
  │  {                                            │
  │    "status": "ok",                            │
  │    "instanceId": "app-abc123",  ← ระบุตัวตน     │
  │    "dbConnected": true,         ← DB พร้อม?    │
  │    "cacheConnected": true,      ← Redis พร้อม? │
  │    "uptime": "2h 15m"                         │
  │  }                                            │
  └───────────────────────────────────────────────┘
```

---

## 1.4 Quality Attributes ที่ได้รับผลกระทบ & Trade-offs Analysis

### 📊 ผลกระทบต่อ Quality Attributes

```
┌───────────────────────────────────────────────────────────────────────┐
│  Quality Attribute Impact Analysis                                    │
├─────────────────┬───────────┬───────────────┬─────────────────────────┤
│  Quality        │  Week 5   │  Week 6       │  สิ่งที่ทำให้ดีขึ้น             │
│  Attribute      │  (Basic)  │  (N-Tier+$)   │                         │
├─────────────────┼───────────┼───────────────┼─────────────────────────┤
│  Performance    │  ★★☆☆☆    │  ★★★★☆        │  Redis Cache ลด         │
│  (Response Time)│  ~50ms    │  ~2ms (HIT)   │  Response Time 25×      │
├─────────────────┼───────────┼───────────────┼─────────────────────────┤
│  Scalability    │  ★☆☆☆☆    │  ★★★★☆        │  Horizontal Scaling     │
│  (Max Users)    │  ~500     │  ~5,000       │  docker compose --scale │
├─────────────────┼───────────┼───────────────┼─────────────────────────┤
│  Availability   │  ★★☆☆☆    │  ★★★★☆        │  Multi-Instance ทำให้    │
│  (Uptime)       │  ~99%     │  ~99.9%       │  ทนต่อ Server ล่มได้       │
├─────────────────┼───────────┼───────────────┼─────────────────────────┤
│  Maintainability│  ★★★★☆    │  ★★★☆☆        │  ❌ ลดลง เพราะมี         │
│                 │  ง่าย      │  ซับซ้อนขึ้น      │  Components เยอะขึ้น      │
├─────────────────┼───────────┼───────────────┼─────────────────────────┤
│  Debuggability  │  ★★★★☆    │  ★★★☆☆        │  ❌ ลดลง เพราะ Request  │
│                 │           │               │  ผ่านหลาย Tier           │
├─────────────────┼───────────┼───────────────┼─────────────────────────┤
│  Cost           │  ★★★★★    │  ★★★ ☆☆       │  ❌ เพิ่มขึ้น (Redis,       │
│                 │  ถูกมาก    │  ปานกลาง      │  Nginx, หลาย Instances) │
└─────────────────┴───────────┴───────────────┴─────────────────────────┘
```

### ⚖️ Trade-offs ที่ต้องยอมรับ

```
┌──────────────────────────────────────────────────────────────────────┐
│  Trade-offs เมื่อเพิ่ม Cache + Load Balancing                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ✅ ได้อะไร                            ❌ เสียอะไร                     │
│  ──────────                           ──────────                     │
│  Performance ดีขึ้น (Cache)            Complexity เพิ่มขึ้น                 │
│  Scalability ดีขึ้น (Scale Out)        Consistency อาจมีปัญหา (Stale)     │
│  Availability ดีขึ้น (Multi-Instance)  Cost เพิ่มขึ้น (Infrastructure)      │
│  Throughput เพิ่มขึ้น (LB)              Debugging ยากขึ้น (หลาย Tier)      │
│                                     Operational Overhead เพิ่มขึ้น       │
│                                     (ต้อง Monitor หลาย Containers)    │
│                                                                      │
│  📌 คำถามสำคัญ:                                                       │
│  "ระบบของเรามีปัญหาด้าน Performance/Scalability จริงหรือไม่?"              │
│  ถ้าไม่มี → อย่าเพิ่ม Complexity โดยไม่จำเป็น                                │
│  ถ้ามี → เพิ่ม Cache/LB จะคุ้มค่ามาก                                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## ส่วนที่ 3: สรุปบทเรียนก่อนเข้า Lab (5 นาที)

### 📋 Checklist: สิ่งที่ต้องเข้าใจก่อนลงมือ

| ✅ | หัวข้อ | เข้าใจแล้ว? |
|:--:|:--|:--:|
| ☐ | Layer = แยก Code (Logical) / Tier = แยก Deployment (Physical) | |
| ☐ | 4-Tier ใน Lab: Nginx → App ×3 → Redis + PostgreSQL | |
| ☐ | Cache-Aside Pattern: ตรวจ Cache → MISS ก็ไป DB → เก็บใน Cache | |
| ☐ | Cache Invalidation: เมื่อเขียนข้อมูล → ลบ Cache → ครั้งหน้าจะ MISS | |
| ☐ | TTL (Time-To-Live): Cache หมดอายุอัตโนมัติ (เช่น 60 วินาที) | |
| ☐ | Load Balancing Round-Robin: ส่ง Request วนไปทีละ Server | |
| ☐ | Horizontal Scaling: เพิ่มจำนวน Server แทนการขยาย Server | |
| ☐ | Health Check: LB ตรวจสอบว่า Server ยังทำงาน → ไม่ส่งไปตัวที่ล่ม | |
| ☐ | Trade-off: ได้ Performance/Scalability แต่เสีย Simplicity/Consistency | |

### 🗺️ แผนผัง Lab ที่จะทำต่อ (3 ชั่วโมง)

```
Part 1: สร้างโครงสร้าง           (15 นาที) ← กำหนดโฟลเดอร์ + .env
Part 2: Backend + Redis Cache    (60 นาที) ← Cache-Aside Pattern จริง
Part 3: Nginx Load Balancer      (30 นาที) ← Round-Robin Config
Part 4: Docker Compose + Scale   (30 นาที) ← docker compose up --scale app=3
Part 5: Testing                  (30 นาที) ← ทดสอบ Cache HIT/MISS + LB Distribution
Part 6: สรุปเปรียบเทียบ           (15 นาที) ← วิเคราะห์ Quality Attributes
```

---

*ENGSE207 Software Architecture — Term Project Week 6 Theory*
*Instructor: นายธนิต เกตุแก้ว — มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
