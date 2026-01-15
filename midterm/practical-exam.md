# 📝 ENGCE301: การออกแบบและพัฒนาซอฟต์แวร์
## Software Design and Development

---

# สอบกลางภาค - ภาคปฏิบัติ (Midterm Examination - Practical)

```
╔══════════════════════════════════════════════════════════════╗
║                   MIDTERM EXAM - PRACTICAL                   ║
║                      ระยะเวลา 3 ชั่วโมง                        ║
║                        คะแนนเต็ม 100                          ║
╚══════════════════════════════════════════════════════════════╝
```

**คำแนะนำ:**
- ข้อสอบมี 5 ส่วน รวม 100 คะแนน
- อ่านโจทย์ให้ละเอียดก่อนทำ
- ส่งงานเป็นไฟล์ตามที่กำหนด
- จัดการเวลาให้เหมาะสม
- ทำงานด้วยตนเอง ห้ามลอกเพื่อน

**เครื่องมือที่อนุญาต:**
- ✅ Code Editor (VS Code, Sublime Text)
- ✅ Draw.io หรือ Lucidchart (สำหรับวาด Diagram)
- ✅ เว็บเบราว์เซอร์ (สำหรับ Reference)
- ✅ Terminal/Command Line
- ❌ Chat with AI (ChatGPT, Claude, etc.)
- ❌ Copy Code จากเพื่อน

---

## โจทย์: ระบบจองห้องประชุมออนไลน์ (Meeting Room Booking System)

### 📋 Background

มหาวิทยาลัยต้องการระบบจองห้องประชุมออนไลน์ที่มีฟังก์ชันดังนี้:

**ผู้ใช้งาน:**
- **นักศึกษา/อาจารย์:** ค้นหาห้องประชุม, จองห้อง, ดูประวัติการจองของตน, ยกเลิกการจอง
- **เจ้าหน้าที่:** จัดการข้อมูลห้องประชุม (เพิ่ม/แก้ไข/ลบ), ดูรายการจองทั้งหมด, อนุมัติ/ปฏิเสธการจอง

**ข้อมูลห้องประชุม:**
- ชื่อห้อง, ตึก, ชั้น, ความจุ (จำนวนที่นั่ง), สิ่งอำนวยความสะดวก (โปรเจคเตอร์, ไวท์บอร์ด, ระบบเสียง)

**ข้อมูลการจอง:**
- ผู้จอง, ห้องที่จอง, วันที่, เวลาเริ่ม, เวลาสิ้นสุด, วัตถุประสงค์, สถานะ (รอดำเนินการ/อนุมัติ/ปฏิเสธ/ยกเลิก)

**กฎการจอง:**
- จองล่วงหน้าได้ไม่เกิน 30 วัน
- จองได้ครั้งละไม่เกิน 3 ชั่วโมง
- ไม่สามารถจองซ้อนเวลากันได้

---

## ส่วนที่ 1: Use Case Diagram (20 คะแนน)

### ✏️ งานที่ต้องทำ:

วาด **Use Case Diagram** แสดง:
1. **Actors** ทั้งหมด (นักศึกษา, อาจารย์, เจ้าหน้าที่)
2. **Use Cases** หลักอย่างน้อย 8 Use Cases
3. **Relationships:**
   - Association (เส้นธรรมดา)
   - Include (<<include>>)
   - Extend (<<extend>>)
   - Generalization (inheritance)

### 📊 ตัวอย่าง Use Cases (ไม่จำกัดเฉพาะนี้):
- ค้นหาห้องประชุม
- จองห้องประชุม
- ดูประวัติการจอง
- ยกเลิกการจอง
- เข้าสู่ระบบ
- จัดการข้อมูลห้อง
- อนุมัติการจอง
- ดูรายงานการใช้งาน

### 📋 เกณฑ์การให้คะแนน:

| หัวข้อ | คะแนน |
|--------|-------|
| Actors ครบถ้วนและถูกต้อง | 3 |
| Use Cases ครบถ้วน (อย่างน้อย 8 Use Cases) | 8 |
| ความสัมพันธ์ (Association, Include, Extend) | 5 |
| การใช้ Generalization (ถ้ามี) | 2 |
| ความสวยงามและอ่านง่าย | 2 |
| **รวม** | **20** |

### 💾 ส่งงาน:
- ไฟล์: `student_id_usecase.png` หรือ `.pdf`

---

## ส่วนที่ 2: ER Diagram (25 คะแนน)

### ✏️ งานที่ต้องทำ:

