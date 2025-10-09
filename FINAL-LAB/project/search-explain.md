# 🔍 ขั้นตอนการทำงานแบบละเอียด: Search Feature

## สถานการณ์: User พิมพ์ "ส้มตำ" ในช่องค้นหาและกดปุ่มค้นหา

---

## 📊 STEP-BY-STEP FLOW (ทีละขั้นตอน)

### **STEP 1: User พิมพ์ "ส้มตำ" ในช่อง Search**

**ตำแหน่ง:** `SearchBar.jsx`

```javascript
// User พิมพ์ตัวอักษรแต่ละตัว: ส → ้ → ม → ต → ำ

<input
  type="text"
  value={searchTerm}  // ค่าปัจจุบันที่แสดงในช่อง input
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="ค้นหาร้านอาหาร..."
/>
```

**การทำงาน:**

1. User พิมพ์ "ส"
   ```javascript
   onChange triggered
   e.target.value = "ส"
   setSearchTerm("ส")  // อัพเดท state
   searchTerm = "ส"    // state ใหม่
   ```

2. User พิมพ์ "้"
   ```javascript
   onChange triggered อีกครั้ง
   e.target.value = "ส้"
   setSearchTerm("ส้")
   searchTerm = "ส้"
   ```

3. User พิมพ์ "ม"
   ```javascript
   e.target.value = "ส้ม"
   setSearchTerm("ส้ม")
   searchTerm = "ส้ม"
   ```

4. User พิมพ์ "ต"
   ```javascript
   e.target.value = "ส้มต"
   setSearchTerm("ส้มต")
   searchTerm = "ส้มต"
   ```

5. User พิมพ์ "ำ"
   ```javascript
   e.target.value = "ส้มตำ"
   setSearchTerm("ส้มตำ")
   searchTerm = "ส้มตำ"  // ค่าสุดท้าย
   ```

**State ใน SearchBar:**
```javascript
const [searchTerm, setSearchTerm] = useState('');

// หลังพิมพ์เสร็จ:
searchTerm = "ส้มตำ"
```

---

### **STEP 2: Debounce Mechanism ทำงาน (ถ้ามี)**

**ตำแหน่ง:** `SearchBar.jsx`

```javascript
useEffect(() => {
  // รันทุกครั้งที่ searchTerm เปลี่ยน
  
  const timer = setTimeout(() => {
    // รอ 500ms แล้วค่อยเรียก onSearch
    if (searchTerm !== undefined) {
      onSearch(searchTerm);
    }
  }, 500);
  
  // Cleanup function: ยกเลิก timer เก่าถ้ามีการพิมพ์ต่อ
  return () => clearTimeout(timer);
}, [searchTerm, onSearch]);
```

**Timeline ของการพิมพ์:**

```
เวลา 0ms:   User พิมพ์ "ส"
            → searchTerm = "ส"
            → ตั้ง timer 500ms (Timer #1)

เวลา 200ms: User พิมพ์ "้"
            → searchTerm = "ส้"
            → cleanup: clearTimeout(Timer #1)  ← ยกเลิก
            → ตั้ง timer 500ms ใหม่ (Timer #2)

เวลา 400ms: User พิมพ์ "ม"
            → searchTerm = "ส้ม"
            → cleanup: clearTimeout(Timer #2)  ← ยกเลิก
            → ตั้ง timer 500ms ใหม่ (Timer #3)

เวลา 600ms: User พิมพ์ "ต"
            → searchTerm = "ส้มต"
            → cleanup: clearTimeout(Timer #3)  ← ยกเลิก
            → ตั้ง timer 500ms ใหม่ (Timer #4)

เวลา 800ms: User พิมพ์ "ำ"
            → searchTerm = "ส้มตำ"
            → cleanup: clearTimeout(Timer #4)  ← ยกเลิก
            → ตั้ง timer 500ms ใหม่ (Timer #5)

เวลา 1300ms: (800ms + 500ms)
             → Timer #5 หมดเวลา
             → เรียก onSearch("ส้มตำ")  ✓
```

**ผลลัพธ์:** เรียก API เพียง 1 ครั้ง แทนที่จะเป็น 5 ครั้ง

