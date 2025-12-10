# CSS3 Styling และ Layout เบื้องต้น
## ENGCE301 - การออกแบบและพัฒนาซอฟต์แวร์
###  - หัวข้อที่ 2 (3 ชั่วโมง)

---

## Slide 1: ยินดีต้อนรับสู่โลกของ CSS! 🎨

### สิ่งที่เราจะเรียนรู้วันนี้
- CSS คืออะไร และทำไมสำคัญ
- วิธีการเขียนและเชื่อมต่อ CSS
- CSS Selectors และ Properties
- การจัด Layout ด้วย Box Model และ Flexbox

**เป้าหมาย:** ทำให้เว็บไซต์ HTML ของเราสวยงามและดูเป็นมืออาชีพ!

---

## Slide 2: CSS คืออะไร? 🤔

**CSS = Cascading Style Sheets**

- **Cascading** = การไหลลงมาเป็นลำดับ
- **Style** = รูปแบบการแสดงผล
- **Sheets** = แผ่นกำหนดรูปแบบ

### เปรียบเทียบกับชีวิตจริง
- **HTML** = โครงสร้างบ้าน 🏠
- **CSS** = การตกแต่งบ้าน 🎨
  - สี, เฟอร์นิเจอร์, ผ้าม่าน, แสงไฟ

**CSS ทำให้เว็บไซต์สวยงาม น่าดู และใช้งานง่าย!**

---

## Slide 3: ก่อนและหลังใช้ CSS 📊

### HTML เปล่าๆ (ไม่มี CSS):
```
ข้อความธรรมดา สีดำ ฟอนต์พื้นฐาน
ไม่มีสี ไม่มีการจัดวาง น่าเบื่อ 😴
```

### HTML + CSS:
```
🌈 สีสันสวยงาม
📱 Layout สุดเท่
⚡ Animation เคลื่อนไหว
✨ ดูเป็นมืออาชีพ
```

**ความแตกต่างเหมือนฟ้ากับเหว!**

---

## Slide 4: 3 วิธีการเขียน CSS 📝

### 1. Inline CSS (ใน HTML Tag)
```html
<h1 style="color: red; font-size: 30px;">หัวข้อสีแดง</h1>
```

### 2. Internal CSS (ใน Head)
```html
<head>
    <style>
        h1 { color: red; font-size: 30px; }
    </style>
</head>
```

### 3. External CSS (ไฟล์แยก) ⭐ แนะนำ
```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

---

## Slide 5: External CSS - วิธีที่ดีที่สุด! ✨

### สร้างไฟล์ `style.css`:
```css
h1 {
    color: red;
    font-size: 30px;
}
```

### เชื่อมต่อใน HTML:
```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

### ข้อดี:
✅ จัดการง่าย  
✅ เปลี่ยนทั้งเว็บไซต์ได้ครั้งเดียว  
✅ โค้ดสะอาด แยกส่วนชัดเจน  

---

## Slide 6: CSS Syntax พื้นฐาน 📚

### โครงสร้าง CSS:
```css
selector {
    property: value;
    property: value;
}
```

### ตัวอย่าง:
```css
h1 {
    color: blue;
    font-size: 24px;
    text-align: center;
}
```

### องค์ประกอบ:
- **Selector** = เลือก HTML element
- **Property** = คุณสมบัติที่ต้องการเปลี่ยน
- **Value** = ค่าที่ต้องการกำหนด

---

## Slide 7: CSS Selectors พื้นฐาน 🎯

### 1. Element Selector:
```css
p { color: green; }        /* ทุก <p> */
h1 { font-size: 32px; }    /* ทุก <h1> */
```

### 2. Class Selector (.):
```css
.highlight { background: yellow; }
```
```html
<p class="highlight">ข้อความไฮไลต์</p>
```

### 3. ID Selector (#):
```css
#header { background: blue; }
```
```html
<div id="header">หัวเว็บ</div>
```

---

## Slide 8: ความแตกต่าง Class vs ID 🔍

### Class (.)
- ใช้ได้หลายครั้งในหน้าเดียว
- เหมือนป้ายชื่อกลุม
```html
<p class="warning">คำเตือน 1</p>
<p class="warning">คำเตือน 2</p>
```

### ID (#)
- ใช้ได้เพียงครั้งเดียวต่อหน้า
- เหมือนเลขบัตรประชาชน
```html
<div id="navigation">เมนูเดียว</div>
```

