# 📚 ENGCE301: การออกแบบและพัฒนาซอฟต์แวร์
## Software Design and Development

---

# 📅 สัปดาห์ที่ 6
## Software Architecture & Design Patterns + Node.js/Express Introduction

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🏗️  Software Architecture & Design Patterns                    ║
║                           +                                      ║
║   🟢 Node.js/Express Introduction (JSON File)                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📋 หน่วยเรียนและวัตถุประสงค์

### หน่วยเรียนที่ 6: Software Architecture & Design Patterns + Node.js/Express Intro

#### ชื่อบทเรียน:
- **6.1** รูปแบบสถาปัตยกรรมซอฟต์แวร์ (Software Architecture Patterns)
- **6.2** แนะนำ Design Patterns เบื้องต้น
- **6.3** Node.js และ Express Framework พื้นฐาน
- **6.4** การอ่านและเขียนไฟล์ JSON ด้วย Node.js

#### วัตถุประสงค์การสอน:
- **6.1.1** อธิบายและเปรียบเทียบรูปแบบสถาปัตยกรรมซอฟต์แวร์ต่างๆ เช่น Monolithic, Client-Server, และ Microservices ได้
- **6.1.2** เลือกสถาปัตยกรรมที่เหมาะสมกับข้อกำหนดของระบบได้
- **6.2.1** อธิบายแนวคิดพื้นฐานของ Design Patterns และประโยชน์ของการใช้งานได้
- **6.2.2** ระบุ Design Patterns ที่เกี่ยวข้องกับการแบ่งเลเยอร์ของซอฟต์แวร์ได้
- **6.3.1** อธิบายบทบาทของ Backend API ในสถาปัตยกรรมเว็บแอปพลิเคชันได้
- **6.3.2** ติดตั้งและตั้งค่า Node.js และสร้าง Express Server เบื้องต้นได้
- **6.4.1** สร้าง RESTful Routes (GET, POST) สำหรับการอ่านและเขียนข้อมูลใน JSON file ได้
- **6.4.2** เชื่อมต่อ Frontend (HTML/JavaScript) กับ Backend API โดยใช้ fetch() ได้

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 CLO ที่เกี่ยวข้อง: CLO1, CLO3, CLO4                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 ทบทวนเนื้อหาสัปดาห์ที่ผ่านมา

```
╔════════════════════════════════════════════════════════════════╗
║  📖 สัปดาห์ที่ 5: UI Design & Prototyping + JavaScript             ║
╚════════════════════════════════════════════════════════════════╝
```

ในสัปดาห์ที่ 5 เราได้เรียนรู้เกี่ยวกับ **UI Design & Prototyping** และการใช้ **JavaScript เบื้องต้น**ในการจัดการฟอร์ม โดยมีหัวข้อสำคัญดังนี้:

- ✅ **หลักการออกแบบ UI**: CRAP Principles (Contrast, Repetition, Alignment, Proximity) และ Usability Heuristics
- ✅ **การออกแบบ Mockup**: การใช้ Figma ในการสร้าง High-fidelity Mockup
- ✅ **JavaScript เบื้องต้น**: DOM Manipulation, Event Handling, และ Form Validation
- ✅ การจับ Events เช่น `onclick`, `onchange`, `onsubmit` เพื่อตรวจสอบข้อมูลก่อนส่งฟอร์ม

```
    Frontend (Week 5)         →        Backend (Week 6)
    ┌─────────────────┐                ┌─────────────────┐
    │  HTML/CSS/JS    │                │   Node.js       │
    │   + Figma       │       →        │   + Express     │
    │  UI/UX Design   │                │  API Server     │
    └─────────────────┘                └─────────────────┘
```

> 💡 **สัปดาห์นี้** เราจะก้าวไปสู่ส่วน Backend โดยเรียนรู้เกี่ยวกับสถาปัตยกรรมซอฟต์แวร์และการสร้าง API Server ด้วย Node.js/Express

---

## 6.1 รูปแบบสถาปัตยกรรมซอฟต์แวร์ (Software Architecture Patterns)

```
╔═══════════════════════════════════════════════════════════════╗
║  🏗️  Software Architecture Patterns                           ║
╚═══════════════════════════════════════════════════════════════╝
```

**Software Architecture** คือการออกแบบโครงสร้างระดับสูงของซอฟต์แวร์ที่กำหนดส่วนประกอบหลักของระบบและความสัมพันธ์ระหว่างกัน การเลือกสถาปัตยกรรมที่เหมาะสมจะส่งผลต่อ:
- 📈 ความสามารถในการขยายระบบ (Scalability)
- 🔧 การบำรุงรักษา (Maintainability)
- ⚡ ประสิทธิภาพของระบบ (Performance)

---

