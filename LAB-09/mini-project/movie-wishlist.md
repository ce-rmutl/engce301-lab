# 🎬 LAB Project: สร้างแอป Movie Wishlist

## ENGSE611 - Mini Project (HTML + CSS + React)

### 🎯 ภาพรวมโปรเจค

เราจะสร้างเว็บแอปพลิเคชันหน้าเดียว (Single Page Application) สำหรับบันทึกรายการหนังที่อยากดู ผู้ใช้จะสามารถ:

1.  เพิ่มชื่อหนังใหม่เข้าไปในลิสต์
2.  ลบหนังออกจากลิสต์
3.  ดูรายการหนังทั้งหมด
4.  ข้อมูลจะถูกบันทึกไว้ในเบราว์เซอร์ แม้จะปิดแล้วเปิดใหม่ (ด้วย `localStorage`)
5.  หน้าเว็บจะแสดงผลได้ดีทั้งบนคอมพิวเตอร์และมือถือ

### 🛠️ เทคโนโลยีที่ใช้

  - **HTML5**: สำหรับโครงสร้างเว็บแบบมีความหมาย (Semantic)
  - **CSS3**: สำหรับการจัดสไตล์และ Layout ด้วย Flexbox
  - **Responsive Design**: ด้วย Media Queries
  - **React.js**:
      - **`useState`**: สำหรับจัดการรายชื่อหนังและข้อมูลในฟอร์ม
      - **`useEffect`**: สำหรับการบันทึกและอ่านข้อมูลจาก `localStorage`

### 🚀 เริ่มต้นโปรเจค

1.  รันคำสั่ง `npx create-react-app movie-wishlist` ใน Terminal เพื่อสร้างโปรเจค React
2.  เข้าไปในโฟลเดอร์ `cd movie-wishlist`
3.  ลบไฟล์ทั้งหมดในโฟลเดอร์ `src` ยกเว้น `index.js` และ `index.css`
4.  รันโปรเจคด้วย `npm start`

-----

## ส่วนที่ 1: โครงสร้างและสไตล์ (HTML & CSS)

### ขั้นตอนที่ 1: สร้างไฟล์ CSS พื้นฐาน

เปิดไฟล์ `src/index.css` แล้วใส่โค้ดทั้งหมดนี้ลงไป นี่คือสไตล์ทั้งหมดที่เราจะใช้สำหรับโปรเจค

#### `src/index.css`

```css
/* ==================== CSS Variables & Global Styles ==================== */
:root {
  --bg-primary: #121829;
  --bg-secondary: #1a2238;
  --primary-color: #4a69e9;
  --text-primary: #f0f8ff;
  --text-secondary: #a9b3d1;
  --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  --border-radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

/* ==================== Main App Layout ==================== */
.app-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 20px;
}

.app-header h1 {
  color: var(--primary-color);
  font-size: 2.5rem;
}

.app-header p {
  color: var(--text-secondary);
}

/* ==================== Add Movie Form ==================== */
.add-movie-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.add-movie-form input {
  flex-grow: 1;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid var(--text-secondary);
  border-radius: var(--border-radius);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.add-movie-form input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.add-movie-form button {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.add-movie-form button:hover {
  background-color: #3a52b8;
  transform: translateY(-2px);
}

/* ==================== Movie List ==================== */
.movie-wishlist h2 {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.movie-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.movie-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.movie-item:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow);
}

.movie-item span {
  font-size: 1.1rem;
}

.movie-item button {
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s, transform 0.2s;
}

.movie-item button:hover {
  color: #ff1a1a;
  transform: scale(1.2);
}

.empty-list-message {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
  border: 2px dashed var(--text-secondary);
  border-radius: var(--border-radius);
}

/* ==================== Responsive Design ==================== */
@media (max-width: 600px) {
  .app-container {
    margin: 20px auto;
    padding: 15px;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .add-movie-form {
    flex-direction: column;
  }
}
```

### 🧠 **Challenge \#1 (CSS)**

