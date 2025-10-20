# วันที่ 5: การเชื่อมต่อ Frontend-Backend และความปลอดภัย

## ส่วนที่ 1: การเชื่อมต่อ React กับ Express API (18 slides)

---

## Slide 1: หน้าปก
**หัวข้อ:** การเชื่อมต่อ Frontend-Backend

**รายละเอียด:**
- **หัวข้อหลัก:** React + Express API Integration
- **วันที่ 5:** Fullstack Development
- **เวลา:** 3 ชั่วโมง (09:00-12:00)
- **เป้าหมาย:** เชื่อมต่อ Frontend กับ Backend ได้สำเร็จ

**Design Note:** ใช้ gradient สีม่วง-น้ำเงิน พร้อมไอคอน React และ Node.js

---

## Slide 2: วิวัฒนาการของ Web Architecture

**หัวข้อ:** จาก Monolithic สู่ Modern Web Application

### 🏛️ สมัยก่อน: Monolithic Application

**ลักษณะ:**
- ทุกอย่างรวมกันในที่เดียว (HTML + CSS + JavaScript + Backend)
- Server ทำทั้ง render HTML และจัดการข้อมูล
- User ขอหน้าเว็บ → Server render HTML ส่งกลับมาทั้งหน้า

**ตัวอย่างเทคโนโลยี:**
- PHP (with HTML embedded)
- JSP (Java Server Pages)
- ASP.NET Web Forms
- Ruby on Rails (traditional)

**ข้อดี:**
- ✅ ง่ายต่อการเริ่มต้น
- ✅ Deploy ง่าย (ไฟล์เดียว)
- ✅ SEO ดีเพราะ Server render

**ข้อเสีย:**
- ❌ แก้ไขยาก (Frontend-Backend ติดกัน)
- ❌ ขยายยาก (Scale ได้ยาก)
- ❌ ทีม Frontend-Backend ทำงานร่วมกันยาก
- ❌ User Experience ไม่ smooth (Reload ทั้งหน้า)

---

## Slide 3: Modern Web Architecture

**หัวข้อ:** การแยก Frontend และ Backend

### 🎯 ปัจจุบัน: Separation of Concerns

**แนวคิด:**
- **แยก Frontend และ Backend ออกจากกัน**
- สื่อสารผ่าน API (Application Programming Interface)
- แต่ละส่วนพัฒนาและ Deploy แยกกันได้

**โครงสร้าง:**
```
Frontend (React)  ←→  API  ←→  Backend (Express)  ←→  Database
   ใน Browser              HTTP              ใน Server
```

**ข้อดี:**
- ✅ แยกพัฒนาได้อิสระ (Frontend ไม่ต้องรอ Backend)
- ✅ Scale แยกกันได้ (Frontend และ Backend แยก Server)
- ✅ ใช้ API ซ้ำได้ (Mobile App, Desktop App ใช้ API เดียวกัน)
- ✅ User Experience ดีขึ้น (Single Page Application)
- ✅ ทีม Frontend-Backend ทำงานแยกกันได้

**คำถาม:** แล้วเราจะเชื่อมต่อกันยังไง? 🤔

---

## Slide 4: N-Tier Architecture

**หัวข้อ:** สถาปัตยกรรมแบบแบ่งชั้นงาน

### 📐 N-Tier คืออะไร?

**คำจำกัดความ:**
- การแบ่งระบบออกเป็น **หลายชั้น (Tiers/Layers)**
- แต่ละชั้นมีหน้าที่รับผิดชอบเฉพาะ (Separation of Concerns)
- ชั้นหนึ่งสื่อสารกับอีกชั้นผ่าน Interface ที่ชัดเจน

**ทำไมต้องแบ่งชั้น?**
- 🎯 แยกความรับผิดชอบชัดเจน
- 🔧 ง่ายต่อการดูแลและแก้ไข
- 📈 Scale ได้ง่าย
- 👥 ทีมทำงานร่วมกันได้ดี
- 🔒 เพิ่มความปลอดภัย

---

## Slide 5: 3-Tier Architecture (ที่เราใช้)

