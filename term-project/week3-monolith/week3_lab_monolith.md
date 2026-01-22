# 📘 Week 3 Lab Summary - Quick Reference Guide

## ENGCE301 Software Design and Development
### Monolithic Architecture: Task Board Application 

---

## ⏱️ Time Allocation (Total: 3 hours)

```
├─ Part 1: Environment Setup ......... 60 min
├─ Part 2: Build Application ......... 90 min
└─ Part 3: Documentation ............. 30 min
```

---

## 🎯 What You'll Build

**Task Board Application** - A simple task management system using Monolithic Architecture

**Features:**
- View all tasks in kanban board
- Create new tasks
- Move tasks (TODO → IN_PROGRESS → DONE)
- Delete tasks
- Filter by status

**Tech Stack:**
- Node.js + Express.js
- SQLite Database
- HTML/CSS/JavaScript

---

## 🚀 Quick Start Commands

```bash
# 1. Create project
mkdir week3-monolithic && cd week3-monolithic
npm init -y

# 2. Install dependencies
npm install express sqlite3
npm install --save-dev nodemon

# 3. Create structure
mkdir public database
touch server.js database/schema.sql
touch public/index.html public/style.css public/app.js

# 4. Setup database
cd database
sqlite3 tasks.db < schema.sql
cd ..

# 5. Run server
npm run dev

# 6. Open browser
# http://localhost:3000
```

---

## 📂 Final Project Structure

```
week3-monolithic/
├── server.js              # Main app (all backend)
├── package.json
├── database/
│   ├── schema.sql        # DB schema
│   └── tasks.db          # SQLite file
├── public/
│   ├── index.html        # UI
│   ├── style.css         # Styles
│   └── app.js            # Frontend JS
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints You'll Create

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update status only |

---

## 💾 Database Schema

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏗️ Monolithic Architecture Diagram

```
┌─────────────────────────────────────┐
│   Monolithic Application            │
│   (Single Process, Single Codebase) │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Frontend (HTML/CSS/JS)       │  │
│  │  - Views                      │  │
│  │  - User Interface             │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Backend (Express.js)         │  │
│  │  - Routes                     │  │
│  │  - Business Logic             │  │
│  │  - Database Access            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Database (SQLite)            │  │
│  │  - Tasks Table                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                   │
                   ▼
             Single Deployment
             Single Server
             Port 3000
```

---

## ✅ Advantages of Monolithic

| Advantage | Description |
|-----------|-------------|
| 🚀 **Simple** | Easy to develop, test, deploy |
| ⚡ **Fast** | No network overhead (in-process calls) |
| 🧪 **Easy Testing** | Test everything together |
| 📦 **Single Deploy** | One file, one deployment |
| 💰 **Low Cost** | Minimal infrastructure |

---

## ❌ Disadvantages of Monolithic

| Disadvantage | Description |
|--------------|-------------|
| 📈 **Hard to Scale** | Must scale entire app |
| 🔗 **Tight Coupling** | Components depend on each other |
| 🐌 **Large Codebase** | Becomes slow over time |
| 🔧 **Tech Lock-in** | Stuck with one technology |
| 👥 **Team Issues** | Hard for large teams |

---

## 🛠️ Installation Checklist

### Before Lab:

- [ ] Windows 10/11 or macOS/Linux
- [ ] 8GB RAM minimum
- [ ] 10GB free disk space
- [ ] Internet connection

### During Lab:

- [ ] WSL2/Ubuntu installed (Windows)
- [ ] Node.js 20+ installed
- [ ] npm installed
- [ ] SQLite3 installed
- [ ] Git installed
- [ ] VS Code + Extensions

---

## 📝 Key Code Snippets

### server.js (Minimal Example)

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database/tasks.db');

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ tasks: rows });
        }
    });
});

// POST create task
app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    db.run(
        'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
        [title, description, priority],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### app.js (Frontend - Fetch Example)

```javascript
// Fetch all tasks
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    renderTasks(data.tasks);
}

// Create task
async function createTask(taskData) {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    const data = await response.json();
    return data;
}

