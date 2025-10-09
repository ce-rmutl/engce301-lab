# วันที่ 5: การเชื่อมต่อ Frontend-Backend และความปลอดภัย

## ส่วนที่ 2: ความปลอดภัยเว็บไซต์เบื้องต้น (8 slides)

---

## Slide 19: หน้าปก - Security Essentials

**หัวข้อ:** ความปลอดภัยเบื้องต้นสำหรับ Fullstack Developer

**รายละเอียด:**
- **Security Basics สำหรับนักพัฒนา**
- **เวลา:** 1 ชั่วโมง (11:00-12:00)
- **เป้าหมาย:** รู้หลักการรักษาความปลอดภัยพื้นฐานที่ต้องคำนึงถึง

**คำพูดเปิด:**
> "Security ไม่ใช่แค่งานของทีม Security - เป็นหน้าที่ของนักพัฒนาทุกคน"

**หมายเหตุสำคัญ:**
- เนื้อหานี้เป็นพื้นฐานเท่านั้น
- รายละเอียดเชิงลึกจะเรียนในวิชา Cyber Security
- วัตถุประสงค์: ให้รู้ว่าต้องระวังอะไรบ้างตั้งแต่เขียนโค้ด

**Design:** พื้นหลังสีเทา-แดง ไอคอนโล่ 🛡️

---

## Slide 20: ทำไมต้องคำนึงถึงความปลอดภัย?

**หัวข้อ:** ความปลอดภัยเป็นความรับผิดชอบของทุกคน

### 📊 สถิติที่ต่างตกใจ

**ข้อมูลการโจมตีเว็บไซต์:**
- ทุก 39 วินาที มีการโจมตีเว็บไซต์เกิดขึ้นที่ไหนสักแห่งในโลก
- 43% ของการโจมตีเล็งไปที่ธุรกิจขนาดเล็ก-กลาง (SME)
- 95% ของปัญหาความปลอดภัยเกิดจากความผิดพลาดของมนุษย์
- ค่าเฉลี่ยความเสียหายต่อครั้ง: 4.45 ล้านดอลลาร์

### 🎯 กรณีศึกษาจริง

**Case 1: ร้านอาหารออนไลน์ (2023)**
- **ปัญหา:** ไม่มี input validation ในฟอร์มรีวิว
- **การโจมตี:** แทรก JavaScript code ในช่อง comment
- **ผลกระทบ:** 
  - ข้อมูลลูกค้า 50,000 คนรั่วไหล
  - ปิดเว็บไซต์ 2 สัปดาห์
  - ความเสียหาย 5+ ล้านบาท
  - สูญเสียความไว้วางใจจากลูกค้า

**Case 2: E-commerce ถูกขโมยข้อมูลบัตรเครดิต**
- **ปัญหา:** ไม่ใช้ HTTPS, เก็บข้อมูลบัตรแบบ plain text
- **ผลกระทบ:**
  - ข้อมูลบัตร 10,000+ รายการรั่วไหล
  - ถูกฟ้องร้องจากลูกค้า
  - ธุรกิจล้มละลาย

**Case 3: API ไม่มี rate limiting**
- **การโจมตี:** DDoS Attack (request หลายแสนครั้งต่อวินาที)
- **ผลกระทบ:**
  - Server ล่ม ไม่สามารถให้บริการ
  - สูญเสียรายได้
  - ค่า cloud server พุ่งสูง

### ⚠️ ผลกระทบ 4 ด้าน

**1. ความเสียหายทางธุรกิจ**
- สูญเสียรายได้จากการหยุดให้บริการ
- ค่าใช้จ่ายในการแก้ไข
- ค่าปรับจากการละเมิดกฎหมาย

**2. ความน่าเชื่อถือ**
- ลูกค้าไม่กล้าใช้บริการ
- ภาพลักษณ์เสียหาย
- สูญเสียความได้เปรียบในการแข่งขัน

**3. กฎหมาย**
- PDPA ใน Thailand
- GDPR ในยุโรป
- อาจมีความผิดทางอาญา

