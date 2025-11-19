# ENGCE301 – Week 1

## Introduction to Software Engineering & SDLC + Dev Environment Setup


---

## 0. ภาพรวมสัปดาห์ที่ 1

**หัวข้อหลัก**

* Introduction to Software Engineering & SDLC + Dev Environment Setup
  – บทบาท/หน้าที่ของวิศวกรซอฟต์แวร์
  – วิวัฒนาการของซอฟต์แวร์
  – SDLC: Waterfall vs Agile (Scrum, Kanban)
  – แนะนำ Git, VSCode, Node.js, Browser DevTools 

**เชื่อมกับ CLO รายวิชา** 

* **CLO1** รู้พื้นฐานวิศวกรรมซอฟต์แวร์และกระบวนการพัฒนา (SDLC, สถาปัตยกรรม)
* **CLO4** เริ่มต้นพัฒนา/ตั้งค่าเครื่องมือได้ (Git, VSCode, Node.js, DevTools)
* **CLO6** ทำงานเป็นทีม ใช้เครื่องมือพัฒนาซอฟต์แวร์และสื่อสารได้

**ผลลัพธ์เมื่อจบสัปดาห์นี้ นักศึกษาควรสามารถ**

1. อธิบายได้ว่า *Software Engineering ต่างจากการเขียนโปรแกรมธรรมดาอย่างไร* 
2. อธิบายภาพรวม **SDLC** และเปรียบเทียบ **Waterfall vs Agile (Scrum / Kanban)** ได้ในระดับเบื้องต้น 
3. อธิบายได้ว่าทำไมต้องมีมาตรฐาน/กรอบ เช่น ISO/IEC/IEEE ในการพัฒนาซอฟต์แวร์
4. มองเห็นบทบาทต่างๆ ในทีมซอฟต์แวร์และเชื่อมโยงกับเส้นทางอาชีพของตนเอง
5. รู้จักและอธิบายหน้าที่ของเครื่องมือ **Git, VS Code, Node.js, Browser DevTools** ในภาพรวม (ยังไม่ลงรายละเอียดทุกคำสั่ง) 
6. เข้าใจแนวคิด/วัตถุประสงค์ของ **Lab 1** ที่จะใช้ตรวจว่าเครื่องมือและ mindset พร้อมสำหรับ Term Project แล้ว

---

## 1. บทนำวิศวกรรมซอฟต์แวร์ (Software Engineering)

### 1.1 นิยามและขอบเขต (โยงมาตรฐาน IEEE/ISO)

อาจารย์เล่าให้ นศ. เห็นว่า:

* ตามแนวคิดในมาตรฐานสากล (เช่น ISO/IEC/IEEE 24765, 12207)
  “Software Engineering” คือการใช้ **หลักการทางวิศวกรรม** มาจัดการ *ตลอดวงจรชีวิตซอฟต์แวร์*
  ตั้งแต่กำหนดความต้องการ ออกแบบ พัฒนา ทดสอบ ส่งมอบ ไปจนถึงบำรุงรักษาต่อเนื่อง
* เป้าหมายไม่ใช่แค่ “เขียนโปรแกรมให้รันได้” แต่ต้อง
  – เชื่อถือได้ (reliable)
  – ปลอดภัย (secure)
  – ดูแลต่อได้ (maintainable)
  – ขยายต่อได้ (scalable)

**จุดประสงค์ย่อย**

* นศ. อธิบายแนวคิด “Software Engineering = Engineering Principles + Software Lifecycle” ได้
* เชื่อมโยงคำเหล่านี้เข้ากับ project ที่ตัวเองเคยทำ (เช่นโปรเจกต์ปี 1, 2)

**กิจกรรมเสนอ**

* ถามทั้งห้อง: “ปีที่แล้วเคยทำโปรเจกต์ไหนแล้วล้มเหลวเพราะจัดการไม่ดี?”
  เขียน keyword บนกระดาน: ส่งไม่ทัน, โค้ดรก, ทดสอบน้อย, สื่อสารไม่รู้เรื่อง
  แล้วแมปสิ่งเหล่านี้ไปยังคำว่า “ต้องใช้ Software Engineering”

