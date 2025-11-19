# LAB 1 – Environment Setup & First Software Engineering Web Page  
**รหัสวิชา:** ENGCE301  
**ชื่อวิชา:** การออกแบบและพัฒนาซอฟต์แวร์ (Software Design & Development)  
**ภาคการศึกษา:** 2/2568  
**ระยะเวลาแลบ:** 3 ชั่วโมง (สัปดาห์ที่ 1)  
**รูปแบบการทำงาน:** กลุ่ม 3–4 คน (กลุ่มเดียวกับ Term Project ตลอดเทอม)

---

## 1. วัตถุประสงค์ของแลบ (Lab Objectives)

### 1.1 วัตถุประสงค์เชิงพฤติกรรม (Intended Learning Outcomes – ILOs)

เมื่อสิ้นสุด LAB 1 นักศึกษาจะสามารถ:

1. ติดตั้งและตรวจสอบการทำงานของเครื่องมือพัฒนาซอฟต์แวร์พื้นฐาน  
   (Git, Node.js, VS Code, Browser DevTools) บนเครื่องของตนเองได้อย่างถูกต้อง (เชื่อมกับ **CLO4**)

2. สร้างโครงสร้างโปรเจกต์พื้นฐานสำหรับ Term Project (โฟลเดอร์, `index.html`, `README.md`)  
   และผูกกับ Git repository (local + remote) ได้ (เชื่อมกับ **CLO4**, **CLO6**)

3. ใช้คำสั่ง Git เบื้องต้น (`git init`, `git status`, `git add`, `git commit`, `git log`, `git push`)  
   เพื่อบันทึกความเปลี่ยนแปลงและแสดงหลักฐานการทำงานเป็นทีมได้ (เชื่อมกับ **CLO4**, **CLO6**)

4. ใช้ Browser DevTools (Elements, Console) เพื่อตรวจสอบโครงสร้างหน้าเว็บและ debug JavaScript พื้นฐาน  
   รวมทั้งสะท้อนความคิดเห็นว่าทำไม DevTools จึงสำคัญสำหรับวิศวกรซอฟต์แวร์ (เชื่อมกับ **CLO4**)

5. เขียนสรุปภาพรวมวิศวกรรมซอฟต์แวร์ (บทบาทของวิศวกรซอฟต์แวร์, SDLC, และการเปรียบเทียบ Waterfall vs Agile)  
   ลงในไฟล์ Markdown ภายใน repository ของกลุ่มได้ (เชื่อมกับ **CLO1**)

---

## 2. การเชื่อมโยงกับ CLO รายวิชา

| CLO รายวิชา | คำอธิบายโดยย่อ                                           | ส่วนของแลบที่เกี่ยวข้อง                            |
|-------------|-----------------------------------------------------------|-----------------------------------------------------|
| **CLO1**    | อธิบายหลักการพื้นฐานของวิศวกรรมซอฟต์แวร์และ SDLC ได้   | PART D – SE & SDLC Notes (`SE_INTRO_NOTES.md`)      |
| **CLO4**    | ใช้เทคโนโลยีและเครื่องมือสมัยใหม่ช่วยในการพัฒนาซอฟต์แวร์ | PART A, B, C – Environment, Git, DevTools          |
| **CLO6**    | ทำงานเป็นทีมและใช้เครื่องมือสนับสนุนการทำงานร่วมกันได้  | PART B, E – Git repo กลุ่ม, commit จากหลายสมาชิก   |

---

## 3. ข้อกำหนดและเงื่อนไขการทำแลบ

- นักศึกษาต้องทำงานเป็น **กลุ่ม 3–4 คน** (ใช้กลุ่มเดียวกับ Term Project ทั้งเทอม)  
- แต่ละคนต้องมีเครื่องคอมพิวเตอร์ (ส่วนตัวหรือใช้ร่วม) ที่สามารถติดตั้งเครื่องมือดังนี้:
  - Git  
  - Node.js (เวอร์ชัน LTS)  
  - Visual Studio Code (VS Code)  
  - Web Browser (เช่น Chrome/Edge/Firefox) พร้อม DevTools  
- แลบนี้ถือเป็น **พื้นฐานสำคัญ** สำหรับทุกสัปดาห์ถัดไป หากทำไม่ครบ อาจมีผลต่อการทำ Term Project ในระยะยาว  
- อาจารย์/ผู้ช่วยสอนจะช่วยตรวจสอบและให้คำแนะนำระหว่างปฏิบัติแลบ

