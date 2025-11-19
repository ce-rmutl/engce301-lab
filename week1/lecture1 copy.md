# สัปดาห์ที่ 1 – Introduction to Software Engineering & SDLC  
**รายวิชา:** ENGCE301 – การออกแบบและพัฒนาซอฟต์แวร์ (Software Design and Development)  
**ชั่วโมงเรียน:** 2 ชม. ทฤษฎี + 3 ชม. ปฏิบัติ  
**เชื่อมกับ CLO:** CLO1, CLO4, CLO6 

---

## 0. ภาพรวมและจุดประสงค์สัปดาห์ที่ 1

### 0.1 หัวข้อประจำสัปดาห์

> **Introduction to Software Engineering & SDLC + Dev Environment Setup**  
> – บทบาท/หน้าที่ของวิศวกรซอฟต์แวร์  
> – วิวัฒนาการของซอฟต์แวร์  
> – SDLC: Waterfall vs Agile (Scrum, Kanban)  
> – แนะนำ Git, VSCode, Node.js, Browser DevTools 

### 0.2 จุดประสงค์การเรียนรู้รายสัปดาห์ (เมื่อจบสัปดาห์นี้ นศ. สามารถ…)

1. **CLO1:**  
   - อธิบายได้ว่า “วิศวกรรมซอฟต์แวร์” คืออะไร และต่างจาก “การเขียนโปรแกรมธรรมดา” อย่างไร  
   - อธิบายภาพรวม SDLC และบทบาทของกระบวนการพัฒนาในมุมมาตรฐาน (SWEBOK, ISO/IEC/IEEE 12207)  

2. **CLO1 (ต่อ) & ความเข้าใจ Agile:**  
   - เปรียบเทียบ **Waterfall vs Agile (Scrum/Kanban)** ได้ทั้งมุมข้อดี–ข้อจำกัด  
   - ยกตัวอย่างว่ารูปแบบใดเหมาะกับโปรเจกต์ลักษณะไหน (รวมถึง Term Project ของวิชา)

3. **CLO4:**  
   - ติดตั้งและตรวจสอบการทำงานของ **Git, VS Code, Node.js, Browser DevTools** บนเครื่องตนเอง  
   - สร้างโครงโปรเจกต์พื้นฐาน (โฟลเดอร์ + index.html + README.md)  
   - Init Git repo และ push ขึ้น remote สำหรับ Term Project ได้อย่างถูกต้อง  

4. **CLO6:**  
   - ทำงานร่วมกันในกลุ่ม (3–4 คน) ในการตั้งค่า environment และจัดการ Git repository  
   - เริ่มสะท้อนบทบาทของตนเองในทีมพัฒนาซอฟต์แวร์ (อยากเป็น Dev / QA / DevOps / Architect ฯลฯ)

---

## 1. บทนำวิศวกรรมซอฟต์แวร์ (Software Engineering)

### 1.1 ปัญหาที่ทำให้ต้องมี “วิศวกรรมซอฟต์แวร์”

ประวัติศาสตร์ของซอฟต์แวร์เคยผ่านยุคที่เรียกว่า **Software Crisis**:

- โปรเจกต์ล้มเหลวจำนวนมาก – ส่งไม่ทัน ใช้งานไม่ได้ หรือเกินงบประมาณมาก  
- ระบบซอฟต์แวร์ในโดเมนสำคัญ (การแพทย์ การบิน การเงิน) เกิดบั๊กจนเกิดความเสียหายใหญ่  
- ขนาดและความซับซ้อนของระบบ **ใหญ่เกินกว่าที่คนไม่กี่คนจะ “จำทั้งหมดในหัว” ได้**

**คำตอบของอุตสาหกรรม:**

> ต้องเอา “ความเป็นวิศวกรรม” เข้ามาช่วย  
> = มีหลักการ/กระบวนการ/มาตรฐาน  
> ไม่ใช่อาศัยฝีมือโปรแกรมเมอร์คนเดียว

