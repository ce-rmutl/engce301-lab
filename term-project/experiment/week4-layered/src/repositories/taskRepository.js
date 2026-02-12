const database = require('../../database/connection');
const Task = require('../models/Task');

class TaskRepository {
    /**
     * ค้นหา tasks ทั้งหมด
     * @param {Object} filters - ตัวกรอง { status, priority }
     * @returns {Promise<Array>}
     */
    async findAll(filters = {}) {
        let sql = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.priority) {
            sql += ' AND priority = ?';
            params.push(filters.priority);
        }

        sql += ' ORDER BY created_at DESC';

        const rows = await database.all(sql, params);
        return rows.map(row => new Task(row));
    }

    /**
     * ค้นหา task ตาม ID
     * @param {number} id
     * @returns {Promise<Task|null>}
     */
    async findById(id) {
        const sql = 'SELECT * FROM tasks WHERE id = ?';
        const row = await database.get(sql, [id]);
        return row ? new Task(row) : null;
    }

    /**
     * สร้าง task ใหม่
     * @param {Task} task
     * @returns {Promise<Task>}
     */
    async create(task) {
        const data = task.toDatabase();
        const sql = `
            INSERT INTO tasks (title, description, status, priority)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await database.run(sql, [
            data.title,
            data.description,
            data.status,
            data.priority
        ]);

        return await this.findById(result.lastID);
    }

    /**
     * อัพเดท task
     * @param {number} id
     * @param {Object} updates
     * @returns {Promise<Task|null>}
     */
    async update(id, updates) {
        const fields = [];
        const params = [];

        if (updates.title !== undefined) {
            fields.push('title = ?');
            params.push(updates.title);
        }
        if (updates.description !== undefined) {
            fields.push('description = ?');
            params.push(updates.description);
        }
        if (updates.status !== undefined) {
            fields.push('status = ?');
            params.push(updates.status);
        }
        if (updates.priority !== undefined) {
            fields.push('priority = ?');
            params.push(updates.priority);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
        await database.run(sql, params);

        return await this.findById(id);
    }

    /**
     * ลบ task
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        const result = await database.run(sql, [id]);
        return result.changes > 0;
    }

    /**
     * นับจำนวน tasks ตาม status
     * @returns {Promise<Object>}
     */
    async countByStatus() {
        const sql = `
            SELECT status, COUNT(*) as count
            FROM tasks
            GROUP BY status
        `;
        const rows = await database.all(sql);
        
        return rows.reduce((acc, row) => {
            acc[row.status] = row.count;
            return acc;
        }, {});
    }
}

module.exports = new TaskRepository();