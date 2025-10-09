# เอกสารสไลด์: React Hooks - useState & useEffect

---

## หน้าที่ 1: ปก

# React Hooks
## useState & useEffect

**สำหรับ Restaurant Review Project**

เรียนรู้การจัดการ State และ Side Effects ใน React

---

## หน้าที่ 2: React Hooks คือ?

### React Hooks คืออะไร?

**Hooks** = ฟังก์ชันพิเศษที่ช่วยให้ Function Component ใช้ State และ Features อื่นๆ ของ React ได้

**ทำไมต้องใช้ Hooks?**
- ✅ เขียนโค้ดสั้นลง เข้าใจง่ายกว่า Class Component
- ✅ แชร์ logic ระหว่าง components ได้ง่าย
- ✅ แยก concerns ได้ดีขึ้น

**Hooks ที่จำเป็นสำหรับโปรเจค:**
1. `useState` - จัดการข้อมูลที่เปลี่ยนแปลงได้
2. `useEffect` - ทำงานกับ side effects (fetch data, etc.)

---

## หน้าที่ 3: useState - แนวคิด

### useState: จัดการ State

**State คือ?** ข้อมูลที่เปลี่ยนแปลงได้ และเมื่อเปลี่ยน Component จะ re-render

**Syntax:**
```javascript
const [ค่าปัจจุบัน, ฟังก์ชันเปลี่ยนค่า] = useState(ค่าเริ่มต้น);
```

**ตัวอย่างในชีวิตจริง:**
```javascript
const [count, setCount] = useState(0);
//      ↑         ↑              ↑
//   ค่าปัจจุบัน  ฟังก์ชันเปลี่ยน  ค่าเริ่มต้น
```

📊 **Diagram:**
```
Initial: count = 0
         ↓
Click +: setCount(1) → count = 1 → Component Re-render
         ↓
Click +: setCount(2) → count = 2 → Component Re-render
```

---

## หน้าที่ 4: useState - ตัวอย่างที่ 1

### ตัวอย่าง: Counter

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>จำนวน: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        เพิ่ม
      </button>
    </div>
  );
}
```

**สิ่งที่เกิดขึ้น:**
1. เริ่มต้น `count = 0`
2. คลิกปุ่ม → `setCount(1)` → `count = 1`
3. Component re-render → แสดง "จำนวน: 1"

---

## หน้าที่ 5: useState - ตัวอย่างที่ 2

### ตัวอย่าง: Input Form (ใช้ในโปรเจค)

```javascript
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="ค้นหา..."
    />
  );
}
```

**Flow:**
```
User พิมพ์ "ส" → setSearchTerm("ส") → searchTerm = "ส"
User พิมพ์ "้" → setSearchTerm("ส้") → searchTerm = "ส้"
User พิมพ์ "ม" → setSearchTerm("ส้ม") → searchTerm = "ส้ม"
```

---

## หน้าที่ 6: useState - Multiple States

### หลาย State ในหนึ่ง Component

```javascript
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ใช้งาน 3 states พร้อมกัน
  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* แสดงร้าน */}</div>;
}
```

**💡 หลักการ:** แต่ละ state ทำหน้าที่ต่างกัน แยกกันชัดเจน

---

## หน้าที่ 7: useState - State เป็น Object

### Object State (ใช้ในโปรเจค)

```javascript
function FilterPanel() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minRating: ''
  });
  
  // อัพเดทเฉพาะ field เดียว
  const updateSearch = (value) => {
    setFilters({
      ...filters,        // คัดลอกค่าเดิม
      search: value      // เปลี่ยนแค่ search
    });
  };
}
```

**⚠️ สำคัญ:** ต้องใช้ `...` (spread operator) เพื่อคัดลอกค่าเดิม

---

## หน้าที่ 8: useState - กฎสำคัญ

### กฎที่ต้องจำ ⚠️

**❌ ห้าม: แก้ state โดยตรง**
```javascript
// ❌ ผิด - ไม่ทำงาน!
count = count + 1;
filters.search = "ส้มตำ";
```

**✅ ต้องทำ: ใช้ setter function**
```javascript
// ✅ ถูก
setCount(count + 1);
setFilters({ ...filters, search: "ส้มตำ" });
```

**💡 เหตุผล:** React ต้องรู้ว่า state เปลี่ยนเพื่อ re-render

---

## หน้าที่ 9: useEffect - แนวคิด

### useEffect: Side Effects

**Side Effects คือ?** การทำงานที่ "ส่งผลกระทบข้างเคียง"
- 📡 Fetch ข้อมูลจาก API
- 🔄 Update DOM โดยตรง
- ⏰ ตั้ง Timer/Interval
- 📊 Subscribe to events

**Syntax:**
```javascript
useEffect(() => {
  // ทำงานที่นี่
  
  return () => {
    // cleanup (optional)
  };
}, [dependencies]);
```

---

## หน้าที่ 10: useEffect - Dependency Array

### Dependency Array คือ?

```javascript
useEffect(() => {
  console.log('ทำงาน!');
}, []);
//  ↑ Dependency Array
```

**3 รูปแบบการทำงาน:**

| Dependency | เมื่อไร Effect จะทำงาน |
|------------|------------------------|
| `[]` | ครั้งเดียวตอน mount |
| `[value]` | ทุกครั้งที่ value เปลี่ยน |
| ไม่มี | ทุกครั้งที่ component render |

---

## หน้าที่ 11: useEffect - ตัวอย่างที่ 1

### ตัวอย่าง: Fetch Data (ใช้ในโปรเจค)

```javascript
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    // ทำงานครั้งเดียวตอน mount
    fetch('http://localhost:3000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []); // [] = run once
  
  return <div>{/* แสดงร้าน */}</div>;
}
```

**Flow:**
```
Component Mount → useEffect ทำงาน → Fetch API → setRestaurants
```

---

## หน้าที่ 12: useEffect - ตัวอย่างที่ 2

### ตัวอย่าง: Fetch เมื่อ Dependency เปลี่ยน

```javascript
function RestaurantList({ category }) {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    fetch(`/api/restaurants?category=${category}`)
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, [category]); // ทำงานใหม่ทุกครั้งที่ category เปลี่ยน
  
  return <div>{/* แสดงร้าน */}</div>;
}
```

**Timeline:**
```
category = "ไทย" → Effect ทำงาน → Fetch ร้านไทย
      ↓