### 1.2 นิยามและขอบเขต (โยงมาตรฐาน SWEBOK/IEEE)

ในมุมของ IEEE / SWEBOK (Software Engineering Body of Knowledge):

- วิศวกรรมซอฟต์แวร์เป็น **สาขาวิศวกรรม** ที่ผสม  
  - **ความรู้เชิงเทคนิค** (requirements, design, construction, testing, maintenance ฯลฯ)  
  - **กระบวนการ** (processes)  
  - **เครื่องมือ** (tools)  
  - **การจัดการ** (management, quality, configuration management)  

SWEBOK แบ่ง “เนื้อหาหลัก” ที่วิศวกรซอฟต์แวร์ควรรู้เป็นหมวด เช่น

- Software Requirements  
- Software Design  
- Software Construction  
- Software Testing  
- Software Maintenance  
- Software Configuration Management  
- Software Engineering Process / Management ฯลฯ  

> ในรายวิชา ENGCE301 เราจะสัมผัสหลายหมวดของ SWEBOK  
> โดยเฉพาะ Requirements, Design, Construction, Testing และ Configuration Management (ผ่าน Git) 

---

### 1.3 Programming vs Software Engineering

#### ตารางเปรียบเทียบ

| มุมมอง            | Programming (เขียนโปรแกรม)                     | Software Engineering (วิศวกรรมซอฟต์แวร์)                          |
|-------------------|-----------------------------------------------|--------------------------------------------------------------------|
| โฟกัสหลัก         | ให้โค้ดรันผ่าน ได้ผลลัพธ์ถูกต้อง              | ให้ “ระบบซอฟต์แวร์” มีคุณภาพ ใช้งานได้จริงและดูแลต่อได้ยาว      |
| ขอบเขต           | ฟังก์ชัน/โปรแกรมเล็ก ๆ                       | ระบบซับซ้อน มีหลายโมดูล หลายทีม หลายผู้มีส่วนได้ส่วนเสีย      |
| เวลา              | มองช่วงสั้น ๆ (ทำฟีเจอร์นี้ให้เสร็จเร็ว)     | มองทั้งวงจรชีวิต (เปลี่ยนแปลง ขยายระบบ บำรุงรักษา)            |
| สิ่งที่ต้องคิดเพิ่ม| ไม่มากไปกว่าโค้ดและ algorithm              | requirement, design, testing, quality, security, documentation ฯลฯ |

#### Infographic ASCII

```text
┌───────────────────────────────────────────────┐
│ Programmer View                               │
│  - โค้ด = ทุกอย่าง                               │
│  - งานสำเร็จ = โปรแกรมรันผ่าน                    │
│  - สนใจโจทย์เฉพาะหน้า                           │
└───────────────────────────────────────────────┘
                    VS
┌───────────────────────────────────────────────┐
│ Software Engineer View                        │
│  - ซอฟต์แวร์ = ระบบ + ผู้ใช้ + ทีม + องค์กร          │
│  - งานสำเร็จ = ระบบมีคุณภาพ ใช้งานได้ยาว           │
│  - สนใจทั้งการออกแบบ, ทดสอบ, ดูแล, ขยายต่อ        │
└───────────────────────────────────────────────┘
```

---

## 2. บทบาทในทีมซอฟต์แวร์และทักษะที่ต้องมี

### 2.1 บทบาทหลักในทีมยุคใหม่

ใน Term Project ของวิชานี้ นศ. จะลอง “สวมหมวกหลายใบ” ของบทบาทเหล่านี้:

* **Software Developer / Software Engineer**

  * เขียนโค้ด, ทดสอบเบื้องต้น, แก้บั๊ก, refactor
* **Requirements Engineer / Business Analyst (BA)**

  * คุยกับ “ลูกค้า/ผู้ใช้” (จำลอง)
  * แปลงความต้องการเป็น use case / user story / SRS ย่อ
* **Software Architect (ระดับเบื้องต้น)**

  * คิดโครงสร้างระบบ (frontend–backend–DB), API คร่าว ๆ