---

### **STEP 3: User กดปุ่มค้นหา (หรือกด Enter)**

**ตำแหน่ง:** `SearchBar.jsx`

```javascript
const handleSubmit = (e) => {
  e.preventDefault();  // ป้องกันการ reload หน้า
  onSearch(searchTerm); // เรียก onSearch ทันที (ไม่รอ debounce)
};

<form className="search-bar" onSubmit={handleSubmit}>
  {/* ... inputs ... */}
  <button type="submit">🔍 ค้นหา</button>
</form>
```

**การทำงาน:**

```javascript
// User กดปุ่ม "ค้นหา" หรือกด Enter
→ onSubmit event triggered
→ handleSubmit() ถูกเรียก
→ e.preventDefault() ทำงาน (ไม่ reload)
→ onSearch("ส้มตำ") ถูกเรียก
```

**ตัวแปรที่ส่ง:**
```javascript
searchTerm = "ส้มตำ"
onSearch("ส้มตำ")  // ส่งค่านี้ไปยัง parent component
```

---

### **STEP 4: onSearch() ถูกเรียก ใน RestaurantList**

**ตำแหน่ง:** `RestaurantList.jsx`

```javascript
// ฟังก์ชันที่ถูกส่งมาให้ SearchBar
const handleSearch = (searchTerm) => {
  setFilters({ ...filters, search: searchTerm });
};

<SearchBar onSearch={handleSearch} />
```

**การทำงาน:**

```javascript
// onSearch("ส้มตำ") ถูกเรียกจาก SearchBar
→ handleSearch("ส้มตำ") ทำงาน

// อัพเดท filters state
const oldFilters = {
  search: '',
  category: '',
  minRating: '',
  priceRange: ''
};

setFilters({ ...oldFilters, search: "ส้มตำ" });

// filters state ใหม่:
filters = {
  search: "ส้มตำ",     // ← เปลี่ยนจาก '' เป็น "ส้มตำ"
  category: '',
  minRating: '',
  priceRange: ''
}
```

**State ใน RestaurantList:**
```javascript
const [filters, setFilters] = useState({
  search: '',
  category: '',
  minRating: '',
  priceRange: ''
});

// หลังอัพเดท:
filters.search = "ส้มตำ"
```

---

### **STEP 5: useEffect Detect การเปลี่ยนแปลงของ filters**

**ตำแหน่ง:** `RestaurantList.jsx`

```javascript
useEffect(() => {
  fetchRestaurants();
}, [filters]);  // รันเมื่อ filters เปลี่ยน
```

**การทำงาน:**

```javascript
// React detect ว่า filters state เปลี่ยนแปลง
// (เพราะ search เปลี่ยนจาก '' เป็น "ส้มตำ")

→ useEffect callback ทำงาน
→ fetchRestaurants() ถูกเรียก
```

**Timeline:**
```
State เปลี่ยน: filters.search = "ส้มตำ"
     ↓
React Re-render Component
     ↓
React เช็ค useEffect dependencies [filters]
     ↓
filters เปลี่ยน! → รัน useEffect
     ↓
fetchRestaurants() ถูกเรียก
```

---

### **STEP 6: fetchRestaurants() เรียก API**

**ตำแหน่ง:** `RestaurantList.jsx`

```javascript
const fetchRestaurants = async () => {
  try {
    setLoading(true);     // แสดง loading
    setError(null);       // เคลียร์ error เก่า
    
    // เรียกฟังก์ชันจาก api.js
    const result = await getRestaurants(filters);
    
    setRestaurants(result.data);  // เก็บข้อมูลที่ได้
    
  } catch (err) {
    setError('ไม่สามารถโหลดข้อมูลได้');
  } finally {
    setLoading(false);   // ซ่อน loading
  }
};
```

**State Changes:**

```javascript
// ก่อนเรียก API:
loading = false
restaurants = [... 10 ร้าน ...]
error = null

// เริ่มเรียก API:
setLoading(true)
→ loading = true  // Component re-render แสดง "กำลังโหลด..."

// เรียก getRestaurants:
const result = await getRestaurants({
  search: "ส้มตำ",
  category: '',
  minRating: '',
  priceRange: ''
});
```

