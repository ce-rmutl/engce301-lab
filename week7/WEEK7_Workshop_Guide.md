# 💻 ENGCE301 - Week 7 Workshop
## SQLite Integration + Layered Architecture

```
╔══════════════════════════════════════════════════════════════╗
║      Workshop: Migrate to SQLite + Clean Architecture       ║
║              ระยะเวลา: 3 ชั่วโมง (180 นาที)                 ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 วัตถุประสงค์

เมื่อจบ Workshop นี้ นักศึกษาจะสามารถ:
- ✅ ติดตั้งและใช้งาน SQLite
- ✅ สร้าง Database Schema
- ✅ Migrate จาก JSON file → SQLite
- ✅ จัดโครงสร้างโค้ดแบบ Layered Architecture
- ✅ เขียน CRUD operations กับ SQLite

---

## 📚 สิ่งที่ต้องเตรียม

### Software:
- ✅ Node.js (v14+)
- ✅ VS Code
- ✅ Postman
- ✅ DB Browser for SQLite (Optional) - https://sqlitebrowser.org/

### ความรู้พื้นฐาน:
- Express (จาก Week 6)
- SQL พื้นฐาน
- Async/Await

---

## 📋 โครงสร้างโปรเจกต์

```
week7-workshop/
├── package.json
├── server.js
├── database/
│   ├── connection.js       # ให้โค้ด 100%
│   ├── schema.sql          # ให้โค้ด 100%
│   ├── init-db.js         # ให้โค้ด 100%
│   └── products.db.js      # ให้โค้ด 70%
├── services/
│   └── product.service.js  # ให้โค้ด 60%
├── controllers/
│   └── product.controller.js # ให้โค้ด 70%
└── routes/
    └── products.route.js   # ให้โค้ด 80%
```

---

## ⏰ กำหนดเวลา

| เวลา | กิจกรรม | ระยะเวลา |
|------|---------|----------|
| 00:00-00:20 | Setup SQLite & Create Schema | 20 นาที |
| 00:20-00:50 | Part 1: Database Layer | 30 นาที |
| 00:50-01:20 | Part 2: Service Layer | 30 นาที |
| 01:20-01:35 | พักเบรก ☕ | 15 นาที |
| 01:35-02:05 | Part 3: Controller Layer | 30 นาที |
| 02:05-02:25 | Part 4: Router Layer | 20 นาที |
| 02:25-03:00 | Testing & Integration | 35 นาที |

---

## 🚀 Part 1: Setup SQLite (20 นาที)

### ขั้นตอนที่ 1: สร้างโปรเจกต์

```bash
# สร้างโฟลเดอร์
mkdir week7-workshop
cd week7-workshop

# สร้าง package.json
npm init -y

# ติดตั้ง dependencies
npm install express cors sqlite3
npm install --save-dev nodemon
```

### ขั้นตอนที่ 2: สร้างโครงสร้างโฟลเดอร์

```bash
mkdir database services controllers routes
touch server.js
```

---

### ไฟล์: `package.json` (ให้โค้ด 100%)

```json
{
  "name": "week7-workshop",
  "version": "1.0.0",
  "description": "SQLite + Layered Architecture Workshop",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node database/init-db.js"
  },
  "keywords": [],
  "author": "",
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

### ไฟล์: `database/schema.sql` (ให้โค้ด 100%)

```sql
-- ============================================
-- Database Schema for Products
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== CATEGORIES TABLE =====
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== PRODUCTS TABLE =====
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_products_category 
    ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_products_name 
    ON products(name);

-- ===== TRIGGER: Update timestamp =====
CREATE TRIGGER IF NOT EXISTS update_products_timestamp
AFTER UPDATE ON products
BEGIN
    UPDATE products 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- ===== SAMPLE DATA: Categories =====
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Electronic devices and gadgets'),
    ('Computers', 'Computers and accessories'),
    ('Audio', 'Audio equipment');

-- ===== SAMPLE DATA: Products =====
INSERT INTO products (name, category_id, price, stock, description) VALUES
    ('iPhone 15 Pro', 1, 42900, 15, 'Latest iPhone with A17 Pro chip'),
    ('MacBook Air M2', 2, 39900, 8, '13-inch MacBook Air with M2 chip'),
    ('AirPods Pro', 3, 8990, 25, 'Active Noise Cancellation'),
    ('iPad Air', 1, 19900, 12, '10.9-inch iPad Air'),
    ('Magic Keyboard', 2, 3590, 30, 'Wireless keyboard for Mac');
```

---

### ไฟล์: `database/connection.js` (ให้โค้ด 100%)

```javascript
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
```

---

### ไฟล์: `database/init-db.js` (ให้โค้ด 100%)