### 6.1.1 Monolithic Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   MONOLITHIC ARCHITECTURE                  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │              Single Application Unit                 │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │          User Interface (UI)                   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │          Business Logic                        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │          Data Access Layer                     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │             Database                           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│              All Components in ONE Package                 │
└────────────────────────────────────────────────────────────┘
```

**Monolithic Architecture** เป็นรูปแบบที่ทุกส่วนของแอปพลิเคชันถูกรวมอยู่ในโปรแกรมเดียว (Single Unit) รวมถึง UI, Business Logic, และ Data Access ทั้งหมด

#### ✅ ข้อดี:
- ✔️ พัฒนาและ Deploy ง่ายในช่วงเริ่มต้น
- ✔️ ไม่ต้องจัดการกับการสื่อสารระหว่างส่วนต่างๆ ที่ซับซ้อน
- ✔️ Testing แบบ End-to-End ทำได้ง่าย
- ✔️ Performance ดีเพราะไม่มี Network Latency ภายใน

#### ❌ ข้อเสีย:
- ✖️ ยากต่อการ Scale เพราะต้อง Scale ทั้งระบบทีเดียว
- ✖️ การแก้ไขส่วนเล็กๆ ต้อง Deploy ใหม่ทั้งหมด
- ✖️ เมื่อโค้ดเพิ่มขึ้น จะยากต่อการ Maintain และเข้าใจ
- ✖️ ทีมขนาดใหญ่ทำงานยาก เพราะทุกคนแก้ไข Codebase เดียวกัน

**ตัวอย่าง**: แอปพลิเคชัน E-Commerce แบบเล็กที่มี Frontend, Backend Logic และ Database Access รวมอยู่ในโปรเจกต์เดียว

---

### 6.1.2 Client-Server Architecture

```
┌───────────────────────────────────────────────────────────┐
│                CLIENT-SERVER ARCHITECTURE                 │
│                                                           │
│   ┌──────────────┐                    ┌────────────────┐  │
│   │   CLIENT 1   │                    │                │  │
│   │  (Browser)   │──┐                 │                │  │
│   └──────────────┘  │                 │                │  │
│                     │   HTTP/HTTPS    │                │  │
│   ┌──────────────┐  │   Request ─────▶│     SERVER     │  │
│   │   CLIENT 2   │──┤                 │                │  │
│   │ (Mobile App) │  │   ◀──── Response│  ┌──────────┐  │  │
│   └──────────────┘  │                 │  │ Business │  │  │
│                     │                 │  │  Logic   │  │  │
│   ┌──────────────┐  │                 │  └──────────┘  │  │
│   │   CLIENT 3   │──┘                 │  ┌──────────┐  │  │
│   │  (Desktop)   │                    │  │   Data   │  │  │
│   └──────────────┘                    │  │  Access  │  │  │
│                                       │  └──────────┘  │  │
│                                       │       │        │  │
│                                       │       ▼        │  │
│                                       │  ┌──────────┐  │  │
│                                       │  │ Database │  │  │
│                                       │  └──────────┘  │  │
│                                       └────────────────┘  │
│                                                           │
│      Multiple Clients  →  Single Server  →  Database      │
└───────────────────────────────────────────────────────────┘
```

**Client-Server Architecture** แบ่งระบบออกเป็น 2 ส่วนหลัก:
- **Client** (ฝั่งผู้ใช้): แสดงผล UI และส่ง Request ไปยัง Server
- **Server** (ฝั่งให้บริการ): จัดการ Business Logic และข้อมูล

#### ✅ ข้อดี:
- ✔️ แยกความรับผิดชอบระหว่าง Frontend และ Backend ชัดเจน
- ✔️ Client หลายตัว (Web, Mobile App) สามารถใช้ Server เดียวกันได้
- ✔️ Scale Client และ Server แยกจากกันได้ตามความต้องการ
- ✔️ ปลอดภัยมากขึ้น เพราะ Logic สำคัญอยู่ที่ Server

#### ❌ ข้อเสีย:
- ✖️ มี Network Latency จากการสื่อสารระหว่าง Client-Server
- ✖️ ต้องออกแบบ API ให้ดี เพื่อให้ Client และ Server สื่อสารได้
- ✖️ Server อาจเป็น Bottleneck ถ้า Request เยอะ

**ตัวอย่าง**: เว็บแอปพลิเคชันทั่วไป ที่มี React/Angular ฝั่ง Client และ Node.js/Express ฝั่ง Server พร้อม REST API สำหรับการสื่อสาร

---

### 6.1.3 Microservices Architecture (ภาพรวม)

```
┌────────────────────────────────────────────────────────────────┐
│                  MICROSERVICES ARCHITECTURE                    │
│                                                                │
│  ┌───────────┐     ┌───────────┐     ┌───────────┐             │
│  │  Client   │     │  Client   │     │  Client   │             │
│  │ (Browser) │     │  (Mobile) │     │ (Desktop) │             │
│  └─────┬─────┘     └─────┬─────┘     └─────┬─────┘             │
│        │                 │                 │                   │
│        └─────────────────┼─────────────────┘                   │
│                          │                                     │
│                    ┌─────▼──────┐                              │
│                    │  API       │                              │
│                    │  Gateway   │                              │
│                    └─────┬──────┘                              │
│                          │                                     │
│        ┌─────────────────┼────────────────┬───────────┐        │
│        │                 │                │           │        │
│   ┌────▼─────┐     ┌─────▼────┐     ┌─────▼────┐  ┌───▼────┐   │
│   │  User    │     │ Product  │     │ Payment  │  │ Notify │   │
│   │ Service  │     │ Service  │     │ Service  │  │Service │   │
│   ├──────────┤     ├──────────┤     ├──────────┤  ├────────┤   │
│   │  Logic   │     │  Logic   │     │  Logic   │  │ Logic  │   │
│   └────┬─────┘     └─────┬────┘     └─────┬────┘  └───┬────┘   │
│        │                 │                │           │        │
│   ┌────▼─────┐     ┌─────▼────┐     ┌─────▼────┐  ┌───▼────┐   │
│   │  User    │     │ Product  │     │ Payment  │  │ Notify │   │
│   │    DB    │     │    DB    │     │    DB    │  │   DB   │   │
│   └──────────┘     └──────────┘     └──────────┘  └────────┘   │
│                                                                │
│       Each Service: Independent & Self-contained               │
└────────────────────────────────────────────────────────────────┘
```

**Microservices Architecture** แบ่งแอปพลิเคชันออกเป็นบริการเล็กๆ (Services) หลายตัวที่ทำงานอิสระจากกัน แต่ละ Service มีหน้าที่เฉพาะทาง (Single Responsibility) และสื่อสารกันผ่าน API

#### ✅ ข้อดี:
- ✔️ Scale แต่ละ Service แยกจากกันได้ตามความต้องการ
- ✔️ ทีมสามารถพัฒนาและ Deploy Service แต่ละตัวอิสระจากกัน
- ✔️ ใช้เทคโนโลยีที่แตกต่างกันในแต่ละ Service ได้
- ✔️ ถ้า Service ตัวหนึ่ง Fail จะไม่กระทบทั้งระบบ (Fault Isolation)

#### ❌ ข้อเสีย:
- ✖️ ความซับซ้อนในการจัดการ: ต้องจัดการ Services หลายตัว
- ✖️ การสื่อสารระหว่าง Services ผ่าน Network ทำให้มี Latency
- ✖️ ต้องมีระบบ Monitoring และ Logging ที่ดีเพื่อติดตามปัญหา
- ✖️ Testing แบบ End-to-End ทำได้ยากกว่า Monolithic

**ตัวอย่าง**: Netflix, Amazon ที่แบ่งระบบเป็น Services เล็กๆ เช่น User Service, Payment Service, Recommendation Service ซึ่งแต่ละ Service มี Database และทีมพัฒนาของตัวเอง

---

### 📊 ตารางเปรียบเทียบสถาปัตยกรรมซอฟต์แวร์

| ปัจจัย | 🏢 Monolithic | 🔄 Client-Server | 🎯 Microservices |
|--------|--------------|------------------|------------------|
| **ความซับซ้อน** | ต่ำ | ปานกลาง | สูง |
| **การ Scale** | Scale ทั้งระบบ | Scale แยก Client/Server | Scale แยกแต่ละ Service |
| **การ Deploy** | Deploy ทั้งหมด | Deploy แยก Client/Server | Deploy แยกแต่ละ Service |
| **เหมาะกับ** | โปรเจกต์เล็ก/ทีมเล็ก | โปรเจกต์ขนาดกลาง | โปรเจกต์ขนาดใหญ่/องค์กร |
| **ทีมพัฒนา** | ทีมเดียวกัน | แยกทีม Frontend/Backend | แยกทีมแต่ละ Service |
| **Technology Stack** | หนึ่งเดียว | Frontend + Backend แยกได้ | แต่ละ Service เลือกได้อิสระ |
| **การบำรุงรักษา** | ยากเมื่อระบบใหญ่ | ปานกลาง | ง่าย (แยกชัดเจน) |

```
┌────────────────────────────────────────────────────────────────┐
│  💡 สรุป                                                        │
│  ─────                                                         │
│  การเลือกสถาปัตยกรรมขึ้นอยู่กับ:                                      │
│  • ขนาดโปรเจกต์                                                 │
│  • ขนาดทีม                                                      │
│  • ความต้องการในการขยายระบบ                                     │
│                                                                │
│  🎓 สำหรับรายวิชานี้ เราจะใช้ Client-Server Architecture            │
│     เป็นหลัก                                                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 6.2 แนะนำ Design Patterns เบื้องต้น

```
╔═══════════════════════════════════════════════════════════════╗
║  🎨 Design Patterns Introduction                              ║
╚═══════════════════════════════════════════════════════════════╝
```

**Design Patterns** คือแนวทางหรือ Template ที่ใช้แก้ปัญหาทั่วไปในการออกแบบซอฟต์แวร์ ไม่ใช่โค้ดสำเร็จรูป แต่เป็นแนวคิดที่สามารถนำไปประยุกต์ใช้ได้ในหลายสถานการณ์

### 🎯 Design Patterns ช่วยให้:
- ✅ โค้ดอ่านง่าย เข้าใจง่าย (Readable)
- ✅ บำรุงรักษาได้ง่าย (Maintainable)
- ✅ ขยายได้ง่าย (Extensible)
- ✅ นำกลับมาใช้ใหม่ได้ (Reusable)

---

### 6.2.1 Layered Architecture Pattern (การแบ่งเลเยอร์)

```
┌─────────────────────────────────────────────────────────────┐
│              LAYERED ARCHITECTURE PATTERN                   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Layer 1: PRESENTATION LAYER (UI)                     │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  • HTML/CSS                                      │ │  │
│  │  │  • React Components                              │ │  │
│  │  │  • User Interaction                              │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────┬──────────────────────────────────────┘  │
│                   │ API Calls                               │
│                   ▼                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Layer 2: BUSINESS LOGIC LAYER                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  • Express Routes                                │ │  │
│  │  │  • Controllers                                   │ │  │
│  │  │  • Business Rules                                │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────┬──────────────────────────────────────┘  │
│                   │ Data Operations                         │
│                   ▼                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Layer 3: DATA ACCESS LAYER                           │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  • Database Queries                              │ │  │
│  │  │  • ORM/ODM                                       │ │  │
│  │  │  • File System Access                            │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────┬──────────────────────────────────────┘  │
│                   │ CRUD                                    │
│                   ▼                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Layer 4: DATABASE LAYER                              │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  • MongoDB                                       │ │  │
│  │  │  • MySQL / PostgreSQL                            │ │  │
│  │  │  • JSON Files                                    │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ☝️  Each layer communicates only with adjacent layers      │
└─────────────────────────────────────────────────────────────┘
```

