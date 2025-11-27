# 🧪 LAB 02: Requirements Engineering & HTML Landing Page

## ENGCE301: การออกแบบและพัฒนาซอฟต์แวร์
### สัปดาห์ที่ 2 - ปฏิบัติการ (3 ชั่วโมง)

**CLO ที่เกี่ยวข้อง:** CLO1, CLO2, CLO4, CLO6  
**คะแนน:** 15 คะแนน  
**การส่งงาน:** ส่งผ่าน GitHub Repository + Google Classroom

---

## 🎯 วัตถุประสงค์การปฏิบัติ

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:

1. ✅ ระบุ **Stakeholders** และ **Requirements** เบื้องต้นของ Term Project ได้
2. ✅ ทำการ **สัมภาษณ์ผู้ใช้** (User Interview) เพื่อเก็บความต้องการได้
3. ✅ ร่าง **Software Requirements Specification (SRS)** ฉบับแรกได้
4. ✅ สร้าง **Landing Page** ด้วย HTML5 Semantic Tags ตาม Requirements ได้
5. ✅ ใช้ **Git** เพื่อ Version Control และ Push งานขึ้น GitHub ได้

---

## 📋 สิ่งที่ต้องเตรียม

### เครื่องมือ
- [ ] VSCode + Extensions (Prettier, Live Server)
- [ ] Git + GitHub Account
- [ ] Browser (Chrome/Firefox/Edge)
- [ ] Trello/Notion/Google Docs (สำหรับจัดการ Requirements)

### เอกสาร Template (ดาวน์โหลดจาก Classroom)
- [ ] `SRS_Template.docx` - โครงสร้าง SRS มาตรฐาน
- [ ] `User_Interview_Questions.pdf` - คำถามสำหรับสัมภาษณ์
- [ ] `Stakeholder_Analysis_Table.xlsx` - ตารางวิเคราะห์ Stakeholder

---

## ⏱️ กำหนดเวลาและขั้นตอน (3 ชั่วโมง)

### Part 1: Requirements Elicitation (45 นาที)
- Activity 1.1: Brainstorming & Stakeholder Identification
- Activity 1.2: Role-play User Interview

### Part 2: Requirements Analysis & Specification (45 นาที)
- Activity 2.1: จัดหมวดหมู่ Requirements (FR vs NFR)
- Activity 2.2: ร่าง SRS Document ฉบับแรก

### Part 3: HTML Landing Page Development (60 นาที)
- Activity 3.1: สร้างโครงสร้าง HTML5 Semantic
- Activity 3.2: ออกแบบ Layout และ Styling เบื้องต้น

### Part 4: Git Version Control & Submission (30 นาที)
- Activity 4.1: Commit & Push to GitHub
- Activity 4.2: Create Pull Request & Code Review

---

## 📌 PART 1: Requirements Elicitation (45 นาที)

### 🎨 Activity 1.1: Brainstorming & Stakeholder Identification (25 นาที)

#### สถานการณ์ (Scenario)
กลุ่มของคุณได้รับมอบหมายให้พัฒนาเว็บแอปพลิเคชันสำหรับ **Term Project** โดยให้เลือกหนึ่งในหัวข้อต่อไปนี้:

**ตัวเลือกหัวข้อโปรเจกต์:**

1. **🌱 EcoTrack** - ระบบติดตามรอยเท้าคาร์บอนและพฤติกรรมสิ่งแวดล้อม
   - **Target Users:** นักศึกษา, คนรักสิ่งแวดล้อม
   - **Core Features:** บันทึกการใช้พลังงาน, คำนวณรอยเท้าคาร์บอน, แนะนำวิธีลด CO2

2. **📚 StudyBuddy** - แพลตฟอร์มจับคู่เพื่อนเรียน และแชร์สรุปวิชา
   - **Target Users:** นักศึกษามหาวิทยาลัย
   - **Core Features:** หาเพื่อนเรียนตามวิชา, แชร์ note/summary, จัดกลุ่มอ่านหนังสือ

3. **🍽️ CampusEats** - ระบบสั่งอาหารในมหาวิทยาลัย
   - **Target Users:** นักศึกษา, ร้านอาหารในแคมปัส
   - **Core Features:** สั่งอาหารออนไลน์, จองโต๊ะ, รีวิวร้านอาหาร

4. **💪 FitnessPal** - ตัวช่วยวางแผนออกกำลังกายและโภชนาการ
   - **Target Users:** คนรักสุขภาพ, นักกีฬา
   - **Core Features:** สร้างโปรแกรมออกกำลังกาย, บันทึกแคลอรี่, ติดตามความคืบหน้า

5. **🎫 EventHub** - แพลตฟอร์มจัดการและลงทะเบียนกิจกรรมภายในมหาวิทยาลัย
   - **Target Users:** นักศึกษา, องค์กรนักศึกษา, ฝ่ายกิจการนักศึกษา
   - **Core Features:** สร้างอีเวนท์, ลงทะเบียนเข้าร่วม, Check-in ด้วย QR Code

**📝 ขั้นตอนการทำ:**

**Step 1: เลือกหัวข้อโปรเจกต์** (5 นาที)
- ประชุมกลุ่มและเลือกหัวข้อที่ทุกคนสนใจ
- หากมีไอเดียใหม่นอกเหนือจากข้างต้น สามารถเสนออาจารย์เพื่อขออนุมัติได้

**Step 2: ระบุ Stakeholders** (10 นาที)
- ใช้ **Stakeholder Analysis Table** (ดาวน์โหลดจาก Classroom)
- แบ่ง Stakeholders ออกเป็น 3 ชั้น:
  - **Primary:** ผู้ที่ใช้ระบบโดยตรง
  - **Secondary:** ผู้ที่เกี่ยวข้องกับการพัฒนา/บำรุงรักษา
  - **Indirect:** ผู้ที่ได้รับผลกระทบทางอ้อม