```javascript
// ============================================
// Database Initialization
// ============================================

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'products.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Delete existing database
if (fs.existsSync(dbPath)) {
    console.log('🗑️  Deleting existing database...');
    fs.unlinkSync(dbPath);
}

// Create new database
console.log('📝 Creating new database...');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
    console.log('✅ Database created');
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error executing schema:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Schema created successfully');
    
    // Verify data
    db.all('SELECT COUNT(*) as count FROM products', (err, rows) => {
        if (!err) {
            console.log(`📊 Products in database: ${rows[0].count}`);
        }
        
        db.close();
        console.log('\n✅ Database initialization complete!\n');
    });
});
```

**รันคำสั่ง:**
```bash
npm run init-db
```

---

## 📝 Part 2: Database Layer (30 นาที)

### ไฟล์: `database/products.db.js` (ให้โค้ด 70%)

```javascript
// ============================================
// DATABASE LAYER - Products
// ============================================

const db = require('./connection');

class ProductDatabase {
    // ===== CREATE =====
    // ✅ ให้โค้ดสมบูรณ์
    static create(productData) {
        const sql = `
            INSERT INTO products (name, category_id, price, stock, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(
                sql,
                [
                    productData.name,
                    productData.category_id,
                    productData.price,
                    productData.stock,
                    productData.description || ''
                ],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            ...productData
                        });
                    }
                }
            );
        });
    }

    // ===== READ ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;

        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // ===== READ ONE =====
    // ⚠️ นักศึกษาเติมโค้ด 30%
    static findById(id) {
        // TODO: เขียน SQL query ให้ JOIN กับ categories
        const sql = `
            /* เติม SQL query ตรงนี้ */
        `;

        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // ===== UPDATE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static update(id, productData) {
        // TODO: เขียน SQL UPDATE query
        const sql = `
            /* เติม SQL query ตรงนี้ */
        `;

        return new Promise((resolve, reject) => {
            // TODO: เติมโค้ด db.run
        });
    }

    // ===== DELETE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static delete(id) {
        // TODO: เขียน SQL DELETE query
        
        
        
    }

    // ===== SEARCH =====
    // ⚠️ นักศึกษาเติมโค้ด
    static search(keyword) {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.name LIKE ? OR p.description LIKE ?
            ORDER BY p.id DESC
        `;

        return new Promise((resolve, reject) => {
            const searchTerm = `%${keyword}%`;
            // TODO: เติมโค้ด db.all
            
        });
    }
}

module.exports = ProductDatabase;
```

---

## 🎯 งานที่นักศึกษาต้องทำ - Database Layer

### ✏️ Task 1: findById (5 นาที)
```javascript
static findById(id) {
    const sql = `
        SELECT 
            p.*,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;

    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
```

### ✏️ Task 2: update (10 นาที)
```javascript
static update(id, productData) {
    const sql = `
        UPDATE products
        SET name = ?,
            category_id = ?,
            price = ?,
            stock = ?,
            description = ?
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        db.run(
            sql,
            [
                productData.name,
                productData.category_id,
                productData.price,
                productData.stock,
                productData.description,
                id
            ],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            }
        );
    });
}
```

### ✏️ Task 3: delete (5 นาที)
```javascript
static delete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';

    return new Promise((resolve, reject) => {
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
}
```

### ✏️ Task 4: search (5 นาที)
```javascript
static search(keyword) {
    const sql = `
        SELECT 
            p.*,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR p.description LIKE ?
        ORDER BY p.id DESC
    `;

    return new Promise((resolve, reject) => {
        const searchTerm = `%${keyword}%`;
        db.all(sql, [searchTerm, searchTerm], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
```

---

## 📝 Part 3: Service Layer (30 นาที)

### ไฟล์: `services/product.service.js` (ให้โค้ด 60%)

```javascript
// ============================================
// SERVICE LAYER - Products
// ============================================

const ProductDB = require('../database/products.db');

class ProductService {
    // ===== GET ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getAllProducts() {
        try {
            const products = await ProductDB.findAll();
            return products;
        } catch (error) {
            throw new Error(`Failed to get products: ${error.message}`);
        }
    }

    // ===== GET BY ID =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getProductById(id) {
        try {
            const product = await ProductDB.findById(id);
            
            if (!product) {
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            throw error;
        }
    }

    // ===== CREATE =====
    // ⚠️ นักศึกษาเติม Validation
    static async createProduct(productData) {
        try {
            // TODO: Validate required fields
            // name, category_id, price, stock ต้องมีค่า
            
            
            // TODO: Validate price > 0
            
            
            // TODO: Validate stock >= 0
            
            
            // Create product
            const newProduct = await ProductDB.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    // ===== UPDATE =====
    // ⚠️ นักศึกษาเติมโค้ด
    static async updateProduct(id, productData) {
        try {
            // TODO: 1. ตรวจสอบว่า product มีอยู่จริง
            
            
            // TODO: 2. Validate ข้อมูล
            
            
            // TODO: 3. Update
            
            
            // TODO: 4. Return product ที่ update แล้ว
            
        } catch (error) {
            throw error;
        }
    }

    // ===== DELETE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static async deleteProduct(id) {
        try {
            // TODO: เขียนโค้ดลบ product
            
            
            
        } catch (error) {
            throw error;
        }
    }

    // ===== SEARCH =====
    // ✅ ให้โค้ดสมบูรณ์
    static async searchProducts(keyword) {
        try {
            if (!keyword || keyword.trim() === '') {
                throw new Error('Search keyword is required');
            }

            const products = await ProductDB.search(keyword);
            return products;
        } catch (error) {
            throw error;
        }
    }

    // ===== VALIDATION =====
    static validateProductData(data) {
        const { name, category_id, price, stock } = data;

        if (!name || !category_id || price === undefined || stock === undefined) {
            throw new Error('Missing required fields');
        }

        if (price < 0) {
            throw new Error('Price must be greater than or equal to 0');
        }

        if (stock < 0) {
            throw new Error('Stock must be greater than or equal to 0');
        }
    }
}

module.exports = ProductService;
```

---

## 🎯 งานที่นักศึกษาต้องทำ - Service Layer

### ✏️ Task 1: createProduct Validation (5 นาที)
```javascript
static async createProduct(productData) {
    try {
        // Validate using helper method
        this.validateProductData(productData);
        
        // Create product
        const newProduct = await ProductDB.create(productData);
        return newProduct;
    } catch (error) {
        throw new Error(`Failed to create product: ${error.message}`);
    }
}
```

### ✏️ Task 2: updateProduct (10 นาที)
```javascript
static async updateProduct(id, productData) {
    try {
        // 1. Check if exists
        const existingProduct = await ProductDB.findById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }

        // 2. Validate
        this.validateProductData(productData);

        // 3. Update
        await ProductDB.update(id, productData);

        // 4. Return updated product
        return await ProductDB.findById(id);
    } catch (error) {
        throw error;
    }
}
```

### ✏️ Task 3: deleteProduct (5 นาที)
```javascript
static async deleteProduct(id) {
    try {
        const product = await ProductDB.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        const result = await ProductDB.delete(id);
        
        if (result.changes === 0) {
            throw new Error('Failed to delete product');
        }

        return { message: 'Product deleted successfully' };
    } catch (error) {
        throw error;
    }
}
```

---

## 📝 Part 4: Controller Layer (30 นาที)

### ไฟล์: `controllers/product.controller.js` (ให้โค้ด 70%)

```javascript
// ============================================
// CONTROLLER LAYER - Products
// ============================================

const ProductService = require('../services/product.service');

class ProductController {
    // ===== GET ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            
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
    }

    // ===== GET BY ID =====
    // ⚠️ นักศึกษาเติม Error Handling
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            // TODO: จัดการ Error ให้เหมาะสม
            // ถ้า "not found" → 404
            // อื่นๆ → 500
            
        }
    }

    // ===== CREATE =====
    // ⚠️ นักศึกษาเติมโค้ด
    static async createProduct(req, res) {
        try {
            // TODO: รับข้อมูลจาก req.body
            
            
            // TODO: เรียก Service
            
            
            // TODO: ส่ง Response (201 Created)
            
        } catch (error) {
            // TODO: Error handling
            
        }
    }

    // ===== UPDATE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static async updateProduct(req, res) {
        try {
            // TODO: เขียนโค้ดทั้งหมด
            
            
            
        } catch (error) {
            // TODO: Error handling
            
        }
    }

    // ===== DELETE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static async deleteProduct(req, res) {
        try {
            // TODO: เขียนโค้ดทั้งหมด
            
            
            
        } catch (error) {
            // TODO: Error handling
            
        }
    }

    // ===== SEARCH =====
    // ✅ ให้โค้ดสมบูรณ์
    static async searchProducts(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    error: 'Search keyword is required'
                });
            }

            const products = await ProductService.searchProducts(q);
            
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
    }
}

module.exports = ProductController;
```

---

## 🎯 งานที่นักศึกษาต้องทำ - Controller Layer

### ✏️ Task 1: getProductById Error Handling (3 นาที)
```javascript
static async getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await ProductService.getProductById(id);
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
```

### ✏️ Task 2: createProduct (7 นาที)
```javascript
static async createProduct(req, res) {
    try {
        const productData = req.body;
        const newProduct = await ProductService.createProduct(productData);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        if (error.message.includes('required') || error.message.includes('must')) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
```

### ✏️ Task 3: updateProduct (7 นาที)
```javascript
static async updateProduct(req, res) {
    try {
        const { id } = req.params;
        const productData = req.body;
        
        const updatedProduct = await ProductService.updateProduct(id, productData);
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({
                success: false,
                error: error.message
            });
        } else if (error.message.includes('required') || error.message.includes('must')) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
```

### ✏️ Task 4: deleteProduct (5 นาที)
```javascript
static async deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const result = await ProductService.deleteProduct(id);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
```

---

## 📝 Part 5: Router Layer (20 นาที)

### ไฟล์: `routes/products.route.js` (ให้โค้ด 80%)

```javascript
// ============================================
// ROUTER LAYER - Products
// ============================================

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

// ===== ROUTES =====

// GET /api/products - Get all products
router.get('/', ProductController.getAllProducts);

// GET /api/products/search?q=keyword - Search products
router.get('/search', ProductController.searchProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', ProductController.getProductById);

// POST /api/products - Create product
// ⚠️ นักศึกษาเติม
router.post(/* เติมโค้ดตรงนี้ */);

// PUT /api/products/:id - Update product
// ⚠️ นักศึกษาเติม
router.put(/* เติมโค้ดตรงนี้ */);

// DELETE /api/products/:id - Delete product
// ⚠️ นักศึกษาเติม
router.delete(/* เติมโค้ดตรงนี้ */);

module.exports = router;
```

**คำตอบ:**
```javascript
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);
```

---

### ไฟล์: `server.js` (ให้โค้ด 100%)

```javascript
// ============================================
// ENGCE301 Week 7 Workshop - Main Server
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== ROUTES =====
const productsRouter = require('./routes/products.route');
app.use('/api/products', productsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Week 7 Workshop - SQLite + Layered Architecture',
        endpoints: {
            products: '/api/products',
            search: '/api/products/search?q=keyword'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Week 7 Workshop Server');
    console.log('='.repeat(60));
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/products`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    console.log('  GET    /api/products');
    console.log('  GET    /api/products/search?q=keyword');
    console.log('  GET    /api/products/:id');
    console.log('  POST   /api/products');
    console.log('  PUT    /api/products/:id');
    console.log('  DELETE /api/products/:id');
    console.log('\n' + '='.repeat(60) + '\n');
});
```

---

## 🧪 การทดสอบ

### 1. Initialize Database
```bash
npm run init-db
```

### 2. รัน Server
```bash
npm run dev
```

### 3. ทดสอบด้วย Postman

#### Test 1: GET All Products
```
GET http://localhost:3000/api/products
```

#### Test 2: GET Product by ID
```
GET http://localhost:3000/api/products/1
```

#### Test 3: Search Products
```
GET http://localhost:3000/api/products/search?q=iphone
```

#### Test 4: POST Create Product
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Apple Watch Series 9",
  "category_id": 1,
  "price": 13900,
  "stock": 20,
  "description": "Smartwatch with health monitoring"
}
```

