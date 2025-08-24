# LAB-07:Frontend Development with Modern JavaScript (ES6+)
#### **Lab: ฝึกใช้ ES6+, DOM Manipulation, และ fetch() API**

## Part 2: อัปเกรด Weather App ด้วย Local Storage และ Git Flow

### **ภาพรวมของ Workshop**

  * **เป้าหมาย:** ต่อยอดจาก Weather App เดิม เพิ่มความสามารถในการบันทึก "เมืองโปรด" (Favorite Cities) และเรียนรู้กระบวนการพัฒนาซอฟต์แวร์เบื้องต้น
  * **ระยะเวลา:** 2-3 ชั่วโมง
  * **สิ่งที่จะได้เรียนรู้:**
      * **Git Flow:** การสร้าง `feature branch` เพื่อพัฒนาฟีเจอร์ใหม่
      * **`localStorage`:** การจัดเก็บข้อมูลแบบถาวรในเบราว์เซอร์ด้วย `JSON.stringify()` และ `JSON.parse()`
      * **Dynamic UI:** การสร้างและลบ Element ตามข้อมูลที่บันทึกไว้
      * **Event Delegation:** เทคนิคการจัดการ Event ที่มีประสิทธิภาพ
      * **Deployment:** การนำเว็บแอปพลิเคชันขึ้นสู่อินเทอร์เน็ตด้วย Netlify
  * **สิ่งที่ต้องมี:**
      * โปรเจกต์ Weather App ที่ทำเสร็จจาก Part 1
      * บัญชี GitHub และ Netlify

-----

## **ส่วนที่ 1: เริ่มต้น Feature ใหม่ด้วย Git Flow (ส่วนที่อาจารย์เตรียมให้ 50%)**

ก่อนจะเริ่มเขียนโค้ด เราจะสร้าง "Branch" ใหม่สำหรับฟีเจอร์นี้โดยเฉพาะ นี่เป็นวิธีปฏิบัติมาตรฐาน (Best Practice) เพื่อไม่ให้กระทบกับโค้ดหลัก (main) ที่ทำงานได้ดีอยู่แล้ว

### **ขั้นตอนที่ 1.1: สร้าง Feature Branch**

1.  เปิดโปรเจกต์ Weather App ของคุณใน VS Code และเปิด Terminal ขึ้นมา
2.  ตรวจสอบให้แน่ใจว่าคุณอยู่ที่ branch `main` โดยใช้คำสั่ง:
    ```bash
    git status
    ```
3.  สร้าง branch ใหม่ชื่อ `feature/local-storage` แล้วสลับไปใช้งาน branch นั้นทันทีด้วยคำสั่งเดียว:
    ```bash
    git checkout -b feature/local-storage
    ```
    *(คำสั่งนี้เป็นการรวม `git branch feature/local-storage` และ `git checkout feature/local-storage` ไว้ด้วยกัน)*

### **ขั้นตอนที่ 1.2: อัปเกรด `index.html`**

เราจะเพิ่มส่วนสำหรับแสดงรายการเมืองโปรด (`#favorites-container`) และปุ่ม Refresh **(คัดลอกโค้ดนี้ไปทับไฟล์ `index.html` เดิมทั้งหมด)**

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App with Favorites</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <h1>Weather App</h1>
        <form id="search-form">
            <input type="text" id="city-input" placeholder="เพิ่มเมืองโปรด..." required>
            <button type="submit">เพิ่ม</button>
        </form>
        
        <div class="header-bar">
            <h2>เมืองโปรด</h2>
            <button id="refresh-btn">Refresh 🔄</button>
        </div>
        
        <div id="favorites-container">
            </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### **ขั้นตอนที่ 1.3: อัปเกรด `style.css`**

เพิ่มสไตล์สำหรับ Element ใหม่ๆ ที่เราเพิ่งสร้างไป **(นำโค้ดนี้ไปต่อท้ายไฟล์ `style.css` เดิม)**

```css
/* --- ใช้ CSS เดิมทั้งหมด และเพิ่มส่วนนี้ต่อท้าย --- */

.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    border-bottom: 1px solid #006494;
    padding-bottom: 0.5rem;
}

#refresh-btn {
    background: none;
    border: 1px solid #00A6FB;
    color: #00A6FB;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
}

#refresh-btn:hover {
    background: #00A6FB;
    color: #051923;
}

#favorites-container {
    margin-top: 1rem;
    display: grid;
    gap: 1rem;
}

.weather-card {
    background: #051923;
    padding: 1rem;
    border-radius: 0.75rem;
    border-left: 5px solid #00A6FB;
    text-align: left;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.weather-card h3 {
    margin: 0;
    color: #E0E1DD;
}

.weather-card .temp {
    font-size: 2rem;
    font-weight: bold;
}

.weather-card .remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
}
```