---

## 4. รายละเอียดงาน LAB (Step-by-step)

แลบนี้แบ่งออกเป็น 4 ส่วนหลัก:

1. PART A – Environment Check & Installation Log  
2. PART B – Project Skeleton & Git Repository  
3. PART C – Browser DevTools & Mini Experiment  
4. PART D – Mini SE & SDLC Summary

โครงสร้างเวลาที่แนะนำ (สำหรับ 3 ชั่วโมง):

- PART A: ~45 นาที  
- PART B: ~60 นาที  
- PART C: ~45 นาที  
- PART D: ~30 นาที  

---

## PART A – Environment Check & Installation Log

### A.1 เป้าหมาย

ยืนยันว่าเครื่องของนักศึกษาทุกคนมีเครื่องมือที่จำเป็นสำหรับวิชานี้ และมีการบันทึกข้อมูลไว้เป็นหลักฐาน/อ้างอิง  
หากในอนาคตมีปัญหา (เช่น version ไม่ตรง) จะได้ย้อนกลับมาตรวจสอบได้ง่าย

### A.2 เครื่องมือที่ต้องติดตั้ง

นักศึกษาทุกคนต้องติดตั้งให้ครบ:

1. **Git** – ใช้ในการจัดการเวอร์ชันของโค้ดและทำงานร่วมกันในทีม  
2. **Node.js (LTS)** – ใช้สำหรับรัน JavaScript นอก browser และใช้ `npm` จัดการแพ็กเกจ  
3. **Visual Studio Code (VS Code)** – เป็น editor/IDE หลักของวิชานี้  
4. **Web Browser + DevTools** – เช่น Google Chrome, Microsoft Edge, หรือ Firefox

### A.3 ขั้นตอนปฏิบัติ

1. เปิด **Terminal / Command Prompt / PowerShell** ตามระบบปฏิบัติการของตนเอง  
2. พิมพ์คำสั่งต่อไปนี้เพื่อดูเวอร์ชัน:

   ```bash
   git --version
   node -v
   npm -v
   ```

3. ตรวจสอบว่า:
   - มี version แสดงออกมาครบทั้ง 3 คำสั่ง  
   - หากคำสั่งใด “ไม่พบ” (command not found / is not recognized) ให้นักศึกษาติดตั้งโปรแกรมนั้นก่อน  
4. เปิด **VS Code** บนเครื่องของตน  
5. สร้าง screenshot ต่อไปนี้:
   - หน้าจอ Terminal ที่แสดงผล `git --version`, `node -v`, `npm -v`  
   - หน้าจอ VS Code ขณะเปิด (ไม่จำเป็นต้องมีโปรเจกต์)

### A.4 การบันทึกผลการตรวจ (ENVIRONMENT.md)

1. เมื่อเตรียมโครง repo ตาม PART B แล้ว ให้สร้างไฟล์ชื่อ `ENVIRONMENT.md` ที่ root ของ repo  
2. ใส่ข้อมูลดังตัวอย่าง (ให้แต่ละคนในกลุ่มใส่ข้อมูลของตนเอง):

   ```markdown
   # Environment Check – Group X

   ## สมาชิก
   1. นาย A รหัส ...
   2. นางสาว B รหัส ...
   3. นาย C รหัส ...

   ## รายละเอียดเครื่องมือ

   ### นาย A
   - OS: Windows 11
   - Git version: 2.44.0.windows.1
   - Node.js version: v20.10.0
   - npm version: 10.2.3

   ### นางสาว B
   - OS: Ubuntu 24.04
   - Git version: 2.43.0
   - Node.js version: v20.9.0
   - npm version: 10.1.0
   ```

3. สร้างโฟลเดอร์สำหรับเก็บภาพหลักฐาน:

   ```text
   evidence/week1/
   ```

   และบันทึกไฟล์ภาพ screenshot เป็นชื่อประมาณ:

   ```text
   evidence/week1/
     env-A.png
     env-B.png
     env-C.png
   ```

---

## PART B – Project Skeleton & Git Repository

### B.1 เป้าหมาย

ให้แต่ละกลุ่มมี:

- โครงสร้างโปรเจกต์เริ่มต้นที่จะใช้ต่อยอดเป็น Term Project  
- Git repository (ทั้ง local และ remote) ที่พร้อมใช้งาน  
- การบันทึก commit แรกพร้อมหลักฐานการตั้งค่า

### B.2 ขั้นตอนการสร้างโครงโปรเจกต์