**หัวข้อ:** โครงสร้าง 3 ชั้นสำหรับ Web Application

### 🏗️ สามชั้นหลัก:

**1️⃣ Presentation Layer (Frontend)**
- **เทคโนโลยี:** React, HTML, CSS, JavaScript
- **ที่รัน:** Browser (Client-Side)
- **หน้าที่:**
  - แสดงผล UI/UX
  - รับ Input จากผู้ใช้
  - แสดงข้อมูลที่ได้จาก Backend
- **ไม่ควรทำ:** Business Logic, เข้าถึง Database โดยตรง

**2️⃣ Application Layer (Backend API)**
- **เทคโนโลยี:** Node.js + Express.js
- **ที่รัน:** Server
- **หน้าที่:**
  - จัดการ Business Logic
  - Validate ข้อมูล
  - Authentication/Authorization
  - เชื่อมต่อกับ Database
  - ส่งข้อมูลกลับเป็น JSON
- **ไม่ควรทำ:** Render HTML, จัดการ UI

**3️⃣ Data Layer (Database)**
- **เทคโนโลยี:** JSON Files, MongoDB, PostgreSQL, MySQL
- **ที่รัน:** Server (หรือ Cloud)
- **หน้าที่:**
  - เก็บข้อมูลถาวร (Persistent Storage)
  - Query ข้อมูล
  - Transaction Management

---

## Slide 6: Data Flow ในระบบ

**หัวข้อ:** ข้อมูลไหลผ่านระบบอย่างไร?

### 📊 การไหลของข้อมูล (สำหรับ GET Data):

```
1. User คลิกปุ่ม "ดูรายการอาหาร" บน React
           ↓
2. React ส่ง HTTP GET /api/foods
           ↓
3. Express รับ Request และประมวลผล
           ↓
4. Express อ่านข้อมูลจาก foods.json
           ↓
5. Express ส่งข้อมูลกลับเป็น JSON
           ↓
6. React รับข้อมูลและแสดงผล
           ↓
7. User เห็นรายการอาหารบนหน้าจอ
```

### 📝 การไหลของข้อมูล (สำหรับ POST Data):

```
1. User กรอก Form "เพิ่มรีวิว" บน React
           ↓
2. React ส่ง HTTP POST /api/reviews พร้อมข้อมูล
           ↓
3. Express รับข้อมูลและ Validate
           ↓
4. Express บันทึกลง reviews.json
           ↓
5. Express ส่ง Response สำเร็จกลับมา
           ↓
6. React แสดงข้อความ "บันทึกสำเร็จ"
```

**Key Point:** Frontend และ Backend ไม่ได้คุยกันโดยตรง แต่ผ่าน HTTP Protocol

---

## Slide 7: ภาพรวมการทำงานของ Fullstack Application

**หัวข้อ:** เชื่อมต่อทุก Layer เข้าด้วยกัน

### 🎨 Diagram: Restaurant Review App

