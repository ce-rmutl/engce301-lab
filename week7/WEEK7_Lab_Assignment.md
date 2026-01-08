# 📚 ENGCE301 - Week 7 Lab Assignment
## Library Management System API

```
╔══════════════════════════════════════════════════════════════╗
║              LAB: ระบบจัดการห้องสมุด API                     ║
║                   คะแนน: 15 คะแนน                           ║
║           กำหนดส่ง: ก่อนเรียน Week 8 (กำหนดเอง)            ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 จุดประสงค์

สร้าง RESTful API สำหรับระบบจัดการห้องสมุด โดยใช้:
- **SQLite** สำหรับเก็บข้อมูล
- **Layered Architecture** (4 Layers)
- **Express.js** สำหรับ Web Server

---

## 📋 ข้อกำหนด (Requirements)

### 1. Database Design (3 คะแนน)

ต้องมี **3 Tables:**

#### Table 1: `books`
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT, NOT NULL)
- `author` (TEXT, NOT NULL)
- `isbn` (TEXT, UNIQUE)
- `category` (TEXT)
- `total_copies` (INTEGER, ≥ 0)
- `available_copies` (INTEGER, ≥ 0)
- `created_at` (DATETIME)

#### Table 2: `members`
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `phone` (TEXT)
- `membership_date` (DATE)
- `status` (TEXT: 'active' or 'inactive')

#### Table 3: `borrowings`
- `id` (INTEGER PRIMARY KEY)
- `book_id` (INTEGER, FK → books)
- `member_id` (INTEGER, FK → members)
- `borrow_date` (DATE, NOT NULL)
- `due_date` (DATE, NOT NULL)
- `return_date` (DATE, NULL)
- `status` (TEXT: 'borrowed', 'returned', 'overdue')

**ต้องมี:**
- Foreign Keys
- CHECK Constraints
- Indexes
- Sample Data (อย่างน้อย 5 books, 3 members, 3 borrowings)

---

### 2. API Endpoints (8 คะแนน)

ต้องมี **15 Endpoints:**

#### Books API (5 endpoints)
```
GET    /api/books              # ดึงหนังสือทั้งหมด
GET    /api/books/:id          # ดึงหนังสือ 1 เล่ม
GET    /api/books/search?q=    # ค้นหาหนังสือ
POST   /api/books              # เพิ่มหนังสือ
PUT    /api/books/:id          # แก้ไขหนังสือ
```

#### Members API (4 endpoints)
```
GET    /api/members            # ดึงสมาชิกทั้งหมด
GET    /api/members/:id        # ดึงสมาชิก 1 คน
POST   /api/members            # เพิ่มสมาชิก
PUT    /api/members/:id        # แก้ไขสมาชิก
```

#### Borrowings API (6 endpoints)
```
GET    /api/borrowings                    # ดึงรายการยืมทั้งหมด
GET    /api/borrowings/:id                # ดึงรายการยืม 1 รายการ
GET    /api/borrowings/member/:memberId   # ดึงรายการยืมของสมาชิก
POST   /api/borrowings/borrow             # ยืมหนังสือ
PUT    /api/borrowings/:id/return         # คืนหนังสือ
GET    /api/borrowings/overdue            # ดูรายการเกินกำหนด
```

---

### 3. Business Logic (2 คะแนน)

ต้องมี **Validation Rules:**

**การยืมหนังสือ:**
- ✅ หนังสือต้องมีเล่มว่าง (available_copies > 0)
- ✅ สมาชิกต้อง status = 'active'
- ✅ สมาชิกยืมได้ไม่เกิน 3 เล่มพร้อมกัน
- ✅ ระยะเวลายืม = 14 วัน
- ✅ เมื่อยืม: available_copies ลด 1

**การคืนหนังสือ:**
- ✅ บันทึก return_date
- ✅ เปลี่ยน status เป็น 'returned'
- ✅ เมื่อคืน: available_copies เพิ่ม 1
- ✅ ถ้าเกิน due_date: คิดค่าปรับ (แสดงใน response)

**การเพิ่มหนังสือ:**
- ✅ ISBN ต้องไม่ซ้ำ
- ✅ total_copies >= available_copies

---

### 4. Code Organization (2 คะแนน)

ต้องมี **4 Layers ที่ชัดเจน:**

```
week7-lab/
├── database/
│   ├── connection.js
│   ├── schema.sql
│   ├── init-db.js
│   ├── books.db.js
│   ├── members.db.js
│   └── borrowings.db.js
├── services/
│   ├── book.service.js
│   ├── member.service.js
│   └── borrowing.service.js
├── controllers/
│   ├── book.controller.js
│   ├── member.controller.js
│   └── borrowing.controller.js
├── routes/
│   ├── books.route.js
│   ├── members.route.js
│   └── borrowings.route.js
├── server.js
├── package.json
└── README.md
```

---

## 🚀 เริ่มต้นโปรเจกต์

### ขั้นตอนที่ 1: Setup

```bash
mkdir week7-lab
cd week7-lab
npm init -y
npm install express cors sqlite3
npm install --save-dev nodemon
```

### ขั้นตอนที่ 2: สร้างโครงสร้าง

```bash
mkdir database services controllers routes
touch server.js README.md
```

---

## 📝 ไฟล์ที่ให้โค้ด (Starter Code)

### 1. `package.json` (ให้ 100%)

```json
{
  "name": "week7-lab",
  "version": "1.0.0",
  "description": "Library Management System API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node database/init-db.js"
  },
  "keywords": ["library", "api", "sqlite"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

### 2. `database/connection.js` (ให้ 100%)

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'library.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        db.run('PRAGMA foreign_keys = ON');
    }
});