1. เลือก **ชื่อกลุ่ม** และ **ชื่อ repository**  
   - ตัวอย่างชื่อกลุ่ม: `Team Phoenix`, `Team ByteCraft`, `Team Quantum`  
   - ตัวอย่างชื่อ repo:  
     - `engce301-2-2568-group01`  
     - `engce301-termproject-team-phoenix`

2. บนเครื่องของสมาชิกคนใดคนหนึ่ง (ที่จะใช้เป็นต้นแบบ) ให้เปิด Terminal และพิมพ์:

   ```bash
   mkdir engce301-week1
   cd engce301-week1
   ```

3. สร้างโครงสร้างไฟล์และโฟลเดอร์เบื้องต้น:

   ```text
   engce301-week1/
   ├─ index.html
   ├─ README.md
   ├─ ENVIRONMENT.md        # จาก PART A
   └─ evidence/
      └─ week1/
          (ไฟล์ screenshot ต่าง ๆ)
   ```

### B.3 เนื้อหาเริ่มต้นใน `index.html`

ให้สร้างหน้าเว็บแรกที่มีเนื้อหา:

- รหัสวิชา + ชื่อวิชา  
- ชื่อกลุ่ม + รายชื่อสมาชิก  
- “เป้าหมายในฐานะวิศวกรซอฟต์แวร์” ของสมาชิกแต่ละคน (คนละ 1 ประโยค)

ตัวอย่าง:

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>Hello ENGCE301 – Group X</title>
</head>
<body>
  <h1>ENGCE301 – Software Design and Development</h1>
  <h2>Group X – Term Project</h2>

  <h3>สมาชิกในกลุ่ม</h3>
  <ul>
    <li>นาย A รหัส ... – เป้าหมาย: อยากเป็น Backend Developer ที่เขียนโค้ดอ่านง่ายและปลอดภัย</li>
    <li>นางสาว B รหัส ... – เป้าหมาย: อยากเป็น Full-stack Developer ที่เข้าใจทั้งฝั่งผู้ใช้และโค้ด</li>
    <li>นาย C รหัส ... – เป้าหมาย: อยากเป็น DevOps ที่ช่วยให้ระบบเสถียรและ deploy ได้บ่อย</li>
  </ul>

  <p>ไอเดีย Term Project (เบื้องต้น): ระบบจัดการ ... (สามารถแก้ไข/ต่อยอดภายหลังได้)</p>
</body>
</html>
```

### B.4 สร้าง Git Repository (local)

ในโฟลเดอร์ `engce301-week1/` ให้รันคำสั่ง:

```bash
git init
git status
git add .
git commit -m "Initial commit: setup project skeleton and environment log"
```

ตรวจสอบว่า:

- ไม่มีไฟล์ “untracked” สำคัญตกค้าง  
- commit แรกสร้างขึ้นสำเร็จ (`git log --oneline` แสดงผล 1 commit)

### B.5 สร้างและเชื่อมต่อกับ Remote Repository

1. ไปที่แพลตฟอร์มที่อาจารย์กำหนด (เช่น GitHub, GitLab)  
2. สร้าง repository ใหม่ ตามชื่อที่ตกลงในกลุ่ม  
3. คัดลอก URL ของ repo (แบบ HTTPS หรือ SSH ตามที่ใช้)  
4. กลับมาที่ Terminal ในโฟลเดอร์โปรเจกต์ รัน:

   ```bash
   git remote add origin <URL ของ repo>
   git branch -M main
   git push -u origin main
   ```

5. ถ่าย screenshot หน้าเว็บของ repository ที่แสดงไฟล์ `index.html`, `README.md`, `ENVIRONMENT.md`  
   และภาพหน้า `git log` ใน Terminal  
   - เก็บไว้ใน `evidence/week1/repo-main.png` และ `evidence/week1/git-log.png`

### B.6 การทำงานเป็นทีม (Commit จากหลายคน)

- ให้สมาชิกในกลุ่มอย่างน้อย **2 คนขึ้นไป**  
  - ทำการแก้ไขไฟล์เล็กน้อย (เช่น เพิ่มชื่อ, แก้ข้อความใน README)  
  - commit การเปลี่ยนแปลงของตนเอง และ push ขึ้น remote  
- ตรวจสอบ `git log` ว่ามี commit จากหลายชื่อ (หลาย author) เพื่อยืนยันการทำงานเป็นทีม

---

## PART C – Browser DevTools & Mini Experiment

### C.1 เป้าหมาย

- ให้นักศึกษาคุ้นเคยกับการใช้ DevTools ใน browser  
- มองเห็นว่า HTML/DOM สามารถ “ตรวจสอบและปรับ” ได้แบบ real-time  
- เข้าใจหลักการเบื้องต้นของการรัน JavaScript บนหน้าเว็บ

### C.2 ขั้นตอนการทดลอง

1. เปิดไฟล์ `index.html` ด้วย browser  
   - อาจใช้ Live Server ใน VS Code หรือเปิดไฟล์ตรง ๆ ก็ได้  

2. เปิด DevTools  
   - บน Chrome/Edge/Firefox สามารถใช้ `F12` หรือคลิกขวา → Inspect  

3. ทดลองใช้ **Elements Panel**

   - เลือกแท็บ **Elements**  
   - คลิกเลือก `<h1>` บน DOM tree  
   - ลองแก้ไขข้อความใน `<h1>` ชั่วคราว เช่น เพิ่มคำว่า `(Debug Mode)`  
   - สังเกตว่าเนื้อหาบนหน้าเว็บเปลี่ยนทันที  
   - ลองเพิ่ม `<p>` เพิ่มเติมผ่าน DOM tree เช่น  
     `

