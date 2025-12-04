# ENGCE301 – LAB 3 Web  
Lab Submission Portal Landing Page (HTML/CSS)

เวอร์ชันนี้ออกแบบมาให้ใช้ร่วมกับ **ENGCE301 – LAB 3: Agile Requirements & Use Case Modeling (SRS → User Story → Use Case)**

แนวคิดหลัก:  
- ใช้ระบบตัวอย่าง **ENGCE301 Lab Submission Portal** (ระบบส่ง LAB ผ่านเว็บ)  
- นำผลลัพธ์จาก LAB ด้าน Requirements (SRS, User Stories, Use Cases)  
  มาช่วยออกแบบ **หน้าเว็บจริง** ด้วย HTML + CSS

---

## 1. โครงสร้างไฟล์

```text
ENGCE301_LAB3_Web/
  ├─ README.md                 (ไฟล์นี้)
  ├─ index.html                (Landing Page หลัก)
  ├─ about.html                (หน้าอธิบายระบบ / mapping SRS → UI)
  ├─ my-labs.html              (หน้า My Lab Status – mock data)
  └─ styles.css                (ไฟล์ CSS ที่ใช้ร่วมกันทุกหน้า)
```

---

## 2. วัตถุประสงค์ของ LAB Web

เมื่อนักศึกษาทำ LAB นี้เสร็จ (ในห้อง + ทำต่อที่บ้าน) จะสามารถ:

1. นำ **SRS / User Stories / Use Cases** ของระบบ Lab Submission Portal  
   มาออกแบบเป็นโครงหน้าเว็บได้อย่างมีเหตุผล
2. ใช้ **HTML5 Semantic Tags** สร้างโครงสร้างหน้าแบบอ่านง่าย ดูแลรักษาได้
3. ใช้ **CSS Box Model + Layout Basics** (margin, padding, border, width, max-width)  
   เพื่อจัด layout ให้ดูเป็นระเบียบ
4. จัด **Typography + Color Palette** ให้เหมาะสมกับเว็บที่ใช้ในบริบทการเรียน
5. สร้างโครงหน้า **Landing Page + My Labs + About** โดยใช้ CSS ร่วมกัน

---

## 3. งานที่เตรียมไว้ให้แล้ว (~50%)

ในโค้ดมีส่วนที่ *อาจารย์เตรียมไว้ให้แล้ว* เช่น:

- โครงหน้า `index.html` พร้อม Hero, Upcoming Labs section, My Status section
- ตารางแสดงตัวอย่างสถานะ Lab (mock data)
- ส่วนหนึ่งของ **CSS base styles** ใน `styles.css` เช่น:
  - page container
  - header + navbar
  - hero layout
  - card layout
  - status table
  - responsive breakpoint เบื้องต้น

จุดเหล่านี้ช่วยให้นักศึกษาไม่ต้องเริ่มจากกระดาษเปล่า แต่เน้น **อ่าน–เข้าใจ–ต่อยอด** ให้ดีขึ้น

---

## 4. งานที่นักศึกษาต้องทำเอง (~50%)

ส่วนที่มีคำว่า `TODO:` ในโค้ดคือส่วนที่นักศึกษาต้องเติมเอง ทั้งในห้องและเป็นการบ้าน เช่น:

### ใน `index.html`

- ปรับข้อความ **Hero** ให้สอดคล้องกับ SRS / User Stories ของกลุ่ม
- เติมรายการ **Upcoming Labs** เพิ่มเติม (อย่างน้อย 2 lab card) ให้ตรงกับ Backlog จริง
- ปรับ **My Lab Status (Mock Data)** ให้ครอบคลุม LAB 3–5  
  และใช้ class สถานะ `status-done`, `status-pending`, `status-late` ตาม Policy ที่กลุ่มกำหนด
- ปรับ note ให้เชื่อมโยงกับ **Late Submission Policy** ใน SRS

### ใน `about.html`

- เติมคำอธิบายระบบตาม SRS ของกลุ่ม
- เขียน mapping สั้น ๆ ระหว่าง
  - SRS Requirements
  - User Stories
  - Use Cases
  - ส่วนต่าง ๆ บนหน้าเว็บ (sections / cards)

### ใน `my-labs.html`

- ปรับ table/การ์ดแสดงสถานะให้ละเอียดขึ้น  
  (เช่น แยกตามสัปดาห์ หรือแสดงรายละเอียดคะแนน / feedback)
- ทดลองใช้ CSS เดิมจาก `styles.css` มาจัด layout หน้านี้ให้สวยงาม

### ใน `styles.css`

- ปรับ **Color Palette** ให้เป็น style ของกลุ่ม
- ปรับ **Typography** ให้เหมาะสม (เช่น เลือก Google Fonts เพิ่ม)
- เพิ่ม **hover effects** และปรับ **Box Model**  
  (margin/padding/border) ให้หน้าเว็บอ่านง่ายและสมดุล

---

## 5. การใช้งานในห้องเรียน (3 ชม.)

แนะนำ flow การสอน:

1. แจก zip นี้ให้แต่ละกลุ่มแตกไฟล์และเปิดใน VS Code / IDE
2. ให้อ่าน README + เปิดดู `index.html` + `styles.css` แบบเร็ว ๆ
3. อธิบายว่าแต่ละ Section ได้มาจาก User Story / Use Case ตัวไหน
4. ให้นักศึกษาลงมือแก้ `TODO` ในส่วน:
   - Hero message
   - อย่างน้อย 2 Lab Cards
   - My Lab Status rows
   - ปรับ Color Palette + Typography เล็กน้อย
5. ปิดท้ายด้วย mini demo – ให้นักศึกษาบางกลุ่มเปิดหน้าเว็บและอธิบายว่า
   ส่วนใดเชื่อมกับ User Story / Use Case อะไร

---

## 6. การบ้าน (ส่งสัปดาห์ถัดไป)

1. ปรับแต่ง 3 หน้า (`index.html`, `about.html`, `my-labs.html`) ให้สมบูรณ์
2. เติม/ลบ `TODO` ให้เรียบร้อย
3. ผูกหน้าเว็บเข้ากับ Requirement Artifacts ของกลุ่มตนเอง
4. Commit + Push ขึ้น Git พร้อม README ที่อธิบายว่าหน้าไหนเชื่อมกับ User Story / Use Case ใด

สามารถปรับแต่งรายละเอียดเพิ่มเติมให้เหมาะกับห้องเรียนและสไตล์การสอนได้ตามต้องการครับ