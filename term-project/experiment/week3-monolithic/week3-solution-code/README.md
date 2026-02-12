# 🎯 Week 3 Solution Code - Task Board Monolithic

**ENGSE207 Software Architecture - Week 3 Lab**

---

## ⚠️ SOLUTION CODE - FOR REFERENCE ONLY

This is the **complete solution** for Week 3 Lab. Use this to:
- ✅ Check your implementation
- ✅ Test the final product
- ✅ Compare with your code
- ✅ Learn best practices

**Important:** Try to complete the lab yourself first before looking at this solution!

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Database

```bash
cd database
sqlite3 tasks.db < schema.sql
cd ..
```

### Step 3: Run Application

```bash
npm run dev
```

### Step 4: Open Browser

```
http://localhost:3000
```

---

## 📁 Project Structure

```
week3-solution-code/
├── server.js              # ✅ Complete Backend
├── package.json           # Dependencies
├── .gitignore            # Git ignore rules
├── database/
│   └── schema.sql        # Database schema
├── public/
│   ├── index.html        # ✅ Complete HTML
│   ├── style.css         # ✅ Complete CSS
│   └── app.js            # ✅ Complete Frontend JS
└── README.md             # This file
```

---

## ✨ Features Implemented

### Backend (server.js):
- ✅ Express server setup
- ✅ SQLite database connection
- ✅ JSON middleware
- ✅ Static file serving
- ✅ GET /api/tasks - Get all tasks
- ✅ GET /api/tasks/:id - Get single task
- ✅ POST /api/tasks - Create task
- ✅ PUT /api/tasks/:id - Update task
- ✅ DELETE /api/tasks/:id - Delete task
- ✅ PATCH /api/tasks/:id/status - Update status
- ✅ Error handling
- ✅ Input validation
- ✅ Graceful shutdown

### Frontend (public/app.js):
- ✅ Fetch tasks from API
- ✅ Create new tasks
- ✅ Update task status
- ✅ Delete tasks
- ✅ Filter by status
- ✅ Real-time UI updates
- ✅ Loading states
- ✅ Error handling
- ✅ Keyboard shortcuts (Ctrl/Cmd + K)
- ✅ Responsive design

---

## 🎨 UI Features

### Kanban Board:
- **TODO Column** - New tasks
- **IN PROGRESS Column** - Active tasks
- **DONE Column** - Completed tasks

### Task Card:
- Title & Description
- Priority badge (High/Medium/Low)
- Created/Updated timestamps
- Move buttons (between columns)
- Delete button

### Form:
- Task title (required, max 200 chars)
- Description (optional)
- Priority selector (Low/Medium/High)

### Filters:
- All Tasks
- TODO only
- IN_PROGRESS only
- DONE only

---

## 🔌 API Endpoints

### GET /api/tasks
**Description:** Get all tasks  
**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "status": "TODO",
      "priority": "HIGH",
      "created_at": "2025-01-15 10:00:00",
      "updated_at": "2025-01-15 10:00:00"
    }
  ]
}
```

### GET /api/tasks/:id
**Description:** Get single task by ID  
**Response:**
```json
{
  "task": {
    "id": 1,
    "title": "Task title",
    ...
  }
}
```

### POST /api/tasks
**Description:** Create new task  
**Request Body:**
```json
{
  "title": "New task",
  "description": "Description",
  "priority": "MEDIUM"
}
```
**Response:** (201 Created)
```json
{
  "message": "Task created successfully",
  "task": { ... }
}
```

### PUT /api/tasks/:id
**Description:** Update task  
**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

### DELETE /api/tasks/:id
**Description:** Delete task  
**Response:**
```json
{
  "message": "Task deleted successfully",
  "deletedId": 1
}
```

### PATCH /api/tasks/:id/status
**Description:** Update task status only  
**Request Body:**
```json
{
  "status": "DONE"
}
```

---

## 🧪 Testing

### Test Backend with Thunder Client:

1. **GET all tasks:**
   ```
   GET http://localhost:3000/api/tasks
   ```

2. **Create task:**
   ```
   POST http://localhost:3000/api/tasks
   Headers: Content-Type: application/json
   Body:
   {
     "title": "Test Task",
     "priority": "HIGH"
   }
   ```

3. **Update status:**
   ```
   PATCH http://localhost:3000/api/tasks/1/status
   Headers: Content-Type: application/json
   Body:
   {
     "status": "DONE"
   }
   ```

4. **Delete task:**
   ```
   DELETE http://localhost:3000/api/tasks/1
   ```

### Test Frontend in Browser:

1. Open `http://localhost:3000`
2. Create a new task
3. Move task between columns
4. Delete a task
5. Use filter dropdown
6. Try keyboard shortcut (Ctrl/Cmd + K)