```
┌─────────────────────────────────────┐
│     Browser (Presentation)          │
│  ┌───────────────────────────────┐  │
│  │      React Application        │  │
│  │  • RestaurantList Component   │  │
│  │  • ReviewForm Component       │  │
│  │  • SearchBar Component        │  │
│  └───────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │ HTTP (fetch API)
                  │ GET /api/restaurants
                  │ POST /api/reviews
                  ↓
┌─────────────────────────────────────┐
│      Server (Application)           │
│  ┌───────────────────────────────┐  │
│  │     Express.js Server         │  │
│  │  • Restaurant Routes          │  │
│  │  • Review Routes              │  │
│  │  • Validation Middleware      │  │
│  └───────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │ File System (fs)
                  │ Read/Write
                  ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│  ┌───────────────────────────────┐  │
│  │      JSON Files               │  │
│  │  • restaurants.json           │  │
│  │  • reviews.json               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**สิ่งที่จะเรียนรู้วันนี้:** การเชื่อมต่อระหว่าง React ↔ Express

---

## Slide 8: HTTP Methods พื้นฐาน

**หัวข้อ:** ภาษาที่ Frontend-Backend ใช้คุยกัน

### 🌐 HTTP Methods (Verbs)

**GET - ขอดูข้อมูล**
- ใช้เมื่อ: ต้องการดึงข้อมูลมาแสดง
- ตัวอย่าง: ดูรายการร้านอาหาร, ดูรีวิว
- Request: ไม่มี Body
- Response: ข้อมูลเป็น JSON

```javascript
GET /api/restaurants
GET /api/restaurants/1
GET /api/reviews?restaurantId=1
```

**POST - สร้างข้อมูลใหม่**
- ใช้เมื่อ: ต้องการเพิ่มข้อมูลใหม่
- ตัวอย่าง: เพิ่มรีวิวใหม่, สร้างร้านใหม่
- Request: มี Body (ข้อมูลที่จะส่ง)
- Response: ข้อมูลที่สร้างเสร็จแล้ว

```javascript
POST /api/reviews
Body: { rating: 5, comment: "อร่อยมาก!" }
```

**PUT - แก้ไขข้อมูลทั้งหมด**
- ใช้เมื่อ: ต้องการอัพเดทข้อมูลทั้ง object
- ตัวอย่าง: แก้ไขข้อมูลร้านทั้งหมด

```javascript
PUT /api/restaurants/1
Body: { name: "...", category: "...", ... }
```

**DELETE - ลบข้อมูล**
- ใช้เมื่อ: ต้องการลบข้อมูล
- ตัวอย่าง: ลบรีวิว, ลบร้าน

```javascript
DELETE /api/reviews/5
```

**คำถาม:** แล้ว React จะเรียกใช้ HTTP Methods เหล่านี้ยังไง? 🤔

---

## Slide 9: fetch() API คืออะไร?

**หัวข้อ:** เครื่องมือสำหรับเรียก API ใน JavaScript

### 🎣 fetch() API

**คำจำกัดความ:**
- JavaScript function สำหรับส่ง HTTP Requests
- Built-in ใน Browser (ไม่ต้อง install)
- ใช้แทน XMLHttpRequest แบบเก่า
- Return เป็น Promise

**ทำไมต้องใช้ fetch()?**
- ✅ เขียนง่าย อ่านง่าย
- ✅ รองรับ async/await
- ✅ ทำงานกับ JSON ได้ดี
- ✅ Modern และเป็นมาตรฐาน

**Syntax พื้นฐาน:**
```javascript
fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

**ส่วนประกอบ:**
- **url:** API endpoint ที่จะเรียก
- **options:** configuration (method, headers, body)
- **Promise:** จัดการผลลัพธ์แบบ asynchronous

---

## Slide 10: โครงสร้างของ fetch()

**หัวข้อ:** Anatomy of fetch() Request

### 📦 รูปแบบการใช้งาน

**1. Basic GET Request (แบบง่าย)**
```javascript
fetch('http://localhost:3000/api/restaurants')
  .then(response => response.json())
  .then(data => {
    console.log(data); // ข้อมูลร้านอาหาร
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

**2. GET Request (แบบ async/await)**
```javascript
async function getRestaurants() {
  try {
    const response = await fetch('http://localhost:3000/api/restaurants');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**3. POST Request (ส่งข้อมูล)**
```javascript
async function addReview(reviewData) {
  try {
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Key Concepts:**
- `response.json()` แปลง JSON string → JavaScript object
- `JSON.stringify()` แปลง JavaScript object → JSON string
- `headers` บอกว่าเราส่งข้อมูลประเภทไหน

---

## Slide 11: ตัวอย่างการใช้ fetch() GET

**หัวข้อ:** ดึงข้อมูลมาแสดงใน React

### 📥 GET Request ใน React Component

**โค้ดตัวอย่าง:**
```javascript
import { useState, useEffect } from 'react';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.category}</p>
        </div>
      ))}
    </div>
  );
}
```

**อธิบาย:**
- `useEffect()` เรียก API ตอน Component mount
- `useState()` เก็บข้อมูลที่ได้จาก API
- `async/await` จัดการ asynchronous operation
- แสดง loading ขณะรอข้อมูล

---

## Slide 12: ตัวอย่างการใช้ fetch() POST

**หัวข้อ:** ส่งข้อมูลไปบันทึกที่ Backend

### 📤 POST Request ใน React Component

**โค้ดตัวอย่าง:**
```javascript
import { useState } from 'react';