---

### 1.2 Programming vs Software Engineering (Mindset)

อ้าง/ต่อยอดจากเนื้อหาใน `add-ons.md` 

**Programming Mindset**

* โฟกัสที่ “ให้ฟังก์ชันนี้ทำงานให้ได้”
* สนใจ correctness เป็นหลัก (รันแล้วได้ผลลัพธ์ถูกไหม)
* มักทำงานคนเดียว หรือโค้ดขนาดเล็ก

**Software Engineering Mindset**

* โฟกัส “ระบบทั้งระบบ” ที่มีผู้ใช้จริง, มี business, มีข้อจำกัดด้าน security / performance
* รู้ว่าระบบจะเปลี่ยนแปลงตลอดเวลา → ต้องวางโครงให้แก้ไขได้
* ใช้ process, standard, documentation, testing, tools เพื่อ **ลดความเสี่ยง** และ **จัดการความซับซ้อน**

**Mini Infographic (ASCII)**

```text
      +--------------------------+
      |   Programming Mindset    |
      |  "ให้โค้ดฉันรันได้"     |
      +--------------------------+
                   |
                   v
      +--------------------------+
      | Software Engineering     |
      | "ให้ระบบอยู่รอดยาวๆ"   |
      |  - ทีม                   |
      |  - Process (SDLC)        |
      |  - Tools & Standards     |
      +--------------------------+
```

**คำถามชวนคิด**

* ถ้าระบบที่เราเขียนวันนี้ ต้องอยู่ 5–10 ปี และจะมีคนอื่นมา maintain ต่อ
  เราจะเปลี่ยนจาก programmer mindset → engineer mindset อย่างไรบ้าง?

---

### 1.3 Software Crisis & สถานการณ์จริงของ Software Engineer

โยงจาก “Software Crisis” ที่กล่าวไว้ในเนื้อหาเดิม 

**ปัญหาคลาสสิกในอดีต**

* โปรเจกต์ IT ขนาดใหญ่ “ล้มเหลว” เป็นจำนวนมาก
  – งบประมาณบานปลาย
  – ส่งมอบช้า
  – ระบบใช้งานจริงไม่ได้
* โค้ดซับซ้อนเกินกว่าจะเข้าใจ
* ไม่มีคู่มือ ไม่มี test ทำให้แก้อะไรก็กลัวพัง

**สถานการณ์ร่วมสมัยที่เล่าในห้อง**

1. **ระบบ E-Commerce ยุคโควิด**

   * ช่วงโควิด ร้านค้าจำนวนมากต้องรีบขึ้นออนไลน์
   * ทีม Dev ต้องสร้างเว็บ + แอป + ระบบจ่ายเงิน ภายในไม่กี่เดือน
   * ถ้าไม่มี process ชัด ผลคือ bug เยอะ, ล่มบ่อย, ลูกค้าหนี

2. **FinTech / HealthTech / Gov Service**

   * ระบบเกี่ยวกับเงิน, สุขภาพ, หรือบริการรัฐ → **ผิดไม่ได้**
   * ต้องมีมาตรฐานความปลอดภัย (เช่น OWASP, ISO/IEC 27001)
   * การพัฒนาแบบ “ลองไปเรื่อยๆ โดยไม่มีมาตรฐาน” อาจทำให้ข้อมูลสำคัญรั่วไหล

**เชื่อมกับหน้าที่ของ Software Engineer**

* ไม่ใช่แค่เขียนโค้ด แต่ต้อง

  * อ่าน/ตีความ requirement
  * คุยกับลูกค้า / Product Owner
  * ออกแบบระบบ + สถาปัตยกรรม
  * เขียนโค้ด + ทดสอบ + review
  * ดูแลระบบหลัง deploy (monitoring, bug fix)

---

### 1.4 บทบาทในทีมซอฟต์แวร์ (Roles & Career)

เสนอรูปแบบ “แนะนำ role สำหรับเด็กปี 2” ให้ไม่เยอะเกินไป เช่น

