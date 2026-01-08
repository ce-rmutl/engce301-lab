# 📚 ENGCE301: การออกแบบและพัฒนาซอฟต์แวร์
## Software Design and Development

---

# 📅 สัปดาห์ที่ 7
## Backend & API Design + SQLite Integration

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🗄️  Backend & API Design                                       ║
║                           +                                      ║
║   💾 SQLite Database Integration                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📋 หน่วยเรียนและวัตถุประสงค์

### หน่วยเรียนที่ 7: Backend & API Design + SQLite Integration

#### ชื่อบทเรียน:
- **7.1** หลักการออกแบบ RESTful API
- **7.2** Data Modelling และ ER Diagram  
- **7.3** SQLite และการเชื่อมต่อกับ Express
- **7.4** การแบ่งเลเยอร์โค้ด (Layered Architecture)

#### วัตถุประสงค์การสอน:
- **7.1.1** อธิบายหลักการออกแบบ RESTful API ตาม REST Principles ได้
- **7.1.2** ออกแบบ API Endpoints ตาม Resources และ HTTP Methods ที่เหมาะสมได้
- **7.2.1** สร้าง ER Diagram จาก Requirements ของระบบได้
- **7.2.2** แปลง ER Diagram เป็น Database Tables ได้
- **7.3.1** เปรียบเทียบข้อดี-ข้อเสียระหว่าง JSON file และ SQLite ได้
- **7.3.2** เชื่อมต่อ Express กับ SQLite และทำ CRUD Operations ได้
- **7.4.1** อธิบายบทบาทของแต่ละเลเยอร์ (Router, Controller, Service, Database) ได้
- **7.4.2** จัดโครงสร้างโค้ด Backend ตาม Layered Architecture ได้

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 CLO ที่เกี่ยวข้อง: CLO2, CLO3, CLO4, CLO5                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 ทบทวนเนื้อหาสัปดาห์ที่ผ่านมา

```
╔════════════════════════════════════════════════════════════════╗
║  📖 สัปดาห์ที่ 6: Software Architecture + Node.js/Express          ║
╚════════════════════════════════════════════════════════════════╝
```

ในสัปดาห์ที่ 6 เราได้เรียนรู้เกี่ยวกับ **Software Architecture** และการสร้าง **Backend API ด้วย Node.js/Express** โดยใช้ **JSON file** เป็นที่เก็บข้อมูล หัวข้อสำคัญได้แก่:

- ✅ **รูปแบบสถาปัตยกรรมซอฟต์แวร์**: Monolithic, Client-Server, และ Microservices
- ✅ **Design Patterns เบื้องต้น**: Layered Architecture และ MVC Pattern
- ✅ **Node.js และ Express**: การสร้าง Server และกำหนด Routes
- ✅ **JSON File Operations**: การอ่านและเขียนข้อมูลด้วย fs module
- ✅ **RESTful Routes**: GET, POST, PUT, DELETE สำหรับ CRUD operations

```
    Week 6: JSON File          →       Week 7: SQLite Database
    ┌─────────────────┐                ┌─────────────────┐
    │   data.json     │                │   database.db   │
    │   (Text File)   │       →        │  (Structured)   │
    │   Simple CRUD   │                │  SQL Queries    │
    └─────────────────┘                └─────────────────┘
```

> 💡 **สัปดาห์นี้** เราจะพัฒนาต่อยอดโดยเรียนรู้:
> - หลักการออกแบบ API ที่ดีตามมาตรฐาน REST
> - การออกแบบ Database ด้วย ER Diagram
> - การเปลี่ยนจาก JSON file เป็น SQLite Database ที่มีโครงสร้างและประสิทธิภาพดีกว่า

---

## 7.1 หลักการออกแบบ RESTful API

```
╔═══════════════════════════════════════════════════════════════╗
║  🌐 RESTful API Design Principles                             ║
╚═══════════════════════════════════════════════════════════════╝
```

### 7.1.1 REST คืออะไร?

```
┌──────────────────────────────────────────────────────────────┐
│             REST (REpresentational State Transfer)           │
│                                                              │
│  "An architectural style for designing networked             │
│   applications"                                              │
│                                                              │
│  ไม่ใช่ Protocol แต่เป็น Design Philosophy! ✨                   │
└──────────────────────────────────────────────────────────────┘
```

**REST** ย่อมาจาก **Representational State Transfer** เป็นรูปแบบการออกแบบ (Architectural Style) สำหรับระบบ Distributed Hypermedia โดยเฉพาะ Web Services

#### 🎯 หลักการ 6 ประการของ REST:

```
┌─────────────────────────────────────────────────────────────┐
│  1️⃣ Client-Server Architecture                              │
│     แยก Client และ Server ออกจากกัน                          │
│                                                             │
│  2️⃣ Stateless                                               │
│     แต่ละ Request ต้องมีข้อมูลครบถ้วน (ไม่เก็บ Session)             │
│                                                             │
│  3️⃣ Cacheable                                               │
│     Response ควรระบุว่า Cache ได้หรือไม่                         │
│                                                             │
│  4️⃣ Uniform Interface                                       │
│     มีรูปแบบการใช้งานที่เป็นมาตรฐานเดียวกัน                         │
│                                                             │
│  5️⃣ Layered System                                          │
│     สามารถมีชั้นกลาง (Proxy, Gateway) ได้                       │
│                                                             │
│  6️⃣ Code on Demand (Optional)                               │
│     Server สามารถส่ง Code (JS) ให้ Client รันได้                │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.1.2 RESTful API Design: Resources

```
┌──────────────────────────────────────────────────────────────┐
│               RESOURCE-BASED API DESIGN                      │
│                                                              │
│   Everything is a RESOURCE! 🎯                               │
│                                                              │
│   Resource = สิ่งที่เราต้องการจัดการ (Entity/Object)               │
│                                                              │
│   ตัวอย่าง Resources:                                          │
│   • Users                                                    │
│   • Products                                                 │
│   • Orders                                                   │
│   • Posts                                                    │
│   • Comments                                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 📌 หลักการตั้งชื่อ Resource:

| หลักการ | ❌ ไม่ดี | ✅ ดี |
|---------|---------|-------|
| **ใช้คำนาม ไม่ใช้คำกริยา** | `/getUsers` | `/users` |
| **ใช้พหูพจน์** | `/user` | `/users` |
| **ใช้ตัวพิมพ์เล็ก** | `/Users` | `/users` |
| **ใช้ขีด - แทนขีดล่าง** | `/user_profiles` | `/user-profiles` |
| **ไม่ลงท้ายด้วย /** | `/users/` | `/users` |

```
┌────────────────────────────────────────────────────────────┐
│  💡 ตัวอย่าง Resource Naming                                 │
│  ──────────────────────────                                │
│                                                            │
│  ✅ GOOD EXAMPLES:                                         │
│  • /users                  - Collection of users           │
│  • /users/123              - Specific user                 │
│  • /users/123/orders       - Orders of user 123            │
│  • /products               - Collection of products        │
│  • /products/456/reviews   - Reviews of product 456        │
│                                                            │
│  ❌ BAD EXAMPLES:                                          │
│  • /getUsers               - Using verb                    │
│  • /user                   - Singular                      │
│  • /Users                  - Capital letter                │
│  • /user_profiles          - Underscore                    │
└────────────────────────────────────────────────────────────┘
```

---

### 7.1.3 HTTP Methods (Verbs)

```
┌──────────────────────────────────────────────────────────────┐
│                    HTTP METHODS & CRUD                       │
│                                                              │
│   Resource (นาม) + HTTP Method (กริยา) = Complete Action      │
└──────────────────────────────────────────────────────────────┘
```

| HTTP Method | CRUD Operation | ความหมาย | Idempotent? | Safe? |
|------------|----------------|----------|-------------|-------|
| **GET** | **Read** | ดึงข้อมูล | ✅ Yes | ✅ Yes |
| **POST** | **Create** | สร้างใหม่ | ❌ No | ❌ No |
| **PUT** | **Update** | แทนที่ทั้งหมด | ✅ Yes | ❌ No |
| **PATCH** | **Update** | แก้ไขบางส่วน | ❌ No* | ❌ No |
| **DELETE** | **Delete** | ลบ | ✅ Yes | ❌ No |

```
┌────────────────────────────────────────────────────────────┐
│  📖 คำอธิบาย                                                │
│  ─────────                                                 │
│                                                            │
│  Idempotent = เรียกหลายครั้งได้ผลเหมือนเรียกครั้งเดียว              │
│  Safe = ไม่เปลี่ยนแปลงข้อมูลบน Server                           │
│                                                            │
│  * PATCH อาจ idempotent ได้ขึ้นกับการ implement                │
└────────────────────────────────────────────────────────────┘
```

#### ตัวอย่าง RESTful Endpoints:

```
┌─────────────────────────────────────────────────────────────────┐
│  RESOURCE: /users                                               │
├────────┬──────────────────────┬─────────────────────────────────┤
│ Method │ Endpoint             │ Description                     │
├────────┼──────────────────────┼─────────────────────────────────┤
│ GET    │ /users               │ ดึงรายการ users ทั้งหมด            │
│ GET    │ /users/123           │ ดึง user ที่มี id = 123             │
│ POST   │ /users               │ สร้าง user ใหม่                   │
│ PUT    │ /users/123           │ แทนที่ข้อมูล user 123 ทั้งหมด         │
│ PATCH  │ /users/123           │ แก้ไขบางส่วนของ user 123          │
│ DELETE │ /users/123           │ ลบ user 123                     │
└────────┴──────────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  NESTED RESOURCES: /users/{id}/orders                           │
├────────┬──────────────────────┬─────────────────────────────────┤
│ Method │ Endpoint             │ Description                     │
├────────┼──────────────────────┼─────────────────────────────────┤
│ GET    │ /users/123/orders    │ ดึง orders ทั้งหมดของ user 123     │
│ POST   │ /users/123/orders    │ สร้าง order ใหม่ให้ user 123       │
│ GET    │ /users/123/orders/5  │ ดึง order 5 ของ user 123         │
│ DELETE │ /users/123/orders/5  │ ลบ order 5 ของ user 123         │
└────────┴──────────────────────┴─────────────────────────────────┘
```

---

### 7.1.4 HTTP Status Codes

```
┌──────────────────────────────────────────────────────────────┐
│              HTTP STATUS CODE CATEGORIES                     │
│                                                              │
│  1xx - Information (รอข้อมูล)                                  │
│  2xx - Success (สำเร็จ) ✅                                    │
│  3xx - Redirection (เปลี่ยนเส้นทาง) ↪️                          │
│  4xx - Client Error (ผิดพลาดฝั่ง Client) ❌                     │
│  5xx - Server Error (ผิดพลาดฝั่ง Server) 💥                     │
└──────────────────────────────────────────────────────────────┘
```

#### Status Codes ที่ใช้บ่อย:

| Code | ชื่อ | ใช้เมื่อ | ตัวอย่าง |
|------|------|---------|---------|
| **200** | OK | Request สำเร็จ | GET, PUT successful |
| **201** | Created | สร้างข้อมูลสำเร็จ | POST successful |
| **204** | No Content | สำเร็จ แต่ไม่มีข้อมูล return | DELETE successful |
| **400** | Bad Request | Request ไม่ถูกต้อง | Missing required fields |
| **401** | Unauthorized | ไม่ได้ Login | No authentication token |
| **403** | Forbidden | ไม่มีสิทธิ์ | Not allowed to access |
| **404** | Not Found | ไม่พบข้อมูล | Resource doesn't exist |
| **409** | Conflict | ข้อมูลซ้ำ | Duplicate email |
| **422** | Unprocessable Entity | Validation failed | Invalid data format |
| **500** | Internal Server Error | Server เกิดข้อผิดพลาด | Database error |

```
┌────────────────────────────────────────────────────────────┐
│  💡 ตัวอย่างการใช้งาน                                         │
└────────────────────────────────────────────────────────────┘

// ✅ GET /users/123 - พบข้อมูล
HTTP/1.1 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}

// ❌ GET /users/999 - ไม่พบข้อมูล
HTTP/1.1 404 Not Found
{
  "error": "User not found"
}

// ✅ POST /users - สร้างสำเร็จ
HTTP/1.1 201 Created
Location: /users/124
{
  "id": 124,
  "name": "Jane Smith",
  "email": "jane@example.com"
}

// ❌ POST /users - ข้อมูลไม่ครบ
HTTP/1.1 400 Bad Request
{
  "error": "Missing required field: email"
}

// ✅ DELETE /users/123 - ลบสำเร็จ
HTTP/1.1 204 No Content
```

---

### 7.1.5 Query Parameters & Filtering

```
┌──────────────────────────────────────────────────────────────┐
│                 QUERY PARAMETERS                             │
│                                                              │
│  /resource?param1=value1&param2=value2                       │
│                                                              │
│  ใช้สำหรับ: Filtering, Sorting, Pagination, Search             │
└──────────────────────────────────────────────────────────────┘
```

#### ตัวอย่างการใช้งาน:

```
┌────────────────────────────────────────────────────────────────┐
│  🔍 FILTERING (กรองข้อมูล)                                       │
└────────────────────────────────────────────────────────────────┘

GET /products?category=electronics
GET /products?price_min=1000&price_max=5000
GET /products?inStock=true

┌────────────────────────────────────────────────────────────────┐
│  🔤 SORTING (เรียงลำดับ)                                         │
└────────────────────────────────────────────────────────────────┘

GET /products?sort=price          // เรียงตาม price (ascending)
GET /products?sort=-price         // เรียงตาม price (descending)
GET /products?sort=name,price     // เรียงหลายฟิลด์

┌────────────────────────────────────────────────────────────────┐
│  📄 PAGINATION (แบ่งหน้า)                                        │
└────────────────────────────────────────────────────────────────┘

GET /products?page=2&limit=20     // หน้า 2, แสดง 20 รายการ
GET /products?offset=40&limit=20  // ข้ามไป 40 รายการ, แสดง 20

┌────────────────────────────────────────────────────────────────┐
│  🔎 SEARCHING (ค้นหา)                                           │
└────────────────────────────────────────────────────────────────┘

GET /products?search=laptop
GET /products?q=macbook
GET /products?name=iphone

┌────────────────────────────────────────────────────────────────┐
│  📊 FIELD SELECTION (เลือกฟิลด์)                                  │
└────────────────────────────────────────────────────────────────┘

GET /products?fields=id,name,price
GET /users?include=profile,orders
```

---

### 7.1.6 API Versioning

```
┌──────────────────────────────────────────────────────────────┐
│                    API VERSIONING                            │
│                                                              │
│  เมื่อ API เปลี่ยนแปลงแบบ Breaking Change                        │
│  ต้องมี Version เพื่อให้ Client เดิมใช้งานได้ต่อ                      │
└──────────────────────────────────────────────────────────────┘
```

#### วิธี Versioning ที่นิยม:

```
┌────────────────────────────────────────────────────────────┐
│  1️⃣ URL Path Versioning (แนะนำ ⭐)                         │
│                                                            │
│  /v1/users                                                 │
│  /v2/users                                                 │
│  /api/v1/products                                          │
│                                                            │
│  ✅ ข้อดี: เห็นชัดเจน, ใช้งานง่าย                                │
│  ❌ ข้อเสีย: URL เปลี่ยน                                       │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  2️⃣ Header Versioning                                      │
│                                                            │
│  GET /users                                                │
│  Accept: application/vnd.myapp.v1+json                     │
│                                                            │
│  ✅ ข้อดี: URL ไม่เปลี่ยน                                       │
│  ❌ ข้อเสีย: ซับซ้อน, ทดสอบยาก                                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  3️⃣ Query Parameter Versioning                             │
│                                                            │
│  /users?version=1                                          │
│  /users?api-version=2                                      │
│                                                            │
│  ✅ ข้อดี: ยืดหยุ่น                                             │
│  ❌ ข้อเสีย: อาจลืมใส่ parameter                               │
└────────────────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────┐
│  💡 Best Practices                                             │
│  ───────────────                                               │
│                                                                │
│  ✓ เริ่มด้วย v1 ตั้งแต่แรก                                           │
│  ✓ เปลี่ยน version เฉพาะตอนที่ Breaking Change                     │
│  ✓ Support version เก่าอย่างน้อย 6-12 เดือน                        │
│  ✓ แจ้งเตือน deprecation ล่วงหน้า                                  │
│  ✓ เขียน documentation สำหรับทุก version                          │
└────────────────────────────────────────────────────────────────┘
```

---

## 7.2 Data Modelling และ ER Diagram

```
╔═══════════════════════════════════════════════════════════════╗
║  📊 Data Modelling & ER Diagram                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 7.2.1 ER Diagram คืออะไร?

```
┌──────────────────────────────────────────────────────────────┐
│        ER (Entity-Relationship) Diagram                      │
│                                                              │
│  เป็นเครื่องมือสำหรับออกแบบฐานข้อมูลแบบภาพ                          │
│  แสดงความสัมพันธ์ระหว่าง Entities (ตาราง) ต่างๆ                   │
└──────────────────────────────────────────────────────────────┘
```

#### องค์ประกอบของ ER Diagram:

```
┌────────────────────────────────────────────────────────────┐
│  1️⃣ ENTITY (สิ่ง/ตาราง)                                      │
│     แทนด้วย: สี่เหลี่ยมผืนผ้า                                     │
│                                                            │
│     ┌─────────────┐                                        │
│     │   Student   │                                        │
│     └─────────────┘                                        │
│                                                            │
│  2️⃣ ATTRIBUTE (คุณสมบัติ/คอลัมน์)                               │
│     แทนด้วย: วงรี                                            │
│                                                            │
│        ╭─────────╮                                         │
│        │   ID    │                                         │
│        ╰─────────╯                                         │
│                                                            │
│  3️⃣ RELATIONSHIP (ความสัมพันธ์)                               │
│     แทนด้วย: ромб                                           │
│                                                            │
│        ◇──── Enrolls ────◇                                 │
│                                                            │
│  4️⃣ PRIMARY KEY (PK)                                       │
│     ขีดเส้นใต้                                                │
│                                                            │
│     ID (PK)                                                │
│     ──                                                     │
└────────────────────────────────────────────────────────────┘
```

#### Cardinality (Relationship Types):

```
┌──────────────────────────────────────────────────────────────┐
│              RELATIONSHIP CARDINALITY                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1:1 (One-to-One)                                            │
│  ─────────────────                                           │
│     User ──────── Profile                                    │
│                                                              │
│     1 User มี 1 Profile / 1 Profile มี 1 User                  │
│                                                              │
│  ตัวอย่าง: User กับ Profile                                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1:N (One-to-Many) ⭐ ใช้บ่อยที่สุด                               │
│  ───────────────────                                         │
│     Customer ────< Orders                                    │
│                                                              │
│     1 Customer มีได้หลาย Orders                                │
│     1 Order มี 1 Customer                                     │
│                                                              │
│  ตัวอย่าง: Customer กับ Orders                                  │
│           Post กับ Comments                                   │
│           Category กับ Products                               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  N:M (Many-to-Many)                                          │
│  ────────────────────                                        │
│     Student >────< Course                                    │
│                                                              │
│     1 Student ลงทะเบียนได้หลาย Courses                         │
│     1 Course มีได้หลาย Students                                │
│                                                              │
│  ⚠️ ต้องสร้างตารางกลาง (Junction Table)                        │
│                                                              │
│  ตัวอย่าง: Student กับ Course (ต้องมี Enrollment)                 │
│           Product กับ Tag (ต้องมี ProductTag)                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.2.2 ตัวอย่าง ER Diagram: E-Commerce System

```
┌──────────────────────────────────────────────────────────────────────┐
│                    E-COMMERCE ER DIAGRAM                             │
└──────────────────────────────────────────────────────────────────────┘

                    ┌────────────────┐
                    │   CUSTOMER     │
                    ├────────────────┤
                    │ id (PK)        │
                    │ name           │
                    │ email          │
                    │ password       │
                    │ phone          │
                    │ created_at     │
                    └────────┬───────┘
                             │
                             │ 1
                             │
                             │ places
                             │
                             │ N
                    ┌────────▼───────┐
                    │    ORDER       │
                    ├────────────────┤
                    │ id (PK)        │
                    │ customer_id FK │
                    │ order_date     │
                    │ total_amount   │
                    │ status         │
                    └────────┬───────┘
                             │
                             │ 1
                             │
                             │ contains
                             │
                             │ N
                    ┌────────▼───────┐
                    │  ORDER_ITEM    │  ← Junction Table
                    ├────────────────┤
                    │ id (PK)        │
                    │ order_id  (FK) │
                    │ product_id(FK) │
                    │ quantity       │
                    │ price          │
                    └────────┬───────┘
                             │
                             │ N
                             │
                             │ contains
                             │
                             │ 1
                    ┌────────▼───────┐
                    │   PRODUCT      │
                    ├────────────────┤
                    │ id (PK)        │
                    │ category_id FK │
                    │ name           │
                    │ description    │
                    │ price          │
                    │ stock          │
                    └────────┬───────┘
                             │
                             │ N
                             │
                             │ belongs to
                             │
                             │ 1
                    ┌────────▼───────┐
                    │   CATEGORY     │
                    ├────────────────┤
                    │ id (PK)        │
                    │ name           │
                    │ description    │
                    └────────────────┘
```

---

### 7.2.3 จาก ER Diagram สู่ Database Tables

```
┌──────────────────────────────────────────────────────────────┐
│         FROM ER DIAGRAM TO DATABASE TABLES                   │
└──────────────────────────────────────────────────────────────┘
```

#### หลักการแปลง ER เป็น Tables:

```
┌────────────────────────────────────────────────────────────┐
│  📋 RULES                                                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1️⃣ Entity → Table                                         │
│     แต่ละ Entity กลายเป็น 1 ตาราง                            │
│                                                            │
│  2️⃣ Attribute → Column                                     │
│     แต่ละ Attribute กลายเป็น Column                          │
│                                                            │
│  3️⃣ Primary Key                                            │
│     ใส่ PRIMARY KEY constraint                              │
│                                                            │
│  4️⃣ 1:N Relationship                                       │
│     ใส่ Foreign Key ในฝั่ง N                                  │
│                                                            │
│  5️⃣ N:M Relationship                                       │
│     สร้าง Junction Table ใหม่                                │
│     มี 2 Foreign Keys ชี้ไปทั้งสองฝั่ง                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### ตัวอย่าง SQL สำหรับสร้างตาราง:

```sql
-- ✅ CUSTOMER Table (1 ฝั่งของ 1:N)
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ ORDER Table (N ฝั่งของ 1:N)
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- ✅ CATEGORY Table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- ✅ PRODUCT Table (N ฝั่งของ 1:N กับ Category)
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ✅ ORDER_ITEM Table (Junction Table สำหรับ N:M)
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 7.3 SQLite และการเชื่อมต่อกับ Express

```
╔═══════════════════════════════════════════════════════════════╗
║  💾 SQLite Database Integration                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 7.3.1 SQLite คืออะไร?

```
┌──────────────────────────────────────────────────────────────┐
│                      WHAT IS SQLite?                         │
│                                                              │
│  "A C-library that implements a small, fast, self-contained, │
│   highly-reliable, full-featured SQL database engine"        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Serverless (ไม่ต้อง setup server)                     │  │
│  │  • Zero-configuration (ไม่ต้อง config)                   │  │
│  │  │  • Single file (เก็บเป็นไฟล์เดียว .db)                  │  │
│  │  • Cross-platform (รันได้ทุก OS)                          │  │
│  │  • ACID compliant (รับประกันความถูกต้อง)                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🎯 เหมาะกับ:                                                 │
│  • เว็บแอปขนาดเล็ก-กลาง                                        │
│  • Mobile apps                                               │
│  • Desktop applications                                      │
│  • Prototyping & Development                                 │
│  • Embedded systems                                          │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.3.2 JSON File vs SQLite Database

```
┌────────────────────────────────────────────────────────────────┐
│                 JSON FILE vs SQLite DATABASE                   │
├────────────────────────────────────────────────────────────────┤
│  Feature          │  JSON File       │  SQLite Database        │
├───────────────────┼──────────────────┼─────────────────────────┤
│  โครงสร้าง         │  ❌ ไม่มี Schema   │  ✅ มี Schema ที่ชัดเจน     │
│  ความเร็ว          │  ❌ ช้า (ทั้งไฟล์)   │  ✅ เร็ว (Index)         │
│  Query            │  ❌ ยาก          │  ✅ ใช้ SQL ง่าย          │
│  Relationships    │  ❌ ต้องทำเอง     │  ✅ Foreign Keys        │
│  Transactions     │  ❌ ไม่มี          │  ✅ รองรับ ACID          │
│  Concurrent Access│  ❌ อันตราย       │  ✅ Safe                │
│  Data Validation  │  ❌ ต้องทำเอง     │  ✅ Constraints         │
│  Scalability      │  ❌ จำกัด         │  ✅ ดีกว่า                │
│  Setup            │  ✅ ง่าย          │  ⚠️  ต้องเรียนรู้ SQL       │
│  File Size        │  ✅ เล็ก          │  ⚠️  ใหญ่กว่าเล็กน้อย       │
└───────────────────┴──────────────────┴─────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────┐
│  💡 เมื่อไหร่ควรใช้อะไร?                                           │
│  ──────────────────────────                                    │
│                                                                │
│  ✅ ใช้ JSON File เมื่อ:                                          │
│  • ข้อมูลน้อยมาก (< 100 records)                                  │
│  • โครงสร้างไม่ซับซ้อน                                             │
│  • แค่ Prototype / POC                                          │
│  • ไม่ต้องการ Query ซับซ้อน                                        │
│                                                                │
│  ✅ ใช้ SQLite เมื่อ:                                             │
│  • ข้อมูลมากขึ้น (> 100 records)                                   │
│  • มี Relationships ระหว่างตาราง                                 │
│  • ต้องการ Query ที่ซับซ้อน (JOIN, GROUP BY)                        │
│  • ต้องการ Data Integrity                                       │
│  • เป็น Production Application                                  │
└────────────────────────────────────────────────────────────────┘
```

---

### 7.3.3 ติดตั้งและเชื่อมต่อ SQLite กับ Express

#### ขั้นตอนที่ 1: ติดตั้ง sqlite3 package

```bash
npm install sqlite3
```

#### ขั้นตอนที่ 2: สร้างการเชื่อมต่อ

สร้างไฟล์ `database.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// กำหนด path สำหรับไฟล์ database
const dbPath = path.resolve(__dirname, 'database.db');

// สร้าง connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
```

#### ขั้นตอนที่ 3: สร้างตาราง

สร้างไฟล์ `init-db.js`:

```javascript
const db = require('./database');

// สร้างตาราง Users
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// สร้างตาราง Products
const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// รันคำสั่ง CREATE TABLE
db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err.message);
    } else {
      console.log('✅ Users table created');
    }
  });

  db.run(createProductsTable, (err) => {
    if (err) {
      console.error('❌ Error creating products table:', err.message);
    } else {
      console.log('✅ Products table created');
    }
  });
});

// ปิด connection
db.close();
```

รันคำสั่ง:
```bash
node init-db.js
```

---

### 7.3.4 CRUD Operations กับ SQLite

```
┌──────────────────────────────────────────────────────────────┐
│              SQLite CRUD OPERATIONS                          │
└──────────────────────────────────────────────────────────────┘
```

#### 1️⃣ CREATE (INSERT)

```javascript
const db = require('./database');

// เพิ่มข้อมูล user ใหม่
function createUser(name, email, password) {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;
  
  return new Promise((resolve, reject) => {
    db.run(sql, [name, email, password], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          name,
          email
        });
      }
    });
  });
}

// ใช้งาน
createUser('John Doe', 'john@example.com', 'hashed_password')
  .then(user => console.log('Created:', user))
  .catch(err => console.error('Error:', err));
```

#### 2️⃣ READ (SELECT)

```javascript
// ดึงข้อมูล users ทั้งหมด
function getAllUsers() {
  const sql = 'SELECT id, name, email, created_at FROM users';
  
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// ดึงข้อมูล user ตาม ID
function getUserById(id) {
  const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
  
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
```

#### 3️⃣ UPDATE

```javascript
// อัปเดตข้อมูล user
function updateUser(id, name, email) {
  const sql = `
    UPDATE users 
    SET name = ?, email = ?
    WHERE id = ?
  `;
  
  return new Promise((resolve, reject) => {
    db.run(sql, [name, email, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ 
          changes: this.changes,
          id,
          name,
          email
        });
      }
    });
  });
}
```

#### 4️⃣ DELETE

```javascript
// ลบข้อมูล user
function deleteUser(id) {
  const sql = 'DELETE FROM users WHERE id = ?';
  
  return new Promise((resolve, reject) => {
    db.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ 
          changes: this.changes,
          deletedId: id
        });
      }
    });
  });
}
```

```
┌────────────────────────────────────────────────────────────┐
│  ⚠️ IMPORTANT: SQL Injection Prevention                    │
│  ──────────────────────────────────────────────────────────│
│                                                            │
│  ❌ NEVER DO THIS (SQL Injection vulnerable):              │
│  const sql = `SELECT * FROM users WHERE id = ${id}`;       │
│                                                            │
│  ✅ ALWAYS USE THIS (Prepared Statements):                 │
│  const sql = 'SELECT * FROM users WHERE id = ?';           │
│  db.get(sql, [id], callback);                              │
│                                                            │
│  การใช้ ? และส่งค่าเป็น array จะป้องกัน SQL Injection            │
└────────────────────────────────────────────────────────────┘
```

---

### 7.3.5 เชื่อมต่อ Express กับ SQLite

```
┌──────────────────────────────────────────────────────────────┐
│           EXPRESS + SQLite INTEGRATION                       │
└──────────────────────────────────────────────────────────────┘
```

#### โครงสร้างโปรเจกต์:

```
backend/
├── database.js          # Database connection
├── init-db.js           # Create tables
├── server.js            # Express server
└── routes/
    └── users.js         # User routes
```

#### `routes/users.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database');

// 🟢 GET all users
router.get('/', (req, res) => {
  const sql = 'SELECT id, name, email, created_at FROM users';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 🟢 GET user by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

// 🔵 POST create user
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Missing required fields' 
    });
  }
  
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  
  db.run(sql, [name, email, password], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ 
          error: 'Email already exists' 
        });
      }
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({
      id: this.lastID,
      name,
      email
    });
  });
});

// 🟠 PUT update user
router.put('/:id', (req, res) => {
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  
  db.run(sql, [name, email, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      id: req.params.id,
      name,
      email 
    });
  });
});

// 🔴 DELETE user
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      message: 'User deleted successfully',
      deletedId: req.params.id
    });
  });
});

module.exports = router;
```

#### `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## 7.4 การแบ่งเลเยอร์โค้ด (Layered Architecture)

```
╔═══════════════════════════════════════════════════════════════╗
║  🏗️  Layered Architecture                                     ║
╚═══════════════════════════════════════════════════════════════╝
```

### 7.4.1 ทำไมต้องแบ่งเลเยอร์?

```
┌──────────────────────────────────────────────────────────────┐
│              WHY LAYERED ARCHITECTURE?                       │
│                                                              │
│  ❌ ปัญหาของโค้ดที่ไม่แบ่งเลเยอร์:                                  │
│  • โค้ดยาวและซับซ้อน                                            │
│  • ยากต่อการทดสอบ                                             │
│  • แก้ไขที่เดียว กระทบหลายที่                                      │
│  • ทำงานเป็นทีมยาก                                             │
│  • Code Duplication                                          │
│                                                              │
│  ✅ ประโยชน์ของการแบ่งเลเยอร์:                                  │
│  • Separation of Concerns                                    │
│  • ง่ายต่อการ Test                                             │
│  • ง่ายต่อการ Maintain                                         │
│  • Reusable Code                                             │
│  • ทีมทำงานแยกกันได้                                            │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.4.2 โครงสร้าง 4 Layers

```
┌─────────────────────────────────────────────────────────────┐
│                   4-LAYER ARCHITECTURE                      │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  Layer 1: ROUTER (Routes)                             │ │
│   │  ┌──────────────────────────────────────────────────┐ │ │
│   │  │  • รับ HTTP Request                               │ │ │
│   │  │  • Validate Input (เบื้องต้น)                       │ │ │
│   │  │  • เรียก Controller                               │ │ │
│   │  │  • ส่ง HTTP Response                              │ │ │
│   │  └──────────────────────────────────────────────────┘ │ │
│   └────────────────┬──────────────────────────────────────┘ │
│                    │                                        │
│                    ▼                                        │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  Layer 2: CONTROLLER                                  │ │
│   │  ┌──────────────────────────────────────────────────┐ │ │
│   │  │  • จัดการ Request/Response                        │ │ │
│   │  │  • Validate Input (ละเอียด)                       │ │ │
│   │  │  • เรียก Service                                  │ │ │
│   │  │  • จัดการ Error                                   │ │ │
│   │  └──────────────────────────────────────────────────┘ │ │
│   └────────────────┬──────────────────────────────────────┘ │
│                    │                                        │
│                    ▼                                        │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  Layer 3: SERVICE (Business Logic)                    │ │
│   │  ┌──────────────────────────────────────────────────┐ │ │
│   │  │  • Business Logic                                │ │ │
│   │  │  • การคำนวณ                                      │ │ │
│   │  │  • การตรวจสอบเงื่อนไข                              │ │ │
│   │  │  • เรียก Database Layer                           │ │ │
│   │  └──────────────────────────────────────────────────┘ │ │
│   └────────────────┬──────────────────────────────────────┘ │
│                    │                                        │
│                    ▼                                        │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  Layer 4: DATABASE (Data Access)                      │ │
│   │  ┌──────────────────────────────────────────────────┐ │ │
│   │  │  • SQL Queries                                   │ │ │
│   │  │  • CRUD Operations                               │ │ │
│   │  │  • Database Connection                           │ │ │
│   │  │  • Data Mapping                                  │ │ │
│   │  └──────────────────────────────────────────────────┘ │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.4.3 ตัวอย่างโค้ดแบบแบ่งเลเยอร์

```
┌──────────────────────────────────────────────────────────────┐
│              PROJECT STRUCTURE                               │
└──────────────────────────────────────────────────────────────┘

backend/
├── database/
│   ├── connection.js      # Database connection
│   └── users.db.js        # User data access
├── services/
│   └── user.service.js    # User business logic
├── controllers/
│   └── user.controller.js # User request handlers
├── routes/
│   └── users.route.js     # User routes
└── server.js              # Express app
```

#### Layer 4: Database (`database/users.db.js`)

```javascript
const db = require('./connection');

class UserDatabase {
  // CREATE
  static create(name, email, password) {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    
    return new Promise((resolve, reject) => {
      db.run(sql, [name, email, password], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name, email });
      });
    });
  }

  // READ ALL
  static findAll() {
    const sql = 'SELECT id, name, email, created_at FROM users';
    
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // READ ONE
  static findById(id) {
    const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // UPDATE
  static update(id, name, email) {
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.run(sql, [name, email, id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }

  // DELETE
  static delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = UserDatabase;
```

#### Layer 3: Service (`services/user.service.js`)

```javascript
const UserDatabase = require('../database/users.db');

class UserService {
  // Get all users
  static async getAllUsers() {
    return await UserDatabase.findAll();
  }

  // Get user by ID
  static async getUserById(id) {
    const user = await UserDatabase.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Create new user
  static async createUser(userData) {
    const { name, email, password } = userData;
    
    // Business Logic: Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    // Business Logic: Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Create user
    return await UserDatabase.create(name, email, password);
  }

  // Update user
  static async updateUser(id, userData) {
    const { name, email } = userData;
    
    // Check if user exists
    await this.getUserById(id);
    
    // Validate email if provided
    if (email && !this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    // Update
    const result = await UserDatabase.update(id, name, email);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    
    return await this.getUserById(id);
  }

  // Delete user
  static async deleteUser(id) {
    // Check if user exists
    await this.getUserById(id);
    
    const result = await UserDatabase.delete(id);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    
    return { message: 'User deleted successfully' };
  }

  // Helper: Validate email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = UserService;
```

#### Layer 2: Controller (`controllers/user.controller.js`)

```javascript
const UserService = require('../services/user.service');

class UserController {
  // GET /api/users
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/users/:id
  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // POST /api/users
  static async createUser(req, res) {
    try {
      // Validate required fields
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Missing required fields' 
        });
      }
      
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message.includes('Invalid') || 
          error.message.includes('Password')) {
        res.status(400).json({ error: error.message });
      } else if (error.message.includes('UNIQUE')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // PUT /api/users/:id
  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Invalid')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // DELETE /api/users/:id
  static async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = UserController;
```

#### Layer 1: Router (`routes/users.route.js`)

```javascript
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// Define routes
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
```

#### Main Server (`server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users.route');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

```
┌────────────────────────────────────────────────────────────────┐
│  📊 REQUEST FLOW                                               │
│  ─────────────                                                 │
│                                                                │
│  1. Client → Router: GET /api/users/123                        │
│                                                                │
│  2. Router → Controller: UserController.getUserById()          │
│                                                                │
│  3. Controller → Service: UserService.getUserById(123)         │
│                                                                │
│  4. Service → Database: UserDatabase.findById(123)             │
│                                                                │
│  5. Database → Service: { id: 123, name: "John", ... }         │
│                                                                │
│  6. Service → Controller: return user                          │
│                                                                │
│  7. Controller → Client: res.json(user)                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 💻 Workshop: ออกแบบและพัฒนา Database Backend (3 ชั่วโมง)

```
╔══════════════════════════════════════════════════════════════╗
║  🎯 WORKSHOP OBJECTIVES                                      ║
║  ─────────────────────                                       ║
║  1. ออกแบบ ER Diagram สำหรับ Term Project                     ║
║  2. สร้าง Database Tables ใน SQLite                           ║
║  3. ย้ายจาก JSON file เป็น SQLite Database                     ║
║  4. จัดโครงสร้างโค้ดแบบ Layered Architecture                    ║
╚══════════════════════════════════════════════════════════════╝
```

### ส่วนที่ 1: วาด ER Diagram (45 นาที)

#### 📝 ขั้นตอน:

1. **ระบุ Entities** จาก Requirements ของ Term Project
   - เช่น: User, Product, Order, Category, Review, etc.

2. **กำหนด Attributes** ของแต่ละ Entity
   - ระบุ Primary Key
   - ระบุ Data Types

3. **กำหนด Relationships**
   - 1:1, 1:N, หรือ N:M
   - ระบุ Foreign Keys

4. **วาด ER Diagram** ใช้เครื่องมือ:
   - Draw.io (https://draw.io)
   - Lucidchart
   - dbdiagram.io (แนะนำ)
   - หรือวาดบนกระดาษ

```
┌────────────────────────────────────────────────────────────┐
│  💡 ตัวอย่าง ER Diagram ของ Blog System                      │
└────────────────────────────────────────────────────────────┘

    ┌─────────────┐          ┌─────────────┐
    │    USER     │          │    POST     │
    ├─────────────┤          ├─────────────┤
    │ id (PK)     │ 1     N  │ id (PK)     │
    │ username    │──────────│ user_id FK  │
    │ email       │  writes  │ title       │
    │ password    │          │ content     │
    └─────────────┘          │ created_at  │
                             └──────┬──────┘
                                    │
                                    │ 1
                                    │
                                    │ has
                                    │
                                    │ N
                             ┌──────▼──────┐
                             │   COMMENT   │
                             ├─────────────┤
                             │ id (PK)     │
                             │ post_id FK  │
                             │ user_id FK  │
                             │ content     │
                             │ created_at  │
                             └─────────────┘
```

---

### ส่วนที่ 2: สร้าง Database Tables (45 นาที)

#### 📝 ขั้นตอน:

1. **สร้างไฟล์ `database/connection.js`**

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../term-project.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

db.run('PRAGMA foreign_keys = ON');

module.exports = db;
```

2. **สร้างไฟล์ `database/schema.sql`** (ตามER Diagram ของคุณ)

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

3. **สร้างไฟล์ `database/init-db.js`**

```javascript
const db = require('./connection');
const fs = require('fs');
const path = require('path');

// อ่านไฟล์ schema.sql
const schema = fs.readFileSync(
  path.resolve(__dirname, 'schema.sql'),
  'utf8'
);

// แยก SQL statements (แบ่งตาม ;)
const statements = schema.split(';').filter(stmt => stmt.trim());

// รัน each statement
db.serialize(() => {
  statements.forEach((stmt) => {
    if (stmt.trim()) {
      db.run(stmt, (err) => {
        if (err) {
          console.error('❌ Error:', err.message);
        } else {
          console.log('✅ Executed:', stmt.substring(0, 50) + '...');
        }
      });
    }
  });
  
  console.log('✅ Database initialized successfully');
});

db.close();
```

4. **รันคำสั่ง:**

```bash
node database/init-db.js
```

---

### ส่วนที่ 3: Migrate จาก JSON → SQLite (60 นาที)

#### 📝 ขั้นตอน:

1. **สร้าง Database Layer** สำหรับแต่ละ Resource

ตัวอย่าง `database/users.db.js`:

```javascript
const db = require('./connection');

class UserDatabase {
  static create(username, email, password) {
    const sql = `
      INSERT INTO users (username, email, password) 
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [username, email, password], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username, email });
      });
    });
  }

  static findAll() {
    const sql = 'SELECT id, username, email, created_at FROM users';
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
  
  // ... UPDATE และ DELETE methods
}

module.exports = UserDatabase;
```

2. **อัปเดต Service Layer** ให้ใช้ Database แทน JSON file

3. **ทดสอบ** CRUD operations ทั้งหมดด้วย Postman

```
┌────────────────────────────────────────────────────────────┐
│  ✅ TESTING CHECKLIST                                      │
├────────────────────────────────────────────────────────────┤
│  □ CREATE: สร้างข้อมูลใหม่ได้                                   │
│  □ READ ALL: ดึงข้อมูลทั้งหมดได้                                 │
│  □ READ ONE: ดึงข้อมูลตาม ID ได้                               │
│  □ UPDATE: แก้ไขข้อมูลได้                                      │
│  □ DELETE: ลบข้อมูลได้                                        │
│  □ Foreign Keys: ความสัมพันธ์ทำงานถูกต้อง                       │
│  □ Validation: ตรวจสอบข้อมูลก่อนบันทึก                          │
│  □ Error Handling: แสดง Error ที่เหมาะสม                     │
└────────────────────────────────────────────────────────────┘
```

---

### ส่วนที่ 4: จัดโครงสร้างแบบ Layered (30 นาที)

#### 📝 ขั้นตอน:

1. **จัดโครงสร้างโฟลเดอร์**

```
backend/
├── database/
│   ├── connection.js
│   ├── schema.sql
│   ├── init-db.js
│   └── users.db.js
├── services/
│   └── user.service.js
├── controllers/
│   └── user.controller.js
├── routes/
│   └── users.route.js
└── server.js
```

2. **แยก Logic ออกเป็นแต่ละเลเยอร์**
   - ย้าย SQL queries → Database Layer
   - ย้าย Business Logic → Service Layer
   - ย้าย Request/Response handling → Controller Layer
   - เหลือแค่ Route definitions → Router Layer

3. **Refactor โค้ด** ให้สะอาดและเป็นระเบียบ

4. **Test** ว่าทุกอย่างยังทำงานได้ตามเดิม

```
┌────────────────────────────────────────────────────────────┐
│  💡 TIPS                                                   │
│  ────                                                      │
│                                                            │
│  • แยกไฟล์ให้ชัดเจน - แต่ละไฟล์มีหน้าที่เดียว                        │
│  • ใช้ async/await แทน callbacks                            │
│  • สร้าง Error class แยกต่างหาก                              │
│  • เขียน comments อธิบาย business logic ที่ซับซ้อน               │
│  • ใช้ Git commit บ่อยๆ                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 🏠 Lab Assignment: พัฒนาระบบให้สมบูรณ์ (10 คะแนน)

```
╔══════════════════════════════════════════════════════════════╗
║  📋 LAB ASSIGNMENT - DUE BEFORE MIDTERM                      ║
╚══════════════════════════════════════════════════════════════╝
```

### งานที่ 1: สร้าง Advanced Queries (3 คะแนน)

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 OBJECTIVES                                              │
│  ──────────                                                 │
│  • เขียน SQL Queries ที่ซับซ้อน                                  │
│  • ใช้ JOIN, GROUP BY, HAVING                                │
│  • ทำ Aggregate Functions                                   │
│  • สร้าง Search & Filter ที่มีประสิทธิภาพ                         │
└─────────────────────────────────────────────────────────────┘
```

#### ✅ ตัวอย่างงานที่ต้องทำ:

1. **JOIN Query**: ดึงข้อมูลจากหลายตาราง
```sql
-- ดึง Posts พร้อมข้อมูล User ที่เขียน
SELECT posts.*, users.username, users.email
FROM posts
JOIN users ON posts.user_id = users.id
WHERE posts.id = ?
```

2. **Aggregate Query**: นับจำนวน, หาค่าเฉลี่ย
```sql
-- นับจำนวน Posts ของแต่ละ User
SELECT users.username, COUNT(posts.id) as post_count
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id
ORDER BY post_count DESC
```

3. **Advanced Search**: ค้นหาที่ซับซ้อน
```sql
-- ค้นหา Products ตามเงื่อนไขหลายอย่าง
SELECT * FROM products
WHERE 
  (name LIKE '%' || ? || '%' OR description LIKE '%' || ? || '%')
  AND price BETWEEN ? AND ?
  AND category_id = ?
  AND stock > 0
ORDER BY created_at DESC
LIMIT ? OFFSET ?
```

**📋 Checklist:**
- [ ] สร้าง JOIN query อย่างน้อย 2 แบบ
- [ ] ใช้ Aggregate functions (COUNT, SUM, AVG)
- [ ] สร้าง Advanced search with multiple filters
- [ ] Implement Pagination

---

### งานที่ 2: Database Transactions (3 คะแนน)

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 OBJECTIVES                                              │
│  ──────────                                                 │
│  • ทำความเข้าใจ ACID Properties                              │
│  • ใช้ Transactions สำหรับ operations ที่ซับซ้อน                  │
│  • Rollback เมื่อเกิด Error                                    │
└─────────────────────────────────────────────────────────────┘
```

#### ✅ ตัวอย่างงานที่ต้องทำ:

สร้าง Transaction สำหรับการสั่งซื้อสินค้า (ต้องทำหลายขั้นตอน):

```javascript
static async createOrder(userId, orderItems) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // เริ่ม Transaction
      db.run('BEGIN TRANSACTION');

      try {
        // 1. สร้าง Order
        db.run(
          'INSERT INTO orders (user_id, total_amount) VALUES (?, 0)',
          [userId],
          function(err) {
            if (err) throw err;
            
            const orderId = this.lastID;
            let totalAmount = 0;

            // 2. เพิ่ม Order Items และลด Stock
            orderItems.forEach((item) => {
              // เพิ่ม Order Item
              db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price]
              );

              // ลด Stock
              db.run(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.productId]
              );

              totalAmount += item.price * item.quantity;
            });

            // 3. อัปเดต Total Amount
            db.run(
              'UPDATE orders SET total_amount = ? WHERE id = ?',
              [totalAmount, orderId]
            );

            // Commit Transaction
            db.run('COMMIT');
            resolve({ orderId, totalAmount });
          }
        );
      } catch (error) {
        // Rollback ถ้าเกิด Error
        db.run('ROLLBACK');
        reject(error);
      }
    });
  });
}
```

**📋 Checklist:**
- [ ] ใช้ BEGIN TRANSACTION
- [ ] ทำ multiple operations ภายใน transaction
- [ ] ใช้ COMMIT เมื่อสำเร็จ
- [ ] ใช้ ROLLBACK เมื่อเกิด error

---

### งานที่ 3: เพิ่ม Authentication & Authorization (4 คะแนน)

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 OBJECTIVES                                              │
│  ──────────                                                 │
│  • สร้างระบบ Login/Register                                  │
│  • Hash Password ด้วย bcrypt                                 │
│  • สร้าง JWT Tokens                                          │
│  • Protect Routes ด้วย Middleware                            │
└─────────────────────────────────────────────────────────────┘
```

#### ติดตั้ง Packages:

```bash
npm install bcrypt jsonwebtoken
```

#### ตัวอย่างโค้ด:

**1. Hash Password:**

```javascript
const bcrypt = require('bcrypt');

// Register
static async createUser(username, email, password) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [username, email, hashedPassword], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, username, email });
    });
  });
}

// Login
static async login(email, password) {
  const user = await this.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  return user;
}
```

**2. Generate JWT:**

```javascript
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key-change-this';

// Generate token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
}

// Verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

**3. Auth Middleware:**

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ใช้งาน
router.get('/profile', authMiddleware, UserController.getProfile);
```

**📋 Checklist:**
- [ ] สร้าง Register endpoint
- [ ] สร้าง Login endpoint (return JWT)
- [ ] Hash password ด้วย bcrypt
- [ ] สร้าง Auth middleware
- [ ] Protect routes ที่ต้องการ login

---

```
┌─────────────────────────────────────────────────────────────┐
│  📅 DEADLINE & SUBMISSION                                   │
│  ────────────────────────                                   │
│  กำหนดส่ง: ก่อนสอบกลางภาค (สัปดาห์หน้า)                           │
│                                                             │
│  📤 วิธีส่ง:                                                   │
│  1. Push code to GitHub                                     │
│  2. สร้าง README.md พร้อม:                                    │
│     • ER Diagram (รูปภาพ)                                    │
│     • Database Schema                                       │
│     • API Documentation                                     │
│     • Setup Instructions                                    │
│  3. อัดวิดีโอสาธิต (3-5 นาที)                                    │
│  4. ส่งลิงก์ผ่าน LMS                                            │
│                                                             │
│  🎯 เกณฑ์การให้คะแนน:                                         │
│  • งานที่ 1: Advanced Queries (3 คะแนน)                       │
│  • งานที่ 2: Transactions (3 คะแนน)                           │
│  • งานที่ 3: Authentication (4 คะแนน)                         │
│  รวม: 10 คะแนน                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 สรุปและเตรียมสอบกลางภาค

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ WEEK 7 SUMMARY                                           ║
╚══════════════════════════════════════════════════════════════╝
```

### สรุปสิ่งที่เราได้เรียนรู้ในสัปดาห์นี้:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ✓ หลักการออกแบบ RESTful API                                  │
│    → Resources, HTTP Methods, Status Codes                   │
│    → Query Parameters, Versioning                            │
│                                                              │
│  ✓ Data Modelling & ER Diagram                               │
│    → Entities, Attributes, Relationships                     │
│    → Cardinality (1:1, 1:N, N:M)                             │
│    → แปลง ER เป็น Tables                                      │
│                                                              │
│  ✓ SQLite Database                                           │
│    → เปรียบเทียบ JSON file vs SQLite                           │
│    → CRUD Operations                                         │
│    → SQL Queries & Joins                                     │
│                                                              │
│  ✓ Layered Architecture                                      │
│    → Router → Controller → Service → Database                │
│    → Separation of Concerns                                  │
│    → Clean Code Organization                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 🎯 สัปดาห์หน้า: สอบกลางภาค (Midterm Examination)

```
╔══════════════════════════════════════════════════════════════╗
║  📝 MIDTERM EXAM - Week 8                                    ║
╚══════════════════════════════════════════════════════════════╝
```

#### ครอบคลุมเนื้อหา (สัปดาห์ที่ 1-7):

```
┌────────────────────────────────────────────────────────────┐
│  📚 THEORY EXAM (2 hours)                                  │
│  ─────────────────────────                                 │
│                                                            │
│  • Software Engineering Principles                         │
│  • SDLC & Agile Methodology                                │
│  • Requirements Engineering                                │
│  • UML Diagrams (Use Case, Class, ER)                      │
│  • Software Architecture Patterns                          │
│  • Design Patterns                                         │
│  • RESTful API Design                                      │
│  • Database Design (ER Diagram)                            │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  💻 PRACTICAL EXAM (3 hours)                               │
│  ──────────────────────────                                │
│                                                            │
│  • วาด Use Case Diagram                                    │
│  • ออกแบบ ER Diagram                                       │
│  • ออกแบบ RESTful API Endpoints                            │
│  • เขียน HTML/CSS/JavaScript                                │
│  • เขียน Express Routes (pseudo code)                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### 📖 แนะนำการทบทวน:

```
┌────────────────────────────────────────────────────────────┐
│  ✅ STUDY CHECKLIST                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  □ ทบทวนเอกสารประกอบการสอนทุกสัปดาห์                          │
│  □ ทบทวนตัวอย่าง UML Diagrams                                │
│  □ ทบทวน REST API Best Practices                           │
│  □ ทบทวน SQL Syntax พื้นฐาน                                  │
│  □ ฝึกวาด ER Diagram                                        │
│  □ ฝึกออกแบบ API Endpoints                                  │
│  □ ทบทวน HTML/CSS/JavaScript                               │
│  □ ทบทวนโค้ด Workshop ทุกสัปดาห์                               │
│  □ ทำแบบฝึกหัดและ Quiz เดิม                                   │
│  □ นอนหลับพักผ่อนให้เพียงพอ                                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 💡 คำแนะนำสุดท้าย

```
╔══════════════════════════════════════════════════════════════╗
║  🎓 FINAL TIPS FOR SUCCESS                                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1️⃣ ทำความเข้าใจแนวคิด อย่าท่องจำ                                ║
║     เน้นเข้าใจว่าทำไม และเมื่อไหร่ใช้                               ║
║                                                              ║
║  2️⃣ ฝึกทำ Hands-on                                            ║
║     ลองวาด Diagram ด้วยตัวเอง                                  ║
║     ลองเขียนโค้ดจริง                                            ║
║                                                              ║
║  3️⃣ ทบทวน Best Practices                                     ║
║     REST API Design                                          ║
║     Database Normalization                                   ║
║     Code Organization                                        ║
║                                                              ║
║  4️⃣ ถามเมื่อสงสัย                                               ║
║     อย่าเก็บข้อสงสัยไว้                                           ║
║     ถามอาจารย์หรือเพื่อนก่อนสอบ                                   ║
║                                                              ║
║  5️⃣ จัดการเวลาในการสอบ                                        ║
║     อ่านโจทย์ให้ครบทุกข้อก่อน                                      ║
║     ทำข้อที่ถนัดก่อน                                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 ปิดท้าย

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🌟 Good Luck on Your Midterm Exam! 🌟                 ║
║                                                              ║
║  คุณได้เรียนรู้และพัฒนามามากแล้วในช่วง 7 สัปดาห์ที่ผ่านมา                 ║
║  แค่ทบทวนให้ดี เชื่อมั่นในตัวเอง และทำให้ดีที่สุด!                        ║
║                                                              ║
║  Remember:                                                   ║
║  "The only way to do great work is to love what you do."     ║
║                                        - Steve Jobs          ║
║                                                              ║
║  ────────────────────────────────────────────────────────    ║
║                                                              ║
║  หลังสอบกลางภาค เราจะกลับมาพัฒนา Term Project ต่อ                ║
║  ด้วยการเรียนรู้ React, การ Integrate ระบบ และอื่นๆ อีกมาก!         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📚 แหล่งข้อมูลเพิ่มเติม

### 📖 Documentation
- **RESTful API Design**: https://restfulapi.net
- **SQLite**: https://www.sqlite.org/docs.html
- **SQL Tutorial**: https://www.w3schools.com/sql/
- **ER Diagram Tools**: https://dbdiagram.io

### 🎥 Video Tutorials
- **REST API Best Practices**: https://www.youtube.com/watch?v=Zczi11HqnCM
- **Database Design**: https://www.youtube.com/watch?v=ztHopE5Wnpc
- **SQL Full Course**: https://www.youtube.com/watch?v=HXV3zeQKqGY

### 📚 Books
- "RESTful Web APIs" by Leonard Richardson
- "Database Design for Mere Mortals" by Michael J. Hernandez
- "SQL Antipatterns" by Bill Karwin

---

```
═══════════════════════════════════════════════════════════════
                    END OF WEEK 7 MATERIALS
                       SEE YOU AT MIDTERM!
═══════════════════════════════════════════════════════════════
```
