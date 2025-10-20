
# Final Exam: Restaurant Review System (SQLite Version)

### Starter Code Template for ENGSE301 1-68

## STARTER CODE FOR STUDENTS

---

## Backend Starter Code

### `backend/package.json`

```json
{
  "name": "restaurant-review-backend",
  "version": "1.0.0",
  "description": "Restaurant Review API with SQLite",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node db/seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### `backend/db/init.sql`

```sql
-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price_range INTEGER CHECK(price_range BETWEEN 1 AND 3),
  phone TEXT,
  image_url TEXT,
  open_hours TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  visit_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Index สำหรับ query ที่ช้า
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);
```

### `backend/db/db.js`

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'restaurant.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initDatabase();
      }
    });
  }

  // TODO: สร้าง initDatabase method
  // - ใช้ fs.readFileSync อ่าน init.sql
  // - รัน db.exec(sql) เพื่อสร้าง tables
  initDatabase() {
    // ✅ เขียนโค้ดด้านล่าง
    const fs = require('fs');
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    this.db.exec(sql, (err) => {
      if (err) {
        console.error('Error initializing database:', err);
      } else {
        console.log('Database initialized');
      }
    });
  }

  // TODO: สร้าง run method (สำหรับ INSERT, UPDATE, DELETE)
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  // TODO: สร้าง get method (สำหรับ SELECT 1 row)
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // TODO: สร้าง all method (สำหรับ SELECT multiple rows)
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new Database();
```

### `backend/middleware/validation.js`

```javascript
// TODO: สร้าง validation middleware สำหรับ review
const validateReview = (req, res, next) => {
  const { restaurantId, userName, rating, comment } = req.body;
  const errors = [];

  // ✅ เขียนโค้ด validation ด้านล่าง
  // 1. ตรวจสอบ restaurantId - ต้องเป็น number
  // 2. ตรวจสอบ userName - 2-50 characters, ไม่มี special chars
  // 3. ตรวจสอบ rating - 1-5 เท่านั้น
  // 4. ตรวจสอบ comment - 10-500 characters

  if (!restaurantId || isNaN(restaurantId)) {
    errors.push('Restaurant ID is required and must be a number');
  }

  if (!userName || userName.trim().length < 2 || userName.trim().length > 50) {
    errors.push('User name must be 2-50 characters');
  }

  if (!rating || rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!comment || comment.trim().length < 10 || comment.trim().length > 500) {
    errors.push('Comment must be 10-500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = { validateReview };
```

### `backend/routes/restaurants.js`

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db/db');

// TODO: GET /api/restaurants - ดึงรีวิวทั้งหมด + filter
// - Parameter: search, category, minRating, priceRange
// - ส่ง restaurants array + average rating + total reviews
router.get('/', async (req, res) => {
  try {
    const { search, category, minRating, priceRange } = req.query;

    // ✅ เขียนโค้ด SQL query ด้านล่าง
    let sql = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    const restaurants = await db.all(sql, params);

    // ✅ สำหรับแต่ละ restaurant ดึง reviews เพื่อคำนวณ average rating
    // - ใช้ JOIN หรือ query reviews table
    // - คำนวณ average rating
    // - คำนวณ total reviews
    // - filter ตาม minRating (ถ้ามี)

    // TODO: เพิ่ม average rating และ total reviews ให้กับแต่ละ restaurant
    for (let restaurant of restaurants) {
      const reviews = await db.all(
        'SELECT rating FROM reviews WHERE restaurant_id = ?',
        [restaurant.id]
      );

      if (reviews.length > 0) {
        const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
        restaurant.averageRating = parseFloat(avgRating);
        restaurant.totalReviews = reviews.length;
      } else {
        restaurant.averageRating = 0;
        restaurant.totalReviews = 0;
      }
    }

    // TODO: filter ตาม minRating (ถ้ามี)
    let filtered = restaurants;
    if (minRating) {
      filtered = restaurants.filter(r => r.averageRating >= parseFloat(minRating));
    }

    if (priceRange) {
      filtered = filtered.filter(r => r.price_range === parseInt(priceRange));
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants'
    });
  }
});

// TODO: GET /api/restaurants/:id - ดึงรายละเอียดร้าน + reviews
// - Join กับ reviews table เพื่อดึง reviews
// - คำนวณ average rating
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ เขียนโค้ด
    const restaurant = await db.get(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // ✅ ดึง reviews จาก table
    const reviews = await db.all(
      'SELECT * FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC',
      [id]
    );

    // ✅ คำนวณ average rating
    let avgRating = 0;
    if (reviews.length > 0) {
      avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    }

    res.json({
      success: true,
      data: {
        ...restaurant,
        averageRating: parseFloat(avgRating),
        totalReviews: reviews.length,
        reviews
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant'
    });
  }
});

