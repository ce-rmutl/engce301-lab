# สรุปความรู้ React ที่ต้องเรียนเพื่อทำ Restaurant Review Website

## 📚 หัวข้อหลักที่ต้องเรียน

### 1. **React Fundamentals (พื้นฐาน)**

#### 1.1 JSX (JavaScript XML)
- เขียน HTML ใน JavaScript
- การใช้ `{}` สำหรับแทรกค่าตัวแปร
- การใช้ className แทน class
- Conditional rendering

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
{loading && <div className="loading">กำลังโหลด...</div>}
{restaurants.length === 0 ? <p>ไม่พบข้อมูล</p> : <Grid />}
```

#### 1.2 Components
- Function Components (ใช้ในโปรเจคทั้งหมด)
- Props (การส่งข้อมูลระหว่าง components)
- Component composition

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
function RestaurantCard({ restaurant, onClick }) {
  return <div onClick={() => onClick(restaurant.id)}>...</div>
}
```

---

### 2. **React Hooks (สำคัญมาก)**

#### 2.1 useState
- จัดการ state ใน component
- การอัพเดท state แบบ immutable
- State สำหรับ form, filters, loading, errors

```javascript
// ตัวอย่างการใช้ในโปรเจค
const [restaurants, setRestaurants] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  search: '',
  category: '',
  minRating: '',
  priceRange: ''
});

// การอัพเดท state
setFilters(prev => ({ ...prev, search: searchTerm }));
```

#### 2.2 useEffect
- Side effects (fetch data, subscriptions)
- Dependency array
- Cleanup function (สำหรับ debounce)

```javascript
// ตัวอย่างการใช้ในโปรเจค

// 1. Fetch เมื่อ component mount
useEffect(() => {
  fetchRestaurants();
}, []);

// 2. Fetch เมื่อ filters เปลี่ยน
useEffect(() => {
  fetchRestaurants();
}, [filters]);

// 3. Debounce search (พร้อม cleanup)
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(searchTerm);
  }, 500);
  
  return () => clearTimeout(timer); // cleanup
}, [searchTerm]);
```

---

### 3. **Event Handling**

#### 3.1 Form Events
- `onChange` - จับการเปลี่ยนแปลงใน input
- `onSubmit` - จับการ submit form
- `onClick` - จับการคลิก

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
<input 
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

<form onSubmit={handleSubmit}>
  <button type="submit">ส่งรีวิว</button>
</form>

<div onClick={() => onSelectRestaurant(id)}>...</div>
```

#### 3.2 preventDefault
- ป้องกัน default behavior ของ form

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  // ทำงานต่อ
};
```

---

### 4. **Lists & Keys**

#### 4.1 Rendering Lists
- ใช้ `.map()` เพื่อ render array
- การใช้ `key` prop อย่างถูกต้อง

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
{restaurants.map(restaurant => (
  <RestaurantCard 
    key={restaurant.id}  // ต้องมี unique key
    restaurant={restaurant}
    onClick={onSelectRestaurant}
  />
))}
```

---

### 5. **Conditional Rendering**

#### 5.1 รูปแบบต่างๆ
- `&&` operator
- Ternary operator `? :`
- Early return

```javascript
// ตัวอย่างที่ใช้ในโปรเจค

// 1. && operator
{loading && <div>กำลังโหลด...</div>}
{error && <div className="error">{error}</div>}

// 2. Ternary operator
{restaurants.length === 0 ? (
  <p>ไม่พบข้อมูล</p>
) : (
  <div className="grid">...</div>
)}

// 3. Early return
if (loading) return <Loading />;
if (error) return <Error message={error} />;
return <Data />;
```

---

### 6. **Fetching Data**

#### 6.1 Fetch API
- การใช้ `fetch()`
- `async/await`
- Error handling

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
const fetchRestaurants = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const data = await response.json();
    setRestaurants(data);
    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

#### 6.2 POST Request
- ส่งข้อมูล JSON
- ตั้งค่า headers

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(reviewData)
});
```

---

### 7. **Form Handling**

#### 7.1 Controlled Components
- Input ที่ควบคุมด้วย state
- การ sync ระหว่าง state และ UI

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
const [formData, setFormData] = useState({
  userName: '',
  rating: 5,
  comment: ''
});

<input
  value={formData.userName}
  onChange={(e) => setFormData({
    ...formData, 
    userName: e.target.value
  })}