---

### **STEP 7: getRestaurants() สร้าง HTTP Request**

**ตำแหน่ง:** `services/api.js`

```javascript
export const getRestaurants = async (filters = {}) => {
  try {
    // สร้าง query string
    const queryParams = new URLSearchParams();
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    // ... ตรวจสอบ filters อื่นๆ
    
    const url = `${API_URL}/restaurants?${queryParams}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

**การทำงานละเอียด:**

```javascript
// 1. รับ filters object
filters = {
  search: "ส้มตำ",
  category: '',
  minRating: '',
  priceRange: ''
}

// 2. สร้าง URLSearchParams object
const queryParams = new URLSearchParams();

// 3. เช็คแต่ละ filter
if (filters.search) {  // "ส้มตำ" = truthy
  queryParams.append('search', "ส้มตำ");
}

if (filters.category) {  // '' = falsy → ข้าม
  // ไม่ทำงาน
}

if (filters.minRating) {  // '' = falsy → ข้าม
  // ไม่ทำงาน
}

if (filters.priceRange) {  // '' = falsy → ข้าม
  // ไม่ทำงาน
}

// 4. queryParams ตอนนี้มี:
queryParams.toString() = "search=%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3"
// (URL encoded ของ "ส้มตำ")

// 5. สร้าง URL สมบูรณ์
const API_URL = 'http://localhost:3000/api';
const url = `${API_URL}/restaurants?${queryParams}`;

// url = "http://localhost:3000/api/restaurants?search=%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3"
```

**ส่ง HTTP Request:**

```javascript
// 6. ส่ง GET request
const response = await fetch(url);

// Browser ส่ง HTTP request:
/*
GET /api/restaurants?search=%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3 HTTP/1.1
Host: localhost:3000
Accept: application/json
*/

// 7. รอ response จาก server
// (ไปที่ STEP 8)
```

---

### **STEP 8: Express Backend รับ Request**

**ตำแหน่ง:** `backend/routes/restaurants.js`

```javascript
router.get('/', async (req, res) => {
  try {
    let restaurants = await readJsonFile('restaurants.json');
    
    const { search, category, minRating, priceRange } = req.query;
    
    // ... filtering logic ...
    
    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
});
```

**การทำงานละเอียด:**

```javascript
// 1. Express ได้รับ request
req.url = "/api/restaurants?search=%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3"
req.method = "GET"

// 2. Express แปลง query string เป็น object
req.query = {
  search: "ส้มตำ"  // Express decode URL encoding อัตโนมัติ
}

// 3. Destructure ค่าจาก req.query
const { search, category, minRating, priceRange } = req.query;

// ผลลัพธ์:
search = "ส้มตำ"
category = undefined
minRating = undefined
priceRange = undefined
```

---

### **STEP 9: อ่านข้อมูลจาก JSON File**

**ตำแหน่ง:** `backend/utils/fileManager.js`

```javascript
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
```

**การทำงาน:**

```javascript
// 1. เรียก readJsonFile('restaurants.json')
const filePath = '/path/to/backend/data/restaurants.json';

// 2. อ่านไฟล์
const data = await fs.readFile(filePath, 'utf8');
// data = "[ { id: 1, name: 'ส้มตำนัวเข้านอ้ง', ... }, ... ]" (string)

// 3. แปลง JSON string เป็น JavaScript object/array
const restaurants = JSON.parse(data);

// restaurants = [
//   { id: 1, name: 'ส้มตำนัวเข้านอ้ง', category: 'อาหารไทย', ... },
//   { id: 2, name: 'ซูชิโตเกียว', category: 'อาหารญี่ปุ่น', ... },
//   { id: 3, name: 'พิซซ่าอิตาเลียน', category: 'อาหารอิตาเลียน', ... },
//   ... 7 ร้านอื่นๆ
// ]
```

**ตัวแปร restaurants:**
```javascript
restaurants = [
  {
    id: 1,
    name: "ส้มตำนัวเข้านอ้ง",
    category: "อาหารไทย",
    description: "ร้านส้มตำและอาหารอีสานแท้ๆ...",
    averageRating: 4.5,
    totalReviews: 12,
    ...
  },
  // ... อีก 9 ร้าน
]
```

