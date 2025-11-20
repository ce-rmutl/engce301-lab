# สัปดาห์ที่ 1 – Introduction to Software Engineering & SDLC  
**หัวข้อ:** Introduction to Software Engineering & SDLC + Dev Environment Setup  
**เนื้อหา:**  
– บทบาท/หน้าที่ของวิศวกรซอฟต์แวร์  
– วิวัฒนาการของซอฟต์แวร์  
– SDLC: Waterfall vs Agile (Scrum, Kanban)  
– แนะนำ Git, VSCode, Node.js, Browser DevTools  

---

## 0. ภาพรวมสัปดาห์ที่ 1

### 0.1 เป้าหมายของสัปดาห์ (สรุป)

เมื่อจบสัปดาห์นี้ นักศึกษาควรจะ:

1. เข้าใจความหมายและขอบเขตของ **วิศวกรรมซอฟต์แวร์** (Software Engineering)  
2. มองเห็นความแตกต่างระหว่างการ “เขียนโปรแกรม” กับ “การทำวิศวกรรมซอฟต์แวร์ในทีม”  
3. อธิบายภาพรวมของ **SDLC** และเปรียบเทียบโมเดลหลัก **Waterfall vs Agile (Scrum/Kanban)** ได้  
4. มองเห็นบทบาทต่าง ๆ ในทีมพัฒนาซอฟต์แวร์สมัยใหม่ (Developer, QA, DevOps, Product Owner ฯลฯ)  
5. ติดตั้งและใช้งานเครื่องมือพื้นฐาน **Git, VS Code, Node.js, Browser DevTools** ได้ (ระดับเริ่มต้น)  
6. เห็นภาพว่าเนื้อหาสัปดาห์นี้เชื่อมกับ **Term Project** ทั้งเทอมอย่างไร

### 0.2 โครงสร้างเวลา (แนะนำ)

- ทฤษฎี (Lecture/Discussion): 60–70 นาที  
- กิจกรรมกลุ่ม/Infographic/Reflection: 30–40 นาที  
- Lab 1 (Environment Setup & Git-backed Web Page): 120–150 นาที  

---

## 1. ความหมายและขอบเขตของ “วิศวกรรมซอฟต์แวร์”

### 1.1 ทำไมต้อง “วิศวกรรม” ไม่ใช่แค่เขียนโปรแกรม

ในอดีต คนมักคิดว่า “ซอฟต์แวร์ = โค้ดที่รันได้”  
แต่เมื่อระบบใหญ่ขึ้น ซับซ้อนขึ้น และมีผู้ใช้จำนวนมาก ปัญหาต่าง ๆ ก็เริ่มเกิดขึ้น:

- โปรเจกต์ล้มเหลว: ส่งไม่ทัน เกินงบ หรือใช้งานไม่ได้จริง  
- บั๊กในระบบสำคัญ (เช่น การเงิน การแพทย์ การบิน) สร้างความเสียหายมหาศาล  
- ระบบใหญ่จนมนุษย์ “จำทุกอย่างในหัว” ไม่ไหวอีกต่อไป  

จึงเกิดแนวคิด **Software Engineering** ขึ้นมา:

> การประยุกต์ใช้หลักการทางวิศวกรรม (engineering principles)  
> เพื่อวิเคราะห์ ออกแบบ พัฒนา ทดสอบ และบำรุงรักษาซอฟต์แวร์  
> อย่างเป็นระบบ มีคุณภาพ และตรวจสอบได้ ตลอดวงจรชีวิต

เพื่อแก้ปัญหา “Software Crisis” และทำให้การพัฒนาซอฟต์แวร์เป็นกิจกรรมที่ **วางแผน คาดการณ์ และควบคุมได้มากขึ้น** ไม่ใช่ “งานศิลปะของโปรแกรมเมอร์คนเดียว”

---

### 1.2 Programming vs Software Engineering

#### ตารางเปรียบเทียบมุมมอง

