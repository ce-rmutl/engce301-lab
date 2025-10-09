# 🍜 Restaurant Review Website - Final Project Guide

**ระยะเวลา:** 3.5 ชั่วโมง | **คะแนนเต็ม:** 100 คะแนน

---

## 📑 สารบัญ

1. [ภาพรวมโปรเจค](#ภาพรวมโปรเจค)
2. [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
3. [Setup โปรเจค](#setup-โปรเจค)
4. [Backend Development](#backend-development)
5. [Frontend Development](#frontend-development)
6. [Integration & Testing](#integration--testing)
7. [การส่งงาน](#การส่งงาน)
8. [เกณฑ์การให้คะแนน](#เกณฑ์การให้คะแนน)

---

## 🎯 ภาพรวมโปรเจค

### วัตถุประสงค์
สร้างเว็บไซต์รีวิวร้านอาหารแบบ Fullstack ที่รวมความรู้ทั้งหมดจาก 5 วัน:

**เทคโนโลยีที่ใช้:**
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** JSON File Storage
- **Features:** Search, Filter, CRUD Reviews, Real-time Rating Update

### ตารางเวลา (3.5 ชั่วโมง)

| เวลา | กิจกรรม | ระยะเวลา |
|------|---------|----------|
| 14:00-14:15 | Setup & ทบทวน | 15 นาที |
| 14:15-15:15 | Backend Development | 60 นาที |
| 15:15-16:45 | Frontend Development | 90 นาที |
| 16:45-17:30 | Integration & Testing | 45 นาที |

### การแบ่งคะแนน

**Required Features (70 คะแนน)**
- Backend API (30 คะแนน)
- Frontend Components (30 คะแนน)
- Integration (10 คะแนน)

**Bonus Features (15 คะแนน)**
- Sort/Filter เพิ่มเติม (5 คะแนน)
- Responsive Design (5 คะแนน)
- Animations (5 คะแนน)

**Documentation & Code Quality (15 คะแนน)**
- README.md (5 คะแนน)
- Code Organization (5 คะแนน)
- Comments (5 คะแนน)

---

## 🗂️ โครงสร้างโปรเจค

```
restaurant-review-app/
├── backend/
│   ├── data/
│   │   ├── restaurants.json      [ให้มาพร้อม 100%]
│   │   └── reviews.json           [ให้ไฟล์ว่าง]
│   ├── routes/
│   │   ├── restaurants.js         [ให้โครงสร้าง 40%]
│   │   └── reviews.js             [ให้โครงสร้าง 30%]
│   ├── middleware/
│   │   └── validation.js          [ให้ตัวอย่าง 1 function]
│   ├── utils/
│   │   └── fileManager.js         [ให้ครบ 100%]
│   ├── server.js                  [ให้โครงสร้าง 60%]
│   ├── package.json               [ให้ครบ 100%]
│   ├── .env.example               [ให้ครบ 100%]
│   └── .gitignore                 [ให้ครบ 100%]
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── RestaurantList.jsx     [ให้ครบ 100%]
    │   │   ├── RestaurantCard.jsx     [ให้ครบ 100%]
    │   │   ├── RestaurantDetail.jsx   [ให้โครงสร้าง 30%]
    │   │   ├── SearchBar.jsx          [ให้ครบ 100%]
    │   │   ├── FilterPanel.jsx        [ให้โครงสร้าง 40%]
    │   │   ├── ReviewForm.jsx         [ให้โครงสร้าง 40%]
    │   │   └── ReviewList.jsx         [ให้ครบ 100%]
    │   ├── services/
    │   │   └── api.js                 [ให้โครงสร้าง 30%]
    │   ├── App.jsx                    [ให้โครงสร้าง 60%]
    │   ├── App.css                    [ให้ครบ 100%]
    │   └── main.jsx                   [ให้ครบ 100%]
    ├── index.html                     [ให้ครบ 100%]
    ├── package.json                   [ให้ครบ 100%]
    ├── vite.config.js                 [ให้ครบ 100%]
    └── .gitignore                     [ให้ครบ 100%]
```

---

## 🚀 Setup โปรเจค

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (เปิด terminal ใหม่)
cd frontend
npm install
```

### ขั้นตอนที่ 2: ตรวจสอบว่ารันได้

```bash
# Backend
cd backend
npm run dev
# ควรเห็น: 🚀 Server running on http://localhost:3000

# Frontend
cd frontend
npm run dev
# ควรเห็น: Local: http://localhost:5173
```

### ขั้นตอนที่ 3: ทดสอบ API

เปิด browser ไปที่ `http://localhost:3000` ควรเห็น:
```json
{
  "message": "🍜 Restaurant Review API",
  "version": "1.0.0",
  "endpoints": {
    "restaurants": "/api/restaurants",
    "reviews": "/api/reviews"
  }
}
```

---

## 🔧 Backend Development

### ไฟล์ที่ให้มาครบ 100% (ไม่ต้องแก้)

#### 📄 `backend/package.json`

```json
{
  "name": "restaurant-review-backend",
  "version": "1.0.0",
  "description": "Backend API for Restaurant Review App",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

#### 📄 `backend/.gitignore`

```
node_modules/
.env
.env.local
*.log
.DS_Store
dist/
```

#### 📄 `backend/.env.example`

```env
PORT=3000
NODE_ENV=development
```

#### 📄 `backend/.env` (สร้างไฟล์นี้เอง)

```env
PORT=3000
NODE_ENV=development
```

#### 📄 `backend/utils/fileManager.js`

```javascript
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

/**
 * อ่านไฟล์ JSON
 * @param {string} filename - ชื่อไฟล์
 * @returns {Promise<Array>} - ข้อมูลจากไฟล์
 */
const readJsonFile = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

/**
 * เขียนไฟล์ JSON
 * @param {string} filename - ชื่อไฟล์
 * @param {Array|Object} data - ข้อมูลที่จะเขียน
 * @returns {Promise<boolean>} - สำเร็จหรือไม่
 */
const writeJsonFile = async (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

module.exports = {
  readJsonFile,
  writeJsonFile
};
```

#### 📄 `backend/data/restaurants.json`

```json
[
  {
    "id": 1,
    "name": "ส้มตำน้าเข้านอ้ง",
    "category": "อาหารไทย",
    "description": "ร้านส้มตำและอาหารอีสานแท้ๆ รสชาติต้นตำรับ ส้มตำรสจัดจ้าน ลาบก้อยสดใหม่",
    "location": "ตลาดนัดสวนจตุจักร",
    "priceRange": 1,
    "phone": "02-123-4567",
    "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "10:00-20:00",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "ซูชิโตเกียว",
    "category": "อาหารญี่ปุ่น",
    "description": "ร้านอาหารญี่ปุ่นต้นตำรับ เชฟจากโตเกียว วัตถุดิบนำเข้าจากญี่ปุ่น สดใหม่ทุกวัน",
    "location": "สยามพารากอน ชั้น 4",
    "priceRange": 3,
    "phone": "02-234-5678",
    "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "11:00-22:00",
    "createdAt": "2024-01-10T10:00:00.000Z"
  },
  {
    "id": 3,
    "name": "พิซซ่าอิตาเลียน",
    "category": "อาหารอิตาเลียน",
    "description": "พิซซ่าแท้จากอิตาลี เตาอบไม้ แป้งบาง ชีสนำเข้า ซอสทำเองทุกวัน",
    "location": "เอกมัย ซอย 5",
    "priceRange": 2,
    "phone": "02-345-6789",
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "11:00-23:00",
    "createdAt": "2024-01-12T10:00:00.000Z"
  },
  {
    "id": 4,
    "name": "ก๋วยเตี๋ยวเรือพี่ดี",
    "category": "อาหารไทย",
    "description": "ก๋วยเตี๋ยวเรือต้นตำรับ น้ำซุปเข้มข้น เนื้อสด ราคาประหยัด",
    "location": "ตลาดพลู ถนนราชพฤกษ์",
    "priceRange": 1,
    "phone": "02-456-7890",
    "image": "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "06:00-15:00",
    "createdAt": "2024-01-08T10:00:00.000Z"
  },
  {
    "id": 5,
    "name": "ติ่มซำฮ่องกง",
    "category": "อาหารจีน",
    "description": "ติ่มซำฮ่องกงแท้ เชฟจากฮ่องกง ขนมจีบ ฮะเก๋า เสี่ยวหมาย สดใหม่ทุกวัน",
    "location": "ไชน่าทาวน์ เยาวราช",
    "priceRange": 2,
    "phone": "02-567-8901",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "07:00-14:00",
    "createdAt": "2024-01-05T10:00:00.000Z"
  },
  {
    "id": 6,
    "name": "เบอร์เกอร์คราวอเมริกัน",
    "category": "ฟาสต์ฟู้ด",
    "description": "เบอร์เกอร์สไตล์อเมริกัน เนื้อแท้ 100% ขนาดใหญ่ มีเดลิเวอรี่",
    "location": "สยามสแควร์ ชั้น 2",
    "priceRange": 2,
    "phone": "02-678-9012",
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "10:00-22:00",
    "createdAt": "2024-01-20T10:00:00.000Z"
  },
  {
    "id": 7,
    "name": "ราเมงโอซากะ",
    "category": "อาหารญี่ปุ่น",
    "description": "ราเมงสไตล์โอซากะ น้ำซุปเข้มข้น หมูชาชูนุ่ม ไข่อนเซ็น",
    "location": "เซ็นทรัลเวิลด์ ชั้น 6",
    "priceRange": 2,
    "phone": "02-789-0123",
    "image": "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "11:00-21:00",
    "createdAt": "2024-01-18T10:00:00.000Z"
  },
  {
    "id": 8,
    "name": "ข้าวมันไก่ไฮหนาน",
    "category": "อาหารไทย",
    "description": "ข้าวมันไก่ต้นตำรับไฮหนาน ไก่นุ่ม ข้าวหอม น้ำจิ้มรสเด็ด",
    "location": "ประตูน้ำ",
    "priceRange": 1,
    "phone": "02-890-1234",
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "08:00-18:00",
    "createdAt": "2024-01-22T10:00:00.000Z"
  },
  {
    "id": 9,
    "name": "สเต็กเฮ้าส์พรีเมียม",
    "category": "อาหารอิตาเลียน",
    "description": "สเต็กเนื้อวากิว เนื้อนำเข้า ย่างสไตล์อเมริกัน บรรยากาศหรูหรา",
    "location": "อโศก ทองหล่อ ซอย 10",
    "priceRange": 3,
    "phone": "02-901-2345",
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "17:00-23:00",
    "createdAt": "2024-01-25T10:00:00.000Z"
  },
  {
    "id": 10,
    "name": "ผัดไทยป้าถวิล",
    "category": "อาหารไทย",
    "description": "ผัดไทยโบราณ สูตรต้นตำรับ 50 ปี ตามสั่งเท่านั้น ไม่รับจอง",
    "location": "ท่าพระจันทร์",
    "priceRange": 1,
    "phone": "02-012-3456",
    "image": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    "averageRating": 0,
    "totalReviews": 0,
    "openHours": "09:00-16:00",
    "createdAt": "2024-01-28T10:00:00.000Z"
  }
]
```

#### 📄 `backend/data/reviews.json`

```json
[]
```

**หมายเหตุ:** เริ่มต้นด้วยอาร์เรย์ว่างเพื่อให้นักศึกษาเห็นการทำงานของระบบตั้งแต่ต้น

---

### ไฟล์ที่ต้องเขียนโค้ดเพิ่ม

#### 📄 `backend/server.js` (ให้โครงสร้าง 60%)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');
const { readJsonFile } = require('./utils/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🍜 Restaurant Review API',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      reviews: '/api/reviews',
      stats: '/api/stats'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

// ========================================
// TODO: GET /api/stats - ดึงสถิติทั้งหมด
// ========================================
// งานที่ต้องทำ:
// 1. อ่านข้อมูล restaurants.json และ reviews.json
// 2. คำนวณ:
//    - totalRestaurants: จำนวนร้านทั้งหมด
//    - totalReviews: จำนวนรีวิวทั้งหมด
//    - averageRating: คะแนนเฉลี่ยของร้านทั้งหมด (ปัดเศษ 1 ตำแหน่ง)
//    - topRatedRestaurants: ร้าน 5 อันดับแรกที่มี rating สูงสุด
// 3. ส่งข้อมูลกลับในรูปแบบ: { success: true, data: {...} }
//
// คำใบ้:
// - ใช้ Array.reduce() เพื่อรวมคะแนน
// - ใช้ Array.sort() และ Array.slice(0, 5) เพื่อหา top 5
// - ระวัง: ร้านที่ยังไม่มีรีวิว (averageRating = 0) อาจมีปัญหาในการเรียง

app.get('/api/stats', async (req, res) => {
  try {
    // TODO: เขียนโค้ดที่นี่
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติ'
    });
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
```

---

#### 📄 `backend/routes/restaurants.js` (ให้โครงสร้าง 40%)

```javascript
const express = require('express');
const router = express.Router();
const { readJsonFile } = require('../utils/fileManager');

// ========================================
// GET /api/restaurants - ดึงรายการร้านทั้งหมด (พร้อม filtering)
// ========================================
router.get('/', async (req, res) => {
  try {
    let restaurants = await readJsonFile('restaurants.json');
    const { search, category, minRating, priceRange } = req.query;
    
    // TODO 1: กรองตามชื่อ (search)
    // เงื่อนไข: ถ้ามี search parameter ให้กรองร้านที่มีชื่อหรือคำอธิบายที่ตรงกับคำค้นหา
    // คำใบ้:
    // if (search) {
    //   const searchLower = search.toLowerCase();
    //   restaurants = restaurants.filter(r => 
    //     r.name.toLowerCase().includes(searchLower) ||
    //     r.description.toLowerCase().includes(searchLower)
    //   );
    // }
    
    // TODO 2: กรองตามหมวดหมู่ (category)
    // เงื่อนไข: ถ้ามี category parameter ให้กรองร้านที่มีหมวดหมู่ตรงกัน
    
    // TODO 3: กรองตาม rating ขั้นต่ำ (minRating)
    // เงื่อนไข: ถ้ามี minRating parameter ให้กรองร้านที่มี averageRating >= minRating
    // คำใบ้: ใช้ parseFloat() เพื่อแปลงเป็นตัวเลข
    
    // TODO 4: กรองตามช่วงราคา (priceRange)
    // เงื่อนไข: ถ้ามี priceRange parameter ให้กรองร้านที่มี priceRange ตรงกัน
    // คำใบ้: ใช้ parseInt() เพื่อแปลงเป็นตัวเลข
    
    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
      filters: {
        search: search || null,
        category: category || null,
        minRating: minRating || null,
        priceRange: priceRange || null
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

// ========================================
// GET /api/restaurants/:id - ดึงข้อมูลร้านตาม ID พร้อมรีวิว
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO 5: อ่านข้อมูลร้านและรีวิว
    // ขั้นตอน:
    // 1. อ่าน restaurants.json และ reviews.json โดยใช้ readJsonFile
    // 2. หาร้านที่มี id ตรงกับ parameter โดยใช้ Array.find()
    //    const restaurant = restaurants.find(r => r.id === parseInt(id));
    // 3. ถ้าไม่เจอร้าน ให้ return status 404 พร้อมข้อความ 'ไม่พบร้านอาหารนี้'
    // 4. หารีวิวของร้านนี้ โดยใช้ Array.filter()
    //    const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(id));
    // 5. เรียงรีวิวจากใหม่สุดไปเก่าสุด โดยใช้ createdAt
    //    restaurantReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // 6. ส่งข้อมูลกลับในรูปแบบ:
    //    res.json({
    //      success: true,
    //      data: {
    //        ...restaurant,
    //        reviews: restaurantReviews
    //      }
    //    });
    
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

module.exports = router;
```

---

#### 📄 `backend/routes/reviews.js` (ให้โครงสร้าง 30%)

```javascript
const express = require('express');
const router = express.Router();
const { readJsonFile, writeJsonFile } = require('../utils/fileManager');
const { validateReview } = require('../middleware/validation');

// ========================================
// GET /api/reviews/:restaurantId - ดึงรีวิวทั้งหมดของร้านนั้น
// ========================================
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await readJsonFile('reviews.json');
    
    // TODO 1: กรองรีวิวเฉพาะร้านนี้
    // คำใบ้:
    // const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(restaurantId));
    
    // TODO 2: เรียงจากใหม่สุดไปเก่าสุด
    // คำใบ้:
    // restaurantReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: [], // TODO: เปลี่ยนเป็นรีวิวที่กรองและเรียงแล้ว
      total: 0  // TODO: เปลี่ยนเป็นจำนวนรีวิวที่กรอง
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรีวิว'
    });
  }
});

// ========================================
// POST /api/reviews - เพิ่มรีวิวใหม่
// ========================================
router.post('/', validateReview, async (req, res) => {
  try {
    const { restaurantId, userName, rating, comment, visitDate } = req.body;
    
    // TODO 3: อ่านข้อมูลปัจจุบัน
    // const reviews = await readJsonFile('reviews.json');
    // const restaurants = await readJsonFile('restaurants.json');
    
    // TODO 4: ตรวจสอบว่า restaurant ID มีอยู่จริงไหม
    // const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    // if (!restaurant) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'ไม่พบร้านอาหารนี้'
    //   });
    // }
    
    // TODO 5: สร้างรีวิวใหม่
    // const newReview = {
    //   id: Date.now(),
    //   restaurantId: parseInt(restaurantId),
    //   userName: userName.trim(),
    //   rating: parseInt(rating),
    //   comment: comment.trim(),
    //   visitDate: visitDate || new Date().toISOString().split('T')[0],
    //   createdAt: new Date().toISOString()
    // };
    
    // TODO 6: เพิ่มรีวิวเข้าไปใน array และบันทึก
    // reviews.push(newReview);
    // await writeJsonFile('reviews.json', reviews);
    
    // TODO 7: อัพเดท averageRating และ totalReviews ของร้าน
    // **สำคัญมาก:** ต้องหา index ของร้านก่อน ห้ามแก้ object โดยตรง!
    //
    // ขั้นตอนที่ถูกต้อง:
    // 1. กรองรีวิวทั้งหมดของร้านนี้ (รวมรีวิวใหม่ที่เพิ่งเพิ่ม)
    //    const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(restaurantId));
    //
    // 2. คำนวณค่าเฉลี่ย
    //    const totalRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0);
    //    const newAverageRating = totalRating / restaurantReviews.length;
    //
    // 3. หา index ของร้าน (ไม่ใช่ object!)
    //    const restaurantIndex = restaurants.findIndex(r => r.id === parseInt(restaurantId));
    //
    // 4. อัพเดทค่าใน array
    //    restaurants[restaurantIndex].averageRating = Math.round(newAverageRating * 10) / 10;
    //    restaurants[restaurantIndex].totalReviews = restaurantReviews.length;
    //
    // 5. บันทึกไฟล์
    //    await writeJsonFile('restaurants.json', restaurants);
    
    // TODO 8: ส่งข้อมูลกลับ
    res.status(201).json({
      success: true,
      message: 'เพิ่มรีวิวสำเร็จ',
      data: {
        // TODO: ใส่ newReview
      },
      restaurant: {
        // TODO: ใส่ข้อมูลร้านที่อัพเดทแล้ว
        // id, name, averageRating, totalReviews
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มรีวิว'
    });
  }
});

module.exports = router;
```

---

#### 📄 `backend/middleware/validation.js` (ให้ตัวอย่าง 1 validation)

```javascript
/**
 * ฟังก์ชันช่วยตรวจสอบอักขระพิเศษที่อันตราย
 */
const hasDangerousCharacters = (str) => {
  const dangerousPatterns = /<script|<iframe|javascript:|onerror=|onclick=/i;
  return dangerousPatterns.test(str);
};

/**
 * Middleware สำหรับตรวจสอบข้อมูลรีวิวก่อนบันทึก
 */
const validateReview = (req, res, next) => {
  const { restaurantId, userName, rating, comment } = req.body;
  const errors = [];
  
  // ========================================
  // ตัวอย่างที่ให้: ตรวจสอบ restaurantId (ครบ 100%)
  // ========================================
  if (!restaurantId) {
    errors.push('กรุณาระบุรหัสร้านอาหาร');
  } else if (isNaN(parseInt(restaurantId))) {
    errors.push('รหัสร้านต้องเป็นตัวเลข');
  } else if (parseInt(restaurantId) <= 0) {
    errors.push('รหัสร้านต้องมากกว่า 0');
  }
  
  // ========================================
  // TODO 1: ตรวจสอบ userName
  // ========================================
  // เงื่อนไข:
  // - ต้องมีค่า (ไม่ว่างเปล่า)
  // - ความยาว 2-50 ตัวอักษร (หลัง trim())
  // - ไม่มีอักขระพิเศษที่อันตราย (ใช้ hasDangerousCharacters)
  //
  // ตัวอย่าง error messages:
  // - 'กรุณากรอกชื่อ'
  // - 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'
  // - 'ชื่อต้องไม่เกิน 50 ตัวอักษร'
  // - 'ชื่อมีอักขระที่ไม่อนุญาต'
  //
  // คำใบ้:
  // if (!userName || !userName.trim()) {
  //   errors.push('กรุณากรอกชื่อ');
  // } else if (userName.trim().length < 2) {
  //   errors.push('ชื่อต้องมีอย่างน้อย 2 ตัวอักษร');
  // } ...
  
  // ========================================
  // TODO 2: ตรวจสอบ rating
  // ========================================
  // เงื่อนไข:
  // - ต้องมีค่า
  // - ต้องเป็นตัวเลข
  // - ต้องอยู่ระหว่าง 1-5
  //
  // คำใบ้:
  // const ratingNum = parseInt(rating);
  // if (!rating) {
  //   errors.push('กรุณาเลือกคะแนน');
  // } else if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
  //   errors.push('คะแนนต้องอยู่ระหว่าง 1-5');
  // }
  
  // ========================================
  // TODO 3: ตรวจสอบ comment
  // ========================================
  // เงื่อนไข:
  // - ต้องมีค่า
  // - ความยาว 10-500 ตัวอักษร (หลัง trim())
  // - ไม่มีอักขระพิเศษที่อันตราย
  //
  // ตัวอย่าง error messages:
  // - 'กรุณากรอกความคิดเห็น'
  // - 'ความคิดเห็นต้องมีอย่างน้อย 10 ตัวอักษร'
  // - 'ความคิดเห็นต้องไม่เกิน 500 ตัวอักษร'
  // - 'ความคิดเห็นมีอักขระที่ไม่อนุญาต'
  
  // ตรวจสอบว่ามี error หรือไม่
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors
    });
  }
  
  next();
};

module.exports = {
  validateReview
};
```

---

### การทดสอบ Backend

#### วิธีที่ 1: ใช้ curl (Terminal)

```bash
# 1. ทดสอบดูร้านทั้งหมด
curl http://localhost:3000/api/restaurants

# 2. ทดสอบค้นหา
curl "http://localhost:3000/api/restaurants?search=ส้มตำ"

# 3. ทดสอบกรองตามหมวด
curl "http://localhost:3000/api/restaurants?category=อาหารไทย"

# 4. ทดสอบดูร้านตาม ID
curl http://localhost:3000/api/restaurants/1

# 5. ทดสอบเพิ่มรีวิว (ควรสำเร็จ)
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "userName": "สมชาย ใจดี",
    "rating": 5,
    "comment": "อร่อยมากครับ บรรยากาศดี พนักงานบริการดีเยี่ยม แนะนำเลยครับ"
  }'

# 6. ทดสอบ validation (ควรได้ error)
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "userName": "A",
    "rating": 6,
    "comment": "สั้น"
  }'

# 7. ทดสอบดูสถิติ
curl http://localhost:3000/api/stats
```

#### วิธีที่ 2: ใช้ Postman

สร้าง Collection ชื่อ "Restaurant Review API" และเพิ่ม requests ต่อไปนี้:

**GET** `http://localhost:3000/api/restaurants` <br>
**GET** `http://localhost:3000/api/restaurants/1` <br>
**GET** `http://localhost:3000/api/restaurants?search=ส้มตำ&category=อาหารไทย` <br>
**POST** `http://localhost:3000/api/reviews` (พร้อม JSON body) <br>
**GET** `http://localhost:3000/api/stats` <br>

---

## ⚛️ Frontend Development

### ไฟล์ที่ให้มาครบ 100% (ไม่ต้องแก้)

#### 📄 `frontend/package.json`

```json
{
  "name": "restaurant-review-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

#### 📄 `frontend/.gitignore`

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

#### 📄 `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  }
})
```

#### 📄 `frontend/index.html`

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restaurant Review - ค้นหาและรีวิวร้านอาหาร</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 📄 `frontend/src/main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### 📄 `frontend/src/components/RestaurantCard.jsx`

```javascript
function RestaurantCard({ restaurant, onClick }) {
  const getPriceDisplay = (range) => {
    return '฿'.repeat(range);
  };

  return (
    <div className="restaurant-card" onClick={() => onClick(restaurant.id)}>
      <img src={restaurant.image} alt={restaurant.name} />
      <div className="card-content">
        <h3>{restaurant.name}</h3>
        <p className="category">{restaurant.category}</p>
        <p className="description">{restaurant.description}</p>
        <div className="card-footer">
          <span className="rating">
            ⭐ {restaurant.averageRating > 0 
              ? restaurant.averageRating.toFixed(1) 
              : 'ยังไม่มีรีวิว'}
          </span>
          <span className="price">{getPriceDisplay(restaurant.priceRange)}</span>
          <span className="reviews">{restaurant.totalReviews} รีวิว</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
```

#### 📄 `frontend/src/components/ReviewList.jsx`

```javascript
function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="no-reviews">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวร้านนี้!</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-list">
      <h3>รีวิวทั้งหมด ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <span className="reviewer-name">{review.userName}</span>
            <span className="review-rating">
              {'⭐'.repeat(review.rating)}
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
          <p className="review-date">
            วันที่เข้าร้าน: {formatDate(review.visitDate)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
```

#### 📄 `frontend/src/App.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.app-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Main Content */
.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Footer */
.app-footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}

/* Search Bar */
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #e5e7eb;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #d1d5db;
  color: #333;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-button:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-button:active {
  transform: translateY(0);
}

/* Filter Panel */
.filter-panel {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #555;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-group select:focus {
  outline: none;
  border-color: #667eea;
}

/* Restaurant Grid */
.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Restaurant Card */
.restaurant-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.restaurant-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.rating {
  color: #f59e0b;
  font-weight: 600;
}

.price {
  color: #10b981;
  font-weight: 600;
}

.reviews {
  color: #666;
  font-size: 0.9rem;
}

/* Restaurant Detail */
.restaurant-detail {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.back-button {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: #5568d3;
}

.detail-header {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-header img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.detail-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  color: #666;
}

.rating-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 1rem;
}

/* Review Form */
.review-form {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.review-form h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 100px;
}

.form-group .error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-group input.invalid,
.form-group select.invalid,
.form-group textarea.invalid {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.review-form button {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.3s ease;
}

.review-form button:hover {
  background: #5568d3;
}

.review-form button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Review List */
.review-list {
  margin-top: 2rem;
}

.review-list h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.review-item {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-rating {
  color: #f59e0b;
}

.review-comment {
  margin: 1rem 0;
  line-height: 1.6;
  color: #555;
}

.review-date {
  color: #666;
  font-size: 0.875rem;
}

/* Loading & Error States */
.loading,
.error,
.no-results,
.no-reviews {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.error {
  color: #ef4444;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.no-results {
  background: #f9fafb;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.8rem;
  }

  .detail-header {
    grid-template-columns: 1fr;
  }

  .restaurant-grid {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    flex-direction: column;
  }

  .search-bar {
    flex-direction: column;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.5rem;
  }

  .card-content h3 {
    font-size: 1.2rem;
  }

  .detail-info h1 {
    font-size: 1.5rem;
  }
}
```

---

### ไฟล์ที่ต้องเขียนโค้ดเพิ่ม

#### 📄 `frontend/src/services/api.js` (ให้โครงสร้าง 30%)

```javascript
const API_URL = 'http://localhost:3000/api';

/**
 * ฟังก์ชันสำหรับดึงรายการร้านอาหารทั้งหมด พร้อม filtering
 * @param {Object} filters - ตัวกรอง { search, category, minRating, priceRange }
 * @returns {Promise} - ข้อมูลร้านอาหาร
 */
export const getRestaurants = async (filters = {}) => {
  try {
    // TODO 1: สร้าง query string จาก filters
    // คำใบ้:
    // const queryParams = new URLSearchParams();
    // if (filters.search) queryParams.append('search', filters.search);
    // if (filters.category) queryParams.append('category', filters.category);
    // if (filters.minRating) queryParams.append('minRating', filters.minRating);
    // if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
    
    // TODO 2: สร้าง URL พร้อม query string
    // const url = `${API_URL}/restaurants?${queryParams}`;

    // TODO 3: fetch ข้อมูล
    // const response = await fetch(url);
    
    // TODO 4: ตรวจสอบ response
    // if (!response.ok) {
    //   throw new Error('Failed to fetch restaurants');
    // }
    
    // TODO 5: แปลง response เป็น JSON และ return
    // return await response.json();
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลร้านอาหารตาม ID พร้อมรีวิว
 * @param {number} id - รหัสร้าน
 * @returns {Promise} - ข้อมูลร้านและรีวิว
 */
export const getRestaurantById = async (id) => {
  try {
    // TODO 6: เติมโค้ดตามตัวอย่าง getRestaurants
    // ใช้ endpoint: `${API_URL}/restaurants/${id}`
    // ตรวจสอบ response.ok
    // return ข้อมูล JSON
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * ฟังก์ชันสำหรับเพิ่มรีวิวใหม่
 * @param {Object} reviewData - ข้อมูลรีวิว
 * @returns {Promise} - ผลลัพธ์การเพิ่มรีวิว
 */
export const addReview = async (reviewData) => {
  try {
    // TODO 7: เขียน POST request
    // const response = await fetch(`${API_URL}/reviews`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(reviewData)
    // });
    
    // TODO 8: ตรวจสอบ response
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to add review');
    // }
    
    // TODO 9: return ข้อมูล JSON
    // return await response.json();
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

---

#### 📄 `frontend/src/components/SearchBar.jsx` (ให้ครบ 100%)

```javascript
import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  // ========================================
  // อธิบาย: debounce effect
  // ========================================
  // เป้าหมาย: รอให้ผู้ใช้พิมพ์เสร็จก่อน ค่อยค่อย search (ประหยัด API calls)
  //
  // ทำไมต้องใช้ debounce?
  // - ถ้าผู้ใช้พิมพ์ "ส้มตำ" (5 ตัวอักษร)
  // - ไม่มี debounce จะเรียก API 5 ครั้ง: "ส", "ส้", "ส้ม", "ส้มต", "ส้มตำ"
  // - มี debounce จะเรียก API แค่ 1 ครั้ง หลังจากพิมพ์เสร็จ 500ms
  //
  // ขั้นตอน:
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (searchTerm !== undefined) {
  //       onSearch(searchTerm);
  //     }
  //   }, 500);
  //   
  //   return () => clearTimeout(timer);
  // }, [searchTerm, onSearch]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        onSearch(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="ค้นหาร้านอาหาร..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        🔍 ค้นหา
      </button>
    </form>
  );
}

export default SearchBar;
```

---

#### 📄 `frontend/src/components/FilterPanel.jsx` (ให้โครงสร้าง 40%)

```javascript
function FilterPanel({ onFilterChange, filters }) {
  const categories = [
    'ทั้งหมด', 
    'อาหารไทย', 
    'อาหารญี่ปุ่น', 
    'อาหารอิตาเลียน', 
    'อาหารจีน', 
    'ฟาสต์ฟู้ด'
  ];

  const handleCategoryChange = (category) => {
    onFilterChange({ 
      category: category === 'ทั้งหมด' ? '' : category 
    });
  };

  // ========================================
  // TODO 1: เพิ่มฟังก์ชัน handleRatingChange
  // ========================================
  // รับ parameter minRating
  // เรียก onFilterChange({ minRating: minRating || '' })
  
  // ========================================
  // TODO 2: เพิ่มฟังก์ชัน handlePriceChange
  // ========================================
  // รับ parameter priceRange
  // เรียก onFilterChange({ priceRange: priceRange || '' })

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>หมวดหมู่:</label>
        <select 
          value={filters.category || 'ทั้งหมด'}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ========================================
          TODO 3: เพิ่ม filter สำหรับ minRating
          ======================================== */}
      {/* 
      <div className="filter-group">
        <label>คะแนนขั้นต่ำ:</label>
        <select 
          value={filters.minRating || ''}
          onChange={(e) => handleRatingChange(e.target.value)}
        >
          <option value="">ทั้งหมด</option>
          <option value="4">4 ดาวขึ้นไป ⭐⭐⭐⭐</option>
          <option value="3">3 ดาวขึ้นไป ⭐⭐⭐</option>
          <option value="2">2 ดาวขึ้นไป ⭐⭐</option>
        </select>
      </div>
      */}

      {/* ========================================
          TODO 4: เพิ่ม filter สำหรับ priceRange
          ======================================== */}
      {/* 
      <div className="filter-group">
        <label>ช่วงราคา:</label>
        <select 
          value={filters.priceRange || ''}
          onChange={(e) => handlePriceChange(e.target.value)}
        >
          <option value="">ทั้งหมด</option>
          <option value="1">฿ (ไม่เกิน 100)</option>
          <option value="2">฿฿ (100-300)</option>
          <option value="3">฿฿฿ (มากกว่า 300)</option>
        </select>
      </div>
      */}
    </div>
  );
}

export default FilterPanel;
```

---

#### 📄 `frontend/src/components/RestaurantList.jsx` (ให้ครบ 100%)

```javascript
import { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { getRestaurants } from '../services/api';

function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minRating: '',
    priceRange: ''
  });

  // 1. useEffect เพื่อ fetch ข้อมูลเมื่อ filters เปลี่ยน
  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 2. เรียก getRestaurants พร้อม filters
      const result = await getRestaurants(filters);
      
      // 3. ตั้งค่า state
      setRestaurants(result.data);
      
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. handleSearch
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  // 5. handleFilterChange
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="restaurant-list-container">
      <SearchBar onSearch={handleSearch} />
      <FilterPanel onFilterChange={handleFilterChange} filters={filters} />
      
      {loading && <div className="loading">กำลังโหลด...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <>
          {restaurants.length === 0 ? (
            <p className="no-results">ไม่พบร้านอาหารที่ค้นหา ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ</p>
          ) : (
            <div className="restaurant-grid">
              {restaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={onSelectRestaurant}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RestaurantList;
```

---

#### 📄 `frontend/src/components/RestaurantDetail.jsx` (ให้โครงสร้าง 30%)

```javascript
import { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { getRestaurantById } from '../services/api';

function RestaurantDetail({ restaurantId, onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantDetail();
  }, [restaurantId]);

  const fetchRestaurantDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO 1: เรียก getRestaurantById
      // const result = await getRestaurantById(restaurantId);
      
      // TODO 2: ตั้งค่า state
      // if (result.success) {
      //   setRestaurant(result.data);
      // }
      
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลร้านได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    // Refresh ข้อมูลหลังจากเพิ่มรีวิวใหม่
    fetchRestaurantDetail();
  };

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">ไม่พบร้านอาหาร</div>;

  return (
    <div className="restaurant-detail">
      <button className="back-button" onClick={onBack}>
        ← กลับ
      </button>
      
      <div className="detail-header">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="detail-info">
          <h1>{restaurant.name}</h1>
          <p className="category">{restaurant.category}</p>
          <p className="description">{restaurant.description}</p>
          <div className="info-row">
            <span>📍 {restaurant.location}</span>
            <span>📞 {restaurant.phone}</span>
            <span>🕐 {restaurant.openHours}</span>
          </div>
          <div className="rating-info">
            <span className="rating">
              ⭐ {restaurant.averageRating > 0 
                ? restaurant.averageRating.toFixed(1) 
                : 'ยังไม่มีรีวิว'}
            </span>
            <span className="price">{'฿'.repeat(restaurant.priceRange)}</span>
            <span className="total-reviews">({restaurant.totalReviews} รีวิว)</span>
          </div>
        </div>
      </div>

      <ReviewForm 
        restaurantId={restaurantId} 
        onReviewAdded={handleReviewAdded}
      />
      
      <ReviewList reviews={restaurant.reviews || []} />
    </div>
  );
}

export default RestaurantDetail;
```

---

#### 📄 `frontend/src/components/ReviewForm.jsx` (ให้โครงสร้าง 40%)

```javascript
import { useState } from 'react';
import { addReview } from '../services/api';

function ReviewForm({ restaurantId, onReviewAdded }) {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    visitDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // ========================================
    // TODO 1: Validate userName (2-50 ตัวอักษร)
    // ========================================
    // if (!formData.userName.trim()) {
    //   newErrors.userName = 'กรุณากรอกชื่อ';
    // } else if (formData.userName.trim().length < 2) {
    //   newErrors.userName = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    // } else if (formData.userName.trim().length > 50) {
    //   newErrors.userName = 'ชื่อต้องไม่เกิน 50 ตัวอักษร';
    // }
    
    // ========================================
    // TODO 2: Validate rating (1-5)
    // ========================================
    // const ratingNum = parseInt(formData.rating);
    // if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    //   newErrors.rating = 'คะแนนต้องอยู่ระหว่าง 1-5';
    // }
    
    // ========================================
    // TODO 3: Validate comment (10-500 ตัวอักษร)
    // ========================================
    // if (!formData.comment.trim()) {
    //   newErrors.comment = 'กรุณากรอกความคิดเห็น';
    // } else if (formData.comment.trim().length < 10) {
    //   newErrors.comment = 'ความคิดเห็นต้องมีอย่างน้อย 10 ตัวอักษร';
    // } else if (formData.comment.trim().length > 500) {
    //   newErrors.comment = 'ความคิดเห็นต้องไม่เกิน 500 ตัวอักษร';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // TODO 4: เรียก addReview API
      // const result = await addReview({
      //   restaurantId,
      //   ...formData,
      //   rating: parseInt(formData.rating)
      // });
      
      // TODO 5: ถ้าสำเร็จ
      // if (result.success) {
      //   alert('เพิ่มรีวิวสำเร็จ! ขอบคุณสำหรับความคิดเห็น');
      //   
      //   // reset form
      //   setFormData({
      //     userName: '',
      //     rating: 5,
      //     comment: '',
      //     visitDate: new Date().toISOString().split('T')[0]
      //   });
      //   setErrors({});
      //   
      //   // เรียก callback เพื่ออัพเดทรีวิว
      //   if (onReviewAdded) {
      //     onReviewAdded();
      //   }
      // }
      
    } catch (error) {
      console.error('Error adding review:', error);
      alert(error.message || 'เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3>เขียนรีวิว</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ชื่อของคุณ *</label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({...formData, userName: e.target.value})}
            placeholder="กรอกชื่อ-นามสกุล"
            className={errors.userName ? 'invalid' : ''}
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>

        <div className="form-group">
          <label>คะแนน *</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
            className={errors.rating ? 'invalid' : ''}
          >
            <option value="5">⭐⭐⭐⭐⭐ ดีเยี่ยม</option>
            <option value="4">⭐⭐⭐⭐ ดีมาก</option>
            <option value="3">⭐⭐⭐ ดี</option>
            <option value="2">⭐⭐ พอใช้</option>
            <option value="1">⭐ ต้องปรับปรุง</option>
          </select>
          {errors.rating && <span className="error">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label>ความคิดเห็น *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            placeholder="เล่าประสบการณ์การทานอาหารที่ร้านนี้... (อย่างน้อย 10 ตัวอักษร)"
            rows="4"
            className={errors.comment ? 'invalid' : ''}
          />
          <div className="char-count">
            {formData.comment.length}/500 ตัวอักษร
          </div>
          {errors.comment && <span className="error">{errors.comment}</span>}
        </div>

        <div className="form-group">
          <label>วันที่เข้าร้าน</label>
          <input
            type="date"
            value={formData.visitDate}
            onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
```

---

#### 📄 `frontend/src/App.jsx` (ให้โครงสร้าง 60%)

```javascript
import { useState } from 'react';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import './App.css';

function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const handleSelectRestaurant = (id) => {
    setSelectedRestaurantId(id);
  };

  const handleBack = () => {
    setSelectedRestaurantId(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍜 Restaurant Review</h1>
        <p>ค้นหาและรีวิวร้านอาหารโปรดของคุณ</p>
      </header>

      <main className="app-main">
        {selectedRestaurantId ? (
          <RestaurantDetail 
            restaurantId={selectedRestaurantId}
            onBack={handleBack}
          />
        ) : (
          <RestaurantList 
            onSelectRestaurant={handleSelectRestaurant}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Restaurant Review App | สร้างด้วย React + Express</p>
      </footer>
    </div>
  );
}

export default App;
```

---

## 🔗 Integration & Testing

### Checklist การทดสอบ

#### ทดสอบ Backend (ก่อน Frontend)

```bash
# 1. ทดสอบดูร้านทั้งหมด
curl http://localhost:3000/api/restaurants

# 2. ทดสอบค้นหา
curl "http://localhost:3000/api/restaurants?search=ส้มตำ"

# 3. ทดสอบกรองหมวด
curl "http://localhost:3000/api/restaurants?category=อาหารไทย"

# 4. ทดสอบเพิ่มรีวิว
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "userName": "ทดสอบ ระบบ",
    "rating": 5,
    "comment": "อร่อยมากครับ บรรยากาศดี พนักงานบริการดี แนะนำเลยครับ"
  }'

# 5. ทดสอบดูร้านที่เพิ่มรีวิวแล้ว (rating ควรเปลี่ยน)
curl http://localhost:3000/api/restaurants/1
```

#### ทดสอบ Frontend

**Test Case 1: แสดงรายการร้าน**
1. เปิด http://localhost:5173
2. ควรเห็นร้านอาหาร 10 ร้าน
3. แต่ละการ์ดมีรูป ชื่อ หมวด คำอธิบาย rating

**Test Case 2: ค้นหา**
1. พิมพ์ "ส้มตำ" ในช่องค้นหา
2. รอ 0.5 วินาที (debounce)
3. ควรเห็นแค่ "ส้มตำน้าเข้านอ้ง"

**Test Case 3: กรองหมวด**
1. เลือก "อาหารไทย"
2. ควรเห็นร้านที่เป็นอาหารไทยเท่านั้น

**Test Case 4: ดูรายละเอียด**
1. คลิกที่การ์ดร้านใดก็ได้
2. ควรเห็นหน้ารายละเอียด พร้อมรูปใหญ่
3. มีปุ่ม "กลับ"

**Test Case 5: เพิ่มรีวิว**
1. ในหน้ารายละเอียด กรอกฟอร์มรีวิว
2. ชื่อ: "ผู้ทดสอบ"
3. คะแนน: 5 ดาว
4. ความคิดเห็น: "ทดสอบระบบ อร่อยมากครับ"
5. กด "ส่งรีวิว"
6. ควรเห็นรีวิวใหม่ปรากฏทันที
7. คะแนนเฉลี่ยควรอัพเดท

**Test Case 6: Validation**
1. พยายามส่งฟอร์มว่างเปล่า → ควรเห็น error
2. กรอกชื่อแค่ 1 ตัว → error
3. กรอกความคิดเห็นแค่ 5 ตัว → error
4. กรอกครบถ้วน → ส่งได้

---

## 📤 การส่งงาน

### สิ่งที่ต้องส่ง

**1. GitHub Repository**
- URL: `https://github.com/yourusername/restaurant-review-app`
- ต้องมี code ทั้ง frontend และ backend
- ต้องมี .gitignore (ไม่ส่ง node_modules)
- ต้องมี commit history (อย่างน้อย 5 commits)

**2. README.md** (ต้องมีครบทุกหัวข้อ)

```markdown
# Restaurant Review Website

## รายละเอียดโปรเจค
[อธิบายโปรเจคสั้นๆ 2-3 บรรทัด]

## เทคโนโลยีที่ใช้
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: JSON File Storage

## Features ที่ทำได้
### Required Features (70 คะแนน)
- [x] แสดงรายการร้านอาหาร
- [x] ค้นหาร้าน
- [x] กรองตามหมวด/rating/ราคา
- [x] ดูรายละเอียดร้าน
- [x] เพิ่มรีวิว
- [x] Validation
- [x] อัพเดท rating อัตโนมัติ

### Bonus Features (ถ้ามี)
- [ ] Sort restaurants
- [ ] Responsive design
- [ ] Animations

## วิธีติดตั้งและรัน

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## API Endpoints
- GET `/api/restaurants` - ดึงรายการร้านทั้งหมด
- GET `/api/restaurants/:id` - ดึงร้านตาม ID
- POST `/api/reviews` - เพิ่มรีวิว
- GET `/api/stats` - ดึงสถิติ

## Screenshots
### หน้าแรก
![Home](screenshots/home.png)

### รายละเอียดร้าน
![Detail](screenshots/detail.png)

### ฟอร์มรีวิว
![Review](screenshots/review-form.png)

## ผู้พัฒนา
- ชื่อ-นามสกุล
- รหัสนักศึกษา
- Email

## License
MIT License
```

**3. Screenshots** (อย่างน้อย 3 รูป)
- หน้าแรก (รายการร้าน)
- หน้ารายละเอียดร้าน
- ฟอร์มเขียนรีวิว

### วิธีส่งงาน

```bash
# 1. สร้าง repository บน GitHub
# ไปที่ github.com → New repository

# 2. Push code ขึ้น GitHub
cd restaurant-review-app
git init
git add .
git commit -m "Initial commit: Restaurant Review App"
git branch -M main
git remote add origin https://github.com/yourusername/restaurant-review-app.git
git push -u origin main

# 3. เพิ่ม screenshots
mkdir screenshots
# ใส่รูปภาพ 3-5 รูป
git add screenshots/
git commit -m "Add screenshots"
git push

# 4. ตรวจสอบความสมบูรณ์
# - README.md ครบถ้วน ✓
# - Code ทำงานได้ ✓
# - ไม่มี node_modules ใน repo ✓
# - Screenshots แสดงได้ ✓
```

**5. ส่ง GitHub URL ผ่าน:**
- Google Classroom หรือ
- Email ถึงอาจารย์
- ระบบที่อาจารย์กำหนด

---

## 📊 เกณฑ์การให้คะแนน

### Backend API (30 คะแนน)

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|------------|
| GET /api/restaurants | 5 | ส่งข้อมูลถูกต้อง แสดงร้านทั้งหมด |
| Filtering (search, category, rating, price) | 10 | กรองได้ครบทั้ง 4 แบบ (แบบละ 2.5 คะแนน) |
| GET /api/restaurants/:id | 5 | ดึงร้านพร้อมรีวิวได้ |
| POST /api/reviews | 5 | บันทึกรีวิวได้ |
| Update rating อัตโนมัติ | 3 | อัพเดท averageRating และ totalReviews ถูกต้อง |
| Validation | 2 | ตรวจสอบข้อมูลก่อนบันทึก |

**การให้คะแนนแบบ Partial Credit:**
- Filtering ทำได้ 2/4 แบบ → 5 คะแนน
- Update rating ไม่ถูกต้อง → 0-1 คะแนน
- Validation ไม่ครบ → 0-1 คะแนน

### Frontend Components (30 คะแนน)

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|------------|
| แสดงรายการร้าน | 5 | Grid layout, แสดงข้อมูลครบ |
| Search + Debounce | 5 | ค้นหาได้ รอ 500ms ก่อน search |
| Filter Panel | 5 | กรองได้อย่างน้อย 2 แบบ |
| รายละเอียดร้าน | 5 | แสดงข้อมูลครบ มีปุ่มกลับ |
| ฟอร์มเขียนรีวิว | 6 | ฟอร์มครบ validation ทำงาน |
| แสดงรีวิว | 2 | แสดงรีวิวเรียงจากใหม่สุด |
| Loading/Error states | 2 | แสดง loading และ error |

**การให้คะแนนแบบ Partial Credit:**
- Search ไม่มี debounce → 3/5 คะแนน
- Filter ทำได้แค่ category → 2.5/5 คะแนน
- Validation ไม่ครบ → 3-4/6 คะแนน

### Integration (10 คะแนน)

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|------------|
| เชื่อมต่อ Frontend-Backend | 5 | API calls ทำงาน ข้อมูลแสดงถูก |
| Refresh หลังเพิ่มรีวิว | 3 | Rating อัพเดททันที |
| Error Handling | 2 | แสดง error เมื่อเกิดปัญหา |

### Bonus Features (15 คะแนน)

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|------------|
| Sort (เรียงลำดับ) | 3 | เรียงตาม rating/ชื่อ/reviews |
| Multiple Filters | 3 | กรอง 3-4 เงื่อนไขพร้อมกัน |
| Responsive Design | 5 | ใช้งานบนมือถือได้ดี |
| Animations | 4 | Hover effects, transitions |

### Documentation & Code Quality (15 คะแนน)

| หัวข้อ | คะแนน | รายละเอียด |
|--------|-------|------------|
| README.md | 5 | มีครบทุกหัวข้อ อธิบายชัดเจน |
| Screenshots | 2 | มีรูปอย่างน้อย 3 รูป แสดงผลชัดเจน |
| Code Organization | 4 | แยกไฟล์เป็นระเบียบ ตั้งชื่อเข้าใจง่าย |
| Comments | 2 | มี comment อธิบายโค้ดที่ซับซ้อน |
| Git Commits | 2 | มี commit message ที่มีความหมาย |

---

## 🐛 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE :::3000
```

**Solution:**
```bash
# หา process ที่ใช้ port
lsof -i :3000

# Kill process
kill -9 <PID>

# หรือเปลี่ยน port ใน .env
PORT=3001
```

### Issue 2: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```javascript
// ตรวจสอบใน server.js
app.use(cors()); // ต้องมีบรรทัดนี้
```

### Issue 3: Data Not Updating

**Problem:** เพิ่มรีวิวแล้วแต่ rating ไม่เปลี่ยน

**Solution:**
```javascript
// ตรวจสอบใน routes/reviews.js
// ต้องหา index ก่อนแก้ไข!
const restaurantIndex = restaurants.findIndex(r => r.id === parseInt(restaurantId));
restaurants[restaurantIndex].averageRating = newAverage; // ✓ ถูก

// ❌ ผิด - แก้ object โดยตรง
const restaurant = restaurants.find(...);
restaurant.averageRating = newAverage; // ไม่ได้บันทึก!
```

### Issue 4: Validation ไม่ทำงาน

**Problem:** ส่งข้อมูลผิดแต่ผ่าน validation

**Solution:**
```javascript
// ตรวจสอบว่า middleware อยู่ก่อน route handler
router.post('/', validateReview, async (req, res) => {
  // validateReview ต้องมา first!
});
```

### Issue 5: Reviews ไม่เรียงตาม createdAt

**Problem:** รีวิวใหม่อยู่ด้านล่าง

**Solution:**
```javascript
// ต้อง sort หลัง filter
const reviews = allReviews
  .filter(r => r.restaurantId === id)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // ใหม่ - เก่า = เรียงจากใหม่สุด
```

---

## 💡 Tips & Best Practices

### การเขียนโค้ดที่ดี

**1. ตั้งชื่อตัวแปรให้ชัดเจน**
```javascript
// ดี ✓
const restaurantReviews = reviews.filter(r => r.restaurantId === id);
const newAverageRating = totalRating / restaurantReviews.length;

// ไม่ดี ✗
const r = reviews.filter(x => x.restaurantId === id);
const avg = sum / r.length;
```

**2. ใช้ try-catch ทุกที่ที่มี async/await**
```javascript
// ดี ✓
try {
  const result = await fetch(url);
  const data = await result.json();
  return data;
} catch (error) {
  console.error('Error:', error);
  throw error;
}
```

**3. Validate ทั้ง Frontend และ Backend**
```javascript
// Frontend - UX ดี (แจ้ง error ทันที)
if (userName.length < 2) {
  setErrors({ userName: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' });
}

// Backend - Security (ป้องกันจริง)
if (!userName || userName.trim().length < 2) {
  return res.status(400).json({ error: 'Invalid name' });
}
```

**4. ใช้ const/let แทน var**
```javascript
// ดี ✓
const API_URL = 'http://localhost:3000';
let counter = 0;

// ไม่ดี ✗
var API_URL = 'http://localhost:3000';
var counter = 0;
```

### Performance Tips

**1. Debounce สำหรับ Search**
```javascript
// ประหยัด API calls จาก 5 ครั้ง → 1 ครั้ง
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

**2. ใช้ key ใน map()**
```javascript
// ดี ✓
{restaurants.map(r => (
  <RestaurantCard key={r.id} restaurant={r} />
))}

// ไม่ดี ✗
{restaurants.map((r, index) => (
  <RestaurantCard key={index} restaurant={r} />
))}
```

### Git Best Practices

**Commit Messages ที่ดี:**
```bash
# ดี ✓
git commit -m "Add search functionality with debounce"
git commit -m "Fix rating calculation bug in POST /reviews"
git commit -m "Update README with installation instructions"

# ไม่ดี ✗
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

**Commit บ่อยๆ:**
```bash
# แทนที่จะ commit ครั้งเดียวตอนท้าย
git commit -m "Complete entire project"

# ควร commit ทีละ feature
git commit -m "Add backend restaurants route"
git commit -m "Add backend reviews route"
git commit -m "Add frontend restaurant list"
# ...
```

---

## 🎓 สิ่งที่จะได้เรียนรู้

หลังจากทำโปรเจคนี้เสร็จ นักศึกษาจะสามารถ:

### Backend Skills
- ✓ สร้าง REST API ด้วย Express
- ✓ จัดการข้อมูลด้วย File System
- ✓ ทำ Input Validation
- ✓ จัดการ Error Handling
- ✓ เข้าใจ CORS
- ✓ ใช้ Middleware

### Frontend Skills
- ✓ สร้าง React Components
- ✓ ใช้ React Hooks (useState, useEffect)
- ✓ จัดการ State Management
- ✓ เรียก API ด้วย fetch
- ✓ ทำ Form Validation
- ✓ ใช้ Debounce

### Integration Skills
- ✓ เชื่อมต่อ Frontend-Backend
- ✓ จัดการ Async Operations
- ✓ Handle Loading States
- ✓ Handle Error States

### Development Skills
- ✓ ใช้ Git & GitHub
- ✓ เขียน Documentation
- ✓ Debug Problems
- ✓ Test Applications

---

## 📚 Resources เพิ่มเติม

### Documentation
- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools
- [Postman](https://www.postman.com/) - ทดสอบ API
- [JSON Formatter](https://jsonformatter.org/) - ตรวจสอบ JSON
- [Git Basics](https://git-scm.com/book/en/v2)

---

## ✅ Final Checklist

### ก่อนส่งงาน ตรวจสอบ:

**Functionality**
- [ ] แสดงรายการร้านได้
- [ ] ค้นหาทำงาน
- [ ] กรองทำงาน (อย่างน้อย 2 แบบ)
- [ ] ดูรายละเอียดได้
- [ ] เขียนรีวิวได้
- [ ] Validation ทำงาน
- [ ] Rating อัพเดทอัตโนมัติ
- [ ] Loading states แสดง
- [ ] Error handling ครบ

**Code Quality**
- [ ] ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี code ที่ comment ทิ้งไว้
- [ ] มี comments สำหรับโค้ดที่ซับซ้อน
- [ ] ชื่อตัวแปรและฟังก์ชันชัดเจน
- [ ] ไฟล์จัดเป็นระเบียบ

**Documentation**
- [ ] README.md สมบูรณ์
- [ ] มี screenshots อย่างน้อย 3 รูป
- [ ] อธิบายวิธีติดตั้งและรัน
- [ ] ระบุ features ที่ทำ

**Git**
- [ ] Push code ขึ้น GitHub แล้ว
- [ ] ไม่มี node_modules ใน repo
- [ ] มี .gitignore
- [ ] Commit messages ชัดเจน (อย่างน้อย 5 commits)

**Testing**
- [ ] Backend รันได้
- [ ] Frontend รันได้
- [ ] ทดสอบทุก features แล้ว
- [ ] ไม่มี error ใน console

---

## 🎉 สรุป

**เวลาที่แนะนำ:**
- Backend: 60 นาที
- Frontend: 90 นาที  
- Integration: 45 นาที
- **รวม: 3.5 ชั่วโมง**

**คำแนะนำสุดท้าย:**
1. เริ่มจาก required features ก่อน
2. ทดสอบบ่อยๆ ทีละส่วน
3. commit เป็นประจำ
4. ถ้าติดตรงไหน ให้ debug ทีละขั้นตอน
5. อย่าลืมเขียน README และเพิ่ม screenshots

**หากมีเวลาเหลือ:**
- ทำ bonus features
- ปรับปรุง UI ให้สวยขึ้น
- เพิ่ม animations
- ทำ responsive design

**Good luck และสนุกกับการเขียนโค้ด! 🚀**

---

**หมายเหตุ:** เอกสารนี้เป็น guide เท่านั้น นักศึกษาสามารถปรับแต่งและเพิ่มเติม features ได้ตามความคิดสร้างสรรค์ แต่ต้องทำ required features ให้ครบก่อน

---

*เอกสารนี้จัดทำโดย: [อ.ธนิต เกตุแก้ว/มทร.ล้านนา เชียงใหม่ (ดอยสะเก็ด)]*  
*อัพเดทล่าสุด: [5-10-2568]*

