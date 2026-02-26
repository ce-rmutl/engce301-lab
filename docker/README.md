# 🐳 Docker Foundation
## เตรียมพร้อมสำหรับ Cloud & Containerization

**วิชา:** ENGSE207 สถาปัตยกรรมซอฟต์แวร์  
**มหาวิทยาลัย:** เทคโนโลยีราชมงคลล้านนา  
**ผู้สอน:** นายธนิต เกตุแก้ว  
**ปรับปรุงล่าสุด:** มกราคม 2569

---

## 📋 ภาพรวม

เอกสารชุดนี้เป็นการเตรียมความพร้อมให้นักศึกษาก่อนเรียน **Week 7: Cloud & Containerization** โดยนักศึกษาจะได้เรียนรู้พื้นฐาน Docker ตั้งแต่การติดตั้ง จนถึงการใช้งานเบื้องต้น เพื่อให้พร้อมสำหรับการเรียนสถาปัตยกรรมบน Cloud

```
┌───────────────────────────────────────────────────────────────────────┐
│                         LEARNING PATH                                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│    Week 6                    ก่อนเรียน                    Week 7        │
│   ────────                  ─────────                  ────────       │
│                                                                       │
│  ┌──────────┐            ┌──────────────┐            ┌──────────┐     │
│  │  N-Tier  │            │   Docker     │            │  Cloud & │     │
│  │ Single VM│  ────────► │  Foundation  │ ────────►  │Container-│     │
│  │ (Manual) │            │  (เตรียมตัว)   │            │  ization │     │
│  └──────────┘            └──────────────┘            └──────────┘     │
│                                 │                                     │
│                                 ▼                                     │
│                          📚 เอกสารชุดนี้                                 │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 วัตถุประสงค์

เมื่อศึกษาเอกสารชุดนี้จบ นักศึกษาจะสามารถ:

| # | วัตถุประสงค์ | เอกสารที่เกี่ยวข้อง |
|---|-------------|-------------------|
| 1 | อธิบายว่า Docker คืออะไร และแก้ปัญหาอะไรได้ | Lecture, Setup Guides |
| 2 | อธิบายความแตกต่างระหว่าง Image, Container, Registry ได้ | Lecture |
| 3 | ติดตั้ง Docker Desktop บนเครื่องของตนเองได้ | Setup Guides |
| 4 | ใช้คำสั่ง Docker พื้นฐานได้ (pull, run, ps, stop, rm) | Lecture, Setup Guides |
| 5 | สมัครและใช้งาน Docker Hub ได้ | Setup Guides |
| 6 | เข้าใจหลักการ Containerization เพื่อเตรียมเรียน Cloud | Lecture |

---

## 📚 เอกสารประกอบการเรียน

### 🗂️ รายการเอกสาร

```
Docker-Foundation/
│
├── 📖 README.md                        ← คุณอยู่ที่นี่
│       ภาพรวมและแนวทางการศึกษา
│
├── 📘 docker_foundation_lecture.md     ← เนื้อหาหลัก
│       เอกสารประกอบการสอน Docker
│       (อ่านในชั้นเรียน หรืออ่านล่วงหน้า)
│
├── 📗 docker_setup_windows_wsl.md      ← สำหรับ Windows
│       คู่มือติดตั้ง Docker บน Windows 11 + WSL2
│
└── 📙 docker_setup_macos_m2.md         ← สำหรับ macOS
        คู่มือติดตั้ง Docker บน macOS (Apple Silicon)
```

---

## 📖 1. Docker Foundation Lecture

### [📘 อ่านเอกสาร: docker_foundation_lecture.md](./docker_foundation_lecture.md)

**เนื้อหาครอบคลุม:**

| หัวข้อ | รายละเอียด |
|--------|-----------|
| ทำไมต้อง Docker? | ปัญหาของ Traditional Deployment, ต่อเนื่องจาก Week 6 |
| Docker คืออะไร? | Build → Ship → Run, Core Concepts |
| Docker Architecture | Client, Engine, Registry |
| Docker Registry & Hub | Image Naming, Push/Pull workflow |
| Docker Commands | Images, Containers, Logs, Exec |
| Dockerfile | Instructions, Multi-stage Build |
| Docker Compose | Multi-container orchestration |
| Best Practices | Security, Optimization |

**เหมาะสำหรับ:**
- 📖 อ่านก่อนเรียนเพื่อทำความเข้าใจ Concepts
- 📝 ใช้ทบทวนหลังเรียน
- 🔍 ใช้เป็น Reference ระหว่างทำ Lab

**⏱️ เวลาอ่าน:** 45-60 นาที

---

## 💻 2. คู่มือติดตั้ง Docker (เลือกตามเครื่องที่ใช้)

### 🪟 สำหรับ Windows 11 + WSL2

### [📗 อ่านเอกสาร: docker_setup_windows_wsl.md](./docker_setup_windows_wsl.md)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Windows 11 + WSL2 Setup                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Requirements:                                                 │
│   ✓ Windows 11 (64-bit)                                         │
│   ✓ WSL 2 with Ubuntu                                           │
│   ✓ VS Code with WSL Extension                                  │
│   ✓ Virtualization enabled in BIOS                              │
│                                                                 │
│   You'll learn:                                                 │
│   • ตรวจสอบ WSL2                                                │
│   • ติดตั้ง Docker Desktop                                         │
│   • ตั้งค่า WSL Integration                                        │
│   • ใช้ Docker จาก WSL Terminal                                  │
│                                                                 │
│   ⏱️ เวลา: 30-45 นาที                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🍎 สำหรับ macOS (Apple Silicon M1/M2/M3)

### [📙 อ่านเอกสาร: docker_setup_macos_m2.md](./docker_setup_macos_m2.md)

```
┌─────────────────────────────────────────────────────────────────┐
│                    macOS Apple Silicon Setup                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Requirements:                                                 │
│   ✓ Mac with Apple Silicon (M1/M2/M3)                           │
│   ✓ macOS Ventura (13.0) or later                               │
│   ✓ Rosetta 2 installed                                         │
│   ✓ VS Code for Mac                                             │
│                                                                 │
│   You'll learn:                                                 │
│   • ตรวจสอบ Mac Chip & macOS version                            │
│   • ติดตั้ง Docker Desktop for Apple Silicon                       │
│   • เข้าใจ ARM64 vs x86 images                                   │
│   • ใช้ Docker จาก Terminal                                      │
│                                                                 │
│   ⏱️ เวลา: 20-30 นาที                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 ขั้นตอนที่นักศึกษาต้องทำ