| มุมมอง           | Programming (เขียนโปรแกรม)        | Software Engineering (วิศวกรรมซอฟต์แวร์)                      |
|-----------------|----------------------------------|-----------------------------------------------------------|
| โฟกัสหลัก         | ทำให้โค้ดรันได้ ถูกต้อง                | ทำให้ “ระบบซอฟต์แวร์” มีคุณภาพ ทั้งระยะสั้นและระยะยาว               |
| ขอบเขต          | ฟังก์ชัน/โปรแกรมเล็ก ๆ               | ระบบซับซ้อนที่มีผู้ใช้ ทีม และองค์กรเกี่ยวข้อง                          |
| กรอบคิด          | โค้ดและ algorithm เป็นหลัก          | Process + People + Tools + Standards + Quality Attributes |
| เวลา            | มักมองแค่ระยะสั้น (ทำให้เสร็จ)         | มองทั้งวงจรชีวิต (เปลี่ยนแปลง บำรุงรักษา ขยายระบบ)                 |
| การทำงานเป็นทีม   | น้อย/ไม่ชัด                         | จำเป็น (multi-role, multi-team)                            |

#### Infographic ASCII: มุมมอง 2 แบบ

```text
┌─────────────────────────────────────────┐
│ Programmer View                         │
│  - โค้ดคือทุกอย่าง                          │
│  - งานสำเร็จ = โปรแกรมรันผ่าน              │
│  - คิดทีละไฟล์ ทีละฟังก์ชัน                    │
└────────────────────────────────── ──────┘
                    VS
┌─────────────────────────────────────────┐
│ Software Engineer View                  │
│  - ซอฟต์แวร์ = ระบบ + ผู้ใช้ + ทีม + องค์กร    │
│  - งานสำเร็จ = ระบบมีคุณภาพ ใช้งานได้จริง     │
│    รักษา/ปรับปรุงต่อได้                      │
│  - คิดระดับสถาปัตยกรรม + กระบวนการ         │
└─────────────────────────────────────────┘
```

---

### 1.3 องค์ประกอบสำคัญของงานวิศวกรรมซอฟต์แวร์

1. **Process (กระบวนการ)**

   * กำหนดขั้นตอนชัดเจน (Requirements → Design → Implementation → Testing → Deployment → Maintenance)
   * ลดความเสี่ยง ลดความสับสน และทำให้ทีมสื่อสารกันรู้เรื่อง

2. **Methods & Techniques (วิธีการ/เทคนิค)**

   * เช่น Use Case, UML, Design Patterns, Test Techniques, Refactoring, Code Review
   * ช่วยให้การวิเคราะห์และออกแบบมีมาตรฐาน ไม่คิดสดทุกครั้ง

3. **Tools (เครื่องมือ)**

   * เช่น Git, Issue Tracker, CI/CD, IDE, Static Analysis Tools
   * ทำให้การทำงานซ้ำ ๆ ทำได้อัตโนมัติและปลอดภัยขึ้น

4. **Standards & Best Practices (มาตรฐาน/แนวปฏิบัติ)**

   * เช่น SWEBOK (Software Engineering Body of Knowledge), ISO/IEC/IEEE 12207, coding standards ฯลฯ
   * ทำให้งานที่หลายคนทำร่วมกัน “เข้ากันได้” และตรวจสอบ/ประเมินได้

---

## 2. บทบาทและหน้าที่ของวิศวกรซอฟต์แวร์ในทีม

### 2.1 ภาพรวมบทบาทในทีมซอฟต์แวร์สมัยใหม่

ในระบบจริง 1 ทีม มักมีหลายบทบาท (roles) ไม่ใช่แค่ “คนเขียนโค้ด”:

* **Software Developer / Software Engineer**

  * เขียนโค้ด ทดสอบเบื้องต้น แก้บั๊ก
  * ทำงานตาม requirement ที่ได้รับ
* **Requirements Engineer / Business Analyst (BA)**

  * เก็บและวิเคราะห์ requirement จากลูกค้า/ผู้ใช้
  * เขียนเอกสาร SRS, Use Case, User Story
* **Software Architect**

  * ออกแบบสถาปัตยกรรมระบบ (layer, microservices, API)
  * เลือก technology stack และกำหนด guideline หลัก