**Layered Architecture Pattern** แบ่งระบบออกเป็นชั้น (Layers) ตามหน้าที่ความรับผิดชอบ โดยแต่ละเลเยอร์จะสื่อสารกับเลเยอร์ที่อยู่ติดกันเท่านั้น

| Layer | หน้าที่ | ตัวอย่าง |
|-------|---------|----------|
| **Presentation Layer** | แสดงผล UI และรับ Input | HTML, CSS, React, Angular |
| **Business Logic Layer** | ประมวลผล Logic ของระบบ | Express Routes, Controllers |
| **Data Access Layer** | เข้าถึงและจัดการข้อมูล | Database Queries, ORM |
| **Database Layer** | เก็บข้อมูล | MongoDB, MySQL, PostgreSQL |

```
┌────────────────────────────────────────────────────────────────┐
│  💡 ข้อดี                                                        │
│  ────                                                          │
│  ✓ แยกความรับผิดชอบชัดเจน                                         │
│  ✓ แก้ไข/ทดสอบแต่ละเลเยอร์แยกกันได้                                 │
│  ✓ โค้ดเป็นระเบียบและบำรุงรักษาง่าย                                  │
│  ✓ เปลี่ยนเทคโนโลยีในแต่ละเลเยอร์ได้โดยไม่กระทบเลเยอร์อื่น               │
└────────────────────────────────────────────────────────────────┘
```

---

### 6.2.2 MVC Pattern (Model-View-Controller)

```
┌──────────────────────────────────────────────────────────────┐
│                    MVC PATTERN FLOW                          │
│                                                              │
│                 ┌──────────────────┐                         │
│                 │      USER        │                         │
│                 │   (Browser)      │                         │
│                 └────────┬─────────┘                         │
│                          │                                   │
│                    1. Request                                │
│                          │                                   │
│                          ▼                                   │
│            ┌──────────────────────────┐                      │
│            │     CONTROLLER           │                      │
│            │  ┌────────────────────┐  │                      │
│            │  │ • Receives Request │  │                      │
│            │  │ • Process Logic    │  │                      │
│            │  │ • Routes to Model  │  │                      │
│            │  └────────────────────┘  │                      │
│            └──────┬──────────┬────────┘                      │
│                   │          │                               │
│           2. Get  │          │ 4. Send                       │
│              Data │          │    Data                       │
│                   ▼          ▼                               │
│     ┌──────────────────┐  ┌──────────────────┐               │
│     │     MODEL        │  │      VIEW        │               │
│     │  ┌────────────┐  │  │  ┌────────────┐  │               │
│     │  │ • Data     │  │  │  │ • HTML     │  │               │
│     │  │ • Business │  │  │  │ • Template │  │               │
│     │  │   Logic    │  │  │  │ • UI       │  │               │
│     │  └────────────┘  │  │  └────────────┘  │               │
│     └────────┬─────────┘  └──────────┬───────┘               │
│              │                       │                       │
│      3. Returns Data          5. Renders View                │
│              │                       │                       │
│              └───────────────────────┘                       │
│                          │                                   │
│                  6. Response                                 │
│                          │                                   │
│                          ▼                                   │
│                 ┌──────────────────┐                         │
│                 │      USER        │                         │
│                 │   (Browser)      │                         │
│                 └──────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

**MVC Pattern** แบ่งโค้ดออกเป็น 3 ส่วน:

| ส่วนประกอบ | หน้าที่ | ตัวอย่างใน Express |
|-----------|---------|-------------------|
| **Model** | จัดการข้อมูลและ Business Logic | Database Schema, Data Models |
| **View** | แสดงผล UI ให้ผู้ใช้เห็น | HTML Templates, React Components |
| **Controller** | รับ Request และควบคุมการทำงาน | Express Routes, Controllers |

#### 🔄 Flow การทำงาน:
1. **User** ส่ง Request มาที่ **Controller**
2. **Controller** เรียกใช้ **Model** เพื่อดึงหรือบันทึกข้อมูล
3. **Model** ส่งข้อมูลกลับไปที่ **Controller**
4. **Controller** ส่งข้อมูลไปให้ **View** แสดงผล
5. **View** ส่ง Response กลับไปหา **User**

---

### 6.2.3 Repository Pattern (เบื้องต้น)

```
┌──────────────────────────────────────────────────────────────┐
│                    REPOSITORY PATTERN                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            APPLICATION / BUSINESS LOGIC                │  │
│  │                                                        │  │
│  │   "I need user data, but I don't care where it         │  │
│  │    comes from (DB, API, Cache, File...)"               │  │
│  └──────────────────────┬─────────────────────────────────┘  │
│                         │                                    │
│                         │ Call Methods:                      │
│                         │ • findAll()                        │
│                         │ • findById(id)                     │
│                         │ • create(data)                     │
│                         │ • update(id, data)                 │
│                         │ • delete(id)                       │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              REPOSITORY LAYER                           │ │
│  │                                                         │ │
│  │     Abstract interface between app and data source      │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │                                    │
│                         │ Implements actual                  │
│                         │ data operations                    │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              DATA SOURCE                                │ │
│  │                                                         │ │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │   │ Database │  │   API    │  │   File   │              │ │
│  │   └──────────┘  └──────────┘  └──────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Repository Pattern** แยกส่วน Data Access Logic ออกจาก Business Logic โดยสร้างชั้น Repository ที่ทำหน้าที่เป็นตัวกลางระหว่าง Application กับ Database

#### 💡 ประโยชน์:
- ✅ แยก Business Logic ออกจาก Data Access
- ✅ เปลี่ยน Database ได้ง่ายโดยไม่กระทบ Business Logic
- ✅ ทดสอบได้ง่าย เพราะสามารถ Mock Repository ได้

```
┌────────────────────────────────────────────────────────────────┐
│  📌 หมายเหตุ                                                    │
│  ─────────                                                     │
│  ในสัปดาห์นี้เราจะเน้นไปที่แนวคิดและการประยุกต์ใช้                        │
│  Layered Architecture เป็นหลัก                                   │
│                                                                │
│  Design Patterns อื่นๆ จะได้เรียนรู้เพิ่มเติมในสัปดาห์ต่อไป                │
└────────────────────────────────────────────────────────────────┘
```

---

## 6.3 Node.js และ Express Framework พื้นฐาน

```
╔═══════════════════════════════════════════════════════════════╗
║  🟢 Node.js & Express Framework Basics                        ║
╚═══════════════════════════════════════════════════════════════╝
```

### 6.3.1 Node.js คืออะไร?

```
┌──────────────────────────────────────────────────────────────┐
│                      WHAT IS NODE.JS?                        │
│                                                              │
│   ┌───────────────────────────────────────────────────────┐  │
│   │                                                       │  │
│   │        JavaScript Runtime Environment                 │  │
│   │                                                       │  │
│   │   ┌─────────────────────────────────────────────┐     │  │
│   │   │     V8 JavaScript Engine (from Chrome)      │     │  │
│   │   └─────────────────────────────────────────────┘     │  │
│   │                                                       │  │
│   │   JavaScript can run OUTSIDE the browser! ✨          │  │
│   │                                                       │  │
│   └───────────────────────────────────────────────────────┘  │
│                                                              │
│   Browser                         Server                     │
│   ┌─────────────┐                ┌─────────────┐             │
│   │ JavaScript  │                │ JavaScript  │             │
│   │ in Browser  │      VS        │ with NodeJS │             │
│   │             │                │             │             │
│   │ • DOM       │                │ • File I/O  │             │
│   │ • Window    │                │ • Network   │             │
│   │ • Events    │                │ • Database  │             │
│   └─────────────┘                └─────────────┘             │
└──────────────────────────────────────────────────────────────┘
```

**Node.js** คือ JavaScript Runtime Environment ที่สร้างจาก V8 JavaScript Engine ของ Google Chrome ทำให้เราสามารถเขียนและรัน JavaScript นอก Browser (ฝั่ง Server) ได้