// Load on page load
document.addEventListener('DOMContentLoaded', fetchTasks);
```

---

## 🧪 Testing Checklist

Test each feature:

- [ ] **View Tasks** - See all tasks on page load
- [ ] **Create Task** - Add new task via form
- [ ] **Update Status** - Move task between columns
- [ ] **Delete Task** - Remove task
- [ ] **Filter** - Filter by status dropdown

Use Thunder Client or Postman to test API directly.

---

## 📤 Submission Requirements

### Files to Submit:

1. **Source Code**
   - All .js, .html, .css files
   - schema.sql
   - package.json

2. **Documentation**
   - README.md (setup instructions, architecture)
   - REFLECTION.md (answers to questions)

3. **Git**
   - Meaningful commit messages
   - .gitignore (node_modules, *.db)

### Submission Method:

**Option A:** GitHub Repository URL  
**Option B:** ZIP file (no node_modules)

---

## 🎓 Learning Outcomes

After this lab, you should be able to:

✅ Explain what Monolithic Architecture is  
✅ Build a full-stack app with Node.js + Express  
✅ Create REST API endpoints  
✅ Use SQLite database  
✅ Understand when to use Monolithic  
✅ Identify trade-offs of Monolithic  

---

## 💡 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
```bash
Solution: npm install
```

### Issue: Port 3000 already in use
```bash
# Change port in server.js
const PORT = 3001;

# Or kill process
lsof -i :3000
kill -9 <PID>
```

### Issue: Database locked
```bash
# Close SQLite Viewer in VS Code
# Restart server
```

### Issue: CORS errors
```javascript
// Add to server.js
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
```

---

## 🔜 Next Week: Layered Architecture

We'll refactor this monolithic app into **3 layers**:

```
Week 3 (Monolithic)        Week 4 (Layered)
─────────────────────      ─────────────────────
┌─────────────────┐        ┌─────────────────┐
│   Everything    │        │ Presentation    │
│   in One        │   →    ├─────────────────┤
│                 │        │ Business Logic  │
└─────────────────┘        ├─────────────────┤
                           │ Data Access     │
                           └─────────────────┘
```

**Prepare:**
- Review your Week 3 code
- Study "Separation of Concerns"
- Read about MVC Pattern

---

## 📚 Additional Resources

### Documentation:
- Express.js: https://expressjs.com
- SQLite: https://sqlite.org/docs.html
- Node.js: https://nodejs.org/docs

### Video Tutorials:
- Node.js Crash Course (Traversy Media)
- Express.js Tutorial (Net Ninja)
- REST API Design (freeCodeCamp)

### Reading:
- "Monolithic vs Microservices" - Martin Fowler
- "Building REST APIs with Express"

---

## ✉️ Get Help

**During Lab:**
- Ask TA or instructor
- Check Discord channel

**After Lab:**
- Email: thanit@example.com
- Office Hours: Tue/Thu 14:00-16:00
- GitHub Issues in course repo

---

## 🎯 Grading Rubric (10 points)

| Criteria | Points | What's Evaluated |
|----------|--------|------------------|
| **Functionality** | 4 | All features work correctly |
| **Code Quality** | 2 | Clean, commented, organized |
| **Documentation** | 2 | Complete README + Reflection |
| **Git Usage** | 1 | Meaningful commits |
| **Creativity** | 1 | UI improvements, extra features |

**Bonus:** +1 point for implementing extra challenges

---

## 🏆 Extra Challenges (Optional)

If you finish early:

1. **Add Search** - Search tasks by title
2. **Add Categories** - Tag tasks (Work, Personal, etc.)
3. **Add Due Dates** - Set deadlines, show overdue
4. **Dark Mode** - Toggle theme
5. **Export/Import** - JSON file support

---

## 🎉 Summary

**What You Learned:**
- ✅ Setup development environment
- ✅ Build monolithic application
- ✅ Create REST API
- ✅ Use SQLite
- ✅ Frontend-backend integration
- ✅ Git basics
- ✅ Architectural thinking

**Keep This Code!**  
We'll use it next week for refactoring!

**Good Luck! 💪**

---

*Quick Reference Guide v1.0*  
*ENGCE301 Software Design and Development - Week 3*  
*Monolithic Architecture Lab*