* Software Engineer / Developer
* QA Engineer / Test Engineer
* DevOps / Site Reliability Engineer
* UI/UX Designer
* Product Owner / Business Analyst

**Mini ASCII – ทีมซอฟต์แวร์**

```text
+----------------------- Software Project Team -----------------------+
|  Product Owner   |  Software Engineers  |   QA / Test   |  DevOps   |
+------------------+---------------------+---------------+-----------+
|  รู้ business    |  เขียนโค้ด /       |  ทดสอบ        |  ดูแลการ  |
|  ตัดสิน feature  |  ออกแบบสถาปัตย์   |  คุณภาพระบบ   |  deploy   |
+--------------------------------------------------------------------+
```

**กิจกรรมในห้อง**

* ให้ นศ. เลือก 1 role ที่ “รู้สึกน่าสนใจที่สุด”
* เขียนลง sticky note / Google Form ว่า

  * ทำไมสนใจ role นั้น
  * คิดว่าต้องมี skill อะไรบ้าง
* อาจารย์สรุปภาพรวมเส้นทางอาชีพของวิศวกรซอฟต์แวร์

---

## 2. วิวัฒนาการของซอฟต์แวร์ & แนวโน้มปัจจุบัน

### 2.1 จากโปรแกรมเดี่ยว → ระบบ Web / Cloud / Mobile

โครงเรื่องที่เล่าให้ นศ. เห็นภาพ:

1. **ยุคโปรแกรมเดสก์ท็อป (Standalone)**

   * ติดตั้งจาก CD/USB, ทำงานบนเครื่องเดียว
   * อัปเดตยาก (ต้องลงใหม่)

2. **ยุค Web Application**

   * รันบน browser, อัปเดตจากฝั่ง server
   * รองรับผู้ใช้จำนวนมาก

3. **ยุค Cloud / Microservices / API**

   * ระบบแยกเป็นบริการย่อย (microservices)
   * ติดต่อกันผ่าน API → ทำให้ scale และปรับเปลี่ยนได้ง่ายกว่าเดิม

4. **ยุค Mobile + AI Integration**

   * แอปบนมือถือ + ระบบแนะนำ (recommendation) + data analytics
   * ทำให้ software engineer ต้องเข้าใจ data, security, privacy เพิ่มขึ้น

**จุดเน้น**

* ยิ่งระบบ “เชื่อมต่อกันมากขึ้น” → ยิ่งต้องการ **process ที่ดี** และ **มาตรฐาน** เพื่อรับประกันคุณภาพ

---

### 2.2 ประเด็นใหม่ ๆ ที่ Software Engineer ต้องคิด

* **Security & Privacy** – การปกป้องข้อมูลผู้ใช้ (PDPA / GDPR ฯลฯ)
* **Scalability** – รองรับผู้ใช้จำนวนมากโดยไม่ล่ม
* **Ethics** – การใช้ AI / Data อย่างรับผิดชอบ
* **Sustainability** – พลังงาน, ประสิทธิภาพ, การบำรุงรักษาระยะยาว

สามารถโยงว่าสิ่งเหล่านี้จะไปปรากฏในหัวข้อสัปดาห์อื่น ๆ เช่น Quality, Security, Testing ในสัปดาห์ 13–15 ของรายวิชา 

---

## 3. SDLC: Waterfall vs Agile (Scrum, Kanban)

### 3.1 แนวคิด SDLC โดยรวม

อธิบาย “Software Development Life Cycle” ว่าคือชุดเฟสหลัก เช่น

1. Requirements
2. Design
3. Implementation
4. Testing
5. Deployment
6. Operation & Maintenance

โยงกับมาตรฐาน ISO/IEC/IEEE 12207 (ระบบและซอฟต์แวร์ lifecycle process) ว่าเป็นกรอบที่บอกว่า “มี process อะไรบ้าง” แต่ในรายวิชานี้จะโฟกัสในระดับภาพรวมก่อน

---

### 3.2 Waterfall Model

**ภาพรวม**