#### ✨ คุณสมบัติเด่นของ Node.js:

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 Asynchronous & Non-blocking I/O                         │
│  ─────────────────────────────────────────                  │
│  ทำงานได้หลายอย่างพร้อมกันโดยไม่ต้องรอ                            │
│  เหมาะกับ Real-time Applications                             │
│                                                             │
│  Traditional (Blocking):    Node.js (Non-blocking):         │
│  Request 1 ─→ Process ─→    Request 1 ─┐                    │
│  Request 2 ─→ ⏳ Wait ─→    Request 2 ─┼─→ Process All      │
│  Request 3 ─→ ⏳ Wait ─→    Request 3 ─┘    Concurrently    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔄 Single-threaded with Event Loop                         │
│  ──────────────────────────────────                         │
│  ใช้ Thread เดียว แต่จัดการ Request ได้หลายตัวพร้อมกัน              │
│                                                             │
│     ┌──────────────────────────────────────┐                │
│     │         Event Loop                   │                │
│     │  ┌────────────────────────────────┐  │                │
│     │  │  Constantly checking for:      │  │                │
│     │  │  • New requests                │  │                │
│     │  │  • Completed operations        │  │                │
│     │  │  • Callbacks to execute        │  │                │
│     │  └────────────────────────────────┘  │                │
│     └──────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📦 NPM (Node Package Manager)                              │
│  ────────────────────────────                               │
│  มี Library และ Package มากมายให้เลือกใช้งาน                    │
│  (มากที่สุดในโลก - 2 ล้าน+ packages)                            │
│                                                             │
│  npm install <package-name>                                 │
│  └─→ Downloads & installs package automatically             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  💻 Cross-platform                                          │
│  ────────────────                                           │
│  รันได้บน Windows, macOS, Linux                               │
└─────────────────────────────────────────────────────────────┘
```

#### 🎯 ใช้งาน Node.js ได้อะไรบ้าง:
- ✅ สร้าง REST API Servers
- ✅ Real-time Applications (Chat, Game, Collaboration Tools)
- ✅ Microservices
- ✅ Command-line Tools
- ✅ Desktop Applications (Electron)
- ✅ IoT (Internet of Things)

---

### 6.3.2 Express.js คืออะไร?

```
┌────────────────────────────────────────────────────────────┐
│                     WHAT IS EXPRESS.JS?                    │
│                                                            │
│         "Fast, unopinionated, minimalist web framework     │
│                   for Node.js"                             │
│                                                            │
│   ┌──────────────────────────────────────────────────────┐ │
│   │              Express.js Framework                    │ │
│   │                                                      │ │
│   │    Makes building web servers & APIs EASY! 🚀        │ │
│   │                                                      │ │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │ │
│   │  │  Routing   │  │Middleware  │  │Error Handling  │  │ │
│   │  └────────────┘  └────────────┘  └────────────────┘  │ │
│   │                                                      │ │
│   └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                           ▼                                │
│   ┌──────────────────────────────────────────────────────┐ │
│   │              Node.js Runtime                         │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Without Express:           With Express:                  │
│  ──────────────────         ─────────────                  │
│  • Complex code             • Simple & clean               │
│  • Manual routing           • Easy routing                 │
│  • Hard to maintain         • Easy to maintain             │
└────────────────────────────────────────────────────────────┘
```

**Express.js** คือ Web Application Framework ที่เป็นที่นิยมมากที่สุดสำหรับ Node.js ช่วยให้การสร้าง Web Server และ API ทำได้ง่ายและรวดเร็วขึ้น

#### ✨ คุณสมบัติของ Express:

| Feature | คำอธิบาย |
|---------|----------|
| **🛣️ Routing** | กำหนด URL paths และ HTTP methods (GET, POST, PUT, DELETE) |
| **⚙️ Middleware** | Function ที่ทำงานระหว่าง Request และ Response (เช่น Authentication, Logging) |
| **📄 Template Engines** | รองรับการสร้าง Dynamic HTML (EJS, Pug, Handlebars) |
| **❌ Error Handling** | จัดการ Error ได้ง่ายและเป็นระบบ |

---

### 6.3.3 ติดตั้ง Node.js และสร้างโปรเจกต์ Express

#### ขั้นตอนที่ 1: ติดตั้ง Node.js

```bash
# 1. ดาวน์โหลดจาก https://nodejs.org (แนะนำ LTS Version)
# 2. ติดตั้งตาม Wizard
```

#### ขั้นตอนที่ 2: ตรวจสอบการติดตั้ง

```bash
node --version
# Output: v20.x.x (หรือเวอร์ชันที่ติดตั้ง)

npm --version
# Output: 10.x.x (หรือเวอร์ชันที่ติดตั้ง)
```

#### ขั้นตอนที่ 3: สร้างโปรเจกต์ใหม่

```bash
# สร้างโฟลเดอร์โปรเจกต์
mkdir my-express-app
cd my-express-app

# สร้าง package.json
npm init -y
```

#### ขั้นตอนที่ 4: ติดตั้ง Express

```bash
npm install express
```

#### 📁 โครงสร้างโปรเจกต์:

```
my-express-app/
├── node_modules/       # ไลบรารีที่ติดตั้ง (อย่าแก้ไข)
├── package.json        # ข้อมูลโปรเจกต์และ dependencies
├── package-lock.json   # Lock versions ของ packages
└── server.js           # ไฟล์หลักของเรา (จะสร้างในขั้นตอนถัดไป)
```

---

### 6.3.4 สร้าง Express Server แรก

สร้างไฟล์ `server.js`:

```javascript
// นำเข้า Express
const express = require('express');

// สร้าง Application
const app = express();

// กำหนด Port
const PORT = 3000;

// สร้าง Route แรก
app.get('/', (req, res) => {
  res.send('Hello World from Express! 🚀');
});

// เริ่ม Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
```

#### รันโปรแกรม:

```bash
node server.js

# Output:
# ✅ Server is running on http://localhost:3000
```

เปิด Browser และไปที่ **http://localhost:3000** จะเห็นข้อความ "Hello World from Express! 🚀"

---

### 📖 อธิบายโค้ด:

```
┌──────────────────────────────────────────────────────────────┐
│  CODE EXPLANATION                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  const express = require('express');                         │
│  └─→ นำเข้า Express module                                    │
│                                                              │
│  const app = express();                                      │
│  └─→ สร้าง Express application instance                       │
│                                                              │
│  app.get('/', (req, res) => { ... });                        │
│  └─→ กำหนด Route สำหรับ HTTP GET method ที่ path '/'            │
│                                                              │
│  req (request)                                               │
│  └─→ Object ที่เก็บข้อมูล Request จาก Client                      │
│                                                              │
│  res (response)                                              │
│  └─→ Object ที่ใช้ส่ง Response กลับไปหา Client                    │
│                                                              │
│  res.send()                                                  │
│  └─→ ส่งข้อมูลกลับไปหา Client                                    │
│                                                              │
│  app.listen(PORT, callback)                                  │
│  └─→ เริ่ม Server ที่ Port ที่กำหนด                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.3.6 HTTP Methods และ Routes

Express รองรับ HTTP Methods หลักๆ ดังนี้:

```
┌────────────────────────────────────────────────────────────────┐
│                    HTTP METHODS & ROUTES                       │
├────────┬──────────────────────┬────────────────────────────────┤
│ Method │ ใช้งาน                │ ตัวอย่าง Route                   │
├────────┼──────────────────────┼────────────────────────────────┤
│  GET   │ ดึงข้อมูล               │ app.get('/users', ...)         │
│  POST  │ สร้างข้อมูลใหม่          │ app.post('/users', ...)        │
│  PUT   │ อัปเดตข้อมูลทั้งหมด       │ app.put('/users/:id', ...)     │
│ PATCH  │ อัปเดตข้อมูลบางส่วน      │ app.patch('/users/:id', ...)   │
│ DELETE │ ลบข้อมูล               │ app.delete('/users/:id', ...)  │
└────────┴──────────────────────┴────────────────────────────────┘
```

#### ตัวอย่างการสร้าง Routes หลายตัว:

```javascript
// GET - ดึงรายการทั้งหมด
app.get('/api/products', (req, res) => {
  res.json({ 
    message: 'Get all products',
    data: []
  });
});

// GET - ดึงรายการเดียวตาม ID
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  res.json({ 
    message: `Get product with ID: ${id}`,
    data: { id: id, name: 'Sample Product' }
  });
});

// POST - สร้างรายการใหม่
app.post('/api/products', (req, res) => {
  res.json({ 
    message: 'Create new product',
    status: 'success'
  });
});

// PUT - อัปเดตรายการ
app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  res.json({ 
    message: `Update product with ID: ${id}`,
    status: 'success'
  });
});

// DELETE - ลบรายการ
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  res.json({ 
    message: `Delete product with ID: ${id}`,
    status: 'success'
  });
});
```

```
┌──────────────────────────────────────────────────────────────┐
│  📍 Route Parameters                                         │
│  ──────────────────                                          │
│                                                              │
│  /api/products/:id  ← :id คือ parameter                       │
│                                                              │
│  เมื่อเรียก: GET /api/products/123                              │
│  req.params.id จะได้ค่า "123"                                  │
│                                                              │
│  เมื่อเรียก: GET /api/products/abc                              │
│  req.params.id จะได้ค่า "abc"                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6.4 การอ่านและเขียนไฟล์ JSON ด้วย Node.js

```
╔═══════════════════════════════════════════════════════════════╗
║  📄 Working with JSON Files in Node.js                        ║
╚═══════════════════════════════════════════════════════════════╝
```

### 6.4.1 JSON คืออะไร?

```
┌──────────────────────────────────────────────────────────────┐
│            JSON (JavaScript Object Notation)                 │
│                                                              │
│  "A lightweight data-interchange format"                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  {                                                     │  │
│  │    "products": [                                       │  │
│  │      {                                                 │  │
│  │        "id": 1,                                        │  │
│  │        "name": "Laptop",                               │  │
│  │        "price": 25000,                                 │  │
│  │        "inStock": true                                 │  │
│  │      },                                                │  │
│  │      {                                                 │  │
│  │        "id": 2,                                        │  │
│  │        "name": "Mouse",                                │  │
│  │        "price": 350,                                   │  │
│  │        "inStock": false                                │  │
│  │      }                                                 │  │
│  │    ]                                                   │  │
│  │  }                                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ✨ คุณสมบัติ:                                                  │
│  • ใช้คู่ "key": "value"                                        │
│  • รองรับ: String, Number, Boolean, Array, Object, null       │
│  • เป็นข้อความ (Text) ที่อ่านและเขียนได้ง่าย                         │
│  • ใช้ได้กับทุกภาษาโปรแกรม                                       │
│  • เป็นมาตรฐานสำหรับ Web APIs                                  │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.4.2 อ่านไฟล์ JSON ใน Node.js

สร้างไฟล์ `data.json`:

```json
{
  "products": [
    { "id": 1, "name": "Laptop", "price": 25000 },
    { "id": 2, "name": "Mouse", "price": 350 },
    { "id": 3, "name": "Keyboard", "price": 1200 }
  ]
}
```

#### 📖 วิธีที่ 1: ใช้ `require()` (Synchronous - ง่ายที่สุด)

```javascript
const data = require('./data.json');
console.log(data.products);
```

```
┌────────────────────────────────────────────────────────────┐
│  ✅ ข้อดี: ง่าย, อ่านได้ทันที                                     │
│  ❌ ข้อเสีย: ไม่สามารถอ่านไฟล์ที่เปลี่ยนแปลงได้                      │
│             (cache อยู่ใน memory)                            │
└────────────────────────────────────────────────────────────┘
```

#### 📖 วิธีที่ 2: ใช้ `fs.readFileSync()` (Synchronous)

```javascript
const fs = require('fs');

// อ่านไฟล์
const rawData = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(rawData);
console.log(data.products);
```

```
┌────────────────────────────────────────────────────────────┐
│  ✅ ข้อดี: อ่านไฟล์ล่าสุดได้, เหมาะกับ script เล็กๆ                 │
│  ❌ ข้อเสีย: Blocking - หยุดรอจนกว่าจะอ่านเสร็จ                  │
│             (ไม่เหมาะกับ production server)                  │
└────────────────────────────────────────────────────────────┘
```

#### 📖 วิธีที่ 3: ใช้ `fs.readFile()` (Asynchronous - แนะนำ)

```javascript
const fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  const jsonData = JSON.parse(data);
  console.log(jsonData.products);
});

console.log('This runs immediately!');
```

```
┌────────────────────────────────────────────────────────────┐
│  ✅ ข้อดี: Non-blocking, เหมาะกับ production                  │
│  ✅ การทำงาน:                                              │
│                                                            │
│     Start Reading File ──┐                                 │
│           │              │                                 │
│           │          (Background)                          │
│           │              │                                 │
│     Continue other ──────┤                                 │
│     tasks...             │                                 │
│           │              │                                 │
│           │          File Ready!                           │
│           │              │                                 │
│           └──────────────▼                                 │
│                    Execute Callback                        │
└────────────────────────────────────────────────────────────┘
```

---

### 6.4.3 เขียนไฟล์ JSON ใน Node.js

#### ✍️ วิธีที่ 1: ใช้ `fs.writeFileSync()` (Synchronous)

```javascript
const fs = require('fs');

const newData = {
  products: [
    { id: 1, name: "Laptop", price: 25000 },
    { id: 4, name: "Monitor", price: 8000 }
  ]
};

// แปลง Object เป็น JSON String
const jsonString = JSON.stringify(newData, null, 2);

// เขียนลงไฟล์
fs.writeFileSync('data.json', jsonString);
console.log('✅ Data saved successfully!');
```

#### ✍️ วิธีที่ 2: ใช้ `fs.writeFile()` (Asynchronous - แนะนำ)

```javascript
const fs = require('fs');

const newData = {
  products: [
    { id: 1, name: "Laptop", price: 25000 },
    { id: 4, name: "Monitor", price: 8000 }
  ]
};

const jsonString = JSON.stringify(newData, null, 2);

fs.writeFile('data.json', jsonString, (err) => {
  if (err) {
    console.error('❌ Error writing file:', err);
    return;
  }
  console.log('✅ Data saved successfully!');
});
```

```
┌────────────────────────────────────────────────────────────┐
│  💡 JSON.stringify() Parameters                            │
│  ─────────────────────────────                             │
│                                                            │
│  JSON.stringify(data, replacer, space)                     │
│                  │         │       │                       │
│                  │         │       └─→ Indentation (2)     │
│                  │         └─→ Filter (null = all)         │
│                  └─→ Data to convert                       │
│                                                            │
│  ตัวอย่าง:                                                   │
│  JSON.stringify(obj, null, 2)                              │
│  • null = เอาทุก property                                   │
│  • 2 = indent ด้วย 2 spaces (ให้อ่านง่าย)                      │
└────────────────────────────────────────────────────────────┘
```

---

### 6.4.4 สร้าง Express API สำหรับอ่านและเขียน JSON

```
┌──────────────────────────────────────────────────────────────┐
│              COMPLETE EXPRESS API EXAMPLE                    │
│              with JSON File Storage                          │
└──────────────────────────────────────────────────────────────┘
```

#### 📝 server.js (Full Code):

```javascript
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware สำหรับ parse JSON body
app.use(express.json());

// 🟢 GET - อ่านข้อมูลทั้งหมด
app.get('/api/products', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    res.json(jsonData.products);
  });
});

// 🟢 GET - อ่านข้อมูลตาม ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    const product = jsonData.products.find(p => p.id === id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ 
        error: 'Product not found' 
      });
    }
  });
});

// 🔵 POST - เพิ่มข้อมูลใหม่
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    
    // สร้าง ID ใหม่
    newProduct.id = jsonData.products.length > 0 
      ? Math.max(...jsonData.products.map(p => p.id)) + 1 
      : 1;
    
    jsonData.products.push(newProduct);
    
    // บันทึกกลับลงไฟล์
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile('data.json', jsonString, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error writing file' 
        });
      }
      res.status(201).json(newProduct);
    });
  });
});

// 🟠 PUT - อัปเดตข้อมูล
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    const index = jsonData.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }
    
    // อัปเดตข้อมูล
    jsonData.products[index] = { 
      ...jsonData.products[index], 
      ...updatedData, 
      id 
    };
    
    // บันทึกกลับลงไฟล์
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile('data.json', jsonString, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error writing file' 
        });
      }
      res.json(jsonData.products[index]);
    });
  });
});

// 🔴 DELETE - ลบข้อมูล
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    const index = jsonData.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }
    
    // ลบข้อมูล
    jsonData.products.splice(index, 1);
    
    // บันทึกกลับลงไฟล์
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile('data.json', jsonString, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error writing file' 
        });
      }
      res.json({ 
        message: 'Product deleted successfully' 
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

```
┌──────────────────────────────────────────────────────────────┐
│  📊 HTTP Status Codes ที่ใช้:                                   │
│                                                              │
│  200 OK           - Request สำเร็จ (GET, PUT)                 │
│  201 Created      - สร้างข้อมูลสำเร็จ (POST)                     │
│  404 Not Found    - ไม่พบข้อมูล                                 │
│  500 Server Error - เกิดข้อผิดพลาดที่ Server                      │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.4.5 ทดสอบ API