/>
```

#### 7.2 Form Validation
- Client-side validation
- แสดง error messages

```javascript
// ตัวอย่างที่ใช้ในโปรเจค
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.userName.trim()) {
    newErrors.userName = 'กรุณากรอกชื่อ';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

### 8. **Component Communication**

#### 8.1 Props Drilling
- ส่ง props จาก parent → child
- ส่ง callback functions

```javascript
// Parent component
function App() {
  const [selectedId, setSelectedId] = useState(null);
  
  return (
    <RestaurantList 
      onSelectRestaurant={setSelectedId}  // ส่ง function
    />
  );
}

// Child component
function RestaurantList({ onSelectRestaurant }) {
  return (
    <RestaurantCard 
      onClick={onSelectRestaurant}  // ส่งต่อ
    />
  );
}
```

---

### 9. **Performance Patterns**

#### 9.1 Debouncing
- ลดจำนวน API calls
- ใช้ setTimeout + cleanup

```javascript
// Pattern ที่ใช้ในโปรเจค
useEffect(() => {
  const timer = setTimeout(() => {
    // ทำงานหลังจาก delay
  }, 500);
  
  return () => clearTimeout(timer);
}, [dependency]);
```

---

### 10. **Project Structure**

#### 10.1 Component Organization
- แยก components ตามหน้าที่
- แยก services/utilities

```
src/
├── components/     # React components
├── services/       # API calls
├── App.jsx        # Main component
└── App.css        # Styles
```

---

## 🎯 ความรู้ที่ใช้ในแต่ละ Component

### RestaurantList.jsx ใช้:
- ✓ useState (restaurants, loading, error, filters)
- ✓ useEffect (fetch เมื่อ filters เปลี่ยน)
- ✓ Array.map() (render cards)
- ✓ Conditional rendering (loading/error states)
- ✓ Props (onSelectRestaurant)

### SearchBar.jsx ใช้:
- ✓ useState (searchTerm)
- ✓ useEffect + debounce
- ✓ Form handling (onSubmit, onChange)
- ✓ Conditional rendering (clear button)

### FilterPanel.jsx ใช้:
- ✓ Props (filters, onFilterChange)
- ✓ Event handling (onChange)
- ✓ Array.map() (render options)

### RestaurantDetail.jsx ใช้:
- ✓ useState (restaurant, loading, error)
- ✓ useEffect (fetch detail)
- ✓ Conditional rendering (loading/error)
- ✓ Component composition

### ReviewForm.jsx ใช้:
- ✓ useState (formData, errors, submitting)
- ✓ Controlled components
- ✓ Form validation
- ✓ Async operations (POST request)
- ✓ Error handling

---

## 📖 ลำดับการเรียนที่แนะนำ

### สัปดาห์ที่ 1: พื้นฐาน
1. JSX
2. Components & Props
3. useState
4. Event Handling

### สัปดาห์ที่ 2: Advanced
5. useEffect
6. Lists & Keys
7. Conditional Rendering
8. Form Handling

### สัปดาห์ที่ 3: Integration
9. Fetch API
10. Error Handling
11. Loading States
12. Component Communication

### สัปดาห์ที่ 4-5: Practice
13. ทำโปรเจคเล็กๆ
14. ทำ Final Project

---

## 📝 สิ่งที่ไม่จำเป็นต้องรู้ (ไม่ได้ใช้ในโปรเจค)

- ❌ Class Components
- ❌ Context API
- ❌ useReducer
- ❌ useCallback, useMemo (ไม่จำเป็นในระดับนี้)
- ❌ React Router (ใช้ conditional rendering แทน)
- ❌ Redux/State Management Libraries
- ❌ useRef (ไม่ได้ใช้)

---

## ✅ Checklist ความพร้อม

ก่อนทำ Final Project ต้องสามารถทำได้:

**พื้นฐาน**
- [ ] เขียน JSX ได้
- [ ] สร้าง Function Component ได้
- [ ] ส่ง props ระหว่าง components ได้

**State Management**
- [ ] ใช้ useState เพื่อเก็บข้อมูลได้
- [ ] อัพเดท state อย่างถูกต้อง (immutable)
- [ ] เข้าใจว่า state เปลี่ยนเมื่อไร

**Side Effects**
- [ ] ใช้ useEffect เพื่อ fetch data ได้
- [ ] เข้าใจ dependency array
- [ ] เขียน cleanup function ได้

**Forms**
- [ ] สร้าง controlled components ได้
- [ ] จับ events (onChange, onSubmit) ได้
- [ ] ทำ form validation ได้

**Data Fetching**
- [ ] ใช้ fetch API ได้
- [ ] จัดการ async/await ได้
- [ ] Handle errors ได้

**Lists**
- [ ] ใช้ .map() render list ได้
- [ ] ใส่ key prop ถูกต้อง

---

# คู่มือเรียนรู้ React สำหรับ Restaurant Review Project

---

## 1. JSX - JavaScript XML

### อธิบาย
JSX คือการเขียน HTML ใน JavaScript ทำให้เราสร้าง UI ได้ง่ายขึ้น โค้ด JSX จะถูกแปลงเป็น JavaScript ปกติก่อนรัน

### กฎสำคัญ
- ใช้ `className` แทน `class`
- ต้องปิด tag ทุกตัว (`<img />`, `<input />`)
- ใช้ `{}` เพื่อแทรก JavaScript expression

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: การแทรกตัวแปร
function Greeting() {
  const name = "สมชาย";
  const age = 25;
  
  return (
    <div className="greeting">
      <h1>สวัสดี {name}</h1>
      <p>อายุ {age} ปี</p>
      <p>เกิดปี {2024 - age}</p>
    </div>
  );
}

// ตัวอย่างที่ 2: Conditional Rendering
function RestaurantCard({ restaurant }) {
  return (
    <div className="card">
      <h3>{restaurant.name}</h3>
      
      {/* แสดงถ้ามีรีวิว */}
      {restaurant.totalReviews > 0 && (
        <p>มี {restaurant.totalReviews} รีวิว</p>
      )}
      
      {/* แสดงข้อความต่างกันตาม rating */}
      <p>
        {restaurant.averageRating >= 4 
          ? "แนะนำเลย!" 
          : "พอใช้"}
      </p>
    </div>
  );
}

// ตัวอย่างที่ 3: Inline Styles
function Badge({ status }) {
  const style = {
    padding: '5px 10px',
    borderRadius: '5px',
    backgroundColor: status === 'open' ? 'green' : 'red',
    color: 'white'
  };
  
  return <span style={style}>{status}</span>;
}
```

### แบบฝึกหัด
```javascript
// โจทย์: แสดงข้อมูลสินค้า
// - ถ้าราคามากกว่า 1000 แสดง "สินค้าราคาสูง" สีแดง
// - ถ้าไม่ แสดง "ราคาปกติ" สีเขียว
// - ถ้ามีส่วนลด แสดงราคาเก่าขีดฆ่า และราคาใหม่

function Product({ name, price, discount }) {
  // เขียนโค้ดที่นี่
}
```

---

## 2. Components & Props

### อธิบาย
Component คือชิ้นส่วนของ UI ที่สามารถนำกลับมาใช้ซ้ำได้ Props คือข้อมูลที่ส่งจาก parent component ไปยัง child component (ทิศทางเดียว ไม่สามารถส่งกลับได้)

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: Component พื้นฐาน
function Button({ text, color }) {
  return (
    <button style={{ backgroundColor: color }}>
      {text}
    </button>
  );
}

// การใช้งาน
function App() {
  return (
    <div>
      <Button text="บันทึก" color="green" />
      <Button text="ยกเลิก" color="red" />
    </div>
  );
}

// ตัวอย่างที่ 2: Props เป็น Object
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// การใช้งาน
function UserList() {
  const users = [
    { id: 1, name: "สมชาย", email: "somchai@email.com", avatar: "url1" },
    { id: 2, name: "สมหญิง", email: "somying@email.com", avatar: "url2" }
  ];
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// ตัวอย่างที่ 3: Props เป็น Function (Callback)
function SearchBar({ onSearch }) {
  const handleClick = () => {
    onSearch("ส้มตำ"); // เรียก function ที่ส่งมาจาก parent
  };
  
  return <button onClick={handleClick}>ค้นหา</button>;
}

// การใช้งาน
function App() {
  const handleSearch = (term) => {
    console.log("ค้นหา:", term);
  };
  
  return <SearchBar onSearch={handleSearch} />;
}

// ตัวอย่างที่ 4: Default Props
function Avatar({ src, size = 50 }) {
  return (
    <img 
      src={src} 
      width={size} 
      height={size}
      style={{ borderRadius: '50%' }}
    />
  );
}

// ใช้ได้ทั้ง 2 แบบ
<Avatar src="photo.jpg" />           // ใช้ default size=50
<Avatar src="photo.jpg" size={100} /> // กำหนด size เอง
```

### แบบฝึกหัด
```javascript
// โจทย์: สร้าง ProductCard component
// Props: { name, price, imageUrl, inStock, onAddToCart }
// - แสดงรูปสินค้า ชื่อ ราคา
// - ถ้า inStock=true แสดงปุ่ม "เพิ่มในตะกร้า" (เรียก onAddToCart เมื่อคลิก)
// - ถ้า inStock=false แสดงข้อความ "สินค้าหมด" สีเทา

function ProductCard(/* เขียน props ที่นี่ */) {
  // เขียนโค้ดที่นี่
}
```

---

## 3. useState - State Management

### อธิบาย
`useState` ใช้เก็บข้อมูลที่เปลี่ยนแปลงได้ใน component เมื่อ state เปลี่ยน component จะ re-render อัตโนมัติ

### Syntax
```javascript
const [ค่าปัจจุบัน, ฟังก์ชันเปลี่ยนค่า] = useState(ค่าเริ่มต้น);
```

### ตัวอย่าง

```javascript
import { useState } from 'react';

// ตัวอย่างที่ 1: Counter
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>นับ: {count}</p>
      <button onClick={() => setCount(count + 1)}>เพิ่ม</button>
      <button onClick={() => setCount(count - 1)}>ลด</button>
      <button onClick={() => setCount(0)}>รีเซ็ต</button>
    </div>
  );
}

// ตัวอย่างที่ 2: Form Input
function NameForm() {
  const [name, setName] = useState('');
  
  const handleSubmit = () => {
    alert(`สวัสดี ${name}!`);
    setName(''); // เคลียร์ form
  };
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ชื่อของคุณ"
      />
      <button onClick={handleSubmit}>ส่ง</button>
      <p>กำลังพิมพ์: {name}</p>
    </div>
  );
}

// ตัวอย่างที่ 3: Multiple States
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="อีเมล"
      />
      
      <input 
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="รหัสผ่าน"
      />
      
      <label>
        <input 
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        แสดงรหัสผ่าน
      </label>
    </div>
  );
}

// ตัวอย่างที่ 4: State เป็น Object
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    age: 0,
    email: ''
  });
  
  const handleChange = (field, value) => {
    setUser({
      ...user,        // คัดลอกค่าเดิมทั้งหมด
      [field]: value  // เปลี่ยนเฉพาะ field ที่ต้องการ
    });
  };
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="ชื่อ"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => handleChange('age', e.target.value)}
        placeholder="อายุ"
      />
      <p>ข้อมูล: {JSON.stringify(user)}</p>
    </div>
  );
}

// ตัวอย่างที่ 5: State เป็น Array
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input]); // เพิ่มรายการใหม่
      setInput('');
    }
  };
  
  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="สิ่งที่ต้องทำ"
      />
      <button onClick={addTodo}>เพิ่ม</button>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### กฎสำคัญของ State
```javascript
// ❌ ผิด - แก้ state โดยตรง
user.name = "สมชาย";      // ไม่ทำงาน!
todos.push("ใหม่");        // ไม่ทำงาน!

// ✓ ถูก - ใช้ setter function
setUser({ ...user, name: "สมชาย" });
setTodos([...todos, "ใหม่"]);

// ❌ ผิด - ใช้ค่าเก่า (async problem)
setCount(count + 1);
setCount(count + 1); // ไม่ได้เพิ่ม 2 แต่เพิ่มแค่ 1!

// ✓ ถูก - ใช้ updater function
setCount(prev => prev + 1);
setCount(prev => prev + 1); // เพิ่ม 2 จริงๆ
```

### แบบฝึกหัด
```javascript
// โจทย์: สร้าง Shopping Cart
// Features:
// - แสดงรายการสินค้า (ชื่อ, ราคา, จำนวน)
// - เพิ่ม/ลด จำนวนสินค้า
// - ลบสินค้าออกจากตะกร้า
// - แสดงยอดรวมทั้งหมด

function ShoppingCart() {
  // State: items = [{ id, name, price, quantity }]
  // เขียนโค้ดที่นี่
}
```

---

## 4. useEffect - Side Effects

### อธิบาย
`useEffect` ใช้สำหรับทำงานที่มี "side effects" เช่น fetch data, subscribe events, update DOM โดยตรง จะทำงานหลังจาก component render เสร็จ

### Syntax
```javascript
useEffect(() => {
  // ทำงานที่ต้องการ
  
  return () => {
    // cleanup (optional)
  };
}, [dependencies]); // dependency array
```

### ตัวอย่าง

```javascript
import { useState, useEffect } from 'react';

// ตัวอย่างที่ 1: Fetch Data เมื่อ Component Mount
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []); // [] = ทำงานครั้งเดียวตอน mount
  
  if (loading) return <p>กำลังโหลด...</p>;
  return <div>{user.name}</div>;
}

