# User Stories – ENGCE301 Lab Submission Portal

> หมายเหตุ:
> - ใช้สำหรับสร้าง Use Case Diagram / Use Case Scenario
> - ใช้เป็น base ในการออกแบบหน้า HTML/CSS (Week 3 LAB)

---

## กลุ่ม Student

### US-01 – View Lab List
**As a** student  
**I want** to view a list of all labs for ENGCE301  
**So that** I can see what I have to submit and when each lab is due

**Acceptance Criteria (Checklist)**  
- [ ] เมื่อฉันเปิดหน้าหลักของระบบ จะเห็นรายการ LAB ทั้งหมดของรายวิชา  
- [ ] แต่ละ LAB แสดง ชื่อ LAB, คำอธิบายสั้น ๆ, deadline  
- [ ] LAB ที่หมดเขตแล้วต้องถูกแสดงสถานะว่า “ปิดรับส่งแล้ว” หรือเทียบเท่า  

*(ใน LAB HTML, ส่วนนี้ map → Section “Upcoming Labs”)*

---

### US-02 – View Lab Details
**As a** student  
**I want** to view the full details of a specific lab  
**So that** I understand what to do before I submit my work

**Acceptance Criteria (ตัวอย่าง Given–When–Then)**  
- **Given** ฉันอยู่ในหน้า Lab List  
- **When** ฉันคลิก LAB ใด LAB หนึ่ง  
- **Then** ระบบแสดงหน้า Lab Details ที่มี  
  - ชื่อ LAB, จุดประสงค์, รายละเอียด, ไฟล์แนบ/ลิงก์โจทย์, deadline  

*(ใน LAB HTML ระยะนี้ อาจใช้เป็น link หรือ section แสดงรายละเอียดแบบย่อ)*

---

### US-03 – Submit Lab File
**As a** student  
**I want** to upload my lab file before the deadline  
**So that** I can submit my work online and keep a record of my submission

**Acceptance Criteria (ย่อ)**  
- มีปุ่ม/ส่วนติดต่อให้เลือกไฟล์และกด Submit  
- เมื่อส่งสำเร็จ ระบบยืนยันว่ารับไฟล์แล้ว และบันทึกเวลาส่ง  
- หากส่งใหม่ ก่อน deadline ให้ถือ submission ล่าสุดแทนของเดิม  

*(ในวิชานี้อาจใช้เป็น mock UI เฉย ๆ ใน HTML/CSS – ยังไม่ต้องทำ backend)*

---

### US-04 – View My Lab Status
**As a** student  
**I want** to see the status of each lab (submitted / graded / late)  
**So that** I know what I still need to do and which labs are completed

**Acceptance Criteria**  
- หน้า “My Labs” แสดงรายการ LAB ทั้งหมดของฉัน  
- แต่ละ LAB มีสถานะอย่างน้อย:  
  - “Not Submitted”, “Submitted”, “Graded”, และ/หรือ “Late”  
- ถ้ามีคะแนนแล้ว จะแสดงคะแนนและ Feedback สั้น ๆ หรือ icon บอกว่า “มี Feedback”

*(ใน LAB HTML, ใช้ตารางหรือ card แสดงสถานะ → my-labs.html)*

---

### US-05 – Late Submission Notice
**As a** student  
**I want** to know if my submission is considered late  
**So that** I understand how it affects my grade

**Acceptance Criteria**  
- หากส่งหลัง deadline (ตาม policy ของรายวิชา) ระบบต้องแสดงสถานะ “Late”  
- ในหน้า “My Labs” ต้องแสดงสถานะ Late ชัดเจน เช่น ป้ายสีแดง  

---

## กลุ่ม Instructor / TA

### US-06 – Create New Lab
**As an** instructor  
**I want** to create a new lab with description and deadline  
**So that** students can see and submit their work through the portal

**Acceptance Criteria (ย่อ)**  
- ผู้สอนสามารถกรอก: ชื่อ LAB, คำอธิบาย, deadline, ลิงก์หรือไฟล์โจทย์  
- เมื่อสร้างสำเร็จ LAB ต้องไปแสดงในหน้า Lab List ของนักศึกษา  

*(ใน HTML prototype อาจเป็นเพียง section อธิบาย “Instructor View” หรือ mock form)*

---

### US-07 – View All Submissions (per Lab)
**As an** instructor  
**I want** to view a list of all student submissions for a lab  
**So that** I can see who has submitted and who has not

**Acceptance Criteria**  
- ในหน้าผู้สอน (หรือ section mock-up) แสดงรายชื่อนักศึกษา และสถานะการส่ง (submitted / not submitted / late)  

---

### US-08 – Grade a Submission
**As an** instructor or TA  
**I want** to enter a score and feedback for each submission  
**So that** students can see their results and comments

**Acceptance Criteria (ย่อ)**  
- สามารถระบุคะแนน (เช่น 0–100) และข้อความ Feedback ได้  
- หลังบันทึกคะแนนแล้ว นักศึกษามองเห็นคะแนน/Feedback ในหน้า “My Labs”  

*(ใน HTML/CSS LAB อาจทำเป็น mock table/section หรือ modal แสดงตัวอย่างเท่านั้น)*

---

## 3) วิธีใช้ชุด SRS + User Stories นี้ใน LAB

1. **ทำ Use Case Diagram**  
   - จาก FR และ User Stories ด้านบน ให้ นศ. ระบุ Use Cases เช่น  
     - UC-01 View Lab List  
     - UC-02 View Lab Details  
     - UC-03 Submit Lab  
     - UC-04 View My Lab Status  
     - UC-05 Create Lab (Instructor)  
     - UC-06 Grade Submission  
   - วาด diagram (Student, Instructor, TA + System Boundary)

2. **เขียน Use Case Scenario** (อย่างน้อย 2–3 ตัว)  
   - แนะนำ:  
     - UC-03 Submit Lab (Student)  
     - UC-04 View My Lab Status (Student)  
     - UC-06 Grade Submission (Instructor)

3. **เชื่อมกับ LAB HTML/CSS (Week 3)**  
   - แปลง User Stories ที่เกี่ยวกับ Student เป็นหน้าเว็บ เช่น:
     - US-01 + US-02 → Section “Upcoming Labs” และตัวอย่าง Lab Detail บน `index.html`
     - US-03 + US-05 → ปุ่ม/section “Submit Lab” และแสดงข้อความ/สถานะ Late
     - US-04 → หน้า `my-labs.html` ที่มีตาราง/การ์ดแสดงสถานะ LAB
   - ใช้ NFR (Usability / Layout) เป็น guideline ในการออกแบบ HTML/CSS