**ตัวอย่าง: EcoTrack**

| Stakeholder | Type | Interest | Influence | Priority |
|-------------|------|----------|-----------|----------|
| นักศึกษาทั่วไป | Primary | ต้องการติดตามรอยเท้าคาร์บอน | ต่ำ | High |
| อาจารย์/นักวิจัยสิ่งแวดล้อม | Primary | ใช้ข้อมูลเพื่อการวิจัย | กลาง | Medium |
| Developers (เรา) | Secondary | พัฒนาและดูแลระบบ | สูง | High |
| ฝ่ายกิจการนักศึกษา | Secondary | ต้องการส่งเสริมความตระหนักรู้ | กลาง | Medium |
| องค์กรสิ่งแวดล้อม | Indirect | รับข้อมูลเพื่อจัดทำรายงาน | ต่ำ | Low |

**Step 3: Brainstorm Initial Requirements** (10 นาที)
- ใช้เทคนิค **5W1H** ถามคำถาม:
  - **Who:** ใครจะใช้ระบบนี้?
  - **What:** ระบบจะทำอะไร?
  - **Where:** ใช้งานที่ไหน? (มือถือ? คอมพิวเตอร์?)
  - **When:** ใช้งานเมื่อไหร่? (ทุกวัน? ตามอีเวนท์?)
  - **Why:** ทำไมต้องมีระบบนี้? แก้ปัญหาอะไร?
  - **How:** จะทำงานได้อย่างไร? (คร่าวๆ)

- เขียนลงใน **Sticky Notes** (จริงหรือดิจิทัล) อย่างน้อย **15 items**
- จัดกลุ่มตามหมวดหมู่: Authentication, Core Features, Reports, etc.

---

### 🎭 Activity 1.2: Role-play User Interview (20 นาที)

**📝 ขั้นตอนการทำ:**

**Step 1: แบ่งบทบาท** (5 นาที)
- **Interviewer (1 คน):** ผู้สัมภาษณ์ (จะถามคำถาม)
- **User/Interviewee (1 คน):** แสดงเป็นผู้ใช้ระบบ (ตอบคำถามตามตัวตน)
- **Note Taker (1-2 คน):** จดบันทึกคำตอบ
- **Observer (คนที่เหลือ):** สังเกตและเตรียมคำถามเพิ่มเติม

**User Persona ตัวอย่าง (เลือก 1 ตัว):**
- **Persona A:** นักศึกษาปี 1 ที่ยังไม่คุ้นเคยกับแคมปัส
- **Persona B:** นักศึกษาปีสุดท้ายที่ยุ่งมากกับโปรเจกต์
- **Persona C:** อาจารย์ที่ต้องการเครื่องมือสอน

**Step 2: ทำการสัมภาษณ์** (10 นาที)
- ใช้ **User Interview Questions** (Template จาก Classroom)
- คำถามพื้นฐานที่ต้องถาม:
  1. "บอกเล่าเกี่ยวกับตัวคุณหน่อย? (ปีกี่? เรียนอะไร?)"
  2. "คุณพบปัญหาอะไรบ้างในเรื่อง [หัวข้อโปรเจกต์]?"
  3. "ตอนนี้คุณแก้ปัญหานั้นอย่างไร?"
  4. "ถ้ามีแอปที่ช่วยได้ คุณอยากให้มีฟีเจอร์อะไรบ้าง?"
  5. "อะไรคือสิ่งที่ทำให้คุณใช้แอปนี้ต่อเนื่อง?"
  6. "คุณเต็มใจจ่ายเงินสำหรับแอปนี้ไหม? ถ้าใช่ เท่าไหร่?"

**⚠️ Do's and Don'ts:**
- ✅ DO: ถามคำถามปลายเปิด ("อย่างไร?" "ทำไม?")
- ✅ DO: ให้เวลา User คิดและพูด (อย่าเร่ง)
- ❌ DON'T: ถามคำถามแนะนำคำตอบ ("คุณอยากได้ปุ่มสีแดงใช่ไหม?")
- ❌ DON'T: พยายามขายไอเดียของคุณให้ User

**Step 3: Debrief & Document** (5 นาที)
- สรุปสิ่งที่ได้จากการสัมภาษณ์
- Highlight **Pain Points** (จุดเจ็บปวด/ปัญหาสำคัญ)
- เขียนลงใน **Interview Notes Template**

---

## 📌 PART 2: Requirements Analysis & Specification (45 นาที)

### 🔍 Activity 2.1: จัดหมวดหมู่ Requirements (20 นาที)

**📝 ขั้นตอนการทำ:**

**Step 1: รวบรวม Requirements จาก Part 1**
- ข้อมูลจาก Brainstorming
- ข้อมูลจาก User Interview

**Step 2: แบ่งเป็น Functional vs Non-Functional**

**Functional Requirements (FR):** สิ่งที่ระบบต้อง**ทำ**
- รูปแบบ: `FR-XXX: [Action Verb] + [Object] + [Condition]`
- ตัวอย่าง EcoTrack:
  - `FR-001: ผู้ใช้สามารถ Login ด้วย email และ password`
  - `FR-002: ระบบต้องบันทึกการใช้ไฟฟ้ารายวัน (หน่วย: kWh)`
  - `FR-003: ระบบต้องคำนวณรอยเท้าคาร์บอนจากข้อมูลที่บันทึก`
  - `FR-004: ผู้ใช้สามารถดูกราฟสรุปรอยเท้าคาร์บอนรายสัปดาห์`
  - `FR-005: ระบบต้องแนะนำวิธีลด CO2 เป็นรายการ (Tips)`