<p>ข้อความนี้ถูกเพิ่มผ่าน DevTools</p>

`  

4. ทดลองใช้ **Console Panel**

   - เลือกแท็บ **Console**  
   - พิมพ์ JavaScript:

     ```js
     console.log("ENGCE301 Lab1 – Hello from DevTools");
     ```

   - กด Enter และสังเกต log ที่แสดงผล  

5. เพิ่ม Script ลงใน `index.html`

   แก้ไฟล์ `index.html` (ผ่าน VS Code) เพิ่ม script:

   ```html
   <script>
     console.log("ENGCE301 Lab 1 script loaded");
     alert("Welcome to Software Engineering World!");
   </script>
   ```

   - Refresh หน้าเว็บ → จะมี alert เด้งขึ้น  
   - เปิด Console → จะเห็น log ตามที่ระบุใน script  

### C.3 หลักฐานที่ต้องเก็บ

ให้บันทึก screenshot อย่างน้อย:

- `devtools-elements.png` – แสดง Elements Panel และการแก้ข้อความใน `<h1>` หรือการเพิ่ม `<p>`  
- `devtools-console.png` – แสดง Console พร้อมข้อความ `ENGCE301 Lab1 – Hello from DevTools`  
- `devtools-alert.png` – แสดง alert ที่เด้งบนหน้าเว็บหลังเติม script  

เก็บไฟล์ใน

```text
evidence/week1/
  devtools-elements.png
  devtools-console.png
  devtools-alert.png
```

### C.4 คำถามสะท้อนคิดใน README.md

แก้ไฟล์ `README.md` เพิ่ม section:

```markdown
## DevTools Reflection (Week 1)

1) Browser รู้ได้อย่างไรว่าต้องรัน JavaScript ใน `<script>` เมื่อโหลดหน้าเว็บ?
   → (อธิบาย 3–5 บรรทัด จากความเข้าใจของกลุ่ม)

2) ถ้าไม่มี DevTools การแก้ไขปัญหา (debug) เวลาเว็บมีปัญหาจะยากขึ้นอย่างไร?
   → (ตอบเป็น bullet list สั้น ๆ อย่างน้อย 3 ข้อ)

3) แต่ละคนคิดว่า Panel ไหนใน DevTools จะได้ใช้บ่อยที่สุดในเทอมนี้ (Elements / Console / Network / อื่น ๆ)? เพราะอะไร?
   → ให้สมาชิกแต่ละคนตอบสั้น ๆ คนละ 1–2 บรรทัด พร้อมระบุชื่อในวงเล็บ เช่น  
   - (A) ชอบ Console เพราะใช้ดู error message ของ JavaScript  
   - (B) ชอบ Elements เพราะใช้จัด layout และ debug CSS
