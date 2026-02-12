# 🎯 Week 3 Starter Code - Task Board Monolithic

**ENGSE207 Software Architecture - Week 3 Lab**

---

## 📋 Overview

This is a **starter code template** for building a Task Board application with Monolithic Architecture. You will implement the missing parts following the TODO comments in the code.

---

## 🎓 Learning Objectives

By completing this lab, you will:

1. ✅ Understand Monolithic Architecture structure
2. ✅ Build a full-stack application with Node.js + Express
3. ✅ Implement REST API endpoints
4. ✅ Use SQLite database with Node.js
5. ✅ Create interactive frontend with vanilla JavaScript
6. ✅ Practice asynchronous programming (async/await)

---

## 📁 Project Structure

```
week3-starter-code/
├── server.js              # Backend server (TODO: Implement routes)
├── package.json           # Dependencies (Complete ✓)
├── .gitignore            # Git ignore file (Complete ✓)
├── database/
│   └── schema.sql        # Database schema (Complete ✓)
├── public/
│   ├── index.html        # Frontend HTML (Complete ✓)
│   ├── style.css         # Styles (Complete ✓)
│   └── app.js            # Frontend JS (TODO: Implement logic)
└── README.md             # This file
```

### 📊 What You Need to Complete:

| File | Status | Description |
|------|--------|-------------|
| `server.js` | ⚠️ **TODO** | Implement 13 parts (API routes, etc.) |
| `public/app.js` | ⚠️ **TODO** | Implement 14 parts (frontend logic) |
| `database/schema.sql` | ✅ Complete | Database schema ready to use |
| `public/index.html` | ✅ Complete | HTML structure ready |
| `public/style.css` | ✅ Complete | All styles provided |

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `sqlite3` - Database driver
- `nodemon` - Auto-restart server (dev)

### Step 2: Create Database

```bash
# Navigate to database folder
cd database

# Create database and run schema
sqlite3 tasks.db < schema.sql

# Verify (optional)
sqlite3 tasks.db "SELECT * FROM tasks;"

# Go back to project root
cd ..
```

You should see 4 sample tasks created.

### Step 3: Implement TODOs

Open the following files and follow TODO comments:

**Priority Order:**
1. `server.js` - Parts 1-13 (Backend first!)
2. `public/app.js` - Parts 1-14 (Frontend)

**Testing Strategy:**
- Implement backend first, test with Thunder Client
- Then implement frontend, test in browser

### Step 4: Run the Application

```bash
# Start server with auto-restart
npm run dev

# Or without auto-restart
npm start
```

Server will run on: `http://localhost:3000`

### Step 5: Test Your Implementation

1. **Backend Testing** (with Thunder Client):
   - GET `/api/tasks` - Should return all tasks
   - POST `/api/tasks` - Should create new task
   - PATCH `/api/tasks/1/status` - Should update status
   - DELETE `/api/tasks/1` - Should delete task

2. **Frontend Testing** (in browser):
   - Open `http://localhost:3000`
   - Create a new task
   - Move task between columns
   - Delete a task
   - Use filter dropdown

---

## 📝 Implementation Guide

### 🔴 Part A: Backend (server.js)

**Parts to implement:**

1. **Part 1-4:** Setup (imports, app, middleware, database)
2. **Part 5:** GET all tasks
3. **Part 6:** GET single task
4. **Part 7:** POST create task
5. **Part 8:** PUT update task
6. **Part 9:** DELETE task
7. **Part 10:** PATCH update status
8. **Part 11-13:** Serve frontend & server startup

**Testing Each Part:**

```bash
# After Part 5 (GET all tasks)
curl http://localhost:3000/api/tasks

# After Part 7 (POST create task)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"HIGH"}'

# After Part 10 (PATCH update status)
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'

# After Part 9 (DELETE task)
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

### 🔵 Part B: Frontend (public/app.js)

**Parts to implement:**

1. **Part 1-2:** State & DOM elements
2. **Part 3:** Fetch tasks from API
3. **Part 4:** Create new task
4. **Part 5:** Update task status
5. **Part 6:** Delete task
6. **Part 7-10:** Render functions
7. **Part 11:** Utility functions
8. **Part 12-14:** Event listeners & initialization

**Testing Each Part:**

Use browser console (F12):

```javascript
// After Part 3 (Fetch tasks)
fetchTasks(); // Should populate the board

// After Part 4 (Create task)
createTask({ title: 'Test', priority: 'HIGH' });

// After Part 5 (Update status)
updateTaskStatus(1, 'DONE');