* ทำงานเป็นเฟสเรียงกัน
* จบ requirement → จบ design → coding → test → deploy → maintenance

**Infographic ASCII (ดัดแปลงจากเนื้อหาเดิม)** 

```text
Waterfall Model (Document-heavy, Linear)

[Requirements]
      |
      v
[System & Software Design]
      |
      v
[Implementation & Unit Test]
      |
      v
[Integration & System Test]
      |
      v
[Operation & Maintenance]
```

**ข้อดี**

* โครงสร้างชัด, เหมาะกับ requirement ที่ค่อนข้างนิ่ง
* เหมาะกับงานที่ต้องการเอกสารละเอียดมาก เช่น งานราชการบางประเภท / โครงการโครงสร้างพื้นฐาน

**ข้อเสีย**

* ถ้า requirement เปลี่ยนระหว่างทาง → **แพง** และย้อนกลับลำบาก
* ผู้ใช้มักได้เห็นซอฟต์แวร์ตอนท้ายสุด → feedback มาช้า 

**คำถามชวนคิด**

* ถ้า Term Project ของ นศ. ใช้ Waterfall 100% กับเวลา 15 สัปดาห์ → จะมีความเสี่ยงอะไรบ้าง?

---

### 3.3 Agile Overview + Scrum

อ้างอิงจากส่วน Agile ใน `add-ons.md` 

**Agile Manifesto (2001)** – เน้น

* Individuals & Interactions
* Working Software
* Customer Collaboration
* Responding to Change

**Scrum: Roles, Events, Artifacts** 

* Roles

  * Product Owner, Scrum Master, Developers
* Events

  * Sprint Planning, Daily Scrum, Sprint Review, Retrospective
* Artifacts

  * Product Backlog, Sprint Backlog, Increment

**ASCII Sprint Cycle (ดัดแปลง)** 

```text
        +----------------------+
        |   Product Backlog    |
        +----------+-----------+
                   |
                   v (เลือกงานสำคัญ)
            +-------------+
            |   Sprint    |  1-2 สัปดาห์
            +------+------+ 
                   |
       +-----------+-----------+
       |                       |
       v                       v
  Daily Scrum           Working Software
  (15 นาที/วัน)         (Increment พร้อม demo)
```

**จุดเน้นสำหรับเด็กปี 2**

* Agile ไม่ใช่ “ทำไปเรื่อยๆ แบบมั่ว ๆ” แต่คือการวางแผนรอบสั้น ๆ + feedback บ่อย
* ในรายวิชานี้ Term Project จะใช้แนวคิด Agile แบบเรียบง่าย (ไม่ต้องทำ Scrum ทุกพิธีเต็มรูปแบบ)

---

### 3.4 Kanban – มองงานเป็น “การไหล”

จาก `add-ons.md` 

* เน้นแสดงสถานะงาน: To Do → Doing → Done
* มี WIP Limit เพื่อไม่ให้ทำหลายอย่างพร้อมกันจนไม่มีงานไหนเสร็จ

**ASCII Kanban Board ตัวอย่าง**

```text
+-----------+-----------+-----------+
|  To Do    |  Doing    |   Done    |
+-----------+-----------+-----------+
| Task 1    | Task 3    | Task A    |
| Task 2    |           | Task B    |
+-----------+-----------+-----------+
```

---

### 3.5 เปรียบเทียบ Waterfall vs Agile กับ Term Project

ใช้ Infographic จาก Big Picture ของรายวิชา 

```text
+---------------- WEEK 1 --------------------+
|  Intro SE + SDLC + Tools (Git/VSCode)     |
+---------------- WEEK 2-4 -----------------+
|  Requirements + UI/UX + HTML/CSS          |
+---------------- WEEK 5-7 -----------------+
|  JS + Node/Express + DB (SQLite)          |
+---------------- WEEK 8 -------------------+
|  Midterm                                  |
+---------------- WEEK 9-12 ----------------+
|  React + API + MongoDB + Security + Test  |
+---------------- WEEK 13-15 ---------------+
|  Quality, Refactor, Deployment            |
+---------------- WEEK 16-17 ---------------+
|  Final Project Demo + Final Exam          |
```

