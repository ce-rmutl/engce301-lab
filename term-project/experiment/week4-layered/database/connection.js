const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const dbPath = process.env.DB_PATH || './database/tasks.db';
            
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('❌ เชื่อมต่อฐานข้อมูลล้มเหลว:', err.message);
                    reject(err);
                } else {
                    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ:', dbPath);
                    this.db.run('PRAGMA foreign_keys = ON');
                    resolve(this.db);
                }
            });
        });
    }

    getConnection() {
        if (!this.db) {
            throw new Error('ยังไม่ได้เชื่อมต่อฐานข้อมูล เรียก connect() ก่อน');
        }
        return this.db;
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) reject(err);
                    else {
                        console.log('✅ ปิดการเชื่อมต่อฐานข้อมูล');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    // Helper: Run query ด้วย Promise
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    // Helper: Get single row
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Helper: Get all rows
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

// Singleton instance
const database = new Database();

module.exports = database;