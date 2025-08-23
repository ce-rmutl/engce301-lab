# LAB-05: Software Architecture & High Level Design
## ระบบติดตาม Carbon Footprint - EcoTrack

**Course:** ENGCE301 - Software Design and Development  
**Week:** 5  
**Duration:** 1 สัปดาห์ (3 ชั่วโมงปฏิบัติการ)  
**Type:** กลุ่ม (3-4 คน)  

---

## 🎯 Learning Objectives

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:
1. **วิเคราะห์** และเลือก Architectural Pattern ที่เหมาะสมสำหรับ EcoTrack
2. **ออกแบบ** System Architecture Diagram ที่แสดงภาพรวมของระบบ
3. **จำแนก** System Components และ Interface ระหว่างส่วนต่างๆ
4. **ประยุกต์** หลักการ Separation of Concerns ในการออกแบบระบบ
5. **ใช้งาน** Draw.io ในการสร้าง Architecture และ Component Diagrams

## 📋 Prerequisites

- ความรู้พื้นฐาน UML จาก LAB-04
- เข้าใจ User Stories และ Requirements ของ EcoTrack
- ความรู้พื้นฐานเกี่ยวกับ Web Application Architecture
- บัญชี Draw.io หรือ Google Account สำหรับใช้ Draw.io

## 🛠️ Tools & Resources