// ตัวอย่างที่ 2: Dependency Array
function RestaurantList({ category }) {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    console.log('Fetch restaurants:', category);
    
    fetch(`/api/restaurants?category=${category}`)
      .then(res => res.json())
      .then(data => setRestaurants(data));
      
  }, [category]); // ทำงานใหม่ทุกครั้งที่ category เปลี่ยน
  
  return <div>/* แสดงร้าน */</div>;
}

// ตัวอย่างที่ 3: Cleanup Function
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    // เริ่ม interval
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup: หยุด interval เมื่อ component unmount
    return () => {
      clearInterval(interval);
      console.log('Timer stopped');
    };
  }, []);
  
  return <p>เวลา: {seconds} วินาที</p>;
}

// ตัวอย่างที่ 4: Debounce Search
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // รอ 500ms หลังจากผู้ใช้พิมพ์หยุด
    const timer = setTimeout(() => {
      if (searchTerm) {
        console.log('Searching:', searchTerm);
        // fetch ข้อมูล
      }
    }, 500);
    
    // Cleanup: ยกเลิก timer เก่าเมื่อ searchTerm เปลี่ยน
    return () => clearTimeout(timer);
    
  }, [searchTerm]);
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="ค้นหา..."
    />
  );
}

// ตัวอย่างที่ 5: Multiple Effects
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Effect 1: Fetch user
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);
  
  // Effect 2: Fetch posts
  useEffect(() => {
    fetch(`/api/posts?userId=${userId}`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [userId]);
  
  // Effect 3: Update document title
  useEffect(() => {
    if (user) {
      document.title = `Dashboard - ${user.name}`;
    }
  }, [user]);
  
  return <div>/* Dashboard */</div>;
}

// ตัวอย่างที่ 6: Dependency Array แต่ละแบบ
function Examples() {
  const [count, setCount] = useState(0);
  
  // 1. ไม่มี dependency array: ทำงานทุกครั้งที่ render
  useEffect(() => {
    console.log('Every render');
  });
  
  // 2. Empty array []: ทำงานครั้งเดียวตอน mount
  useEffect(() => {
    console.log('Only on mount');
  }, []);
  
  // 3. มี dependencies: ทำงานเมื่อ dependencies เปลี่ยน
  useEffect(() => {
    console.log('When count changes:', count);
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>+</button>;
}
```

### Async/Await ใน useEffect
```javascript
function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // ❌ ผิด: useEffect callback ไม่สามารถเป็น async ได้โดยตรง
    // useEffect(async () => { ... }, []);
    
    // ✓ ถูก: สร้าง async function ข้างใน
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchData();
  }, []);
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

### แบบฝึกหัด
```javascript
// โจทย์ 1: สร้าง Component ที่ fetch restaurants
// - เมื่อ mount ให้ fetch ข้อมูลจาก API
// - แสดง "กำลังโหลด..." ขณะรอ
// - แสดงรายการเมื่อโหลดเสร็จ

// โจทย์ 2: สร้าง Search ที่มี debounce
// - รอ 500ms หลังจากผู้ใช้พิมพ์หยุด
// - ถึงค่อย console.log คำค้นหา

// โจทย์ 3: สร้าง Component ที่ฟังการ resize window
// - แสดงขนาดหน้าจอปัจจุบัน
// - อัพเดทเมื่อ resize
// - ต้องมี cleanup
```

---

## 5. Event Handling

### อธิบาย
Event Handling คือการจับเหตุการณ์ต่างๆ เช่น คลิก พิมพ์ ส่งฟอร์ม ใน React เราส่ง function เข้าไปใน event prop

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: onClick
function Button() {
  const handleClick = () => {
    alert('ถูกคลิก!');
  };
  
  return <button onClick={handleClick}>คลิกที่นี่</button>;
}

// ตัวอย่างที่ 2: onClick with Parameters
function ProductList() {
  const handleBuy = (productName) => {
    console.log(`ซื้อ: ${productName}`);
  };
  
  return (
    <div>
      {/* ต้องใช้ arrow function เพื่อส่ง parameter */}
      <button onClick={() => handleBuy('เสื้อ')}>ซื้อเสื้อ</button>
      <button onClick={() => handleBuy('กางเกง')}>ซื้อกางเกง</button>
    </div>
  );
}

// ตัวอย่างที่ 3: onChange (Input)
function NameInput() {
  const [name, setName] = useState('');
  
  const handleChange = (event) => {
    const value = event.target.value;
    setName(value);
    console.log('กำลังพิมพ์:', value);
  };
  
  return (
    <div>
      <input 
        value={name}
        onChange={handleChange}
      />
      <p>ชื่อ: {name}</p>
    </div>
  );
}

// ตัวอย่างที่ 4: onSubmit (Form)
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault(); // ป้องกันการ refresh หน้า
    
    console.log('Login:', { email, password });
    
    // ส่งข้อมูลไป API
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">เข้าสู่ระบบ</button>
    </form>
  );
}