category = "ญี่ปุ่น" → Effect ทำงานอีกรอบ → Fetch ร้านญี่ปุ่น
```

---

## หน้าที่ 13: useEffect - Cleanup Function

### Cleanup: ทำความสะอาด

```javascript
function Timer() {
  useEffect(() => {
    // เริ่ม interval
    const interval = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup: หยุด interval เมื่อ component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);
}
```

**เมื่อไรต้อง Cleanup?**
- ⏰ Timer/Interval
- 🔌 WebSocket connections
- 📡 Event listeners
- 🎯 Subscriptions

---

## หน้าที่ 14: useEffect - Debounce Pattern

### Debounce: ใช้ในโปรเจค (Search)

```javascript
function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // รอ 500ms หลังจากผู้ใช้พิมพ์หยุด
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    
    // Cleanup: ยกเลิก timer เก่า
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return <input onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

---

## หน้าที่ 15: useEffect - Debounce Diagram

### ทำไมต้อง Debounce?

**ไม่มี Debounce:**
```
User พิมพ์ "ส้มตำ" (5 ตัวอักษร)
  ↓
API calls: 5 ครั้ง (ส, ส้, ส้ม, ส้มต, ส้มตำ)
```

**มี Debounce:**
```
User พิมพ์ "ส" → ตั้ง timer 500ms
  ↓
User พิมพ์ "้" → ยกเลิก timer เก่า, ตั้งใหม่
  ↓
User พิมพ์ "ม" → ยกเลิก timer เก่า, ตั้งใหม่
  ↓
User พิมพ์ "ต" → ยกเลิก timer เก่า, ตั้งใหม่
  ↓
User พิมพ์ "ำ" → ตั้ง timer → รอ 500ms → API call: 1 ครั้ง!
```

**ผลลัพธ์:** ลด API calls จาก 5 → 1 ครั้ง

---

## หน้าที่ 16: useState + useEffect ร่วมกัน

### ตัวอย่างที่ใช้ทั้งคู่ (จากโปรเจค)

```javascript
function RestaurantList() {
  // useState: เก็บข้อมูล
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '' });
  
  // useEffect: fetch ข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getRestaurants(filters);
      setRestaurants(data);
      setLoading(false);
    };
    fetchData();
  }, [filters]); // fetch ใหม่เมื่อ filters เปลี่ยน
  
  if (loading) return <div>กำลังโหลด...</div>;
  return <div>{/* แสดงร้าน */}</div>;
}
```

---

## หน้าที่ 17: Common Mistakes

### ข้อผิดพลาดที่พบบ่อย

**1. Infinite Loop**
```javascript
// ❌ ผิด - Loop ไม่รู้จบ!
useEffect(() => {
  setCount(count + 1);
}); // ไม่มี dependency array
```

**2. Missing Dependencies**
```javascript
// ⚠️ อันตราย - ใช้ filters แต่ไม่ใส่ใน dependencies
useEffect(() => {
  fetchData(filters);
}, []); // ควรเป็น [filters]
```

**3. แก้ State โดยตรง**
```javascript
// ❌ ผิด
filters.search = "ส้มตำ";

// ✅ ถูก
setFilters({ ...filters, search: "ส้มตำ" });
```

---

## หน้าที่ 18: ใช้ใน Restaurant Review Project

### useState ใช้เก็บอะไร?

```javascript
// รายการร้าน
const [restaurants, setRestaurants] = useState([]);

// การค้นหาและกรอง
const [filters, setFilters] = useState({
  search: '',
  category: '',
  minRating: ''
});

// UI States
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedId, setSelectedId] = useState(null);

// ฟอร์มรีวิว
const [formData, setFormData] = useState({
  userName: '',
  rating: 5,
  comment: ''
});
```

---

## หน้าที่ 19: ใช้ใน Restaurant Review Project (2)

### useEffect ใช้ทำอะไร?

**1. Fetch ร้านอาหาร**
```javascript
useEffect(() => {
  fetchRestaurants();
}, []); // ครั้งแรกที่โหลด
```

**2. Fetch เมื่อ Filters เปลี่ยน**
```javascript
useEffect(() => {
  fetchRestaurants(filters);
}, [filters]); // ทุกครั้งที่กรอง
```

**3. Debounce Search**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

---

## หน้าที่ 20: Best Practices

### แนวทางปฏิบัติที่ดี

**1. ตั้งชื่อ State ให้ชัดเจน**
```javascript
// ✅ ดี
const [isLoading, setIsLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

// ❌ ไม่ดี
const [data, setData] = useState(false);
const [x, setX] = useState('');
```

**2. แยก State ตามหน้าที่**
```javascript
// ✅ ดี - แยกชัดเจน
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState([]);

// ❌ ไม่ดี - รวมกันหมด
const [state, setState] = useState({ loading: false, error: null, data: [] });
```

---

## หน้าที่ 21: Best Practices (2)

### แนวทางปฏิบัติที่ดี (ต่อ)

**3. ใส่ Dependencies ครบถ้วน**
```javascript
// ✅ ดี
useEffect(() => {
  fetchData(id, filters);
}, [id, filters]); // ใส่ครบ

// ❌ อันตราย
useEffect(() => {
  fetchData(id, filters);
}, [id]); // ขาด filters
```

**4. Cleanup เมื่อจำเป็น**
```javascript
// ✅ ดี - มี cleanup
useEffect(() => {
  const timer = setTimeout(...);
  return () => clearTimeout(timer);
}, []);
```

---

## หน้าที่ 22: เตรียมตัวทำโปรเจค

### สิ่งที่ต้องเข้าใจ

**useState:**
- ✅ รู้จักเก็บข้อมูลด้วย state
- ✅ รู้จักอัพเดท state ด้วย setter
- ✅ เข้าใจ state เป็น object
- ✅ รู้ว่าต้องไม่แก้ state โดยตรง

**useEffect:**
- ✅ รู้จัก fetch data เมื่อ component mount
- ✅ เข้าใจ dependency array
- ✅ รู้จักใช้ cleanup function
- ✅ เข้าใจ debounce pattern

---

## หน้าที่ 23: แบบฝึกหัด

### ฝึกก่อนทำโปรเจค

**1. Counter App**
- ปุ่ม + เพิ่ม
- ปุ่ม - ลด  
- ปุ่ม Reset

**2. Search Box**
- Input ที่มี debounce 500ms
- แสดงผลลัพธ์การค้นหา

**3. Fetch Data**
- Fetch ข้อมูลจาก API
- แสดง loading
- แสดง error ถ้ามี

**4. Todo List**
- เพิ่ม todo
- ลบ todo
- แสดงจำนวน

---

## หน้าที่ 24: สรุป

### สรุป useState & useEffect

**useState:**
- จัดการข้อมูลที่เปลี่ยนแปลงได้
- ใช้ setter function เพื่ออัพเดท
- เมื่อ state เปลี่ยน component จะ re-render

**useEffect:**
- จัดการ side effects (fetch, timers, etc.)
- ควบคุมการทำงานด้วย dependency array
- ใช้ cleanup function เมื่อจำเป็น

**ใช้ร่วมกัน:**
- State เก็บข้อมูล
- Effect fetch ข้อมูลมาใส่ใน state
- Component แสดงข้อมูลจาก state

---

## หน้าที่ 25: เตรียมพร้อม!

### คุณพร้อมแล้ว! 🚀

**ความรู้ที่ได้:**
- ✅ useState - จัดการ state
- ✅ useEffect - จัดการ side effects
- ✅ Debounce pattern
- ✅ Best practices

**ขั้นต่อไป:**
- 📖 ทบทวนเนื้อหา
- 💻 ฝึกทำแบบฝึกหัด
- 🍜 เริ่มทำ Restaurant Review Project!

**Good luck!** 

---

**จำนวนสไลด์ทั้งหมด: 25 หน้า**