---

## 💡 Code Highlights

### Error Handling:
```javascript
// Backend
if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
}

// Frontend
try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
} catch (error) {
    console.error(error);
    alert('Error: ' + error.message);
}
```

### Input Validation:
```javascript
// Backend - SQL injection prevention
db.run(sql, [title, description, priority], ...);

// Frontend - XSS prevention
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### Async/Await Pattern:
```javascript
async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        allTasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error(error);
    } finally {
        hideLoading();
    }
}
```

---

## 🎓 What Students Learn

### Backend Skills:
- ✅ Express.js routing
- ✅ SQLite database operations
- ✅ REST API design
- ✅ HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ✅ Status codes (200, 201, 400, 404, 500)
- ✅ Error handling
- ✅ Input validation
- ✅ SQL parameterized queries

### Frontend Skills:
- ✅ Fetch API
- ✅ Async/await
- ✅ DOM manipulation
- ✅ Event handling
- ✅ State management
- ✅ Error handling
- ✅ XSS prevention

### Architecture Concepts:
- ✅ Monolithic structure
- ✅ Client-Server model
- ✅ REST API design
- ✅ Database integration
- ✅ Single deployment unit

---

## 📊 Comparison with Starter Code

| Aspect | Starter Code | Solution Code |
|--------|-------------|---------------|
| server.js | 13 TODOs | ✅ Complete (262 lines) |
| public/app.js | 14 TODOs | ✅ Complete (371 lines) |
| Error handling | Partial | ✅ Comprehensive |
| Validation | Basic | ✅ Full validation |
| UI feedback | Basic | ✅ Loading states, notifications |
| Code quality | Student level | ✅ Production ready |

---

## 🔧 Running in Production

This is a **learning project**, but if you want to deploy:

### Environment Variables:
```bash
# .env file
PORT=3000
DATABASE_PATH=./database/tasks.db
```

### Process Manager (PM2):
```bash
npm install -g pm2
pm2 start server.js --name task-board
pm2 save
pm2 startup
```

### Docker (Optional):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## ⚠️ Known Limitations

This is a **learning project** with intentional limitations:

1. **No Authentication** - Anyone can access/modify tasks
2. **No User Management** - All users share the same tasks
3. **SQLite** - Not suitable for production/concurrent users
4. **No API Rate Limiting** - Can be abused
5. **No Real-time Updates** - Changes don't sync across browsers
6. **Basic Validation** - Minimal security checks

**For production, you would need:**
- User authentication (JWT, OAuth)
- PostgreSQL/MySQL instead of SQLite
- Rate limiting & security middleware
- WebSocket for real-time updates
- Better error handling & logging
- Unit & integration tests

---

## 📚 Additional Resources

### Learn More:
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [REST API Best Practices](https://restfulapi.net/)

### Next Steps:
- Week 4: Refactor to **Layered Architecture**
- Week 5: Separate to **Client-Server** with API
- Week 6: Deploy as **N-Tier** with Docker
- Week 7: Add **Event-Driven** patterns
- Week 8-9: Transform to **Microservices**

---

## 🎯 How to Use This Solution

### For Students:

1. **Try First** - Attempt the lab yourself
2. **Compare** - Check your code vs solution
3. **Learn** - Understand why solution works
4. **Improve** - Apply learnings to your code

### For Instructors:

1. **Demo** - Show working application
2. **Explain** - Walk through key concepts
3. **Distribute** - Share after lab deadline
4. **Discuss** - Review common mistakes

---

## 💬 Support

**Questions about the code?**
- Review inline comments
- Check console logs
- Read error messages
- Ask instructor/TA

**Found a bug?**
- Check database exists
- Verify dependencies installed
- Restart server
- Clear browser cache

---

## 🎉 Congratulations!

If you completed this lab, you now understand:
- ✅ How to build a full-stack application
- ✅ Monolithic architecture pattern
- ✅ REST API design
- ✅ Database integration
- ✅ Frontend-backend communication

**You're ready for Week 4!** 🚀

---

*Solution Code Version: 1.0*  
*Last Updated: 2025-01-15*  
*ENGSE207 Software Architecture - Week 3*