**4. ผู้ใช้บริการ**
- ข้อมูลส่วนตัวรั่วไหล
- บัญชีธนาคารถูกโจมตี
- Identity theft

### 💡 ข้อคิด

> "การป้องกันง่ายกว่าการแก้ไข - เขียนโค้ดให้ปลอดภัยตั้งแต่เริ่มต้น"

**คำถาม:** ใครคิดว่าเว็บไซต์ของตัวเองปลอดภัยแน่นอน?

---

## Slide 21: Input Validation - พื้นฐานที่สำคัญที่สุด

**หัวข้อ:** ตรวจสอบข้อมูลที่รับเข้ามา - เสมอ!

### 🛡️ Input Validation คืออะไร?

**คำจำกัดความ:**
- การตรวจสอบความถูกต้องของข้อมูลที่ผู้ใช้ส่งเข้ามา
- **กฎทอง:** Never trust user input!
- ต้องทำทั้ง Frontend และ Backend

**ทำไมต้อง Validate?**
- ป้องกัน malicious code
- ป้องกัน XSS (Cross-Site Scripting)
- ป้องกัน SQL Injection
- ป้องกันข้อมูลผิดพลาด

### ❌ ตัวอย่างที่อันตราย

**Scenario: ฟอร์มเขียนรีวิวร้านอาหาร**

```javascript
// Backend - ไม่มี validation (อันตราย!)
app.post('/api/reviews', (req, res) => {
  const { userName, comment } = req.body;
  
  // บันทึกทันทีโดยไม่ตรวจสอบ
  reviews.push({ userName, comment });
  res.json({ success: true });
});
```

**การโจมตี:**
```javascript
// Hacker ส่ง
{
  userName: "Hacker",
  comment: "<script>alert('Hacked!')</script>"
}
```

**ผลกระทบ:**
- Script ถูกบันทึกลง database
- เมื่อคนอื่นดู script จะทำงาน
- อาจขโมย cookies, tokens
- อาจ redirect ไปหน้าปลอม

### ✅ วิธีแก้: Frontend Validation

```javascript
function ReviewForm() {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // ตรวจสอบชื่อ
    if (!userName.trim()) {
      newErrors.userName = 'กรุณากรอกชื่อ';
    } else if (userName.length < 2 || userName.length > 50) {
      newErrors.userName = 'ชื่อต้องมี 2-50 ตัวอักษร';
    } else if (!/^[a-zA-Zก-๙\s]+$/.test(userName)) {
      newErrors.userName = 'ชื่อต้องเป็นตัวอักษรเท่านั้น';
    }
    
    // ตรวจสอบ comment
    if (!comment.trim()) {
      newErrors.comment = 'กรุณากรอกความคิดเห็น';
    } else if (comment.length < 10 || comment.length > 500) {
      newErrors.comment = 'ความคิดเห็นต้องมี 10-500 ตัวอักษร';
    }
    
    // ตรวจสอบ dangerous patterns
    if (/<script|<iframe|javascript:/i.test(comment)) {
      newErrors.comment = 'พบอักขระที่ไม่อนุญาต';
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // ส่งข้อมูล
    await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ userName, comment })
    });
  };
}
```

### ✅ วิธีแก้: Backend Validation (สำคัญที่สุด!)

