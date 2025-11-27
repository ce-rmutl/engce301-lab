# 🔄 ลำดับขั้นตอน: User Stories → SRS

## Requirements Engineering Process - Step by Step

---

## ✅ คำตอบคำถาม: "ต้องทำ User Stories ก่อน SRS ใช่ไหม?"

### 🎯 **ใช่! ควรทำ User Stories (หรือเทคนิค Elicitation อื่นๆ) ก่อนเขียน SRS**

---

## 📋 ขั้นตอนที่ถูกต้อง (5 ขั้นตอนหลัก)

```
📍 ขั้นตอนที่ 1: ELICITATION (ค้นหาความต้องการ)
   ├─ Stakeholder Analysis
   ├─ User Interview / Observation
   ├─ User Stories ⭐ (ตรงนี้!)
   ├─ Use Cases
   ├─ Brainstorming
   └─ Prototyping
   ↓
   
📍 ขั้นตอนที่ 2: ANALYSIS (วิเคราะห์)
   ├─ จัดหมวดหมู่ Requirements
   ├─ แยก Functional vs Non-Functional
   ├─ ตรวจสอบความสมบูรณ์
   ├─ แก้ไขความขัดแย้ง
   └─ Prioritization (MoSCoW)
   ↓
   
📍 ขั้นตอนที่ 3: SPECIFICATION (เขียนเอกสาร)
   └─ SRS Document ⭐ (ตรงนี้!)
   ↓
   
📍 ขั้นตอนที่ 4: VALIDATION (ตรวจสอบ)
   ├─ Review กับ Stakeholders
   ├─ Walkthrough
   └─ Approval
   ↓
   
📍 ขั้นตอนที่ 5: MANAGEMENT (จัดการ)
   ├─ Version Control
   ├─ Change Management
   └─ Traceability
```

---

## 🔄 ความสัมพันธ์: User Stories ↔ SRS

### User Stories = **INPUT** (เอาไว้ทำก่อน)
- เป็นเครื่องมือในการ **Elicitation**
- เขียนในภาษาของผู้ใช้
- Format ง่าย: "As a..., I want..., So that..."
- ไม่เป็นทางการ (Informal)

### SRS = **OUTPUT** (ได้จาก User Stories)
- เป็นเอกสาร **Formal Specification**
- เขียนในภาษาทางการ
- มีโครงสร้างชัดเจน (IEEE 830)
- เป็นทางการ (Formal)

---

## 📊 ตารางเปรียบเทียบ: User Stories vs Functional Requirements

| Aspect | User Story | Functional Requirement (FR) |
|--------|------------|----------------------------|
| **วัตถุประสงค์** | ค้นหาความต้องการ | ระบุความต้องการอย่างเป็นทางการ |
| **ผู้อ่าน** | ทุกคน (รวม Non-technical) | ทีมพัฒนา, Stakeholders |
| **ภาษา** | ภาษาธรรมดา ง่ายๆ | ภาษาเทคนิค มีรายละเอียด |
| **รูปแบบ** | As a..., I want..., So that... | ID, Description, Input, Output, Priority |
| **ระดับรายละเอียด** | High-level | Detailed |
| **ตัวอย่าง** | US-010: จองที่จอดล่วงหน้า | FR-010: ผู้ใช้สามารถจองที่จอดล่วงหน้าได้ 15 นาที - 24 ชั่วโมง พร้อม Input/Output ชัดเจน |

---

## 🔍 ตัวอย่างการแปลง: User Story → FR

### ตัวอย่างที่ 1: Authentication

#### 📝 User Story (US-001):
```
As a Guest
I want to register with Email and Password
So that I can use the system and book parking spots

Acceptance Criteria:
- Email must be valid format
- Password minimum 8 characters
- Must enter name and phone number
- System sends verification email
- Must verify email before using system
```

#### ⬇️ แปลงเป็น