function ReviewForm({ restaurantId }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurantId: restaurantId,
          ...formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('บันทึกรีวิวสำเร็จ!');
        setFormData({ rating: 5, comment: '' }); // Clear form
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('ไม่สามารถเชื่อมต่อกับ Server');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        value={formData.rating}
        onChange={(e) => setFormData({...formData, rating: e.target.value})}
        min="1" max="5"
      />
      <textarea 
        value={formData.comment}
        onChange={(e) => setFormData({...formData, comment: e.target.value})}
      />
      <button type="submit">ส่งรีวิว</button>
    </form>
  );
}
```

**Key Points:**
- ใช้ `method: 'POST'` บอกว่าจะส่งข้อมูล
- `headers` บอกว่าส่ง JSON
- `body` คือข้อมูลที่จะส่ง (ต้อง stringify)
- เช็ค `response.ok` ว่าสำเร็จไหม

---

## Slide 13: useState & useEffect สำหรับ API Calls

**หัวข้อ:** React Hooks ที่ใช้กับ API

### 🎣 React Hooks for Data Fetching

**1. useState - เก็บข้อมูลและสถานะ**
```javascript
const [data, setData] = useState([]);           // ข้อมูลจาก API
const [loading, setLoading] = useState(true);   // สถานะการโหลด
const [error, setError] = useState(null);       // Error message
```

**2. useEffect - เรียก API เมื่อ Component Mount**
```javascript
useEffect(() => {
  fetchData();
}, []); // [] = รันครั้งเดียวตอน mount
```

**Pattern ที่ใช้บ่อย:**
```javascript
function DataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('API_URL');
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency array ว่าง = รันครั้งเดียว

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  return <DataDisplay data={data} />;
}
```

**Best Practices:**
- เช็คสถานะทั้ง 3 แบบ: loading, error, success
- ใช้ `finally` เพื่อ set loading = false เสมอ
- เก็บ error message เพื่อแสดงให้ user

---

## Slide 14: Loading States และการแสดงผล

**หัวข้อ:** จัดการสถานะการโหลดข้อมูล

### ⏳ 3 สถานะหลักของการเรียก API

**1. Loading State (กำลังโหลด)**
```javascript
if (loading) {
  return (
    <div className="loading">
      <span>กำลังโหลดข้อมูล...</span>
      {/* หรือใช้ Spinner Component */}
    </div>
  );
}
```

**2. Error State (เกิดข้อผิดพลาด)**
```javascript
if (error) {
  return (
    <div className="error">
      <p>เกิดข้อผิดพลาด: {error}</p>
      <button onClick={retry}>ลองใหม่</button>
    </div>
  );
}
```

**3. Success State (โหลดสำเร็จ)**
```javascript
return (
  <div className="data-container">
    {data.map(item => (
      <ItemCard key={item.id} data={item} />
    ))}
  </div>
);
```

**ตัวอย่างแบบเต็ม:**
```javascript
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/restaurants');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Conditional Rendering
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} retry={fetchRestaurants} />;
  if (restaurants.length === 0) return <EmptyState />;

  return (
    <div className="restaurant-grid">
      {restaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id} data={restaurant} />
      ))}
    </div>
  );
}
```

**ทำไมต้องจัดการทั้ง 3 สถานะ?**
- ✅ UX ดีขึ้น (User รู้ว่าเกิดอะไรขึ้น)
- ✅ ป้องกัน errors
- ✅ Professional

---

## Slide 15: Error Handling

**หัวข้อ:** จัดการข้อผิดพลาดอย่างถูกต้อง

### ⚠️ Error Handling Best Practices

**1. Network Errors (ไม่สามารถเชื่อมต่อ Server)**
```javascript
try {
  const response = await fetch('/api/data');
  // ...
} catch (error) {
  // จับ Network Error
  if (error.message === 'Failed to fetch') {
    setError('ไม่สามารถเชื่อมต่อกับ Server กรุณาเช็คการเชื่อมต่ออินเทอร์เน็ต');
  }
}
```

**2. HTTP Errors (Server ตอบกลับมาแต่มี error)**
```javascript
const response = await fetch('/api/data');