```
╔══════════════════════════════════════════════════════════════╗
║  🧪 TESTING YOUR API                                         ║
╚══════════════════════════════════════════════════════════════╝
```

#### 1️⃣ ทดสอบด้วย Browser (GET เท่านั้น):

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│  ───────                                                    │
│                                                             │
│  URL: http://localhost:3000/api/products                    │
│                                                             │
│  Result:                                                    │
│  [                                                          │
│    { "id": 1, "name": "Laptop", "price": 25000 },           │
│    { "id": 2, "name": "Mouse", "price": 350 },              │
│    { "id": 3, "name": "Keyboard", "price": 1200 }           │
│  ]                                                          │
│                                                             │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  URL: http://localhost:3000/api/products/1                  │
│                                                             │
│  Result:                                                    │
│  { "id": 1, "name": "Laptop", "price": 25000 }              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2️⃣ ทดสอบด้วย Postman (ทุก HTTP Methods):

```
┌─────────────────────────────────────────────────────────────┐
│  POSTMAN Testing Guide                                      │
├────────┬─────────────────────────────┬──────────────────────┤
│ Method │ URL                         │ Body (JSON)          │
├────────┼─────────────────────────────┼──────────────────────┤
│  GET   │ /api/products               │ -                    │
│  GET   │ /api/products/1             │ -                    │
│  POST  │ /api/products               │ {                    │
│        │                             │   "name": "Webcam",  │
│        │                             │   "price": 2500      │
│        │                             │ }                    │
│  PUT   │ /api/products/1             │ {                    │
│        │                             │   "price": 24000     │
│        │                             │ }                    │
│ DELETE │ /api/products/1             │ -                    │
└────────┴─────────────────────────────┴──────────────────────┘
```

#### 3️⃣ ทดสอบด้วย fetch() จาก HTML/JavaScript:

```html
<!DOCTYPE html>
<html>
<head>
  <title>API Test</title>
</head>
<body>
  <h1>Products</h1>
  <div id="products"></div>
  <button onclick="loadProducts()">Load Products</button>
  <button onclick="addProduct()">Add Product</button>

  <script>
    // 🟢 GET - ดึงข้อมูล
    function loadProducts() {
      fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          document.getElementById('products').innerHTML = 
            JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error:', error));
    }

    // 🔵 POST - เพิ่มข้อมูล
    function addProduct() {
      fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Headphones',
          price: 1500
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Added:', data);
          loadProducts();
        })
        .catch(error => console.error('Error:', error));
    }
  </script>
</body>
</html>
```

#### ⚠️ แก้ไขปัญหา CORS:

```
┌─────────────────────────────────────────────────────────────┐
│  CORS ERROR?                                                │
│  ──────────                                                 │
│                                                             │
│  เมื่อเรียก API จาก Frontend ที่รันคนละ Port                      │
│  อาจเจอปัญหา CORS (Cross-Origin Resource Sharing)            │
│                                                             │
│  🔧 วิธีแก้:                                                   │
│                                                             │
│  1. ติดตั้ง cors middleware:                                   │
│     npm install cors                                        │
│                                                             │
│  2. เพิ่มในโค้ด server.js:                                     │
│     const cors = require('cors');                           │
│     app.use(cors());                                        │
│                                                             │
│  3. รันใหม่:                                                  │
│     node server.js                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Workshop: สร้าง Express API สำหรับ Term Project (3 ชั่วโมง)

```
╔══════════════════════════════════════════════════════════════╗
║  🎯 WORKSHOP OBJECTIVES                                      ║
║  ─────────────────────                                       ║
║  สร้าง Backend API สำหรับ Term Project โดยใช้:                  ║
║  • Node.js/Express                                           ║
║  • JSON file สำหรับจัดเก็บข้อมูล                                  ║
║  • เชื่อมต่อกับ Frontend ที่มีอยู่                                    ║
╚══════════════════════════════════════════════════════════════╝
```

### ส่วนที่ 1: ตั้งค่าโปรเจกต์และสร้าง Express Server (30 นาที)

#### 📝 ขั้นตอน:

1. **สร้างโฟลเดอร์ `backend` ในโปรเจกต์ Term Project**

```bash
cd your-term-project
mkdir backend
cd backend
```

2. **ตั้งค่า npm และติดตั้ง dependencies**

```bash
npm init -y
npm install express cors
npm install --save-dev nodemon
```

3. **แก้ไข `package.json` เพิ่ม scripts**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

4. **สร้างไฟล์ `server.js` พร้อมโค้ดเริ่มต้น**

```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running! 🚀' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

5. **สร้างไฟล์ `data.json`** (ตาม Domain ของโปรเจกต์)

ตัวอย่าง (แทน `items` ด้วย resource ของโปรเจกต์):

```json
{
  "items": []
}
```

6. **ทดสอบรัน Server**

```bash
npm run dev

# Output:
# ✅ Server running on http://localhost:3000
```

เปิด Browser ไปที่ http://localhost:3000 ควรเห็น:
```json
{ "message": "API Server is running! 🚀" }
```

```
┌─────────────────────────────────────────────────────────────┐
│  📁 โครงสร้างโปรเจกต์:                                        │
│                                                             │
│  your-term-project/                                         │
│  ├── frontend/              (HTML/CSS/JS ที่มีอยู่)              │
│  │   ├── index.html                                         │
│  │   ├── style.css                                          │
│  │   └── script.js                                          │
│  │                                                          │
│  └── backend/               (ใหม่ - สร้างในวันนี้)               │
│      ├── node_modules/                                      │
│      ├── data.json                                          │
│      ├── server.js                                          │
│      ├── package.json                                       │
│      └── package-lock.json                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### ส่วนที่ 2: สร้าง Routes สำหรับ CRUD Operations (90 นาที)

```
┌─────────────────────────────────────────────────────────────┐
│  📝 CRUD Routes to Implement                                │
├────────┬──────────────────┬─────────────────────────────────┤
│ Method │ Path             │ ความหมาย                        │
├────────┼──────────────────┼─────────────────────────────────┤
│  GET   │ /api/items       │ ดึงรายการทั้งหมด                   │
│  GET   │ /api/items/:id   │ ดึงรายการตาม ID                  │
│  POST  │ /api/items       │ สร้างรายการใหม่                   │
│  PUT   │ /api/items/:id   │ อัปเดตรายการ                     │
│ DELETE │ /api/items/:id   │ ลบรายการ                        │
└────────┴──────────────────┴─────────────────────────────────┘

💡 หมายเหตุ: แทน 'items' ด้วย Resource ที่เหมาะกับโปรเจกต์
   เช่น: tasks, products, posts, bookings, etc.
```

#### แก้ไข `server.js` เพิ่ม CRUD routes:

```javascript
// ... (existing code)

// Helper function to read data
function readData() {
  const rawData = fs.readFileSync('data.json', 'utf8');
  return JSON.parse(rawData);
}

// Helper function to write data
function writeData(data) {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync('data.json', jsonString);
}

// 🟢 GET all items
app.get('/api/items', (req, res) => {
  try {
    const data = readData();
    res.json(data.items);
  } catch (error) {
    res.status(500).json({ error: 'Error reading data' });
  }
});

// 🟢 GET item by ID
app.get('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    const item = data.items.find(i => i.id === id);
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error reading data' });
  }
});