วาด **ER Diagram** แสดง:
1. **Entities** อย่างน้อย 4 Entities:
   - Users (รวมนักศึกษา/อาจารย์/เจ้าหน้าที่)
   - Rooms (ห้องประชุม)
   - Bookings (การจอง)
   - และอื่นๆ (ถ้ามี)

2. **Attributes** ของแต่ละ Entity:
   - ระบุ Primary Key (PK)
   - ระบุ Data Type ที่เหมาะสม
   - ครบถ้วนตาม Background

3. **Relationships:**
   - ระบุ Cardinality (1:1, 1:N, N:M)
   - ระบุ Foreign Keys (FK)

4. **Business Rules:**
   - User หนึ่งคนสามารถจองได้หลาย Bookings
   - Room หนึ่งห้องสามารถถูกจองได้หลาย Bookings
   - Booking หนึ่งรายการมีเพียง 1 User และ 1 Room

### 📋 เกณฑ์การให้คะแนน:

| หัวข้อ | คะแนน |
|--------|-------|
| Entities ครบถ้วนและเหมาะสม (อย่างน้อย 4) | 5 |
| Attributes ครบถ้วนพร้อม Data Types | 8 |
| Primary Keys และ Foreign Keys ถูกต้อง | 5 |
| Relationships และ Cardinality ถูกต้อง | 5 |
| ความสวยงามและอ่านง่าย | 2 |
| **รวม** | **25** |

### 💾 ส่งงาน:
- ไฟล์: `student_id_er_diagram.png` หรือ `.pdf`

---

## ส่วนที่ 3: RESTful API Design (20 คะแนน)

### ✏️ งานที่ต้องทำ:

ออกแบบ **RESTful API Endpoints** สำหรับระบบจองห้องประชุม

### 📝 ตาราง API Endpoints:

สร้างตารางแสดง API Endpoints ตามรูปแบบนี้:

| HTTP Method | Endpoint | Description | Request Body | Response (Success) | Status Code |
|-------------|----------|-------------|--------------|-------------------|-------------|
| GET | `/api/rooms` | ดึงรายการห้องทั้งหมด | - | `[{room}, ...]` | 200 |
| ... | ... | ... | ... | ... | ... |

### ✅ ต้องครอบคลุม:

**Resources หลัก:**
1. **Rooms** (ห้องประชุม)
   - ดึงรายการทั้งหมด (พร้อม filtering)
   - ดึงข้อมูลห้องเดียว
   - สร้างห้องใหม่ (เจ้าหน้าที่)
   - แก้ไขข้อมูลห้อง (เจ้าหน้าที่)
   - ลบห้อง (เจ้าหน้าที่)

2. **Bookings** (การจอง)
   - ดึงรายการจองทั้งหมด
   - ดึงการจองของตัวเอง
   - สร้างการจองใหม่
   - ยกเลิกการจอง
   - อนุมัติการจอง (เจ้าหน้าที่)

3. **Users** (ถ้าจำเป็น)
   - Login
   - Register
   - Get Profile

### 📋 ตัวอย่าง Endpoints (ไม่จำกัดเฉพาะนี้):

```
GET    /api/rooms                    # ดึงรายการห้องทั้งหมด
GET    /api/rooms/:id                # ดึงข้อมูลห้องเดียว
POST   /api/rooms                    # สร้างห้องใหม่
PUT    /api/rooms/:id                # แก้ไขข้อมูลห้อง
DELETE /api/rooms/:id                # ลบห้อง

GET    /api/bookings                 # ดึงการจองทั้งหมด
GET    /api/bookings/my              # ดึงการจองของตัวเอง
POST   /api/bookings                 # สร้างการจองใหม่
DELETE /api/bookings/:id             # ยกเลิกการจอง
PATCH  /api/bookings/:id/approve     # อนุมัติการจอง

POST   /api/auth/login               # Login
POST   /api/auth/register            # Register
GET    /api/users/profile            # ดูข้อมูลตัวเอง
```

### 📝 ตัวอย่าง Request/Response:

**POST /api/bookings** (สร้างการจองใหม่)

Request Body:
```json
{
  "room_id": 101,
  "booking_date": "2026-01-15",
  "start_time": "09:00",
  "end_time": "12:00",
  "purpose": "ประชุมโครงงาน",
  "attendees": 8
}
```