module.exports = db;
```

---

### 3. `database/schema.sql` (ให้ 60% - นักศึกษาเติม)

```sql
-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== MEMBERS TABLE =====
-- TODO: นักศึกษาสร้าง table members
-- ต้องมี: id, name, email (UNIQUE), phone, membership_date, status


-- ===== BORROWINGS TABLE =====
-- TODO: นักศึกษาสร้าง table borrowings
-- ต้องมี: id, book_id (FK), member_id (FK), borrow_date, due_date, return_date, status


-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- TODO: สร้าง indexes สำหรับ members (email)
-- TODO: สร้าง indexes สำหรับ borrowings (book_id, member_id, status)


-- ===== SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);

-- ===== SAMPLE DATA: Members =====
-- TODO: Insert 3 members


-- ===== SAMPLE DATA: Borrowings =====
-- TODO: Insert 3 borrowings (บางเล่มยืมอยู่, บางเล่มคืนแล้ว)

```

---

### 4. `database/init-db.js` (ให้ 100%)

```javascript
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'library.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Delete existing database
if (fs.existsSync(dbPath)) {
    console.log('🗑️  Deleting existing database...');
    fs.unlinkSync(dbPath);
}

console.log('📝 Creating new database...');
const db = new sqlite3.Database(dbPath);

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Database created successfully');
    
    // Verify
    db.all('SELECT COUNT(*) as count FROM books', (err, rows) => {
        if (!err) {
            console.log(`📚 Books: ${rows[0].count}`);
        }
        
        db.all('SELECT COUNT(*) as count FROM members', (err, rows) => {
            if (!err) {
                console.log(`👥 Members: ${rows[0].count}`);
            }
            
            db.close();
            console.log('\n✅ Database initialization complete!\n');
        });
    });
});
```

---

### 5. `database/books.db.js` (ให้ 50% - นักศึกษาเติม)

```javascript
const db = require('./connection');

class BookDatabase {
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน findById
    static findById(id) {
        // เขียนโค้ดตรงนี้
    }

    // TODO: นักศึกษาเขียน search (ค้นหาจาก title หรือ author)
    static search(keyword) {
        // เขียนโค้ดตรงนี้
    }

    // TODO: นักศึกษาเขียน create
    static create(bookData) {
        // เขียนโค้ดตรงนี้
    }

    // TODO: นักศึกษาเขียน update
    static update(id, bookData) {
        // เขียนโค้ดตรงนี้
    }

    // ✅ ให้โค้ดสมบูรณ์ - ฟังก์ชันสำคัญสำหรับ borrowing
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: นักศึกษาเขียน increaseAvailableCopies (สำหรับคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        // เขียนโค้ดตรงนี้
    }
}

module.exports = BookDatabase;
```

---

### 6. `services/borrowing.service.js` (ให้ 40% - นักศึกษาเขียนส่วนใหญ่)

```javascript
const BorrowingDB = require('../database/borrowings.db');
const BookDB = require('../database/books.db');
const MemberDB = require('../database/members.db');