```

---

## PART D – Mini SE & SDLC Summary (SE_INTRO_NOTES.md)

### D.1 เป้าหมาย

- ประเมินความเข้าใจเชิงทฤษฎีของสัปดาห์ที่ 1 (เชื่อมตรงกับ **CLO1**)  
- ให้กลุ่มแปลงสิ่งที่เรียนมาเป็นโน้ตสรุปของตนเอง (ไม่ใช่แค่คัดลอกจากสไลด์)

### D.2 โครงร่างไฟล์ `SE_INTRO_NOTES.md`

ให้กลุ่มสร้างไฟล์ `SE_INTRO_NOTES.md` และเขียนหัวข้ออย่างน้อยดังนี้:

1. **บทบาทของวิศวกรซอฟต์แวร์ (Software Engineer Role)**

   - อธิบายโดยรวม 5–7 บรรทัด ว่า “วิศวกรซอฟต์แวร์ทำอะไร”  
   - ระบุตัวอย่างงาน/กิจกรรม เช่น  
     - วิเคราะห์ requirement  
     - ออกแบบระบบ  
     - เขียนโค้ด/ทดสอบ  
     - ประสานงานกับทีมอื่น  
   - ใส่ bullet list ของบทบาทอื่นในทีม เช่น QA, DevOps, Product Owner, Business Analyst อย่างน้อย 3–4 บทบาท  

2. **ภาพรวม SDLC (Software Development Life Cycle)**

   - วาด SDLC แบบ text/ASCII เช่น:

     ```text
     Requirements → Design → Implementation → Testing → Deployment → Maintenance
     ```

   - เขียนคำอธิบายทีละขั้น (ขั้นละ 2–3 บรรทัด) ว่าทำอะไรและสำคัญอย่างไร  

3. **Waterfall vs Agile – ตารางเปรียบเทียบ**

   - ทำตารางใน Markdown เช่น:

     ```markdown
     | ประเด็น              | Waterfall                     | Agile (Scrum/Kanban)                     |
     |----------------------|------------------------------|------------------------------------------|
     | การวางแผน           | วางทีเดียวระยะยาว           | วางแผนเป็นรอบสั้น ๆ (Sprint)           |
     | การส่งมอบงาน        | ส่งตอนท้ายโครงการ           | ส่งบ่อย ๆ เป็น Increment                |
     | การเปลี่ยนแปลง     | เปลี่ยนยาก/เสี่ยงสูง        | ยอมรับและวางแผนสำหรับการเปลี่ยนแปลง   |
     | การสื่อสารกับลูกค้า | น้อย/เป็นทางการ             | สื่อสารสม่ำเสมอ ร่วม review ผลงาน      |
     ```

   - เพิ่มคำถามท้ายไฟล์:

     ```markdown
     ### การประยุกต์ใช้กับ Term Project ของกลุ่มเรา

     - ถ้า Term Project ใช้ Waterfall 100% กลุ่มเราคิดว่าจุดเด่น/ข้อจำกัดคืออะไร? (อย่างน้อย 3 ข้อ)
     - ถ้า Term Project ใช้ Agile (แบ่งเป็น Sprints) จุดเด่น/ข้อจำกัดคืออะไร? (อย่างน้อย 3 ข้อ)
     - สุดท้าย กลุ่มเราอยากใช้ approach แบบไหน หรือ hybrid แบบใด? เพราะเหตุใด?
     ```

---

## 5. รูปแบบการส่งงาน (Submission Format)

### 5.1 สิ่งที่ต้องส่ง

**กลุ่มละ 1 ชุด** ผ่านระบบที่อาจารย์กำหนด (เช่น LMS, Google Classroom, หรือ Git repo):

1. **ลิงก์ Git repository ของกลุ่ม**  
   - ตัวอย่าง: `https://github.com/<org>/engce301-2-2568-group01`

2. โครงสร้างไฟล์ใน repo ต้องมีอย่างน้อย:

   ```text
   / (root)
   ├─ index.html
   ├─ README.md
   ├─ ENVIRONMENT.md
   ├─ SE_INTRO_NOTES.md
   └─ evidence/
      └─ week1/
         env-*.png
         repo-main.png
         git-log.png
         devtools-elements.png
         devtools-console.png
         devtools-alert.png
   ```

3. ใน `README.md` ต้องมี:
   - รหัสและชื่อวิชา  
   - ชื่อกลุ่ม + รายชื่อสมาชิก (ชื่อ-นามสกุล + รหัสนักศึกษา)  
   - ลิงก์/อ้างอิงไปยังไฟล์สำคัญ (`ENVIRONMENT.md`, `SE_INTRO_NOTES.md`)  
   - ส่วน “DevTools Reflection (Week 1)” ตามข้อกำหนดใน PART C  

### 5.2 กำหนดส่ง

- ภายในวันที่/เวลาที่อาจารย์กำหนด (เช่น ภายใน 3 วันหลังจบแลบ)  
- งานที่ส่งช้าอาจถูกหักคะแนนตามเกณฑ์ของรายวิชา