if (!response.ok) {
  // 404, 500, etc.
  if (response.status === 404) {
    throw new Error('ไม่พบข้อมูล');
  } else if (response.status === 500) {
    throw new Error('เกิดข้อผิดพลาดที่ Server');
  } else {
    throw new Error(`Error: ${response.status}`);
  }
}
```

**3. Data Validation Errors (ข้อมูลไม่ถูกต้อง)**
```javascript
const data = await response.json();

if (!data || !Array.isArray(data)) {
  throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
}
```

**ตัวอย่างการจัดการ Error แบบเต็ม:**
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch('/api/restaurants');
    
    // เช็ค HTTP Status
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('ไม่พบข้อมูลร้านอาหาร');
      }
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    
    // เช็ค Data Structure
    if (!data.success) {
      throw new Error(data.message || 'เกิดข้อผิดพลาด');
    }
    
    setRestaurants(data.data);
    
  } catch (error) {
    console.error('Fetch Error:', error);
    
    // แสดง Error Message ที่เหมาะสม
    if (error.message === 'Failed to fetch') {
      setError('ไม่สามารถเชื่อมต่อ Server กรุณาลองใหม่อีกครั้ง');
    } else {
      setError(error.message);
    }
  } finally {
    setLoading(false);
  }
};
```

**สิ่งที่ควรทำ:**
- ✅ เช็ค `response.ok` เสมอ
- ✅ แสดง error message ที่เข้าใจง่าย
- ✅ Log error ใน console สำหรับ debug
- ✅ ให้ปุ่ม "ลองใหม่" กับ user

---

## Slide 16: CORS คืออะไร?

**หัวข้อ:** ปัญหาที่เจอบ่อยที่สุดใน Fullstack Development

### 🚫 CORS - Cross-Origin Resource Sharing

**สถานการณ์:**
```
Frontend (React):     http://localhost:5173
Backend (Express):    http://localhost:3000
```

**ปัญหา:**
```javascript
// ใน React
fetch('http://localhost:3000/api/restaurants')

// Error ใน Console:
// ❌ Access to fetch has been blocked by CORS policy
```

**CORS คืออะไร?**
- **ความปลอดภัยของ Browser**
- Browser ป้องกันไม่ให้ website หนึ่งเรียก API จาก website อื่น
- Default: Browser อนุญาตเฉพาะ same origin เท่านั้น

**Origin คืออะไร?**
```
Origin = Protocol + Domain + Port

http://localhost:5173  ← Origin 1 (React)
http://localhost:3000  ← Origin 2 (Express)

Different Port = Different Origin = CORS Error! ❌
```

**ทำไมถึงมี CORS?**
- ป้องกัน Malicious Websites จากการขโมยข้อมูล
- ป้องกัน Cross-Site Request Forgery (CSRF)
- เพิ่มความปลอดภัยให้ user

**คำถาม:** แล้วเราจะแก้ยังไง?

---

## Slide 17: ปัญหา CORS Error ที่พบบ่อย

**หัวข้อ:** รู้จักและแก้ไข CORS Error

### ⚠️ Error Messages ที่เจอบ่อย

**1. CORS Policy Error**
```
Access to fetch at 'http://localhost:3000/api/restaurants' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**แปลความหมาย:**
- Server ไม่อนุญาตให้ origin นี้เรียก API
- ขาด header `Access-Control-Allow-Origin`

**2. Preflight Request Failed**
```
Access to fetch has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check
```

**แปลความหมาย:**
- Browser ส่ง OPTIONS request เพื่อถาม permission ก่อน
- Server ไม่ตอบกลับอย่างถูกต้อง

**สัญญาณที่บอกว่าเป็น CORS Error:**
- เห็นคำว่า "CORS policy" ใน error message
- Network tab แสดง status (failed) หรือ status 0
- ใน Console เห็น red error message
- GET request ที่ผ่าน แต่ POST/PUT/DELETE ไม่ผ่าน

**ตัวอย่างสถานการณ์:**
```javascript
// ใน React (localhost:5173)
fetch('http://localhost:3000/api/restaurants')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Console แสดง:
// ❌ CORS Error!
// ข้อมูลไม่แสดง แม้ว่า API ทำงานได้จริง
```

**Demo:** แสดง Screenshot ของ CORS Error ใน Developer Console

---

## Slide 18: วิธีแก้ไข CORS ใน Express

**หัวข้อ:** เปิดให้ Frontend เรียก API ได้

### ✅ แก้ CORS ด้วย cors Middleware

**วิธีที่ 1: แก้แบบง่าย (เปิดให้ทุก Origin)**

```javascript
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// เปิด CORS ให้ทุก origin
app.use(cors());