### **ขั้นตอนที่ 1.4: Commit การตั้งค่า UI**

บันทึกการเปลี่ยนแปลงโครงสร้างนี้ลงใน branch ของเรา

```bash
git add .
git commit -m "feat: Setup UI for favorite cities feature"
```

-----

## **ส่วนที่ 2: ทำความรู้จักกับ Local Storage**

`localStorage` คือที่เก็บข้อมูลขนาดเล็กในเบราว์เซอร์ที่สามารถเก็บข้อมูลข้าม Session ได้ (ปิดเบราว์เซอร์แล้วเปิดใหม่ข้อมูลยังอยู่)

  * **สำคัญ:** `localStorage` เก็บได้แค่ **String** เท่านั้น\!
  * **`localStorage.setItem('key', 'value')`**: บันทึกข้อมูล
  * **`localStorage.getItem('key')`**: อ่านข้อมูล
  * **`localStorage.removeItem('key')`**: ลบข้อมูล

ถ้าเราจะเก็บข้อมูลที่ซับซ้อนอย่าง Array หรือ Object เราต้องแปลงมันเป็น String ก่อนด้วย `JSON.stringify()` และแปลงกลับเมื่อจะใช้งานด้วย `JSON.parse()`

```javascript
// การเก็บ Array
const fruits = ['apple', 'banana'];
localStorage.setItem('myFruits', JSON.stringify(fruits));

// การนำกลับมาใช้
const storedFruits = JSON.parse(localStorage.getItem('myFruits'));
// storedFruits จะกลายเป็น ['apple', 'banana']
```

-----

## **ส่วนที่ 3: ลงมือเขียนโค้ด (ส่วนของนักศึกษา 50%)**

**ลบโค้ดในไฟล์ `script.js` ของคุณทั้งหมด** แล้วใช้โค้ดเริ่มต้นด้านล่างนี้แทน จากนั้นทำตามภารกิจในแต่ละ `// TODO:`

### **`script.js` (โค้ดเริ่มต้น)**

```javascript
const apiKey = 'YOUR_API_KEY_HERE';

// 1. เลือก DOM Elements
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const favoritesContainer = document.querySelector('#favorites-container');
const refreshBtn = document.querySelector('#refresh-btn');

// --- EVENT LISTENERS ---
// โหลดเมืองโปรดเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', loadFavoriteCities);

// จัดการการเพิ่มเมืองใหม่
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        addCityToFavorites(cityName);
        cityInput.value = '';
    }
});

// จัดการการลบเมือง
favoritesContainer.addEventListener('click', event => {
    // TODO: ภารกิจที่ 4 - เขียน Logic การลบเมือง (ใช้ Event Delegation)
    // 1. เช็คว่า element ที่ถูกคลิกมี class 'remove-btn' หรือไม่
    // 2. ถ้าใช่ ให้หาชื่อเมืองจาก parent element ที่ใกล้ที่สุด (.weather-card)
    //    คำใบ้: event.target.closest('.weather-card').dataset.city
    // 3. ถ้าได้ชื่อเมืองมาแล้ว ให้เรียกใช้ฟังก์ชัน removeCityFromFavorites(cityName)
});

// จัดการการ Refresh
refreshBtn.addEventListener('click', loadFavoriteCities);


// --- FUNCTIONS ---

function getFavoriteCities() {
    // TODO: ภารกิจที่ 1.1 - เขียนฟังก์ชันเพื่อดึงรายชื่อเมืองจาก localStorage
    // คำใบ้: ใช้ localStorage.getItem('favoriteCities') และ JSON.parse()
    // ถ้าไม่มีข้อมูล ให้ return array ว่าง []
    const citiesJSON = localStorage.getItem('favoriteCities');
    return citiesJSON ? JSON.parse(citiesJSON) : [];
}

function saveFavoriteCities(cities) {
    // TODO: ภารกิจที่ 1.2 - เขียนฟังก์ชันเพื่อบันทึกรายชื่อเมืองลง localStorage
    // คำใบ้: ใช้ localStorage.setItem('favoriteCities', ...) และ JSON.stringify()
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
}

function loadFavoriteCities() {
    favoritesContainer.innerHTML = ''; // เคลียร์ของเก่าก่อน
    const cities = getFavoriteCities();
    // TODO: ภารกิจที่ 2 - วนลูปรายชื่อเมือง (cities) แล้วเรียกใช้ฟังก์ชัน fetchAndDisplayWeather() สำหรับแต่ละเมือง
    // คำใบ้: cities.forEach(city => fetchAndDisplayWeather(city));
}

async function addCityToFavorites(cityName) {
    // TODO: ภารกิจที่ 3 - เขียนฟังก์ชันสำหรับเพิ่มเมืองใหม่
    // 1. ดึงรายชื่อเมืองปัจจุบันมา
    // 2. ตรวจสอบว่าเมืองนี้ถูกเพิ่มไปแล้วหรือยัง (เพื่อป้องกันการซ้ำ)
    // 3. ถ้ายังไม่มี ให้เพิ่มเมืองใหม่เข้าไปใน array
    // 4. บันทึก array ใหม่ลง localStorage
    // 5. เรียกใช้ loadFavoriteCities() เพื่อแสดงผลใหม่ทั้งหมด
    let cities = getFavoriteCities();
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        saveFavoriteCities(cities);
        loadFavoriteCities();
    } else {
        alert(`${cityName} อยู่ในรายการโปรดแล้ว`);
    }
}

function removeCityFromFavorites(cityName) {
    // TODO: ภารกิจที่ 4.1 - เขียน Logic ส่วนนี้
    // 1. ดึงรายชื่อเมืองปัจจุบันมา
    // 2. ใช้ .filter() เพื่อสร้าง array ใหม่ที่ไม่มีเมืองที่ต้องการลบ
    // 3. บันทึก array ใหม่ลง localStorage
    // 4. เรียกใช้ loadFavoriteCities() เพื่อแสดงผลใหม่ทั้งหมด
}

async function fetchAndDisplayWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`ไม่พบข้อมูลของ ${city}`);
        
        const data = await response.json();
        
        const { name, main, weather } = data;
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.setAttribute('data-city', name); 
        
        card.innerHTML = `
            <div>
                <h3>${name}</h3>
                <p>${weather[0].description}</p>
            </div>
            <div class="text-right">
                <p class="temp">${main.temp.toFixed(1)}°C</p>
            </div>
            <button class="remove-btn">X</button>
        `;
        
        favoritesContainer.appendChild(card);

    } catch (error) {
        console.error(error);
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `<h3>${city}</h3><p class="error">${error.message}</p>`;
        favoritesContainer.appendChild(card);
    }
}
```

