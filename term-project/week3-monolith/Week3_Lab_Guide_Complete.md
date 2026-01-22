# 🚀 ENGCE301 Lab Guide - Week 3
## Monolithic Architecture: Task Board Application

**Week:** 3 | **Duration:** 3 hours | **Difficulty:** ⭐⭐

---

## 📋 Table of Contents

1. [Learning Objectives](#learning-objectives)
2. [Part 1: Environment Setup (60 min)](#part-1-environment-setup)
3. [Part 2: Build Application (90 min)](#part-2-build-application)
4. [Part 3: Documentation (30 min)](#part-3-documentation)
5. [Submission & Grading](#submission)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Learning Objectives

✅ Setup Development Environment (WSL/Ubuntu + Node.js)  
✅ Build Monolithic Application from scratch  
✅ Implement CRUD operations  
✅ Use SQLite Database  
✅ Git version control  
✅ Understand Monolithic Architecture

---

## PART 1: Environment Setup (60 minutes)

### 1.1 Install WSL2/Ubuntu (20 min)

**Windows Users:**

```powershell
# PowerShell (Admin)
wsl --install -d Ubuntu-22.04
wsl --set-default-version 2
# Restart computer
```

**After restart:**
```bash
# Ubuntu terminal will open
# Set username and password
# Update system
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (15 min)

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 1.3 Install SQLite (10 min)

```bash
sudo apt install -y sqlite3
sqlite3 --version
```

### 1.4 Install VS Code Extensions (10 min)

Install these extensions:
- Remote - WSL
- ESLint
- Prettier
- SQLite Viewer
- Thunder Client

### 1.5 Install Git (5 min)

```bash
sudo apt install -y git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

✅ **Checkpoint:** All tools ready!

---

## PART 2: Build Monolithic Application (90 minutes)

### 2.1 Project Setup (15 min)

```bash
mkdir -p ~/engse207-labs/week3-monolithic
cd ~/engse207-labs/week3-monolithic

# Initialize npm
npm init -y

# Install dependencies
npm install express sqlite3
npm install --save-dev nodemon

# Create folders
mkdir public database
touch server.js database/schema.sql
touch public/{index.html,style.css,app.js}
touch .gitignore README.md
```

**Edit package.json scripts:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 2.2 Create Database (15 min)

**database/schema.sql:**
```sql
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status, priority) VALUES
('Setup Environment', 'Install tools', 'DONE', 'HIGH'),
('Learn Monolithic', 'Study architecture', 'IN_PROGRESS', 'HIGH'),
('Build App', 'Create CRUD', 'TODO', 'MEDIUM');
```

```bash
cd database
sqlite3 tasks.db < schema.sql
sqlite3 tasks.db "SELECT * FROM tasks;"
cd ..
```

### 2.3 Build Backend (30 min)

**server.js** - ดูโค้ดเต็มในไฟล์แนบ

Key endpoints:
- GET /api/tasks
- POST /api/tasks  
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/status

### 2.4 Build Frontend (30 min)

**public/index.html** - Task Board UI  
**public/style.css** - Styling  
**public/app.js** - Frontend logic  

(ดูโค้ดเต็มในไฟล์แนบ)

### 2.5 Testing (15 min)

```bash
npm run dev
# Open http://localhost:3000
```

Test all features:
- ✅ View tasks
- ✅ Create task
- ✅ Move task (TODO → IN_PROGRESS → DONE)
- ✅ Delete task
- ✅ Filter by status

---

## PART 3: Documentation (30 minutes)

### 3.1 Git Setup (15 min)

```bash
git init
git add .
git commit -m "Week 3: Initial commit - Monolithic Task Board"
```

### 3.2 Write README.md (10 min)

Include:
- Project overview
- Installation steps
- API endpoints
- Architecture diagram
- Advantages/Disadvantages

### 3.3 Reflection (5 min)

Answer questions in REFLECTION.md:
1. What did you learn?
2. Main advantages of monolithic?
3. Challenges encountered?
4. When to use monolithic?

---

## 📤 Submission

### Checklist:
- [ ] App runs without errors
- [ ] All CRUD operations work
- [ ] README.md complete
- [ ] REFLECTION.md answered
- [ ] Git commits meaningful
- [ ] No node_modules in Git

### Submit:
- GitHub URL or
- ZIP file (exclude node_modules, *.db)

### Grading (10 points):
- Functionality: 4 pts
- Code Quality: 2 pts  
- Documentation: 2 pts
- Git Usage: 1 pt
- Creativity: 1 pt

---

## 💡 Troubleshooting

**Port 3000 in use:**
```bash
# Change port in server.js or:
lsof -i :3000
kill -9 <PID>
```

**Cannot find module:**
```bash
npm install
```

**Database locked:**
- Close SQLite Viewer in VS Code
- Restart server

---

## 🎉 Congratulations!

You built your first Monolithic Application!

**Next Week:** Refactor to Layered Architecture

---

*Full code examples available in separate files*
*Contact: thanit@example.com*