* **QA Engineer / Tester**

  * วางแผน/ออกแบบ test case
  * ทำ manual/automated testing
* **DevOps / SRE**

  * ดูแลระบบใน production
  * สร้าง/ดูแล CI/CD pipeline, monitoring, scaling
* **Product Owner / Product Manager**

  * กำหนดทิศทาง product และลำดับความสำคัญของ feature
  * เป็นตัวกลางระหว่าง business กับทีม dev

#### Infographic ASCII: Value Chain ของบทบาท

```text
 Idea / Business Need
        │
        ▼
+---------------------------+
|  Product Owner / PM       |
+---------------------------+
        │  แปลงเป็น
        ▼  requirement
+---------------------------+
|  BA / Requirements Eng.   |
+---------------------------+
        │  ทำโมเดล/สเปก
        ▼
+---------------------------+
|  Software Architect       |
+---------------------------+
        │  กำหนดโครงสร้างระบบ
        ▼
+---------------------------+
|  Dev / QA / Tester        |
+---------------------------+
        │  พัฒนา+ทดสอบ
        ▼
+---------------------------+
|  DevOps / SRE             |
+---------------------------+
        │  run ใน production
        ▼
   ผู้ใช้ & ผู้มีส่วนได้ส่วนเสีย
```

---

### 2.2 ทักษะที่วิศวกรซอฟต์แวร์ควรมี

**Hard Skills**

* Programming (อย่างน้อย 1–2 ภาษา)
* Data Structures & Algorithms
* Software Design / Architecture พื้นฐาน
* Database, Web, API
* Version Control (Git)
* Testing Basics (Unit / Integration / System Test)

**Soft Skills**

* การสื่อสาร (พูด-เขียนให้คนอื่นเข้าใจ)
* การทำงานเป็นทีม (รับฟัง/ช่วยกันแก้ปัญหา)
* การจัดการเวลา/งาน (task management, prioritization)
* การเรียนรู้ด้วยตัวเอง (อ่านเอกสาร, ลองใช้เครื่องมือใหม่ ๆ)

---

### 2.3 กิจกรรมสะท้อนคิดในชั้นเรียน (ตัวอย่าง)

ให้ นศ. ทำงานกลุ่มเล็ก (3–4 คน):

1. เลือก 1 บทบาทที่แต่ละคน “อยากลองเป็น” ในอนาคต (เช่น Backend Dev, QA, DevOps, Architect)
2. ตอบคำถาม:

   * ทำไมถึงสนใจบทบาทนี้?
   * ทักษะไหนที่คิดว่ายังขาด และอยากพัฒนาในช่วงเวลาที่เรียนปริญญาตรี?

บันทึกลงในกระดาษ/โพสต์ใน LMS → ใช้เป็น evidence ของทักษะด้าน **CLO6 (teamwork & communication)**

---

## 3. วิวัฒนาการของซอฟต์แวร์และผลต่อวิธีการพัฒนา

### 3.1 เส้นเวลาความเปลี่ยนแปลงของซอฟต์แวร์

```text
1970s  - Mainframe, Batch processing, ภาษาระดับสูงยุคแรก (COBOL, FORTRAN)
        - โมเดล Waterfall เริ่มถูกใช้ในโปรเจกต์ใหญ่

1980s  - PC, ระบบ Desktop, ระบบองค์กรขนาดเล็ก

1990s  - Client-Server, เครือข่าย, Web ยุคแรก
        - Use-case, UML, Rational Unified Process, iterative models

2000s  - Web 2.0, Mobile, SaaS
        - Agile Manifesto (2001), Scrum, XP, Kanban เริ่มแพร่หลาย

2010s  - Cloud, DevOps, Microservices, Containerization
        - CI/CD, Continuous Delivery, Infrastructure as Code

2020s  - Cloud-native, Data-intensive, AI-based systems
        - MLOps, DevSecOps, ระบบกระจายตัวสูงและซับซ้อน
```

### 3.2 ผลกระทบต่อการทำงานของวิศวกรซอฟต์แวร์