ชวน นศ. ถามว่า:

* ถ้าใช้ **Waterfall**: เราจะล็อก requirement ตั้งแต่ Week 2–3 แล้ว implement ยาว ๆ จนปลายเทอม
* ถ้าใช้ **Agile (3 Sprints)** จากตัวอย่างใน Lab: นักศึกษาจะแบ่ง feature เป็นก้อนเล็ก ๆ และมี demo ทุกไม่กี่สัปดาห์ 

---

## 4. ภาพรวมมาตรฐาน ISO/IEC/IEEE ที่เกี่ยวข้อง (ระดับแนะนำชื่อ)

> ส่วนนี้ไม่ได้ลงลึกรายข้อ แต่ให้ นศ. เห็นว่า “วิศวกรรมซอฟต์แวร์มีกรอบมาตรฐานอ้างอิงจริง”

ตัวอย่างมาตรฐานที่สามารถกล่าวถึง:

* **ISO/IEC/IEEE 12207** – Systems and software engineering — Software life cycle processes
* **ISO/IEC/IEEE 29148** – Requirements engineering
* **ISO/IEC/IEEE 15288** – System life cycle processes
* **ISO/IEC/IEEE 24765** – Systems and software engineering vocabulary

**เป้าหมาย**

* นศ. รับรู้ว่ากระบวนการ/เทคนิคที่เรียน มีรากมาจากมาตรฐานสากล
* ถ้าทำงานในองค์กรใหญ่ (เช่นบริษัทซอฟต์แวร์, หน่วยงานรัฐ, ธนาคาร) มาตรฐานเหล่านี้จะถูกนำไปใช้จริง

**กิจกรรม**

* ให้ นศ. ค้นชื่อ standard 1 ฉบับ (เช่น 12207) เป็นการบ้าน แล้วสรุป 3–5 บรรทัดว่า “พูดถึงอะไรบ้าง”
* ใช้เป็น warm-up สำหรับสัปดาห์ที่เกี่ยวกับ process/quality

---

## 5. Dev Environment Setup (แนวคิด & ภาพรวม)

สอดคล้องกับแผนสัปดาห์ที่ 1 ใน มคอ.3 ที่ให้แนะนำ **Git, VSCode, Node.js** และฝึกสร้างโครงโปรเจกต์แรก 

### 5.1 ทำไม “สภาพแวดล้อมพัฒนา” ถึงสำคัญ

* เวลาโปรเจกต์ใหญ่มี dev หลายคน
  – ถ้าแต่ละคนใช้ environment ต่างกัน → “รันได้บนเครื่องฉันคนเดียว”
* Dev Environment ที่ดีควร

  * ตั้งค่าได้ซ้ำ (reproducible)
  * ใช้ร่วมกันในทีม
  * มีเครื่องมือพื้นฐานพร้อม (editor, debugger, version control)

**Infographic – Dev Environment เป็นฐาน**

```text
[ Idea / Requirement ]
           |
           v
 [ Dev Environment Ready ]
 (Git + VSCode + Node + Browser DevTools)
           |
           v
   [ Implement / Test ]
           |
           v
   [ Deploy / Demo ]
```

---

### 5.2 Git – เครื่องมือจัดการเวอร์ชันและการทำงานเป็นทีม

อิงจากบท Lab ที่ให้ นศ. ตั้งค่า Git repo ของวิชา 

แนวคิดที่สอนไว้ก่อนลงมือจริง (ยังไม่ต้องสาธิตทุกคำสั่งในเอกสารนี้):

* Git คือ “สมุดบันทึกเวอร์ชันของโค้ด”
* คำสำคัญ:

  * repository, commit, branch, remote, clone, pull, push
* ทำไมต้องใช้ Git แทนการ copy โฟลเดอร์เป็น `project_v1`, `project_v2`, ...

**ตัวอย่าง Scenario ง่าย ๆ**