app.get('/api/restaurants', (req, res) => {
  res.json({ message: 'CORS ทำงานแล้ว!' });
});

app.listen(3000);
```

**ติดตั้ง cors package:**
```bash
npm install cors
```

**วิธีที่ 2: แก้แบบระบุ Origin (ปลอดภัยกว่า)**

```javascript
const cors = require('cors');

// กำหนด origin ที่อนุญาต
const corsOptions = {
  origin: 'http://localhost:5173', // React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // ถ้าต้องการส่ง cookies
};

app.use(cors(corsOptions));
```

**วิธีที่ 3: แก้แบบ Manual (ไม่ต้องติดตั้ง package)**

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

**ทดสอบว่าแก้สำเร็จ:**
```javascript
// ใน React
fetch('http://localhost:3000/api/restaurants')
  .then(res => res.json())
  .then(data => console.log(data)); // ✅ ทำงานได้แล้ว!
```

---

## Slide 19: CORS Best Practices

**หัวข้อ:** การตั้งค่า CORS อย่างถูกต้องและปลอดภัย

### 🔒 แนวทางที่ดี

**Development vs Production**

**Development (ใช้ขณะพัฒนา):**
```javascript
// อนุญาตทุก origin - สะดวกต่อการ dev
app.use(cors());
```

**Production (ใช้จริง):**
```javascript
// ระบุ origin ที่อนุญาตเท่านั้น
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
```

**แบ่งตาม Environment:**
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://yourdomain.com']  // Production
  : ['http://localhost:5173', 'http://localhost:3000']; // Development

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
```

**สิ่งที่ควรระวัง:**
- ❌ อย่าใช้ `origin: '*'` ใน Production
- ❌ อย่าเปิด credentials กับ wildcard origin
- ✅ ระบุ methods ที่อนุญาตให้ชัดเจน
- ✅ ใช้ HTTPS ใน Production

