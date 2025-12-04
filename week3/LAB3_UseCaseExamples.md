# ENGCE301 – LAB 3
Use Case Examples (Short Version)

ใช้เป็นตัวอย่าง/แม่แบบให้นักศึกษาเขียน Use Case Scenario  
จาก User Stories ของระบบ Lab Submission Portal

---

## 1. Template – Use Case Scenario (สั้น)

ให้นักศึกษาคัดลอก template นี้แล้วกรอกของตัวเอง

```markdown
## UC-XX: <ชื่อ Use Case>

**Primary Actor:** <Student / Instructor / TA>  
**Goal:** <เป้าหมายหลักที่ Actor ต้องการทำให้สำเร็จ>

### Preconditions
- เงื่อนไขที่ต้องเป็นจริงก่อนเริ่ม Use Case

### Postconditions
- เงื่อนไขที่ต้องเป็นจริงหลัง Use Case สำเร็จ

### Main Flow (Happy Path)
1. ...
2. ...
3. ...
4. ...

### Alternative Flows / Exceptions
- **AF-1 – <ชื่อกรณีย่อย>**
  1. ...
  2. ...
- **AF-2 – <ชื่อ error หรือกรณีพิเศษ>**
  1. ...
  2. ...
```

---

## 2. Example UC-01 – View Lab List

**เชื่อมจาก:** US-01 View Lab List

```markdown
## UC-01: View Lab List

**Primary Actor:** Student  
**Goal:** ดูรายการ LAB ทั้งหมดของวิชา ENGCE301

### Preconditions
- นักศึกษาเข้าหน้า Home ของ Portal ได้
- มี LAB อย่างน้อย 1 รายการในระบบ

### Postconditions
- นักศึกษาเห็นรายการ LAB ทุกตัว พร้อมข้อมูลสำคัญ

### Main Flow
1. นักศึกษาเปิดหน้า Home
2. ระบบโหลดรายการ LAB ของวิชา ENGCE301
3. ระบบแสดง list/card ของ LAB แต่ละตัว
4. แต่ละ LAB แสดงชื่อ, คำอธิบายสั้น ๆ, deadline, สถานะ (Open/Closed)
5. นักศึกษาตรวจดู LAB ที่ต้องทำ และเลือก LAB ที่สนใจ

### Alternative Flow
- **AF-1 – ไม่มี LAB ในระบบ**
  1. ที่ขั้นตอน 2 ระบบไม่พบ LAB
  2. ระบบแสดงข้อความ “ยังไม่มี LAB สำหรับรายวิชานี้”
  3. Use Case จบลง
```

---

## 3. Example UC-03 – Submit Lab

**เชื่อมจาก:** US-03 Submit Lab File, US-05 Late Submission Notice

```markdown
## UC-03: Submit Lab

**Primary Actor:** Student  
**Goal:** ส่งไฟล์งาน LAB ผ่านระบบ

### Preconditions
- นักศึกษาเข้าถึงหน้ารายละเอียด LAB นั้นได้
- LAB ยังเปิดรับส่ง (ตาม Policy ของรายวิชา)

### Postconditions
- ระบบบันทึกไฟล์และเวลาส่งงานของนักศึกษา
- สถานะ LAB ของนักศึกษาคนนี้อัปเดต (Submitted หรือ Late)

### Main Flow (ส่งตรงเวลา)
1. นักศึกษาเปิดหน้า Lab Details
2. ระบบแสดงส่วน “Submit Your Lab”
3. นักศึกษากดเลือกไฟล์ (.pdf/.docx/.zip)
4. ระบบตรวจสอบชนิดและขนาดไฟล์เบื้องต้น
5. นักศึกษากดปุ่ม “Submit”
6. ระบบบันทึกไฟล์และเวลาส่ง (timestamp)
7. ระบบตรวจสอบว่าไม่เกิน deadline
8. ระบบอัปเดตสถานะเป็น “Submitted”
9. ระบบแสดงข้อความ “ส่งงานเรียบร้อยแล้ว”

### Alternative Flows
- **AF-1 – File Type ไม่ถูกต้อง**
  1. เกิดจากขั้นตอน 4 เมื่อไฟล์ไม่ใช่ชนิดที่รองรับ
  2. ระบบแจ้งเตือน “ชนิดไฟล์ไม่รองรับ”
  3. กลับไปที่ขั้นตอน 3 ให้เลือกไฟล์ใหม่

- **AF-2 – ส่งหลัง deadline (Late)**
  1. ที่ขั้นตอน 7 ระบบพบว่าเวลาส่งเกิน deadline
  2. ถ้า policy อนุญาต Late:
     - ระบบบันทึกไฟล์
     - ตั้งสถานะเป็น “Late”
  3. นักศึกษาเห็นสถานะ Late ในหน้า My Labs

- **AF-3 – ไม่อนุญาตส่งหลัง deadline**
  1. ที่ขั้นตอน 7 หาก policy ไม่รับหลัง deadline
  2. ระบบไม่บันทึก submission
  3. ระบบแสดงข้อความ “หมดเขตส่งงานแล้ว”
```

---

## 4. Example UC-04 – View My Lab Status

**เชื่อมจาก:** US-04 View My Lab Status

```markdown
## UC-04: View My Lab Status

**Primary Actor:** Student  
**Goal:** ดูภาพรวมสถานะ LAB ทั้งหมดของตัวเอง

### Preconditions
- นักศึกษาเข้าหน้า My Labs ได้
- ระบบมีข้อมูล LAB ของวิชานี้สำหรับนักศึกษาคนนี้

### Postconditions
- นักศึกษาเห็นสถานะ (Not Submitted / Submitted / Graded / Late) ของทุก LAB

### Main Flow
1. นักศึกษาเปิดหน้า “My Labs”
2. ระบบดึงข้อมูล LAB และสถานะของนักศึกษาแต่ละ LAB
3. ระบบแสดงตารางหรือ card ของ LAB ทั้งหมด
4. แต่ละแถว/การ์ดแสดงชื่อ LAB, สถานะ, คะแนน (ถ้ามี)
5. นักศึกษาดูว่า LAB ไหนเสร็จแล้ว และ LAB ไหนยังต้องทำ

### Alternative Flows
- **AF-1 – ยังไม่เคยส่งงาน**
  1. ระบบพบว่า LAB ทั้งหมดเป็นสถานะ Not Submitted
  2. ระบบแสดงข้อความเสริม เช่น “คุณยังไม่ได้ส่ง LAB ใดเลย”

- **AF-2 – มี LAB ที่ Late**
  1. ระบบพบ LAB บางตัวที่ Late
  2. แสดงสถานะ Late ด้วยสี/ป้ายชัดเจน (เช่น สีแดง)
```

---

## 5. งานที่นักศึกษาต้องทำต่อ

1. เลือก Use Case ของกลุ่มเองอย่างน้อย 2–3 ตัว  
   (อาจใช้ UC-01, UC-03, UC-04 เป็นฐาน แล้วเพิ่ม UC อื่น)
2. คัดลอก Template ในหัวข้อ 1 ไปใช้เขียน Use Case Scenario ของกลุ่ม  
3. ตรวจว่า Use Case ที่เขียนสอดคล้องกับ User Stories ในไฟล์ `LAB3_UserStories.md`
4. นำ Main Flow + Alternative Flows ไปช่วยออกแบบโครงหน้า HTML/CSS