* ทีม 3 คนพัฒนาเว็บ
* ถ้าไม่ใช้ Git → ส่งไฟล์กันทาง Line / Drive, งงว่าเวอร์ชันไหนใหม่
* ถ้าใช้ Git → ทุกคนทำงานบน branch ตัวเอง แล้ว merge ตาม process

---

### 5.3 VS Code – Editor หลักในวิชา

สิ่งที่อยากให้ นศ. ใช้เป็นประจำ:

* Code editor + syntax highlight สำหรับ HTML, CSS, JS, React, Node
* Extension ที่น่าแนะนำ (พูดชื่อไว้ก่อน แล้วจะติดตั้งใน Lab):

  * ESLint / Prettier, Live Server, GitLens ฯลฯ
* Integrated Terminal, Git integration

---

### 5.4 Node.js – พื้นฐานสำหรับ JavaScript & Backend

* ใช้รัน JavaScript นอก browser
* เป็นฐานสำหรับการเรียน **Node.js/Express** ในสัปดาห์หลัง ๆ
* สำหรับสัปดาห์นี้ เพียงให้ นศ. เข้าใจว่า:

  * Node.js = JavaScript runtime
  * จะใช้สำหรับ backend + tooling (เช่น package manager)

---

### 5.5 Browser DevTools – “กล้องเอกซเรย์ของเว็บ”

ต่อยอดจากเนื้อหาเดิม 

Panel สำคัญ:

1. **Elements** – โครงสร้าง DOM, CSS
2. **Console** – error / log จาก JavaScript
3. **Network** – request/response, status code, เวลาโหลด
4. **Responsive Mode** – ทดสอบบนจอมือถือ/แท็บเล็ต

**Scenario สั้น ๆ ในคลาส**

* อาจารย์เปิดหน้าเว็บที่ “ปุ่มไม่ทำงาน”
  → ให้ นศ. ใช้ Console ดู error (เช่น script 404)
  → เปิด Network ดูว่าไฟล์ไหนโหลดไม่สำเร็จ
  → สรุปว่าปัญหามาจาก path ผิด ไม่ใช่จาก “เว็บพังลึกลับ” ฯลฯ 

เน้น mindset: *ไม่เดา แต่ใช้เครื่องมือเก็บหลักฐาน → วิเคราะห์ → แก้*

---

## 6. แผนการสอน (2 ชม. ทฤษฎี – โครงเวลาในห้อง)

### 6.1 โครงเวลาตัวอย่าง

**รวม ~120 นาที**

1. **10 นาที** – แนะนำรายวิชา & Big Picture Term Project

   * แสดง Infographic Course Roadmap (จาก Big Picture) 
2. **20 นาที** – ทำไมต้อง Software Engineering (Software Crisis + roles) 
3. **20 นาที** – Programming vs Software Engineering + บทบาทในทีม
4. **25 นาที** – SDLC Overview + Waterfall + Agile (Scrum & Kanban)
5. **20 นาที** – Dev Environment Overview (Git, VS Code, Node, DevTools) 
6. **15 นาที** – Q&A + Mini reflection: “อยากเป็นวิศวกรซอฟต์แวร์แบบไหน” 
7. **10 นาที** – เกริ่น Lab 1 (ไม่ลงรายละเอียดคำสั่ง) + อธิบายวิธีประเมิน

---

### 6.2 รูปแบบการประเมินในชั่วโมงทฤษฎี (Formative)

* **คำถามระหว่างสอน (In-class questions)**
  – เช่น “ข้อแตกต่างสำคัญระหว่าง Waterfall กับ Agile คืออะไร”
* **Think–Pair–Share**
  – ให้ นศ. คุยเป็นคู่เรื่อง “ปัญหาโปรเจกต์กลุ่มที่เคยเจอ” แล้วแชร์หน้าห้อง
* **Exit Ticket (กระดาษ / Google Form)**
  – เขียน 2–3 บรรทัดว่า “สัปดาห์นี้สิ่งที่เข้าใจชัดที่สุด/งงที่สุดคืออะไร”

สิ่งเหล่านี้สามารถนับเป็น **Participation / Engagement** ที่ผูกกับ CLO1, CLO6 ได้

---