Response (201 Created):
```json
{
  "id": 1234,
  "room_id": 101,
  "room_name": "ห้อง A301",
  "user_id": 567,
  "booking_date": "2026-01-15",
  "start_time": "09:00",
  "end_time": "12:00",
  "purpose": "ประชุมโครงงาน",
  "status": "pending",
  "created_at": "2026-01-08T10:30:00Z"
}
```

### 📋 เกณฑ์การให้คะแนน:

| หัวข้อ | คะแนน |
|--------|-------|
| ครบทุก CRUD Operations | 5 |
| HTTP Methods ถูกต้องตามหลัก REST | 4 |
| URL Naming Convention ถูกต้อง | 3 |
| Request Body ครบถ้วน | 3 |
| Response Format เหมาะสม | 3 |
| HTTP Status Codes ถูกต้อง | 2 |
| **รวม** | **20** |

### 💾 ส่งงาน:
- ไฟล์: `student_id_api_design.pdf` หรือ `.md`

---

## ส่วนที่ 4: หน้าเว็บ HTML/CSS/JavaScript (20 คะแนน)

### ✏️ งานที่ต้องทำ:

สร้างหน้าเว็บ **"ค้นหาและจองห้องประชุม"** ที่มี:

### 📋 ส่วนประกอบ:

1. **ฟอร์มค้นหา:**
   - วันที่ (Date Picker)
   - เวลาเริ่ม (Time Picker)
   - เวลาสิ้นสุด (Time Picker)
   - จำนวนที่นั่งขั้นต่ำ (Number Input)
   - สิ่งอำนวยความสะดวก (Checkboxes)
   - ปุ่มค้นหา

2. **ตารางแสดงผล:**
   - แสดงรายการห้องที่ว่าง (Mock Data)
   - คอลัมน์: ชื่อห้อง, ตึก, ชั้น, ความจุ, สิ่งอำนวยความสะดวก, ปุ่มจอง

3. **ฟอร์มจอง (Modal/Section):**
   - แสดงข้อมูลห้องที่เลือก
   - กรอกวัตถุประสงค์ (Textarea)
   - กรอกจำนวนผู้เข้าร่วม (Number)
   - ปุ่มยืนยันการจอง

### 💻 ฟีเจอร์ JavaScript:

1. **Form Validation:**
   - เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม
   - จำนวนผู้เข้าร่วมไม่เกินความจุห้อง
   - ห้ามเว้นว่างฟิลด์ที่จำเป็น

2. **Interactive:**
   - คลิกปุ่มค้นหา → แสดงผลตาราง
   - คลิกปุ่มจอง → เปิด Modal/Form
   - คลิกยืนยันจอง → แสดง Success Message

3. **Responsive:**
   - Layout ปรับตามขนาดหน้าจอ (Mobile-friendly)

### 📋 เกณฑ์การให้คะแนน:

| หัวข้อ | คะแนน |
|--------|-------|
| HTML Structure ถูกต้องและครบถ้วน | 4 |
| CSS Styling สวยงามและ Responsive | 5 |
| Form Validation ครบถ้วน | 4 |
| Interactive Features ทำงานได้ | 5 |
| Code Organization และความเป็นระเบียบ | 2 |
| **รวม** | **20** |

### 💾 ส่งงาน:
- ไฟล์: `student_id_booking.html` (Single File HTML)

### 💡 Template เริ่มต้น:

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ระบบจองห้องประชุม</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        
        /* เพิ่ม CSS ของคุณที่นี่ */
    </style>
</head>
<body>
    <div class="container">
        <h1>🏢 ระบบจองห้องประชุมออนไลน์</h1>
        
        <!-- ฟอร์มค้นหา -->
        <section class="search-section">
            <h2>ค้นหาห้องประชุม</h2>
            <!-- เพิ่มฟอร์มของคุณที่นี่ -->
        </section>
        
        <!-- ตารางแสดงผล -->
        <section class="results-section">
            <h2>ห้องประชุมที่ว่าง</h2>
            <!-- เพิ่มตารางของคุณที่นี่ -->
        </section>
        
        <!-- Modal/Form จอง -->
        <div class="booking-modal">
            <!-- เพิ่ม Modal ของคุณที่นี่ -->
        </div>
    </div>

    <script>
        // JavaScript ของคุณที่นี่
        
        // Mock Data ห้องประชุม
        const rooms = [
            {
                id: 1,
                name: "ห้อง A301",
                building: "อาคาร A",
                floor: 3,
                capacity: 20,
                facilities: ["โปรเจคเตอร์", "ไวท์บอร์ด", "ระบบเสียง"]
            },
            // เพิ่มข้อมูลห้องอื่นๆ
        ];
        
        // ฟังก์ชันค้นหา
        function searchRooms() {
            // โค้ดของคุณ
        }
        
        // ฟังก์ชัน Validation
        function validateForm() {
            // โค้ดของคุณ
        }
        
        // ฟังก์ชันจอง
        function bookRoom(roomId) {
            // โค้ดของคุณ
        }
    </script>