### 🚀 ก่อนมาเรียน Week 7

```
┌────────────────────────────────────────────────────────────────────────┐
│                    📋 TO-DO LIST (ก่อนเรียน)                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  STEP 1: อ่านและติดตั้ง Docker (เลือก 1 อย่าง)                               │
│  ─────────────────────────────────────────────                         │
│                                                                        │
│  🪟 Windows User:                                                      │
│     ☐ อ่าน docker_setup_windows_wsl.md                                  │
│     ☐ ทำตามขั้นตอนติดตั้ง Docker Desktop                                    │
│     ☐ ทำแบบฝึกหัดทั้ง 5 ข้อ                                                 │
│                                                                        │
│  🍎 macOS User:                                                        │
│     ☐ อ่าน docker_setup_macos_m2.md                                     │
│     ☐ ทำตามขั้นตอนติดตั้ง Docker Desktop                                    │
│     ☐ ทำแบบฝึกหัดทั้ง 6 ข้อ                                                 │
│                                                                        │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                        │
│  STEP 2: สมัคร Docker Hub                                               │
│  ─────────────────────────                                             │
│                                                                        │
│     ☐ สมัครบัญชีที่ hub.docker.com                                          │
│     ☐ ยืนยัน Email                                                       │
│     ☐ Login จาก Terminal (docker login)                                │
│                                                                        │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                        │
│  STEP 3: ตรวจสอบการติดตั้ง                                                │
│  ────────────────────────                                              │
│                                                                        │
│     ☐ docker --version ทำงานได้                                         │
│     ☐ docker run hello-world สำเร็จ                                     │
│     ☐ docker images แสดง images ที่ pull มา                              │
│                                                                        │
│  ───────────────────────────────────────────────────────────────────── │
│                                                                        │
│  STEP 4: (Optional) อ่านเนื้อหาล่วงหน้า                                     │
│  ─────────────────────────────────────                                 │
│                                                                        │
│     ☐ อ่าน docker_foundation_lecture.md                                 │
│     ☐ ทำความเข้าใจ Concepts พื้นฐาน                                       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist สำหรับยืนยันความพร้อม

### นักศึกษาต้องทำได้ทั้งหมดนี้ก่อนมาเรียน:

| # | รายการ | ✓ |
|---|--------|---|
| 1 | Docker Desktop ติดตั้งและ Engine Running (icon เขียว) | ☐ |
| 2 | รัน `docker --version` แล้วเห็น version number | ☐ |
| 3 | รัน `docker compose version` แล้วเห็น version number | ☐ |
| 4 | รัน `docker run hello-world` สำเร็จ | ☐ |
| 5 | มีบัญชี Docker Hub และ login สำเร็จ | ☐ |
| 6 | Pull images สำเร็จ: `node:20-alpine`, `nginx:alpine`, `postgres:16-alpine` | ☐ |
| 7 | รัน Nginx container และเข้า http://localhost:8080 ได้ | ☐ |
| 8 | รัน PostgreSQL container และ connect ได้ | ☐ |

---

## 📸 Screenshot ที่ต้องเตรียม

เตรียม Screenshot เหล่านี้เพื่อแสดงว่าติดตั้งสำเร็จ:

```
┌─────────────────────────────────────────────────────────────────┐
│                    📸 Required Screenshots                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 🖥️ Docker Desktop Dashboard                                 │
│     แสดงว่า Engine กำลัง Running                                  │
│                                                                 │
│  2. 💻 Terminal - docker --version                              │
│     แสดง Docker version ที่ติดตั้ง                                   │
│                                                                 │
│  3. 💻 Terminal - docker run hello-world                        │
│     แสดงข้อความ "Hello from Docker!"                             │
│                                                                 │
│  4. 💻 Terminal - docker images                                 │
│     แสดง list ของ images ที่ pull มา                              │
│                                                                 │
│  5. 🌐 Browser - http://localhost:8080                          │
│     แสดงหน้า "Welcome to nginx!"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⏰ Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         📅 TIMELINE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ก่อนเรียน 1 สัปดาห์                                                        │
│  ──────────────────                                                     │
│  │                                                                      │
│  ├── วันที่ 1-2: ติดตั้ง Docker Desktop                                       │
│  │              (ตามคู่มือ Windows หรือ macOS)                              │
│  │                                                                      │
│  ├── วันที่ 3-4: ทำแบบฝึกหัด + สมัคร Docker Hub                               │
│  │                                                                      │
│  ├── วันที่ 5-6: ทบทวน + อ่าน Lecture (Optional)                            │
│  │                                                                      │
│  └── วันที่ 7: ตรวจสอบ Checklist + เตรียม Screenshots                       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📆 วันเรียน Week 7: Cloud & Containerization                             │
│  │                                                                      │
│  ├── ชั่วโมงที่ 1-2: บรรยาย (ใช้ docker_foundation_lecture.md)               │
│  │                                                                      │
│  └── ชั่วโมงที่ 3-5: Lab ปฏิบัติ                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🆘 ต้องการความช่วยเหลือ?

