// server.js
// Task Board - Monolithic Application (SOLUTION CODE)
// Week 3: ENGSE207 Software Architecture

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from 'public' folder

// Database connection
const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// ===== API ROUTES =====

// GET /api/tasks - Get all tasks
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

// GET /api/tasks/:id - Get single task by ID
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

// POST /api/tasks - Create new task
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

// PUT /api/tasks/:id - Update task
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

// DELETE /api/tasks/:id - Delete task
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

// PATCH /api/tasks/:id/status - Update only status
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

// ===== SERVE FRONTEND =====

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START SERVER =====

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

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        console.log('👋 Goodbye!\n');
        process.exit(0);
    });
});