---

### **STEP 10: Filtering ข้อมูล**

**ตำแหน่ง:** `backend/routes/restaurants.js`

```javascript
// ค่าที่มี:
let restaurants = [... 10 ร้าน ...];
search = "ส้มตำ"
category = undefined
minRating = undefined
priceRange = undefined

// 1. เช็ค search parameter
if (search) {  // "ส้มตำ" = truthy → ทำงาน
  const searchLower = search.toLowerCase();
  // searchLower = "ส้มตำ"
  
  restaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchLower) ||
    r.description.toLowerCase().includes(searchLower)
  );
}
```

**ขั้นตอนการ filter แต่ละร้าน:**

```javascript
// Array เดิม: 10 ร้าน

// ร้านที่ 1:
r = { id: 1, name: "ส้มตำนัวเข้านอ้ง", description: "ร้านส้มตำและอาหาร..." }
r.name.toLowerCase() = "ส้มตำนัวเข้านอ้ง"
"ส้มตำนัวเข้านอ้ง".includes("ส้มตำ") = true ✓
→ เก็บไว้

// ร้านที่ 2:
r = { id: 2, name: "ซูชิโตเกียว", description: "ร้านอาหารญี่ปุ่นต้นตำรับ..." }
r.name.toLowerCase() = "ซูชิโตเกียว"
"ซูชิโตเกียว".includes("ส้มตำ") = false
r.description.toLowerCase() = "ร้านอาหารญี่ปุ่น..."
"ร้านอาหารญี่ปุ่น...".includes("ส้มตำ") = false
→ ไม่เก็บ

// ร้านที่ 3:
r = { id: 3, name: "พิซซ่าอิตาเลียน", description: "พิซซ่าแท้..." }
"พิซซ่าอิตาเลียน".includes("ส้มตำ") = false
"พิซซ่าแท้...".includes("ส้มตำ") = false
→ ไม่เก็บ

// ร้านที่ 4:
r = { id: 4, name: "ก๋วยเตี๋ยวเรือพี่ดี", description: "..." }
ไม่มี "ส้มตำ"
→ ไม่เก็บ

// ร้านที่ 5:
r = { id: 5, name: "ตื่มซำฮ่องกง", description: "..." }
ไม่มี "ส้มตำ"
→ ไม่เก็บ

// ... เช็คร้านที่เหลือ ...

// Array ใหม่หลัง filter: 1 ร้าน
restaurants = [
  { id: 1, name: "ส้มตำนัวเข้านอ้ง", ... }
]
```

**เช็ค filters อื่น:**

```javascript
// 2. เช็ค category
if (category) {  // undefined = falsy → ข้าม
  // ไม่ทำงาน
}

// 3. เช็ค minRating
if (minRating) {  // undefined = falsy → ข้าม
  // ไม่ทำงาน
}

// 4. เช็ค priceRange
if (priceRange) {  // undefined = falsy → ข้าม
  // ไม่ทำงาน
}

// ผลลัพธ์สุดท้าย:
restaurants = [
  {
    id: 1,
    name: "ส้มตำนัวเข้านอ้ง",
    category: "อาหารไทย",
    description: "ร้านส้มตำและอาหารอีสานแท้ๆ...",
    location: "ตลาดนัดสวนจตุจักร",
    priceRange: 1,
    phone: "02-123-4567",
    image: "https://...",
    averageRating: 4.5,
    totalReviews: 12,
    openHours: "10:00-20:00",
    createdAt: "2024-01-15T10:00:00.000Z"
  }
]
```

---

### **STEP 11: ส่ง Response กลับ Frontend**

**ตำแหน่ง:** `backend/routes/restaurants.js`

```javascript
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
```

**Response Object:**