**กฎทอง: Class = หลายคน, ID = คนเดียว**

---

## Slide 9: Colors ในCSS 🌈

### 1. ชื่อสี (Color Names):
```css
color: red;
color: blue;
color: green;
```

### 2. Hex Colors:
```css
color: #FF0000;  /* แดง */
color: #00FF00;  /* เขียว */
color: #0000FF;  /* น้ำเงิน */
```

### 3. RGB Colors:
```css
color: rgb(255, 0, 0);      /* แดง */
color: rgba(255, 0, 0, 0.5); /* แดงโปร่งใส 50% */
```

**เครื่องมือ:** Color Picker ใน Google, Adobe Color

---

## Slide 10: คำถาม 🤔

### ถ้าคุณต้องการให้ข้อความทุกย่อหน้ามีสีน้ำเงิน
### คุณจะเขียน CSS อย่างไร?

A) `p { color: blue; }`
B) `.p { color: blue; }`
C) `#p { color: blue; }`
D) `<p style="color: blue">`

**คิด 30 วินาที...**

---

## Slide 11: เฉลย 🎯

### คำตอบ: A) `p { color: blue; }`

```css
p {
    color: blue;
}
```

### เหตุผล:
- ใช้ Element Selector เลือกทุก `<p>`
- ไม่ใช้ `.` (class) หรือ `#` (id)
- ตัวเลือก D เป็น inline style ไม่ใช่ CSS แยกไฟล์

---

## Slide 12: Typography - การจัดการตัวอักษร ✍️

### ขนาดฟอนต์:
```css
font-size: 16px;    /* ขนาดพิกเซล */
font-size: 1.2em;   /* เท่ากับ parent */
font-size: 120%;    /* เปอร์เซ็นต์ */
```

### ประเภทฟอนต์:
```css
font-family: 'Sarabun', Arial, sans-serif;
```

### น้ำหนักฟอนต์:
```css
font-weight: normal;  /* ปกติ */
font-weight: bold;    /* หนา */
font-weight: 400;     /* ตัวเลข 100-900 */
```

---

## Slide 13: Text Properties 📝

### การจัดแนว:
```css
text-align: left;    /* ซ้าย */
text-align: center;  /* กลาง */
text-align: right;   /* ขวา */
text-align: justify; /* เต็มแถว */
```

### การตกแต่งข้อความ:
```css
text-decoration: underline;    /* ขีดเส้นใต้ */
text-decoration: line-through; /* ขีดฆ่า */
text-decoration: none;         /* ไม่มี */
```

### ระยะห่างบรรทัด:
```css
line-height: 1.5;    /* 1.5 เท่าของฟอนต์ */
line-height: 24px;   /* ความสูงเฉพาะ */
```

---

## Slide 14: Background Properties 🎨

### สีพื้นหลัง:
```css
background-color: lightblue;
background-color: #f0f0f0;
background-color: rgba(255, 255, 255, 0.8);
```

### รูปพื้นหลัง:
```css
background-image: url('image.jpg');
background-size: cover;      /* ครอบคลุมทั้งหมด */
background-repeat: no-repeat; /* ไม่ซ้ำ */
background-position: center; /* ตำแหน่งกลาง */
```

### ทั้งหมดในบรรทัดเดียว:
```css
background: url('bg.jpg') no-repeat center cover;
```

---

## Slide 15: Demo Time! 💻

### ลองใส่สีและฟอนต์กัน!

1. เปิดไฟล์ HTML ที่สร้างไว้
2. สร้างไฟล์ `style.css`
3. เชื่อมต่อ CSS เข้ากับ HTML
4. เพิ่มสี ฟอนต์ และพื้นหลัง
5. ดูผลลัพธ์ในเบราว์เซอร์

**หยุด 15 นาที - ทำไปด้วยกัน!**

---

## Slide 16: CSS Box Model - หัวใจของ Layout 📦

### ทุก HTML Element เป็น "กล่อง" ที่มี:

```
┌─────────────────────────┐
│        Margin           │  ← ระยะห่างภายนอก
│ ┌─────────────────────┐ │
│ │      Border         │ │  ← เส้นขอบ
│ │ ┌─────────────────┐ │ │
│ │ │    Padding      │ │ │  ← ระยะห่างภายใน
│ │ │ ┌─────────────┐ │ │ │
│ │ │ │   Content   │ │ │ │  ← เนื้อหา
│ │ │ └─────────────┘ │ │ │
│ │ └─────────────────┘ │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## Slide 17: Margin และ Padding 📏

### Margin (ระยะห่างภายนอก):
```css
margin: 20px;           /* ทุกด้าน 20px */
margin: 10px 20px;      /* บน-ล่าง 10px, ซ้าย-ขวา 20px */
margin: 10px 15px 20px 25px; /* บน ขวา ล่าง ซ้าย */

margin-top: 10px;       /* เฉพาะด้านบน */
margin-left: 15px;      /* เฉพาะด้านซ้าย */
```

### Padding (ระยะห่างภายใน):
```css
padding: 15px;          /* ทุกด้าน 15px */
padding: 10px 20px;     /* บน-ล่าง 10px, ซ้าย-ขวา 20px */

padding-top: 10px;      /* เฉพาะด้านบน */
padding-right: 20px;    /* เฉพาะด้านขวา */
```

---

## Slide 18: Border Properties 🔲

### ขนาดและรูปแบบ:
```css
border: 2px solid black;        /* ทุกด้าน */
border-width: 1px;              /* ความหนา */
border-style: solid;            /* รูปแบบ: solid, dashed, dotted */
border-color: red;              /* สี */
```

### เฉพาะด้าน:
```css
border-top: 3px solid blue;     /* เฉพาะด้านบน */
border-bottom: 1px dashed gray; /* เฉพาะด้านล่าง */
```

### มุมโค้ง:
```css
border-radius: 10px;            /* มุมโค้งทุกมุม */
border-radius: 50%;             /* วงกลม */
```

---

## Slide 19: Width และ Height 📐

### ขนาดพื้นฐาน:
```css
width: 300px;           /* ความกว้าง */
height: 200px;          /* ความสูง */
```

### ขนาดแบบเปอร์เซ็นต์:
```css
width: 100%;            /* เต็มพื้นที่ parent */
width: 50%;             /* ครึ่งหนึ่งของ parent */
```

### ขนาดสูงสุด/ต่ำสุด:
```css
max-width: 800px;       /* กว้างสุด 800px */
min-height: 100px;      /* สูงต่ำสุด 100px */
```

**เทคนิค:** ใช้ `max-width: 100%` ทำให้รูปไม่เกินขนาดหน้าจอ

---

## Slide 20: คำถาม 🤔

### ถ้าคุณต้องการเพิ่มระยะห่างระหว่างข้อความกับขอบกล่อง
### คุณจะใช้ property ไหน?

A) `margin`
B) `padding`
C) `border`
D) `width`

**คิด 30 วินาที...**

---

## Slide 21: เฉลย 🎯

### คำตอบ: B) `padding`

```css
.text-box {
    padding: 20px;  /* ระยะห่างภายในกล่อง */
    border: 1px solid black;
}
```

### เหตุผล:
- **Padding** = ระยะห่างระหว่างเนื้อหากับขอบกล่อง (ภายใน)
- **Margin** = ระยะห่างภายนอกกล่อง
- เหมือนการเว้นระยะห่างในห้อง vs ระยะห่างระหว่างบ้าน

---

## Slide 22: Display Properties 📺

### Display Types หลัก:

#### Block Elements:
```css
display: block;     /* เต็มแถว, ขึ้นบรรทัดใหม่ */
```
ตัวอย่าง: `<div>`, `<h1>`, `<p>`

#### Inline Elements:
```css
display: inline;    /* อยู่ในบรรทัดเดียวกัน */
```
ตัวอย่าง: `<span>`, `<a>`, `<strong>`

#### Inline-Block:
```css
display: inline-block; /* รวมข้อดีของทั้งสอง */
```

---

## Slide 23: Flexbox - Layout สมัยใหม่ 🚀

### สร้าง Flex Container:
```css
.container {
    display: flex;
}
```

### จัดเรียงในแนวนอน:
```css
.container {
    display: flex;
    justify-content: center;     /* กลางแนวนอน */
    align-items: center;         /* กลางแนวตั้ง */
}
```

### จัดเรียงในแนวตั้ง:
```css
.container {
    display: flex;
    flex-direction: column;      /* แนวตั้ง */
}
```

---

## Slide 24: Flexbox Properties รายละเอียด 📋

### สำหรับ Container:
```css
.flex-container {
    display: flex;
    flex-direction: row;         /* row, column */
    justify-content: space-between; /* การจัดแนวนอน */
    align-items: stretch;        /* การจัดแนวตั้ง */
    flex-wrap: wrap;            /* ขึ้นบรรทัดใหม่เมื่อเต็ม */
}
```

### สำหรับ Items:
```css
.flex-item {
    flex: 1;                    /* ขยายเต็มพื้นที่ */
    flex-grow: 2;              /* ขยายเป็น 2 เท่า */
    flex-shrink: 0;            /* ไม่หดตัว */
}
```

---

## Slide 25: ตัวอย่าง Flexbox Layout 💡

### HTML:
```html
<div class="header">
    <div class="logo">โลโก้</div>
    <div class="menu">เมนู</div>
    <div class="search">ค้นหา</div>
