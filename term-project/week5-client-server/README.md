# 🖥️ คู่มือปฏิบัติการ ENGSE207 - สัปดาห์ที่ 5
## Client-Server Architecture: VM Deployment & REST API 

**สัปดาห์:** 5 | **ระยะเวลา:** 4 ชั่วโมง | **ระดับความยาก:** ⭐⭐⭐⭐

---

## 📋 สารบัญ

1. [วัตถุประสงค์การเรียนรู้](#วัตถุประสงค์การเรียนรู้)
2. [สิ่งที่ต้องเตรียมและดาวน์โหลด](#สิ่งที่ต้องเตรียมและดาวน์โหลด)
3. [ภาพรวมสถาปัตยกรรม](#ภาพรวมสถาปัตยกรรม)
4. [ส่วนที่ 1: VirtualBox & VM Setup (60 นาที)](#ส่วนที่-1-virtualbox-vm-setup)
5. [ส่วนที่ 2: ตั้งค่า Ubuntu Server (40 นาที)](#ส่วนที่-2-ตั้งค่า-ubuntu-server)
6. [ส่วนที่ 3: ติดตั้งสภาพแวดล้อมพัฒนา (30 นาที)](#ส่วนที่-3-ติดตั้งสภาพแวดล้อมพัฒนา)
7. [ส่วนที่ 4: Deploy Backend ไปยัง VM (50 นาที)](#ส่วนที่-4-deploy-backend-ไปยัง-vm)
8. [ส่วนที่ 5: ตั้งค่าการสื่อสาร Client-Server (40 นาที)](#ส่วนที่-5-ตั้งค่าการสื่อสาร-client-server)
9. [ส่วนที่ 6: Production Deployment ด้วย PM2 (30 นาที)](#ส่วนที่-6-production-deployment-ด้วย-pm2)
10. [ส่วนที่ 7: การวิเคราะห์และเปรียบเทียบ (40 นาที)](#ส่วนที่-7-การวิเคราะห์และเปรียบเทียบ) ⭐ **ต้องทำเอง**
11. [การส่งงานและเกณฑ์การให้คะแนน](#การส่งงานและเกณฑ์การให้คะแนน)
12. [แก้ปัญหาเบื้องต้น](#แก้ปัญหาเบื้องต้น)

---

## 🎯 วัตถุประสงค์การเรียนรู้

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:

✅ ติดตั้งและตั้งค่า Ubuntu Server VM ใน VirtualBox  
✅ ตั้งค่า network สำหรับการสื่อสาร VM-host  
✅ Deploy Node.js backend ไปยัง VM  
✅ จัดการ processes ด้วย PM2  
✅ แยก frontend (local) ออกจาก backend (VM)  
✅ ตั้งค่าการสื่อสาร REST API แบบ client-server  
✅ เข้าใจ practices การ deploy แบบ production  
✅ **วิเคราะห์ความแตกต่างระหว่าง 3 architectures** ⭐

---

## 📦 สิ่งที่ต้องเตรียมและดาวน์โหลด

### ซอฟต์แวร์ที่ต้องมี:

#### 1. VirtualBox (เวอร์ชันล่าสุด)
**ดาวน์โหลด:**
- Windows/Mac/Linux: https://www.virtualbox.org/wiki/Downloads
- แนะนำ Version 7.0+

#### 2. Ubuntu Server 22.04 LTS ISO
**web site:**
- https://ubuntu.com/download/server
- ไฟล์: `ubuntu-22.04.x-live-server-amd64.iso` (~2.0 GB)

**ดาวน์โหลด:**

**- ถ้าใช้เครื่อง Windows**
**Ubuntu Server for amd64 (64-bit Intel/AMD)**
- https://releases.ubuntu.com/22.04.5/ubuntu-22.04.5-live-server-amd64.iso

**- ถ้าใช้เครื่อง iMac/Mac book**
**Ubuntu Server for ARM (Apple Silicon)**
- https://cdimage.ubuntu.com/releases/22.04.5/release/ubuntu-22.04.5-live-server-arm64.iso

#### 3. สิ่งที่ต้องมีจากสัปดาห์ก่อน:
- ✅ โค้ด Week 4 Layered Architecture
- ✅ Git ติดตั้งแล้ว
- ✅ VS Code พร้อม Remote-SSH extension
- ✅ ความเข้าใจพื้นฐาน terminal/command line

### ความต้องการของระบบ:

**เครื่องคอมพิวเตอร์ของคุณ (Host Machine):**
- RAM: 8 GB+ (จะแบ่งให้ VM 2 GB)
- พื้นที่: 20 GB ว่าง
- CPU: 64-bit processor พร้อม virtualization
- OS: Windows 10/11, macOS, หรือ Linux

**ข้อกำหนด VM:**
- RAM: 2048 MB (2 GB)
- CPU: 2 cores
- Storage: 10 GB (dynamic)
- Network1: Host-Only Adapter หรือ  Host-Only Network 
- Network2: NAT (สำหรับใช้ออก Internet)

---

## 🏗️ ภาพรวมสถาปัตยกรรม

### สัปดาห์ที่ 5: Client-Server Architecture

```
┌─────────────────────────────────────────────────────┐
│          เครื่องของคุณ (Windows/Mac/Linux)             │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Frontend (Client)                            │  │
│  │  - HTML/CSS/JavaScript                        │  │
│  │  - ทำงานใน Browser                            │  │
│  │  - ส่ง HTTP requests ไปยัง VM                   │  │
│  └───────────────────────────────────────────────┘  │
│                        │                            │
│                        │ HTTP/HTTPS                 │
│                        │ (Network Request)          │
└────────────────────────┼────────────────────────────┘
                         │
                         │ Host-Only Network / NAT
                         │
┌────────────────────────▼────────────────────────────┐
│    VIRTUAL MACHINE (Ubuntu Server 22.04)            │
│             IP: 192.168.x.x หรือ 10.0.x.x            │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Backend (Server)                             │  │
│  │  - Node.js + Express                          │  │
│  │  - REST API Endpoints                         │  │
│  │  - Business Logic                             │  │
│  │  - จัดการโดย PM2                               │  │
│  │  Port: 3000                                   │  │
│  └───────────────────────────────────────────────┘  │
│                        │                            │
│                        ▼                            │
│  ┌───────────────────────────────────────────────┐  │
│  │  Database                                     │  │
│  │  - SQLite (tasks.db)                          │  │
│  │  - จัดเก็บข้อมูล                                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### ความแตกต่างหลักจาก Week 4:

| ด้าน | Week 4 (Layered) | Week 5 (Client-Server) |
|------|------------------|------------------------|
| **Deployment** | เครื่องเดียว | แยกเครื่อง (local + VM) |
| **Frontend** | Backend serve ให้ | ทำงาน local แยกต่างหาก |
| **Backend** | Local development | VM (production-like) |
| **การสื่อสาร** | Same process | HTTP ผ่าน network |
| **จัดการ Process** | Manual (nodemon) | PM2 (production) |
| **Network** | Localhost | ต้องตั้งค่า network |

---

## ส่วนที่ 1: VirtualBox & VM Setup (60 นาที)

### 1.1 ติดตั้ง VirtualBox (15 นาที)

**Windows:**
```
1. ดาวน์โหลด VirtualBox-x.x.x-Win.exe
2. รันไฟล์ติดตั้ง
3. ทำตาม wizard (ใช้การตั้งค่าเริ่มต้นได้)
4. ติดตั้ง VirtualBox Extension Pack (ถ้าต้องการ)
5. Restart ถ้าระบบแจ้ง
```

**macOS:**
```
1. ดาวน์โหลด VirtualBox-x.x.x-macOS.dmg
2. เปิด DMG และรันไฟล์ติดตั้ง
3. อนุญาต system extensions ใน Security settings
4. Restart ถ้าจำเป็น
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install virtualbox virtualbox-ext-pack
```

**ตรวจสอบการติดตั้ง:**
```
เปิด VirtualBox
คุณควรเห็นหน้าต่างหลักพร้อมปุ่ม "New"
```

### 1.2 สร้าง Virtual Machine (20 นาที)

**ขั้นตอนที่ 1: สร้าง VM**
```
VirtualBox → New
```

**การตั้งค่า:**
- **Name:** ENGSE207-Server
- **Type:** Linux
- **Version:** Ubuntu (64-bit)
- **Memory:** 2048 MB
- **Hard Disk:** Create virtual hard disk now

**ขั้นตอนที่ 2: Virtual Hard Disk**
- **Size:** 50 GB
- **Type:** VDI (VirtualBox Disk Image)
- **Storage:** Dynamically allocated

**ขั้นตอนที่ 3: ตั้งค่า VM**

คลิกขวาที่ VM → Settings:

**System:**
```
- Processor: 2 CPUs
- Boot Order: Hard Disk, Optical
- Enable PAE/NX
```

**Display:**
```
- Video Memory: 16 MB (ขั้นต่ำ)
```

**Storage:**
```
- Controller: IDE
  - Empty → คลิกไอคอนแผ่นดิสก์ → เลือก Ubuntu ISO
  - เลือก: ubuntu-22.04.x-live-server-amd64.iso
```

**Network: [ต้องมีทั้ง คู่]**

**- Network A: Host-Only Adapter หรือ Host-Only Network(Mac)**
```
Adapter 1:
- Attached to: Host-Only Adapter หรือ Host-Only Network(Mac)
- Name: [WiFi/Ethernet adapter ของคุณ]
- Advanced → Promiscuous Mode: Allow All
```

**- Network B: NAT (สำหรับใช้ออก Internet)**
```
Adapter 2:
- Attached to: NAT
```

### 1.3 ติดตั้ง Ubuntu Server (25 นาที)

**ขั้นตอนที่ 1: เริ่ม VM**
```
เลือก ENGSE207-Server → Start
```

**ขั้นตอนที่ 2: Ubuntu Installation Wizard**

```
1. ภาษา: English

2. แป้นพิมพ์: English (US) หรือตามต้องการ

3. ประเภทการติดตั้ง: Ubuntu Server (default)

4. การเชื่อมต่อ Network:
   - ควรแสดง: enp0s3 (หรือคล้ายกัน)
   - DHCP: Enabled (ตั้งค่าอัตโนมัติ)
   - จดไว้ IP address ที่แสดง (เช่น 192.168.56.101)

5. Proxy: เว้นว่างไว้ (เว้นแต่คุณต้องใช้)

6. Mirror: Default (http://archive.ubuntu.com/ubuntu)

7. Storage:
   - Use entire disk
   - Confirm: Continue

8. การตั้งค่า Profile:
   Your name: ชื่อคุณ
   Server name: engse207-server
   Username: devlab
   Password: [สร้างรหัสผ่านที่ปลอดภัย]
   
   ⚠️ จำรหัสผ่านนี้ไว้!

9. การตั้งค่า SSH:
   ✅ Install OpenSSH server
   
10. Featured Server Snaps:
   - ข้ามทั้งหมด (จะติดตั้งด้วยตนเอง)

11. ความคืบหน้าการติดตั้ง:
   - รอ 5-10 นาที
   
12. Reboot:
   - เอา installation medium ออกเมื่อขอ
   - กด Enter
```

**ขั้นตอนที่ 3: Login ครั้งแรก**
```
Login: devlab
Password: [รหัสผ่านของคุณ]

คุณควรเห็น:
Welcome to Ubuntu 22.04.x LTS
```

**ขั้นตอนที่ 4: หา IP Address ของ VM**
```bash
ip addr show

# มองหา inet ใต้ enp0s3:
# ตัวอย่าง: inet 192.168.56.101/24
# VM IP ของคุณ: 192.168.56.101
```

**⚠️ สำคัญ: จด IP address นี้ไว้!**

**📝 บันทึก VM IP ของคุณ:**
```
VM IP: ___________________
```

---

## ส่วนที่ 2: ตั้งค่า Ubuntu Server (40 นาที)

### 2.1 อัพเดทระบบ (10 นาที)

```bash
# อัพเดทรายการ packages
sudo apt update

# อัพเกรด packages ทั้งหมด
sudo apt upgrade -y

# อาจใช้เวลา 5-10 นาที
# กด Enter ถ้าถูกถามเกี่ยวกับ kernel updates
```

### 2.2 ติดตั้งเครื่องมือพื้นฐาน (15 นาที)

```bash
# ติดตั้งเครื่องมือพื้นฐาน
sudo apt install -y curl wget git vim build-essential

# ติดตั้ง network tools (สำหรับ debug)
sudo apt install -y net-tools

# ตรวจสอบการติดตั้ง
curl --version
git --version
```

### 2.3 ตั้งค่า Firewall (5 นาที)

```bash
# ตรวจสอบสถานะ firewall
sudo ufw status

# อนุญาต SSH (port 22)
sudo ufw allow 22/tcp

# อนุญาต Node.js API (port 3000)
sudo ufw allow 3000/tcp

# เปิดใช้งาน firewall
sudo ufw enable
# พิมพ์ 'y' และกด Enter

# ตรวจสอบ
sudo ufw status
# ควรแสดง: Status: active
```

### 2.4 ทดสอบการเชื่อมต่อ Network (10 นาที)

**จาก VM (Ubuntu):**
```bash
# ทดสอบ internet
ping -c 4 google.com

# ควรเห็น replies

# หา VM IP
hostname -I
# ตัวอย่างผลลัพธ์: 192.168.56.101
```

**📝 บันทึก VM IP อีกครั้ง:**
```
VM IP ของฉัน: ___________________
```

**จากเครื่องของคุณ (Windows/Mac):**

**Windows (PowerShell):**
```powershell
# เปลี่ยนเป็น VM IP ของคุณ
ping 192.168.56.101
```

**Mac/Linux:**
```bash
ping -c 4 192.168.56.101
```

**ผลลัพธ์ที่คาดหวัง:**
```
Reply from 192.168.56.101: bytes=32 time<1ms TTL=64
```

**ถ้า ping ล้มเหลว:**
- ตรวจสอบการตั้งค่า network ของ VM (Host-Only vs NAT)
- ตรวจสอบ firewall บนเครื่องของคุณ
- ดูส่วนแก้ปัญหา

---

## ส่วนที่ 3: ติดตั้งสภาพแวดล้อมพัฒนา (30 นาที)

### 3.1 ติดตั้ง Node.js 20 (10 นาที)

```bash
# ติดตั้ง Node.js 20 จาก NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ตรวจสอบการติดตั้ง
node --version  # ควรแสดง v20.x.x
npm --version   # ควรแสดง 10.x.x

# ติดตั้ง npm global tools
sudo npm install -g pm2
```

### 3.2 ติดตั้ง SQLite (5 นาที)

```bash
sudo apt install -y sqlite3

# ตรวจสอบ
sqlite3 --version
# ควรแสดง: 3.37.x หรือสูงกว่า
```

### 3.3 ตั้งค่าโฟลเดอร์โปรเจกต์ (5 นาที)

```bash
# สร้างโฟลเดอร์ projects
mkdir -p ~/projects
cd ~/projects

# ตั้งค่า Git (ใช้ข้อมูลของคุณ)
git config --global user.name "ชื่อคุณ"
git config --global user.email "email@ของคุณ.com"

# ตรวจสอบ
pwd
# ควรแสดง: /home/devlab/projects
```

### 3.4 ทดสอบ Node.js (10 นาที)

```bash
# สร้าง test server
cd ~/projects
cat > test-server.js << 'EOF'
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello from VM!\n');
});
server.listen(3000, '0.0.0.0', () => {
  console.log('Test server on port 3000');
});
EOF

# รัน test server
node test-server.js
```

**ทดสอบจาก browser บนเครื่องของคุณ:**
```
http://YOUR_VM_IP:3000
# ตัวอย่าง: http://192.168.56.101:3000

ผลลัพธ์ที่คาดหวัง: Hello from VM!
```

**หยุด test server:**
```
กด Ctrl+C ใน VM terminal
```

**ถ้าเชื่อมต่อไม่ได้:**
- ตรวจสอบ firewall: `sudo ufw status`
- ตรวจสอบ VM IP: `hostname -I`
- ลองเข้าจาก VM เอง: `curl localhost:3000`

---

## ส่วนที่ 4: Deploy Backend ไปยัง VM (50 นาที)

### 4.1 ถ่ายโอนโค้ดไปยัง VM (20 นาที)

**ตัวเลือก A: ใช้ Git (แนะนำ)**

**บนเครื่องของคุณ:**
```bash
cd ~/engse207-labs/week4-layered

# สร้าง .gitignore ถ้ายังไม่มี
cat > .gitignore << 'EOF'
node_modules/
*.db
.env
.DS_Store
EOF

# Commit และ push ไปยัง GitHub
git add .
git commit -m "Week 5: เตรียมสำหรับ VM deployment"
git push origin main
```

**บน VM:**
```bash
cd ~/projects

# Clone repository ของคุณ
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git task-board-api
cd task-board-api

# ถ้า repo ยังไม่มี สร้างบน GitHub ก่อน
```

**ตัวเลือก B: ใช้ SCP (ถ้าไม่มี GitHub)**

**บนเครื่องของคุณ (Windows - ใช้ Git Bash):**
```bash
cd ~/engse207-labs/week4-layered

# สร้าง tar archive (ไม่รวม node_modules)
tar -czf task-board.tar.gz --exclude='node_modules' --exclude='*.db' .

# คัดลอกไปยัง VM (เปลี่ยน IP)
scp task-board.tar.gz devlab@192.168.56.101:~/projects/
```

**บน VM:**
```bash
cd ~/projects
mkdir -p task-board-api
cd task-board-api
tar -xzf ../task-board.tar.gz
```

### 4.2 ตั้งค่าสำหรับ Production (15 นาที)

**สร้าง production .env:**
```bash
cd ~/projects/task-board-api

cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DB_PATH=/home/devlab/projects/task-board-api/database/tasks.db
LOG_LEVEL=info
HOST=0.0.0.0
EOF
```

**อัพเดท server.js สำหรับ production:**

```bash
# แก้ไข server.js
nano server.js
```

**เพิ่มที่ท้ายไฟล์ (ก่อน startServer):**
```javascript
// Production: Listen บนทุก interfaces
const HOST = process.env.HOST || '0.0.0.0';

// แก้ไข listen call:
app.listen(PORT, HOST, () => {
    logger.info(`🚀 เซิร์ฟเวอร์ทำงานที่ http://${HOST}:${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
});
```

**บันทึกและออก:**
```
Ctrl+O (บันทึก)
Enter
Ctrl+X (ออก)
```

### 4.3 ตั้งค่าฐานข้อมูล (10 นาที)

```bash
cd ~/projects/task-board-api

# สร้างโฟลเดอร์ database
mkdir -p database

# เริ่มต้นฐานข้อมูล
cd database
sqlite3 tasks.db < schema.sql

# ตรวจสอบ
sqlite3 tasks.db "SELECT * FROM tasks;"

# ควรแสดง sample tasks
```

### 4.4 ติดตั้ง Dependencies และทดสอบ (5 นาที)

```bash
cd ~/projects/task-board-api

# ติดตั้ง dependencies
npm install

# ทดสอบรัน
npm start

# ควรเห็น:
# ✅ เชื่อมต่อฐานข้อมูลสำเร็จ
# 🚀 เซิร์ฟเวอร์ทำงานที่ http://0.0.0.0:3000
```

**ทดสอบจากเครื่องของคุณ:**
```
Browser: http://YOUR_VM_IP:3000/api/tasks
ควรคืนค่า JSON พร้อม tasks
```

**หยุด server:**
```
Ctrl+C
```

---

## ส่วนที่ 5: ตั้งค่าการสื่อสาร Client-Server (40 นาที)

### 5.1 อัพเดท Frontend Configuration (15 นาที)

**บนเครื่องของคุณ:**

```bash
cd ~/engse207-labs/week5-client-server

# คัดลอก frontend จาก week4
mkdir -p public
cp ~/engse207-labs/week4-layered/public/* public/
```

**สร้าง config.js:**
```bash
cat > public/config.js << 'EOF'
// การตั้งค่า API
const API_CONFIG = {
    // เปลี่ยนเป็น VM IP ของคุณ
    BASE_URL: 'http://192.168.56.101:3000',
    ENDPOINTS: {
        TASKS: '/api/tasks',
        STATS: '/api/tasks/stats'
    }
};
EOF
```

**📝 อัพเดท config.js ด้วย VM IP ของคุณ!**
```
const API_CONFIG = {
    BASE_URL: 'http://___________________:3000',  // ← ใส่ VM IP ของคุณ
```

**อัพเดท public/app.js:**

```javascript
// เพิ่มที่ด้านบน
const API_BASE = API_CONFIG.BASE_URL;
const API = {
    TASKS: `${API_BASE}${API_CONFIG.ENDPOINTS.TASKS}`,
    STATS: `${API_BASE}${API_CONFIG.ENDPOINTS.STATS}`
};

// อัพเดท fetch calls ทั้งหมด
// เปลี่ยนจาก: fetch('/api/tasks')
// เป็น: fetch(API.TASKS)

// ตัวอย่าง:
async function loadTasks() {
    try {
        const res = await fetch(API.TASKS);
        if (!res.ok) throw new Error('โหลด tasks ล้มเหลว');
        const { data } = await res.json();
        renderTasks(data);
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('โหลด tasks จาก server ล้มเหลว');
    }
}

// อัพเดท fetch calls อื่นๆ ด้วยวิธีเดียวกัน...
```

**อัพเดท public/index.html:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Task Board - Client-Server</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>📋 Task Board - Client-Server Architecture</h1>
        <div id="serverStatus" class="status-bar">
            <span id="statusIndicator">🔴</span>
            <span id="statusText">กำลังเชื่อมต่อ server...</span>
        </div>
    </header>
    
    <!-- ส่วนที่เหลือของ HTML -->
    
    <!-- Scripts -->
    <script src="config.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

### 5.2 เปิดใช้ CORS บน Backend (10 นาที)

**บน VM:**

```bash
cd ~/projects/task-board-api

# ติดตั้ง CORS package
npm install cors

# แก้ไข server.js
nano server.js
```

**เพิ่มการตั้งค่า CORS:**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');  // เพิ่มบรรทัดนี้

const app = express();

// การตั้งค่า CORS - เพิ่มส่วนนี้
const corsOptions = {
    origin: true, // อนุญาตทุก origins ใน development
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));  // เพิ่มบรรทัดนี้

// middleware อื่นๆ...
app.use(express.json());
// ...
```

**บันทึกและ restart:**
```bash
# ทดสอบ
npm start
```

### 5.3 สร้าง Local Web Server (10 นาที)

**บนเครื่องของคุณ:**

```bash
cd ~/engse207-labs/week5-client-server/public

# ตัวเลือก 1: Python HTTP Server
python -m http.server 8080

# ตัวเลือก 2: Node.js http-server
npx http-server -p 8080

# ตัวเลือก 3: VS Code Live Server extension
# คลิกขวาที่ index.html → Open with Live Server
```

**เข้าถึง frontend:**
```
http://localhost:8080
```

### 5.4 ทดสอบการเชื่อมต่อ Client-Server (5 นาที)

**ใน Browser Console (F12):**
```javascript
// ทดสอบการเชื่อมต่อ API
fetch(API_CONFIG.BASE_URL + '/api/tasks')
    .then(r => r.json())
    .then(d => console.log('API Response:', d))
    .catch(e => console.error('API Error:', e));
```

**ผลลัพธ์ที่คาดหวัง:**
```
API Response: {success: true, data: [...]}
```

**สร้าง task จาก frontend และตรวจสอบว่ามันปรากฏ!**

---

## ส่วนที่ 6: Production Deployment ด้วย PM2 (30 นาที)

### 6.1 ทำความเข้าใจ PM2 (5 นาที)

PM2 คือ production process manager สำหรับ Node.js ที่:
- ✅ ทำให้แอปทำงานต่อเนื่อง (auto-restart เมื่อ crash)
- ✅ รันแอปใน background
- ✅ ตรวจสอบประสิทธิภาพ
- ✅ จัดการ logs
- ✅ เริ่มทำงานอัตโนมัติเมื่อระบบ reboot

### 6.2 สร้าง PM2 Ecosystem File (10 นาที)

**บน VM:**

```bash
cd ~/projects/task-board-api

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'task-board-api',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# สร้างโฟลเดอร์ logs
mkdir -p logs
```

### 6.3 เริ่มแอปพลิเคชันด้วย PM2 (10 นาที)

```bash
# เริ่มแอปพลิเคชัน
pm2 start ecosystem.config.js

# ควรเห็น:
┌────┬────────────────────┬─────────┬────────┐
│ id │      name          │  mode   │ status │
├────┼────────────────────┼─────────┼────────┤
│ 0  │ task-board-api     │  fork   │ online │
└────┴────────────────────┴─────────┴────────┘

# ตรวจสอบสถานะ
pm2 status

# ดู logs
pm2 logs task-board-api --lines 20

# ตรวจสอบแบบ real-time
pm2 monit

# กด Ctrl+C เพื่อออกจาก monitor
```

**คำสั่ง PM2 ที่ใช้บ่อย:**
```bash
# แสดงแอปทั้งหมด
pm2 list

# หยุดแอป
pm2 stop task-board-api

# Restart แอป
pm2 restart task-board-api

# ลบแอปจาก PM2
pm2 delete task-board-api

# ดู logs
pm2 logs

# ล้าง logs
pm2 flush

# บันทึกรายการ process ของ PM2
pm2 save

# กู้คืน saved processes
pm2 resurrect
```

### 6.4 ตั้งค่า Auto-Start เมื่อ Boot (5 นาที)

```bash
# สร้าง startup script
pm2 startup

# คัดลอกและรันคำสั่งที่แสดง
# จะมีลักษณะแบบนี้:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u devlab --hp /home/devlab

# บันทึก PM2 processes ปัจจุบัน
pm2 save

# ทดสอบ: Reboot VM
sudo reboot

# หลัง reboot, SSH กลับเข้ามาและตรวจสอบ:
pm2 list
# task-board-api ควรทำงานอยู่
```

---

## PART 7: Testing & Monitoring (20 minutes)

### 7.1 Comprehensive API Testing (10 min)

**Create test script:**

```bash
cd ~/projects/task-board-api

cat > test-api.sh << 'EOF'
#!/bin/bash

API="http://localhost:3000/api"

echo "🧪 Testing API..."
echo ""

# Test 1: Get all tasks
echo "1. GET /api/tasks"
curl -s $API/tasks | jq .
echo ""

# Test 2: Create task
echo "2. POST /api/tasks"
curl -s -X POST $API/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test from VM","priority":"HIGH","description":"Testing deployment"}' \
  | jq .
echo ""

# Test 3: Get statistics
echo "3. GET /api/tasks/stats"
curl -s $API/tasks/stats | jq .
echo ""

echo "✅ Tests completed!"
EOF
```

```bash
# Change file attribute the can execute
chmod +x test-api.sh

# Install jq for JSON parsing
sudo apt install -y jq

# Run tests
./test-api.sh
```

### 7.2 Monitor Performance (5 min)

```bash
# PM2 monitoring dashboard
pm2 monit

# Shows:
# - CPU usage
# - Memory usage
# - Logs in real-time
# - Process status

# View detailed info
pm2 info task-board-api

# Shows:
# - Uptime
# - Restarts
# - Memory usage
# - CPU usage
```

### 7.3 Log Management (5 min)

```bash
# View live logs
pm2 logs task-board-api

# View last 50 lines
pm2 logs task-board-api --lines 50

# View only errors
pm2 logs task-board-api --err

# Clear old logs
pm2 flush

# Log files location
ls -lh logs/
# error.log, output.log, combined.log
```

---

## PART 8: Documentation (30 minutes)

### 8.1 Create Deployment Guide (15 min)

**Create DEPLOYMENT.md:**

````markdown
# Deployment Guide - Week 5

## Server Information

- **VM OS:** Ubuntu Server 22.04 LTS
- **VM IP:** 192.168.56.101 (example - yours may differ)
- **SSH Access:** ssh devlab@192.168.56.101
- **API Endpoint:** http://192.168.56.101:3000

## Architecture

```
Local Machine (Client)          Virtual Machine (Server)
─────────────────────           ────────────────────────
Frontend (Browser)     ─HTTP─>  Backend (Node.js + PM2)
http://localhost:8080           http://192.168.56.101:3000
                                        │
                                        ▼
                                   Database (SQLite)
```

## Deployment Steps

### 1. Access VM
```bash
ssh devlab@192.168.56.101
password: [your-vm-password]
```

### 2. Navigate to Project
```bash
cd ~/projects/task-board-api
```

### 3. Update Code (if using Git)
```bash
git pull origin main
npm install
```

### 4. Restart Application
```bash
pm2 restart task-board-api
```

### 5. Check Status
```bash
pm2 status
pm2 logs task-board-api --lines 20
```

## Accessing Services

### API (from local machine)
```
http://192.168.56.101:3000/api/tasks
http://192.168.56.101:3000/api/tasks/stats
```
### Frontend (local)
```
http://localhost:8080
```
## Troubleshooting

### API not accessible
```bash
# Check if PM2 is running
pm2 status

# Check firewall
sudo ufw status

# Check if port is listening
sudo netstat -tlnp | grep 3000
```

### Database errors
```bash
# Check database file
ls -lh database/tasks.db

# Test database connection
sqlite3 database/tasks.db "SELECT COUNT(*) FROM tasks;"
```

### Application crashes
```bash
# View error logs
pm2 logs task-board-api --err

# Restart app
pm2 restart task-board-api

# If persistent issues:
pm2 delete task-board-api
pm2 start ecosystem.config.js
```

## Maintenance

### Daily Checks
- `pm2 status` - Check if app is running
- `pm2 logs --lines 20` - Review recent logs

### Weekly Tasks
- `pm2 flush` - Clear old logs
- Check disk space: `df -h`

### Updates
```bash
cd ~/projects/task-board-api
git pull
npm install
pm2 restart task-board-api
```

````

### 8.2 Update README.md (10 min)

````markdown
# Week 5: Task Board - Client-Server Architecture

## Overview

This project demonstrates **Client-Server Architecture** with:
- **Client (Frontend):** Runs on local machine
- **Server (Backend):** Runs on Ubuntu VM
- **Communication:** REST API over HTTP

## Architecture Comparison

### Week 4: Layered (Single Machine)
```
Browser → Node.js (all layers) → Database
        (localhost:3000)
```
### Week 5: Client-Server (Two Machines)
```
Local Browser    → Network → VM (Node.js) → Database
(localhost:8080)             (192.168.56.101:3000)
```
## Project Structure
```
Local Machine:
└── public/
    ├── index.html    # Frontend UI
    ├── style.css     # Styles
    ├── app.js        # Client logic
    └── config.js     # API configuration

Virtual Machine:
└── task-board-api/
    ├── server.js           # Entry point
    ├── ecosystem.config.js # PM2 config
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   └── repositories/
    └── database/
```

## Setup Instructions

### 1. VM Setup
See [DEPLOYMENT.md](DEPLOYMENT.md)

### 2. Local Frontend
```bash
cd public
python -m http.server 8080
# Open http://localhost:8080
```

### 3. Configure API URL
Edit `public/config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://YOUR_VM_IP:3000'
};
```

## Technologies

### Client (Local)
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API for HTTP requests

### Server (VM)
- Ubuntu Server 22.04 LTS
- Node.js 20+
- Express.js 4.18+
- SQLite3
- PM2 (Process Manager)
- CORS (Cross-Origin Resource Sharing)

## API Documentation

Base URL: `http://VM_IP:3000`

### Endpoints

#### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Statistics
- `GET /api/tasks/stats` - Get task statistics

#### Actions
- `PATCH /api/tasks/:id/next-status` - Move to next status

### Example Request
```javascript
fetch('http://192.168.56.101:3000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'New Task',
        description: 'Description',
        priority: 'HIGH'
    })
})
.then(r => r.json())
.then(d => console.log(d));
```
````

---

## ส่วนที่ 9: การวิเคราะห์และเปรียบเทียบ (40 นาที) ⭐ **ต้องทำเอง**

นี่คือส่วนที่สำคัญที่สุดที่แสดงความเข้าใจโดยรวมของคุณเกี่ยวกับ 3 architectures

**สร้างไฟล์ ARCHITECTURE_COMPARISON.md และตอบคำถามต่อไปนี้:**

### 🎯 ส่วนที่ 9.1: การเปรียบเทียบ 3 Architectures (15 คะแนน)

#### คำถาม 1: ตารางเปรียบเทียบแบบละเอียด (10 คะแนน)

สร้างตารางเปรียบเทียบที่ครอบคลุม:

| ด้าน | Week 3:<br>Monolithic | Week 4:<br>Layered | Week 5:<br>Client-Server | อธิบาย |
|------|-------------------|----------------|---------------------|---------|
| **โครงสร้างโค้ด** | | | | |
| - จำนวนไฟล์หลัก | | | | |
| - บรรทัดโค้ดรวม | | | | |
| - ความซับซ้อน | | | | |
| **การ Deploy** | | | | |
| - สภาพแวดล้อม | | | | |
| - ขั้นตอนการติดตั้ง | | | | |
| - เครื่องมือที่ใช้ | | | | |
| **Performance** | | | | |
| - ความเร็ว response | | | | |
| - Latency | | | | |
| - Resource usage | | | | |
| **Maintainability** | | | | |
| - ความง่ายในการแก้บั๊ก | | | | |
| - ความง่ายในการเพิ่มฟีเจอร์ | | | | |
| - Code organization | | | | |
| **Scalability** | | | | |
| - Horizontal scaling | | | | |
| - Vertical scaling | | | | |
| - Load distribution | | | | |
| **Security** | | | | |
| - Database exposure | | | | |
| - API security | | | | |
| - Network security | | | | |
| **Team Collaboration** | | | | |
| - แบ่งงาน | | | | |
| - Parallel development | | | | |
| - Deployment independence | | | | |
| **Cost** | | | | |
| - Development time | | | | |
| - Infrastructure cost | | | | |
| - Maintenance cost | | | | |

**คำแนะนำ:**
- ให้คะแนนหรือระบุข้อมูลเฉพาะในแต่ละช่อง
- อธิบายเหตุผลในคอลัมน์ "อธิบาย"
- ยกตัวอย่างจากการทำ lab จริง

#### คำถาม 2: Quality Attributes Radar Chart (5 คะแนน)

ให้คะแนน Quality Attributes แต่ละตัว (1-10) สำหรับทั้ง 3 architectures:

| Quality Attribute | Monolithic | Layered | Client-Server | อธิบายเหตุผล |
|-------------------|------------|---------|---------------|-------------|
| Performance | | | | |
| Scalability | | | | |
| Reliability | | | | |
| Security | | | | |
| Maintainability | | | | |
| Testability | | | | |
| Modifiability | | | | |
| Reusability | | | | |
| Simplicity | | | | |
| Deployability | | | | |

**วาด Radar Chart (ด้วยมือหรือเครื่องมือ) และแนบ screenshot/รูปภาพ**

### 🎯 ส่วนที่ 9.2: สถานการณ์การใช้งานจริง (10 คะแนน)

#### คำถาม 3: เลือก Architecture ที่เหมาะสม

สำหรับแต่ละสถานการณ์ เลือก architecture ที่เหมาะสมที่สุดและอธิบายเหตุผล:

**สถานการณ์ 1: Startup MVP (Minimum Viable Product)**
- ทีม: 2 developers
- งบประมาณ: จำกัด
- เวลา: 1 เดือน
- ผู้ใช้: คาดว่า < 100 คน
- ฟีเจอร์: พื้นฐาน

**คำตอบของคุณ:**
```
Architecture ที่เลือก: _________________

เหตุผล:




ข้อดีในกรณีนี้:




ข้อเสียที่ยอมรับได้:




```

**สถานการณ์ 2: ระบบ E-Commerce ขนาดกลาง**
- ทีม: 5-8 developers
- งบประมาณ: ปานกลาง
- ผู้ใช้: คาดว่า 10,000-50,000 คน
- ฟีเจอร์: หลากหลาย (สินค้า, การชำระเงิน, จัดส่ง)
- ต้องการ: มีการพัฒนาต่อเนื่องและเพิ่มฟีเจอร์บ่อย

**คำตอบของคุณ:**
```
Architecture ที่เลือก: _________________

เหตุผล:




ข้อดีในกรณีนี้:




ข้อเสียที่ยอมรับได้:




```

**สถานการณ์ 3: แอป Mobile Banking**
- ทีม: 15+ developers (แบ่งเป็นหลายทีม)
- งบประมาณ: สูง
- ผู้ใช้: หลักล้านคน
- ฟีเจอร์: ซับซ้อน, ต้องมีความปลอดภัยสูง
- ต้องการ: Scalability สูง, Availability 99.99%

**คำตอบของคุณ:**
```
Architecture ที่เลือก: _________________

เหตุผล:




ข้อดีในกรณีนี้:




ข้อเสียที่ยอมรับได้:




```

**สถานการณ์ 4: เครื่องมือภายในองค์กร (Internal Tool)**
- ทีม: 1-2 developers
- ผู้ใช้: 20-50 พนักงาน
- ฟีเจอร์: เฉพาะเจาะจง, ไม่ซับซ้อน
- ต้องการ: พัฒนาเร็ว, ใช้งานง่าย

**คำตอบของคุณ:**
```
Architecture ที่เลือก: _________________

เหตุผล:




ข้อดีในกรณีนี้:




ข้อเสียที่ยอมรับได้:




```

### 🎯 ส่วนที่ 9.3: ประสบการณ์จริง (10 คะแนน)

#### คำถาม 4: ความท้าทายในการ Deploy

**ก. เปรียบเทียบขั้นตอนการ deploy:**

| ขั้นตอน | Monolithic | Layered | Client-Server |
|---------|------------|---------|---------------|
| 1. | | | |
| 2. | | | |
| 3. | | | |
| ... | | | |
| ความยาก (1-10) | | | |

**คำถาม:**
1. การ deploy แบบไหนยากที่สุด? เพราะอะไร?
2. ความยากที่เพิ่มขึ้นคุ้มค่าหรือไม่? อธิบาย

**คำตอบของคุณ:**
```








```

**ข. Network Issues ที่พบ:**

1. คุณพบปัญหา network อะไรบ้างใน Week 5?
2. แก้ไขอย่างไร?
3. ถ้าต้อง deploy จริง คุณจะป้องกันปัญหาเหล่านี้อย่างไร?

**คำตอบของคุณ:**
```








```

#### คำถาม 5: Evolution Path

**สมมติคุณเริ่มต้นด้วย Monolithic (Week 3):**

1. ในกรณีใดที่คุณควร refactor ไปเป็น Layered (Week 4)?
2. ในกรณีใดที่คุณควร deploy แบบ Client-Server (Week 5)?
3. สร้าง flowchart แสดง decision path สำหรับการ evolve architecture

**คำตอบของคุณ:**
```
1. Refactor ไปเป็น Layered เมื่อ:
-
-
-

2. Deploy แบบ Client-Server เมื่อ:
-
-
-

3. Decision Flowchart:
(วาดหรือ describe)








```

### 🎯 ส่วนที่ 9.4: บทเรียนที่ได้เรียนรู้ (5 คะแนน)

#### คำถาม 6: บทเรียนสำคัญ

**ก. Top 3 บทเรียนจากการทำ Lab ทั้ง 3 สัปดาห์:**

1. 
2. 
3. 

**ข. สิ่งที่คุณจะทำต่างถ้าเริ่มใหม่:**

1. 
2. 
3. 

**ค. ทักษะที่ได้เพิ่มขึ้นมากที่สุด:**

1. 
2. 
3. 

**ง. สิ่งที่ยังสับสนหรืออยากเรียนรู้เพิ่มเติม:**

1. 
2. 
3. 

---

## 📤 การส่งงานและเกณฑ์การให้คะแนน

### Checklist การส่งงาน:

**VM Setup:**
- [ ] Ubuntu Server ติดตั้งและทำงาน
- [ ] การเชื่อมต่อ network ทำงาน
- [ ] Firewall ตั้งค่าแล้ว
- [ ] SSH access ใช้งานได้

**Backend Deployment:**
- [ ] โค้ด deploy ไปยัง VM แล้ว
- [ ] Dependencies ติดตั้งแล้ว
- [ ] ฐานข้อมูลเริ่มต้นแล้ว
- [ ] PM2 จัดการ process
- [ ] Auto-start เมื่อ boot ตั้งค่าแล้ว

**Client-Server Integration:**
- [ ] Frontend เข้าถึง API จากเครื่อง local
- [ ] CORS ตั้งค่าถูกต้อง
- [ ] CRUD operations ทั้งหมดทำงาน
- [ ] Error handling ทำงาน

**การวิเคราะห์:** ⭐
- [ ] **ARCHITECTURE_COMPARISON.md เสร็จสมบูรณ์**
- [ ] ตารางเปรียบเทียบครบถ้วน
- [ ] Quality Attributes Radar Chart
- [ ] สถานการณ์การใช้งานทั้งหมดตอบแล้ว
- [ ] บทเรียนที่ได้เรียนรู้เขียนครบ

**เอกสาร:**
- [ ] DEPLOYMENT.md เสร็จสมบูรณ์
- [ ] README.md อัพเดทสำหรับ client-server
- [ ] REFLECTION.md ตอบคำถามแล้ว
- [ ] Screenshots ของระบบที่ทำงาน

### Screenshots ที่ต้องส่ง:

1. **VM IP Address**
   ```bash
   hostname -I
   ```

2. **PM2 Status**
   ```bash
   pm2 status
   ```

3. **API Response** (จาก local browser)
   ```
   http://VM_IP:3000/api/tasks
   ```

4. **Frontend ทำงาน** (แสดงการสร้าง task)

5. **PM2 Logs**
   ```bash
   pm2 logs --lines 20
   ```

6. **Network Ping Test**
   ```bash
   ping VM_IP
   ```

### ส่งงาน:

1. **GitHub Repository** พร้อม:
   - โค้ด Backend
   - โค้ด Frontend
   - เอกสารทั้งหมด
   - โฟลเดอร์ screenshots

2. **ข้อมูล VM Access** (ในเอกสารแยก):
   - VM IP address
   - SSH credentials (username เท่านั้น ไม่ใส่ passwords)
   - API endpoint URLs

### เกณฑ์การให้คะแนน (40 คะแนน):

| หัวข้อ | คะแนน | รายละเอียด |
|-------|------|-----------|
| **1. VM Setup** | 4 | Ubuntu ติดตั้ง, network ตั้งค่า, เข้าถึงได้ |
| **2. Backend Deployment** | 4 | โค้ด deploy, dependencies ติดตั้ง, ทำงาน |
| **3. PM2 Configuration** | 3 | PM2 setup ถูกต้อง, auto-start ตั้งค่า |
| **4. Client-Server Integration** | 4 | Frontend สื่อสารกับ backend API |
| **5. Functionality** | 3 | CRUD operations ทำงานถูกต้อง |
| **6. การวิเคราะห์** ⭐ | 15 | **ARCHITECTURE_COMPARISON.md** |
|    - คำถาม 1-2 | 15 | ตารางเปรียบเทียบและ Radar Chart |
|    - คำถาม 3 | 10 | สถานการณ์การใช้งาน |
|    - คำถาม 4-5 | 10 | ประสบการณ์และ Evolution |
|    - คำถาม 6 | 5 | บทเรียนที่ได้เรียนรู้ |
| **7. Documentation** | 3 | Deployment guide, README, reflection |
| **8. Screenshots** | 2 | Screenshots ครบทั้งหมด |
| **9. Code Quality** | 2 | โค้ดสะอาด, ทำงานได้ดี |
| **รวม** | **40** | |

**หมายเหตุ:** การวิเคราะห์ (ข้อ 6) มีน้ำหนัก 37.5% ของคะแนนทั้งหมด

---

## 🛠️ แก้ปัญหาเบื้องต้น

### ปัญหา VM

**ไม่สามารถเริ่ม VM:**
```
- ตรวจสอบ virtualization เปิดใช้งานใน BIOS
- ตรวจสอบว่ามี RAM เพียงพอ
- ลองลด VM RAM เป็น 1024 MB
```

**ไม่สามารถเชื่อมต่อ internet:**
```bash
# ตรวจสอบ network adapter
ip addr show

# Restart network
sudo systemctl restart networking

# ทดสอบ DNS
ping 8.8.8.8
```

### การเชื่อมต่อ Network

**ไม่สามารถ ping VM จากเครื่อง local:**
```
1. ตรวจสอบ VM IP: hostname -I
2. ตรวจสอบ VM firewall: sudo ufw status
3. ลอง NAT with port forwarding แทน Host-Only
4. ปิด host firewall ชั่วคราวเพื่อทดสอบ
```

**ไม่สามารถเข้าถึง API จาก browser:**
```
1. ตรวจสอบ PM2: pm2 status
2. ตรวจสอบ port listening: sudo netstat -tlnp | grep 3000
3. ทดสอบจาก VM: curl localhost:3000/api/tasks
4. ตรวจสอบการตั้งค่า CORS
```

### ปัญหาแอปพลิเคชัน

**PM2 app crash ตลอด:**
```bash
# ดู detailed logs
pm2 logs task-board-api --err

# แก้ไขทั่วไป:
# 1. path ฐานข้อมูลผิด
nano .env  # ตรวจสอบ DB_PATH

# 2. Port ถูกใช้
sudo lsof -i :3000
pm2 restart task-board-api

# 3. Dependencies หาย
npm install
pm2 restart task-board-api
```

**Database errors:**
```bash
# ตรวจสอบ file permissions
ls -l database/tasks.db

# Reset database
cd database
rm tasks.db
sqlite3 tasks.db < schema.sql
```

**CORS errors ใน browser:**
```javascript
// ตรวจสอบ server.js มี:
const cors = require('cors');
app.use(cors());

// Restart PM2
pm2 restart task-board-api
```

### SSH Issues

**ไม่สามารถ SSH ไปยัง VM:**
```bash
# ตรวจสอบ SSH service
sudo systemctl status ssh

# เริ่ม SSH
sudo systemctl start ssh

# เปิดใช้งาน auto-start
sudo systemctl enable ssh

# ตรวจสอบ firewall
sudo ufw allow 22/tcp
```

---

## 🎯 Best Practices ที่ได้เรียนรู้

### 1. Deployment
- ทดสอบ local ก่อน deploy เสมอ
- ใช้ environment variables สำหรับการตั้งค่า
- แยก production และ development

### 2. Process Management
- ใช้ PM2 สำหรับ production Node.js apps
- ตั้งค่า auto-restart เมื่อล้มเหลว
- ตรวจสอบ logs เป็นประจำ

### 3. Network Security
- ใช้ firewall (ufw) เพื่อควบคุมการเข้าถึง
- เปิดเฉพาะ ports ที่จำเป็น
- ใช้ HTTPS ใน production จริง (ไม่ครอบคลุมใน lab นี้)

### 4. Documentation
- จดขั้นตอนการ deploy
- เก็บ IP addresses และ credentials ให้ปลอดภัย
- จัดทำคู่มือการแก้ปัญหา
---

## 📚 Additional Resources

### VirtualBox
- Official docs: https://www.virtualbox.org/manual/
- Network guide: https://www.virtualbox.org/manual/ch06.html

### Ubuntu Server
- Official docs: https://ubuntu.com/server/docs
- Network configuration: https://ubuntu.com/server/docs/network-configuration

### PM2
- Official docs: https://pm2.keymetrics.io/docs/
- Best practices: https://pm2.keymetrics.io/docs/usage/application-declaration/

### REST API
- HTTP methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## 🎉 ยินดีด้วย!

คุณได้สำเร็จ:
- ✅ Setup production-like environment ด้วย VM
- ✅ Deploy Node.js backend ไปยัง Ubuntu Server
- ✅ ตั้งค่า client-server architecture
- ✅ จัดการ processes ด้วย PM2
- ✅ จัดการ cross-origin requests ด้วย CORS
- ✅ **วิเคราะห์และเปรียบเทียบ 3 architectures** ⭐

**นี่คือประสบการณ์การ deploy จริง!**

การตั้งค่าแบบนี้ใช้กันใน:
- Cloud platforms (AWS EC2, DigitalOcean, Linode)
- สภาพแวดล้อมองค์กร
- แอปพลิเคชันเว็บ production
- Mobile app backends

**ทักษะที่ได้รับสามารถนำไปใช้ได้จริงในอุตสาหกรรม!**

---

*ENGCE301 - Software Design and Development*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*  
*ภาควิชาวิศวกรรมซอฟต์แวร์*