```javascript
{
  success: true,
  data: [
    {
      id: 1,
      name: "ส้มตำนัวเข้านอ้ง",
      category: "อาหารไทย",
      description: "ร้านส้มตำและอาหารอีสานแท้ๆ รสชาติต้นตำรับ ส้มตำรสจัดจ้าน ลาบก้อยสดใหม่",
      location: "ตลาดนัดสวนจตุจักร",
      priceRange: 1,
      phone: "02-123-4567",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
      averageRating: 4.5,
      totalReviews: 12,
      openHours: "10:00-20:00",
      createdAt: "2024-01-15T10:00:00.000Z"
    }
  ],
  total: 1,
  filters: {
    search: "ส้มตำ",
    category: null,
    minRating: null,
    priceRange: null
  }
}
```

**Express ส่ง HTTP Response:**

```javascript
// HTTP Response:
/*
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 450

{ "success": true, "data": [...], "total": 1, ... }
*/
```

---

### **STEP 12: Frontend รับ Response**

**ตำแหน่ง:** `services/api.js`

```javascript
export const getRestaurants = async (filters = {}) => {
  try {
    // ... สร้าง URL และส่ง request ...
    
    const response = await fetch(url);
    // response = Response object จาก browser
    
    if (!response.ok) {  // เช็ค HTTP status
      throw new Error('Failed to fetch');
    }
    
    return await response.json();
    // แปลง response body เป็น JavaScript object
    
  } catch (error) {
    throw error;
  }
};
```

**ตัวแปร response:**

```javascript
// response object:
response = {
  ok: true,
  status: 200,
  statusText: "OK",
  headers: Headers { ... },
  body: ReadableStream,
  json: function() { ... }  // method สำหรับแปลง body เป็น JSON
}

// เรียก response.json():
const result = await response.json();

// result = JavaScript object:
result = {
  success: true,
  data: [
    {
      id: 1,
      name: "ส้มตำนัวเข้านอ้ง",
      ...
    }
  ],
  total: 1,
  filters: {
    search: "ส้มตำ",
    ...
  }
}

// return result กลับไปยัง RestaurantList
```

---

### **STEP 13: อัพเดท State ใน RestaurantList**

**ตำแหน่ง:** `RestaurantList.jsx`

```javascript
const fetchRestaurants = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // รับ result จาก api.js
    const result = await getRestaurants(filters);
    
    // อัพเดท restaurants state
    setRestaurants(result.data);
    
  } catch (err) {
    setError('ไม่สามารถโหลดข้อมูลได้');
  } finally {
    setLoading(false);
  }
};
```

**State Changes:**

```javascript
// ก่อนหน้า:
restaurants = [
  { id: 1, name: "ส้มตำนัวเข้านอ้ง", ... },
  { id: 2, name: "ซูชิโตเกียว", ... },
  { id: 3, name: "พิซซ่าอิตาเลียน", ... },
  ... 7 ร้านอื่น
]
loading = true

// เรียก setRestaurants(result.data):
result.data = [
  { id: 1, name: "ส้มตำนัวเข้านอ้ง", ... }  // เหลือ 1 ร้าน
]

setRestaurants(result.data)

// หลังอัพเดท:
restaurants = [
  { id: 1, name: "ส้มตำนัวเข้านอ้ง", ... }
]

// เรียก setLoading(false):
loading = false

// React detect state change → re-render component
```

---

### **STEP 14: React Re-render Component**

**ตำแหน่ง:** `RestaurantList.jsx`

```javascript
function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  // ...
  
  // State ปัจจุบัน:
  // restaurants = [{ id: 1, name: "ส้มตำนัวเข้านอ้ง", ... }]
  // loading = false
  
  if (loading) return <div className="loading">กำลังโหลด...</div>;
  // loading = false → ไม่ return
  
  if (error) return <div className="error">{error}</div>;
  // error = null → ไม่ return
  
  return (
    <div className="restaurant-list-container">
      <SearchBar onSearch={handleSearch} />
      <FilterPanel onFilterChange={handleFilterChange} filters={filters} />
      
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
    </div>
  );
}
```

**การทำงาน:**