</div>
```

### CSS:
```css
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #f0f0f0;
}

.logo { flex: 1; }
.menu { flex: 2; text-align: center; }
.search { flex: 1; text-align: right; }
```

---

## Slide 26: Position Properties 📍

### Static (ปกติ):
```css
position: static;    /* ตำแหน่งปกติตามเอกสาร */
```

### Relative:
```css
position: relative;  /* เลื่อนจากตำแหน่งเดิม */
top: 10px;
left: 20px;
```

### Absolute:
```css
position: absolute;  /* ตำแหน่งแน่นอนจาก parent */
top: 50px;
right: 30px;
```

### Fixed:
```css
position: fixed;     /* ติดกับหน้าจอ */
top: 0;
left: 0;
```

---

## Slide 27: การใช้ CSS Classes ในทางปฏิบัติ 🏷️

### HTML:
```html
<div class="card shadow">
    <h2 class="card-title">หัวข้อการ์ด</h2>
    <p class="card-text">เนื้อหาในการ์ด</p>
    <button class="btn btn-primary">ปุ่ม</button>
</div>
```

### CSS:
```css
.card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
}

.shadow {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-primary {
    background: #007bff;
    color: white;
}
```

---

## Slide 28: CSS Units หน่วยวัด 📏

### หน่วยแน่นอน (Absolute):
```css
px   /* พิกเซล - ใช้บ่อยที่สุด */
pt   /* Point - สำหรับการพิมพ์ */
cm   /* เซนติเมตร */
```

### หน่วยสัมพัทธ์ (Relative):
```css
%    /* เปอร์เซ็นต์ของ parent */
em   /* เท่ากับขนาดฟอนต์ของ element */
rem  /* เท่ากับขนาดฟอนต์ของ root */
vw   /* 1% ของความกว้างหน้าจอ */
vh   /* 1% ของความสูงหน้าจอ */
```

**แนะนำ:** `px` สำหรับขอบและเส้น, `rem` สำหรับฟอนต์

---

## Slide 29: CSS Specificity - กฎการชนะแพ้ ⚖️

### ลำดับความสำคัญ (จากมากไปน้อย):

1. **Inline styles** (1000 คะแนน)
```html
<p style="color: red;">
```

2. **IDs** (100 คะแนน)
```css
#header { color: blue; }
```

3. **Classes** (10 คะแนน)
```css
.highlight { color: green; }
```

4. **Elements** (1 คะแนน)
```css
p { color: black; }
```

**กฎทอง:** CSS ที่เฉพาะเจาะจงมากกว่าจะชนะ!

---

## Slide 30: สรุปและเคล็ดลับ 🎯

### สิ่งที่เราเรียนรู้วันนี้:
✅ CSS Syntax และ Selectors  
✅ Typography และ Colors  
✅ Box Model (margin, padding, border)  
✅ Flexbox Layout พื้นฐาน  
✅ CSS Properties สำคัญ  

### เคล็ดลับการเขียน CSS:
1. **ใช้ External CSS** เสมอ
2. **ตั้งชื่อ Class ให้สื่อความหมาย**
3. **เรียนรู้ Flexbox ให้เก่ง** - ใช้ได้ทุกที่
4. **ทดสอบในหลายเบราว์เซอร์**

### ถัดไป (หัวข้อที่ 3):
Responsive Design - ทำให้เว็บไซต์ดูดีทุกอุปกรณ์!

---

## พักเบรก 15 นาทีครับ ☕
### เตรียมพร้อมสำหรับ Responsive Design!