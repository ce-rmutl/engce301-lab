# Restaurant Review System - Final Exam

## Project Overview

ระบบรีวิวร้านอาหารแบบ Fullstack โดยใช้ SQLite, Express.js, และ React.js

## Technology Stack

- **Frontend:** React 18, Vite, CSS3
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **API:** REST API

### [Code Template](final-template.md) <- อยู่ที่นี่ 

## Installation 

### Backend Setup

```bash
cd backend
npm install
npm run init-db    # เตรียมฐานข้อมูล
npm run dev        # รัน server
```

Server จะ run ที่ http://localhost:3000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        # รัน development server
```

App จะ open ที่ http://localhost:5173

## API Endpoints

### Restaurants

- `GET /api/restaurants` - ดึงรายการร้านทั้งหมด (รองรับ filter)
- `GET /api/restaurants/:id` - ดึงรายละเอียดร้าน + reviews
- `GET /api/restaurants/category/:category` - ดึงร้านตามหมวดหมู่

### Reviews

- `GET /api/reviews/:restaurantId` - ดึงรีวิวของร้าน
- `POST /api/reviews` - เพิ่มรีวิวใหม่

### Stats

- `GET /api/stats` - ดึงสถิติระบบ

## Query Parameters (Filtering)

### GET /api/restaurants

```
?search=ชื่อร้าน          # ค้นหาตามชื่อหรือคำอธิบาย
?category=อาหารไทย       # กรองตามหมวดหมู่
?minRating=4            # กรองตามคะแนนขั้นต่ำ
?priceRange=1           # กรองตามช่วงราคา (1-3)
```

### ตัวอย่าง

```
http://localhost:3000/api/restaurants?search=พิซซ่า&priceRange=2
```

## Features

### Required Features (70%)
- ✓ SQLite database + schema
- ✓ API endpoints (GET restaurants, POST reviews)
- ✓ Frontend components
- ✓ Search & filter functionality
- ✓ Input validation
- ✓ Error handling
- ✓ Loading states

### Bonus Features (15%)
- ✓ POST /api/restaurants (เพิ่มร้านใหม่)
- ✓ Category filtering
- ✓ Statistics API
- ✓ Responsive design

## Scoring Rubric

| Component | Points | Status |
|-----------|--------|--------|
| Database Schema | 10 | ✓ |
| API Endpoints | 25 | ✓ |
| Frontend Components | 15 | ✓ |
| Integration | 10 | ✓ |
| Code Organization | 5 | ✓ |
| Code Quality | 5 | ✓ |
| Comments & Docs | 5 | ✓ |
| Bonus Features | 15 | ✓ |
| **TOTAL** | **100** | ✓ |

## Testing the API

### Using curl

```bash
# ดึงร้านทั้งหมด
curl http://localhost:3000/api/restaurants

# ดึงรายละเอียดร้าน ID 1
curl http://localhost:3000/api/restaurants/1

# ค้นหาร้านพิซซ่า
curl "http://localhost:3000/api/restaurants?search=พิซซ่า"

# เพิ่มรีวิว
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "userName": "สมชาย ใจดี",
    "rating": 5,
    "comment": "อร่อยมากครับ ส้มตำสดใหม่เสมอ"
  }'

# ดึงสถิติ
curl http://localhost:3000/api/stats
```

## Project Structure

```
restaurant-review-system/
├── backend/
│   ├── db/
│   │   ├── init.sql
│   │   ├── db.js
│   │   ├── seed.js
│   │   └── restaurant.db
│   ├── routes/
│   │   ├── restaurants.js
│   │   └── reviews.js
│   ├── middleware/
│   │   └── validation.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RestaurantList.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   ├── RestaurantDetail.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ReviewList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Time Allocation (2 hours)

| Phase | Time | Tasks |
|-------|------|-------|
| Setup | 10 min | npm install, database init |
| Backend | 40 min | API endpoints, validation, database queries |
| Frontend | 45 min | Components, API integration, UI |
| Testing | 25 min | Test endpoints, verify integration |

## Evaluation Criteria

### Functionality (50%)
- API endpoints work correctly
- Database queries return expected results
- Frontend displays data properly
- Form validation works
- Error handling is implemented

### Code Quality (30%)
- Code is organized and readable
- Error handling is comprehensive
- Comments are meaningful
- No console.log debugging code

### Bonus Features (20%)
- Additional API endpoints
- Advanced filtering
- UI polish
- Responsive design

## Common Issues & Solutions

### Issue: CORS Error

```
Access to fetch has been blocked by CORS policy
```

**Solution:** Make sure `cors()` middleware is enabled in server.js

```javascript
app.use(cors());
```

### Issue: Database Not Found

```
Error: Cannot open database
```

**Solution:** Run `npm run init-db` first

### Issue: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** 
```bash
lsof -i :3000          # Find process
kill -9 <PID>          # Kill process
# or use different port
PORT=3001 npm run dev
```

### Issue: API Returns Empty Array

**Solution:** Make sure seed data has been inserted
```bash
npm run init-db
```

## Submission Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] All 4 required API endpoints work
- [ ] Database queries return correct data
- [ ] Frontend displays restaurants correctly
- [ ] Search & filter functionality works
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] Code is organized in proper folders
- [ ] Comments explain complex logic
- [ ] .gitignore excludes node_modules and .env

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Tips for Success

1. **Start with backend** - Ensure API works first before frontend
2. **Test with curl** - Verify API endpoints work before connecting frontend
3. **Use console.error()** - Debug API errors in browser console
4. **Check database** - Verify data is in database using sqlite3 CLI
5. **Commit often** - Save progress to git regularly
6. **Read error messages** - They usually tell you what's wrong

## Good Luck!

ทำให้จบในเวลา 2 ชั่วโมง ติดตามเกณฑ์การให้คะแนนด้านบน