// ตัวอย่างที่ 5: Multiple Event Handlers
function FileUpload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        border: dragging ? '2px solid blue' : '2px dashed gray',
        padding: '20px'
      }}
    >
      {file ? `ไฟล์: ${file.name}` : 'ลากไฟล์มาที่นี่'}
    </div>
  );
}

// ตัวอย่างที่ 6: Keyboard Events
function SearchBox() {
  const [query, setQuery] = useState('');
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('กด Enter - ค้นหา:', query);
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="พิมพ์แล้วกด Enter"
    />
  );
}

// ตัวอย่างที่ 7: Event Object
function EventDemo() {
  const handleClick = (event) => {
    console.log('Event type:', event.type);           // "click"
    console.log('Target element:', event.target);     // element ที่ถูกคลิก
    console.log('Mouse X:', event.clientX);           // ตำแหน่ง X ของเมาส์
    console.log('Mouse Y:', event.clientY);           // ตำแหน่ง Y ของเมาส์
  };
  
  const handleInput = (event) => {
    console.log('Input value:', event.target.value);
    console.log('Input name:', event.target.name);
  };
  
  return (
    <div>
      <button onClick={handleClick}>คลิกดูข้อมูล Event</button>
      <input 
        name="username"
        onChange={handleInput}
      />
    </div>
  );
}
```

### Common Events
```javascript
// Mouse Events
<button onClick={handler}>         // คลิก
<div onDoubleClick={handler}>      // ดับเบิลคลิก
<div onMouseEnter={handler}>       // เมาส์เข้า
<div onMouseLeave={handler}>       // เมาส์ออก
<div onMouseMove={handler}>        // เมาส์เคลื่อนไหว

// Keyboard Events
<input onKeyDown={handler} />      // กดปุ่มลง
<input onKeyUp={handler} />        // ปล่อยปุ่ม
<input onKeyPress={handler} />     // กดปุ่ม (deprecated)

// Form Events
<form onSubmit={handler}>          // ส่งฟอร์ม
<input onChange={handler} />       // เปลี่ยนค่า
<input onFocus={handler} />        // โฟกัส
<input onBlur={handler} />         // เลิกโฟกัส

// Clipboard Events
<input onCopy={handler} />         // คัดลอก
<input onPaste={handler} />        // วาง
<input onCut={handler} />          // ตัด
```

### แบบฝึกหัด
```javascript
// โจทย์: สร้าง Calculator
// - มีปุ่มตัวเลข 0-9
// - มีปุ่ม + - * /
// - มีปุ่ม = เพื่อคำนวณ
// - มีปุ่ม C เพื่อเคลียร์
// - แสดงผลลัพธ์