```javascript
// Express Middleware
const validateReview = (req, res, next) => {
  const { userName, comment, rating } = req.body;
  const errors = [];
  
  // 1. ตรวจสอบว่ามีข้อมูลครบ
  if (!userName || !comment || !rating) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    });
  }
  
  // 2. ตรวจสอบชนิดและความยาว
  if (typeof userName !== 'string') {
    errors.push('ชื่อต้องเป็นข้อความ');
  }
  if (userName.length < 2 || userName.length > 50) {
    errors.push('ชื่อต้องมี 2-50 ตัวอักษร');
  }
  
  // 3. ตรวจสอบ special characters
  if (!/^[a-zA-Zก-๙\s]+$/.test(userName)) {
    errors.push('ชื่อมีอักขระที่ไม่อนุญาต');
  }
  
  // 4. ป้องกัน XSS
  if (/<script|<iframe|javascript:|onerror=/i.test(comment)) {
    errors.push('พบเนื้อหาที่ไม่อนุญาต');
  }
  
  // 5. ตรวจสอบ rating
  const ratingNum = parseInt(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    errors.push('คะแนนต้องเป็นตัวเลข 1-5');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }
  
  // ทำความสะอาดข้อมูล
  req.body.userName = userName.trim();
  req.body.comment = comment.trim();
  req.body.rating = ratingNum;
  
  next();
};

// ใช้งาน
app.post('/api/reviews', validateReview, (req, res) => {
  // ข้อมูลที่มาถึงนี่ผ่าน validation แล้ว
  const review = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  reviews.push(review);
  res.json({ success: true, data: review });
});
```

### 🔑 หลักการสำคัญ

**1. Validate ทั้ง Frontend และ Backend**
- Frontend: UX ดี (แจ้ง error ทันที)
- Backend: ป้องกันจริง (แม้ bypass frontend ได้)

**2. Never Trust Client-Side Validation Alone**
- Hacker ปิด JavaScript ได้
- สามารถส่ง request ตรงด้วย Postman/curl
- Backend validation สำคัญที่สุด!

**3. Whitelist > Blacklist**
- Whitelist: อนุญาตเฉพาะที่กำหนด (ปลอดภัย)
- Blacklist: ห้ามเฉพาะที่กำหนด (มีช่องโหว่)

**4. Sanitize ข้อมูล**
- trim() ตัดช่องว่าง
- toLowerCase() สำหรับ email
- ลบอักขระพิเศษที่ไม่ต้องการ

### 📋 Validation Checklist

- มีข้อมูลครบหรือไม่?
- ชนิดข้อมูลถูกต้องหรือไม่?
- ความยาวเหมาะสมหรือไม่?
- รูปแบบถูกต้องหรือไม่?
- มี special characters อันตรายหรือไม่?
- อยู่ในช่วงที่กำหนดหรือไม่?

---

## Slide 22: Validation Patterns ที่ใช้บ่อย

**หัวข้อ:** ตัวอย่าง Regular Expressions และการตรวจสอบ

### 📝 Patterns ทั่วไป

**1. Email Validation**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email) return 'กรุณากรอกอีเมล';
  if (!emailRegex.test(email)) return 'รูปแบบอีเมลไม่ถูกต้อง';
  if (email.length > 100) return 'อีเมลยาวเกินไป';
  return null;
}
```

**2. เบอร์โทรไทย (10 หลัก)**
```javascript
const phoneRegex = /^0[0-9]{9}$/;

function validatePhone(phone) {
  if (!phone) return null; // optional
  
  const clean = phone.replace(/[\s-]/g, '');
  if (!phoneRegex.test(clean)) {
    return 'เบอร์โทรต้องเป็น 10 หลัก เริ่มด้วย 0';
  }
  return null;
}
```

**3. Password Strength**
```javascript
function validatePassword(password) {
  if (!password) return 'กรุณากรอกรหัสผ่าน';
  if (password.length < 8) return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
  if (!/[A-Z]/.test(password)) return 'ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว';
  if (!/[a-z]/.test(password)) return 'ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว';
  if (!/[0-9]/.test(password)) return 'ต้องมีตัวเลขอย่างน้อย 1 ตัว';
  if (!/[!@#$%^&*]/.test(password)) return 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว';
  return null;
}
```

**4. ชื่อ-นามสกุล**
```javascript
const nameRegex = /^[a-zA-Zก-๙\s]+$/;

function validateName(name) {
  if (!name) return 'กรุณากรอกชื่อ';
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 100) {
    return 'ชื่อต้องมี 2-100 ตัวอักษร';
  }
  if (!nameRegex.test(trimmed)) {
    return 'ชื่อต้องเป็นตัวอักษรเท่านั้น';
  }
  return null;
}
```

**5. คะแนน/ตัวเลขในช่วง**
```javascript
function validateRating(rating) {
  const num = parseInt(rating);
  if (isNaN(num)) return 'คะแนนต้องเป็นตัวเลข';
  if (num < 1 || num > 5) return 'คะแนนต้องอยู่ระหว่าง 1-5';
  return null;
}
```

### 🛠️ Reusable Validation Utility

```javascript
// utils/validation.js
const ValidationUtils = {
  isStringWithLength(value, min, max) {
    if (typeof value !== 'string') return false;
    const length = value.trim().length;
    return length >= min && length <= max;
  },
  
  isNumberInRange(value, min, max) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  },
  
  hasDangerousChars(value) {
    return /<script|<iframe|javascript:|onerror=/i.test(value);
  },
  
  sanitizeString(value) {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/<[^>]*>/g, '').slice(0, 1000);
  }
};