#### Test 5: PUT Update Product
```
PUT http://localhost:3000/api/products/1
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "category_id": 1,
  "price": 47900,
  "stock": 12,
  "description": "Latest iPhone Pro Max"
}
```

#### Test 6: DELETE Product
```
DELETE http://localhost:3000/api/products/5
```

---

## ✅ Checklist

- [ ] SQLite ติดตั้งสำเร็จ
- [ ] Database สร้างสำเร็จ (npm run init-db)
- [ ] มีข้อมูล products 5 รายการ
- [ ] Server รันได้ไม่มี error
- [ ] GET all products ทำงานได้
- [ ] GET by id ทำงานได้
- [ ] Search ทำงานได้
- [ ] POST create ทำงานได้
- [ ] PUT update ทำงานได้
- [ ] DELETE ทำงานได้
- [ ] Error handling ทำงานถูกต้อง
- [ ] 4 Layers แยกชัดเจน

---

## 🎓 สิ่งที่ได้เรียนรู้

✅ SQLite Setup & Configuration
✅ Database Schema Design
✅ SQL Queries (JOIN, INSERT, UPDATE, DELETE)
✅ Layered Architecture (4 Layers)
✅ Separation of Concerns
✅ Error Handling ใน Async/Await
✅ Prepared Statements (SQL Injection Prevention)

---

## 🏆 Next Steps

1. ทำ Lab Week 7 (การบ้าน)
2. เพิ่ม features เพิ่มเติม:
   - Pagination
   - Sorting
   - Advanced filters
   - Transactions

---

**Good Luck! 🚀**
