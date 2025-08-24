# LAB-07:Frontend Development with Modern JavaScript (ES6+)
#### **Lab: ฝึกใช้ ES6+, DOM Manipulation, และ fetch() API**

## Part1: สร้างแอปพลิเคชันค้นหาสภาพอากาศ (Weather App)

### **ภาพรวมของ Lab**

  * **เป้าหมาย:** สร้างเว็บแอปพลิเคชันสำหรับค้นหาสภาพอากาศของเมืองต่างๆ ทั่วโลก โดยดึงข้อมูลแบบ Real-time จาก API ภายนอก
  * **ระยะเวลา:** 2-3 ชั่วโมง
  * **สิ่งที่จะได้เรียนรู้:**
      * การนำฟีเจอร์ ES6+ (Arrow Functions, Destructuring, Template Literals) มาใช้งานจริง
      * การจัดการ DOM และ Event เพื่อสร้าง UI ที่โต้ตอบกับผู้ใช้
      * การทำงานกับ Asynchronous JavaScript ด้วย `async/await`
      * การเรียกใช้ API ภายนอกด้วย `Fetch API` และการจัดการข้อมูล `JSON`
      * พื้นฐานการใช้งาน Git และ GitHub สำหรับการควบคุมเวอร์ชัน (Version Control)
  * **เครื่องมือที่ต้องใช้:**
    1.  โปรแกรม Code Editor (เช่น VS Code)
    2.  Web Browser (เช่น Chrome, Firefox) ที่มี Developer Tools
    3.  ติดตั้ง Git บนเครื่องคอมพิวเตอร์
    4.  บัญชี GitHub

-----

### **ผลลัพธ์สุดท้าย (Final Product)**

นี่คือหน้าตาของแอปพลิเคชันที่เราจะสร้างกันในวันนี้:

-----

## **ส่วนที่ 1: การตั้งค่าโปรเจกต์และ Git (Project & Git Setup)**

ในส่วนนี้ เราจะสร้างโปรเจกต์ของเราบน GitHub และเตรียมไฟล์เริ่มต้นให้พร้อม

### **ขั้นตอนที่ 1.1: สร้าง Repository บน GitHub**