* **QA Engineer / Tester**

  * ช่วยออกแบบ test case
  * ทดสอบฟีเจอร์ที่กลุ่มพัฒนา
* **DevOps (เบื้องต้น)**

  * ดูเรื่องการรันระบบในเครื่อง dev / demo
  * ตั้งค่า script, npm command ต่าง ๆ

#### Infographic: Value Chain บทบาทในทีม

```text
 Idea / Problem
        │
        ▼
+---------------------------+
| Product Owner / BA        |  (นิยามความต้องการ)
+---------------------------+
        │
        ▼
+---------------------------+
| Architect / Tech Lead     |  (ออกแบบสถาปัตยกรรม)
+---------------------------+
        │
        ▼
+---------------------------+
| Dev + QA + Tester         |  (สร้างและทดสอบระบบ)
+---------------------------+
        │
        ▼
+---------------------------+
| DevOps / SRE              |  (ดูแลระบบใช้งานจริง)
+---------------------------+
        │
        ▼
      Users
```

### 2.2 ทักษะ Hard / Soft ที่สำคัญ

**Hard Skills**

* Programming (JS/TS, HTML/CSS, Node.js, React)
* Basic Software Design & Architecture
* Web fundamentals (HTTP, REST API)
* Database (SQL/NoSQL ขั้นพื้นฐาน)
* Version Control (Git & branching workflow)
* Testing basics (unit test, manual test, integration test)

**Soft Skills**

* การสื่อสาร (ขอ requirement ให้ชัด, รายงานปัญหา, ทำงานกับเพื่อน)
* ทีมเวิร์ก (แบ่งงาน, trust, code review)
* Time management (แบ่งงานเป็นชิ้นเล็ก ๆ, ตั้ง deadline)
* การเรียนรู้ด้วยตัวเอง (อ่าน docs/มาตรฐาน, ทดลองใช้เครื่องมือใหม่)

> กิจกรรมที่แนะนำ: ให้ นศ. เลือก “บทบาทที่อยากเป็นในอีก 3–5 ปี” และเขียน reflection สั้น ๆ
> ว่าต้องพัฒนาทักษะอะไรบ้างในช่วงที่เรียนมหาวิทยาลัย

---

## 3. วิวัฒนาการของซอฟต์แวร์และกระบวนการพัฒนา

### 3.1 เส้นเวลาพัฒนาการ (Timeline)

```text
1970s  - Mainframe, Batch jobs
        - โมเดล Waterfall เริ่มถูกใช้ในโปรเจกต์ใหญ่

1980s  - PC, ระบบ Desktop
        - แนวคิด Structured Analysis/Design

1990s  - Client-Server, Web ยุคแรก
        - UML, RUP, iterative models

2000s  - Web 2.0, Mobile, SaaS
        - Agile Manifesto (2001), Scrum, XP, Kanban

2010s  - Cloud, DevOps, Microservices
        - CI/CD, Continuous Delivery, Infrastructure as Code

2020s  - Cloud-native, Data-intensive, AI-based systems
        - DevSecOps, MLOps, data-intensive architecture
```

### 3.2 ผลต่อวิธีคิดของวิศวกรซอฟต์แวร์

1. **ผู้ใช้เพิ่มขึ้นมหาศาล**

   * ต้องคิดเรื่อง scalability และ reliability ตั้งแต่เริ่ม
2. **การเปลี่ยนแปลงบ่อยเป็นเรื่องปกติ**

   * ต้องมี process ที่รับมือกับการเปลี่ยน requirement อย่าง Agile
3. **ระบบกลายเป็น network ของระบบย่อย**

   * ต้องคิดเชิงสถาปัตยกรรม (architecture) มากขึ้น
   * ต้องมี testing ในหลายระดับ (unit, integration, system, E2E)

> สัปดาห์นี้ให้นักศึกษาลองมองว่า Term Project ของเรา “อยู่ในยุคไหน” และควรใช้แนวคิด Waterfall/Agile แบบใดให้เหมาะ