1. **ปริมาณผู้ใช้เพิ่มขึ้นมหาศาล**

   * ระบบหนึ่งระบบอาจมีผู้ใช้ระดับหมื่น–ล้านคน
   * ต้องคิดเรื่อง performance, scalability, fault tolerance ตั้งแต่ design

2. **การเปลี่ยนแปลงกลายเป็นเรื่องปกติ**

   * Business เปลี่ยนเร็ว → feature, requirement เปลี่ยนบ่อย
   * ต้องมีกระบวนการและโมเดลที่ยืดหยุ่น (Agile, Incremental, Continuous Delivery)

3. **ความซับซ้อนของระบบเพิ่มขึ้น**

   * ระบบเดียวเชื่อมต่อกับอีกหลายระบบ (API, external services)
   * ต้องการสถาปัตยกรรมที่ดี + การทดสอบที่ครอบคลุม

---

## 4. SDLC และกรอบมาตรฐานวงจรชีวิตซอฟต์แวร์

### 4.1 SDLC คืออะไร

**Software Development Life Cycle (SDLC)** คือ

> กรอบของขั้นตอนการพัฒนาซอฟต์แวร์ตั้งแต่เริ่มคิด จนกระทั่งเลิกใช้งาน

เวอร์ชันพื้นฐานมักประกอบด้วย:

1. **Requirements Analysis** – วิเคราะห์/เก็บความต้องการ
2. **System & Software Design** – ออกแบบโครงสร้างระบบ ฐานข้อมูล ส่วนติดต่อ ฯลฯ
3. **Implementation (Coding)** – เขียนโค้ดตามแบบที่ออกแบบ
4. **Testing** – ตรวจสอบความถูกต้องและคุณภาพ
5. **Deployment** – นำขึ้นใช้งานจริง
6. **Maintenance** – แก้บั๊ก ปรับปรุง เพิ่มฟีเจอร์ใหม่

#### Infographic ASCII: SDLC วนรอบ

```text
[Requirements]
      ↓
[Design]
      ↓
[Implementation]
      ↓
[Testing]
      ↓
[Deployment]
      ↓
[Maintenance]
      ↺ (วนกลับเมื่อมีการปรับปรุง/เพิ่มฟีเจอร์)
```

---

### 4.2 โมเดล vs มาตรฐาน

* **โมเดลกระบวนการ (Process Model)**

  * เช่น Waterfall, V-Model, Incremental, Spiral, Agile
  * เป็น “รูปแบบการจัดลำดับ/แบ่งเฟส” ของขั้นตอน SDLC

* **มาตรฐานวงจรชีวิต (เช่น ISO/IEC/IEEE 12207, SWEBOK)**

  * กำหนด “รายการกระบวนการ” ที่องค์กรควรมี เช่น

    * Requirement Definition Process
    * Software Construction Process
    * Software Testing Process
    * Configuration Management, Verification, Validation ฯลฯ
  * ไม่ได้บังคับว่าต้องใช้โมเดลแบบไหน แต่ให้กรอบให้องค์กร design process ของตนเองได้

**อธิบายง่าย ๆ ในชั้นเรียน**

> โมเดล = แบบแผนการเดิน (step ลำดับ)
> มาตรฐาน = check-list ว่าระหว่างเดิน เราไม่ลืมทำเรื่องสำคัญ

---

## 5. Waterfall Model

### 5.1 แนวคิดหลัก

* ทำงานเป็นลำดับขั้น (phase) ไหลลงมาคล้าย “น้ำตก”
* แต่ละเฟสมี deliverable ชัดเจน (เอกสาร, code, test result)
* เฟสถัดไปควรเริ่มเมื่อเฟสก่อนหน้า “เสร็จ” หรือถือว่าเสร็จแล้ว

#### Infographic ASCII: Waterfall

```text
Requirements
    ↓
System & Software Design
    ↓
Implementation & Unit Testing
    ↓
Integration & System Testing
    ↓
Deployment & Maintenance
```

### 5.2 รายละเอียดแต่ละเฟส

1. **Requirements**

   * เก็บ/วิเคราะห์ความต้องการจากลูกค้า/ผู้ใช้
   * เอกสารสำคัญ: SRS (Software Requirements Specification)
   * ถ้าขั้นนี้ผิดพลาด → ความเสียหายลากไปทุกเฟส

