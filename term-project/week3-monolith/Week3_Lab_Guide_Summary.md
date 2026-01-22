# 🚀 ENGCE301 Lab Guide - Week 3 (Summary Version)
## Monolithic Architecture: Task Board Application

---

## 📋 Lab Overview

**Duration:** 3 hours (180 minutes)  
**Difficulty:** ⭐⭐ Beginner-Intermediate  
**Goal:** สร้าง Task Management System แบบ Monolithic Architecture

### What You'll Build:
- ✅ Full-stack web application (Frontend + Backend + Database)
- ✅ REST API with CRUD operations
- ✅ Interactive UI with HTML/CSS/JavaScript
- ✅ SQLite database

### Tech Stack:
```
Backend:  Node.js + Express.js
Database: SQLite
Frontend: HTML + CSS + Vanilla JS
Tools:    Git, VS Code, npm
```

---

## ⏱️ Time Breakdown

| Part | Activity | Time |
|------|----------|------|
| 1 | Environment Setup | 60 min |
| 2 | Database Setup | 20 min |
| 3 | Backend Development | 40 min |
| 4 | Frontend Development | 30 min |
| 5 | Testing & Documentation | 30 min |

---

## 🔧 PART 1: Environment Setup (60 min)

### Quick Installation Commands

```bash
# 1. Install WSL2 (Windows only - PowerShell as Admin)
wsl --install -d Ubuntu-22.04
wsl --set-default-version 2

# 2. Update System (in Ubuntu/WSL)
sudo apt update && sudo apt upgrade -y

# 3. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install SQLite
sudo apt install -y sqlite3

# 5. Install Git
sudo apt install -y git

# 6. Verify Installation
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
sqlite3 --version # Should show 3.x.x
git --version     # Should show 2.x.x
```

### Project Setup

```bash
# Create project directory
mkdir -p ~/engse207-labs/week3-monolithic
cd ~/engse207-labs/week3-monolithic

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express sqlite3
npm install --save-dev nodemon

# Create project structure
mkdir public database
touch server.js database/schema.sql public/{index.html,style.css,app.js} .gitignore README.md

# Initialize Git
git init
```

### Project Structure

```
week3-monolithic/
├── server.js                 # Main application
├── package.json
├── database/
│   ├── schema.sql           # Database schema
│   └── tasks.db             # SQLite database (auto-generated)
├── public/
│   ├── index.html           # Frontend UI
│   ├── style.css            # Styles
│   └── app.js               # Client JavaScript
├── .gitignore
└── README.md
```

---

## 💾 PART 2: Database Setup (20 min)

### Create Schema (database/schema.sql)

```sql
-- Drop existing table
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))
);

-- Insert sample data
INSERT INTO tasks (title, description, status, priority) VALUES
    ('Setup Environment', 'Install tools', 'DONE', 'HIGH'),
    ('Learn Architecture', 'Study patterns', 'IN_PROGRESS', 'HIGH'),
    ('Build Application', 'Create Task Board', 'TODO', 'HIGH');
```

### Initialize Database

```bash
cd database
sqlite3 tasks.db < schema.sql
sqlite3 tasks.db "SELECT * FROM tasks;"
cd ..
```

---

## 🔨 PART 3: Backend Development (40 min)

### Basic Server (server.js) - Minimal Version

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database
const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) console.error('DB Error:', err);
    else console.log('✅ Database connected');
});

// ROUTES

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: rows });
    });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true, data: row });
    });
});

// CREATE task
app.post('/api/tasks', (req, res) => {
    const { title, description, status, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    
    const sql = 'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)';
    db.run(sql, [title, description || null, status || 'TODO', priority || 'MEDIUM'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
            res.status(201).json({ success: true, data: row });
        });
    });
});

// UPDATE task
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status, priority } = req.body;
    const sql = `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`;
    
    db.run(sql, [title, description, status, priority, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
            res.json({ success: true, data: row });
        });
    });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

### Test API

```bash
# Start server
npm start

# Test in another terminal
curl http://localhost:3000/api/tasks
```

---

## 🎨 PART 4: Frontend (30 min)

### HTML (public/index.html) - Minimal

```html
<!DOCTYPE html>
<html>
<head>
    <title>Task Board</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header><h1>📋 Task Board</h1></header>
    
    <main class="container">
        <!-- Add Task Form -->
        <form id="addTaskForm">
            <input type="text" id="title" placeholder="Task title" required>
            <textarea id="description" placeholder="Description"></textarea>
            <select id="status">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
        
        <!-- Tasks List -->
        <div id="tasksContainer"></div>
    </main>
    
    <script src="app.js"></script>
</body>
</html>
```

### CSS (public/style.css) - Minimal

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: Arial, sans-serif;
    background: #f5f5f5;
}

header {
    background: #3498db;
    color: white;
    padding: 2rem;
    text-align: center;
}

.container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

form {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background: #3498db;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover { background: #2980b9; }

#tasksContainer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.task-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #3498db;
}

.task-card h3 { margin-bottom: 0.5rem; }
.task-card p { color: #666; margin-bottom: 1rem; }
.task-card button { margin-right: 0.5rem; }
```

### JavaScript (public/app.js) - Minimal

```javascript
const API = '/api/tasks';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task form
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value
    };
    
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    
    e.target.reset();
    loadTasks();
});

// Load all tasks
async function loadTasks() {
    const res = await fetch(API);
    const { data } = await res.json();
    
    const container = document.getElementById('tasksContainer');
    container.innerHTML = data.map(task => `
        <div class="task-card">
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <span>Status: ${task.status}</span><br>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTasks();
}
```

---

## ✅ PART 5: Testing & Documentation (30 min)

### Manual Testing

```
✅ Open http://localhost:3000
✅ Create new task
✅ View all tasks
✅ Delete task
✅ Check database: sqlite3 database/tasks.db "SELECT * FROM tasks;"
```

### Write README.md

```markdown
# Task Board - Monolithic Architecture

## Features
- View all tasks
- Create new task
- Delete task

## Setup
```bash
npm install
npm start
```

## Architecture
Monolithic - All in one application (Frontend + Backend + Database)

## Tech Stack
- Node.js + Express.js
- SQLite
- HTML/CSS/JavaScript
```

### Git Commits

```bash
git add .
git commit -m "Initial setup and database"
git commit -m "Complete backend API"
git commit -m "Complete frontend UI"
git commit -m "Add documentation"
```

---

## 🎯 Evaluation (10 points)

| Criteria | Points |
|----------|--------|
| Environment Setup | 1 |
| Database | 1 |
| Backend API | 3 |
| Frontend UI | 2 |
| Testing | 1 |
| Documentation | 1 |
| Git | 1 |

---

## 🐛 Common Issues

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Cannot find module
```bash
npm install
```

### Database locked
```bash
# Close all SQLite connections
# Restart server
```

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [SQLite Tutorial](https://www.sqlite.org/docs.html)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🎉 What's Next?

**Week 4:** Refactor เป็น **Layered (3-Tier) Architecture**
- Presentation Layer
- Business Logic Layer  
- Data Access Layer

---

*ENGCE301 - Software Design and Development*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