// BONUS: GET /api/restaurants/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    // TODO: ดึง restaurants ตาม category
    const restaurants = await db.all(
      'SELECT * FROM restaurants WHERE category = ?',
      [category]
    );

    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants by category'
    });
  }
});

module.exports = router;
```

### `backend/routes/reviews.js`

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { validateReview } = require('../middleware/validation');

// TODO: GET /api/reviews/:restaurantId - ดึงรีวิวของร้าน
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // ✅ เขียนโค้ด query reviews
    const reviews = await db.all(
      'SELECT * FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC',
      [restaurantId]
    );

    res.json({
      success: true,
      data: reviews,
      total: reviews.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

// TODO: POST /api/reviews - เพิ่มรีวิว
// - ต้อง validate ก่อน
// - อัปเดต average rating ของร้าน (ตัวเลือก)
router.post('/', validateReview, async (req, res) => {
  try {
    const { restaurantId, userName, rating, comment, visitDate } = req.body;

    // ✅ ตรวจสอบว่า restaurant มีอยู่
    const restaurant = await db.get(
      'SELECT id FROM restaurants WHERE id = ?',
      [restaurantId]
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // ✅ เขียนโค้ด INSERT review
    const result = await db.run(
      `INSERT INTO reviews (restaurant_id, user_name, rating, comment, visit_date)
       VALUES (?, ?, ?, ?, ?)`,
      [restaurantId, userName.trim(), rating, comment.trim(), visitDate || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        id: result.id
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
});

module.exports = router;
```

### `backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Restaurant Review API (SQLite)',
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