- **UML Tool:** [Draw.io](https://draw.io) (ฟรี, ทำงานบน browser)
- **Reference:** EcoTrack SRS Document และ User Stories
- **Template:** Architecture Diagram Templates (จะแจกให้)
- **Submission:** Google Drive สำหรับส่งงาน

---

## 📚 Background Knowledge

### Architectural Patterns Overview

#### 1. Monolithic Architecture
```
┌─────────────────────────────────┐
│         EcoTrack App            │
│  ┌─────────────────────────────┐│
│  │    User Interface Layer     ││
│  ├─────────────────────────────┤│
│  │    Business Logic Layer     ││
│  ├─────────────────────────────┤│
│  │    Data Access Layer        ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │   Database   │
    └──────────────┘
```

**ข้อดี:** ง่ายต่อการพัฒนาและ deploy, เหมาะกับโปรเจกต์ขนาดเล็ก-กลาง  
**ข้อเสีย:** ขยายตัวยาก, การแก้ไขส่วนหนึ่งกระทบทั้งระบบ

#### 2. Client-Server Architecture
```
┌─────────────────┐         ┌─────────────────┐
│   Client Side   │         │   Server Side   │
│                 │         │                 │
│  React.js App   │◄──────►│   Express.js    │
│  (Frontend)     │  HTTP   │   (Backend)     │
│                 │ Request │                 │
└─────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    MongoDB      │
                            │   (Database)    │
                            └─────────────────┘
```

**ข้อดี:** แยกหน้าที่ชัดเจน, สามารถพัฒนาแยกกันได้, Scalable  
**ข้อเสีย:** ซับซ้อนกว่า Monolithic, ต้องจัดการ Network Communication

#### 3. Layered Architecture (N-Tier)
```
┌─────────────────────────────────┐
│     Presentation Layer          │ ← React.js Components
├─────────────────────────────────┤
│     Application Layer           │ ← Business Logic
├─────────────────────────────────┤
│     Domain Layer               │ ← Core Models & Rules
├─────────────────────────────────┤
│     Infrastructure Layer        │ ← Database, External APIs
└─────────────────────────────────┘
```

---

## 💻 Lab Activities

### Part 1: Architecture Analysis & Decision (45 นาที)

#### Activity 1.1: Requirements Review (15 นาที)

**ขั้นตอน:**
1. **อ่าน SRS Document** - ทบทวน Functional Requirements ของ EcoTrack
2. **วิเคราะห์ Non-Functional Requirements:**
   - Performance: รองรับ 1,000 users พร้อมกัน
   - Reliability: Uptime 99.5%
   - Scalability: ขยายเป็น 15,000 users ใน 3 ปี
   - Security: PDPA compliance, SSO integration
3. **สรุป Key Requirements** ที่ส่งผลต่อ Architecture Decision:

**Deliverable 1.1:** สร้างตาราง Requirements vs Architecture Impact
```markdown
| Requirement | Impact on Architecture | Priority |
|-------------|------------------------|----------|
| SSO Integration | ต้องมี Authentication Layer | High |
| 1,000 concurrent users | Load Balancing, Caching | High |
| Real-time Dashboard | WebSocket/Polling mechanism | Medium |
| Mobile + Web support | API-first approach | High |
| Offline capability | Client-side storage, Sync | Medium |
```

#### Activity 1.2: Architecture Pattern Selection (30 นาที)

**ขั้นตอน:**
1. **เปรียบเทียบ Architecture Patterns** สำหรับ EcoTrack:

| Criteria | Monolithic | Client-Server | Microservices |
|----------|------------|---------------|---------------|
| **Development Speed** | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Scalability** | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Team Size (3-4 คน)** | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Complexity** | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Maintenance** | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Deployment** | ⭐⭐⭐ | ⭐⭐ | ⭐ |

2. **Architecture Decision:** เลือก **Client-Server** เพราะ:
   - เหมาะกับทีมนักศึกษา 3-4 คน
   - รองรับ Mobile + Web
   - แยก Frontend/Backend ชัดเจน
   - พอดีกับ Timeline 1 เทอม

**Deliverable 1.2:** Architecture Decision Document (1 หน้า)

### Part 2: High-Level System Architecture Design (60 นาที)

#### Activity 2.1: System Context Diagram (20 นาที)

**เป้าหมาย:** แสดงภาพรวม EcoTrack และ External Systems

**ขั้นตอน:**
1. เปิด [Draw.io](https://draw.io)
2. เลือก Template: "Software Architecture"
3. สร้าง System Context Diagram:

```
     [นักศึกษา]     [บุคลากร]     [Admin]
          │              │           │
          └──────┬───────┘           │
                 │                   │
                 ▼                   ▼
     ┌─────────────────────────────────┐
     │         EcoTrack System         │
     │                                 │
     │  • Carbon Footprint Tracking   │
     │  • Gamification                 │
     │  • Reporting & Analytics        │
     │  • Goal Setting                 │
     └─────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   [University]   [TGO API]    [Email]
   [SSO System]   [Emission]   [Service]
                  [Factors]
```

**Deliverable 2.1:** System Context Diagram (Save เป็น PNG)

#### Activity 2.2: High-Level Architecture Diagram (40 นาที)

**เป้าหมาย:** แสดงโครงสร้างหลักของระบบ

**ขั้นตอน:**
1. ออกแบบ 3-Tier Architecture สำหรับ EcoTrack:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT TIER                          │
├─────────────────────┬───────────────────────────────────┤
│    Web Application  │         Mobile App                │
│                     │                                   │
│    • React.js       │    • React Native                 │
│    • Progressive    │      (Future Phase)               │
│      Web App        │                                   │
│    • Responsive UI  │    • Native Features              │
└─────────────────────┴───────────────────────────────────┘
                                 │
                                 │ HTTPS/REST API
                                 ▼
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION TIER                        │
├─────────────────────────────────────────────────────────┤
│              Node.js + Express.js Server               │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Authentication  │  │  Carbon Calc    │             │
│  │ & Authorization │  │     Engine      │             │
│  │                 │  │                 │             │
│  │ • JWT Tokens    │  │ • Emission      │             │
│  │ • SSO Integration│  │   Factors       │             │
│  │ • Role Management│  │ • CO2e Calc     │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Gamification    │  │ Reporting &     │             │
│  │    Engine       │  │  Analytics      │             │
│  │                 │  │                 │             │
│  │ • Points System │  │ • Dashboard     │             │
│  │ • Badges        │  │ • Charts        │             │
│  │ • Leaderboard   │  │ • Export        │             │
│  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA TIER                            │
├─────────────────────────────────────────────────────────┤
│              MongoDB Database                           │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │   Users     │ │ Activities  │ │   Reports   │      │
│  │ Collection  │ │ Collection  │ │ Collection  │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │  Badges     │ │  Settings   │ │   Logs      │      │
│  │ Collection  │ │ Collection  │ │ Collection  │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

```
// เพิ่มใน Activity 2.2: Security Architecture Layer

const SECURITY_ARCHITECTURE = {
  // Authentication Layer
  AUTHENTICATION: {
    PRIMARY: 'University SSO (SAML 2.0/OAuth 2.0)',
    FALLBACK: 'JWT Token-based authentication',
    SESSION_TIMEOUT: '30 minutes of inactivity',
    MFA: 'Optional for admin accounts'
  },

  // Authorization Matrix
  AUTHORIZATION: {
    STUDENT: ['read_own_data', 'create_activities', 'view_leaderboard'],
    STAFF: ['read_own_data', 'create_activities', 'view_leaderboard', 'export_own_reports'],
    ADMIN: ['read_all_data', 'manage_users', 'system_config', 'export_all_data'],
    SUPER_ADMIN: ['full_access']
  },

  // Data Protection
  DATA_SECURITY: {
    ENCRYPTION_AT_REST: 'AES-256 for PII data',
    ENCRYPTION_IN_TRANSIT: 'TLS 1.3 for all connections',
    PII_FIELDS: ['email', 'full_name', 'student_id'],
    ANONYMIZATION: 'Hash user IDs for leaderboard display',
    RETENTION: 'Personal data kept for 7 years, aggregated data indefinitely'
  },

  // API Security
  API_SECURITY: {
    RATE_LIMITING: '100 requests per minute per user',
    CORS: 'Restricted to university domains',
    INPUT_VALIDATION: 'Server-side validation for all inputs',
    SQL_INJECTION: 'Parameterized queries only',
    XSS_PROTECTION: 'Content Security Policy + input sanitization'
  }
};
```

2. **เพิ่ม External Integrations:**
   - University SSO (ซ้าย)
   - TGO Emission Factors API (ขวา)
   - Email Notification Service (ล่าง)

**Deliverable 2.2:** High-Level Architecture Diagram

### Part 3: Component Design & Interface Specification (75 นาที)

#### Activity 3.1: Component Breakdown (30 นาที)

**เป้าหมาย:** แยกระบบเป็น Components และกำหนด Responsibilities

**ขั้นตอน:**
1. **Frontend Components:**
   ```
   EcoTrack Frontend
   ├── Authentication
   │   ├── LoginComponent
   │   ├── ProfileComponent
   │   └── ProtectedRoute
   ├── Dashboard
   │   ├── CarbonSummaryWidget
   │   ├── ChartsWidget
   │   └── QuickActionsWidget
   ├── ActivityLogging
   │   ├── TransportForm
   │   ├── EnergyForm
   │   └── WasteForm
   ├── Reports
   │   ├── MonthlyReport
   │   ├── ComparisonView
   │   └── ExportFeature
   ├── Gamification
   │   ├── PointsDisplay
   │   ├── BadgeCollection
   │   └── Leaderboard
   └── Admin
       ├── UserManagement
       ├── SystemDashboard
       └── ReportsExport
   ```

2. **Backend Components:**
   ```
   EcoTrack Backend
   ├── Authentication Service
   ├── User Management Service
   ├── Activity Logging Service
   ├── Carbon Calculation Engine
   ├── Gamification Service
   ├── Reporting Service
   ├── Admin Service
   └── External Integration
       ├── SSO Connector
       ├── Email Service
       └── TGO API Client
   ```

**Deliverable 3.1:** Component Hierarchy Diagram

#### Activity 3.2: API Interface Design (25 นาที)

**เป้าหมาย:** กำหนด RESTful API Endpoints

**หลักการ REST API Design:**
- GET: ดึงข้อมูล
- POST: สร้างข้อมูลใหม่
- PUT: อัพเดทข้อมูลทั้งหมด
- DELETE: ลบข้อมูล
- ใช้ HTTP Status Codes ที่เหมาะสม

**API Endpoints สำหรับ EcoTrack:**
```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
PUT    /api/auth/profile

Activity Management:
GET    /api/activities              # ดึงกิจกรรมทั้งหมดของ user
POST   /api/activities              # บันทึกกิจกรรมใหม่
PUT    /api/activities/:id          # แก้ไขกิจกรรม
DELETE /api/activities/:id          # ลบกิจกรรม

Carbon Calculation:
GET    /api/carbon/footprint        # คำนวณ carbon footprint
GET    /api/carbon/summary/:period  # สรุปตามช่วงเวลา
GET    /api/emission-factors        # ดึง emission factors

Gamification:
GET    /api/gamification/points     # ดูคะแนนปัจจุบัน
GET    /api/gamification/badges     # ดู badges ที่ได้
GET    /api/gamification/leaderboard # ดูอันดับ

Reports:
GET    /api/reports/monthly/:month  # รายงานรายเดือน
GET    /api/reports/comparison      # เปรียบเทียบ
POST   /api/reports/export          # ส่งออกรายงาน

Admin (Protected):
GET    /api/admin/dashboard         # Admin dashboard data
GET    /api/admin/users             # จัดการผู้ใช้
GET    /api/admin/reports/university # รายงานมหาวิทยาลัย
```
```
// เพิ่มใน Activity 3.2: API Interface Design
/**
 * Complete EcoTrack API Specification
 * Base URL: https://api.ecotrack.university.ac.th/v1
 */

const API_ENDPOINTS = {
  // Authentication & User Management
  AUTH: {
    LOGIN: 'POST /auth/login',
    LOGOUT: 'POST /auth/logout', 
    REFRESH: 'POST /auth/refresh',
    PROFILE: 'GET /auth/profile',
    UPDATE_PROFILE: 'PUT /auth/profile'
  },

  // Activity Management (Core Feature)
  ACTIVITIES: {
    LIST: 'GET /activities?page=1&limit=20&type=transport&date_from=2024-01-01',
    CREATE: 'POST /activities',
    GET_BY_ID: 'GET /activities/:id',
    UPDATE: 'PUT /activities/:id',
    DELETE: 'DELETE /activities/:id',
    BULK_CREATE: 'POST /activities/bulk' // สำหรับ import data
  },

  // Carbon Calculation Engine
  CARBON: {
    CALCULATE: 'POST /carbon/calculate', // Real-time calculation
    FOOTPRINT: 'GET /carbon/footprint?period=month&year=2024',
    SUMMARY: 'GET /carbon/summary/:period', // today/week/month/year
    TRENDS: 'GET /carbon/trends?months=6',
    COMPARISON: 'GET /carbon/comparison?compare_to=faculty_average',
    FACTORS: 'GET /carbon/emission-factors' // TGO emission factors
  },

  // Gamification System
  GAMIFICATION: {
    POINTS: 'GET /gamification/points/current',
    POINTS_HISTORY: 'GET /gamification/points/history?limit=50',
    BADGES: 'GET /gamification/badges/earned',
    BADGES_AVAILABLE: 'GET /gamification/badges/available',
    LEADERBOARD: 'GET /gamification/leaderboard?scope=faculty&limit=100',
    ACHIEVEMENTS: 'GET /gamification/achievements'
  },

  // Goal Management
  GOALS: {
    LIST: 'GET /goals',
    CREATE: 'POST /goals',
    UPDATE: 'PUT /goals/:id',
    PROGRESS: 'GET /goals/:id/progress'
  },

  // Reporting System
  REPORTS: {
    MONTHLY: 'GET /reports/monthly/:year/:month',
    CUSTOM: 'POST /reports/custom', // Custom date range
    EXPORT: 'POST /reports/export', // PDF/CSV export
    COMPARISON: 'GET /reports/comparison?user_id=123&compare_to=faculty',
    UNIVERSITY: 'GET /reports/university' // Admin only
  },

  // Admin & Management
  ADMIN: {
    DASHBOARD: 'GET /admin/dashboard/stats',
    USERS: 'GET /admin/users?page=1&search=john',
    USER_DETAIL: 'GET /admin/users/:id',
    SYSTEM_STATS: 'GET /admin/system/stats',
    EMISSION_FACTORS: 'PUT /admin/emission-factors', // Update factors
    BULK_IMPORT: 'POST /admin/bulk-import', // Import user data
    EXPORT_ALL: 'GET /admin/export/all-data'
  },

  // External Integrations
  EXTERNAL: {
    SSO_LOGIN: 'GET /external/sso/login?provider=university',
    SSO_CALLBACK: 'GET /external/sso/callback',
    TGO_SYNC: 'POST /external/tgo/sync-factors', // Admin only
    EMAIL_TEST: 'POST /external/email/test' // Test email service
  }
};

// API Response Formats
const API_RESPONSES = {
  // Standard Success Response
  SUCCESS: {
    status: 'success',
    data: {}, // Response data
    meta: {    // Pagination, etc.
      page: 1,
      per_page: 20,
      total: 100,
      total_pages: 5
    }
  },

  // Standard Error Response  
  ERROR: {
    status: 'error',
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      details: {
        field_name: ['Error message']
      }
    }
  },

  // Example Activity Response
  ACTIVITY_EXAMPLE: {
    status: 'success',
    data: {
      id: 'act_123456',
      type: 'transport',
      sub_type: 'bts',
      title: 'BTS to University',
      description: 'Daily commute using BTS',
      date: '2024-03-15',
      distance: 15.5,
      co2e_calculated: 0.31,
      points_earned: 25,
      created_at: '2024-03-15T08:30:00Z',
      updated_at: '2024-03-15T08:30:00Z',
      metadata: {
        route: 'Saphan Phong to Mo Chit',
        duration_minutes: 35,
        cost: 42
      }
    }
  }
};

// HTTP Status Codes Usage
const STATUS_CODES = {
  200: 'OK - Success',
  201: 'Created - Resource created successfully', 
  400: 'Bad Request - Invalid input',
  401: 'Unauthorized - Authentication required',
  403: 'Forbidden - Insufficient permissions',
  404: 'Not Found - Resource not found',
  422: 'Unprocessable Entity - Validation errors',
  429: 'Too Many Requests - Rate limit exceeded',
  500: 'Internal Server Error - Server error'
};
```

**Deliverable 3.2:** API Interface Documentation

#### Activity 3.3: Data Flow Diagram (20 นาที)

**เป้าหมาย:** แสดงการไหลของข้อมูลในระบบ

**ขั้นตอน:**
สร้าง Data Flow Diagram สำหรับ Use Case หลัก:

**Example: "บันทึกการเดินทาง" Data Flow**
```
[User] → [Transport Form] → [Activity API] → [Carbon Engine] → [Database]
                                  │                │
                                  ▼                ▼
                            [Gamification] → [Points Update]
                                  │
                                  ▼
                            [Dashboard Update]
```

**Deliverable 3.3:** Data Flow Diagrams สำหรับ 3 Use Cases หลัก

---

## 📤 Deliverables

### ไฟล์ที่ต้องส่ง:

1. **Architecture_Decision.pdf** (1-2 หน้า)
   - Requirements Analysis Table
   - Architecture Pattern Comparison
   - Decision และเหตุผล

2. **System_Context_Diagram.png**
   - ภาพรวมระบบและ External Systems

3. **High_Level_Architecture_Diagram.png**
   - 3-Tier Architecture แบบละเอียด

4. **Component_Hierarchy.png**
   - Frontend และ Backend Components

5. **API_Interface_Specification.md**
   - RESTful API Endpoints พร้อมคำอธิบาย

6. **Data_Flow_Diagrams.png**
   - DFD สำหรับ 3 Use Cases หลัก

### การส่งงาน:
- **สร้างโฟลเดอร์:** `LAB05_ArchitectureDesign_GroupX`
- **อัพโหลดใน Google Drive** ตาม link ที่แจก
- **Deadline:** วันศุกร์ สัปดาห์ที่ 5 เวลา 23:59 น.

---

## 🏆 Grading Rubric (100 คะแนน)

| หัวข้อ | คะแนน | เกณฑ์การให้คะแนน |
|--------|-------|------------------|
| **Architecture Decision** | 20 | ถูกต้อง มีเหตุผล เหมาะกับ Context (15-20), พอใช้ (10-14), ผิด/ไม่ครบ (0-9) |
| **System Context Diagram** | 15 | ครบถ้วน ชัดเจน (12-15), พอใช้ (8-11), ไม่ครบ (0-7) |
| **High-Level Architecture** | 25 | สมบูรณ์ ถูกหลักการ (20-25), ขาดบางส่วน (15-19), ผิด/ไม่ครบ (0-14) |
| **Component Design** | 15 | แยกหน้าที่ชัดเจน (12-15), พอใช้ (8-11), ไม่ชัดเจน (0-7) |
| **API Interface** | 15 | ถูก REST principles (12-15), มีข้อผิดพลาด (8-11), ผิดหลักการ (0-7) |
| **Data Flow Diagrams** | 10 | ตรงตาม Use Cases (8-10), ขาดบางส่วน (5-7), ไม่ถูกต้อง (0-4) |

**Bonus:** +5 คะแนน หากมีการคิด Security Architecture หรือ Scalability Strategy

---

## 🔗 Resources & References

**Documentation:**
- [EcoTrack SRS Document](./docs/SRS_EcoTrack.pdf)
- [User Stories ของ EcoTrack](./docs/User_Stories.md)

**Tools:**
- [Draw.io Tutorial](https://www.youtube.com/watch?v=Z0D96ZikMkc)
- [REST API Design Guide](https://restfulapi.net/)

**Architecture References:**
- [Microsoft Application Architecture Guide](https://docs.microsoft.com/en-us/dotnet/architecture/)
- [3-Tier Architecture Best Practices](https://www.guru99.com/what-is-difference-between-two-tier-and-three-tier-architecture.html)

**Templates:**
- [Architecture Diagram Templates](./templates/architecture_templates.drawio)

---

## 🤝 Team Work Guidelines

**การแบ่งงาน (แนะนำ):**
- **คน A:** Architecture Decision + System Context
- **คน B:** High-Level Architecture + Component Design  
- **คน C:** API Interface + Data Flow Diagrams
- **คน D:** Integration + Documentation + Review

**การทำงานร่วมกัน:**
- ใช้ Google Drive สำหรับแชร์ไฟล์
- Daily standup 15 นาที (ออนไลน์/ออฟไลน์)
- Review งานของกันและกันก่อนส่ง

**Success Tips:**
- อ่าน SRS ให้เข้าใจก่อนเริ่มออกแบบ
- เริ่มจาก Simple Architecture ก่อน
- ใช้ Standard Notations และ Conventions
- ถาม TA หรืออาจารย์เมื่อสงสัย

---

**Next Week:** LAB-06 จะใช้ Architecture ที่ออกแบบในสัปดาห์นี้เป็นพื้นฐานสำหรับการออกแบบ React Components ในระดับ Low-Level Design

**Ready to architect amazing software? Let's design! 🏗️**

---