function Calculator() {
  // เขียนโค้ดที่นี่
}
```

---

## 6. Lists & Keys

### อธิบาย
การแสดงรายการข้อมูลใน React ใช้ `.map()` เพื่อวนลูป array และสร้าง elements ทุก element ต้องมี `key` prop ที่เป็น unique เพื่อให้ React track การเปลี่ยนแปลงได้ถูกต้อง

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: Basic List
function FruitList() {
  const fruits = ['แอปเปิล', 'กล้วย', 'ส้ม', 'มะม่วง'];
  
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}

// ตัวอย่างที่ 2: List with Objects (ใช้ id เป็น key)
function UserList() {
  const users = [
    { id: 1, name: 'สมชาย', age: 25 },
    { id: 2, name: 'สมหญิง', age: 23 },
    { id: 3, name: 'สมศักดิ์', age: 30 }
  ];
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>อายุ: {user.age} ปี</p>
        </div>
      ))}
    </div>
  );
}

// ตัวอย่างที่ 3: Restaurant Cards (ใช้ในโปรเจค)
function RestaurantGrid({ restaurants, onSelectRestaurant }) {
  return (
    <div className="restaurant-grid">
      {restaurants.map(restaurant => (
        <RestaurantCard 
          key={restaurant.id}
          restaurant={restaurant}
          onClick={onSelectRestaurant}
        />
      ))}
    </div>
  );
}

// ตัวอย่างที่ 4: Nested Lists
function CategoryList() {
  const categories = [
    { 
      id: 1, 
      name: 'อาหารไทย',
      items: ['ส้มตำ', 'ผัดไทย', 'ต้มยำ']
    },
    { 
      id: 2, 
      name: 'อาหารญี่ปุ่น',
      items: ['ซูชิ', 'ราเมง', 'เทมปุระ']
    }
  ];
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ตัวอย่างที่ 5: Empty List Handling
function ProductList({ products }) {
  if (products.length === 0) {
    return <p>ไม่มีสินค้า</p>;
  }
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.name} - ฿{product.price}
        </div>
      ))}
    </div>
  );
}

// ตัวอย่างที่ 6: List with Actions
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'ซื้อของ', done: false },
    { id: 2, text: 'ทำงาน', done: true },
    { id: 3, text: 'ออกกำลังกาย', done: false }
  ]);
  
  const toggleDone = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, done: !todo.done }
        : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input 
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleDone(todo.id)}
          />
          <span style={{ 
            textDecoration: todo.done ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>ลบ</button>
        </li>
      ))}
    </ul>
  );
}

// ตัวอย่างที่ 7: Filtering Lists
function RestaurantList() {
  const [category, setCategory] = useState('ทั้งหมด');
  
  const restaurants = [
    { id: 1, name: 'ส้มตำ', category: 'อาหารไทย' },
    { id: 2, name: 'ซูชิ', category: 'อาหารญี่ปุ่น' },
    { id: 3, name: 'ผัดไทย', category: 'อาหารไทย' }
  ];
  
  const filteredRestaurants = category === 'ทั้งหมด'
    ? restaurants
    : restaurants.filter(r => r.category === category);
  
  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option>ทั้งหมด</option>
        <option>อาหารไทย</option>
        <option>อาหารญี่ปุ่น</option>
      </select>
      
      {filteredRestaurants.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

### Key Rules

```javascript
// ✓ ดี - ใช้ unique id
{items.map(item => <div key={item.id}>{item.name}</div>)}

// ⚠️ พอใช้ - ใช้ index (เฉพาะ list ที่ไม่เปลี่ยนแปลง)
{items.map((item, index) => <div key={index}>{item}</div>)}

// ❌ ห้าม - ไม่มี key
{items.map(item => <div>{item}</div>)}

// ❌ ห้าม - key ซ้ำกัน
{items.map(() => <div key="same-key">...</div>)}

// ❌ ห้าม - ใช้ random
{items.map(item => <div key={Math.random()}>...</div>)}
```

### แบบฝึกหัด
```javascript
// โจทย์ 1: สร้าง Comment List
// แสดงรายการความคิดเห็น (ชื่อ, ข้อความ, วันที่)
// เรียงจากใหม่สุดไปเก่าสุด

// โจทย์ 2: สร้าง Filterable Product List
// - กรองตามหมวดหมู่
// - กรองตามราคา (ต่ำกว่า 1000)
// - เรียงตาม: ชื่อ, ราคา

// โจทย์ 3: สร้าง Review List
// - แสดงรีวิว (ดาว, ข้อความ, ผู้รีวิว)
// - มีปุ่มลบรีวิว
// - แสดงจำนวนรีวิวทั้งหมด
```

---

## 7. Conditional Rendering

### อธิบาย
การแสดง UI แบบมีเงื่อนไข ใช้เมื่อต้องการแสดง/ซ่อน elements ตามสถานะต่างๆ

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: if-else (Early Return)
function Greeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return <h1>สวัสดี {username}!</h1>;
  }
  return <h1>กรุณาเข้าสู่ระบบ</h1>;
}

// ตัวอย่างที่ 2: Ternary Operator (? :)
function LoginButton({ isLoggedIn, onLogin, onLogout }) {
  return (
    <button onClick={isLoggedIn ? onLogout : onLogin}>
      {isLoggedIn ? 'ออกจากระบบ' : 'เข้าสู่ระบบ'}
    </button>
  );
}

// ตัวอย่างที่ 3: Logical AND (&&)
function Notification({ hasNotification, count }) {
  return (
    <div>
      <h1>การแจ้งเตือน</h1>
      {hasNotification && (
        <p>คุณมีการแจ้งเตือน {count} รายการ</p>
      )}
      {!hasNotification && (
        <p>ไม่มีการแจ้งเตือน</p>
      )}
    </div>
  );
}

// ตัวอย่างที่ 4: Loading States
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  // แยกเป็น 3 states
  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;
  if (!user) return <div>ไม่พบผู้ใช้</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// ตัวอย่างที่ 5: Multiple Conditions
function RestaurantCard({ restaurant }) {
  const isOpen = restaurant.openNow;
  const hasReviews = restaurant.totalReviews > 0;
  const isHighRated = restaurant.averageRating >= 4;
  
  return (
    <div className="card">
      <h3>{restaurant.name}</h3>
      
      {/* Badge สถานะเปิด/ปิด */}
      <span className={isOpen ? 'badge-open' : 'badge-closed'}>
        {isOpen ? 'เปิดอยู่' : 'ปิดแล้ว'}
      </span>
      
      {/* แสดง rating ถ้ามีรีวิว */}
      {hasReviews ? (
        <div>
          ⭐ {restaurant.averageRating.toFixed(1)}
          ({restaurant.totalReviews} รีวิว)
        </div>
      ) : (
        <div>ยังไม่มีรีวิว</div>
      )}
      
      {/* แสดง recommended badge */}
      {isHighRated && hasReviews && (
        <span className="recommended">แนะนำ!</span>
      )}
    </div>
  );
}

// ตัวอย่างที่ 6: Switch-like Behavior
function StatusBadge({ status }) {
  const statusConfig = {
    pending: { text: 'รอดำเนินการ', color: 'yellow' },
    processing: { text: 'กำลังดำเนินการ', color: 'blue' },
    completed: { text: 'เสร็จสิ้น', color: 'green' },
    cancelled: { text: 'ยกเลิก', color: 'red' }
  };
  
  const config = statusConfig[status] || { text: 'ไม่ทราบสถานะ', color: 'gray' };
  
  return (
    <span style={{ color: config.color }}>
      {config.text}
    </span>
  );
}

// ตัวอย่างที่ 7: Null Rendering (ไม่แสดงอะไร)
function AdminPanel({ isAdmin }) {
  // ถ้าไม่ใช่ admin ไม่แสดงอะไรเลย
  if (!isAdmin) return null;
  
  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      {/* ... */}
    </div>
  );
}

// ตัวอย่างที่ 8: Complex Conditions
function RestaurantList({ restaurants, loading, error, searchTerm }) {
  // Loading
  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }
  
  // Error
  if (error) {
    return (
      <div className="error">
        <p>เกิดข้อผิดพลาด: {error}</p>
        <button onClick={() => window.location.reload()}>
          ลองใหม่
        </button>
      </div>
    );
  }
  
  // Empty results
  if (restaurants.length === 0) {
    return (
      <div className="no-results">
        {searchTerm ? (
          <p>ไม่พบร้าน "{searchTerm}" ลองค้นหาใหม่</p>
        ) : (
          <p>ยังไม่มีร้านอาหาร</p>
        )}
      </div>
    );
  }
  
  // Normal render
  return (
    <div className="restaurant-grid">
      {restaurants.map(r => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}

// ตัวอย่างที่ 9: Inline Styles with Conditions
function PriceTag({ price, onSale }) {
  return (
    <span style={{
      color: onSale ? 'red' : 'black',
      fontSize: onSale ? '20px' : '16px',
      fontWeight: onSale ? 'bold' : 'normal'
    }}>
      ฿{price}
      {onSale && ' (ลดราคา!)'}
    </span>
  );
}
```