1.  ไปที่ [GitHub.com](https://github.com) และล็อกอินเข้าสู่ระบบ
2.  คลิกที่ปุ่ม `+` ที่มุมขวาบน และเลือก `New repository`
3.  ตั้งชื่อ Repository ของคุณ เช่น `my-weather-app`
4.  เลือกเป็น `Public`
5.  **ไม่ต้อง** ติ๊กเลือก "Add a README file", "Add .gitignore", หรือ "Choose a license"
6.  คลิก `Create repository`

### **ขั้นตอนที่ 1.2: Clone Repository ลงมาที่เครื่อง**

1.  เปิดโปรแกรม Terminal หรือ Command Prompt (หรือ Git Bash บน Windows)
2.  ในหน้า Repository บน GitHub ที่เพิ่งสร้างเสร็จ ให้คลิกที่ปุ่ม `Code` และคัดลอก URL แบบ HTTPS
3.  ใน Terminal, พิมพ์คำสั่ง `git clone` ตามด้วย URL ที่คัดลอกมา แล้วกด Enter:
    ```bash
    git clone https://github.com/YOUR_USERNAME/my-weather-app.git
    ```
4.  ใช้คำสั่ง `cd` เพื่อเข้าไปในโฟลเดอร์ของโปรเจกต์:
    ```bash
    cd my-weather-app
    ```

### **ขั้นตอนที่ 1.3: สร้างไฟล์เริ่มต้น**

ในโฟลเดอร์ `my-weather-app` ที่เปิดด้วย VS Code, ให้สร้างไฟล์ใหม่ 3 ไฟล์:

1.  `index.html`
2.  `style.css`
3.  `script.js`

### **ขั้นตอนที่ 1.4: เพิ่มโค้ดเริ่มต้น (Starter Code)**

คัดลอกและวางโค้ดเหล่านี้ลงในไฟล์ที่เกี่ยวข้อง

**`index.html`**

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <h1>Weather App</h1>
        <form id="search-form">
            <input type="text" id="city-input" placeholder="ค้นหาชื่อเมือง..." required>
            <button type="submit">ค้นหา</button>
        </form>
        <div id="weather-info-container" class="weather-info">
            <!-- ข้อมูลสภาพอากาศจะแสดงที่นี่ -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

**`style.css`**

```css
body {
    background: #051923;
    color: #E0E1DD;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.app-container {
    background: #003554;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 400px;
    text-align: center;
}

h1 {
    color: #00A6FB;
}

#search-form {
    display: flex;
    gap: 0.5rem;
    margin: 1.5rem 0;
}

#city-input {
    flex-grow: 1;
    padding: 0.75rem;
    border: 1px solid #006494;
    border-radius: 0.5rem;
    background: #051923;
    color: #E0E1DD;
    font-size: 1rem;
}

#search-form button {
    padding: 0.75rem 1rem;
    background-color: #00A6FB;
    color: #051923;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

#search-form button:hover {
    background-color: #0582CA;
}

.weather-info {
    margin-top: 1.5rem;
    min-height: 150px;
}

.weather-info .temp {
    font-size: 3rem;
    font-weight: bold;
    margin: 0.5rem 0;
}

.error {
    color: #ff4d4d;
    font-weight: bold;
}
```

### **ขั้นตอนที่ 1.5: Commit แรกของคุณ**

บันทึกความเปลี่ยนแปลงลงใน Git และส่งขึ้น GitHub

1.  ใน Terminal, พิมพ์คำสั่ง:
    ```bash
    git add .
    git commit -m "Initial project setup with HTML and CSS"
    git push origin main
    ```
2.  กลับไปที่หน้า GitHub ของคุณและรีเฟรช จะเห็นไฟล์ทั้งหมดปรากฏขึ้นมา

-----

## **ส่วนที่ 2: การสมัครและเตรียม API Key**

แอปของเราจะดึงข้อมูลจาก **OpenWeatherMap** ซึ่งเป็นบริการฟรี

### **ขั้นตอนที่ 2.1: สมัครสมาชิก**

1.  ไปที่ [OpenWeatherMap](https://openweathermap.org/)
2.  คลิก `Sign in` และสร้างบัญชีใหม่ (สามารถใช้ Google Account ได้)
3.  หลังจากล็อกอิน, ไปที่หน้า API keys โดยคลิกที่ชื่อของคุณ \> `My API keys`
4.  คุณจะเห็น Default API Key ที่ระบบสร้างให้ **คัดลอก Key นี้เก็บไว้** (อาจใช้เวลา 5-10 นาทีเพื่อให้ Key พร้อมใช้งาน)

-----

## **ส่วนที่ 3: เขียน JavaScript Logic**

ถึงเวลาเขียนโค้ดเพื่อให้แอปของเราทำงานได้\! เปิดไฟล์ `script.js` ขึ้นมา

### **ขั้นตอนที่ 3.1: เลือก DOM Elements**

สร้างตัวแปรเพื่ออ้างอิงถึง Element ต่างๆ ที่เราต้องใช้ใน HTML

```javascript
const apiKey = 'YOUR_API_KEY'; // << วาง API Key ที่คัดลอกมาที่นี่

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
```

### **ขั้นตอนที่ 3.2: เพิ่ม Event Listener ให้กับฟอร์ม**

เราจะดักจับเหตุการณ์ `submit` ของฟอร์ม เพื่อเริ่มกระบวนการค้นหา

```javascript
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีโหลดเมื่อกด submit

    const cityName = cityInput.value.trim(); // .trim() เพื่อตัดช่องว่างหน้า-หลัง

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});
```

### **ขั้นตอนที่ 3.3: สร้างฟังก์ชันสำหรับดึงข้อมูล (Fetch Data)**

นี่คือหัวใจของแอป\! เราจะสร้าง `async function` เพื่อคุยกับ API

```javascript
async function getWeather(city) {
    // แสดงสถานะ Loading
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}
```

### **ขั้นตอนที่ 3.4: สร้างฟังก์ชันสำหรับแสดงผลข้อมูล**

ฟังก์ชันนี้จะรับข้อมูลที่ได้จาก API มาสร้างเป็น HTML แล้วแสดงบนหน้าเว็บ

```javascript
function displayWeather(data) {
    // ใช้ Destructuring เพื่อดึงค่าที่ต้องการออกจาก Object
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    // ใช้ Template Literals ในการสร้าง HTML
    const weatherHtml = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;

    weatherInfoContainer.innerHTML = weatherHtml;
}
```

### **ขั้นตอนที่ 3.5: บันทึกและทดสอบ**

1.  บันทึกไฟล์ `script.js`
2.  เปิดไฟล์ `index.html` ด้วย Live Server หรือเปิดในเบราว์เซอร์โดยตรง
3.  ลองพิมพ์ชื่อเมืองเป็นภาษาอังกฤษ (เช่น `Bangkok`, `London`) แล้วกดค้นหา
4.  หากทุกอย่างถูกต้อง คุณจะเห็นข้อมูลสภาพอากาศปรากฏขึ้นมา\!
5.  **Commit & Push โค้ดที่เสร็จแล้ว:**
    ```bash
    git add .
    git commit -m "Feature: Implement weather search functionality"
    git push origin main
    ```

-----

## **ส่วนที่ 4: ความท้าทายเพิ่มเติม (Bonus Challenges)**

สำหรับคนที่ทำเสร็จเร็ว ลองทำสิ่งเหล่านี้เพิ่มเติม:

1.  **ปรับปรุง UI:** ทำให้หน้าตาแอปสวยงามขึ้น อาจเพิ่ม Animation หรือเปลี่ยนสีพื้นหลังตามสภาพอากาศ
2.  **บันทึกการค้นหาล่าสุด:** ใช้ `localStorage` เพื่อบันทึกชื่อเมืองล่าสุดที่ค้นหา และเมื่อเปิดหน้าเว็บใหม่ ให้แสดงข้อมูลของเมืองนั้นโดยอัตโนมัติ
3.  **พยากรณ์อากาศล่วงหน้า:** OpenWeatherMap มี API สำหรับพยากรณ์อากาศล่วงหน้า ลองดึงข้อมูลมาแสดงเพิ่ม
4.  **Deploy ขึ้น GitHub Pages:** ทำให้เว็บแอปของคุณออนไลน์ให้คนอื่นเข้ามาเล่นได้\! (ไปที่หน้า Settings \> Pages ของ Repository แล้วเลือก branch `main`)