---

## 4. SDLC และมาตรฐานสากล (ISO/IEC/IEEE, SWEBOK, ACM/IEEE)

### 4.1 SDLC: Software Development Life Cycle

**คำจำกัดความ (ในวิชา)**

> SDLC คือ กรอบขั้นตอน/ช่วงเวลาที่ใช้จัดระเบียบการพัฒนาซอฟต์แวร์
> ตั้งแต่คิดไอเดีย → เก็บ requirement → ออกแบบ → พัฒนา → ทดสอบ → นำไปใช้ → บำรุงรักษา

เวอร์ชันพื้นฐาน:

1. Requirements
2. Design
3. Implementation
4. Testing
5. Deployment
6. Maintenance

#### Infographic ASCII

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
[Maintenance] ↺ (วนกลับเมื่อมี feature ใหม่ / แก้บั๊ก)
```

### 4.2 มาตรฐาน ISO/IEC/IEEE 12207 (Life Cycle Processes)

* เป็นมาตรฐานที่นิยาม “ชุดของกระบวนการ” ในวงจรชีวิตซอฟต์แวร์ เช่น

  * Acquisition, Supply, Development, Operation, Maintenance
  * Processes ทางองค์กร เช่น Management, Improvement
* มอง software development เป็น **ชุด process** มากกว่าแค่ “เขียนโค้ดตามขั้น”

> ในวิชานี้เราไม่ลงรายละเอียดมาตรฐานทั้งหมด
> แต่ให้นักศึกษารู้จักชื่อและแนวคิดว่า
> “มีมาตรฐานระดับสากลคอยเป็นกรอบให้กระบวนการพัฒนา”

### 4.3 SWEBOK และแนวทางหลักสูตร ACM/IEEE

* **SWEBOK** = Body of Knowledge ด้านวิศวกรรมซอฟต์แวร์

  * ใช้กำหนดว่าคนที่เรียกตัวเองว่า “Software Engineer” ควรรู้อะไรบ้าง
* **ACM/IEEE SE Curriculum (เช่น SE2014)**

  * เป็น guideline สำหรับออกแบบหลักสูตร SE ระดับมหาวิทยาลัย
  * ENGCE301 ก็อิงแนวคิดเดียวกัน: ให้ นศ. ได้สัมผัสทั้ง requirements, design, construction, testing และ project-based learning

> สามารถแทรกรูป infographic จากอินเทอร์เน็ต เช่น
>
> * แผนภาพ SWEBOK Knowledge Areas
> * แผนผัง ISO/IEC/IEEE 12207 Life Cycle
> * แผนภาพสรุป ACM/IEEE SE Curriculum map

---

## 5. โมเดล Waterfall

### 5.1 ภาพรวม

* ทำงานเรียงเป็นลำดับขั้น: Requirement → Design → Implementation → Testing → Deployment → Maintenance
* เหมาะกับโครงการที่ Requirement ค่อนข้างนิ่ง
* เน้นเอกสารและขั้นตอนที่ชัดเจน

#### Infographic ASCII – Waterfall

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

   * เก็บและวิเคราะห์ความต้องการของผู้ใช้/ลูกค้า
   * ส่งมอบเป็น SRS
2. **Design**

   * แบ่งระบบเป็น module
   * ออกแบบ DB, API, UI
3. **Implementation & Unit Testing**

   * เขียนโค้ดตาม design
   * ทดสอบหน่วยย่อยให้ทำงานถูกต้อง
4. **Integration & System Testing**

   * ทดสอบการทำงานร่วมกันของ module
   * ทดสอบฟังก์ชันตาม scenario จริง
5. **Deployment & Maintenance**

   * นำระบบให้ผู้ใช้ใช้งานจริง
   * แก้บั๊ก และปรับปรุงในระยะยาว

### 5.3 จุดแข็ง–จุดอ่อน

**จุดแข็ง**

* เหมาะสำหรับระบบที่ requirement ชัดและไม่เปลี่ยน
* เอกสารครบ ตรวจสอบย้อนหลังได้ง่าย
* เหมาะกับองค์กรที่ต้อง audit/มาตรฐานเข้ม

**จุดอ่อน**

* ผู้ใช้มักเห็น product จริงตอนท้าย → ถ้าไม่ตรงใจ แก้ลำบาก
* ไม่ยืดหยุ่นต่อการเปลี่ยน requirement ระหว่างทาง
* Feedback cycle ยาว

---

## 6. Agile, Scrum, Kanban

### 6.1 Agile Mindset

Agile เน้น:

1. Individuals & Interactions > Processes & Tools
2. Working Software > Comprehensive Documentation
3. Customer Collaboration > Contract Negotiation
4. Responding to Change > Following a Plan

**ตีความสำหรับนักศึกษา:**

* ต้องสื่อสารในทีมให้เยอะ–ถี่ (ไม่เงียบแล้วทำคนเดียว)
* ส่งมอบงานทีละชิ้นเล็ก ๆ ดู feedback เรื่อย ๆ
* เอกสารยังจำเป็น แต่ “พอเหมาะ” ไม่ใช่เขียนแต่เอกสารจนไม่มีเวลาเขียนโค้ด

---

### 6.2 Scrum – วงรอบการทำงานแบบ Sprint

#### Roles

* **Product Owner** – กำหนด vision และลำดับความสำคัญของงาน
* **Scrum Master** – ช่วยทีมทำงานตาม Scrum และแก้ impediments
* **Developers** – ทีมลงมือทำงานจริง

#### Events

* **Sprint (1–4 สัปดาห์)**
* **Sprint Planning** – เลือกงานที่จะทำใน Sprint
* **Daily Scrum** – คุยสั้น ๆ 15 นาที ทุกวัน
* **Sprint Review** – Demo งานให้ PO/ผู้มีส่วนได้ส่วนเสียดู
* **Sprint Retrospective** – คุยกันว่ารอบที่ผ่านมาอะไรดี/ไม่ดี และจะปรับปรุงอย่างไร

#### Artifacts

* Product Backlog
* Sprint Backlog
* Increment (เวอร์ชันของระบบที่ใช้งานได้จริง ณ สิ้น Sprint)

#### Infographic ASCII – Scrum Cycle

```text
Product Backlog
      │
      ▼  (Sprint Planning)
