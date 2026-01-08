# 💻 ENGCE301 - Week 6 Workshop
## Node.js + Express API with JSON File Storage

```
╔══════════════════════════════════════════════════════════════╗
║           Workshop: Express API Development                   ║
║              ระยะเวลา: 3 ชั่วโมง (180 นาที)                 ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 วัตถุประสงค์

เมื่อจบ Workshop นี้ นักศึกษาจะสามารถ:
- ✅ ติดตั้งและใช้งาน Node.js และ Express
- ✅ สร้าง RESTful API endpoints
- ✅ ทำ CRUD operations กับ JSON file
- ✅ ทดสอบ API ด้วย Postman
- ✅ จัดการ Error Handling

---

## 📚 สิ่งที่ต้องเตรียม

### Software:
- ✅ Node.js (v14+) - https://nodejs.org
- ✅ VS Code - https://code.visualstudio.com
- ✅ Postman - https://www.postman.com/downloads

### ความรู้พื้นฐาน:
- JavaScript
- JSON format
- HTTP methods (GET, POST, PUT, DELETE)

---

## 📋 โครงสร้างโปรเจกต์

```
week6-workshop/
├── package.json
├── server.js              # Main server file
├── data/
│   └── products.json      # Data storage
└── routes/
    └── products.js        # Product routes (นักศึกษาเขียนเอง)
```

---

## ⏰ กำหนดเวลา

| เวลา | กิจกรรม | ระยะเวลา |
|------|---------|----------|
| 00:00-00:15 | Setup & Install | 15 นาที |
| 00:15-00:45 | Part 1: Create Server & GET | 30 นาที |
| 00:45-01:15 | Part 2: POST (Create) | 30 นาที |
| 01:15-01:30 | พักเบรก ☕ | 15 นาที |
| 01:30-02:00 | Part 3: PUT (Update) | 30 นาที |
| 02:00-02:30 | Part 4: DELETE | 30 นาที |
| 02:30-03:00 | Testing & Debugging | 30 นาที |

---

## 🚀 Part 1: Setup Project (15 นาที)

### ขั้นตอนที่ 1: สร้างโปรเจกต์

```bash
# สร้างโฟลเดอร์โปรเจกต์
mkdir week6-workshop
cd week6-workshop

# สร้าง package.json
npm init -y