class BorrowingService {
    // ===== BORROW BOOK =====
    static async borrowBook(borrowData) {
        try {
            const { book_id, member_id } = borrowData;

            // TODO: 1. ตรวจสอบว่า book มีอยู่จริงและมีเล่มว่าง
            

            // TODO: 2. ตรวจสอบว่า member มีอยู่จริงและ status = 'active'
            

            // TODO: 3. ตรวจสอบว่า member ยืมไม่เกิน 3 เล่ม
            

            // TODO: 4. คำนวณ due_date (14 วันจากวันนี้)
            const borrowDate = new Date();
            const dueDate = new Date();
            // เติมโค้ดคำนวณ due_date
            

            // TODO: 5. สร้าง borrowing record
            

            // TODO: 6. ลด available_copies
            

            return /* ส่งข้อมูลการยืมกลับ */;
        } catch (error) {
            throw error;
        }
    }

    // ===== RETURN BOOK =====
    static async returnBook(borrowingId) {
        try {
            // TODO: 1. ดึงข้อมูล borrowing
            

            // TODO: 2. ตรวจสอบว่ายังไม่คืน
            

            // TODO: 3. บันทึก return_date และเปลี่ยน status
            

            // TODO: 4. เพิ่ม available_copies
            

            // TODO: 5. คำนวณค่าปรับ (ถ้าเกิน due_date)
            // ค่าปรับ = 20 บาท/วัน
            

            return /* ส่งข้อมูลการคืนพร้อมค่าปรับ */;
        } catch (error) {
            throw error;
        }
    }

    // TODO: เขียน getOverdueBorrowings
    static async getOverdueBorrowings() {
        // เขียนโค้ดตรงนี้
    }
}

module.exports = BorrowingService;
```

---

### 7. `server.js` (ให้ 80%)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
const booksRouter = require('./routes/books.route');
const membersRouter = require('./routes/members.route');
const borrowingsRouter = require('./routes/borrowings.route');

app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/borrowings', borrowingsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Library Management System API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            members: '/api/members',
            borrowings: '/api/borrowings'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('📚 Library Management System API');
    console.log('='.repeat(60));
    console.log(`Server: http://localhost:${PORT}`);
    console.log('='.repeat(60));
});
```

---

## 🎯 งานที่ต้องทำ

### ✏️ ส่วนที่ 1: Database (3 คะแนน)
- [ ] เติม schema.sql ให้สมบูรณ์ (tables, indexes, sample data)
- [ ] รัน `npm run init-db` สำเร็จ
- [ ] ตรวจสอบข้อมูลด้วย DB Browser

### ✏️ ส่วนที่ 2: Database Layer (2 คะแนน)
- [ ] เขียน books.db.js ให้สมบูรณ์
- [ ] เขียน members.db.js ทั้งหมด
- [ ] เขียน borrowings.db.js ทั้งหมด

### ✏️ ส่วนที่ 3: Service Layer (3 คะแนน)
- [ ] เขียน book.service.js
- [ ] เขียน member.service.js
- [ ] เขียน borrowing.service.js (พร้อม business logic)

### ✏️ ส่วนที่ 4: Controller Layer (2 คะแนน)
- [ ] เขียน book.controller.js
- [ ] เขียน member.controller.js
- [ ] เขียน borrowing.controller.js

### ✏️ ส่วนที่ 5: Router Layer (1 คะแนน)
- [ ] เขียน books.route.js
- [ ] เขียน members.route.js
- [ ] เขียน borrowings.route.js

### ✏️ ส่วนที่ 6: Testing & Documentation (2 คะแนน)
- [ ] ทดสอบทุก endpoint ด้วย Postman
- [ ] สร้าง README.md (วิธีติดตั้ง, API docs, screenshots)
- [ ] Export Postman Collection

### ✏️ ส่วนที่ 7: Bonus (2 คะแนน)
- [ ] Pagination สำหรับ GET /api/books และ /api/members
- [ ] Statistics endpoint (จำนวนหนังสือทั้งหมด, จำนวนที่ยืมอยู่, etc.)
- [ ] Input validation middleware

---

## 📊 เกณฑ์การให้คะแนน

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|-----------|
| **Database Schema** | 3 | Tables, FKs, Indexes, Sample Data |
| **Database Layer** | 2 | CRUD operations, Promises |
| **Service Layer** | 3 | Business Logic, Validation |
| **Controller Layer** | 2 | Error Handling, Status Codes |
| **Router Layer** | 1 | Routes definition |
| **Testing & Docs** | 2 | Postman, README |
| **Code Quality** | 2 | Organization, Comments, Best Practices |
| **Bonus** | +2 | Extra Features |
| **รวม** | **15** | (+2 Bonus) |

---

## 🧪 ตัวอย่างการทดสอบ

### Test Case 1: Borrow Book (Success)

```bash
POST /api/borrowings/borrow
Content-Type: application/json