### หากพบปัญหาในการติดตั้ง:

1. **อ่านส่วน Troubleshooting** ในคู่มือติดตั้งของแต่ละ OS
2. **ค้นหา Error message** ใน Google หรือ Stack Overflow
3. **โพสต์คำถาม** ใน Discord ของวิชา พร้อม:
   - Screenshot ของ error
   - OS และ version ที่ใช้
   - ขั้นตอนที่ทำก่อนเกิด error
4. **ติดต่ออาจารย์** ในชั่วโมง Office Hours

### ช่องทางติดต่อ:

| ช่องทาง | รายละเอียด |
|---------|-----------|
| 💬 Discord | #engse207-docker-help |
| 📧 Email | thanit@rmutl.ac.th |
| 🏢 Office Hours | อังคาร-พฤหัสบดี 14:00-16:00 |

---

## 📚 แหล่งเรียนรู้เพิ่มเติม

### Official Documentation
- [Docker Official Docs](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Get Started Tutorial](https://docs.docker.com/get-started/)

### Video Tutorials
- [Docker in 100 Seconds - Fireship](https://www.youtube.com/watch?v=Gjnup-PuquQ)
- [Docker Tutorial for Beginners - TechWorld with Nana](https://www.youtube.com/watch?v=3c-iBn73dDE)
- [Docker Crash Course - Traversy Media](https://www.youtube.com/watch?v=pTFZFxd4hOI)

### Thai Resources
- [Docker เบื้องต้น - สอน Docker ภาษาไทย](https://www.youtube.com/results?search_query=docker+%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2)

---

## 🔗 Quick Links

| เอกสาร | Link | เวลา |
|--------|------|------|
| 📘 Docker Foundation Lecture | [docker_foundation_lecture.md](./docker_foundation_lecture.md) | 45-60 นาที |
| 📗 Windows + WSL2 Setup | [docker_setup_windows_wsl.md](./docker_setup_windows_wsl.md) | 30-45 นาที |
| 📙 macOS Apple Silicon Setup | [docker_setup_macos_m2.md](./docker_setup_macos_m2.md) | 20-30 นาที |

---

## 💡 Tips สำหรับความสำเร็จ

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         💡 TIPS FOR SUCCESS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✅ DO's                                                                │
│  ──────                                                                 │
│  • ติดตั้ง Docker ล่วงหน้า อย่ารอถึงวันเรียน                                     │
│  • ทำแบบฝึกหัดให้ครบ เพื่อให้คุ้นเคยกับ commands                                 │
│  • ถ้าติดปัญหา ถามเลย อย่ารอ                                                │
│  • เก็บ screenshots ไว้เป็นหลักฐาน                                          │
│  • อ่าน error messages ให้ละเอียด                                          │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ❌ DON'Ts                                                              │
│  ────────                                                               │
│  • อย่ารอจนถึงวันเรียนค่อยติดตั้ง                                               │
│  • อย่าข้ามขั้นตอนในคู่มือ                                                     │
│  • อย่าลืมสมัคร Docker Hub                                                 │
│  • อย่าลืม restart หลังติดตั้ง (Windows)                                      │
│  • อย่ากลัวที่จะลอง - Container ลบแล้วสร้างใหม่ได้                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**พร้อมแล้วก็เริ่มกันเลย! 🐳🚀**

**เลือกอ่านคู่มือตาม OS ของคุณ:**
- 🪟 [Windows + WSL2](./docker_setup_windows_wsl.md)
- 🍎 [macOS Apple Silicon](./docker_setup_macos_m2.md)

---

*เอกสารนี้จัดทำโดย: นายธนิต เกตุแก้ว*  
*วิชา ENGSE207 สถาปัตยกรรมซอฟต์แวร์*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
