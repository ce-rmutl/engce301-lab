// ============================================
// Database Connection
// ============================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.resolve(__dirname, 'products.db');

// Create connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('❌ Error enabling foreign keys:', err.message);
            }
        });
    }
});

module.exports = db;