**Non-Functional Requirements (NFR):** คุณภาพที่ระบบต้อง**เป็น**
- จัดหมวดตาม **URPS+** (Usability, Reliability, Performance, Security + others)

**ตัวอย่าง EcoTrack:**

| Category | ID | Description |
|----------|----|----|
| **Performance** | NFR-001 | หน้าเว็บต้องโหลดเสร็จภายใน 2 วินาที |
| **Usability** | NFR-002 | ผู้ใช้ต้องสามารถบันทึกข้อมูลได้ภายใน 5 คลิก |
| **Security** | NFR-003 | รหัสผ่านต้อง hash ด้วย bcrypt |
| **Reliability** | NFR-004 | ระบบต้องมี uptime 99% (downtime ไม่เกิน 3.65 วัน/ปี) |
| **Portability** | NFR-005 | เว็บแอปต้องทำงานได้บน Chrome, Firefox, Safari (latest versions) |

**Step 3: จัดลำดับความสำคัญ (Prioritization)**
- ใช้ **MoSCoW Method:**
  - **M**ust Have: จำเป็นต้องมี (ถ้าไม่มีระบบจะไม่สมบูรณ์)
  - **S**hould Have: ควรจะมี (สำคัญรองลงมา)
  - **C**ould Have: อาจจะมี (ถ้ามีเวลาเหลือ)
  - **W**on't Have (this time): ไม่มีในรอบนี้ (เก็บไว้ version 2.0)

**ตัวอย่าง:**
- `FR-001 (Login)` → Must Have
- `FR-002 (บันทึกข้อมูล)` → Must Have
- `FR-003 (คำนวณคาร์บอน)` → Must Have
- `FR-004 (กราฟสรุป)` → Should Have
- `FR-005 (แนะนำ Tips)` → Could Have
- `FR-006 (Social sharing)` → Won't Have

---

### 📝 Activity 2.2: ร่าง SRS Document ฉบับแรก (25 นาที)

**📄 SRS Template Structure** (ตาม IEEE 830)

```
📁 Software Requirements Specification
   |
   ├── 1. Introduction
   |    ├── 1.1 Purpose (วัตถุประสงค์ของเอกสาร)
   |    ├── 1.2 Scope (ขอบเขตของระบบ)
   |    ├── 1.3 Definitions & Abbreviations
   |    └── 1.4 References
   |
   ├── 2. Overall Description
   |    ├── 2.1 Product Perspective (ภาพรวมระบบ)
   |    ├── 2.2 Product Functions (สรุปฟีเจอร์หลัก)
   |    ├── 2.3 User Characteristics (ลักษณะผู้ใช้)
   |    ├── 2.4 Constraints (ข้อจำกัด)
   |    └── 2.5 Assumptions and Dependencies
   |
   └── 3. Specific Requirements
        ├── 3.1 Functional Requirements
        └── 3.2 Non-Functional Requirements
```

**📝 ขั้นตอนการทำ:**

**Step 1: เปิดไฟล์ `SRS_Template.docx`**

**Step 2: กรอกข้อมูล Section 1: Introduction**

```markdown
### 1.1 Purpose
เอกสารฉบับนี้ระบุความต้องการของระบบ [ชื่อโปรเจกต์] 
มีวัตถุประสงค์เพื่อใช้เป็นแนวทางในการออกแบบ พัฒนา 
และทดสอบระบบ รวมทั้งใช้เป็นสัญญาระหว่างทีมพัฒนากับผู้ใช้งาน

### 1.2 Scope
ระบบ [ชื่อโปรเจกต์] เป็นเว็บแอปพลิเคชันที่มีวัตถุประสงค์เพื่อ 
[บรรยายสั้นๆ ว่าระบบทำอะไร แก้ปัญหาอะไร]

ขอบเขตของระบบครอบคลุม:
- [Feature 1]
- [Feature 2]
- [Feature 3]

ขอบเขตที่ไม่รวมในระบบ (Out of Scope):
- [สิ่งที่ไม่ทำ 1]
- [สิ่งที่ไม่ทำ 2]

### 1.3 Definitions, Acronyms, and Abbreviations
- **FR:** Functional Requirement
- **NFR:** Non-Functional Requirement
- **UI:** User Interface
- **API:** Application Programming Interface
[เพิ่มศัพท์เทคนิคที่ใช้ในระบบ]
```

**Step 3: กรอกข้อมูล Section 2: Overall Description**

```markdown
### 2.1 Product Perspective
[วาดรูป Context Diagram แสดงระบบกับสิ่งภายนอกที่เชื่อมต่อ]
ระบบ [ชื่อโปรเจกต์] เป็นระบบแบบ standalone ที่ทำงานบนเว็บเบราว์เซอร์
มีการเชื่อมต่อกับ:
- [External System 1 เช่น Google Authentication]
- [External System 2 เช่น Payment Gateway]

### 2.2 Product Functions
ฟังก์ชันหลักของระบบ (สรุปย่อจาก FR):
1. [ฟีเจอร์หลัก 1]
2. [ฟีเจอร์หลัก 2]
3. [ฟีเจอร์หลัก 3]

### 2.3 User Characteristics
กลุ่มผู้ใช้หลัก:
- **User Type 1:** [อธิบายลักษณะ เช่น นักศึกษาปี 1-4, 
  มีความเชี่ยวชาญด้านเทคโนโลยีระดับกลาง]
- **User Type 2:** [อธิบายลักษณะ]

### 2.4 Constraints
ข้อจำกัดในการพัฒนา:
- งบประมาณ: [ระบุ ถ้ามี]
- เวลา: ต้องเสร็จภายในภาคการศึกษานี้ (สัปดาห์ที่ 16)
- เทคโนโลยี: ต้องใช้ React, Node.js, SQLite/MongoDB ตามหลักสูตร
- ทีมพัฒนา: มีสมาชิก [X] คน มีเวลาทำงาน [Y] ชม./สัปดาห์

### 2.5 Assumptions and Dependencies
สมมติฐาน:
- ผู้ใช้มี Internet Connection
- ผู้ใช้มีเบราว์เซอร์ที่รองรับ HTML5
- [เพิ่มตามความเหมาะสม]

Dependencies:
- ต้องมี Web Server สำหรับ Deploy
- ต้องมี Database Server
- [เพิ่มตามความเหมาะสม]
```