---

## 6. เกณฑ์การให้คะแนน (Rubric) – รวม 20 คะแนน

> อาจารย์สามารถปรับน้ำหนักหรือรายละเอียดตามบริบทของรายวิชา/ภาคการศึกษาได้

| หมวดการประเมิน                                   | รายละเอียด                                                                                     | คะแนนสูงสุด | CLO ที่เกี่ยวข้อง |
|---------------------------------------------------|-----------------------------------------------------------------------------------------------|:-----------:|:------------------|
| **A. Environment Setup & Evidence**               | ติดตั้ง Git/Node/VS Code ครบทุกคน, มี `ENVIRONMENT.md` ครบข้อมูล และ screenshot ครบ         | 4           | C4                |
| **B. Git Repo & Project Structure**               | โครงโปรเจกต์ครบ (`index.html`, `README.md`, `ENVIRONMENT.md`), push ขึ้น remote สำเร็จ, มี commit log ชัดเจน | 5 | C4, C6           |
| **C. DevTools Usage & Reflection**                | ใช้ DevTools ได้จริง (มี evidence), script ทำงาน, ตอบคำถาม reflection ใน README ชัดเจน      | 4           | C4                |
| **D. SE & SDLC Notes (SE_INTRO_NOTES.md)**        | อธิบายบทบาท SE, SDLC, และ Waterfall vs Agile ได้ถูกต้อง มีตาราง/diagram และวิเคราะห์ Term Project | 5 | C1             |
| **E. Teamwork & Documentation Quality**           | มี commit จากหลายคน, แบ่งงานเหมาะสม, เอกสารอ่านง่าย, จัดโครงสร้าง repo ชัดเจน              | 2           | C6                |
| **รวม**                                           |                                                                                               | **20**      |                   |

### 6.1 แนวทางการให้คะแนนโดยละเอียด (ตัวอย่าง)

- **ได้คะแนนเต็มในหมวดใดหมวดหนึ่ง**:  
  - ทำครบทุกข้อ, เนื้อหาถูกต้อง, เขียนด้วยภาษาของตนเอง, หลักฐานชัด

- **ได้คะแนนบางส่วน (50–75%)**:  
  - ทำบางส่วนขาดรายละเอียด เช่น  
    - มีไฟล์แต่ข้อมูลไม่ครบ  
    - Evidence บางส่วนหายไป  
    - คำอธิบายสั้นเกินไป แต่ยังเห็นความเข้าใจที่ถูกทิศทาง

- **ได้คะแนนน้อย (0–25%)**:  
  - ขาดไฟล์สำคัญ  
  - ไม่มี evidence  
  - เนื้อหาผิดจากที่สอนในคลาสอย่างชัดเจน  
  - หรือมีการคัดลอกเนื้อหาจากแหล่งอื่นโดยไม่เข้าใจ

---

## 7. Check-list สำหรับนักศึกษาก่อนส่ง

ก่อนส่งงาน ขอให้กลุ่มตรวจสอบตามรายการต่อไปนี้:

- [ ] ทุกคนในกลุ่มติดตั้ง Git/Node/VS Code แล้ว และข้อมูลถูกบันทึกใน `ENVIRONMENT.md`  
- [ ] มีโฟลเดอร์ `evidence/week1/` และไฟล์ screenshot ครบ (env-*.png, repo-main.png, git-log.png, devtools-*.png)  
- [ ] ไฟล์ `index.html` แสดงข้อมูลกลุ่มและเป้าหมายของสมาชิกครบถ้วน  
- [ ] Git repository ถูก init, commit, และ push ขึ้น remote แล้ว  
- [ ] มี commit จากสมาชิก **อย่างน้อย 2 คนขึ้นไป** ใน repo  
- [ ] `README.md` มีข้อมูลรายวิชา, รายชื่อสมาชิก, DevTools Reflection ครบทั้ง 3 ข้อ  
- [ ] สร้างไฟล์ `SE_INTRO_NOTES.md` และเขียนครบทั้ง 3 ส่วน (บทบาท SE / SDLC / Waterfall vs Agile + วิเคราะห์ Term Project)  
- [ ] ตรวจสะกดคำ/ความเรียบร้อยของเอกสารและโครงสร้าง repo อีกครั้งก่อนคัดลอกลิงก์ไปส่ง

---

_END OF LAB 1 DOCUMENT – ENGCE301_