2. **System & Software Design**

   * แบ่งโครงสร้างระบบเป็น module/component
   * ออกแบบฐานข้อมูล, API, UI/UX ในระดับ high-level
   * เอกสาร: Design Document, diagram ต่าง ๆ (UML, ERD)

3. **Implementation & Unit Testing**

   * แปลง design เป็น source code
   * เขียน unit test ทดสอบฟังก์ชัน/คลาสทีละส่วน
   * ผลลัพธ์: code ที่ผ่าน unit test

4. **Integration & System Testing**

   * รวม module ต่าง ๆ แล้วทดสอบการทำงานร่วมกัน
   * ตรวจ scenario ตาม business flow จริง
   * เอกสาร: Test Report, Bug List

5. **Deployment & Maintenance**

   * นำระบบขึ้นใช้งานจริง
   * แก้บั๊ก สร้าง patch สำคัญ
   * เพิ่ม/ปรับฟีเจอร์ตามความต้องการในอนาคต

### 5.3 จุดแข็ง–จุดอ่อน

**ข้อดี**

* กระบวนการชัดเจน เอกสารชัด
* เหมาะกับโครงการที่ requirement ค่อนข้างนิ่ง (เช่น งานราชการบางประเภท, ระบบที่ต้องการเอกสารเต็มรูปแบบ)
* ง่ายต่อการวางแผนและประมาณเวลา/งบประมาณ

**ข้อเสีย**

* Feedback ช้า: ผู้ใช้เห็นของจริงช้า (ปลายโครงการ)
* เปลี่ยน requirement ระหว่างทางยากและมีราคาแพง
* ไม่เหมาะกับระบบที่ต้องค้นหา/ปรับ product-market fit

### 5.4 ตัวอย่างใช้ Waterfall กับโปรเจกต์ง่าย ๆ

**ระบบลงทะเบียนเรียนออนไลน์**

* Requirements: ฟังก์ชันเลือก/ลบวิชา, ตรวจสอบหน่วยกิต, ดูตารางเรียน
* Design: ออกแบบ architecture 3-tier, ตาราง DB (student, course, registration)
* Implementation: เขียน backend + frontend
* Testing: ทดสอบกรณีเลือกเกินหน่วยกิต, ลงทะเบียนซ้ำ, การยกเลิกวิชา
* Deployment: นำระบบขึ้นใช้งานกับนักศึกษา

---

## 6. Agile, Scrum และ Kanban

### 6.1 Agile Mindset

Agile ไม่ได้หมายถึง “ไม่มีเอกสาร” หรือ “ทำอะไรก็ได้”
แต่เป็น mindset ที่เน้น:

1. คนและการสื่อสาร > กระบวนการและเครื่องมือ
2. ซอฟต์แวร์ที่ใช้งานได้ > เอกสารที่ละเอียดมากเกินจำเป็น
3. การร่วมมือกับลูกค้า > การต่อรองในสัญญาอย่างเดียว
4. การตอบสนองต่อการเปลี่ยนแปลง > การยึดแผนเดิมแบบแข็ง ๆ

Implication สำหรับนักศึกษา:

* ต้องฝึกสื่อสารและทำงานร่วมกับเพื่อน
* ใช้ feedback จากผู้ใช้/อาจารย์/เพื่อน ปรับงานให้ดีขึ้นเรื่อย ๆ
* แบ่งงานเป็นชิ้นเล็ก ๆ ที่ส่งมอบได้บ่อย

---

### 6.2 Scrum – กรอบการทำงานแบบรอบสั้น (Sprint)

**Roles**

* **Product Owner (PO)** – เจ้าของ Product Vision และลำดับความสำคัญของงาน
* **Scrum Master** – ผู้ช่วยให้ทีมทำงานตาม Scrum และช่วยแก้ปัญหาอุปสรรค
* **Developers** – ทีมที่สร้าง increment (ซอฟต์แวร์ที่ใช้งานได้)

**Events**