**Step 4: กรอกข้อมูล Section 3: Specific Requirements**

```markdown
### 3.1 Functional Requirements

#### 3.1.1 User Authentication
FR-001: ผู้ใช้สามารถลงทะเบียนด้วย email, password, ชื่อ-นามสกุล
  - Input: Email (format: xxx@xxx.xxx), Password (min 8 chars), ชื่อ-นามสกุล
  - Process: ตรวจสอบ email ซ้ำ, hash password ด้วย bcrypt
  - Output: สร้าง User account และส่ง confirmation email
  - Priority: Must Have

FR-002: ผู้ใช้สามารถ Login ด้วย email และ password
  - Input: Email, Password
  - Process: ตรวจสอบจากฐานข้อมูล, สร้าง JWT Token
  - Output: Redirect ไปหน้า Dashboard
  - Priority: Must Have

[เขียน FR ครบทุกฟีเจอร์ตามรูปแบบนี้]

#### 3.1.2 [ชื่อ Module 2]
FR-003: ...
FR-004: ...

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements
NFR-001: หน้าเว็บต้องโหลดเสร็จภายใน 2 วินาที (measured with Lighthouse)
NFR-002: API Response Time ต้องไม่เกิน 500ms (95th percentile)

#### 3.2.2 Security Requirements
NFR-003: รหัสผ่านต้อง hash ด้วย bcrypt (salt rounds = 10)
NFR-004: Session Token (JWT) ต้องมีอายุไม่เกิน 24 ชม.
NFR-005: ต้องใช้ HTTPS สำหรับการสื่อสารทั้งหมด

[เขียน NFR ครบทุกหมวด]
```

**✅ Checklist ก่อนส่ง SRS:**
- [ ] มี Functional Requirements อย่างน้อย 10 รายการ
- [ ] มี Non-Functional Requirements อย่างน้อย 5 รายการ
- [ ] แต่ละ Requirement มี ID unique
- [ ] ระบุ Priority (Must/Should/Could) ครบทุกรายการ
- [ ] ภาษาชัดเจน ไม่คลุมเครือ (ทดสอบโดยให้คนอื่นอ่าน)

---

## 📌 PART 3: HTML Landing Page Development (60 นาที)

### 🌐 Activity 3.1: สร้างโครงสร้าง HTML5 Semantic (30 นาที)

**🎯 เป้าหมาย:** สร้างหน้า Landing Page ที่สะท้อน Requirements ที่เก็บมาได้

**📝 ขั้นตอนการทำ:**

**Step 1: สร้างไฟล์โครงสร้างโปรเจกต์**

```
📁 ENGCE301_GroupXX_Project/
│
├── 📄 index.html          (Landing Page)
├── 📁 css/
│   └── 📄 style.css       (Stylesheet)
├── 📁 assets/
│   ├── 📁 images/         (รูปภาพ)
│   └── 📁 icons/          (ไอคอน)
├── 📄 README.md           (ข้อมูลโปรเจกต์)
└── 📄 SRS_Draft.md        (SRS จาก Part 2)
```

**Step 2: เขียนโครง HTML5 Semantic**