</body>
</html>
```

---

## ส่วนที่ 5: Express Routes (Pseudo Code) (15 คะแนน)

### ✏️ งานที่ต้องทำ:

เขียน **Express Routes** (Pseudo Code) สำหรับ API Endpoints หลักๆ โดยแบ่งเป็น Layers:
- **Router Layer**
- **Controller Layer** 
- **Service Layer**
- **Database Layer**

### 📝 ต้องมีอย่างน้อย 3 Endpoints:

1. **GET /api/rooms** - ดึงรายการห้องทั้งหมด
2. **POST /api/bookings** - สร้างการจองใหม่ (พร้อม Validation)
3. **DELETE /api/bookings/:id** - ยกเลิกการจอง

### 💻 ตัวอย่าง Format:

```javascript
// ===== ROUTER LAYER =====
// routes/bookings.route.js

const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth');

// GET /api/bookings - ดึงการจองทั้งหมด
router.get('/', authMiddleware, BookingController.getAllBookings);

// POST /api/bookings - สร้างการจองใหม่
router.post('/', authMiddleware, BookingController.createBooking);

// DELETE /api/bookings/:id - ยกเลิกการจอง
router.delete('/:id', authMiddleware, BookingController.cancelBooking);

module.exports = router;


// ===== CONTROLLER LAYER =====
// controllers/booking.controller.js

const BookingService = require('../services/booking.service');