1.  **เพิ่มสถานะ "ดูแล้ว"**: สร้าง CSS class ใหม่ชื่อ `.watched` เมื่อ `.movie-item` มี class นี้ ให้เปลี่ยน `border-left-color` เป็นสีเขียว (`#28a745`) และขีดฆ่าข้อความ (`text-decoration: line-through;`)
2.  **เพิ่ม Hover Effect**: ทำให้ปุ่ม "Add" ในฟอร์มมีเงา (`box-shadow`) สวยงามเมื่อนำเมาส์ไปชี้

-----

## ส่วนที่ 2: สร้าง Logic ด้วย React (JavaScript)

### ขั้นตอนที่ 2: สร้าง Component หลัก

สร้างไฟล์ `src/App.js` ขึ้นมาใหม่ และใส่โค้ดทั้งหมดนี้ลงไป นี่คือส่วน "สมอง" ของแอปพลิเคชันทั้งหมด

#### `src/App.js`

```javascript
import React, { useState, useEffect } from 'react';

// ชื่อ Key สำหรับใช้ใน Local Storage
const LOCAL_STORAGE_KEY = 'movieWishlistApp.movies';

function App() {
  // State 1: เก็บรายชื่อหนังทั้งหมด เป็น Array ของ Object
  const [movies, setMovies] = useState([]);
  
  // State 2: เก็บค่าจากช่อง input สำหรับเพิ่มหนังใหม่
  const [inputValue, setInputValue] = useState('');

  // useEffect 1: โหลดข้อมูลจาก Local Storage ตอนเปิดแอปครั้งแรก
  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedMovies) {
      setMovies(storedMovies);
    }
  }, []); // Dependency array ว่างเปล่า `[]` หมายถึงให้ทำงานแค่ครั้งเดียวตอน mount

  // useEffect 2: บันทึกข้อมูลลง Local Storage ทุกครั้งที่ `movies` state เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
  }, [movies]); // Dependency array คือ `[movies]` หมายถึงให้ทำงานทุกครั้งที่ movies เปลี่ยน

  // Function: จัดการเมื่อกดปุ่ม Add
  const handleAddMovie = (e) => {
    e.preventDefault(); // ป้องกันไม่ให้ฟอร์ม submit แล้วหน้า refresh
    if (inputValue.trim() === '') return; // ถ้า input ว่างเปล่า ไม่ต้องทำอะไร

    const newMovie = {
      id: Date.now(), // ใช้ timestamp เป็น ID แบบง่ายๆ
      text: inputValue,
      watched: false,
    };

    setMovies(prevMovies => [newMovie, ...prevMovies]); // เพิ่มหนังใหม่เข้าไปบนสุดของ Array
    setInputValue(''); // เคลียร์ช่อง input
  };

  // Function: จัดการเมื่อกดปุ่มลบ
  const handleDeleteMovie = (id) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 Movie Wishlist</h1>
        <p>What do you want to watch next?</p>
      </header>

      <main>
        <form className="add-movie-form" onSubmit={handleAddMovie}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., The Matrix"
          />
          <button type="submit">Add</button>
        </form>

        <section className="movie-wishlist">
          <h2>My List</h2>
          {movies.length > 0 ? (
            <ul className="movie-list">
              {movies.map(movie => (
                <li key={movie.id} className="movie-item">
                  <span>{movie.text}</span>
                  <button onClick={() => handleDeleteMovie(movie.id)}>
                    &times; {/* This is the 'X' symbol */}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-list-message">Your wishlist is empty. Add a movie to get started!</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
```

### ขั้นตอนที่ 3: ทำให้แอปแสดงผล

เปิดไฟล์ `src/index.js` และแก้ไขให้เป็นดังนี้:

#### `src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

ตอนนี้โปรเจคของคุณควรจะทำงานได้อย่างสมบูรณ์แล้ว\! ลองเพิ่มหนัง ลบหนัง และรีเฟรชหน้าเว็บดู

### 💡 คำอธิบายโค้ด JavaScript โดยละเอียด