#### 📋 Functional Requirement (FR-001):
```
ID: FR-001
Description: ผู้ใช้สามารถลงทะเบียนด้วย Email และ Password

Input:
- Email (format: xxx@xxx.xxx)
- Password (minimum 8 characters)
- Full Name
- Phone Number

Process:
1. Validate email format
2. Check email not duplicated
3. Hash password with bcrypt
4. Create user account
5. Send verification email

Output:
- Account created successfully
- Verification email sent
- User redirected to verification page

Priority: Must Have
Dependencies: -
```

**สังเกต:**
- US → ภาษาง่าย "I want to register"
- FR → ละเอียด "Process: 1. Validate, 2. Check, 3. Hash..."

---

### ตัวอย่างที่ 2: Parking Reservation

#### 📝 User Story (US-010):
```
As a Registered User
I want to reserve a parking spot in advance
So that I'm sure there will be a spot waiting for me

Acceptance Criteria:
- Select parking slot on floor plan
- Choose date and time (Check-in, Check-out)
- Can book 15 min - 24 hours in advance
- Receive Booking Code and QR Code
- Slot status changes to "Reserved"
```

#### ⬇️ แปลงเป็น

#### 📋 Functional Requirement (FR-010):
```
ID: FR-010
Description: ผู้ใช้สามารถจองที่จอดล่วงหน้าได้

Input:
- Parking Lot ID
- Parking Slot Number
- Check-in DateTime (15 min - 24 hours ahead)
- Check-out DateTime
- Vehicle License Plate

Process:
1. Validate booking time (must be 15 min - 24 hours ahead)
2. Check slot availability in time range
3. Calculate parking fee
4. Lock parking slot (status = "Reserved")
5. Generate Booking Code (8-digit alphanumeric)
6. Generate QR Code
7. Save booking record
8. Send confirmation (Email + Line Notify)

Output:
- Booking successful
- Booking Code: XXXX-XXXX
- QR Code (Base64 image)
- Confirmation Email/Notification
- Slot status updated to "Reserved"

Priority: Must Have
Dependencies: FR-003 (Login), FR-008 (Real-time status)

Constraints:
- Maximum 1 active booking per user
- Cannot book if slot already reserved
```

**สังเกต:**
- US → "I want to reserve" (ภาษาธรรมดา)
- FR → มี Process 8 ขั้นตอน, มี Dependencies, มี Constraints

---

### ตัวอย่างที่ 3: Real-time Status

#### 📝 User Story (US-008):
```
As a Registered User
I want to see parking floor plan with real-time slot status
So that I can choose my preferred spot before arriving

Acceptance Criteria:
- See floor plan of each floor/zone
- Color-coded slots:
  • Green = Available
  • Red = Occupied
  • Yellow = Reserved
- Status updates every 30 seconds
- Can filter by vehicle type
```

#### ⬇️ แปลงเป็น

#### 📋 Functional Requirement (FR-008):
```
ID: FR-008
Description: แสดงแผนผังลานจอดพร้อมสถานะแต่ละช่อง Real-time

Input:
- Parking Lot ID
- Floor/Zone selection
- (Optional) Vehicle Type Filter

Process:
1. Load parking lot floor plan from Database
2. Fetch current slot status from Parking Sensor API
3. Map status to slots:
   - "available" → Green (#4CAF50)
   - "occupied" → Red (#F44336)
   - "reserved" → Yellow (#FFC107)
4. Establish WebSocket connection for real-time updates
5. Update display every 30 seconds automatically
6. Apply vehicle type filter if selected

Output:
- Interactive floor plan (SVG/Canvas)
- Color-coded parking slots
- Slot details on click (Slot ID, Type, Status)
- Real-time status updates (via WebSocket)

Priority: Must Have
Dependencies: 
- Parking Sensor API
- WebSocket Server
- FR-006 (Parking Search)

Performance Requirements:
- Initial load < 2 seconds (NFR-001)
- Update interval: 30 seconds (NFR-002)
- Support 500 concurrent users (NFR-003)
```