class BookingController {
  static async createBooking(req, res) {
    try {
      // 1. รับข้อมูลจาก request
      const { room_id, booking_date, start_time, end_time, purpose } = req.body;
      const user_id = req.user.id; // จาก authMiddleware
      
      // 2. Validate input
      if (!room_id || !booking_date || !start_time || !end_time) {
        return res.status(400).json({ 
          error: 'Missing required fields' 
        });
      }
      
      // 3. เรียก Service
      const booking = await BookingService.createBooking({
        user_id,
        room_id,
        booking_date,
        start_time,
        end_time,
        purpose
      });
      
      // 4. ส่ง Response
      res.status(201).json(booking);
      
    } catch (error) {
      // Handle errors
      if (error.message === 'Room not available') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

module.exports = BookingController;


// ===== SERVICE LAYER =====
// services/booking.service.js

const BookingDB = require('../database/booking.db');
const RoomDB = require('../database/room.db');

class BookingService {
  static async createBooking(bookingData) {
    // 1. Validate business rules
    
    // ตรวจสอบว่าห้องมีอยู่จริง
    const room = await RoomDB.findById(bookingData.room_id);
    if (!room) {
      throw new Error('Room not found');
    }
    
    // ตรวจสอบว่าห้องว่างในช่วงเวลานั้น
    const isAvailable = await this.checkRoomAvailability(
      bookingData.room_id,
      bookingData.booking_date,
      bookingData.start_time,
      bookingData.end_time
    );
    
    if (!isAvailable) {
      throw new Error('Room not available');
    }
    
    // ตรวจสอบเวลาเริ่มต้อง < เวลาสิ้นสุด
    if (bookingData.start_time >= bookingData.end_time) {
      throw new Error('Invalid time range');
    }
    
    // 2. สร้างการจอง
    const booking = await BookingDB.create({
      ...bookingData,
      status: 'pending'
    });
    
    return booking;
  }
  
  static async checkRoomAvailability(room_id, date, start_time, end_time) {
    // ตรวจสอบว่ามีการจองซ้อนเวลาหรือไม่
    const overlapping = await BookingDB.findOverlapping(
      room_id, date, start_time, end_time
    );
    
    return overlapping.length === 0;
  }
}

module.exports = BookingService;


// ===== DATABASE LAYER =====
// database/booking.db.js

const db = require('./connection');

class BookingDatabase {
  static async create(bookingData) {
    const sql = `
      INSERT INTO bookings 
      (user_id, room_id, booking_date, start_time, end_time, purpose, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
      db.run(
        sql,
        [
          bookingData.user_id,
          bookingData.room_id,
          bookingData.booking_date,
          bookingData.start_time,
          bookingData.end_time,
          bookingData.purpose,
          bookingData.status
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...bookingData });
        }
      );
    });
  }
  
  static async findOverlapping(room_id, date, start_time, end_time) {
    const sql = `
      SELECT * FROM bookings
      WHERE room_id = ?
        AND booking_date = ?
        AND status != 'cancelled'
        AND (
          (start_time < ? AND end_time > ?)
          OR (start_time < ? AND end_time > ?)
          OR (start_time >= ? AND end_time <= ?)
        )
    `;
    
    return new Promise((resolve, reject) => {
      db.all(sql, [room_id, date, end_time, start_time, 
                   end_time, start_time, start_time, end_time], 
             (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = BookingDatabase;
```

### 📋 เกณฑ์การให้คะแนน:

| หัวข้อ | คะแนน |
|--------|-------|
| Router Layer ถูกต้อง | 2 |
| Controller Layer ครบถ้วน | 4 |
| Service Layer (Business Logic) | 5 |
| Database Layer (SQL Queries) | 3 |
| Error Handling | 1 |
| **รวม** | **15** |

### 💾 ส่งงาน:
- ไฟล์: `student_id_express_routes.js` หรือ `.txt`

---

```
╔══════════════════════════════════════════════════════════════╗
║                         จบข้อสอบ                              ║
║                    โปรดตรวจสอบก่อนส่ง                          ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📦 สรุปไฟล์ที่ต้องส่ง

| ส่วนที่ | ไฟล์ | คะแนน |
|---------|------|-------|
| 1 | `student_id_usecase.png` หรือ `.pdf` | 20 |
| 2 | `student_id_er_diagram.png` หรือ `.pdf` | 25 |
| 3 | `student_id_api_design.pdf` หรือ `.md` | 20 |
| 4 | `student_id_booking.html` | 20 |
| 5 | `student_id_express_routes.js` หรือ `.txt` | 15 |
| **รวม** | **5 ไฟล์** | **100** |

### 📤 วิธีส่ง:
1. รวมไฟล์ทั้งหมดในโฟลเดอร์ชื่อ `student_id`_midterm
2. Zip เป็นไฟล์ `student_id`_midterm.zip
3. เข้า email ของมหาวิทยาลัย และส่ง email ที่ thanit@rmutl.ac.th พร้อมรายละเอียด ชื่อ-นามสกุล รหัสนักศึกษา และ sec ที่เรียน
4. ชื่อหัวข้อ email คือ
 ENGCE301- Midterm Practical Exam (Individual)
1. แนบไฟล์ `student_id`_midterm.zip ใน attachment
2. กด send
---

---

## 🎯 เกณฑ์การให้คะแนน

| ระดับคะแนน | เกรด |
|------------|------|
| 80-100 | A |
| 75-79 | B+ |
| 70-74 | B |
| 65-69 | C+ |
| 60-64 | C |
| 55-59 | D+ |
| 50-54 | D |
| 0-49 | F |

---

## 💡 Tips สำหรับการทำข้อสอบ

### ⏰ การจัดการเวลา (แนะนำ):
- **ส่วนที่ 1 (Use Case):** 30 นาที
- **ส่วนที่ 2 (ER Diagram):** 40 นาที
- **ส่วนที่ 3 (API Design):** 30 นาที
- **ส่วนที่ 4 (HTML/CSS/JS):** 60 นาที
- **ส่วนที่ 5 (Express Routes):** 30 นาที
- **ตรวจสอบ + ส่งงาน:** 10 นาที

### ✅ Checklist ก่อนส่ง:
- [ ] ครบทุกไฟล์ (5 ไฟล์)
- [ ] ตั้งชื่อไฟล์ถูกต้อง (มีรหัสนักศึกษา)
- [ ] Diagram สามารถเปิดดูได้
- [ ] HTML file ทำงานได้ (เปิดใน browser)
- [ ] Code มีความเป็นระเบียบ
- [ ] Zip file ถูกต้อง

### 🚫 สิ่งที่ควรหลีกเลี่ยง:
- ❌ ทำไม่ครบทุกส่วน
- ❌ ส่งงานช้า (หักคะแนน)
- ❌ ลอกเพื่อน (ได้ 0 คะแนน)
- ❌ Code ไม่สามารถรันได้
- ❌ ไฟล์เสีย/เปิดไม่ได้

---

## 🎓 Good Luck!

```
Remember:
"Success is not the key to happiness. 
 Happiness is the key to success."
                    - Albert Schweitzer
```