-----

## **ส่วนที่ 4: Finalizing และ Merge Feature**

หลังจากเขียนโค้ดเสร็จและทดสอบจนแน่ใจว่าฟีเจอร์ทำงานถูกต้องแล้ว ก็ถึงเวลารวมโค้ดของเรากลับเข้าสู่ branch หลัก

### **ขั้นตอนที่ 4.1: Commit โค้ดที่เสร็จแล้ว**

```bash
git add .
git commit -m "feat: Complete local storage feature for favorite cities"
```

### **ขั้นตอนที่ 4.2: Merge กลับเข้า Main**

```bash
git checkout main
git merge feature/local-storage
```

### **ขั้นตอนที่ 4.3: Push โค้ดทั้งหมดขึ้น GitHub**

```bash
git push origin main
```

ตอนนี้โค้ดเวอร์ชันล่าสุดของคุณก็อยู่บน GitHub เรียบร้อยแล้ว\!

-----

## **ส่วนที่ 5: Deploy ขึ้นสู่อินเทอร์เน็ตด้วย Netlify**

เราจะทำให้เว็บแอปของเราออนไลน์เพื่อให้คนอื่นเข้ามาใช้งานได้

### **ขั้นตอนที่ 5.1: เชื่อมต่อ GitHub กับ Netlify**

1.  ไปที่ [Netlify.com](https://www.netlify.com/) แล้วสมัครสมาชิก/ล็อกอิน (สามารถใช้บัญชี GitHub ได้)
2.  ในหน้า Dashboard คลิก `Add new site` \> `Import an existing project`
3.  เลือก `Deploy with GitHub` และอนุญาตให้ Netlify เข้าถึงบัญชี GitHub ของคุณ
4.  เลือก Repository `my-weather-app` ของคุณ

### **ขั้นตอนที่ 5.2: ตั้งค่าและ Deploy**

1.  **Branch to deploy:** ตรวจสอบให้แน่ใจว่าเป็น `main`
2.  **Build command:** เว้นว่างไว้
3.  **Publish directory:** เว้นว่างไว้
4.  คลิก `Deploy site`
5.  รอสักครู่... Netlify จะทำการ Deploy เว็บของคุณ
6.  เมื่อเสร็จแล้ว คุณจะได้รับ URL สาธารณะของเว็บแอป (เช่น `random-name-12345.netlify.app`)

### **ขั้นตอนที่ 5.3: (ทางเลือก) เปลี่ยนชื่อเว็บ**

คุณสามารถเปลี่ยนชื่อเว็บให้จำง่ายขึ้นได้โดยไปที่ `Site settings` \> `Change site name`