```javascript
// 1. เช็คจำนวนร้าน
restaurants.length = 1  // มี 1 ร้าน

// 2. เข้า else branch:
<div className="restaurant-grid">
  {restaurants.map(restaurant => (...))}
</div>

// 3. map() วนลูป restaurants:
restaurants.map(restaurant => {
  // รอบที่ 1:
  restaurant = {
    id: 1,
    name: "ส้มตำนัวเข้านอ้ง",
    category: "อาหารไทย",
    description: "ร้านส้มตำและอาหารอีสาน...",
    location: "ตลาดนัดสวนจตุจักร",
    priceRange: 1,
    phone: "02-123-4567",
    image: "https://...",
    averageRating: 4.5,
    totalReviews: 12,
    openHours: "10:00-20:00",
    createdAt: "2024-01-15T10:00:00.000Z"
  }
  
  // สร้าง RestaurantCard component:
  return (
    <RestaurantCard 
      key={1}
      restaurant={...ข้อมูลด้านบน...}
      onClick={onSelectRestaurant}
    />
  );
  
  // ไม่มีรอบที่ 2 (เพราะมีแค่ 1 ร้าน)
})

// ผลลัพธ์ของ map():
[
  <RestaurantCard 
    key={1}
    restaurant={{ id: 1, name: "ส้มตำนัวเข้านอ้ง", ... }}
    onClick={onSelectRestaurant}
  />
]
```

---

### **STEP 15: Render RestaurantCard Component**

**ตำแหน่ง:** `RestaurantCard.jsx`

```javascript
function RestaurantCard({ restaurant, onClick }) {
  // props ที่ได้รับ:
  restaurant = {
    id: 1,
    name: "ส้มตำนัวเข้านอ้ง",
    category: "อาหารไทย",
    description: "ร้านส้มตำและอาหารอีสานแท้ๆ รสชาติต้นตำรับ ส้มตำรสจัดจ้าน ลาบก้อยสดใหม่",
    location: "ตลาดนัดสวนจตุจักร",
    priceRange: 1,
    phone: "02-123-4567",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
    averageRating: 4.5,
    totalReviews: 12,
    openHours: "10:00-20:00",
    createdAt: "2024-01-15T10:00:00.000Z"
  }
  onClick = function onSelectRestaurant(id) { ... }
  
  const getPriceDisplay = (range) => {
    return '฿'.repeat(range);
  };
  
  // getPriceDisplay(1) = '฿'
  // getPriceDisplay(2) = '฿฿'
  // getPriceDisplay(3) = '฿฿฿'
  
  return (
    <div className="restaurant-card" onClick={() => onClick(restaurant.id)}>
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
      />
      <div className="card-content">
        <h3>{restaurant.name}</h3>
        <p className="category">{restaurant.category}</p>
        <p className="description">{restaurant.description}</p>
        <div className="card-footer">
          <span className="rating">⭐ {restaurant.averageRating.toFixed(1)}</span>
          <span className="price">{getPriceDisplay(restaurant.priceRange)}</span>
          <span className="reviews">{restaurant.totalReviews} รีวิว</span>
        </div>
      </div>
    </div>
  );
}
```

**HTML ที่ render ออกมา:**

```html
<div class="restaurant-card" onclick="...">
  <img 
    src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=800" 
    alt="ส้มตำนัวเข้านอ้ง"
  />
  <div class="card-content">
    <h3>ส้มตำนัวเข้านอ้ง</h3>
    <p class="category">อาหารไทย</p>
    <p class="description">ร้านส้มตำและอาหารอีสานแท้ๆ รสชาติต้นตำรับ ส้มตำรสจัดจ้าน ลาบก้อยสดใหม่</p>
    <div class="card-footer">
      <span class="rating">⭐ 4.5</span>
      <span class="price">฿</span>
      <span class="reviews">12 รีวิว</span>
    </div>
  </div>
</div>
```

---

### **STEP 16: Browser แสดงผลบนหน้าจอ**

**สิ่งที่ User เห็นบนหน้าจอ:**

