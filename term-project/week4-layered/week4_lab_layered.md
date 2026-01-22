# 🏛️ คู่มือปฏิบัติการ ENGSE207 - สัปดาห์ที่ 4
## Layered (3-Tier) Architecture: Refactoring Task Board 

**สัปดาห์:** 4 | **ระยะเวลา:** 3 ชั่วโมง | **ระดับความยาก:** ⭐⭐⭐

---

## 📋 สารบัญ

1. [วัตถุประสงค์การเรียนรู้](#วัตถุประสงค์การเรียนรู้)
2. [สิ่งที่ต้องเตรียม](#สิ่งที่ต้องเตรียม)
3. [ภาพรวมสถาปัตยกรรม](#ภาพรวมสถาปัตยกรรม)
4. [ส่วนที่ 1: ทำความเข้าใจ Layers (30 นาที)](#ส่วนที่-1-ทำความเข้าใจ-layers)
5. [ส่วนที่ 2: Refactoring เป็น 3-Tier (90 นาที)](#ส่วนที่-2-refactoring-เป็น-3-tier)
6. [ส่วนที่ 3: Testing และ Validation (40 นาที)](#ส่วนที่-3-testing-และ-validation)
7. [ส่วนที่ 4: การวิเคราะห์และเอกสาร (40 นาที)](#ส่วนที่-4-การวิเคราะห์และเอกสาร) ⭐ **นักศึกษาต้องทำเอง**
8. [การส่งงานและเกณฑ์การให้คะแนน](#การส่งงานและเกณฑ์การให้คะแนน)
9. [แก้ปัญหาเบื้องต้น](#แก้ปัญหาเบื้องต้น)

---

## 🎯 วัตถุประสงค์การเรียนรู้

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:

✅ อธิบายหลักการ Separation of Concerns ได้  
✅ Refactor โค้ด Monolithic เป็น Layered Architecture ได้  
✅ สร้าง Presentation, Business Logic, และ Data Access Layers ได้  
✅ ออกแบบ interfaces ระหว่าง layers ได้อย่างเหมาะสม  
✅ เขียน unit tests สำหรับแต่ละ layer ได้  
✅ **วิเคราะห์และเปรียบเทียบ Monolithic vs Layered Architecture ได้** ⭐

---

## 📚 สิ่งที่ต้องเตรียม

### ต้องมีก่อนเริ่ม Lab:

✅ **สัปดาห์ที่ 3 Monolithic App** - ทำสำเร็จและทำงานได้  
✅ **Node.js 20+** - ติดตั้งและทำงานได้  
✅ **Git** - สำหรับ version control  
✅ **VS Code** - พร้อม extensions  
✅ **ความเข้าใจพื้นฐาน** - JavaScript, async/await, promises

### คัดลอกโปรเจกต์จากสัปดาห์ที่ 3:

```bash
# สร้างโฟลเดอร์ใหม่
mkdir -p ~/engse207-labs/week4-layered
cd ~/engse207-labs/week4-layered

# คัดลอกไฟล์จาก Week 3
cp -r ~/engse207-labs/week3-monolithic/* .

# เริ่มต้น Git
git init
git add .
git commit -m "Week 4: เริ่มต้น - คัดลอกจาก Week 3 Monolithic"
```

---

## 🏗️ ภาพรวมสถาปัตยกรรม

### เปรียบเทียบ Monolithic (Week 3) vs Layered (Week 4)

**สัปดาห์ที่ 3 - Monolithic:**
```
server.js (ไฟล์เดียว ~150 บรรทัด)
├── Express setup
├── Database connection
├── Business logic (validation, calculations)
├── CRUD operations
└── Error handling

❌ ปัญหา:
- โค้ดปนกัน ยากต่อการดูแล
- แก้ไขส่วนหนึ่ง กระทบส่วนอื่น
- ทดสอบยาก
- ทำงานเป็นทีมยาก
```

**สัปดาห์ที่ 4 - Layered (3-Tier):**
```
┌─────────────────────────────────────────┐
│  Presentation Layer (Controllers)       │  ← ชั้นที่ 1: รับ-ส่งข้อมูล HTTP
│  - จัดการ HTTP requests/responses        │
│  - ตรวจสอบรูปแบบข้อมูลเข้า                  │
│  - จัดรูปแบบข้อมูลออก (JSON)                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Business Logic Layer (Services)        │  ← ชั้นที่ 2: ตรรกะทางธุรกิจ
│  - กฎทางธุรกิจ (Business rules)           │
│  - การตรวจสอบข้อมูล (Validation)          │
│  - การประมวลผลและคำนวณ                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Data Access Layer (Repositories)       │  ← ชั้นที่ 3: จัดการฐานข้อมูล
│  - CRUD operations                      │
│  - Query execution                      │
│  - Data persistence                     │
└─────────────────────────────────────────┘
              ↓
         [Database]

✅ ข้อดี:
- แยกหน้าที่ชัดเจน
- แก้ไขง่าย
- ทดสอบแต่ละชั้นได้
- ทำงานเป็นทีมได้ดี
```

### โครงสร้างโปรเจกต์สัปดาห์ที่ 4:

```
week4-layered/
├── server.js                      # จุดเริ่มต้นโปรแกรม
├── package.json
├── .env                           # ตัวแปร environment
├── database/
│   ├── schema.sql
│   ├── tasks.db
│   └── connection.js              # การเชื่อมต่อฐานข้อมูล
├── src/
│   ├── controllers/               # ⭐ Presentation Layer
│   │   └── taskController.js
│   ├── services/                  # ⭐ Business Logic Layer
│   │   └── taskService.js
│   ├── repositories/              # ⭐ Data Access Layer
│   │   └── taskRepository.js
│   ├── models/                    # โมเดลข้อมูล
│   │   └── Task.js
│   ├── middleware/                # Express middleware
│   │   ├── errorHandler.js
│   │   └── validator.js
│   └── utils/                     # เครื่องมือช่วย
│       └── logger.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
└── README.md
```

---

## ส่วนที่ 1: ทำความเข้าใจ Layers (30 นาที)

### 1.1 หน้าที่ของแต่ละ Layer

#### 📊 Presentation Layer (Controllers)
**หน้าที่:**
- รับ HTTP requests จาก client
- ตรวจสอบรูปแบบข้อมูลที่เข้ามา (format validation)
- เรียกใช้ Business Logic Layer
- จัดรูปแบบ responses เป็น JSON
- จัดการ HTTP errors

**สิ่งที่ไม่ควรมี:**
- ❌ Business logic
- ❌ Database queries
- ❌ การคำนวณที่ซับซ้อน

**ตัวอย่างโค้ดที่ควรอยู่ใน Controller:**
```javascript
// ✅ ถูกต้อง - อยู่ใน Controller
async createTask(req, res, next) {
    const taskData = {
        title: req.body.title,
        description: req.body.description
    };
    const task = await taskService.createTask(taskData);
    res.status(201).json({ success: true, data: task });
}

// ❌ ผิด - Business logic อยู่ใน Controller
async createTask(req, res, next) {
    // ❌ การตรวจสอบเหล่านี้ควรอยู่ใน Service
    if (req.body.title.length < 3) {
        return res.status(400).json({ error: 'Title too short' });
    }
    if (req.body.priority === 'HIGH' && !req.body.description) {
        return res.status(400).json({ error: 'High priority needs description' });
    }
    // ...
}
```

#### 🧠 Business Logic Layer (Services)
**หน้าที่:**
- กฎทางธุรกิจและการตรวจสอบ (Business rules & validation)
- การแปลงข้อมูล (Data transformation)
- การประสานงาน (Workflow orchestration)
- การจัดการ transactions
- การคำนวณที่ซับซ้อน

**สิ่งที่ไม่ควรมี:**
- ❌ HTTP handling
- ❌ Database queries โดยตรง
- ❌ UI concerns

**ตัวอย่างโค้ดที่ควรอยู่ใน Service:**
```javascript
// ✅ ถูกต้อง - Business logic อยู่ใน Service
async createTask(taskData) {
    const task = new Task(taskData);
    
    // ✅ Business validation
    const validation = task.isValid();
    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }
    
    // ✅ Business rules
    if (task.priority === 'HIGH' && !task.description) {
        throw new Error('งานลำดับความสำคัญสูงต้องมีรายละเอียด');
    }
    
    // ✅ เรียกใช้ Repository
    return await taskRepository.create(task);
}
```

#### 💾 Data Access Layer (Repositories)
**หน้าที่:**
- CRUD operations
- ประมวลผล queries
- จัดเก็บข้อมูล (Data persistence)
- จัดการการเชื่อมต่อฐานข้อมูล

**สิ่งที่ไม่ควรมี:**
- ❌ Business logic
- ❌ HTTP handling
- ❌ Data transformation logic

### 1.2 Communication Flow

```javascript
// Example Flow: Create Task

// 1. Presentation Layer (Controller)
POST /api/tasks
↓
TaskController.createTask(req, res)
  - Validate input format
  - Extract data from request
  ↓
  
// 2. Business Logic Layer (Service)
TaskService.createTask(taskData)
  - Apply business rules
  - Validate business constraints
  - Transform data if needed
  ↓
  
// 3. Data Access Layer (Repository)
TaskRepository.create(task)
  - Execute SQL INSERT
  - Return created task
  ↓
  
// Response flows back up
Repository → Service → Controller → HTTP Response
```

**ตัวอย่างโค้ดที่ควรอยู่ใน Repository:**
```javascript
// ✅ ถูกต้อง - เฉพาะ database operations
async create(task) {
    const data = task.toDatabase();
    const sql = `INSERT INTO tasks (title, description, status, priority) 
                 VALUES (?, ?, ?, ?)`;
    const result = await database.run(sql, [
        data.title, data.description, data.status, data.priority
    ]);
    return await this.findById(result.lastID);
}

// ❌ ผิด - มี business logic ใน Repository
async create(task) {
    // ❌ Validation ควรอยู่ใน Service
    if (task.title.length < 3) {
        throw new Error('Title too short');
    }
    // ...
}
```

### 🎯 แบบฝึกหัด 1: Layer Decision Tree (10 นาที)

**คำถาม:** โค้ดต่อไปนี้ควรอยู่ใน Layer ไหน? เพราะอะไร?

1. `const tasks = await database.all('SELECT * FROM tasks')`
   - [ ] Controller
   - [ ] Service  
   - [ ] Repository
   - **คำตอบ:** ________________
   - **เหตุผล:** ________________

2. `if (title.length < 3) throw new Error('Title too short')`
   - [ ] Controller
   - [ ] Service
   - [ ] Repository
   - **คำตอบ:** ________________
   - **เหตุผล:** ________________

3. `res.status(201).json({ success: true, data: task })`
   - [ ] Controller
   - [ ] Service
   - [ ] Repository
   - **คำตอบ:** ________________
   - **เหตุผล:** ________________

4. `if (priority === 'HIGH' && !description) throw new Error(...)`
   - [ ] Controller
   - [ ] Service
   - [ ] Repository
   - **คำตอบ:** ________________
   - **เหตุผล:** ________________

5. `const taskData = { title: req.body.title, description: req.body.description }`
   - [ ] Controller
   - [ ] Service
   - [ ] Repository
   - **คำตอบ:** ________________
   - **เหตุผล:** ________________

---

## ส่วนที่ 2: Refactoring เป็น 3-Tier (90 นาที)

### 2.1 ตั้งค่าโครงสร้างโปรเจกต์ (15 นาที)

```bash
# สร้างโฟลเดอร์
mkdir -p src/{controllers,services,repositories,models,middleware,utils}
mkdir -p tests

# ติดตั้ง dependencies เพิ่มเติม
npm install dotenv
npm install --save-dev jest

# สร้างไฟล์ config
touch .env src/middleware/{errorHandler.js,validator.js}
touch src/utils/logger.js database/connection.js
```

**สร้างไฟล์ .env:**
```env
NODE_ENV=development
PORT=3000
DB_PATH=./database/tasks.db
LOG_LEVEL=debug
```

### 2.2 สร้าง Data Model (10 นาที)

**src/models/Task.js:**
```javascript
/**
 * Task Data Model
 * แทนข้อมูล task พร้อม validation
 */
class Task {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.status = data.status || 'TODO';
        this.priority = data.priority || 'MEDIUM';
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // การตรวจสอบความถูกต้อง
    isValid() {
        const errors = [];
        
        // ตรวจสอบ title
        if (!this.title || this.title.trim().length < 3) {
            errors.push('ชื่องานต้องมีอย่างน้อย 3 ตัวอักษร');
        }
        if (this.title && this.title.length > 100) {
            errors.push('ชื่องานต้องไม่เกิน 100 ตัวอักษร');
        }
        
        // ตรวจสอบ status
        const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
        if (!validStatuses.includes(this.status)) {
            errors.push('สถานะไม่ถูกต้อง');
        }
        
        // ตรวจสอบ priority
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
        if (!validPriorities.includes(this.priority)) {
            errors.push('ระดับความสำคัญไม่ถูกต้อง');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // แปลงเป็น object สำหรับฐานข้อมูล
    toDatabase() {
        return {
            title: this.title.trim(),
            description: this.description ? this.description.trim() : null,
            status: this.status,
            priority: this.priority
        };
    }

    // แปลงเป็น JSON สำหรับ API response
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = Task;
```

### 2.3 สร้าง Database Connection (10 นาที)

**database/connection.js:**
```javascript
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
```

### 2.4 สร้าง Data Access Layer - Repository (20 นาที)

**src/repositories/taskRepository.js:**
```javascript
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
```

### 2.5 สร้าง Business Logic Layer - Service (20 นาที)

**src/services/taskService.js:**
```javascript
const taskRepository = require('../repositories/taskRepository');
const Task = require('../models/Task');

class TaskService {
    /**
     * ดึง tasks ทั้งหมดพร้อมตัวกรอง
     */
    async getAllTasks(filters = {}) {
        return await taskRepository.findAll(filters);
    }

    /**
     * ดึง task ตาม ID
     */
    async getTaskById(id) {
        const task = await taskRepository.findById(id);
        
        if (!task) {
            throw new Error(`ไม่พบ task ที่มี ID ${id}`);
        }
        
        return task;
    }

    /**
     * สร้าง task ใหม่พร้อมตรวจสอบกฎทางธุรกิจ
     */
    async createTask(taskData) {
        // สร้าง task model
        const task = new Task(taskData);

        // ตรวจสอบความถูกต้องพื้นฐาน
        const validation = task.isValid();
        if (!validation.valid) {
            throw new Error(`ข้อมูลไม่ถูกต้อง: ${validation.errors.join(', ')}`);
        }

        // กฎทางธุรกิจเพิ่มเติม
        if (task.priority === 'HIGH' && !task.description) {
            throw new Error('งานลำดับความสำคัญสูงต้องมีรายละเอียด');
        }

        // บันทึกลงฐานข้อมูล
        const createdTask = await taskRepository.create(task);
        
        // Business logic: บันทึก log งานสำคัญ
        if (createdTask.priority === 'HIGH') {
            console.log(`🔥 สร้างงานลำดับความสำคัญสูง: ${createdTask.title}`);
        }

        return createdTask;
    }

    /**
     * อัพเดท task พร้อมกฎทางธุรกิจ
     */
    async updateTask(id, updates) {
        // ตรวจสอบว่า task มีอยู่จริง
        const existingTask = await this.getTaskById(id);

        // ตรวจสอบการอัพเดท
        if (updates.title !== undefined) {
            const tempTask = new Task({ ...existingTask, ...updates });
            const validation = tempTask.isValid();
            if (!validation.valid) {
                throw new Error(`ข้อมูลไม่ถูกต้อง: ${validation.errors.join(', ')}`);
            }
        }

        // กฎทางธุรกิจ: ไม่สามารถเปลี่ยนจาก DONE กลับไปเป็น TODO
        if (existingTask.status === 'DONE' && updates.status === 'TODO') {
            throw new Error('ไม่สามารถเปลี่ยนงานที่เสร็จแล้วกลับไปเป็น TODO ได้');
        }

        // กฎทางธุรกิจ: HIGH priority ต้องมี description
        if (updates.priority === 'HIGH' && !existingTask.description && !updates.description) {
            throw new Error('งานลำดับความสำคัญสูงต้องมีรายละเอียด');
        }

        const updatedTask = await taskRepository.update(id, updates);

        // บันทึก log เมื่อเปลี่ยน status
        if (updates.status && updates.status !== existingTask.status) {
            console.log(`📝 เปลี่ยนสถานะ task ${id}: ${existingTask.status} → ${updates.status}`);
        }

        return updatedTask;
    }

    /**
     * ลบ task พร้อมกฎทางธุรกิจ
     */
    async deleteTask(id) {
        // ตรวจสอบว่า task มีอยู่จริง
        const task = await this.getTaskById(id);

        // กฎทางธุรกิจ: บันทึก log เมื่อลบงานสำคัญ
        if (task.priority === 'HIGH') {
            console.log(`⚠️ กำลังลบงานลำดับความสำคัญสูง: ${task.title}`);
        }

        return await taskRepository.delete(id);
    }

    /**
     * ดึงสถิติ tasks
     */
    async getStatistics() {
        const counts = await taskRepository.countByStatus();
        const allTasks = await taskRepository.findAll();

        return {
            total: allTasks.length,
            byStatus: {
                TODO: counts.TODO || 0,
                IN_PROGRESS: counts.IN_PROGRESS || 0,
                DONE: counts.DONE || 0
            },
            byPriority: {
                LOW: allTasks.filter(t => t.priority === 'LOW').length,
                MEDIUM: allTasks.filter(t => t.priority === 'MEDIUM').length,
                HIGH: allTasks.filter(t => t.priority === 'HIGH').length
            }
        };
    }

    /**
     * เลื่อนงานไปสถานะถัดไป
     */
    async moveToNextStatus(id) {
        const task = await this.getTaskById(id);
        
        const statusFlow = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
            'DONE': 'DONE'
        };

        const nextStatus = statusFlow[task.status];
        
        if (nextStatus === task.status) {
            throw new Error('งานนี้เสร็จสมบูรณ์แล้ว');
        }

        return await this.updateTask(id, { status: nextStatus });
    }
}

module.exports = new TaskService();
```

### 2.6 สร้าง Presentation Layer - Controller (15 นาที)

**src/controllers/taskController.js:**
```javascript
const taskService = require('../services/taskService');

class TaskController {
    /**
     * GET /api/tasks
     * ดึง tasks ทั้งหมดพร้อมตัวกรอง
     */
    async getAllTasks(req, res, next) {
        try {
            const filters = {};
            
            if (req.query.status) {
                filters.status = req.query.status.toUpperCase();
            }
            if (req.query.priority) {
                filters.priority = req.query.priority.toUpperCase();
            }

            const tasks = await taskService.getAllTasks(filters);
            
            res.json({
                success: true,
                data: tasks,
                count: tasks.length
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/tasks/:id
     * ดึง task ตาม ID
     */
    async getTaskById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID ไม่ถูกต้อง'
                });
            }

            const task = await taskService.getTaskById(id);
            
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            if (error.message.includes('ไม่พบ')) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    /**
     * POST /api/tasks
     * สร้าง task ใหม่
     */
    async createTask(req, res, next) {
        try {
            const taskData = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                priority: req.body.priority
            };

            const task = await taskService.createTask(taskData);
            
            res.status(201).json({
                success: true,
                data: task,
                message: 'สร้างงานสำเร็จ'
            });
        } catch (error) {
            if (error.message.includes('ข้อมูลไม่ถูกต้อง') || 
                error.message.includes('ต้องมีรายละเอียด')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    /**
     * PUT /api/tasks/:id
     * อัพเดท task
     */
    async updateTask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID ไม่ถูกต้อง'
                });
            }

            const updates = {};
            if (req.body.title !== undefined) updates.title = req.body.title;
            if (req.body.description !== undefined) updates.description = req.body.description;
            if (req.body.status !== undefined) updates.status = req.body.status;
            if (req.body.priority !== undefined) updates.priority = req.body.priority;

            const task = await taskService.updateTask(id, updates);
            
            res.json({
                success: true,
                data: task,
                message: 'อัพเดทงานสำเร็จ'
            });
        } catch (error) {
            if (error.message.includes('ไม่พบ')) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.message.includes('ข้อมูลไม่ถูกต้อง') || 
                error.message.includes('ไม่สามารถ')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    /**
     * DELETE /api/tasks/:id
     * ลบ task
     */
    async deleteTask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID ไม่ถูกต้อง'
                });
            }

            await taskService.deleteTask(id);
            
            res.json({
                success: true,
                message: 'ลบงานสำเร็จ'
            });
        } catch (error) {
            if (error.message.includes('ไม่พบ')) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    /**
     * GET /api/tasks/stats
     * ดึงสถิติ tasks
     */
    async getStatistics(req, res, next) {
        try {
            const stats = await taskService.getStatistics();
            
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/tasks/:id/next-status
     * เลื่อนงานไปสถานะถัดไป
     */
    async moveToNextStatus(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID ไม่ถูกต้อง'
                });
            }

            const task = await taskService.moveToNextStatus(id);
            
            res.json({
                success: true,
                data: task,
                message: 'เปลี่ยนสถานะงานสำเร็จ'
            });
        } catch (error) {
            if (error.message.includes('ไม่พบ')) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.message.includes('เสร็จสมบูรณ์แล้ว')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }
}

module.exports = new TaskController();
```

### 2.7 สร้าง Middleware (10 นาที)

**src/middleware/errorHandler.js:**
```javascript
/**
 * Middleware จัดการ errors ทั้งหมด
 */
function errorHandler(err, req, res, next) {
    console.error('❌ เกิดข้อผิดพลาด:', err);

    // Default error
    let statusCode = 500;
    let message = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';

    // Database errors
    if (err.message && err.message.includes('SQLITE')) {
        statusCode = 500;
        message = 'เกิดข้อผิดพลาดในฐานข้อมูล';
    }

    // Validation errors
    if (err.message && err.message.includes('ข้อมูลไม่ถูกต้อง')) {
        statusCode = 400;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

module.exports = errorHandler;
```

**src/utils/logger.js:**
```javascript
/**
 * Logger utility
 */
class Logger {
    info(message, ...args) {
        console.log(`ℹ️  [INFO] ${message}`, ...args);
    }

    error(message, ...args) {
        console.error(`❌ [ERROR] ${message}`, ...args);
    }

    warn(message, ...args) {
        console.warn(`⚠️  [WARN] ${message}`, ...args);
    }

    debug(message, ...args) {
        if (process.env.LOG_LEVEL === 'debug') {
            console.log(`🐛 [DEBUG] ${message}`, ...args);
        }
    }
}

module.exports = new Logger();
```

### 2.8 อัพเดท Server File (10 นาที)

**server.js:**
```javascript
require('dotenv').config();
const express = require('express');
const database = require('./database/connection');
const taskController = require('./src/controllers/taskController');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes - Statistics (ต้องอยู่ก่อน :id routes)
app.get('/api/tasks/stats', taskController.getStatistics.bind(taskController));

// Routes - CRUD
app.get('/api/tasks', taskController.getAllTasks.bind(taskController));
app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
app.post('/api/tasks', taskController.createTask.bind(taskController));
app.put('/api/tasks/:id', taskController.updateTask.bind(taskController));
app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));

// Routes - Special actions
app.patch('/api/tasks/:id/next-status', taskController.moveToNextStatus.bind(taskController));

// Error handling middleware (ต้องอยู่สุดท้าย)
app.use(errorHandler);

// เริ่ม server
async function startServer() {
    try {
        // เชื่อมต่อฐานข้อมูล
        await database.connect();
        
        // เริ่ม Express server
        app.listen(PORT, () => {
            logger.info(`🚀 เซิร์ฟเวอร์ทำงานที่ http://localhost:${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        logger.error('ไม่สามารถเริ่มเซิร์ฟเวอร์ได้:', error);
        process.exit(1);
    }
}

// จัดการการปิดอย่างถูกต้อง
process.on('SIGINT', async () => {
    logger.info('กำลังปิดเซิร์ฟเวอร์...');
    await database.close();
    process.exit(0);
});

startServer();
```

---

## ส่วนที่ 3: Testing และ Validation (40 นาที)

### 3.1 ทดสอบด้วยตนเอง (20 นาที)

```bash
# เริ่มเซิร์ฟเวอร์
npm run dev
```

**ทดสอบด้วย Thunder Client หรือ curl:**

```bash
# 1. ดึง tasks ทั้งหมด
curl http://localhost:3000/api/tasks

# 2. ดึงสถิติ
curl http://localhost:3000/api/tasks/stats

# 3. สร้าง task (ถูกต้อง)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"ทดสอบ Layered Arch","description":"ทดสอบ 3-tier","priority":"HIGH"}'

# 4. สร้าง task (ผิด - ควรล้มเหลว)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"AB","priority":"HIGH"}'

# 5. อัพเดท task
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'

# 6. เลื่อนไปสถานะถัดไป
curl -X PATCH http://localhost:3000/api/tasks/1/next-status

# 7. ลบ task
curl -X DELETE http://localhost:3000/api/tasks/1
```

### 3.2 Checklist การทดสอบ

**การทดสอบฟังก์ชัน:**
- [ ] ✅ GET /api/tasks - คืนค่า tasks ทั้งหมด
- [ ] ✅ GET /api/tasks/:id - คืนค่า task ตัวเดียว
- [ ] ✅ GET /api/tasks?status=TODO - กรองตาม status
- [ ] ✅ GET /api/tasks/stats - คืนค่าสถิติ
- [ ] ✅ POST /api/tasks - สร้าง task ที่ถูกต้อง
- [ ] ✅ POST /api/tasks - ปฏิเสธ task ที่ title < 3 ตัวอักษร
- [ ] ✅ POST /api/tasks - ปฏิเสธ HIGH priority ที่ไม่มี description
- [ ] ✅ PUT /api/tasks/:id - อัพเดท task
- [ ] ✅ PUT /api/tasks/:id - ปฏิเสธการเปลี่ยนจาก DONE เป็น TODO
- [ ] ✅ PATCH /api/tasks/:id/next-status - เลื่อนสถานะไปข้างหน้า
- [ ] ✅ DELETE /api/tasks/:id - ลบ task

**การทดสอบการแยก Layer:**
- [ ] ✅ Controller ไม่มี business logic
- [ ] ✅ Service ไม่มี database queries
- [ ] ✅ Repository ไม่มี business rules

### 3.3 ตรวจสอบคุณภาพโค้ด (10 นาที)

**ตรวจสอบโค้ดของคุณ:**

1. **Separation of Concerns**
   - แต่ละ layer มีหน้าที่เดียว?
   - ไม่มีการปนกันของหน้าที่?

2. **Error Handling**
   - ทุก async functions ใช้ try-catch?
   - Errors ส่งต่อได้ถูกต้อง?

3. **Validation**
   - Input validation ที่ controller level?
   - Business validation ที่ service level?

4. **Code Organization**
   - ไฟล์อยู่ในโฟลเดอร์ที่ถูกต้อง?
   - ตั้งชื่อชัดเจนและสม่ำเสมอ?

---

## ส่วนที่ 4: การวิเคราะห์และเอกสาร (40 นาที)

### 🎯 ส่วนที่ 4.1: การวิเคราะห์เปรียบเทียบ (20 นาที) ⭐ **ต้องทำเอง**

นี่คือส่วนที่สำคัญที่สุดของ Lab นี้ นักศึกษาต้องวิเคราะห์และเปรียบเทียบ Monolithic vs Layered Architecture

**สร้างไฟล์ ANALYSIS.md และตอบคำถามต่อไปนี้:**

#### คำถาม 1: การเปรียบเทียบโครงสร้าง (5 คะแนน)

**ก. จำนวนบรรทัดโค้ดและไฟล์**

สร้างตารางเปรียบเทียบ:

| ข้อมูล | Monolithic (Week 3) | Layered (Week 4) |
|--------|---------------------|------------------|
| จำนวนไฟล์ JS หลัก | | |
| จำนวนบรรทัดทั้งหมด | | |
| จำนวน layers | | |
| ความซับซ้อนโดยรวม | | |

**คำถาม:**
1. Layered มีจำนวนไฟล์และบรรทัดโค้ดมากกว่าหรือน้อยกว่า Monolithic? เพราะอะไร?
2. ความซับซ้อนที่เพิ่มขึ้นคุ้มค่าหรือไม่? อธิบาย

**คำตอบของคุณ:**
```
[เขียนคำตอบที่นี่]







```

#### คำถาม 2: จุดแข็ง-จุดอ่อน (10 คะแนน)

**วิเคราะห์จุดแข็งของ Layered Architecture:**

สร้างตารางวิเคราะห์:

| Quality Attribute | Monolithic | Layered | คะแนน<br>(1-5) | อธิบายเหตุผล |
|-------------------|------------|---------|--------|-------------|
| **Maintainability**<br>(ความง่ายในการดูแล) | | | | |
| **Testability**<br>(ความง่ายในการทดสอบ) | | | | |
| **Modifiability**<br>(ความง่ายในการแก้ไข) | | | | |
| **Reusability**<br>(การนำกลับมาใช้ใหม่) | | | | |
| **Team Collaboration**<br>(การทำงานเป็นทีม) | | | | |
| **Performance**<br>(ประสิทธิภาพ) | | | | |
| **Simplicity**<br>(ความเรียบง่าย) | | | | |

**คำแนะนำ:**
- ให้คะแนน 1-5 (1 = แย่ที่สุด, 5 = ดีที่สุด)
- อธิบายเหตุผลอย่างละเอียด โดยยกตัวอย่างจากโค้ดจริง
- เปรียบเทียบว่าส่วนไหนของโค้ดทำให้ดีขึ้นหรือแย่ลง

#### คำถาม 3: สถานการณ์จริง (5 คะแนน)

**วิเคราะห์สถานการณ์ต่อไปนี้:**

**สถานการณ์ที่ 1:** ต้องการเพิ่มฟีเจอร์ "assign task to user"
- ใน Monolithic จะต้องแก้ไขอย่างไร?
- ใน Layered จะต้องแก้ไขอย่างไร?
- แบบไหนง่ายกว่า? เพราะอะไร?

**คำตอบของคุณ:**
```
Monolithic:




Layered:




สรุป:


```

**สถานการณ์ที่ 2:** มีบั๊กที่ validation logic (ตรวจสอบ title)
- ใน Monolithic จะต้องหาบั๊กและแก้ไขที่ไหน?
- ใน Layered จะต้องหาบั๊กและแก้ไขที่ไหน?
- แบบไหนง่ายกว่า? เพราะอะไร?

**คำตอบของคุณ:**
```
Monolithic:




Layered:




สรุป:


```

**สถานการณ์ที่ 3:** ต้องการเปลี่ยนจาก SQLite เป็น PostgreSQL
- ใน Monolithic จะต้องแก้ไขกี่ที่?
- ใน Layered จะต้องแก้ไขกี่ที่?
- แบบไหนง่ายกว่า? เพราะอะไร?

**คำตอบของคุณ:**
```
Monolithic:




Layered:




สรุป:


```

#### คำถาม 4: Trade-offs (5 คะแนน)

**วิเคราะห์ Trade-offs:**

1. **Complexity vs Maintainability**
   - Layered มีความซับซ้อนมากขึ้น แต่ดูแลง่ายขึ้น
   - คุณคิดว่า trade-off นี้คุ้มค่าหรือไม่? เพราะอะไร?
   - ในกรณีไหนที่คุ้มค่า? ในกรณีไหนที่ไม่คุ้มค่า?

**คำตอบของคุณ:**
```







```

2. **Performance Overhead**
   - Layered มี overhead จากการเรียกผ่าน layers
   - คุณคิดว่ามีผลกระทบมากแค่ไหน?
   - ในแอปพลิเคชันประเภทใดที่ performance overhead นี้สำคัญ?

**คำตอบของคุณ:**
```







```

#### คำถาม 5: การตัดสินใจเลือกใช้ (5 คะแนน)

**ออกแบบกฎการตัดสินใจ:**

สร้าง Decision Tree สำหรับตัดสินใจว่าจะใช้ Monolithic หรือ Layered:

```
เริ่มต้นโปรเจกต์
│
├─ ขนาดทีม?
│  ├─ 1-2 คน → [คำตอบของคุณ]
│  └─ 3+ คน → [คำตอบของคุณ]
│
├─ ขนาดโปรเจกต์?
│  ├─ เล็ก (< 1000 บรรทัด) → [คำตอบของคุณ]
│  ├─ กลาง (1000-10000 บรรทัด) → [คำตอบของคุณ]
│  └─ ใหญ่ (> 10000 บรรทัด) → [คำตอบของคุณ]
│
├─ ระยะเวลาพัฒนา?
│  ├─ ต้องการเร็ว (< 1 เดือน) → [คำตอบของคุณ]
│  └─ มีเวลา (> 1 เดือน) → [คำตอบของคุณ]
│
└─ ต้องการ maintainability สูง?
   ├─ ใช่ → [คำตอบของคุณ]
   └─ ไม่ → [คำตอบของคุณ]
```

**อธิบายเหตุผลของการตัดสินใจแต่ละข้อ:**
```








```

---

### 🎯 ส่วนที่ 4.2: เอกสารประกอบ (20 นาที)

### สร้าง README.md

````markdown
# Week 4: Task Board - Layered Architecture

## ภาพรวม

โปรเจกต์นี้ใช้ **Layered (3-Tier) Architecture**:

### Layers:

1. **Presentation Layer** (`src/controllers/`)
   - จัดการ HTTP requests/responses
   - ตรวจสอบรูปแบบข้อมูลเข้า
   - จัดรูปแบบข้อมูลออก

2. **Business Logic Layer** (`src/services/`)
   - กฎทางธุรกิจและการตรวจสอบ
   - การประสานงาน workflow
   - การแปลงข้อมูล

3. **Data Access Layer** (`src/repositories/`)
   - การดำเนินการฐานข้อมูล
   - ประมวลผล queries
   - จัดเก็บข้อมูล

## โครงสร้างโปรเจกต์
```
week4-layered/
├── src/
│   ├── controllers/    # Presentation Layer
│   ├── services/       # Business Logic Layer
│   ├── repositories/   # Data Access Layer
│   ├── models/         # Data Models
│   └── middleware/     # Express middleware
├── database/
├── public/
└── server.js
```
## การติดตั้ง

```bash
npm install
```

## การตั้งค่า

สร้างไฟล์ `.env`:

NODE_ENV=development
PORT=3000
DB_PATH=./database/tasks.db
LOG_LEVEL=debug

## การรัน

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Tasks
- `GET /api/tasks` - ดึง tasks ทั้งหมด (พร้อมตัวกรอง)
- `GET /api/tasks/:id` - ดึง task ตาม ID
- `POST /api/tasks` - สร้าง task ใหม่
- `PUT /api/tasks/:id` - อัพเดท task
- `DELETE /api/tasks/:id` - ลบ task

### Statistics
- `GET /api/tasks/stats` - ดึงสถิติ tasks

### Actions
- `PATCH /api/tasks/:id/next-status` - เลื่อนไปสถานะถัดไป

## กฎทางธุรกิจ

1. ชื่อ task ต้องมี 3-100 ตัวอักษร
2. งาน HIGH priority ต้องมีรายละเอียด
3. ไม่สามารถเปลี่ยนงาน DONE กลับไปเป็น TODO
4. สถานะที่ใช้ได้: TODO, IN_PROGRESS, DONE
5. ระดับความสำคัญที่ใช้ได้: LOW, MEDIUM, HIGH

## ข้อดีของ Layered Architecture

✅ **Maintainability** - แก้ไข layers ที่ต้องการได้ง่าย  
✅ **Testability** - ทดสอบแต่ละ layer ได้อิสระ  
✅ **Reusability** - Layers สามารถนำกลับมาใช้ได้  
✅ **Separation of Concerns** - หน้าที่ชัดเจน  
✅ **Team Collaboration** - ทีมต่างๆ ทำงานใน layers ต่างกันได้

## Trade-offs

❌ **Complexity** - มีไฟล์และโครงสร้างมากขึ้น  
❌ **Performance** - มี overhead จาก layers  
❌ **Over-engineering** - อาจมากเกินไปสำหรับโปรเจกต์เล็ก

## เทคโนโลยีที่ใช้

- Node.js 20+
- Express.js 4.18+
- SQLite3 5.1+
- dotenv

## ผู้พัฒนา

[ชื่อของคุณ] - ENGSE207 สัปดาห์ที่ 4

---
````

### สร้าง REFLECTION.md

```markdown
# การสะท้อนคิด สัปดาห์ที่ 4: Layered Architecture

## 1. สิ่งที่เรียนรู้

[อธิบายสิ่งที่คุณเรียนรู้เกี่ยวกับ layered architecture]

## 2. ข้อดีที่พบจากการทำจริง

[บอกข้อดีที่คุณสังเกตเห็นขณะทำ lab นี้]

## 3. ความท้าทายที่พบ

[อธิบายความท้าทายและวิธีแก้ปัญหา]

## 4. การจัดโครงสร้างโค้ด

การแบ่ง layers ช่วยให้การจัดโครงสร้างโค้ดดีขึ้นอย่างไรเมื่อเทียบกับสัปดาห์ที่ 3?

[คำตอบของคุณ]

## 5. เมื่อไหร่ควรใช้ Layered Architecture

[อธิบายสถานการณ์ที่ layered architecture เหมาะสม]

## 6. การวิเคราะห์ Trade-offs

### ข้อดี
- 

### ข้อเสีย
-

### การประเมินโดยรวม
[ข้อสรุปของคุณ]

---
```

### 4.3 Create Architecture Diagram

**Create `ARCHITECTURE.md` with diagram:**

````markdown
# Architecture Diagram

## High-Level Architecture


┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                    │
│                    (HTML/CSS/JavaScript)                │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           ▼
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (Controllers)           │
│                                                         │
│  ┌──────────────┐    ┌─────────────────────────┐        │
│  │Task          │    │  - Input Validation     │        │
│  │Controller    │───▶│  - Response Formatting  │        │
│  └──────────────┘    │  - HTTP Error Handling  │        │
│                      └─────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER (Services)              │
│                                                         │
│  ┌──────────────┐    ┌─────────────────────────┐        │
│  │Task          │    │  - Business Rules       │        │
│  │Service       │───▶│  - Validation Logic     │        │
│  └──────────────┘    │  - Orchestration        │        │
│                      └─────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│           DATA ACCESS LAYER (Repositories)              │
│                                                         │
│  ┌──────────────┐    ┌─────────────────────────┐        │
│  │Task          │    │  - CRUD Operations      │        │
│  │Repository    │───▶│  - Query Execution      │        │
│  └──────────────┘    │  - Data Mapping         │        │
│                      └─────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │   DATABASE   │
                   │   (SQLite)   │
                   └──────────────┘

## Data Flow Example: Create Task

1. Client sends POST /api/tasks
   ↓
2. TaskController.createTask()
   - Validates HTTP request
   - Extracts data
   ↓
3. TaskService.createTask(data)
   - Validates business rules
   - Applies business logic
   ↓
4. TaskRepository.create(task)
   - Executes SQL INSERT
   - Returns created task
   ↓
5. Response flows back up
   Repository → Service → Controller → Client

````

---

## 📤 การส่งงานและเกณฑ์การให้คะแนน

### Checklist การส่งงาน:

- [ ] แบ่ง layers ได้ถูกต้องครบทั้ง 3 layers
- [ ] โค้ดทำงานได้ไม่มี errors
- [ ] CRUD operations ทั้งหมดทำงานได้
- [ ] **ANALYSIS.md เสร็จสมบูรณ์** ⭐ (สำคัญมาก)
- [ ] README.md เสร็จสมบูรณ์
- [ ] REFLECTION.md ตอบคำถามครบ
- [ ] Git commits มีความหมาย
- [ ] ไม่มี node_modules ใน Git

### ส่งงาน:

1. **GitHub Repository** (แนะนำ)
   ```bash
   git add .
   git commit -m "Week 4: เสร็จสมบูรณ์ Layered Architecture"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **ไฟล์ ZIP** (ทางเลือก)
   ```bash
   # ไม่รวม node_modules และ database
   zip -r week4-layered.zip . -x "node_modules/*" "*.db"
   ```

### เกณฑ์การให้คะแนน (35 คะแนน):

| หัวข้อ | คะแนน | รายละเอียด |
|-------|------|-----------|
| **1. Architecture** | 5 | แบ่ง 3-tier ถูกต้อง, หน้าที่ชัดเจน |
| **2. Code Quality** | 3 | โค้ดสะอาด, error handling ดี |
| **3. Functionality** | 3 | CRUD operations ทำงานได้ทั้งหมด |
| **4. Business Rules** | 2 | กฎทางธุรกิจทำงานถูกต้อง |
| **5. การวิเคราะห์** ⭐ | 15 | **ANALYSIS.md ครบและลึกซึ้ง** |
|    - คำถาม 1 | 5 | เปรียบเทียบโครงสร้าง |
|    - คำถาม 2 | 10 | จุดแข็ง-จุดอ่อน Quality Attributes |
|    - คำถาม 3 | 5 | สถานการณ์จริง |
|    - คำถาม 4 | 5 | Trade-offs |
|    - คำถาม 5 | 5 | Decision Tree |
| **6. Documentation** | 3 | README, REFLECTION ครบถ้วน |
| **7. Git** | 2 | Commits มีความหมาย |
| **8. แบบฝึกหัด** | 2 | Layer Decision Tree ถูกต้อง |
| **รวม** | **35** | |

**หมายเหตุ:** การวิเคราะห์ (ข้อ 5) มีน้ำหนักถึง 43% ของคะแนนทั้งหมด เพราะเป็นส่วนที่แสดงความเข้าใจอย่างแท้จริง

---

## 🛠️ แก้ปัญหาเบื้องต้น

### ปัญหาที่พบบ่อย:

**"Cannot find module"**
```bash
npm install
```

**"Port 3000 already in use"**
```bash
# หา process
lsof -i :3000

# Kill มัน
kill -9 <PID>

# หรือใช้ port อื่น
PORT=3001 npm start
```

**"Database locked"**
```bash
# ปิดการเชื่อมต่อฐานข้อมูลทั้งหมด
# ปิด SQLite Viewer ใน VS Code
# Restart server
```

**"Validation ไม่ทำงาน"**
```javascript
// ตรวจสอบว่าเรียก Task.isValid() ใน service
const validation = task.isValid();
if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
}
```

---

## 🎯 Best Practices ที่ได้เรียนรู้

1. **Single Responsibility** - แต่ละ layer มีหน้าที่เดียว
2. **Dependency Flow** - เรียกจากบนลงล่างเสมอ (Controller → Service → Repository)
3. **Error Handling** - ส่ง errors ขึ้นมาผ่าน layers
4. **Validation** - Input ที่ controller, business ที่ service
5. **Abstraction** - Layers สื่อสารผ่าน interfaces

---

## 📚 สัปดาห์หน้า: Client-Server Architecture

**สัปดาห์ที่ 5: Client-Server Architecture พร้อม VM**

- ติดตั้ง Ubuntu VM ใน VirtualBox
- Deploy backend ไปยัง VM
- Frontend อยู่ใน local machine
- การสื่อสาร API ผ่าน network
- การจัดการ process ด้วย PM2
- การจำลองการ deploy จริง

**เตรียมตัวสำหรับสัปดาห์ที่ 5:**
- ดาวน์โหลด VirtualBox
- ดาวน์โหลด Ubuntu Server 22.04 ISO
- ทบทวนพื้นฐาน networking
- เข้าใจการ deploy API

---

## 🎉 ยินดีด้วย!

คุณได้ refactor แอปพลิเคชัน monolithic ให้เป็น layered architecture ที่สะอาดและดูแลง่ายแล้ว!

**สิ่งที่ได้รับ:**
- ✅ ความเข้าใจ separation of concerns
- ✅ ประสบการณ์กับโครงสร้างโค้ดมืออาชีพ
- ✅ ความรู้เกี่ยวกับ layer responsibilities
- ✅ ความสามารถในการออกแบบระบบที่ดูแลง่าย
- ✅ **ทักษะการวิเคราะห์ architectural trade-offs** ⭐

**รูปแบบนี้ใช้กันจริงใน:**
- แอปพลิเคชันองค์กร
- ระบบธนาคาร
- แพลตฟอร์ม E-commerce
- ระบบโรงพยาบาล

---

*ENGCE301 - Software Design and Development*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
*ภาควิชาวิศวกรรมซอฟต์แวร์*