// ใช้งาน
if (!ValidationUtils.isStringWithLength(userName, 2, 50)) {
  errors.push('ชื่อต้องมี 2-50 ตัวอักษร');
}
```

### 💡 Best Practices

**1. แยก Validation เป็น Functions**
- ใช้ซ้ำได้
- Test ง่าย
- Maintain ง่าย

**2. Error Messages ชัดเจน**
```javascript
// ไม่ดี
return 'Invalid input';

// ดี
return 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
```

**3. Real-time Validation**
```javascript
<input onBlur={(e) => validate(e.target.value)} />
```

---

## Slide 23: HTTPS - ทำไมต้องใช้?

**หัวข้อ:** การเข้ารหัสข้อมูลระหว่างส่ง

### 🔒 HTTP vs HTTPS

**HTTP (Hypertext Transfer Protocol)**
- ส่งข้อมูลแบบ plain text
- ไม่มีการเข้ารหัส
- ไม่ปลอดภัย

**HTTPS (HTTP Secure)**
- ข้อมูลถูกเข้ารหัส SSL/TLS
- ป้องกันการดักจับ
- ปลอดภัย

### ⚠️ อันตรายของ HTTP

**Scenario: กรอกข้อมูลบัตรเครดิต**

```
HTTP:
User → [1234-5678-9012-3456, CVV: 123] → Server
         ↑
    Hacker ดักจับเห็นทุกอย่าง!

HTTPS:
User → [8d7f9a2b4c1e5f3d...] → Server
         ↑
    Hacker ดักจับได้แต่อ่านไม่ออก
```

### 📊 การโจมตี: Man-in-the-Middle

**สถานการณ์: WiFi คาเฟ่**
```
1. User เชื่อมต่อ WiFi สาธารณะ
2. Hacker ตั้ง Fake WiFi ชื่อเดียวกัน
3. User เข้าเว็บ HTTP
4. Hacker ดักจับ:
   - Username/Password
   - ข้อมูลบัตรเครดิต
   - Session tokens
```

**กรณีจริง:**
- 2019: Hacker ใน Starbucks ขโมยข้อมูล 2,000+ คน
- เกิดจากเว็บไซต์ใช้ HTTP

### ✅ ประโยชน์ของ HTTPS

**1. Privacy** - ข้อมูลถูกเข้ารหัส  
**2. Trust** - แสดงไอคอนแม่กุญแจ  
**3. Integrity** - ตรวจจับการแก้ไขข้อมูล  
**4. SEO** - Google ให้ ranking สูงกว่า

### 💻 การใช้ HTTPS

**Development (Local):**
```javascript
// ใช้ HTTP ได้ (localhost ปลอดภัยอยู่แล้ว)
app.listen(3000, () => {
  console.log('Server on http://localhost:3000');
});
```

**Production:**
- ต้องใช้ HTTPS เท่านั้น
- SSL Certificate ฟรีจาก Let's Encrypt
- Hosting providers จัดการให้ (Vercel, Netlify)

**Redirect HTTP → HTTPS:**
```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 🎯 สรุป

**Development:** ใช้ HTTP ได้  
**Production:** ต้องใช้ HTTPS เสมอ!