```
┌─────────────────────────────────────────────────┐
│  🍜 Restaurant Review                           │
│  ค้นหาและรีวิวร้านอาหารโปรดของคุณ                    │
└─────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  🔍 [ส้มตำ            ] [ค้นหา]                  │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  หมวดหมู่: [ทั้งหมด ▼]                             │
│  คะแนน: [ทั้งหมด ▼]                              │
│  ราคา: [ทั้งหมด ▼]                               │
└────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐    │
│  │  [รูปร้านส้มตำ]                            │    │
│  │                                         │    │
│  │  ส้มตำนัวเข้านอ้ง                           │    │
│  │  อาหารไทย                               │    │
│  │                                         │    │
│  │  ร้านส้มตำและอาหารอีสานแท้ๆ...              │    │
│  │                                         │    │
│  │  ⭐ 4.5    ฿    12 รีวิว                  │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## 📊 สรุป Flow ทั้งหมด (แบบย่อ)

```
User พิมพ์ "ส้มตำ"
    ↓
SearchBar: onChange → setSearchTerm("ส้มตำ")
    ↓
SearchBar: useEffect → debounce 500ms
    ↓
User กดปุ่มค้นหา
    ↓
SearchBar: onSubmit → onSearch("ส้มตำ")
    ↓
RestaurantList: handleSearch → setFilters({ search: "ส้มตำ" })
    ↓
RestaurantList: useEffect detect filters change
    ↓
RestaurantList: fetchRestaurants()
    ↓
api.js: getRestaurants({ search: "ส้มตำ" })
    ↓
api.js: fetch("http://localhost:3000/api/restaurants?search=ส้มตำ")
    ↓
Express: GET /api/restaurants รับ request
    ↓
Express: req.query = { search: "ส้มตำ" }
    ↓
Express: readJsonFile('restaurants.json')
    ↓
Express: filter restaurants ที่มี "ส้มตำ"
    ↓
Express: res.json({ data: [1 ร้าน] })
    ↓
api.js: return result
    ↓
RestaurantList: setRestaurants(result.data)
    ↓
React: re-render
    ↓
RestaurantList: map() → สร้าง RestaurantCard
    ↓
RestaurantCard: render HTML
    ↓
Browser: แสดงผลบนหน้าจอ ✓
```

---

## 🔍 ตัวแปรสำคัญในแต่ละ Component

### **SearchBar Component**
```javascript
const [searchTerm, setSearchTerm] = useState('');

// ค่าตลอดการทำงาน:
searchTerm: '' → 'ส' → 'ส้' → 'ส้ม' → 'ส้มต' → 'ส้มตำ'
```

### **RestaurantList Component**
```javascript
const [restaurants, setRestaurants] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [filters, setFilters] = useState({
  search: '',
  category: '',
  minRating: '',
  priceRange: ''
});

// ค่าตลอดการทำงาน:
filters.search: '' → 'ส้มตำ'
loading: false → true → false
restaurants: [10 ร้าน] → [1 ร้าน]
```

### **Backend Variables**
```javascript
// req.query
{
  search: "ส้มตำ",
  category: undefined,
  minRating: undefined,
  priceRange: undefined
}

// restaurants (หลัง filter)
[
  { id: 1, name: "ส้มตำนัวเข้านอ้ง", ... }
]
```

---

## ⏱️ Timeline (เวลาจริง)

```
00:00.000  User เริ่มพิมพ์
00:00.200  พิมพ์ "ส"
00:00.400  พิมพ์ "้"
00:00.600  พิมพ์ "ม"
00:00.800  พิมพ์ "ต"
00:01.000  พิมพ์ "ำ"
00:01.500  Timer หมดเวลา (ถ้ามี debounce)
00:01.501  onSearch("ส้มตำ") ถูกเรียก
00:01.502  setFilters({ search: "ส้มตำ" })
00:01.503  useEffect detect change
00:01.504  fetchRestaurants() เริ่ม
00:01.505  setLoading(true)
00:01.506  fetch() ส่ง HTTP request
00:01.520  Request ถึง server (14ms latency)
00:01.521  Express รับ request
00:01.522  อ่าน restaurants.json
00:01.525  Filter ข้อมูล (3ms)
00:01.526  ส่ง response กลับ
00:01.540  Response ถึง browser (14ms latency)
00:01.541  setRestaurants([1 ร้าน])
00:01.542  setLoading(false)
00:01.543  React re-render
00:01.550  Browser paint หน้าจอใหม่ (7ms)
00:01.551  User เห็นผลลัพธ์! ✓