* **Sprint** – รอบการทำงาน 1–4 สัปดาห์
* **Sprint Planning** – วางแผนว่าจะทำงานอะไรใน Sprint นี้
* **Daily Scrum** – 15 นาทีต่อวัน ตอบ 3 คำถาม: ทำอะไรเมื่อวาน วันนี้จะทำอะไร ติดอะไรอยู่
* **Sprint Review** – demo ผลงานให้ผู้มีส่วนได้ส่วนเสียดู
* **Sprint Retrospective** – ทบทวนวิธีการทำงานของทีม และหาวิธีปรับปรุง

**Artifacts**

* **Product Backlog** – รายการงานทั้งหมดที่อยากให้ product มี
* **Sprint Backlog** – รายการงานที่เลือกมาทำใน Sprint ปัจจุบัน
* **Increment** – ซอฟต์แวร์ที่ใช้งานได้จริง ณ สิ้น Sprint

#### Infographic ASCII: Scrum Cycle

```text
Product Backlog
      │
      ▼  (Sprint Planning)
Sprint Backlog ──► Sprint (1-2 weeks) ──► Increment
                          │
                          ▼
                    Daily Scrum
                          │
                    +-----------+
                    |  Review   |
                    |  Retro    |
                    +-----------+
```

---

### 6.3 Kanban – การจัดการ “การไหลของงาน” (Flow)

หลักการสำคัญ:

* แสดงงานให้มองเห็นทั้งหมด (Visualize Work)
* จำกัดจำนวนงานที่กำลังทำอยู่ (WIP Limit)
* จัดการ “การไหล” ของงานจากซ้ายไปขวาให้ลื่นไหล

#### ASCII ตัวอย่าง Kanban Board

```text
┌───────────┬────────────────┬───────────┬─────────────┐
│   Backlog │   To Do (WIP2) │  Doing    │    Done     │
├───────────┼────────────────┼───────────┼─────────────┤
│ Feature A │  Feature B     │ Bug #101  │ Hotfix #33  │
│ Feature C │  Bug #99       │           │             │
└───────────┴────────────────┴───────────┴─────────────┘
```

ใน Term Project ของวิชา สามารถให้แต่ละกลุ่มใช้ Kanban (Post-it บนกระดาน หรือ board ออนไลน์) เพื่อจัดการ task เช่น:

* To Do: ออกแบบหน้า Login, เชื่อมต่อ DB
* Doing: สร้าง API `/login`
* Done: ออกแบบ ER-diagram เสร็จ

---

### 6.4 เปรียบเทียบ Waterfall vs Agile

| มิติ           | Waterfall               | Agile (Scrum/Kanban)                |
| ------------ | ----------------------- | ----------------------------------- |
| ลำดับงาน      | ทำเป็นเฟสใหญ่ทีละขั้น        | ทำงานเป็นรอบสั้น ๆ (Sprint/flow)        |
| การเปลี่ยนแปลง | เปลี่ยนยาก ค่าใช้จ่ายสูง      | เปลี่ยนได้ เป็นเรื่องปกติของกระบวนการ       |
| การส่งมอบ     | ส่งของจริงตอนท้ายโครงการ   | ส่ง increment ที่ใช้งานได้บ่อย ๆ           |
| การสื่อสาร     | เน้นเอกสารและการประชุมใหญ่ | เน้นการคุยสั้น ๆ บ่อย ๆ และการ demo       |
| ใช้งานเหมาะกับ | requirement ค่อนข้างนิ่ง    | product ที่ต้องปรับตาม feedback ลูกค้าเร็ว  |

---

## 7. เชื่อมมุมมอง SDLC กับ Term Project ของวิชา

### 7.1 Hybrid Approach (Mini Waterfall + Agile Inside)

ในบริบทของรายวิชา สามารถใช้แนวคิดผสม:

* ระดับเทอม: วางแผนแบบ Waterfall-ish เป็น Stage ใหญ่ ๆ

  * ช่วงต้นเทอม: Requirements & Design
  * กลางเทอม: Implementation & Testing
  * ปลายเทอม: Deployment & Presentation