### Patterns สำคัญ

```javascript
// Pattern 1: Loading → Error → Empty → Data
function DataDisplay({ data, loading, error }) {
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!data || data.length === 0) return <Empty />;
  return <Data items={data} />;
}

// Pattern 2: Short-circuit Evaluation
{isLoggedIn && <UserMenu />}
{error && <ErrorMessage>{error}</ErrorMessage>}
{items.length > 0 && <ItemList items={items} />}

// Pattern 3: Default Values
const displayName = user?.name || 'ไม่ระบุชื่อ';
const rating = restaurant.averageRating || 0;
```

### แบบฝึกหัด
```javascript
// โจทย์ 1: สร้าง WeatherWidget
// แสดง:
// - กำลังโหลด... (ขณะ fetch)
// - อุณหภูมิและไอคอน (เมื่อโหลดเสร็จ)
// - "ร้อน" ถ้า > 35°C (สีแดง)
// - "เย็น" ถ้า < 20°C (สีน้ำเงิน)

// โจทย์ 2: สร้าง ShoppingCart
// - ถ้าตะกร้าว่าง แสดง "ตะกร้าว่าง"
// - ถ้ามีสินค้า แสดงรายการ
// - ถ้ายอดรวม > 1000 แสดง "ส่งฟรี!"
```

---

## 8. Fetching Data

### อธิบาย
การดึงข้อมูลจาก API โดยใช้ `fetch()` API ซึ่งเป็น standard ของ JavaScript สำหรับ HTTP requests

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: Basic GET Request
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:3000/api/restaurants')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRestaurants(data.data); // data.data เพราะ API ส่งมาเป็น { success: true, data: [...] }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {restaurants.map(r => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
}

// ตัวอย่างที่ 2: Async/Await (สะอาดกว่า)
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:3000/api/restaurants');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRestaurants(data.data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  // ... render
}

// ตัวอย่างที่ 3: GET with Query Parameters
function SearchRestaurants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      // สร้าง query string
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      
      const url = `http://localhost:3000/api/restaurants?${params}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.data);
    };
    
    fetchData();
  }, [searchTerm, category]); // fetch ใหม่เมื่อ searchTerm หรือ category เปลี่ยน
  
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ค้นหา..."
      />
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">ทั้งหมด</option>
        <option value="อาหารไทย">อาหารไทย</option>
        <option value="อาหารญี่ปุ่น">อาหารญี่ปุ่น</option>
      </select>
      
      {results.map(r => <div key={r.id}>{r.name}</div>)}
    </div>
  );
}

// ตัวอย่างที่ 4: POST Request
function AddReviewForm({ restaurantId, onSuccess }) {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurantId,
          ...formData
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }
      
      const result = await response.json();
      alert('เพิ่มรีวิวสำเร็จ!');
      
      // Reset form
      setFormData({ userName: '', rating: 5, comment: '' });
      
      // Callback เพื่อ refresh data
      if (onSuccess) onSuccess();
      
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.userName}
        onChange={(e) => setFormData({...formData, userName: e.target.value})}
        placeholder="ชื่อ"
        required
      />
      <select 
        value={formData.rating}
        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
      >
        <option value="5">5 ดาว</option>
        <option value="4">4 ดาว</option>
        <option value="3">3 ดาว</option>
        <option value="2">2 ดาว</option>
        <option value="1">1 ดาว</option>
      </select>
      <textarea 
        value={formData.comment}
        onChange={(e) => setFormData({...formData, comment: e.target.value})}
        placeholder="ความคิดเห็น"
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
      </button>
    </form>
  );
}

// ตัวอย่างที่ 5: API Service (แยก logic)
// ไฟล์ api.js
const API_URL = 'http://localhost:3000/api';

export const getRestaurants = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/restaurants?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  
  return await response.json();
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${API_URL}/restaurants/${id}`);
  
  if (!response.ok) {
    throw new Error('Restaurant not found');
  }
  
  return await response.json();
};

export const addReview = async (reviewData) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
};

// การใช้งาน
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRestaurants({ category: 'อาหารไทย' });
        setRestaurants(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    loadData();
  }, []);
  
  // ...
}

// ตัวอย่างที่ 6: Abort Controller (ยกเลิก request)
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    const searchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/restaurants?search=${query}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data.data);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request cancelled');
        }
      }
    };
    
    if (query) {
      searchData();
    }
    
    return () => controller.abort(); // ยกเลิกเมื่อ query เปลี่ยนก่อนที่จะเสร็จ
  }, [query]);
  
  // ...
}