**เช็ค HTTPS:**
- ดู address bar มี 🔒
- URL เริ่มต้น https://
- Browser ไม่แสดงคำเตือน

---

## Slide 24: Environment Variables

**หัวข้อ:** เก็บข้อมูลลับอย่างปลอดภัย

### 🔐 Environment Variables คืออะไร?

**คำนิยาม:**
- ตัวแปรเก็บค่า configuration
- แยกจากโค้ด
- แต่ละ environment ค่าต่างกัน

**ทำไมต้องใช้?**
- เก็บข้อมูลลับ (API keys, passwords)
- แยก config จากโค้ด
- เปลี่ยนค่าได้โดยไม่แก้โค้ด
- ป้องกันข้อมูลรั่วใน GitHub

### ❌ อย่าทำแบบนี้!

```javascript
// Hardcode ข้อมูลลับในโค้ด
mongoose.connect('mongodb://admin:MyP@ssw0rd@server/db');
const stripe = require('stripe')('sk_live_51H9x...');
const jwtSecret = 'mysecretkey123';

// ถ้า push ขึ้น GitHub → ทุกคนเห็น!
```

**ผลกระทบ:**
- Hacker เข้าถึง Database
- ใช้ API key (เสียเงิน)
- สร้าง JWT tokens ปลอม

**กรณีจริง:**
- 2021: นักพัฒนา commit AWS key ขึ้น GitHub
- ภายใน 5 นาที bot เจอและใช้
- ค่า AWS พุ่ง $30,000+ ใน 2 วัน!

### ✅ วิธีที่ถูกต้อง

**1. สร้างไฟล์ .env**
```bash
# .env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=MySecurePassword123
DB_NAME=restaurant_db

# API Keys
STRIPE_KEY=sk_live_51H9x...
GOOGLE_MAPS_KEY=AIzaSyC...

# JWT
JWT_SECRET=super-secret-key-2024
JWT_EXPIRES=7d
```

**2. เพิ่ม .env ใน .gitignore**
```bash
# .gitignore
node_modules/
.env
.env.local
*.log
```

**3. ติดตั้ง dotenv**
```bash
npm install dotenv
```

**4. ใช้ในโค้ด**
```javascript
// server.js
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(
  `mongodb://${process.env.DB_USER}:${DB_PASSWORD}@${process.env.DB_HOST}`
);

app.listen(PORT);
```

**5. สร้าง .env.example**
```bash
# .env.example (แชร์ใน Git ได้)
PORT=
DB_HOST=
DB_PASSWORD=
STRIPE_KEY=
JWT_SECRET=
```

### 🎯 Best Practices

**1. Validate Variables**
```javascript
const required = ['PORT', 'DB_PASSWORD', 'JWT_SECRET'];
required.forEach(v => {
  if (!process.env[v]) {
    console.error(`${v} is not set`);
    process.exit(1);
  }
});
```

**2. ใช้ Default Values**
```javascript
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
```

**3. อย่า Log ข้อมูลลับ**
```javascript
// อย่าทำ
console.log('JWT:', process.env.JWT_SECRET);

// ควรทำ
console.log('Server started');
```

### ⚠️ ถ้าทำผิด

**ถ้า commit .env ขึ้น Git:**
1. เปลี่ยน passwords/keys ทันที!
2. ลบออกจาก Git history
3. เพิ่มใน .gitignore

---

## Slide 25: ข้อควรระวัง - Common Mistakes

**หัวข้อ:** อย่าทำสิ่งเหล่านี้

### ❌ 7 สิ่งที่ไม่ควรทำ

**1. อย่าส่ง Error Details ให้ User**
```javascript
// อันตราย
catch (error) {
  res.json({ error: error.message, stack: error.stack });
  // Hacker รู้โครงสร้างระบบ!
}

// ควรทำ
catch (error) {
  console.error(error); // log ใน server
  res.json({ message: 'เกิดข้อผิดพลาด' }); // ส่งทั่วไป
}
```

**2. อย่าเก็บ Password แบบ Plain Text**
```javascript
// อันตราย
const user = { password: 'john123' };