รวมเวลา: ~1.5 วินาที
```

---

## 🎓 แนวคิดสำคัญที่ต้องเข้าใจ

### 1. **State Management**
```javascript
// State คือข้อมูลที่ component จำได้
// เมื่อ state เปลี่ยน → component re-render

const [value, setValue] = useState(initialValue);

// value = ค่าปัจจุบัน
// setValue = ฟังก์ชันสำหรับเปลี่ยนค่า
```

### 2. **Props Flow (One-way Data Flow)**
```
Parent Component
    ↓ props
Child Component
    ↑ callback function
Parent Component (อัพเดท state)
```

### 3. **useEffect Dependencies**
```javascript
useEffect(() => {
  // code ที่จะรัน
}, [dependency1, dependency2]);

// รันเมื่อ dependency เปลี่ยน
// [] = รันครั้งเดียวตอน mount
// ไม่ใส่ = รันทุกครั้งที่ re-render
```

### 4. **Async/Await Pattern**
```javascript
const fetchData = async () => {
  try {
    const result = await apiCall();  // รอจนเสร็จ
    setState(result);                // ค่อยทำต่อ
  } catch (error) {
    handleError(error);
  }
};
```

### 5. **Event Handling**
```javascript
// Controlled Component
<input 
  value={state}              // แสดงค่าจาก state
  onChange={(e) => setState(e.target.value)}  // อัพเดท state
/>
```

### 6. **HTTP Request/Response Cycle**
```
Client                    Server
  |                          |
  |--- HTTP Request -------->|
  |                          |
  |                    (ประมวลผล)
  |                          |
  |<---- HTTP Response ------|
  |                          |
```

---

## 💡 Tips สำหรับการเรียนรู้

### **วิธีทำความเข้าใจ Code:**

1. **อ่านจากบนลงล่าง:** เริ่มจาก User action → ตามไปทีละขั้นตอน

2. **ใช้ console.log:** ดูค่าของตัวแปรในแต่ละจุด
   ```javascript
   console.log('searchTerm:', searchTerm);
   console.log('filters:', filters);
   console.log('restaurants:', restaurants);
   ```

3. **ใช้ Browser DevTools:**
   - Console tab: ดู logs และ errors
   - Network tab: ดู HTTP requests
   - React DevTools: ดู component state

4. **แยกทำทีละส่วน:** อย่าพยายามเข้าใจทั้งหมดพร้อมกัน

5. **ทดลองแก้ไข:** เปลี่ยนค่าและดูว่าเกิดอะไรขึ้น

6. **วาด Diagram:** ช่วยให้เห็นภาพรวม

---

## 🎯 แบบฝึกหัดเพื่อทำความเข้าใจ

### **คำถามทบทวน:**

1. ถ้า User พิมพ์ "ส้มตำ" แล้วพิมพ์ต่อเป็น "ส้มตำไทย" debounce จะเรียก API กี่ครั้ง?
   - **คำตอบ:** 1 ครั้ง (เฉพาะครั้งสุดท้าย)

2. ถ้าไม่มี debounce และ User พิมพ์ "ส้มตำ" (5 ตัวอักษร) จะเรียก API กี่ครั้ง?
   - **คำตอบ:** 5 ครั้ง (ทุกครั้งที่พิมพ์)

3. ถ้า restaurants.json มีร้าน 100 ร้าน และมี 3 ร้านที่มีคำว่า "ส้มตำ" ผลลัพธ์จะเป็นอย่างไร?
   - **คำตอบ:** แสดง 3 ร้าน (ที่ผ่าน filter)

4. ถ้า Backend ส่ง error (status 500) จะเกิดอะไรขึ้น?
   - **คำตอบ:** ไปที่ catch block → setError() → แสดง error message

---

การทำความเข้าใจแบบละเอียดนี้จะช่วยให้นักศึกษาเข้าใจ:
- Data flow ระหว่าง components
- การทำงานของ React Hooks
- HTTP Request/Response cycle
- Async programming pattern
- State management

**ขอให้เรียนรู้อย่างมีความสุข!** 🎓