# ติดตั้ง dependencies
npm install express cors
npm install --save-dev nodemon
```

### ขั้นตอนที่ 2: แก้ไข package.json

เปิดไฟล์ `package.json` และเพิ่ม scripts:

```json
{
  "name": "week6-workshop",
  "version": "1.0.0",
  "description": "Express API Workshop",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### ขั้นตอนที่ 3: สร้างโครงสร้างโฟลเดอร์

```bash
# สร้างโฟลเดอร์
mkdir data routes

# สร้างไฟล์
touch server.js
touch data/products.json
touch routes/products.js
```

---

## 📝 Part 2: สร้าง Server และ GET Endpoints (30 นาที)

### ไฟล์: `server.js` (ให้โค้ด 100%)

```javascript
// ============================================
// ENGCE301 Week 6 Workshop - Express Server
// ============================================

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== IMPORT ROUTES =====
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// ===== ROOT ENDPOINT =====
app.get('/', (req, res) => {
    res.json({
        message: 'Week 6 Workshop - Express API',
        endpoints: {
            products: '/api/products'
        }
    });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('='.repeat(50));
});
```

---

### ไฟล์: `data/products.json` (ให้ข้อมูล 100%)

```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "price": 42900,
    "stock": 15,
    "description": "Latest iPhone with A17 Pro chip"
  },
  {
    "id": 2,
    "name": "MacBook Air M2",
    "category": "Electronics",
    "price": 39900,
    "stock": 8,
    "description": "13-inch MacBook Air with M2 chip"
  },
  {
    "id": 3,
    "name": "AirPods Pro",
    "category": "Electronics",
    "price": 8990,
    "stock": 25,
    "description": "Active Noise Cancellation"
  }
]
```

---

### ไฟล์: `routes/products.js` (ให้โค้ด 70%)

```javascript
// ============================================
// Product Routes - นักศึกษาเติมโค้ดส่วนที่ขาด
// ============================================

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

// ===== HELPER FUNCTIONS =====

// อ่านข้อมูลจากไฟล์
async function readProducts() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

// เขียนข้อมูลลงไฟล์
async function writeProducts(products) {
    try {
        await fs.writeFile(
            dataPath, 
            JSON.stringify(products, null, 2),
            'utf8'
        );
        return true;
    } catch (error) {
        console.error('Error writing products:', error);
        return false;
    }
}

// ===== GET ALL PRODUCTS =====
// ✅ ให้โค้ดสมบูรณ์
router.get('/', async (req, res) => {
    try {
        const products = await readProducts();
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== GET PRODUCT BY ID =====
// ⚠️ นักศึกษาเติมโค้ด 30%
router.get('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const id = parseInt(req.params.id);
        
        // TODO: ค้นหา product ที่มี id ตรงกับที่ส่งมา
        const product = /* เติมโค้ดตรงนี้ */;
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== POST (CREATE) PRODUCT =====
// ⚠️ นักศึกษาเติมโค้ดทั้งหมด
router.post('/', async (req, res) => {
    try {
        const products = await readProducts();
        const { name, category, price, stock, description } = req.body;
        
        // TODO: 1. Validate ข้อมูล (ตรวจสอบว่ามีครบหรือไม่)
        
        
        // TODO: 2. สร้าง id ใหม่ (หา max id + 1)
        
        
        // TODO: 3. สร้าง product object ใหม่
        const newProduct = {
            // เติมโค้ดตรงนี้
        };
        
        // TODO: 4. เพิ่มเข้า array
        
        
        // TODO: 5. บันทึกลงไฟล์
        
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== PUT (UPDATE) PRODUCT =====
// ⚠️ นักศึกษาเติมโค้ดส่วนสำคัญ
router.put('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const id = parseInt(req.params.id);
        const { name, category, price, stock, description } = req.body;
        
        // TODO: 1. หา index ของ product ที่ต้องการแก้ไข
        
        
        // TODO: 2. ตรวจสอบว่าเจอหรือไม่
        
        
        // TODO: 3. อัปเดตข้อมูล
        
        
        // TODO: 4. บันทึกลงไฟล์
        
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== DELETE PRODUCT =====
// ⚠️ นักศึกษาเติมโค้ดทั้งหมด
router.delete('/:id', async (req, res) => {
    try {
        // TODO: เขียนโค้ดลบ product
        
        
        
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
```

---

## 🎯 งานที่นักศึกษาต้องทำ

### ✏️ Task 1: GET by ID (10 นาที)
เติมโค้ดใน `GET /:id` endpoint:
```javascript
// Hint: ใช้ .find() method
const product = products.find(p => p.id === id);
```

### ✏️ Task 2: POST (Create) (20 นาที)
เติมโค้ดทั้งหมดใน `POST /` endpoint:

**คำแนะนำ:**
1. Validate:
```javascript
if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
        success: false,
        error: 'Missing required fields'
    });
}
```

2. สร้าง ID ใหม่:
```javascript
const maxId = products.length > 0 
    ? Math.max(...products.map(p => p.id)) 
    : 0;
const newId = maxId + 1;
```

3. สร้าง object:
```javascript
const newProduct = {
    id: newId,
    name,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    description: description || ''
};
```

4. เพิ่มและบันทึก:
```javascript
products.push(newProduct);
await writeProducts(products);
```

### ✏️ Task 3: PUT (Update) (20 นาที)
เติมโค้ดใน `PUT /:id` endpoint:

**คำแนะนำ:**
```javascript
// 1. หา index
const productIndex = products.findIndex(p => p.id === id);

// 2. ตรวจสอบ
if (productIndex === -1) {
    return res.status(404).json({
        success: false,
        error: 'Product not found'
    });
}

// 3. อัปเดต
products[productIndex] = {
    id,
    name,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    description: description || products[productIndex].description
};

// 4. บันทึก
await writeProducts(products);
```

### ✏️ Task 4: DELETE (15 นาที)
เขียนโค้ดทั้งหมดใน `DELETE /:id` endpoint:

**คำแนะนำ:**
```javascript
const products = await readProducts();
const id = parseInt(req.params.id);

const productIndex = products.findIndex(p => p.id === id);

if (productIndex === -1) {
    return res.status(404).json({
        success: false,
        error: 'Product not found'
    });
}

products.splice(productIndex, 1);
await writeProducts(products);
```

---

## 🧪 การทดสอบ

### 1. รัน Server
```bash
npm run dev
```

### 2. ทดสอบด้วย Postman

#### Test 1: GET All Products
```
GET http://localhost:3000/api/products
```
**Expected:** ได้ products ทั้งหมด 3 รายการ

#### Test 2: GET Product by ID
```
GET http://localhost:3000/api/products/1
```
**Expected:** ได้ iPhone 15 Pro

#### Test 3: POST Create Product
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "iPad Air",
  "category": "Electronics",
  "price": 19900,
  "stock": 12,
  "description": "10.9-inch iPad Air"
}
```
**Expected:** สร้างสำเร็จ, ได้ id = 4

#### Test 4: PUT Update Product
```
PUT http://localhost:3000/api/products/1
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "category": "Electronics",
  "price": 47900,
  "stock": 10,
  "description": "iPhone 15 Pro Max 256GB"
}
```
**Expected:** อัปเดตสำเร็จ

#### Test 5: DELETE Product
```
DELETE http://localhost:3000/api/products/3
```
**Expected:** ลบสำเร็จ

---

## ✅ Checklist

- [ ] ติดตั้ง Node.js และ npm สำเร็จ
- [ ] สร้างโปรเจกต์และติดตั้ง dependencies
- [ ] Server รันได้ไม่มี error
- [ ] GET all products ทำงานได้
- [ ] GET by id ทำงานได้
- [ ] POST create product ทำงานได้
- [ ] PUT update product ทำงานได้
- [ ] DELETE product ทำงานได้
- [ ] ทดสอบทุก endpoint ด้วย Postman
- [ ] Error handling ทำงานถูกต้อง

---

## 🐛 Common Errors & Solutions

### Error 1: Cannot find module 'express'
**Solution:** รัน `npm install`

### Error 2: ENOENT: no such file or directory
**Solution:** ตรวจสอบว่าสร้างโฟลเดอร์ `data/` และไฟล์ `products.json` แล้ว

### Error 3: Port 3000 already in use
**Solution:** เปลี่ยน PORT ใน `server.js` หรือปิด process ที่ใช้ port 3000

### Error 4: SyntaxError: Unexpected token in JSON
**Solution:** ตรวจสอบ JSON format ใน `products.json` ให้ถูกต้อง

---

## 🎓 สิ่งที่ได้เรียนรู้

✅ การสร้าง Express Server
✅ RESTful API Design
✅ CRUD Operations
✅ File System (fs) operations
✅ Async/Await
✅ Error Handling
✅ Testing with Postman

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js File System](https://nodejs.org/api/fs.html)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

## 🏆 Next Steps

หลังจบ Workshop นี้:
1. ทำ Lab Week 6 (ถ้ามี)
2. เตรียมตัวสำหรับ Week 7 (SQLite + Layered Architecture)
3. ลองเพิ่ม features เพิ่มเติม:
   - Search & Filter
   - Pagination
   - Input validation
   - Better error messages

---

**Good Luck! 🚀**