Sprint Backlog ──► Sprint (1-2 weeks) ──► Increment
                          │
                          ▼
                    Daily Scrum
                          │
               +----------+----------+
               | Sprint Review       |
               | Sprint Retrospective|
               +---------------------+
```

---

### 6.3 Kanban – จัดการ Flow ของงาน

แนวคิดสำคัญ:

* Visualize work – มองเห็นงานทั้งหมด
* Limit WIP – จำกัดจำนวนงาน “กำลังทำ”
* Manage Flow – ลดการติดค้างกลางทาง

#### ASCII – ตัวอย่าง Kanban Board

```text
┌─────────┬─────────┬─────────┬─────────┐
│ Backlog │  To Do  │  Doing  │  Done   │
├─────────┼─────────┼─────────┼─────────┤
│ Feat A  │ Feat B  │ Bug #1  │ Hotfix  │
│ Feat C  │ Bug #2  │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

ใน Term Project ของวิชา แนะนำให้แต่ละกลุ่มใช้ Kanban (บนกระดาษหรือออนไลน์) เพื่อ track งาน ตั้งแต่ Week 1

---

## 7. เปรียบเทียบ Waterfall vs Agile และการประยุกต์ใช้ใน ENGCE301

### 7.1 ตารางเปรียบเทียบ