// After Part 6 (Delete task)
deleteTask(1);
```

---

## ⚠️ Common Mistakes to Avoid

### Backend (server.js):

1. ❌ Forgetting to use `app.use(express.json())`
   - Without this, `req.body` will be undefined

2. ❌ Not handling database errors
   - Always check for `err` in callbacks

3. ❌ Wrong HTTP status codes
   - 200: OK (GET, PUT, PATCH)
   - 201: Created (POST)
   - 400: Bad Request
   - 404: Not Found
   - 500: Server Error

4. ❌ Not validating input
   - Check `title` is not empty before INSERT

5. ❌ SQL injection (if not using parameterized queries)
   - ✅ Good: `db.run(sql, [param1, param2])`
   - ❌ Bad: `db.run(sql + param1 + param2)`

### Frontend (app.js):

1. ❌ Forgetting `await` with `fetch()`
   - Fetch is asynchronous, must use `await`

2. ❌ Not checking `response.ok`
   - Always check before parsing JSON

3. ❌ Not escaping HTML
   - Use `escapeHtml()` to prevent XSS

4. ❌ Forgetting to update `allTasks` array
   - After create/delete, update local state

5. ❌ Not handling errors
   - Use try-catch for all async functions

---

## 🧪 Testing Checklist

Before submitting, test all features:

### Backend API:
- [ ] GET `/api/tasks` returns all tasks
- [ ] GET `/api/tasks/:id` returns single task
- [ ] GET `/api/tasks/999` returns 404 (not found)
- [ ] POST `/api/tasks` with valid data creates task
- [ ] POST `/api/tasks` with empty title returns 400
- [ ] PUT `/api/tasks/:id` updates task
- [ ] DELETE `/api/tasks/:id` deletes task
- [ ] PATCH `/api/tasks/:id/status` updates status
- [ ] PATCH with invalid status returns 400

### Frontend:
- [ ] Page loads without errors
- [ ] Tasks are displayed in correct columns
- [ ] Can create new task via form
- [ ] Can move task between columns
- [ ] Can delete task with confirmation
- [ ] Filter dropdown works correctly
- [ ] Task counters update correctly
- [ ] No console errors in DevTools

---

## 📖 Helpful Resources

### SQLite3 Methods:

```javascript
// Get multiple rows
db.all(sql, params, (err, rows) => { });

// Get single row
db.get(sql, params, (err, row) => { });

// Execute INSERT/UPDATE/DELETE
db.run(sql, params, function(err) {
    // this.lastID - ID of inserted row
    // this.changes - Number of rows affected
});
```

### Fetch API:

```javascript
// GET
const response = await fetch('/api/tasks');
const data = await response.json();

// POST
const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'New Task' })
});

// DELETE
const response = await fetch('/api/tasks/1', {
    method: 'DELETE'
});

// PATCH
const response = await fetch('/api/tasks/1/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'DONE' })
});
```

---

## 💡 Implementation Tips

### 🎯 Backend Tips:

1. **Start Simple**
   - Implement GET first (easier)
   - Then POST, then PUT/DELETE

2. **Test As You Go**
   - Test each endpoint with Thunder Client
   - Don't wait until everything is done

3. **Use Console Logs**
   ```javascript
   console.log('Request received:', req.body);
   console.log('Database result:', rows);
   ```

4. **Check Database**
   ```bash
   sqlite3 database/tasks.db "SELECT * FROM tasks;"
   ```

### 🎨 Frontend Tips:

1. **Use Browser Console**
   - Call functions directly to test
   - Check for errors (F12)

2. **Debug Network Calls**
   - Open DevTools → Network tab
   - See all API requests/responses

3. **Start With Static**
   - Create a card manually first
   - Then make it dynamic

4. **One Function at a Time**
   - Don't implement everything at once
   - Test each function separately

---

## 🎓 What You'll Learn

### Technical Skills:

- ✅ Node.js & Express.js basics
- ✅ SQLite database operations
- ✅ REST API design and implementation
- ✅ Asynchronous JavaScript (async/await)
- ✅ DOM manipulation
- ✅ Event handling
- ✅ Fetch API usage
- ✅ Error handling
- ✅ Security basics (XSS prevention)

### Architectural Concepts:

- ✅ Monolithic Architecture characteristics
- ✅ Client-Server communication
- ✅ API endpoint design
- ✅ Database schema design
- ✅ Single deployment unit
- ✅ In-process calls vs network calls

---

## 📤 Submission

When you complete the lab:

1. **Test Everything** (use checklist above)

2. **Document Your Work**
   - Answer reflection questions
   - Write a good README

3. **Commit to Git**
   ```bash
   git init
   git add .
   git commit -m "Week 3: Complete monolithic Task Board"
   ```

4. **Submit**
   - Push to GitHub, OR
   - Create ZIP file (exclude node_modules)

---

## 🎯 Grading Criteria (10 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| **Functionality** | 4 | All features work correctly |
| **Code Quality** | 2 | Clean code, good practices |
| **Documentation** | 2 | README + Reflection complete |
| **Git Usage** | 1 | Meaningful commits |
| **Creativity** | 1 | Extra features, improved UI |

---

## 🆘 Need Help?

### During Lab:
- Ask TA or instructor
- Check Discord channel
- Pair with classmate

### After Lab:
- Email: thanit@example.com
- Office Hours: Tue/Thu 14:00-16:00
- Review lab guide materials

---

## 🎉 You Got This!

Remember:
- **Read TODO comments carefully**
- **Implement step by step**
- **Test frequently**
- **Ask questions when stuck**
- **Don't copy blindly - understand!**

**Start with backend, then frontend.**
**Good luck! 💪**

---

*Starter Code Version: 1.0*  
*Last Updated: 2025-01-15*  
*ENGSE207 Software Architecture - Week 3*
