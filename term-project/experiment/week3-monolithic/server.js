// server.js
// Task Board - Monolithic Application
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: IMPORT DEPENDENCIES
// ========================================

// TODO 1.1: Import express module
 const express = require('express');

// TODO 1.2: Import sqlite3 module with verbose mode
 const sqlite3 = require('sqlite3').verbose();

// TODO 1.3: Import path module (for serving static files)
 const path = require('path');


// ========================================
// PART 2: INITIALIZE APPLICATION
// ========================================

// TODO 2.1: Create express application instance
 const app = express();

// TODO 2.2: Define PORT number (use 3000)
 const PORT = 3000;


// ========================================
// PART 3: MIDDLEWARE CONFIGURATION
// ========================================

// TODO 3.1: Add middleware to parse JSON request bodies
app.use(express.json());


// TODO 3.2: Add middleware to serve static files from 'public' folder
app.use(express.static('public'));


// ========================================
// PART 4: DATABASE CONNECTION
// ========================================

// TODO 4.1: Create database connection to './database/tasks.db'
// Include error handling
// Hint: Use sqlite3.Database constructor

const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});



// ========================================
// PART 5: API ROUTES - GET ALL TASKS
// ========================================

// TODO 5.1: Create GET /api/tasks endpoint
// This should return all tasks from the database
// Hint: Use db.all() method

app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        } else {
            res.json({ tasks: rows });
        }
    });
});



// ========================================
// PART 6: API ROUTES - GET SINGLE TASK
// ========================================

// TODO 6.1: Create GET /api/tasks/:id endpoint
// This should return a single task by ID
// Hint: Use db.get() method and req.params.id

app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching task:', err.message);
            res.status(500).json({ error: 'Failed to fetch task' });
        } else if (!row) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ task: row });
        }
    });
});


// ========================================
// PART 7: API ROUTES - CREATE TASK
// ========================================

// TODO 7.1: Create POST /api/tasks endpoint
// This should create a new task
// Required fields: title (required), description (optional), priority (optional)
// Hint: Use db.run() method and req.body
app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    const sql = `
        INSERT INTO tasks (title, description, status, priority) 
        VALUES (?, ?, 'TODO', ?)
    `;
    
    db.run(sql, [title, description || '', priority || 'MEDIUM'], function(err) {
        if (err) {
            console.error('Error creating task:', err.message);
            res.status(500).json({ error: 'Failed to create task' });
        } else {
            // Return the created task
            db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    res.status(500).json({ error: 'Task created but failed to fetch' });
                } else {
                    res.status(201).json({ 
                        message: 'Task created successfully',
                        task: row 
                    });
                }
            });
        }
    });
});


// ========================================
// PART 8: API ROUTES - UPDATE TASK
// ========================================

// TODO 8.1: Create PUT /api/tasks/:id endpoint
// This should update an existing task
// Hint: Build dynamic SQL based on provided fields

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    
    // Build dynamic SQL based on provided fields
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }
    if (priority !== undefined) {
        updates.push('priority = ?');
        values.push(priority);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    if (updates.length === 1) { // Only updated_at
        return res.status(400).json({ error: 'No fields to update' });
    }
    
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
        if (err) {
            console.error('Error updating task:', err.message);
            res.status(500).json({ error: 'Failed to update task' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            // Return updated task
            db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
                if (err) {
                    res.status(500).json({ error: 'Task updated but failed to fetch' });
                } else {
                    res.json({ 
                        message: 'Task updated successfully',
                        task: row 
                    });
                }
            });
        }
    });
});



// ========================================
// PART 9: API ROUTES - DELETE TASK
// ========================================

// TODO 9.1: Create DELETE /api/tasks/:id endpoint
// This should delete a task by ID
// Hint: Use db.run() with DELETE SQL

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Error deleting task:', err.message);
            res.status(500).json({ error: 'Failed to delete task' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ 
                message: 'Task deleted successfully',
                deletedId: parseInt(id)
            });
        }
    });
});


// ========================================
// PART 10: API ROUTES - UPDATE STATUS
// ========================================

// TODO 10.1: Create PATCH /api/tasks/:id/status endpoint
// This should update only the status of a task
// Valid statuses: 'TODO', 'IN_PROGRESS', 'DONE'
// Hint: Validate status before updating

app.patch('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            error: 'Invalid status. Must be TODO, IN_PROGRESS, or DONE' 
        });
    }
    
    const sql = 'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error('Error updating status:', err.message);
            res.status(500).json({ error: 'Failed to update status' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
                if (err) {
                    res.status(500).json({ error: 'Status updated but failed to fetch' });
                } else {
                    res.json({ 
                        message: 'Status updated successfully',
                        task: row 
                    });
                }
            });
        }
    });
});



// ========================================
// PART 11: SERVE FRONTEND
// ========================================

// TODO 11.1: Create route to serve index.html for root path
// Hint: Use res.sendFile()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// ========================================
// PART 12: START SERVER
// ========================================

// TODO 12.1: Start the server and listen on the PORT
// Include success messages

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Task Board Server Started!');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📊 Architecture: Monolithic (All-in-one)`);
    console.log(`📝 Database: SQLite (./database/tasks.db)`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50));
    console.log('\n💡 Tips:');
    console.log('  - Open http://localhost:3000 in browser');
    console.log('  - Press Ctrl+C to stop server');
    console.log('  - Check README.md for API documentation');
    console.log('\n');
});




// ========================================
// PART 13: GRACEFUL SHUTDOWN (BONUS)
// ========================================

// TODO 13.1: Handle SIGINT for graceful shutdown
// This closes the database connection properly when server stops

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});



// ========================================
// TESTING INSTRUCTIONS
// ========================================

/*
To test your implementation:

1. Make sure database is created:
   cd database
   sqlite3 tasks.db < schema.sql
   cd ..

2. Start the server:
   npm run dev

3. Test with Thunder Client or curl:
   
   GET all tasks:
   curl http://localhost:3000/api/tasks
   
   GET single task:
   curl http://localhost:3000/api/tasks/1
   
   CREATE task:
   curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Task","priority":"HIGH"}'
   
   UPDATE task:
   curl -X PUT http://localhost:3000/api/tasks/1 \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Task"}'
   
   UPDATE status:
   curl -X PATCH http://localhost:3000/api/tasks/1/status \
     -H "Content-Type: application/json" \
     -d '{"status":"DONE"}'
   
   DELETE task:
   curl -X DELETE http://localhost:3000/api/tasks/1

4. Test in browser:
   Open http://localhost:3000
*/


// ========================================
// HINTS & TIPS
// ========================================

/*
SQLITE3 METHODS CHEAT SHEET:
- db.all(sql, params, callback) : Get multiple rows
- db.get(sql, params, callback) : Get single row
- db.run(sql, params, callback) : Execute INSERT/UPDATE/DELETE

CALLBACK PATTERNS:
- (err, rows) for db.all()
- (err, row) for db.get()
- function(err) for db.run() - use 'this.lastID' for inserted ID

ERROR HANDLING:
Always check for errors and return appropriate status codes:
- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 400: Bad Request (validation failed)
- 404: Not Found
- 500: Server Error

VALIDATION:
Always validate user input before database operations!
*/