| มิติ           | Waterfall                     | Agile (Scrum/Kanban)                     |
| -------------- | ----------------------------- | ---------------------------------------- |
| การวางแผน      | แผนใหญ่ครั้งเดียวทั้งโปรเจกต์ | แผนเป็นรอบสั้น ๆ (Sprint/Iteration)      |
| การส่งมอบ      | ส่งทีเดียวตอนท้าย             | ส่ง incremental features บ่อย ๆ          |
| การเปลี่ยนแปลง | ต้นทุนสูง                     | ถือเป็นเรื่องปกติ จัดการในแต่ละ Sprint   |
| เอกสาร         | หนักเอกสาร                    | เอกสารเท่าที่จำเป็น                      |
| ความเสี่ยง     | รู้ตอนท้าย (ถ้าผิดจะเจ็บหนัก) | รู้เร็วจาก feedback แต่ละรอบ             |
| เหมาะกับ       | ระบบที่ต้อง spec ชัด/คงที่    | Product ที่ต้องทดลอง–เรียนรู้ตลาดรวดเร็ว |

### 7.2 Hybrid Model สำหรับวิชานี้

สำหรับ ENGCE301:

* ระดับ “เทอม” ใช้โครงแบบ **Stage (คล้าย Waterfall)**

  * ช่วงต้นเทอม: Requirements & Design
  * กลางเทอม: Implementation & Testing
  * ปลายเทอม: Deployment & Presentation 
* ระดับ “งานรายสัปดาห์” ใช้แนวคิด **Agile**

  * แบ่งงานเป็น user story / task
  * ใช้ Kanban board / Mini Sprint 1–2 สัปดาห์

#### ASCII – Roadmap วิชา (ตัวอย่าง)

```text
Week 1   Intro SE + SDLC + Tools
Week 2-4 Requirements + HTML/CSS
Week 5-7 JS + Node/Express + DB
Week 8   Midterm
Week 9-12 React + API + MongoDB + Testing
Week 13-15 Quality + Refactor + Deployment
Week 16  Term Project Presentation
Week 17  Final Exam
```

---

## 8. เครื่องมือพื้นฐาน (Git, VS Code, Node.js, DevTools)

### 8.1 Git – Version Control & Collaboration

**เป้าหมายสัปดาห์นี้**

* ทุกคนรัน `git --version` ได้
* เข้าใจ workflow พื้นฐาน: `init → add → commit → push → pull`
* กลุ่มมี remote repo สำหรับ Term Project แล้วจริง ๆ (ใช้ต่อทั้งเทอม)

#### ASCII – Git Workflow

```text
แก้โค้ด
  ↓
git status → git add → git commit
  ↓
git push (ขึ้น remote)
  ↓
เพื่อน git pull (ดึงโค้ดล่าสุดมาทำต่อ)
```

### 8.2 VS Code

* Editor หลักของวิชา
* ฟีเจอร์สำคัญ:

  * Extensions (ESLint, Prettier, GitLens)
  * Integrated Terminal
  * Debugger
* ทิป: ตั้ง theme และ font ให้เหมาะกับการใช้งานระยะยาว (ไม่แสบตา)

### 8.3 Node.js & npm

* ใช้สำหรับรัน JavaScript ฝั่ง server และเครื่องมือ dev

* คำสั่งเช็ก version:

  ```bash
  node -v
  npm -v
  ```

* ในสัปดาห์ถัด ๆ จะใช้สำหรับ

  * รัน backend (Express.js)
  * จัดการ dependencies ของโปรเจกต์

### 8.4 Browser DevTools

Panel ที่อยากให้ นศ. คุ้นในสัปดาห์นี้:

* **Elements** – ตรวจ DOM/CSS แก้ text/สไตล์แบบชั่วคราว
* **Console** – ดู error/log ของ JS
* **Network** – เบื้องต้นแนะนำไว้ก่อน จะใช้จริงเมื่อถึงหัวข้อ API

> ใน Lab 1 นักศึกษาจะใช้ DevTools เพื่อ:
>
> * แก้ `<h1>` ผ่าน Elements
> * พิมพ์ `console.log()` ใน Console
> * รัน script เล็ก ๆ ในหน้า HTML

---