**ไฟล์: `index.html`**

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[คำอธิบายโปรเจกต์สั้นๆ 150-160 ตัวอักษร]">
    <meta name="keywords" content="[คีย์เวิร์ดสำคัญ]">
    <meta name="author" content="Group XX - ENGCE301">
    <title>[ชื่อโปรเจกต์] - ENGCE301 Term Project</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">
    
    <!-- Google Fonts (ถ้าใช้) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <!-- =========================== HEADER =========================== -->
    <header class="main-header">
        <div class="container">
            <!-- Logo -->
            <div class="logo">
                <h1>[ชื่อโปรเจกต์]</h1>
                <!-- หรือใช้รูปภาพ: <img src="assets/images/logo.png" alt="Logo"> -->
            </div>
            
            <!-- Navigation Menu -->
            <nav class="main-nav">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#team">Team</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- =========================== MAIN CONTENT =========================== -->
    <main>
        
        <!-- Hero Section -->
        <section id="home" class="hero-section">
            <div class="container">
                <h2 class="hero-title">
                    [Tagline ของโปรเจกต์ - ดึงดูดความสนใจ]
                </h2>
                <p class="hero-description">
                    [คำอธิบายย่อ 2-3 ประโยค ว่าระบบนี้ทำอะไร แก้ปัญหาอะไร]
                </p>
                <div class="hero-cta">
                    <button class="btn btn-primary">Get Started</button>
                    <button class="btn btn-secondary">Learn More</button>
                </div>
            </div>
        </section>

        <!-- Problem Statement Section -->
        <section id="problem" class="problem-section">
            <div class="container">
                <h2>The Problem We're Solving</h2>
                <p>
                    [อธิบายปัญหาที่พบจาก User Interview - Pain Points]
                </p>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features-section">
            <div class="container">
                <h2>Key Features</h2>
                <p class="section-description">
                    [สรุปย่อว่ามีฟีเจอร์อะไรบ้าง]
                </p>
                
                <div class="features-grid">
                    <!-- Feature Card 1 -->
                    <article class="feature-card">
                        <div class="feature-icon">
                            <!-- ใส่ไอคอนหรือรูปภาพ -->
                            <span>🎯</span>
                        </div>
                        <h3>[ชื่อฟีเจอร์ 1]</h3>
                        <p>[คำอธิบายสั้นๆ ว่าฟีเจอร์นี้ทำอะไร]</p>
                    </article>

                    <!-- Feature Card 2 -->
                    <article class="feature-card">
                        <div class="feature-icon">
                            <span>📊</span>
                        </div>
                        <h3>[ชื่อฟีเจอร์ 2]</h3>
                        <p>[คำอธิบายสั้นๆ]</p>
                    </article>

                    <!-- Feature Card 3 -->
                    <article class="feature-card">
                        <div class="feature-icon">
                            <span>🔐</span>
                        </div>
                        <h3>[ชื่อฟีเจอร์ 3]</h3>
                        <p>[คำอธิบายสั้นๆ]</p>
                    </article>

                    <!-- เพิ่ม feature cards ตามความเหมาะสม (แนะนำ 4-6 อัน) -->
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section id="how-it-works" class="how-section">
            <div class="container">
                <h2>How It Works</h2>
                <div class="steps">
                    <article class="step">
                        <span class="step-number">1</span>
                        <h3>[ขั้นตอนที่ 1]</h3>
                        <p>[อธิบาย]</p>
                    </article>
                    
                    <article class="step">
                        <span class="step-number">2</span>
                        <h3>[ขั้นตอนที่ 2]</h3>
                        <p>[อธิบาย]</p>
                    </article>
                    
                    <article class="step">
                        <span class="step-number">3</span>
                        <h3>[ขั้นตอนที่ 3]</h3>
                        <p>[อธิบาย]</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <h2>About This Project</h2>
                <p>
                    [บอกเล่าเพิ่มเติมเกี่ยวกับโปรเจกต์ - แรงบันดาลใจ, วัตถุประสงค์]
                </p>
            </div>
        </section>

        <!-- Team Section -->
        <section id="team" class="team-section">
            <div class="container">
                <h2>Our Team</h2>
                <div class="team-grid">
                    <!-- Team Member 1 -->
                    <article class="team-member">
                        <img src="assets/images/member1.jpg" alt="Member Name">
                        <h3>[ชื่อสมาชิก 1]</h3>
                        <p class="role">[Role: Product Owner / Developer / Designer]</p>
                        <p class="student-id">[รหัสนักศึกษา]</p>
                    </article>

                    <!-- Team Member 2 -->
                    <article class="team-member">
                        <img src="assets/images/member2.jpg" alt="Member Name">
                        <h3>[ชื่อสมาชิก 2]</h3>
                        <p class="role">[Role]</p>
                        <p class="student-id">[รหัสนักศึกษา]</p>
                    </article>

                    <!-- เพิ่มสมาชิกทุกคนในกลุ่ม -->
                </div>
            </div>
        </section>

        <!-- Contact/CTA Section -->
        <section id="contact" class="contact-section">
            <div class="container">
                <h2>Interested in Our Project?</h2>
                <p>[Call-to-Action message]</p>
                <button class="btn btn-primary">Contact Us</button>
            </div>
        </section>

    </main>

    <!-- =========================== ASIDE (Optional) =========================== -->
    <aside class="sidebar">
        <!-- ถ้ามี Sidebar เช่น Latest Updates, Quick Links -->
    </aside>

    <!-- =========================== FOOTER =========================== -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <!-- Footer Info -->
                <div class="footer-info">
                    <h4>[ชื่อโปรเจกต์]</h4>
                    <p>ENGCE301: Software Design and Development</p>
                    <p>Term Project - Group XX</p>
                    <p>Rajamangala University of Technology Lanna</p>
                </div>

                <!-- Footer Links -->
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="https://github.com/[username]/[repo]" target="_blank">GitHub Repository</a></li>
                        <li><a href="SRS_Draft.md">View SRS Document</a></li>
                    </ul>
                </div>

                <!-- Footer Contact -->
                <div class="footer-contact">
                    <h4>Contact</h4>
                    <p>📧 Email: [group-email]@rmutl.ac.th</p>
                    <p>📱 Tel: XXX-XXX-XXXX</p>
                </div>
            </div>

            <!-- Copyright -->
            <div class="footer-bottom">
                <p>&copy; 2025 [ชื่อโปรเจกต์]. All rights reserved.</p>
                <p>Developed with ❤️ by Group XX</p>
            </div>
        </div>
    </footer>

</body>
</html>
```

**⚠️ สิ่งที่ต้องระวัง:**
- ✅ ใช้ **semantic tags** อย่างถูกต้อง (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- ✅ แต่ละ `<section>` ควรมี `<h2>` หรือ heading
- ✅ ใส่ `alt` attribute ให้ทุกรูปภาพ (เพื่อ Accessibility)
- ✅ ใช้ `id` สำหรับ navigation anchors
- ❌ อย่าใช้ `<div>` เยอะเกินไปโดยไม่จำเป็น

---

### 🎨 Activity 3.2: ออกแบบ Layout และ Styling เบื้องต้น (30 นาที)

**ไฟล์: `css/style.css`**

```css
/* ===========================
   CSS Reset & Base Styles
   =========================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Color Palette - ปรับตามธีมโปรเจกต์ */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --accent-color: #28a745;
    --danger-color: #dc3545;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    --text-color: #212529;
    
    /* Typography */
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-size-base: 16px;
    --font-size-lg: 1.25rem;
    --font-size-xl: 2rem;
    
    /* Spacing */
    --spacing-unit: 1rem;
    --container-width: 1200px;
}