* ระดับการทำงานในแต่ละ Stage: ใช้แนวคิด Agile

  * แบ่งงานเป็น user story
  * ใช้ Kanban Board / Sprint สั้น ๆ 1–2 สัปดาห์
  * ทำ Demo ให้เพื่อน/อาจารย์ดูเป็นรอบ

#### Infographic ASCII: Roadmap รายวิชา (ตัวอย่าง)

```text
+---------------- WEEK 1 --------------------+
| Intro SE + SDLC + Tools (Git/VSCode/Node)  |
+---------------- WEEK 2-4 ------------------+
| Requirements + UI/UX + HTML/CSS            |
+---------------- WEEK 5-7 ------------------+
| JS + Node/Express + DB                     |
+---------------- WEEK 8 --------------------+
| Midterm                                   |
+---------------- WEEK 9-12 -----------------+
| React + API + MongoDB + Testing/Security   |
+---------------- WEEK 13-15 ----------------+
| Refactor + Quality + Deployment            |
+---------------- WEEK 16-17 ----------------+
| Final Project Demo + Final Exam            |
```

---

## 8. เครื่องมือพื้นฐานในสัปดาห์ที่ 1

### 8.1 Git – Version Control

**แนวคิดหลัก**

* เก็บประวัติโค้ดเป็น **commit**
* สามารถย้อนกลับไปยังสถานะเดิมได้ (rollback)
* ทำงานหลายคนบนโค้ดชุดเดียวกันได้ (branch + merge)

**คำศัพท์สำคัญ**

* Repository (repo) – บ้านเก็บประวัติโค้ด
* Commit – snapshot การเปลี่ยนแปลงพร้อมข้อความอธิบาย
* Branch – เส้นทางพัฒนาแยกออกจาก main
* Merge – การนำ branch มารวมกัน

#### ASCII: Git Workflow พื้นฐาน

```text
[Working Directory] --git add--> [Staging Area]
        │                               │
        └-------- git commit ---------->▼
                              [Local Repository] --git push--> [Remote Repo]
```

คำสั่งพื้นฐาน:

```bash
git init
git status
git add .
git commit -m "Initial commit"
git log --oneline
git push -u origin main
git pull
```

---

### 8.2 Visual Studio Code (VS Code)

เหตุผลที่ใช้ในวิชา:

* ฟรี และ cross-platform
* มี extension มากมาย เช่น ESLint, Prettier, GitLens
* มี integrated terminal + debug tools

ทิปสำหรับนักศึกษา:

* ใช้ keyboard shortcuts ให้คล่อง เช่น

  * `Ctrl+P` – เปิดไฟล์
  * `Ctrl+Shift+P` – Command Palette
* ตั้ง theme + font ให้เหมาะกับการใช้งานระยะยาว

---

### 8.3 Node.js และ npm

* Node.js = JavaScript runtime นอก browser
* npm = package manager ของ Node.js
* ใช้สำหรับ:

  * รันโปรแกรม JS ฝั่ง server
  * รันเครื่องมือ development (bundler, linter, test runner)
  * จัดการ dependencies ใน Term Project

ตัวอย่าง script ใน `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

---

### 8.4 Browser DevTools – “กล้องเอ็กซ์เรย์” ของเว็บ

Panel ที่ควรฝึกใช้จนชิน:

* **Elements** – ดู/แก้ไขโครงสร้าง DOM และ CSS แบบเรียลไทม์
* **Console** – ดู error และ log ของ JavaScript
* **Network** – ดู request/response (HTTP status, เวลาโหลด, header)
* **Responsive / Device Mode** – ทดสอบเว็บบนขนาดหน้าจอต่าง ๆ

ตัวอย่าง scenario ในคลาส:

> ปุ่ม “สมัครสมาชิก” กดแล้วไม่ทำงาน
>
> * เปิด Console → พบ error ว่า function ไม่ถูกนิยาม
> * ตรวจ Elements → พบว่า script ไม่ได้ถูกโหลด
> * ใช้ Network → เห็นว่าไฟล์ JS 404 เพราะ path ผิด
>
> → จาก DevTools เราสามารถหาต้นตอปัญหาอย่างเป็นระบบ แทนการเดาสุ่ม

---