// ตัวอย่างที่ 7: Error Handling แบบละเอียด
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/data');
        
        // Check HTTP status
        if (response.status === 404) {
          throw new Error('ไม่พบข้อมูล');
        }
        if (response.status === 500) {
          throw new Error('เซิร์ฟเวอร์มีปัญหา');
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
        
      } catch (err) {
        if (err.name === 'TypeError') {
          setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Common Patterns

```javascript
// Pattern 1: Fetch on Mount
useEffect(() => {
  fetchData();
}, []); // empty array = run once

// Pattern 2: Fetch on Dependency Change
useEffect(() => {
  fetchData();
}, [id, filters]); // re-fetch when id or filters change

// Pattern 3: Debounce Search
useEffect(() => {
  const timer = setTimeout(() => {
    fetchData();
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

// Pattern 4: Loading States
const [loading, setLoading] = useState(true);
try {
  setLoading(true);
  await fetchData();
} finally {
  setLoading(false);
}
```

### แบบฝึกหัด
```javascript
// โจทย์ 1: สร้าง UserProfile component
// - Fetch ข้อมูลผู้ใช้จาก /api/users/:id
// - แสดง loading
// - แสดง error ถ้ามี
// - แสดงข้อมูล: ชื่อ, email, avatar

// โจทย์ 2: สร้าง ProductSearch
// - มี input ค้นหา
// - Fetch ทุกครั้งที่พิมพ์ (แต่มี debounce 500ms)
// - แสดงผลลัพธ์

// โจทย์ 3: สร้าง CommentForm
// - POST comment ไปยัง /api/comments
// - แสดง loading ขณะส่ง
// - แสดงข้อความสำเร็จ/ล้มเหลว
// - Reset form หลังส่งสำเร็จ
```

---

## 9. Form Handling

### อธิบาย
Form handling ใน React ใช้ "Controlled Components" คือ input ที่มี value ผูกกับ state และอัพเดท state ผ่าน onChange

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: Simple Form
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault(); //

    console.log('Login:', { email, password });
    // ส่งไป API
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="อีเมล"
        required
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="รหัสผ่าน"
        required
      />
      <button type="submit">เข้าสู่ระบบ</button>
    </form>
  );
}

// ตัวอย่างที่ 2: Form with Object State
function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="ชื่อผู้ใช้"
      />
      <input 
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="อีเมล"
      />
      <input 
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="รหัสผ่าน"
      />
      <input 
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="ยืนยันรหัสผ่าน"
      />
      <label>
        <input 
          name="agreeTerms"
          type="checkbox"
          checked={formData.agreeTerms}
          onChange={handleChange}
        />
        ยอมรับเงื่อนไข
      </label>
      <button type="submit">สมัครสมาชิก</button>
    </form>
  );
}

// ตัวอย่างที่ 3: Form Validation
function ReviewForm() {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    // ตรวจสอบชื่อ
    if (!formData.userName.trim()) {
      newErrors.userName = 'กรุณากรอกชื่อ';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    }
    
    // ตรวจสอบความคิดเห็น
    if (!formData.comment.trim()) {
      newErrors.comment = 'กรุณากรอกความคิดเห็น';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'ความคิดเห็นต้องมีอย่างน้อย 10 ตัวอักษร';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Form valid - ส่งข้อมูล
    console.log('Submit:', formData);
    setErrors({});
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input 
          value={formData.userName}
          onChange={(e) => setFormData({...formData, userName: e.target.value})}
          placeholder="ชื่อ"
        />
        {errors.userName && (
          <span style={{ color: 'red' }}>{errors.userName}</span>
        )}
      </div>
      
      <div>
        <select 
          value={formData.rating}
          onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
        >
          <option value="5">5 ดาว</option>
          <option value="4">4 ดาว</option>
          <option value="3">3 ดาว</option>
          <option value="2">2 ดาว</option>
          <option value="1">1 ดาว</option>
        </select>
      </div>
      
      <div>
        <textarea 
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          placeholder="ความคิดเห็น"
        />
        {errors.comment && (
          <span style={{ color: 'red' }}>{errors.comment}</span>
        )}
      </div>
      
      <button type="submit">ส่งรีวิว</button>
    </form>
  );
}

// ตัวอย่างที่ 4: Real-time Validation
function EmailInput() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Validate real-time
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(value) || value === '');
  };
  
  return (
    <div>
      <input 
        type="email"
        value={email}
        onChange={handleChange}
        style={{ borderColor: isValid ? 'green' : 'red' }}
      />
      {!isValid && <span style={{ color: 'red' }}>อีเมลไม่ถูกต้อง</span>}
    </div>
  );
}

// ตัวอย่างที่ 5: Multi-step Form
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    email: '',
    // Step 2
    address: '',
    phone: '',
    // Step 3
    cardNumber: '',
    cvv: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final submit:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <div>
          <h2>ข้อมูลส่วนตัว</h2>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="ชื่อ" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="อีเมล" />
          <button type="button" onClick={nextStep}>ถัดไป</button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h2>ที่อยู่</h2>
          <input name="address" value={formData.address} onChange={handleChange} placeholder="ที่อยู่" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="เบอร์โทร" />
          <button type="button" onClick={prevStep}>ย้อนกลับ</button>
          <button type="button" onClick={nextStep}>ถัดไป</button>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h2>ชำระเงิน</h2>
          <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="หมายเลขบัตร" />
          <input name="cvv" value={formData.cvv} onChange={handleChange} placeholder="CVV" />
          <button type="button" onClick={prevStep}>ย้อนกลับ</button>
          <button type="submit">ส่ง</button>
        </div>
      )}
    </form>
  );
}

// ตัวอย่างที่ 6: File Upload
function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // สร้าง preview สำหรับรูปภาพ
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    // ส่งไป API
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />
      {preview && <img src={preview} alt="Preview" width="200" />}
      <button type="submit" disabled={!file}>อัพโหลด</button>
    </form>
  );
}

// ตัวอย่างที่ 7: Dynamic Form Fields
function DynamicForm() {
  const [items, setItems] = useState([{ name: '', price: '' }]);
  
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { name: '', price: '' }]);
  };
  
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Items:', items);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {items.map((item, index) => (
        <div key={index}>
          <input 
            value={item.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            placeholder="ชื่อสินค้า"
          />
          <input 
            type="number"
            value={item.price}
            onChange={(e) => handleChange(index, 'price', e.target.value)}
            placeholder="ราคา"
          />
          {items.length > 1 && (
            <button type="button" onClick={() => removeItem(index)}>ลบ</button>
          )}
        </div>
      ))}
      
      <button type="button" onClick={addItem}>เพิ่มสินค้า</button>
      <button type="submit">ส่ง</button>
    </form>
  );
}
```

### Form Patterns

```javascript
// Pattern 1: Controlled Input
<input 
  value={state}
  onChange={(e) => setState(e.target.value)}