1.  **`useState([])`**: เราสร้าง State ชื่อ `movies` สำหรับเก็บรายการหนังทั้งหมด โดยเริ่มต้นเป็น Array ว่าง
2.  **`useState('')`**: เราสร้าง State ชื่อ `inputValue` สำหรับผูกกับช่อง `input` ของฟอร์ม (Controlled Component)
3.  **`useEffect(() => { ... }, [])`**: Hook นี้จะทำงาน **แค่ครั้งเดียว** ตอนที่ `App` component ถูก render ขึ้นมาครั้งแรก เหมาะสำหรับการดึงข้อมูลเริ่มต้น เราใช้ `localStorage.getItem` เพื่อดึงข้อมูลที่เคยบันทึกไว้ และ `JSON.parse` เพื่อแปลงข้อความกลับมาเป็น Array
4.  **`useEffect(() => { ... }, [movies])`**: Hook นี้จะทำงาน **ทุกครั้งที่ `movies` state เปลี่ยนแปลง** (ไม่ว่าจะเพิ่มหรือลบ) เราใช้ `localStorage.setItem` เพื่อบันทึก `movies` array ปัจจุบันลงไป และ `JSON.stringify` เพื่อแปลง Array เป็นข้อความก่อนบันทึก
5.  **`handleAddMovie`**: ฟังก์ชันนี้ถูกเรียกเมื่อฟอร์มถูก submit
      * สร้าง `newMovie` object ที่มี `id` (ใช้ `Date.now()` เพื่อให้ไม่ซ้ำกัน), `text` จาก input, และ `watched` เป็น `false`
      * ใช้ `setMovies` เพื่ออัปเดต state โดยการสร้าง Array ใหม่ที่เอา `newMovie` มาไว้ข้างหน้าสุด แล้วตามด้วยหนังทั้งหมดที่มีอยู่เดิม (`...prevMovies`)
      * เคลียร์ค่าใน `inputValue` ให้เป็นค่าว่าง
6.  **`handleDeleteMovie`**: ฟังก์ชันนี้รับ `id` ของหนังที่ต้องการลบเข้ามา
      * ใช้ `setMovies` และ `filter` เพื่อสร้าง Array ใหม่ที่ **ไม่มี** หนังที่มี `id` ตรงกับที่ส่งเข้ามา
7.  **Conditional Rendering**: ในส่วน JSX เราใช้ `movies.length > 0 ? (...) : (...)` เพื่อตรวจสอบว่ามีหนังในลิสต์หรือไม่
      * ถ้ามี ให้แสดง `<ul>` ที่ `map` ข้อมูลใน `movies` array ออกมาเป็น `<li>` แต่ละรายการ
      * ถ้าไม่มี ให้แสดงข้อความ `Your wishlist is empty`

### 🧠 **Challenge \#2 (JavaScript)**

1.  **Implement ฟังก์ชัน "ดูแล้ว"**:
      * สร้างฟังก์ชันใหม่ชื่อ `handleToggleWatched(id)`
      * ภายในฟังก์ชันนี้ ให้ใช้ `setMovies` และ `.map()` เพื่อวนลูปใน `movies` array
      * สำหรับหนังตัวที่ `id` ตรงกับที่ส่งมา ให้สร้าง object ใหม่ขึ้นมาโดยคัดลอกค่าเดิมทั้งหมด (`...movie`) แล้วสลับค่า `watched` (`watched: !movie.watched`)
      * สำหรับหนังตัวอื่น ให้ return หนังตัวเดิมกลับไป
2.  **เชื่อมต่อกับ UI**:
      * ใน `<li>` ของ `movie-item` เพิ่ม `className` แบบมีเงื่อนไข: `className={\`movie-item ${movie.watched ? 'watched' : ''}\`}\` เพื่อให้ CSS จาก Challenge \#1 ทำงาน
      * ทำให้ข้อความ `<span>` ของหนังสามารถคลิกได้ โดยเพิ่ม `onClick={() => handleToggleWatched(movie.id)}` และเพิ่มสไตล์ `cursor: pointer` ให้กับ `span` ใน CSS ด้วย

-----