html {
    font-size: var(--font-size-base);
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-primary);
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-color);
}

/* Container */
.container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 calc(var(--spacing-unit) * 2);
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
    background-color: var(--primary-color);
    color: white;
}

/* ===========================
   HEADER
   =========================== */
.main-header {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 1rem 0;
}

.main-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    font-size: 1.5rem;
    color: var(--primary-color);
}

.main-nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.main-nav a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s;
}

.main-nav a:hover {
    color: var(--primary-color);
}

/* ===========================
   HERO SECTION
   =========================== */
.hero-section {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    text-align: center;
    padding: 6rem 0;
    margin-bottom: 4rem;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-description {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* ===========================
   SECTIONS
   =========================== */
section {
    padding: 4rem 0;
}

section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: var(--dark-color);
}

.section-description {
    text-align: center;
    font-size: 1.1rem;
    color: var(--secondary-color);
    margin-bottom: 3rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

/* Features Grid */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.feature-card p {
    color: var(--secondary-color);
}

/* How It Works Section */
.steps {
    display: flex;
    justify-content: space-around;
    gap: 2rem;
    margin-top: 3rem;
}

.step {
    flex: 1;
    text-align: center;
}

.step-number {
    display: inline-block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.step h3 {
    margin-bottom: 0.5rem;
}

/* Team Section */
.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.team-member {
    text-align: center;
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.team-member img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
}

.team-member h3 {
    margin-bottom: 0.5rem;
    color: var(--dark-color);
}

.team-member .role {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.team-member .student-id {
    color: var(--secondary-color);
    font-size: 0.9rem;
}

/* ===========================
   FOOTER
   =========================== */
.main-footer {
    background-color: var(--dark-color);
    color: white;
    padding: 3rem 0 1rem;
    margin-top: 4rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-info h4,
.footer-links h4,
.footer-contact h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.footer-links ul {
    list-style: none;
}

.footer-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: var(--primary-color);
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* ===========================
   RESPONSIVE DESIGN
   =========================== */
@media (max-width: 768px) {
    .main-header .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .main-nav ul {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-description {
        font-size: 1rem;
    }
    
    .hero-cta {
        flex-direction: column;
        align-items: center;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .steps {
        flex-direction: column;
    }
    
    section h2 {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    html {
        font-size: 14px;
    }
    
    .hero-title {
        font-size: 1.75rem;
    }
    
    section {
        padding: 2rem 0;
    }
}
```

**✅ CSS Checklist:**
- [ ] ใช้ CSS Variables (`:root`) สำหรับ Colors และ Spacing
- [ ] มี Responsive Design (Media Queries)
- [ ] ใช้ Flexbox/Grid สำหรับ Layout
- [ ] มี Hover Effects สำหรับ Buttons/Links
- [ ] ใช้ Box Shadow และ Border Radius เพื่อความสวยงาม

---

## 📌 PART 4: Git Version Control & Submission (30 นาที)

### 📦 Activity 4.1: Commit & Push to GitHub (15 นาที)

**📝 ขั้นตอนการทำ:**

**Step 1: สร้าง `.gitignore` ไฟล์**

```plaintext
# Node modules (ถ้ามีในอนาคต)
node_modules/

# Environment variables
.env

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/

# Build files
dist/
build/
```

**Step 2: สร้าง `README.md` ที่ดี**

```markdown
# [ชื่อโปรเจกต์] - ENGCE301 Term Project

## 📋 Description
[คำอธิบายโปรเจกต์ 2-3 ย่อหน้า]

## 🎯 Objectives
- [Objective 1]
- [Objective 2]
- [Objective 3]

## 👥 Team Members (Group XX)
| Name | Student ID | Role | GitHub |
|------|-----------|------|--------|
| [ชื่อ 1] | 65XXXXXXX | Product Owner | [@username1](https://github.com/username1) |
| [ชื่อ 2] | 65XXXXXXX | Developer | [@username2](https://github.com/username2) |
| [ชื่อ 3] | 65XXXXXXX | Developer | [@username3](https://github.com/username3) |

## 🚀 Features
- ✅ [Feature 1]
- ✅ [Feature 2]
- 🔄 [Feature 3] (In Progress)
- ⏳ [Feature 4] (Planned)

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express (Coming soon)
- **Database:** SQLite / MongoDB (Coming soon)
- **Version Control:** Git, GitHub

## 📂 Project Structure
```
📁 ENGCE301_GroupXX_Project/
├── 📄 index.html          # Landing Page
├── 📁 css/
│   └── 📄 style.css
├── 📁 assets/
│   ├── 📁 images/
│   └── 📁 icons/
├── 📄 SRS_Draft.md        # Requirements Specification
├── 📄 README.md
└── 📄 .gitignore
```

## 📖 Documentation
- [Software Requirements Specification (SRS)](./SRS_Draft.md)
- [User Interview Notes](./docs/interview_notes.md)

## 🌐 Demo
- **Live Demo:** [https://username.github.io/project-name/](https://username.github.io/project-name/) (ถ้า deploy แล้ว)
- **GitHub Pages:** Coming soon...

## 🏃‍♂️ How to Run Locally
```bash
# 1. Clone repository
git clone https://github.com/username/project-name.git

# 2. Navigate to project folder
cd project-name

# 3. Open with Live Server (VSCode Extension)
# Or simply open index.html in browser
```

## 📅 Project Timeline
- [x] Week 1: Project Initialization & Environment Setup
- [x] Week 2: Requirements Engineering & Landing Page
- [ ] Week 3: User Stories & Use Cases
- [ ] Week 4-5: Design Phase
- [ ] Week 6-12: Development Phase
- [ ] Week 13-14: Testing Phase
- [ ] Week 15: Deployment & Documentation
- [ ] Week 16: Final Presentation

## 📝 License
This project is developed as part of ENGCE301 course requirements at RMUTL.

## 📧 Contact
- **Email:** [group-email]@rmutl.ac.th
- **Course:** ENGCE301 - Software Design and Development
- **Instructor:** อาจารย์ธนิต เกตุแก้ว
```

**Step 3: Initialize Git & Make First Commit**

เปิด Terminal ใน VSCode:

```bash
# ตรวจสอบว่าอยู่ในโฟลเดอร์โปรเจกต์
pwd

# Initialize Git (ถ้ายังไม่ได้ทำใน Week 1)
git init

# Add all files
git add .

# Check status
git status

# First commit
git commit -m "feat: add landing page with semantic HTML and SRS draft

- Create HTML5 semantic structure for landing page
- Add hero section, features, team, and contact sections
- Implement responsive CSS with Flexbox/Grid
- Add SRS document (draft version)
- Include README with project information

Refs: Lab02 - Week 2 Requirements Engineering"

# ตั้งชื่อ branch เป็น main (ถ้ายังไม่ได้ทำ)
git branch -M main
```

**Step 4: Push to GitHub**

```bash
# Add remote (ถ้ายังไม่ได้เชื่อม)
git remote add origin https://github.com/[username]/[repo-name].git

# Push
git push -u origin main
```

**✅ Verify on GitHub:**
- [ ] ไฟล์ทั้งหมด upload ขึ้นแล้ว
- [ ] README.md แสดงผลถูกต้อง
- [ ] Commit message มีรายละเอียดชัดเจน

---

### 🔍 Activity 4.2: Code Review & Pull Request (15 นาที)

**📝 ขั้นตอนการทำ (สำหรับทีมที่มีมากกว่า 1 คน):**

**Step 1: สร้าง Branch ใหม่สำหรับแต่ละคน**

```bash
# สมาชิกคนที่ 1
git checkout -b feature/member1-improvements

# สมาชิกคนที่ 2
git checkout -b feature/member2-improvements
```

**Step 2: แต่ละคนทำการปรับปรุงส่วนของตัวเอง**

เช่น:
- คนที่ 1: ปรับปรุง Hero Section และเพิ่ม Animation
- คนที่ 2: ปรับปรุง Features Section และเพิ่มรูปภาพ
- คนที่ 3: ปรับปรุง Team Section และ Footer

**Step 3: Commit และ Push branch**

```bash
# Add changes
git add .

# Commit
git commit -m "feat(landing): improve hero section with animations"

# Push branch
git push origin feature/member1-improvements
```

**Step 4: สร้าง Pull Request บน GitHub**

1. ไปที่ GitHub Repository
2. คลิกปุ่ม "Compare & pull request"
3. เขียนรายละเอียด PR:

```markdown
## Description
ปรับปรุง Hero Section โดยเพิ่ม animations และปรับ layout ให้ดูทันสมัยขึ้น

## Changes Made
- เพิ่ม CSS animations สำหรับ fade-in effect
- ปรับ responsive layout สำหรับ mobile
- เพิ่ม hover effects ที่ buttons

## Screenshots
[ใส่ภาพหน้าจอ before/after]

## Checklist
- [x] Code follows project style guidelines
- [x] Tested on multiple browsers (Chrome, Firefox, Safari)
- [x] Responsive design works on mobile/tablet/desktop
- [ ] Reviewed by at least one team member
```

4. คลิก "Create pull request"

**Step 5: Code Review**

สมาชิกคนอื่นในทีม:
1. เข้าไปดู Pull Request
2. Review code โดยดูที่:
   - ✅ Code quality (เข้าใจง่าย? มี comment?)
   - ✅ Follows standards (ใช้ semantic HTML? CSS organized?)
   - ✅ No bugs (ทดสอบแล้วไหม?)
   - ✅ Responsive (ใช้งานบนมือถือได้ไหม?)
3. Comment ให้ feedback:
   - "👍 Looks good! The animation is smooth."
   - "❓ Question: Why did you choose this approach?"
   - "💡 Suggestion: Consider using CSS variables for colors"
   - "⚠️ Issue: The button is not aligned on mobile view"
4. Approve หรือ Request Changes

**Step 6: Merge Pull Request**

- ถ้า Approved → คลิก "Merge pull request"
- ถ้า Request Changes → แก้ไขตาม feedback แล้ว push อีกครั้ง

---

## 📤 การส่งงาน (Submission)

### ส่งผ่าน Google Classroom:

**1. URL GitHub Repository**
```
https://github.com/[username]/[repo-name]
```

**2. URL GitHub Pages (ถ้า deploy แล้ว)**
```
https://[username].github.io/[repo-name]/
```

**3. เอกสารแนบ (ไฟล์ PDF/DOCX):**
- [ ] `SRS_Draft_GroupXX.pdf` - Software Requirements Specification
- [ ] `Interview_Notes_GroupXX.pdf` - บันทึกการสัมภาษณ์ผู้ใช้
- [ ] `Stakeholder_Analysis_GroupXX.xlsx` - ตารางวิเคราะห์ Stakeholder

**4. Screenshot ประกอบ:**
- [ ] Screenshot 1: หน้า Landing Page บน Desktop
- [ ] Screenshot 2: หน้า Landing Page บน Mobile (Responsive)
- [ ] Screenshot 3: GitHub Repository (แสดงไฟล์และ Commits)
- [ ] Screenshot 4: Pull Request & Code Review (ถ้ามี)

**5. Video Demo (Optional - Extra Credit 2 คะแนน):**
- [ ] วิดีโอสั้น 3-5 นาที อธิบายโปรเจกต์และ Demo หน้าเว็บ

---

## 📊 เกณฑ์การให้คะแนน (15 คะแนน)

### Part 1: Requirements Elicitation (4 คะแนน)
| Criteria | Points | Description |
|----------|--------|-------------|
| Stakeholder Identification | 1.5 | ระบุ Stakeholders ครบถ้วนและจัดหมวดหมู่ถูกต้อง (Primary/Secondary/Indirect) |
| Brainstorming Quality | 1 | มี Requirements อย่างน้อย 15 รายการ หลากหลาย |
| User Interview | 1.5 | มีบันทึกการสัมภาษณ์ ถามคำถามที่เหมาะสม ได้ Pain Points ชัดเจน |

### Part 2: Requirements Specification (4 คะแนน)
| Criteria | Points | Description |
|----------|--------|-------------|
| SRS Completeness | 2 | มี Section ครบตามโครงสร้าง IEEE 830 |
| Functional Requirements | 1 | มี FR อย่างน้อย 10 รายการ ชัดเจน ไม่คลุมเครือ มี Priority |
| Non-Functional Requirements | 1 | มี NFR อย่างน้อย 5 รายการ จัดหมวดหมู่ถูกต้อง (Performance/Security/etc.) |

### Part 3: HTML Landing Page (5 คะแนน)
| Criteria | Points | Description |
|----------|--------|-------------|
| HTML Semantic Structure | 1.5 | ใช้ `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` ถูกต้อง |
| Content Quality | 1 | เนื้อหาสะท้อน Requirements ชัดเจน สมบูรณ์ มีรูปภาพ/ไอคอนประกอบ |
| CSS Styling & Layout | 1.5 | มี CSS ที่จัดระเบียบดี ใช้ Flexbox/Grid, มี Color scheme สวยงาม |
| Responsive Design | 1 | ใช้งานได้ดีบน Desktop, Tablet, Mobile (มี Media Queries) |

### Part 4: Git & Collaboration (2 คะแนน)
| Criteria | Points | Description |
|----------|--------|-------------|
| Git Usage | 1 | มี Commit messages ที่มีความหมาย, โครงสร้างโปรเจกต์เป็นระเบียบ |
| Code Review / Teamwork | 1 | มี Pull Request และ Code Review (ถ้าทำงานเดี่ยวให้แสดง Git history ที่ดี) |

### Extra Credit (2 คะแนน)
- [ ] **Video Demo** (+1): วิดีโอสาธิตโปรเจกต์และอธิบาย Design Decisions
- [ ] **GitHub Pages Deployment** (+0.5): Deploy หน้าเว็บขึ้น GitHub Pages
- [ ] **Advanced Features** (+0.5): เช่น Dark Mode Toggle, Smooth Scrolling Animation, Form Validation

---

## ⏰ Deadline

**วันที่:** [วันที่กำหนด - ภายในสัปดาห์ที่ 2]  
**เวลา:** 23:59 น.  
**การส่งช้า:** หักคะแนน 10% ต่อวัน

---

## 💡 Tips for Success

1. **เริ่มเร็ว:** อย่ารอถึงนาทีสุดท้าย Requirements Engineering ต้องใช้เวลาคิด
2. **สื่อสารในทีม:** ใช้ Discord/Line/Slack ประสานงานบ่อยๆ
3. **Commit บ่อย:** อย่า commit ทีเดียวตอนจบ ให้ commit ทุกครั้งที่ทำอะไรเสร็จ
4. **ทดสอบบนหลายอุปกรณ์:** ลองเปิดหน้าเว็บบนมือถือ/แท็บเล็ต
5. **ขอ Feedback:** ให้เพื่อนหรืออาจารย์ช่วย Review ก่อนส่ง
6. **อ่าน Rubric ให้ดี:** เช็คว่าทำครบตามเกณฑ์การให้คะแนนหรือยัง

---

## 🆘 Need Help?

- **Office Hours:** [เวลาที่อาจารย์ให้คำปรึกษา]
- **Discord/Slack:** [ช่องทางติดต่อ]
- **Email:** [อีเมลอาจารย์]

**Resources:**
- [MDN Web Docs - HTML Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [CSS Tricks - Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [IEEE 830 Standard](https://standards.ieee.org/standard/830-1998.html)

---

## 📝 Reflection (Optional - Extra Learning)

หลังจบ Lab ให้แต่ละคนเขียน Reflection สั้นๆ (ไม่เกิน 1 หน้า):

1. **สิ่งที่เรียนรู้:** อะไรที่คุณเรียนรู้ใหม่จาก Lab นี้?
2. **ความท้าทาย:** อะไรที่ยากที่สุด? แก้อย่างไร?
3. **การปรับปรุง:** ถ้าทำใหม่ คุณจะทำอะไรต่างออกไป?
4. **การประยุกต์ใช้:** คุณจะเอาความรู้นี้ไปใช้ในโปรเจกต์จริงอย่างไร?

---

**สุดท้าย:** อย่าลืม **Have fun** ในการสร้างโปรเจกต์! 🎉  
นี่คือโอกาสในการสร้างสิ่งที่คุณสนใจและมีประโยชน์จริงๆ

**Good luck! 🚀**

---

**Instructor:** อาจารย์ธนิต เกตุแก้ว  
**Course:** ENGCE301 - Software Design and Development  
**Term Project:** Full-stack Web Application Development