// ควรทำ - ใช้ bcrypt
const bcrypt = require('bcrypt');
const hashed = await bcrypt.hash('john123', 10);
```

**3. อย่าให้สิทธิ์มากเกินไป**
```javascript
// อันตราย - ใครก็ลบได้
app.delete('/api/users/:id', (req, res) => {
  deleteUser(req.params.id);
});

// ควรทำ - เช็คสิทธิ์
app.delete('/api/users/:id', isAdmin, (req, res) => {
  deleteUser(req.params.id);
});
```

**4. อย่าลืม Rate Limiting**
```javascript
// ต้องมี
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'ลองมากเกินไป กรุณารอ 15 นาที'
});

app.post('/api/login', limiter, (req, res) => {
  // ป้องกัน Brute Force
});
```

**5. อย่าเชื่อข้อมูลจาก Client**
```javascript
// อันตราย
app.post('/api/purchase', (req, res) => {
  const { price } = req.body; // เชื่อราคาจาก client
  createOrder(price); // Hacker ส่ง price: 0
});

// ควรทำ
app.post('/api/purchase', (req, res) => {
  const product = await getProduct(productId);
  const actualPrice = product.price; // ดึงจาก database
  createOrder(actualPrice);
});
```

**6. อย่าใช้ Console.log ใน Production**
```javascript
// อันตราย
console.log('Password:', req.body.password);
console.log('JWT:', token);

// ควรทำ - ใช้ logging library
logger.info('Login attempt', { username });
```

**7. อย่าใช้ Default Credentials**
```javascript
// อย่าใช้
username: admin
password: admin123
secret: secret

