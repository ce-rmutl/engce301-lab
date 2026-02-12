# 🚀 Quick Start Guide - Week 3 Solution Code

## ⚡ วิธีรันแบบเร็วที่สุด (3 ขั้นตอน)

### ✅ Prerequisites

ตรวจสอบว่าติดตั้งแล้ว:
```bash
node --version    # ควรได้ v20.x.x
npm --version     # ควรได้ 10.x.x
sqlite3 --version # ควรได้ 3.x.x
```

ถ้ายังไม่มี ดู [Installation Guide](#installation-guide) ด้านล่าง

---

## 🎯 3 Steps to Run

### Step 1: Install Dependencies (30 วินาที)

```bash
cd week3-solution-code
npm install
```

### Step 2: Create Database (5 วินาที)

```bash
cd database
sqlite3 tasks.db < schema.sql
cd ..
```

ตรวจสอบ:
```bash
sqlite3 database/tasks.db "SELECT * FROM tasks;"
```
ควรเห็น 4 tasks

### Step 3: Run Server (1 วินาที)

```bash
npm run dev
```

หรือ

```bash
npm start
```

### ✅ เปิดเบราว์เซอร์:

```
http://localhost:3000
```

**เสร็จแล้ว!** 🎉

---

## 🎬 One-Line Setup (สำหรับ Linux/Mac)

```bash
cd week3-solution-code && npm install && cd database && sqlite3 tasks.db < schema.sql && cd .. && npm run dev
```

---

## 🪟 สำหรับ Windows

### Step 1: Install Dependencies

```cmd
cd week3-solution-code
npm install
```

### Step 2: Create Database

```cmd
cd database
sqlite3 tasks.db < schema.sql
cd ..
```

หรือใช้ PowerShell:
```powershell
cd week3-solution-code\database
Get-Content schema.sql | sqlite3 tasks.db
cd ..
```

### Step 3: Run

```cmd
npm run dev
```

---

## 🐳 Using Docker (ถ้ามี Docker)

```bash
# Build image
docker build -t task-board .

# Run container
docker run -p 3000:3000 task-board

# Open browser
http://localhost:3000
```

---

## 🧪 Testing

### Test Backend API (ใช้ curl หรือ Thunder Client)

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"HIGH"}'

# Update status
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Test Frontend

1. เปิด `http://localhost:3000`
2. สร้าง task ใหม่
3. ลาก task ระหว่าง columns
4. ลบ task
5. ใช้ filter dropdown

---

## 🔧 Troubleshooting

### ❌ Error: Cannot find module 'express'

```bash
npm install
```

### ❌ Error: EADDRINUSE (Port 3000 ถูกใช้)

**Option 1:** เปลี่ยน port
```javascript
// ใน server.js
const PORT = 3001; // เปลี่ยนจาก 3000
```

**Option 2:** Kill process
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ Error: sqlite3: command not found

ติดตั้ง SQLite:
```bash
# Ubuntu/WSL
sudo apt update
sudo apt install sqlite3

# macOS
brew install sqlite3

# Windows
# Download from https://sqlite.org/download.html
```

### ❌ Error: Database file not found

สร้าง database:
```bash
cd database
sqlite3 tasks.db < schema.sql
```

### ❌ Frontend ไม่แสดง tasks

1. เช็ค Browser Console (F12)
2. เช็ค Network tab
3. เช็ค server terminal มี errors ไหม
4. Restart server

---

## 📦 Project Files

```
week3-solution-code/
├── server.js              # Backend (Express + SQLite)
├── package.json           # Dependencies
├── setup.sh              # Auto setup script (Linux/Mac)
├── database/
│   └── schema.sql        # Database schema
├── public/
│   ├── index.html        # Frontend HTML
│   ├── style.css         # Styling
│   └── app.js            # Frontend JavaScript
└── README.md             # Documentation
```

---

## 💡 Development Tips

### Auto-restart on file changes:

```bash
npm run dev  # Uses nodemon
```

### Check database directly:

```bash
sqlite3 database/tasks.db
sqlite> SELECT * FROM tasks;
sqlite> .quit
```

### View logs:

```bash
# Server logs appear in terminal
# Browser logs in DevTools Console (F12)
```

### Reset database:

```bash
cd database
rm tasks.db
sqlite3 tasks.db < schema.sql
cd ..
```

---

## 🎯 What to Test

### ✅ Must Work:

- [ ] Server starts without errors
- [ ] Can open http://localhost:3000
- [ ] Tasks display in columns
- [ ] Can create new task
- [ ] Can move task between columns
- [ ] Can delete task
- [ ] Filter dropdown works
- [ ] No console errors

### 🎨 UI Features:

- [ ] Gradient background
- [ ] 3 columns (TODO, IN PROGRESS, DONE)
- [ ] Task cards with priority badges
- [ ] Loading overlay
- [ ] Responsive design

### 🔌 API Features:

- [ ] GET /api/tasks returns all tasks
- [ ] POST /api/tasks creates task
- [ ] PATCH /api/tasks/:id/status updates status
- [ ] DELETE /api/tasks/:id deletes task

---

## 📊 Performance

**Expected Metrics:**
- Server startup: < 1 second
- Page load: < 500ms
- API response: < 50ms
- UI update: Instant

**Resource Usage:**
- Memory: ~50MB
- CPU: < 1%
- Database: < 100KB

---

## 🚀 Next Steps

เมื่อทำงานได้แล้ว:

1. ✅ เปรียบเทียบกับ Starter Code
2. ✅ เข้าใจ Code ทุกบรรทัด
3. ✅ ลอง Modify Features
4. ✅ ทำ Homework (เพิ่ม Features)

**Week 4:** Refactor เป็น Layered Architecture!

---

## 📖 Learn More

- [README.md](./README.md) - Full documentation
- [server.js](./server.js) - Backend code
- [public/app.js](./public/app.js) - Frontend code

---

## 💬 Need Help?

**Common Issues:**
- Port in use → Change port or kill process
- Module not found → Run `npm install`
- Database error → Recreate database
- UI not updating → Check browser console

**Still stuck?**
- Check README.md
- Review code comments
- Ask instructor/TA
- Check course Discord

---

## 🎉 Success!

เมื่อเห็นหน้าจอนี้แสดงว่าสำเร็จ:

```
==================================================
🚀 Task Board Server Started!
==================================================
📍 URL: http://localhost:3000
📊 Architecture: Monolithic (All-in-one)
📝 Database: SQLite (./database/tasks.db)
⏰ Started at: 2025-01-15 10:00:00
==================================================

💡 Tips:
  - Open http://localhost:3000 in browser
  - Press Ctrl+C to stop server
  - Check README.md for API documentation
```

**Happy Coding! 💻**

---

*Quick Start Guide v1.0*  
*ENGSE207 Software Architecture - Week 3*