// TODO: GET /api/stats - สถิติระบบ
// - จำนวนร้านทั้งหมด
// - จำนวนรีวิวทั้งหมด
// - average rating ทั้งระบบ
// - Top 5 restaurants
app.get('/api/stats', async (req, res) => {
  try {
    const db = require('./db/db');

    // ✅ เขียนโค้ด query stats

    res.json({
      success: true,
      data: {
        // TODO: เพิ่มข้อมูล
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### `backend/db/seed.js`

```javascript
const db = require('./db');

const sampleRestaurants = [
  {
    name: 'ส้มตำนำ้อง',
    category: 'อาหารไทย',
    description: 'ร้านส้มตำอร่อยแบบดั้งเดิม',
    location: 'ตลาดนัดสวนจตุจักร',
    price_range: 1,
    phone: '02-123-4567',
    image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    open_hours: '10:00-20:00'
  },
  // TODO: เพิ่มข้อมูลร้านเพิ่มเติม
];

const sampleReviews = [
  {
    restaurantId: 1,
    userName: 'สมชาย ใจดี',
    rating: 5,
    comment: 'อร่อยมากครับ ส้มตำสดใหม่เสมอ',
    visitDate: '2024-10-01'
  },
  // TODO: เพิ่มข้อมูลรีวิวเพิ่มเติม
];

async function seed() {
  try {
    // INSERT restaurants
    for (let restaurant of sampleRestaurants) {
      await db.run(
        `INSERT INTO restaurants (name, category, description, location, price_range, phone, image_url, open_hours)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          restaurant.name,
          restaurant.category,
          restaurant.description,
          restaurant.location,
          restaurant.price_range,
          restaurant.phone,
          restaurant.image_url,
          restaurant.open_hours
        ]
      );
    }

    // INSERT reviews
    for (let review of sampleReviews) {
      await db.run(
        `INSERT INTO reviews (restaurant_id, user_name, rating, comment, visit_date)
         VALUES (?, ?, ?, ?, ?)`,
        [
          review.restaurantId,
          review.userName,
          review.rating,
          review.comment,
          review.visitDate
        ]
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
```

---

## Frontend Starter Code

### `frontend/package.json`

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

### `frontend/src/services/api.js`

```javascript
const API_URL = 'http://localhost:3000/api';

// TODO: ทำให้ครบ 50% - ต้อง implement สำหรับ students
export const getRestaurants = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/restaurants?${query}`);
    
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getRestaurantById = async (id) => {
  try {
    // TODO: implement
    const response = await fetch(`${API_URL}/restaurants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getReviewsByRestaurant = async (restaurantId) => {
  try {
    // TODO: implement
    const response = await fetch(`${API_URL}/reviews/${restaurantId}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const addReview = async (reviewData) => {
  try {
    // TODO: implement POST
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add review');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    // TODO: implement
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### `frontend/src/components/RestaurantList.jsx`

```javascript
import { useState, useEffect, useCallback } from 'react';
import RestaurantCard from './RestaurantCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { getRestaurants } from '../services/api';

function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minRating: '',
    priceRange: ''
  });

  // TODO: ใส่ useEffect เพื่อเรียก fetchRestaurants เมื่อ filters เปลี่ยน
  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: เรียก API
      const result = await getRestaurants(filters);
      setRestaurants(result.data);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลร้านได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div className="restaurant-list-container">
      <SearchBar onSearch={handleSearch} />
      <FilterPanel onFilterChange={handleFilterChange} filters={filters} />

      {loading && <div className="loading">กำลังโหลด...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {restaurants.length === 0 ? (
            <p className="no-results">ไม่พบร้านอาหารที่ค้นหา</p>
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

### `frontend/src/components/SearchBar.jsx`

```javascript
import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: ใส่ debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
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

### `frontend/src/components/RestaurantCard.jsx`

```javascript
function RestaurantCard({ restaurant, onClick }) {
  const getPriceDisplay = (range) => {
    return '฿'.repeat(range);
  };

  return (
    <div className="restaurant-card" onClick={() => onClick(restaurant.id)}>
      <img src={restaurant.image_url} alt={restaurant.name} />
      <div className="card-content">
        <h3>{restaurant.name}</h3>
        <p className="category">{restaurant.category}</p>
        <p className="description">{restaurant.description}</p>
        <div className="card-footer">
          <span className="rating">⭐ {restaurant.averageRating || 0}</span>
          <span className="price">{getPriceDisplay(restaurant.price_range)}</span>
          <span className="reviews">{restaurant.totalReviews || 0} รีวิว</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
```

### `frontend/src/components/RestaurantDetail.jsx`

```javascript
import { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { getRestaurantById } from '../services/api';

function RestaurantDetail({ restaurantId, onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      // TODO: เรียก getRestaurantById
      const result = await getRestaurantById(restaurantId);
      setRestaurant(result.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    fetchRestaurant();
  };

  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (!restaurant) return <div className="error">ไม่พบร้านอาหาร</div>;

  return (
    <div className="restaurant-detail">
      <button className="back-button" onClick={onBack}>
        ← กลับ
      </button>

      <div className="detail-header">
        <img src={restaurant.image_url} alt={restaurant.name} />
        <div className="detail-info">
          <h1>{restaurant.name}</h1>
          <p className="category">{restaurant.category}</p>
          <p className="description">{restaurant.description}</p>
          <div className="info-row">
            <span>📍 {restaurant.location}</span>
            <span>📞 {restaurant.phone}</span>
            <span>🕐 {restaurant.open_hours}</span>
          </div>
          <div className="rating-info">
            <span className="rating">
              ⭐ {restaurant.averageRating || 0}
            </span>
            <span className="price">
              {'฿'.repeat(restaurant.price_range)}
            </span>
            <span className="total-reviews">
              ({restaurant.totalReviews} รีวิว)
            </span>
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

### `frontend/src/components/ReviewForm.jsx`

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

    // TODO: ทำการ validation ครบถ้วน
    if (!formData.userName.trim()) {
      newErrors.userName = 'กรุณาใส่ชื่อ';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (formData.userName.trim().length > 50) {
      newErrors.userName = 'ชื่อต้องไม่เกิน 50 ตัวอักษร';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'กรุณาใส่ความเห็น';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'ความเห็นต้องมีอย่างน้อย 10 ตัวอักษร';
    } else if (formData.comment.trim().length > 500) {
      newErrors.comment = 'ความเห็นต้องไม่เกิน 500 ตัวอักษร';
    }

    const rating = parseInt(formData.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      newErrors.rating = 'คะแนนต้องอยู่ระหว่าง 1-5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // TODO: เรียก addReview API
      const result = await addReview({
        restaurantId,
        ...formData,
        rating: parseInt(formData.rating)
      });

      if (result.success) {
        alert('เพิ่มรีวิวสำเร็จ');
        setFormData({
          userName: '',
          rating: 5,
          comment: '',
          visitDate: new Date().toISOString().split('T')[0]
        });
        setErrors({});
        
        if (onReviewAdded) {
          onReviewAdded();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
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
            placeholder="ใส่ชื่อของคุณ"
            className={errors.userName ? 'invalid' : ''}
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>

        <div className="form-group">
          <label>คะแนน *</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: e.target.value})}
            className={errors.rating ? 'invalid' : ''}
          >
            <option value="5">⭐⭐⭐⭐⭐ ดีเยี่ยม</option>
            <option value="4">⭐⭐⭐⭐ ดี</option>
            <option value="3">⭐⭐⭐ ปานกลาง</option>
            <option value="2">⭐⭐ พอใช้</option>
            <option value="1">⭐ ต้องปรับปรุง</option>
          </select>
          {errors.rating && <span className="error">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label>ความเห็น *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            placeholder="เล่าประสบการณ์ของคุณ... (อย่างน้อย 10 ตัวอักษร)"
            rows="4"
            className={errors.comment ? 'invalid' : ''}
          />
          <div className="char-count">
            {formData.comment.length}/500 ตัวอักษร
          </div>
          {errors.comment && <span className="error">{errors.comment}</span>}
        </div>

        <div className="form-group">
          <label>วันที่เข้ามา</label>
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

### `frontend/src/components/ReviewList.jsx`

```javascript
function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="no-reviews">ยังไม่มีรีวิว</p>;
  }

  return (
    <div className="review-list">
      <h3>รีวิว ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <span className="reviewer-name">{review.user_name}</span>
            <span className="review-rating">
              {'⭐'.repeat(review.rating)}
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
          <p className="review-date">
            วันที่เข้าชิม: {new Date(review.visit_date).toLocaleDateString('th-TH')}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
```

### `frontend/src/components/FilterPanel.jsx`

```javascript
function FilterPanel({ onFilterChange, filters }) {
  const categories = [
    'ทั้งหมด',
    'อาหารไทย',
    'อาหารตะวันตก',
    'อาหารญี่ปุ่น',
    'ฟาสต์ฟู้ด'
  ];

  const handleCategoryChange = (category) => {
    onFilterChange({
      category: category === 'ทั้งหมด' ? '' : category
    });
  };

  const handleMinRatingChange = (rating) => {
    onFilterChange({ minRating: rating || '' });
  };

  const handlePriceChange = (price) => {
    onFilterChange({ priceRange: price || '' });
  };

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

      <div className="filter-group">
        <label>คะแนนขั้นต่ำ:</label>
        <select
          value={filters.minRating || ''}
          onChange={(e) => handleMinRatingChange(e.target.value)}
        >
          <option value="">ทั้งหมด</option>
          <option value="3">3 ดาวขึ้นไป</option>
          <option value="4">4 ดาวขึ้นไป</option>
          <option value="5">5 ดาว</option>
        </select>
      </div>

      <div className="filter-group">
        <label>ช่วงราคา:</label>
        <select
          value={filters.priceRange || ''}
          onChange={(e) => handlePriceChange(e.target.value)}
        >
          <option value="">ทั้งหมด</option>
          <option value="1">฿ (ถูก)</option>
          <option value="2">฿฿ (ปานกลาง)</option>
          <option value="3">฿฿฿ (แพง)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterPanel;
```

### `frontend/src/App.jsx`

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
        <h1>🍽️ Restaurant Review</h1>
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
        <p>&copy; 2024 Restaurant Review System</p>
      </footer>
    </div>
  );
}

export default App;
```

### `frontend/src/main.jsx`

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

### `frontend/index.html`

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restaurant Review System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `frontend/vite.config.js`

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

### `frontend/src/App.css`

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
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

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
  font-size: 14px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #d1d5db;
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
}

.search-button:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
  white-space: nowrap;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

/* Restaurant Grid */
.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
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
}

.category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
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
  font-size: 0.9rem;
}

.rating {
  color: #f59e0b;
  font-weight: 600;
}

.price {
  color: #10b981;
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
  font-weight: 600;
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
}

.rating-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.2rem;
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
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.invalid,
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

.form-group .error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
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
  transition: all 0.3s ease;
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
  font-weight: 600;
}

.reviewer-name {
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
  color: #888;
  font-size: 0.875rem;
}

/* Loading & Error */
.loading,
.error,
.no-results,
.no-reviews {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #ef4444;
  background: #fef2f2;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.no-reviews {
  color: #999;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
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

  .app-header h1 {
    font-size: 1.8rem;
  }
}
```

### `backend/.env.example`

```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./db/restaurant.db
```

### `backend/.gitignore`

```
node_modules/
.env
.env.local
*.db
logs/
*.log
.DS_Store
.vscode/
```

### `frontend/.gitignore`

```
node_modules/
dist/
.env
.env.local
.DS_Store
.vscode/
*.swp
```

---