// 🔵 POST new item
app.post('/api/items', (req, res) => {
  try {
    const data = readData();
    const newItem = req.body;
    
    // Generate new ID
    newItem.id = data.items.length > 0
      ? Math.max(...data.items.map(i => i.id)) + 1
      : 1;
    
    data.items.push(newItem);
    writeData(data);
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error creating item' });
  }
});

// 🟠 PUT update item
app.put('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.items.findIndex(i => i.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    data.items[index] = { ...data.items[index], ...req.body, id };
    writeData(data);
    
    res.json(data.items[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

// 🔴 DELETE item
app.delete('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.items.findIndex(i => i.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    data.items.splice(index, 1);
    writeData(data);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// ... (server listen)
```

---

### ส่วนที่ 3: ทดสอบ API ด้วย Postman (30 นาที)

```
┌─────────────────────────────────────────────────────────────┐
│  🧪 TESTING CHECKLIST                                       │
├─────────────────────────────────────────────────────────────┤
│  □ ติดตั้ง Postman                                             │
│  □ สร้าง Collection ใหม่สำหรับโปรเจกต์                          │
│  □ ทดสอบ GET all items                                      │
│  □ ทดสอบ POST create new item                               │
│  □ ทดสอบ GET item by ID                                     │
│  □ ทดสอบ PUT update item                                    │
│  □ ทดสอบ DELETE item                                        │
│  □ ตรวจสอบ data.json ว่าข้อมูลถูกบันทึกถูกต้อง                      │
│  □ ทดสอบ Error Cases (ID ไม่มี, ข้อมูลไม่ครบ)                    │
└─────────────────────────────────────────────────────────────┘
```

#### 🎯 การทดสอบแต่ละ Endpoint:

**1. GET all items**
```
Method: GET
URL: http://localhost:3000/api/items
Expected: [] หรือ array ของ items
```

**2. POST create item**
```
Method: POST
URL: http://localhost:3000/api/items
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "Test Item",
  "description": "This is a test",
  "status": "pending"
}
Expected: { id: 1, name: "Test Item", ... }
```

**3. GET item by ID**
```
Method: GET
URL: http://localhost:3000/api/items/1
Expected: { id: 1, name: "Test Item", ... }
```

**4. PUT update item**
```
Method: PUT
URL: http://localhost:3000/api/items/1
Headers: Content-Type: application/json
Body (raw JSON):
{
  "status": "completed"
}
Expected: { id: 1, ..., status: "completed" }
```

**5. DELETE item**
```
Method: DELETE
URL: http://localhost:3000/api/items/1
Expected: { message: "Item deleted successfully" }
```

---

### ส่วนที่ 4: เชื่อมต่อ Frontend กับ Backend (30 นาที)

#### แก้ไข `frontend/script.js` เพิ่มการเรียก API:

```javascript
const API_URL = 'http://localhost:3000/api/items';

// 🟢 Load all items
async function loadItems() {
  try {
    const response = await fetch(API_URL);
    const items = await response.json();
    
    // แสดงข้อมูลบนหน้าเว็บ
    displayItems(items);
  } catch (error) {
    console.error('Error loading items:', error);
    alert('Failed to load items');
  }
}

// 🔵 Add new item
async function addItem(itemData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });
    
    if (response.ok) {
      const newItem = await response.json();
      console.log('Item added:', newItem);
      loadItems(); // Refresh list
    } else {
      throw new Error('Failed to add item');
    }
  } catch (error) {
    console.error('Error adding item:', error);
    alert('Failed to add item');
  }
}

// 🟠 Update item
async function updateItem(id, updatedData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });
    
    if (response.ok) {
      console.log('Item updated');
      loadItems(); // Refresh list
    } else {
      throw new Error('Failed to update item');
    }
  } catch (error) {
    console.error('Error updating item:', error);
    alert('Failed to update item');
  }
}

// 🔴 Delete item
async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('Item deleted');
      loadItems(); // Refresh list
    } else {
      throw new Error('Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Failed to delete item');
  }
}

// Display items (customize based on your UI)
function displayItems(items) {
  const container = document.getElementById('items-container');
  container.innerHTML = items.map(item => `
    <div class="item">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <button onclick="updateItem(${item.id}, {status: 'completed'})">
        Complete
      </button>
      <button onclick="deleteItem(${item.id})">Delete</button>
    </div>
  `).join('');
}

// Load items when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadItems();
});
```

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ WORKSHOP DELIVERABLES                                   │
│  ─────────────────────────                                  │
│  □ Express Server ที่ทำงานได้                                  │
│  □ API Routes สำหรับ CRUD operations (GET, POST, PUT,        │
│     DELETE)                                                 │
│  □ ข้อมูลถูกเก็บใน JSON file และสามารถอ่าน/เขียนได้                │
│  □ Frontend สามารถเรียกใช้ API ได้                             │
│  □ ทดสอบด้วย Postman และ Browser สำเร็จ                       │
│  □ Error handling พื้นฐาน (404, 500)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏠 Lab Assignment: ปรับปรุง API และเพิ่มฟีเจอร์

```
╔══════════════════════════════════════════════════════════════╗
║  📋 LAB ASSIGNMENT - DUE NEXT WEEK                           ║
║  ────────────────────────────────────                        ║
║  ให้นักศึกษาพัฒนา Backend API ต่อจาก Workshop                     ║
║  โดยเพิ่มฟีเจอร์และความสามารถต่อไปนี้                               ║
╚══════════════════════════════════════════════════════════════╝
```

### งานที่ 1: เพิ่ม Validation และ Error Handling (3 คะแนน)

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 OBJECTIVES                                              │
│  ──────────                                                 │
│  • ตรวจสอบว่า Request Body มีข้อมูลครบถ้วน                       │
│  • ตรวจสอบชนิดของข้อมูล (Data Type Validation)                 │
│  • ส่ง HTTP Status Code ที่เหมาะสม                             │
│  • ส่ง Error Message ที่ชัดเจน                                  │
└─────────────────────────────────────────────────────────────┘
```

#### ✅ ตัวอย่างการทำ:

```javascript
// Validation middleware example
function validateItem(req, res, next) {
  const { name, price } = req.body;
  
  // Check required fields
  if (!name || !price) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'price']
    });
  }
  
  // Check data types
  if (typeof name !== 'string') {
    return res.status(400).json({
      error: 'Name must be a string'
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Price must be a positive number'
    });
  }
  
  next(); // Validation passed
}

// Use middleware
app.post('/api/items', validateItem, (req, res) => {
  // ... create item
});
```

**📋 Checklist:**
- [ ] Validate required fields
- [ ] Validate data types
- [ ] Return appropriate status codes (400, 404, 500)
- [ ] Return clear error messages

---