/>

// Pattern 2: Generic Handler
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

// Pattern 3: Validation on Submit
const handleSubmit = (e) => {
  e.preventDefault();
  const errors = validate(formData);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  // Submit...
};

// Pattern 4: Reset Form
const resetForm = () => {
  setFormData({ name: '', email: '' });
  setErrors({});
};
```

### แบบฝึกหัด
```javascript
// โจทย์: สร้าง Contact Form
// Fields: ชื่อ, อีเมล, เบอร์โทร, ข้อความ
// Validation:
// - ชื่อ: 2-50 ตัวอักษร
// - อีเมล: รูปแบบถูกต้อง
// - เบอร์: 10 หลัก
// - ข้อความ: 10-500 ตัวอักษร
// Features:
// - แสดง error แบบ real-time
// - ปุ่ม submit disabled ถ้า form ไม่ valid
// - แสดงความยาวของ textarea (x/500)
```

---

## 10. Component Communication

### อธิบาย
การสื่อสารระหว่าง components ใน React ทำได้หลายรูปแบบ แต่หลักการคือ "data flows down, events flow up"

### ตัวอย่าง

```javascript
// ตัวอย่างที่ 1: Parent to Child (Props)
function Parent() {
  const userData = { name: 'สมชาย', age: 25 };
  
  return <Child user={userData} />;
}

function Child({ user }) {
  return <div>สวัสดี {user.name}</div>;
}

// ตัวอย่างที่ 2: Child to Parent (Callback)
function Parent() {
  const [message, setMessage] = useState('');
  
  const handleMessage = (msg) => {
    setMessage(msg);
  };
  
  return (
    <div>
      <Child onSendMessage={handleMessage} />
      <p>ข้อความ: {message}</p>
    </div>
  );
}

function Child({ onSendMessage }) {
  const handleClick = () => {
    onSendMessage('สวัสดีจาก Child!');
  };
  
  return <button onClick={handleClick}>ส่งข้อความ</button>;
}

// ตัวอย่างที่ 3: Lifting State Up
function RestaurantApp() {
  const [selectedId, setSelectedId] = useState(null);
  
  return (
    <div>
      {selectedId ? (
        <RestaurantDetail 
          id={selectedId}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <RestaurantList 
          onSelect={setSelectedId}
        />
      )}
    </div>
  );
}

function RestaurantList({ onSelect }) {
  const restaurants = [/* ... */];
  
  return (
    <div>
      {restaurants.map(r => (
        <div key={r.id} onClick={() => onSelect(r.id)}>
          {r.name}
        </div>
      ))}
    </div>
  );
}

function RestaurantDetail({ id, onBack }) {
  return (
    <div>
      <button onClick={onBack}>กลับ</button>
      <h1>รายละเอียดร้าน {id}</h1>
    </div>
  );
}

// ตัวอย่างที่ 4: Sibling Communication (ผ่าน Parent)
function App() {
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => {
    setCart([...cart, item]);
  };
  
  return (
    <div>
      <ProductList onAddToCart={addToCart} />
      <ShoppingCart items={cart} />
    </div>
  );
}

function ProductList({ onAddToCart }) {
  const products = [
    { id: 1, name: 'เสื้อ', price: 500 },
    { id: 2, name: 'กางเกง', price: 800 }
  ];
  
  return (
    <div>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ฿{p.price}
          <button onClick={() => onAddToCart(p)}>เพิ่ม</button>
        </div>
      ))}
    </div>
  );
}

function ShoppingCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div>
      <h2>ตะกร้า ({items.length} รายการ)</h2>
      <p>ยอดรวม: ฿{total}</p>
    </div>
  );
}

// ตัวอย่างที่ 5: Search & Filter (Complex)
function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minRating: ''
  });
  
  useEffect(() => {
    // Fetch ด้วย filters
    fetchRestaurants(filters);
  }, [filters]);
  
  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };
  
  return (
    <div>
      <SearchBar 
        value={filters.search}
        onChange={(val) => updateFilter('search', val)}
      />
      <CategoryFilter 
        value={filters.category}
        onChange={(val) => updateFilter('category', val)}
      />
      <RestaurantGrid restaurants={restaurants} />
    </div>
  );
}

// ตัวอย่างที่ 6: Form with Review (ใช้ในโปรเจค)
function RestaurantDetail({ restaurantId }) {
  const [restaurant, setRestaurant] = useState(null);
  
  const refreshData = async () => {
    const data = await fetchRestaurant(restaurantId);
    setRestaurant(data);
  };
  
  useEffect(() => {
    refreshData();
  }, [restaurantId]);
  
  return (
    <div>
      <RestaurantInfo restaurant={restaurant} />
      <ReviewForm 
        restaurantId={restaurantId}
        onReviewAdded={refreshData} // Refresh หลังเพิ่มรีวิว
      />
      <ReviewList reviews={restaurant?.reviews} />
    </div>
  );
}

function ReviewForm({ restaurantId, onReviewAdded }) {
  const handleSubmit = async (data) => {
    await addReview({ ...data, restaurantId });
    onReviewAdded(); // แจ้ง parent ให้ refresh
  };
  
  return <form>...</form>;
}
```

### Communication Patterns

```javascript
// Pattern 1: Props Down
<Child data={parentData} config={settings} />

// Pattern 2: Callbacks Up
<Child onEvent={(value) => handleEvent(value)} />

// Pattern 3: Shared State in Parent
function Parent() {
  const [shared, setShared] = useState(null);
  return (
    <>
      <Child1 data={shared} onChange={setShared} />
      <Child2 data={shared} />
    </>
  );
}

// Pattern 4: Function as Children
<DataProvider>
  {(data) => <Display data={data} />}
</DataProvider>
```

### แบบฝึกหัด
```javascript
// โจทย์: สร้าง Todo App ที่มี 3 components
// 1. TodoInput - ใส่ todo ใหม่
// 2. TodoList - แสดงรายการ + ลบได้
// 3. TodoStats - แสดงสถิติ (ทั้งหมด, เสร็จแล้ว, ยังไม่เสร็จ)
// 
// ให้ 3 components สื่อสารกันผ่าน parent component
```

---