// เปลี่ยนทันที!
```

### 🎯 Quick Checklist

ก่อน Deploy:
- ใช้ HTTPS
- CORS ระบุ origin
- Validate input
- ใช้ .env
- Rate limiting
- ไม่ส่ง error details
- Hash passwords
- เช็คสิทธิ์
- Update dependencies
- Security headers

---

## Slide 26: Security Checklist

**หัวข้อ:** 10 ข้อที่ต้องทำเสมอ

### ✅ Security Basics Checklist

**1. Input Validation**
```
✓ ตรวจสอบทุก input
✓ เช็คชนิดและความยาว
✓ ใช้ regex patterns
✓ ป้องกัน XSS, injection
```

**2. HTTPS in Production**
```
✓ SSL Certificate (Let's Encrypt ฟรี)
✓ Redirect HTTP → HTTPS
✓ ใช้ Cloudflare
```

**3. Environment Variables**
```
✓ เก็บข้อมูลลับใน .env
✓ .gitignore .env
✓ Validate required vars
```

**4. Error Handling**
```
✓ Log error ใน server
✓ ส่ง message ทั่วไปให้ user
✓ ไม่เปิดเผยโครงสร้างระบบ
```

**5. Rate Limiting**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);
```

**6. CORS Configuration**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
```

**7. Never Trust Client**
```
✓ ตรวจสอบทุกอย่างใน backend
✓ ดึงราคา/สิทธิ์จาก database
✓ ไม่เชื่อข้อมูลจาก client
```

**8. Hash Passwords**
```javascript
const bcrypt = require('bcrypt');
const hashed = await bcrypt.hash(password, 10);
```

**9. Update Dependencies**
```bash
npm audit
npm audit fix
npm update
```

**10. Security Headers**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 🔍 เครื่องมือตรวจสอบ

**npm audit**
```bash
npm audit        # ตรวจสอบช่องโหว่
npm audit fix    # แก้ไขอัตโนมัติ
```

**ESLint Security**
```bash
npm install --save-dev eslint-plugin-security
```

**OWASP ZAP**
- Scan ช่องโหว่ในเว็บไซต์
- ฟรี open source

### 📚 Resources

**Beginner:**
- OWASP Top 10
- MDN Web Security
- Node.js Security Best Practices

**Tools:**
- helmet.js - Security headers
- express-rate-limit
- express-validator
- bcrypt

---

## Slide 27: สิ่งที่จะเรียนต่อใน Cyber Security Course

**หัวข้อ:** หัวข้อเชิงลึกที่จะเรียนในวิชา Cyber Security

### 🎓 เนื้อหาที่จะเรียนต่อ

**1. OWASP Top 10 (รายละเอียด)**
- **XSS (Cross-Site Scripting)**
  - Stored XSS
  - Reflected XSS
  - DOM-based XSS
  - วิธีป้องกันและแก้ไข

- **SQL Injection**
  - การโจมตี database
  - Prepared statements
  - ORM security

- **CSRF (Cross-Site Request Forgery)**
  - CSRF tokens
  - SameSite cookies

- **Authentication Attacks**
  - Brute force
  - Credential stuffing
  - Session hijacking

**2. Authentication & Authorization**
- JWT (JSON Web Tokens) เชิงลึก
- OAuth 2.0
- Session management
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)

**3. Cryptography**
- Encryption vs Hashing
- Symmetric vs Asymmetric encryption
- SHA-256, bcrypt, argon2
- Digital signatures
- SSL/TLS certificates

**4. Secure API Development**
- API authentication
- API rate limiting advanced
- API versioning
- GraphQL security

**5. Database Security**
- Prepared statements
- Least privilege principle
- Encryption at rest
- Backup security

**6. Security Testing**
- Penetration testing
- Vulnerability scanning
- Security code review
- Automated security testing

**7. Compliance & Standards**
- PDPA (Thailand)
- GDPR (Europe)
- PCI DSS (Payment Card)
- ISO 27001

**8. Incident Response**
- Security monitoring
- Log analysis
- Incident handling
- Disaster recovery

### 🔄 จากวันนี้ → Cyber Security Course

**วันนี้เราเรียน (Basics):**
- Input validation พื้นฐาน
- HTTPS คืออะไร
- Environment variables
- Security checklist

**ใน Cyber Security จะเรียน (Advanced):**
- ทำ penetration testing
- วิเคราะห์ malware
- ออกแบบระบบรักษาความปลอดภัย
- Ethical hacking
- Security architecture

### 💡 ทำไมต้องเรียนต่อ?

**1. Threats มีมากกว่าที่คิด**
- 0-day vulnerabilities
- Advanced persistent threats
- Social engineering
- Ransomware

**2. ทักษะที่ต้องการในตลาด**
- Security engineer
- Penetration tester
- Security analyst
- DevSecOps engineer

**3. ความปลอดภัยคือพื้นฐาน**
- ทุกระบบต้องการ security
- Compliance เป็นข้อบังคับ
- ป้องกันดีกว่าแก้ไข

### 🎯 สิ่งที่ควรทำตอนนี้

**เตรียมตัวสำหรับวิชา Cyber Security:**
1. ฝึกคิด security-first เมื่อเขียนโค้ด
2. อ่าน OWASP Top 10 overview
3. ลองใช้เครื่องมือ security testing
4. ติดตามข่าว security breaches
5. เข้าใจพื้นฐานที่เรียนวันนี้ให้แม่น

**Resources เพิ่มเติม:**
- hackthebox.com - ฝึก ethical hacking
- owasp.org - OWASP documentation
- portswigger.net/web-security - Web Security Academy
- youtube.com/LiveOverflow - Security tutorials

### 📝 สรุป

**วันนี้:**
- รู้ว่าต้องระวังอะไร
- เข้าใจหลักการพื้นฐาน
- สามารถเขียนโค้ดที่ปลอดภัยเบื้องต้น

**ต่อไป:**
- เข้าใจเชิงลึก
- วิเคราะห์และทดสอบระบบ
- ออกแบบ security architecture

---

## สิ้นสุดส่วนที่ 2 (8 slides)

**เวลาที่ใช้:** ประมาณ 1 ชั่วโมง

**พักกลางวัน:** 12:00-13:00 (1 ชั่วโมง)

**ต่อไป:** ส่วนที่ 3 - Final Project: Restaurant Review Website (20 slides)

---