**ตรวจสอบ CORS Headers:**
```javascript
// ใน Browser Developer Tools > Network Tab
// ดู Response Headers:
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

---

## Slide 20: Mini Workshop - เชื่อมต่อ React กับ Express

**หัวข้อ:** ลงมือทำจริง - Food API จาก Lab 4.2

### 🛠️ Workshop: ดึงข้อมูลอาหารมาแสดงใน React

**เป้าหมาย:**
- เรียก Food API ที่สร้างไว้ในวันที่ 4
- แสดงรายการอาหารใน React
- เพิ่ม Search และ Filter

**ขั้นตอน:**

**1. Setup Express Server (จาก Lab 4.2)**
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const foodRoutes = require('./routes/foods');

const app = express();

app.use(cors()); // เปิด CORS
app.use(express.json());
app.use('/api/foods', foodRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**2. สร้าง React Component**
```javascript
// FoodList.jsx
import { useState, useEffect } from 'react';

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/foods');
      
      if (!response.ok) {
        throw new Error('Failed to fetch foods');
      }
      
      const data = await response.json();
      setFoods(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="food-list">
      <h1>รายการอาหาร</h1>
      <div className="food-grid">
        {foods.map(food => (
          <div key={food.id} className="food-card">
            <h3>{food.name}</h3>
            <p>{food.category}</p>
            <p>ราคา: {food.price} บาท</p>
            <p>ระดับความเผ็ด: {'🌶️'.repeat(food.spicyLevel)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodList;
```

**3. เพิ่ม Search Feature**
```javascript
const [searchTerm, setSearchTerm] = useState('');

const fetchFoods = async () => {
  const url = searchTerm 
    ? `http://localhost:3000/api/foods?search=${searchTerm}`
    : 'http://localhost:3000/api/foods';
    
  const response = await fetch(url);
  // ... rest of the code
};

// ใน JSX
<input 
  type="text"
  placeholder="ค้นหาอาหาร..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
<button onClick={fetchFoods}>ค้นหา</button>
```

**4. ทดสอบ:**
- เปิด Express Server: `npm run dev`
- เปิด React App: `npm run dev`
- ดูรายการอาหารแสดงถูกต้อง
- ทดสอบค้นหา

**Challenge:**
- เพิ่ม Filter by Category
- เพิ่ม Filter by Vegetarian
- แสดง Loading Spinner
- จัดการ Error ให้สวยงาม

---

## Slide 21: คำถามท้าทาย

**หัวข้อ:** ทบทวนความเข้าใจ

### 🤔 คำถามสำหรับคิด

**1. ถ้า Backend รันที่ port 5000 และ Frontend รันที่ port 3000 จะเกิด CORS Error ไหม? ทำไม?**

<details>
<summary>คำตอบ</summary>
ใช่ เกิด CORS Error เพราะ port ต่างกัน = different origin
ต้องเปิด CORS ใน Backend
</details>

**2. ถ้าต้องการส่งข้อมูล review ที่มี rating และ comment ไปยัง Backend ควรใช้ HTTP Method อะไร?**

<details>
<summary>คำตอบ</summary>
ใช้ POST method เพราะเป็นการสร้างข้อมูลใหม่
</details>

**3. ถ้า API response ช้า user ควรเห็นอะไรบนหน้าจอ?**

<details>
<summary>คำตอบ</summary>
ควรแสดง Loading State (spinner หรือ skeleton) 
เพื่อให้ user รู้ว่าระบบกำลังทำงาน
</details>

**4. ถ้า fetch() ได้ status code 404 จะเข้า catch block ไหม?**

<details>
<summary>คำตอบ</summary>
ไม่เข้า เพราะ 404 ไม่ใช่ network error
ต้องเช็ค response.ok เอง
</details>

**5. ทำไมต้องใช้ useEffect ในการ fetch ข้อมูล?**

<details>
<summary>คำตอบ</summary>
เพื่อให้ fetch เมื่อ component mount เท่านั้น
ไม่งั้นจะ fetch ทุกครั้งที่ component re-render (infinite loop)
</details>

---

## Slide 22: สรุปส่วนที่ 1

**หัวข้อ:** Review สิ่งที่เรียนรู้

### ✅ สิ่งที่เราเรียนไปแล้ว

**1. Architecture Concepts**
- Monolithic vs Modern Web Architecture
- N-Tier Architecture (3 layers)
- Data Flow ระหว่าง Frontend-Backend

**2. HTTP Communication**
- HTTP Methods (GET, POST, PUT, DELETE)
- Request/Response Cycle
- Status Codes

**3. fetch() API**
- Syntax และการใช้งาน
- GET Request (ดึงข้อมูล)
- POST Request (ส่งข้อมูล)
- Error Handling

**4. React Integration**
- useState สำหรับเก็บข้อมูล
- useEffect สำหรับเรียก API
- Loading, Error, Success States
- Conditional Rendering

**5. CORS**
- CORS คืออะไรและทำไมถึงเกิด
- วิธีแก้ไข CORS Error
- Best Practices

### 🎯 ต่อไป: ความปลอดภัยเบื้องต้น

**หัวข้อที่จะเรียน:**
- Input Validation
- HTTPS
- Environment Variables
- Security Checklist

**พักเบรก 10-15 นาที** ☕

---

## สิ้นสุดส่วนที่ 1 (18 slides)

**เวลาที่ใช้:** ประมาณ 2.5-3 ชั่วโมง (รวม Workshop)

**Next Section:** ความปลอดภัยเว็บไซต์เบื้องต้น (8 slides)ต้องแบ่งชั้น?**