### งานที่ 2: เพิ่มฟีเจอร์ Search และ Filter (3 คะแนน)

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 OBJECTIVES                                              │
│  ──────────                                                 │
│  • สร้าง endpoint สำหรับค้นหาข้อมูล                              │
│  • สร้าง endpoint สำหรับ filter ข้อมูล                          │
│  • รองรับการเรียงลำดับ (sorting)                               │
└─────────────────────────────────────────────────────────────┘
```

#### ✅ ตัวอย่างการทำ:

```javascript
// Search
app.get('/api/items/search', (req, res) => {
  const { q } = req.query;
  const data = readData();
  
  const results = data.items.filter(item =>
    item.name.toLowerCase().includes(q.toLowerCase()) ||
    item.description.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json(results);
});

// Filter
app.get('/api/items/filter', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  const data = readData();
  
  let results = data.items;
  
  if (category) {
    results = results.filter(item => item.category === category);
  }
  
  if (minPrice) {
    results = results.filter(item => item.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    results = results.filter(item => item.price <= parseFloat(maxPrice));
  }
  
  res.json(results);
});

// Sort
app.get('/api/items/sort', (req, res) => {
  const { sortBy, order } = req.query;
  const data = readData();
  
  const sorted = [...data.items].sort((a, b) => {
    if (order === 'desc') {
      return b[sortBy] > a[sortBy] ? 1 : -1;
    }
    return a[sortBy] > b[sortBy] ? 1 : -1;
  });
  
  res.json(sorted);
});
```

**📋 Checklist:**
- [ ] Search endpoint: `GET /api/items?search=keyword`
- [ ] Filter endpoint: `GET /api/items?category=value`
- [ ] Sort endpoint: `GET /api/items?sort=price&order=asc`
- [ ] ทดสอบทุก endpoint ใน Postman

---

### งานที่ 3: เชื่อมต่อ Frontend ให้สมบูรณ์ (4 คะแนน)

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 OBJECTIVES                                              │
│  ──────────                                                 │
│  • สร้างฟอร์มเพิ่มข้อมูลที่เรียก POST API                            │
│  • สร้างปุ่มแก้ไขข้อมูลที่เรียก PUT API                              │
│  • สร้างปุ่มลบข้อมูลที่เรียก DELETE API                             │
│  • แสดง Loading State และ Error Message                     │
└─────────────────────────────────────────────────────────────┘
```

**📋 Checklist:**
- [ ] ฟอร์มเพิ่มข้อมูล + Validation
- [ ] ปุ่มแก้ไข (พร้อม confirmation)
- [ ] ปุ่มลบ (พร้อม confirmation)
- [ ] Loading indicator ขณะเรียก API
- [ ] Error messages ที่เห็นชัดเจน
- [ ] Auto-refresh หลัง CRUD operations

```
┌─────────────────────────────────────────────────────────────┐
│  📅 DEADLINE                                                │
│  ────────                                                   │
│  สัปดาห์หน้า (ก่อนเข้าชั้นเรียน)                                    │
│                                                             │
│  📤 SUBMISSION                                              │
│  ──────────                                                 │
│  1. Push code to GitHub                                     │
│  2. Create README.md with:                                  │
│     • Setup instructions                                    │
│     • API endpoints documentation                           │
│     • Screenshots                                           │
│  3. Record demo video (2-3 mins)                            │
│  4. Submit GitHub link + video via LMS                      │
│                                                             │
│  🎯 GRADING (10 points total)                               │
│  ─────────                                                  │
│  • Task 1: Validation & Error Handling (3 pts)              │
│  • Task 2: Search & Filter (3 pts)                          │
│  • Task 3: Full Frontend Integration (4 pts)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 สรุปและมองไปข้างหน้า

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ WHAT WE LEARNED THIS WEEK                                ║
╚══════════════════════════════════════════════════════════════╝
```

### สรุปสิ่งที่เราได้เรียนรู้ในสัปดาห์นี้:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ✓ เข้าใจรูปแบบสถาปัตยกรรมซอฟต์แวร์                               │
│    → Monolithic, Client-Server, Microservices                │
│    → ข้อดี-ข้อเสียของแต่ละแบบ                                     │
│                                                              │
│  ✓ รู้จัก Design Patterns เบื้องต้น                                │
│    → Layered Architecture                                    │
│    → MVC Pattern                                             │
│    → Repository Pattern                                      │
│                                                              │
│  ✓ เริ่มต้นใช้ Node.js และ Express                               │
│    → สร้าง Server                                             │
│    → กำหนด Routes และ HTTP Methods                           │
│    → Middleware และ Error Handling                           │
│                                                              │
│  ✓ จัดการไฟล์ JSON                                             │
│    → อ่านและเขียนข้อมูลใน JSON file                              │
│    → JSON.parse() และ JSON.stringify()                       │
│                                                              │
│  ✓ สร้าง RESTful API                                          │
│    → CRUD operations (GET, POST, PUT, DELETE)                │
│    → HTTP Status Codes                                       │
│    → ทดสอบด้วย Postman                                        │
│                                                              │
│  ✓ เชื่อมต่อ Frontend-Backend                                   │
│    → ใช้ fetch() เรียก API จาก JavaScript                      │
│    → จัดการ CORS                                              │
│    → Async/Await pattern                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 🔮 สัปดาห์หน้า (สัปดาห์ที่ 7): Backend & API Design + SQLite Integration

```
┌─────────────────────────────────────────────────────────────┐
│  NEXT WEEK PREVIEW                                          │
│  ──────────────────                                         │
│                                                             │
│  📘 หัวข้อ: Backend & API Design + SQLite Integration         │
│                                                             │
│  🎯 สิ่งที่จะได้เรียนรู้:                                           │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  1️⃣ หลักการออกแบบ RESTful API                           │ │
│  │     • Resources, HTTP Verbs                            │ │
│  │     • Status Codes                                     │ │
│  │     • API Best Practices                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  2️⃣ Data Modelling และ ER Diagram                      │ │
│  │     • Entity-Relationship Diagram                      │ │
│  │     • Table Design                                     │ │
│  │     • Relationships (1:1, 1:N, N:N)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  3️⃣ จาก JSON file → SQLite Database                    │ │
│  │     • SQL Basics (CREATE, SELECT, INSERT, UPDATE)      │ │
│  │     • SQLite Integration with Express                  │ │
│  │     • Database Queries                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  4️⃣ การแบ่งเลเยอร์โค้ด                                    │ │
│  │     • Router Layer                                     │ │
│  │     • Controller Layer                                 │ │
│  │     • Service Layer                                    │ │
│  │     • Database Layer                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  📌 การเตรียมตัว:                                              │
│  ────────────────                                            │
│  • ทบทวนเนื้อหา SQL เบื้องต้น                                     │
│    (CREATE TABLE, INSERT, SELECT, UPDATE, DELETE)            │
│                                                              │
│  • อ่านเพิ่มเติมเกี่ยวกับ REST API Best Practices                   │
│                                                              │
│  • เตรียม ER Diagram ของ Term Project มาให้พร้อม                │
│                                                              │
│  • ทำ Lab Assignment ให้เสร็จ! 💪                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 💡 แนวคิดสำคัญที่ควรจำไว้

```
╔══════════════════════════════════════════════════════════════╗
║  KEY TAKEAWAYS                                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1️⃣ การเลือกสถาปัตยกรรมที่เหมาะสม                                ║
║     ส่งผลต่อความสำเร็จของโปรเจกต์ในระยะยาว                       ║
║                                                              ║
║  2️⃣ Design Patterns ช่วยให้โค้ดเป็นระเบียบ                        ║
║     อ่านง่าย และบำรุงรักษาง่าย                                    ║
║                                                              ║
║  3️⃣ การแบ่งเลเยอร์ทำให้แต่ละส่วนมีหน้าที่ชัดเจน                        ║
║     ทดสอบและแก้ไขได้ง่าย                                        ║
║                                                              ║
║  4️⃣ API คือสะพานเชื่อมระหว่าง Frontend และ Backend               ║
║     ต้องออกแบบให้ดี                                             ║
║                                                              ║
║  5️⃣ เริ่มต้นด้วย JSON file ง่าย                                   ║
║     แต่ในระบบจริงควรใช้ Database เพื่อความเสถียร                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎓 ปิดท้าย

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🎉 ขอให้โชคดีกับการพัฒนา Term Project! 🎉                 ║
║                                                              ║
║  หากมีคำถามหรือติดปัญหา                                          ║
║  สามารถถามอาจารย์ได้ตลอดเวลา                                   ║
║  หรือปรึกษาเพื่อนในชั้นเรียน                                        ║
║                                                              ║
║  การเขียนโปรแกรมเป็นทักษะที่ต้องฝึกฝน                               ║
║  ยิ่งฝึกมาก ยิ่งเก่ง! 💪                                           ║
║                                                              ║
║  ────────────────────────────────────────────────────────    ║
║                                                              ║
║  "The only way to learn a new programming language           ║
║   is by writing programs in it."                             ║
║                                         - Dennis Ritchie     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📚 แหล่งข้อมูลเพิ่มเติม

### 📖 Documentation
- **Node.js**: https://nodejs.org/docs
- **Express.js**: https://expressjs.com
- **MDN Web Docs**: https://developer.mozilla.org

### 🎥 Video Tutorials
- **Net Ninja - Node.js**: https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU
- **Traversy Media - Node & Express**: https://www.youtube.com/watch?v=L72fhGm1tfE

### 📚 Books
- "Node.js Design Patterns" by Mario Casciaro
- "Express in Action" by Evan Hahn

---

```
═══════════════════════════════════════════════════════════════
                    END OF WEEK 6 MATERIALS
═══════════════════════════════════════════════════════════════
```