{
  "book_id": 1,
  "member_id": 1
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "id": 4,
    "book_id": 1,
    "book_title": "Clean Code",
    "member_id": 1,
    "member_name": "สมชาย ใจดี",
    "borrow_date": "2026-01-08",
    "due_date": "2026-01-22",
    "status": "borrowed"
  }
}
```

### Test Case 2: Borrow Book (Fail - No copies)

```bash
POST /api/borrowings/borrow
Content-Type: application/json

{
  "book_id": 3,
  "member_id": 1
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "No available copies"
}
```

### Test Case 3: Return Book (With Fine)

```bash
PUT /api/borrowings/1/return
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "id": 1,
    "return_date": "2026-01-10",
    "days_overdue": 3,
    "fine": 60
  }
}
```

---

## 📦 การส่งงาน

### ส่งผ่าน GitHub:

1. สร้าง repository ชื่อ `engce301-week7-lab`
2. Push code ทั้งหมด
3. สร้าง README.md ที่มี:
   - วิธีติดตั้ง
   - API Documentation
   - Screenshots (Postman)
   - ER Diagram (Draw.io หรือ dbdiagram.io)

### โครงสร้างไฟล์:

```
engce301-week7-lab/
├── database/
├── services/
├── controllers/
├── routes/
├── screenshots/
│   ├── postman_test1.png
│   ├── postman_test2.png
│   └── er_diagram.png
├── postman/
│   └── Library_API.postman_collection.json
├── server.js
├── package.json
└── README.md
```

### ส่งใน LMS:
- ไฟล์ ZIP ของโปรเจกต์ (ไม่รวม node_modules/)
- Link GitHub Repository
- ไฟล์ PDF (README + Screenshots)

---

## ✅ Checklist ก่อนส่ง

- [ ] Code รันได้ไม่มี error
- [ ] Database สร้างสำเร็จ
- [ ] ทดสอบทุก endpoint แล้ว
- [ ] มี 4 Layers ครบ
- [ ] Business Logic ถูกต้อง
- [ ] Error Handling ครบถ้วน
- [ ] มี README.md
- [ ] มี Comments ในโค้ด
- [ ] Code เป็นระเบียบ
- [ ] มี Screenshots
- [ ] Export Postman Collection

---

## 🐛 Common Errors

### 1. Foreign Key Constraint Failed
```
SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
```
**Solution:** ตรวจสอบว่า book_id และ member_id มีอยู่จริงในตาราง

### 2. Available Copies < 0
```
CHECK constraint failed: available_copies >= 0
```
**Solution:** ต้องตรวจสอบก่อนลด available_copies

### 3. Member Borrow Limit
**Solution:** COUNT borrowings WHERE status = 'borrowed'

---

## 💡 คำแนะนำ

1. **เริ่มจาก Database Schema**
   - วาด ER Diagram ก่อน
   - เขียน Schema ให้ถูกต้อง
   - Insert Sample Data

2. **ทำทีละ Layer**
   - Database → Service → Controller → Router
   - ทดสอบทีละ Layer

3. **ทดสอบบ่อยๆ**
   - ใช้ Postman ทดสอบทุก endpoint
   - ตรวจสอบ Database ด้วย DB Browser

4. **Code Organization**
   - แยก Layer ให้ชัดเจน
   - ใส่ Comments
   - ตั้งชื่อ function/variable ให้เข้าใจง่าย

5. **Error Handling**
   - ใช้ try-catch
   - ส่ง HTTP Status Code ที่เหมาะสม
   - Error message ชัดเจน

---

## 📚 Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [REST API Best Practices](https://restfulapi.net/)
- [DB Diagram Tool](https://dbdiagram.io/)
- [Postman Learning](https://learning.postman.com/)

---

## 🏆 Good Luck!

**หากมีคำถาม:**
- ถามในห้องเรียน
- ติดต่ออาจารย์ผู้สอน
- ดู Workshop Week 7 ประกอบ

**Remember:**
- เริ่มทำเร็วๆ อย่ารอจนคืนก่อนส่ง
- ถ้าติดปัญหา ให้หาความช่วยเหลือ
- Code ของตัวเอง เรียนรู้จากการทำ

---

**กำหนดส่ง: [ระบุวันที่]**  
**ส่งช้า: หัก 20% ต่อวัน**

---

*ENGCE301 - Software Design and Development*  
*Week 7 Lab Assignment*