**สังเกต:**
- US → "Color-coded slots" (อธิบายแบบง่าย)
- FR → ระบุสีชัดเจน (#4CAF50), ระบุเทคโนโลยี (WebSocket, SVG/Canvas)

---

## 💡 สกัด NFR จาก User Stories

User Stories บางตัวมี **Implicit Requirements** ที่เป็น NFR:

### ตัวอย่าง:

#### User Story (US-008):
```
Acceptance Criteria:
- Status updates every 30 seconds ⭐
```

#### ⬇️ สกัดเป็น NFR:

```
NFR-002: Real-time Update Performance
Description: สถานะที่จอดต้องอัพเดทภายใน 30 วินาที
Measurement: Monitor WebSocket update interval
Priority: Must Have
Category: Performance
```

---

#### User Story (US-001):
```
Acceptance Criteria:
- Password minimum 8 characters ⭐
- System sends verification email ⭐
```

#### ⬇️ สกัดเป็น NFR:

```
NFR-013: Password Security
Description: รหัสผ่านต้อง Hash ด้วย bcrypt (Cost Factor 10+)
Measurement: Code Review
Priority: Must Have
Category: Security

NFR-014: Email Delivery
Description: Verification Email ต้องส่งภายใน 1 นาที
Measurement: Monitor Email Queue
Priority: Must Have
Category: Reliability
```

---

## 📖 ตัวอย่างจาก LAB 02 - ParkEasy

### ขั้นตอนที่ทำมา:

```
Week 2 - Part 1: Requirements Elicitation (45 min)
├─ Activity 1.1: Brainstorming & Stakeholder Analysis
│  └─ Output: Stakeholder Table
│
└─ Activity 1.2: User Interview
   └─ Output: Interview Notes, Pain Points

        ⬇️ (ควรเพิ่มขั้นตอนนี้)

        📝 WRITE USER STORIES ⭐
        └─ Output: 20 User Stories (แบ่งเป็น 8 Epics)

        ⬇️

Week 2 - Part 2: Requirements Analysis & Specification (45 min)
├─ Activity 2.1: Categorize Requirements (FR vs NFR)
│  └─ Input: User Stories
│  └─ Output: FR List (28 items), NFR List (26 items)
│
└─ Activity 2.2: Draft SRS Document
   └─ Input: FR/NFR Lists
   └─ Output: SRS Document (IEEE 830 format)
```

---

## ⚠️ ข้อผิดพลาดที่พบบ่อย

### ❌ ผิด: ข้ามไปเขียน SRS เลย
```
User Interview → SRS Document
```
**ปัญหา:**
- ขาดขั้นตอน Analysis
- FR/NFR อาจไม่ครบ
- ยากต่อการ Validate

### ✅ ถูก: ทำตามขั้นตอน
```
User Interview → User Stories → Analysis → SRS Document
```
**ข้อดี:**
- User Stories เป็นสะพานเชื่อม Interview → SRS
- ง่ายต่อการ Review กับ Stakeholders
- Analysis ได้ครบถ้วน

---

## 🎯 Best Practices

### 1. เขียน User Stories ก่อน
```
✅ Do:
1. Stakeholder Analysis
2. User Interview
3. Write User Stories (20-30 stories)
4. Group into Epics
5. Prioritize (MoSCoW)
6. Convert to FR/NFR
7. Write SRS
```

### 2. ใช้ Acceptance Criteria ให้เป็นประโยชน์
```
✅ Acceptance Criteria ที่ดี:
- เขียนเป็น Checklist ชัดเจน
- Testable (ทดสอบได้)
- ครอบคลุม Happy Path & Edge Cases
- สกัดเป็น NFR ได้
```

### 3. Traceability Matrix
```
US-001 → FR-001 (ลงทะเบียนด้วย Email)
US-002 → FR-002 (ลงทะเบียนด้วย Social)
US-003 → FR-003 (Login)
...
```

---

## 📊 Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                  Requirements Engineering                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. ELICITATION                                              │
│                                                              │
│ Stakeholder Analysis → User Interview → Brainstorming       │
│                            ↓                                 │
│                    🌟 USER STORIES 🌟                        │
│                   (20-30 stories)                           │
│                                                              │
│ Format:                                                      │
│ • As a [role]                                               │
│ • I want [feature]                                          │
│ • So that [benefit]                                         │
│ • Acceptance Criteria (3-7 items)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ANALYSIS                                                 │
│                                                              │
│ Group User Stories → Extract FR & NFR                       │
│                                                              │
│ US-001 → FR-001 (ลงทะเบียนด้วย Email)                      │
│ US-008 → FR-008 (Real-time status)                          │
│        → NFR-002 (Update every 30 sec)                      │
│                                                              │
│ Prioritize (MoSCoW)                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SPECIFICATION                                            │
│                                                              │
│                    🌟 SRS DOCUMENT 🌟                        │
│                   (IEEE 830 Standard)                       │
│                                                              │
│ Section 1: Introduction                                     │
│ Section 2: Overall Description                              │
│ Section 3: Specific Requirements                            │
│   ├─ 3.1 Functional Requirements (28 FRs)                  │
│   │   ├─ FR-001: Register with Email                       │
│   │   │   ├─ ID, Description                               │
│   │   │   ├─ Input, Output                                 │
│   │   │   ├─ Priority, Dependencies                        │
│   │   │   └─ (มาจาก US-001)                                │
│   │   └─ ...                                                │
│   │                                                          │
│   └─ 3.2 Non-Functional Requirements (26 NFRs)             │
│       ├─ NFR-001: Response Time < 2s                        │
│       ├─ NFR-002: Update every 30s                          │
│       └─ ...                                                 │
│                                                              │
│ Section 4: Appendices                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. VALIDATION                                               │
│                                                              │
│ Review SRS with Stakeholders → Approval                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 สรุปสำหรับนักศึกษา

### คำตอบคำถาม: "ต้องทำ User Stories ก่อน SRS ใช่ไหม?"

✅ **ใช่!** ควรทำ User Stories ก่อน เพราะ:

1. **User Stories เป็น Input** → ช่วยให้เขียน FR/NFR ได้ครบถ้วน
2. **ง่ายต่อการสื่อสาร** → Stakeholders เข้าใจได้ง่าย
3. **เป็น Bridge** → เชื่อม User Interview กับ SRS Document
4. **Testable** → Acceptance Criteria ใช้เป็น Test Cases ได้

### ลำดับที่ถูกต้อง:
```
Stakeholder Analysis
    ↓
User Interview
    ↓
🌟 USER STORIES 🌟
    ↓
Analysis (FR/NFR)
    ↓
🌟 SRS DOCUMENT 🌟
    ↓
Validation
```

---

## 📁 ไฟล์ที่ได้

1. ✅ **ParkEasy_User_Stories.md** - 20 User Stories ครบ 8 Epics
2. ✅ **SRS_ParkEasy_Example.docx** - SRS Document ที่มาจาก User Stories
3. ✅ **Process_Comparison.md** - ไฟล์นี้ (อธิบายขั้นตอน)

---

**สรุป:** 
- User Stories = **ต้นทาง** (ทำก่อน)
- SRS Document = **ปลายทาง** (ได้จาก User Stories)

**อย่าลืม:** ไม่มี User Stories = เขียน SRS ได้ไม่ครบ! 📝✨

---

**จัดทำโดย:** อาจารย์ธนิต เกตุแก้ว  
**Course:** ENGCE301 - Software Design and Development  
**Date:** 27 พฤศจิกายน 2024
