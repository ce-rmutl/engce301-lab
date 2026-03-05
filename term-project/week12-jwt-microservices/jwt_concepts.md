# 🎫 หลักการ JWT (JSON Web Token) — อย่างละเอียด
## ENGSE207 Software Architecture — เอกสารประกอบการเรียน

---

## 📋 สารบัญ

1. [JWT คืออะไร?](#1-jwt-คืออะไร)
2. [โครงสร้าง JWT](#2-โครงสร้าง-jwt)
3. [วิธีสร้างและตรวจสอบ JWT](#3-วิธีสร้างและตรวจสอบ-jwt)
4. [JWT Authentication Flow](#4-jwt-authentication-flow)
5. [JWT Claims ที่สำคัญ](#5-jwt-claims-ที่สำคัญ)
6. [Algorithms ที่ใช้กับ JWT](#6-algorithms-ที่ใช้กับ-jwt)
7. [JWT vs Session](#7-jwt-vs-session-เปรียบเทียบ)
8. [Security Best Practices](#8-security-best-practices)
9. [ช่องโหว่ที่พบบ่อย](#9-ช่องโหว่ที่พบบ่อย)
10. [ตัวอย่าง Code ใน Node.js](#10-ตัวอย่าง-code-ใน-nodejs)
11. [สรุปและ Cheat Sheet](#11-สรุปและ-cheat-sheet)

---

## 1. JWT คืออะไร?

**JWT (JSON Web Token)** คือมาตรฐาน (RFC 7519) สำหรับส่งข้อมูลระหว่างฝ่ายต่างๆ อย่างปลอดภัยในรูปแบบ JSON object ที่:
- **Compact** — ขนาดเล็ก ส่งผ่าน HTTP Header หรือ URL ได้
- **Self-contained** — มีข้อมูลครบอยู่ในตัวเอง ไม่ต้องไปค้นหาใน DB ทุกครั้ง
- **Verifiable** — ตรวจสอบได้ว่าถูกปลอมแปลงหรือหมดอายุหรือไม่

```
┌─────────────────────────────────────────────────────────────────────┐
│                     JWT ในชีวิตประจำวัน                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   เปรียบได้กับ: บัตรนักศึกษา RMUTL                                     │
│                                                                     │
│   ┌──────────────────────────────────────────────────┐              │
│   │  🎓 RMUTL Student Card                           │              │
│   │  ─────────────────────────────────────────────  │              │
│   │  Name:      สมชาย รักเรียน                          │              │
│   │  ID:        63XXXXXXXXXX                          │              │
│   │  Dept:      Software Engineering                  │              │
│   │  Valid:     2023 – 2027                           │              │
│   │  ─────────────────────────────────────────────  │              │
│   │  [มหาวิทยาลัยประทับตราตรวจสอบได้]                     │              │
│   └──────────────────────────────────────────────────┘              │
│                                                                     │
│   • บัตร = JWT                                                      │
│   • ข้อมูลในบัตร = Payload (อ่านได้)                                    │
│   • ตราประทับ = Signature (ยืนยันความถูกต้อง)                            │
│   • วันหมดอายุ = exp claim                                           │
│   • ออกโดยมหาวิทยาลัย = ออกโดย Auth Service                           │
│                                                                     │
│   ไม่ต้องโทรไปถามมหาวิทยาลัยทุกครั้ง ว่าบัตรนี้จริงหรือเปล่า             │
│   แค่ตรวจสอบตราประทับก็รู้แล้ว! ← นี่คือแนวคิดหลักของ JWT               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### ใช้ JWT ทำอะไรได้บ้าง?

| Use Case | ตัวอย่าง |
|----------|---------|
| **Authentication** | Login ครั้งเดียว → ใช้ Token แทนการ Login ซ้ำ |
| **Authorization** | Token บอก Role/Permission ว่าทำอะไรได้บ้าง |
| **Information Exchange** | ส่งข้อมูลระหว่าง Services อย่างปลอดภัย |
| **Single Sign-On (SSO)** | Login ที่ระบบเดียว → เข้าได้ทุกระบบ |

---

## 2. โครงสร้าง JWT

JWT ประกอบด้วย **3 ส่วน** คั่นด้วยจุด (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiJ1c2VyLTAwMSIsIm5hbWUiOiLguKrguLnguJfguKkiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│              │                                          │               │
│   Header     │           Payload                        │  Signature    │
│  (Base64URL) │         (Base64URL)                      │  (Base64URL)  │
```

### 2.1 Header

บอกว่า JWT ใช้ algorithm อะไรในการสร้าง Signature

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

หลัง Base64URL encode: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

| Field | ความหมาย |
|-------|---------|
| `alg` | Algorithm ที่ใช้ เช่น HS256, RS256 |
| `typ` | Type = "JWT" เสมอ |

### 2.2 Payload (Claims)

ข้อมูลที่ต้องการส่ง — แบ่งเป็น 3 ประเภท:

```json
{
  "sub": "user-001",
  "name": "สมชาย รักเรียน",
  "email": "somchai@example.com",
  "role": "member",
  "iat": 1700000000,
  "exp": 1700003600,
  "iss": "task-board-auth"
}
```

**Registered Claims** (มาตรฐาน RFC 7519):

| Claim | ชื่อเต็ม | ความหมาย | ตัวอย่าง |
|-------|---------|---------|---------|
| `sub` | Subject | ID ของ user/entity | `"user-001"` |
| `iss` | Issuer | ใครออก token | `"task-board-auth"` |
| `aud` | Audience | ใครรับ token | `"task-service"` |
| `exp` | Expiration | หมดอายุเมื่อไหร่ (Unix timestamp) | `1700003600` |
| `iat` | Issued At | ออกเมื่อไหร่ | `1700000000` |
| `nbf` | Not Before | ใช้ได้ตั้งแต่เมื่อไหร่ | `1700000000` |
| `jti` | JWT ID | ID เฉพาะของ token | `"abc-123"` |

**Public/Private Claims** (กำหนดเอง):
```json
{
  "name": "สมชาย รักเรียน",
  "role": "member",
  "department": "software-engineering"
}
```

> ⚠️ **คำเตือนสำคัญ:** Payload แค่ **Base64URL encode** เท่านั้น — ไม่ได้เข้ารหัส!
> ใครก็ถอดรหัสอ่านได้ อย่าเก็บข้อมูลลับเช่น password, credit card ไว้ใน Payload

### 2.3 Signature

คือ "ลายเซ็น" ที่ยืนยันว่า token ไม่ถูกปลอมแปลง

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

```
┌────────────────────────────────────────────────────────────────────┐
│              การทำงานของ Signature                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   ฝั่งออก Token (Auth Service):                                     │
│   ─────────────────────────────                                    │
│   header  = base64url({ alg, typ })                                │
│   payload = base64url({ sub, role, exp, ... })                     │
│   signature = HMAC-SHA256(header + "." + payload, SECRET_KEY)      │
│   token = header + "." + payload + "." + signature                 │
│                                                                    │
│   ฝั่งตรวจสอบ Token (Task Service):                                  │
│   ──────────────────────────────────                               │
│   1. แยก token เป็น 3 ส่วน                                           │
│   2. คำนวณ signature ใหม่จาก header+payload+SECRET_KEY              │
│   3. เปรียบเทียบกับ signature ที่ได้รับ                                 │
│   4. ถ้าตรง → token ไม่ถูกแก้ไข ✅                                    │
│      ถ้าไม่ตรง → token ถูกปลอมแปลง ❌                                 │
│   5. ตรวจ exp → ถ้าเกินเวลา → token หมดอายุ ❌                        │
│                                                                    │
│   💡 Key Insight:                                                  │
│   Attacker แก้ Payload ได้ (เช่น เปลี่ยน role: "member" → "admin")   │
│   แต่ signature จะไม่ตรงอีกต่อไป เพราะ Attacker ไม่รู้ SECRET_KEY!   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. วิธีสร้างและตรวจสอบ JWT

### 3.1 ลองถอดรหัส JWT ด้วยมือ

```bash
# เอา JWT ตัวอย่างมา decode
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsInJvbGUiOiJtZW1iZXIifQ.abc123"

# แยกส่วน Payload (ส่วนที่ 2)
echo $TOKEN | cut -d'.' -f2 | base64 -d 2>/dev/null
# Output: {"sub":"user-001","role":"member"}
```

### 3.2 ใช้ JWT Debugger

เปิด https://jwt.io แล้ว paste token เพื่อดู:
- Header และ Payload ที่ถอดรหัสแล้ว
- ตรวจสอบ Signature ด้วย secret

```
┌───────────────────────────────────────────────────────────────────┐
│  ทดลองที่ jwt.io:                                                    │
│                                                                   │
│  1. เปิด https://jwt.io                                            │
│  2. ด้านซ้าย: วาง JWT Token ที่ได้จาก Login                          │
│  3. ด้านขวา: เห็น Header, Payload ที่ถูก decode                      │
│  4. ใส่ Secret ใน "your-256-bit-secret" → ตรวจว่า signature ถูก     │
│                                                                   │
│  🎯 สังเกต: เปลี่ยน role ใน payload แล้ว signature จะ invalid ทันที  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 4. JWT Authentication Flow

### 4.1 Flow แบบ Stateless (ที่เราใช้ใน Lab)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   JWT Authentication Flow (Stateless)                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Browser          API Gateway         Auth Service       Task Service   │
│      │                  │                   │                  │         │
│      │                  │                   │                  │         │
│      │  1. POST /api/auth/login             │                  │         │
│      │  { email, password }                 │                  │         │
│      │──────────────────►│                  │                  │         │
│      │                  │                   │                  │         │
│      │                  │ 2. Forward        │                  │         │
│      │                  │────────────────►  │                  │         │
│      │                  │                   │                  │         │
│      │                  │                   │ 3. ค้นหา user     │         │
│      │                  │                   │    ใน DB          │         │
│      │                  │                   │                  │         │
│      │                  │                   │ 4. bcrypt.compare│         │
│      │                  │                   │    (password)     │         │
│      │                  │                   │                  │         │
│      │                  │                   │ 5. jwt.sign(     │         │
│      │                  │                   │   { sub, role,   │         │
│      │                  │                   │     exp },       │         │
│      │                  │                   │     SECRET )     │         │
│      │                  │                   │                  │         │
│      │                  │ 6. { token }      │                  │         │
│      │                  │◄────────────────  │                  │         │
│      │                  │                   │                  │         │
│      │ 7. token         │                   │                  │         │
│      │◄─────────────────│                   │                  │         │
│      │                  │                   │                  │         │
│      │ (เก็บ token ไว้)  │                   │                  │         │
│      │                  │                   │                  │         │
│  ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ──        │
│                                                                          │
│      │  8. GET /api/tasks/                  │                  │         │
│      │  Authorization: Bearer <token>       │                  │         │
│      │──────────────────►│                  │                  │         │
│      │                  │                   │                  │         │
│      │                  │ 9. jwt.verify(    │                  │         │
│      │                  │    token, SECRET) │                  │         │
│      │                  │    → decoded      │                  │         │
│      │                  │                   │                  │         │
│      │                  │ 10. Forward + X-User-ID header      │         │
│      │                  │──────────────────────────────────►  │         │
│      │                  │                   │                  │         │
│      │                  │                   │                  │ 11. ค้นหา│
│      │                  │                   │                  │    tasks │
│      │                  │                   │                  │    ของ user│
│      │                  │                   │                  │         │
│      │                  │ 12. { tasks }                        │         │
│      │                  │◄────────────────────────────────────│         │
│      │                  │                   │                  │         │
│      │ 13. { tasks }    │                   │                  │         │
│      │◄─────────────────│                   │                  │         │
│      │                  │                   │                  │         │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Token Storage: เก็บ JWT ที่ไหน?

```
┌────────────────────────────────────────────────────────────────────────┐
│                    ตัวเลือกการเก็บ JWT Token                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. localStorage (ที่ใช้ใน Lab นี้)                                       │
│     ┌────────────────────────────────────────────────────────┐        │
│     │  localStorage.setItem('token', jwt)                    │        │
│     │  localStorage.getItem('token')                         │        │
│     └────────────────────────────────────────────────────────┘        │
│     ✅ ง่าย ทำ Auto-login ได้                                            │
│     ❌ ถูก XSS attack ขโมยได้ (script อ่าน localStorage ได้)             │
│                                                                        │
│  2. sessionStorage                                                     │
│     ✅ หายเมื่อปิด browser tab                                           │
│     ❌ ยังถูก XSS ขโมยได้                                                │
│                                                                        │
│  3. HttpOnly Cookie (แนะนำ Production)                                 │
│     ┌────────────────────────────────────────────────────────┐        │
│     │  Set-Cookie: jwt=<token>; HttpOnly; Secure; SameSite=Strict│     │
│     └────────────────────────────────────────────────────────┘        │
│     ✅ JavaScript อ่านไม่ได้ → ป้องกัน XSS                               │
│     ❌ ต้องระวัง CSRF attack (ใช้ SameSite=Strict ป้องกัน)               │
│                                                                        │
│  4. Memory (In-memory)                                                 │
│     ✅ ปลอดภัยที่สุด — ไม่เก็บถาวร                                        │
│     ❌ Refresh page → logout ทันที                                      │
│                                                                        │
│  📌 สำหรับ Lab: localStorage ง่ายดี                                      │
│     สำหรับ Production: HttpOnly Cookie                                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. JWT Claims ที่สำคัญ

### 5.1 `exp` — Expiration Time

```javascript
// ออก token อายุ 1 ชั่วโมง
const token = jwt.sign(
  { sub: 'user-001', role: 'member' },
  SECRET,
  { expiresIn: '1h' }  // หรือ 3600 (วินาที)
);

// เมื่อ verify
try {
  const decoded = jwt.verify(token, SECRET);
  // ✅ token ยังใช้ได้
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    // ❌ token หมดอายุแล้ว → บอก user ให้ login ใหม่
  }
}
```

**แนวทางการกำหนด expiry:**

| ประเภทระบบ | Access Token | Refresh Token |
|-----------|-------------|---------------|
| Banking / High Security | 5-15 นาที | 1 วัน |
| Enterprise App | 1 ชั่วโมง | 7 วัน |
| Social Media / Low Risk | 24 ชั่วโมง | 30 วัน |
| Lab/Development | 7 วัน | ไม่จำเป็น |

### 5.2 `sub` — Subject

ควรเป็น **ID ที่ไม่เปลี่ยน** ของ user (อย่าใช้ email เพราะเปลี่ยนได้)

```javascript
// ✅ ดี: ใช้ UUID หรือ ID ที่ไม่เปลี่ยน
{ "sub": "user-001" }         // simple ID
{ "sub": "550e8400-e29b..." } // UUID

// ❌ ไม่ดี: ใช้ email (เปลี่ยนได้)
{ "sub": "alice@example.com" }
```

### 5.3 `role` / Custom Claims

```javascript
// ตัวอย่าง custom claims สำหรับ Task Board
{
  "sub": "user-001",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "member",           // สิทธิ์ทั่วไป
  "permissions": [            // สิทธิ์ละเอียด (optional)
    "create_task",
    "edit_own_task"
  ],
  "iat": 1700000000,
  "exp": 1700003600
}
```

---

## 6. Algorithms ที่ใช้กับ JWT

```
┌────────────────────────────────────────────────────────────────────┐
│              JWT Signing Algorithms                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  HMAC (Symmetric) — 1 key สำหรับทั้ง sign และ verify               │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  HS256, HS384, HS512                                      │     │
│  │                                                          │     │
│  │  Auth Service ──sign──► JWT                              │     │
│  │                                 JWT ──verify──► Service  │     │
│  │         SECRET_KEY ──────────────────────────────────►   │     │
│  │         (shared)                                         │     │
│  │                                                          │     │
│  │  ✅ เร็ว, ง่าย, เหมาะสำหรับ microservices ที่ trust กัน    │     │
│  │  ❌ ทุก service ต้องรู้ secret → risk ถ้า service โดน hack │     │
│  │                                                          │     │
│  │  ✅ ใช้ใน Lab นี้                                          │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  RSA / ECDSA (Asymmetric) — คนละ key สำหรับ sign และ verify        │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  RS256, RS384, RS512, ES256                               │     │
│  │                                                          │     │
│  │  Auth Service ──[Private Key]──sign──► JWT               │     │
│  │                                    JWT ──[Public Key]──► │     │
│  │                                           verify         │     │
│  │                                                          │     │
│  │  ✅ Services อื่นรู้แค่ Public Key → ปลอดภัยกว่า           │     │
│  │  ✅ เหมาะกับ Multi-tenant, Public API                     │     │
│  │  ❌ ช้ากว่า HMAC เล็กน้อย ซับซ้อนกว่า                      │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  📌 เลือก:                                                         │
│  • Single organization, Internal services → HS256 (ง่าย)          │
│  • Public API, Multiple parties → RS256 (ปลอดภัยกว่า)              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 7. JWT vs Session เปรียบเทียบ

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       JWT vs Session-based Auth                            │
├───────────────────────┬────────────────────────────────────────────────────┤
│   Session             │   JWT                                              │
├───────────────────────┼────────────────────────────────────────────────────┤
│                       │                                                    │
│ Server เก็บ state:    │ Server ไม่เก็บ state:                              │
│ session_id → user_data│ ข้อมูลอยู่ใน token ทั้งหมด                           │
│                       │                                                    │
│  Browser              │  Browser                                           │
│    │ Cookie: sess_id  │    │ Header: Bearer token                         │
│    ▼                  │    ▼                                               │
│  Server               │  Server                                            │
│    │ ค้นใน Session DB  │    │ verify token เท่านั้น                          │
│    │ (Redis/Memory)   │    │ (ไม่ต้องค้น DB)                                │
│    ▼                  │    ▼                                               │
│  Session Data         │  Decoded Payload                                   │
│                       │                                                    │
├───────────────────────┼────────────────────────────────────────────────────┤
│  ✅ Revoke ได้ทันที    │  ❌ Revoke ยาก (ต้องรอ expire)                      │
│  ✅ เก็บข้อมูลเยอะได้   │  ✅ Stateless (Scalable)                          │
│  ❌ ต้องมี Session DB  │  ✅ ไม่ต้อง DB สำหรับ verify                       │
│  ❌ Scale ยาก (sticky) │  ✅ Microservices friendly                         │
│  ✅ ปลอดภัยกว่าสำหรับ  │  ❌ Payload อ่านได้ (Base64)                       │
│     sensitive data    │  ✅ Cross-domain ได้ง่าย                           │
├───────────────────────┴────────────────────────────────────────────────────┤
│  📌 เลือก:                                                                  │
│  • Monolith, Session-critical app → Session                                │
│  • Microservices, Mobile/SPA, Public API → JWT                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Security Best Practices

### 8.1 Secret Key Management

```
┌────────────────────────────────────────────────────────────────────┐
│              JWT Secret Key: Do's and Don'ts                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ✅ DO:                                                            │
│  • ความยาวอย่างน้อย 256 bits (32 bytes) สำหรับ HS256               │
│  • Generate แบบ random:                                            │
│    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
│  • เก็บใน Environment Variable เท่านั้น                              │
│  • ใช้ Secret Manager (AWS Secrets Manager, Vault) ใน Production   │
│  • Rotate key เป็นประจำ                                             │
│                                                                    │
│  ❌ DON'T:                                                         │
│  • ❌ "secret" — สั้นเกินไป, คาดเดาได้                              │
│  • ❌ "mysecretkey123" — ง่ายเกินไป                                 │
│  • ❌ ใส่ใน code โดยตรง (hardcode)                                   │
│  • ❌ Push ขึ้น Git                                                 │
│  • ❌ ใช้ key เดียวกันทุก environment (dev/staging/prod)             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

```bash
# สร้าง strong secret
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
# Output: aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789+/==abcde...
```

### 8.2 Token Expiry Strategy

```javascript
// Pattern: Short-lived Access Token + Long-lived Refresh Token
const accessToken  = jwt.sign(payload, ACCESS_SECRET,  { expiresIn: '15m' });
const refreshToken = jwt.sign(
  { sub: user.id, jti: uuidv4() },  // jti ช่วย revoke ได้
  REFRESH_SECRET,
  { expiresIn: '7d' }
);

// เก็บ refreshToken ใน DB เพื่อ revoke ได้
await db.query(
  'INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES ($1,$2,$3)',
  [decoded.jti, user.id, new Date(decoded.exp * 1000)]
);
```

### 8.3 Token Validation Checklist

```
┌────────────────────────────────────────────────────────────────────┐
│              JWT Validation Checklist (ทุกครั้งที่ verify)             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ☐ 1. ตรวจ Format: ต้องมี 3 ส่วนคั่นด้วย "."                          │
│  ☐ 2. ตรวจ Algorithm: alg ต้องเป็นที่อนุญาต (ไม่ใช่ "none")          │
│  ☐ 3. ตรวจ Signature: ต้องตรงกับ header+payload ด้วย SECRET          │
│  ☐ 4. ตรวจ exp: ต้องไม่หมดอายุ                                       │
│  ☐ 5. ตรวจ nbf (ถ้ามี): ต้องถึงเวลาที่ใช้ได้แล้ว                      │
│  ☐ 6. ตรวจ iss (ถ้า strict): ต้องออกโดย issuer ที่ถูกต้อง              │
│  ☐ 7. ตรวจ aud (ถ้า strict): ต้องเป็น audience ที่ถูกต้อง              │
│                                                                    │
│  jsonwebtoken library ทำ 1-5 ให้อัตโนมัติเมื่อเรียก jwt.verify()     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

```javascript
// Strict validation
const decoded = jwt.verify(token, SECRET, {
  algorithms: ['HS256'],        // อนุญาตแค่ HS256
  issuer: 'task-board-auth',   // ตรวจ iss
  audience: 'task-service',    // ตรวจ aud
});
```

---

## 9. ช่องโหว่ที่พบบ่อย

### 9.1 "alg: none" Attack

```
┌────────────────────────────────────────────────────────────────────┐
│              "alg: none" Attack                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Attacker ส่ง token ที่มี header:                                   │
│  { "alg": "none", "typ": "JWT" }                                   │
│                                                                    │
│  และ payload ที่แก้ไขแล้ว:                                          │
│  { "sub": "user-001", "role": "admin" }  ← เปลี่ยน role เป็น admin!│
│                                                                    │
│  ถ้า library ไม่ตรวจ alg → ไม่มี signature verification → ผ่าน!    │
│                                                                    │
│  ป้องกัน: ระบุ algorithms ที่อนุญาตอย่างชัดเจน                       │
│  jwt.verify(token, secret, { algorithms: ['HS256'] })              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 9.2 Weak Secret Attack

```
ถ้า secret = "secret" หรือ "password" หรือ "1234"
Attacker ใช้ brute-force เดา secret ได้ → ออก token ปลอมได้

ป้องกัน: ใช้ random secret ยาว 32+ bytes
```

### 9.3 JWT ใน URL

```
❌ อย่าใส่ JWT ใน URL:
GET /api/tasks?token=eyJhbGci...

ปัญหา:
• ถูกบันทึกใน server logs
• ถูก cache โดย browser
• ถูก leak ผ่าน Referer header

✅ ใส่ใน Authorization header เสมอ:
GET /api/tasks
Authorization: Bearer eyJhbGci...
```

### 9.4 Missing Token Revocation

```
JWT เป็น stateless → server ไม่รู้ว่า token ถูก "ยกเลิก" แล้วหรือเปล่า

ตัวอย่างปัญหา:
• User logout → แต่ token ยังใช้ได้จนหมดอายุ
• User เปลี่ยน password → token เก่ายังใช้ได้
• Admin suspend account → token ยังใช้ได้

วิธีแก้:
1. Token Expiry สั้น (15-60 นาที)
2. Token Blacklist (เก็บ revoked tokens ใน Redis)
3. Refresh Token Pattern
```

---

## 10. ตัวอย่าง Code ใน Node.js

### 10.1 Installation

```bash
npm install jsonwebtoken bcryptjs
```

### 10.2 Complete Auth Example

```javascript
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET  = process.env.JWT_SECRET || 'dev-secret';
const EXPIRES = '1h';

// ── สร้าง Token ──────────────────────────────────────────────────
function createToken(user) {
  const payload = {
    sub:   user.id,      // Subject: user ID
    email: user.email,
    role:  user.role,
    // iat และ exp จะถูกเพิ่มโดยอัตโนมัติ
  };

  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRES,
    issuer:    'task-board-auth',
  });
}

// ── ตรวจสอบ Token ─────────────────────────────────────────────────
function checkToken(token) {
  try {
    return jwt.verify(token, SECRET, {
      algorithms: ['HS256'],
      issuer: 'task-board-auth',
    });
  } catch (err) {
    // err.name: TokenExpiredError | JsonWebTokenError | NotBeforeError
    throw err;
  }
}

// ── Middleware สำหรับ Express ──────────────────────────────────────
function authMiddleware(req, res, next) {
  // 1. ดึง token จาก header
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.slice(7)
    : null;

  // 2. ถ้าไม่มี token
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'กรุณาแนบ JWT token ใน Authorization: Bearer <token>'
    });
  }

  // 3. verify token
  try {
    req.user = checkToken(token);  // ใส่ decoded payload ไว้ใน req.user
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token หมดอายุ กรุณา Login ใหม่'
      : 'Token ไม่ถูกต้อง';
    
    res.status(401).json({ error: err.name, message });
  }
}

// ── Role Guard ─────────────────────────────────────────────────────
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `ต้องการสิทธิ์: ${allowedRoles.join(',')} | คุณมี: ${req.user?.role}`
      });
    }
    next();
  };
}

// ── ตัวอย่างใช้งาน ──────────────────────────────────────────────────
const express = require('express');
const app = express();
app.use(express.json());

// Public endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // สมมติหาจาก DB ได้
  const user = { id: 'user-001', email, role: 'member', passwordHash: '...' };
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createToken(user);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// Protected endpoint
app.get('/tasks', authMiddleware, (req, res) => {
  // req.user = { sub: 'user-001', email: '...', role: 'member', iat, exp }
  res.json({
    message: `Hello ${req.user.email}!`,
    tasks: [/* ... */]
  });
});

// Admin-only endpoint
app.get('/admin/users', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ users: [/* ... */] });
});
```

### 10.3 Token Decode (โดยไม่ verify)

```javascript
// ใช้ decode เพื่อดูข้อมูล payload โดยไม่ตรวจ signature
// (ใช้ฝั่ง client/debug เท่านั้น — อย่าใช้ฝั่ง server!)
const decoded = jwt.decode(token);
console.log(decoded);
// { sub: 'user-001', role: 'member', iat: 1700000000, exp: 1700003600 }

// คำนวณเวลาหมดอายุ
const expiresAt = new Date(decoded.exp * 1000);
console.log('หมดอายุ:', expiresAt.toLocaleString('th-TH'));
```

### 10.4 Refresh Token Pattern (Advanced)

```javascript
// ออก Access Token + Refresh Token
app.post('/auth/login', async (req, res) => {
  // ... verify password ...

  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, jti: require('crypto').randomUUID() },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // เก็บ refresh token hash ใน DB
  await saveRefreshToken(user.id, refreshToken);

  res.json({ accessToken, refreshToken });
});

// ขอ Access Token ใหม่ด้วย Refresh Token
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    
    // ตรวจว่า refresh token ยังใช้ได้ใน DB
    const isValid = await checkRefreshToken(decoded.sub, refreshToken);
    if (!isValid) {
      return res.status(401).json({ error: 'Refresh token revoked' });
    }

    // ออก access token ใหม่
    const user = await getUserById(decoded.sub);
    const newAccessToken = jwt.sign(
      { sub: user.id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

---

## 11. สรุปและ Cheat Sheet

### Quick Reference

```
┌────────────────────────────────────────────────────────────────────────┐
│                         JWT Cheat Sheet                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  โครงสร้าง:                                                             │
│  JWT = Base64URL(Header) . Base64URL(Payload) . Signature              │
│                                                                        │
│  Install:                                                              │
│  npm install jsonwebtoken bcryptjs                                     │
│                                                                        │
│  สร้าง Token:                                                           │
│  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' })          │
│                                                                        │
│  ตรวจสอบ Token:                                                         │
│  const decoded = jwt.verify(token, SECRET)                             │
│                                                                        │
│  Decode โดยไม่ verify:                                                  │
│  const decoded = jwt.decode(token)                                     │
│                                                                        │
│  Error types:                                                          │
│  • TokenExpiredError — token หมดอายุ                                     │
│  • JsonWebTokenError — token ไม่ถูกต้อง / signature ผิด                 │
│  • NotBeforeError — token ยังไม่ถึงเวลาใช้                               │
│                                                                        │
│  ส่งใน HTTP:                                                            │
│  Authorization: Bearer <token>                                         │
│                                                                        │
│  Best Practices:                                                       │
│  ✅ Secret ยาว 32+ bytes random                                         │
│  ✅ เก็บ Secret ใน env var                                               │
│  ✅ ระบุ { algorithms: ['HS256'] } ตอน verify                           │
│  ✅ ตรวจสอบ exp เสมอ                                                     │
│  ✅ ใช้ HttpOnly Cookie ใน Production                                   │
│  ❌ อย่าใส่ password/secret ใน payload                                  │
│  ❌ อย่าใช้ alg: "none"                                                 │
│  ❌ อย่า push .env ขึ้น Git                                              │
│                                                                        │
│  Debug:                                                                │
│  https://jwt.io — decode & verify JWT ออนไลน์                          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### JWT Flow Summary

```
Login Request
     │
     ▼
Auth Service
  ├─ ตรวจ email + bcrypt.compare(password, hash)
  ├─ ถ้าผ่าน → jwt.sign({ sub, role, exp }, SECRET)
  └─ ส่ง token กลับ
         │
         ▼
Client เก็บ token
         │
         ▼  (request ต่อมา)
API Gateway / Service
  ├─ ดึง token จาก Authorization: Bearer <token>
  ├─ jwt.verify(token, SECRET) → decoded payload
  ├─ ตรวจ role/permission
  └─ ให้/ปฏิเสธ access
```

---

## 📚 แหล่งศึกษาเพิ่มเติม

| แหล่ง | URL | เนื้อหา |
|-------|-----|--------|
| JWT.io | https://jwt.io | Interactive debugger, library list |
| RFC 7519 | https://tools.ietf.org/html/rfc7519 | JWT Standard ฉบับเต็ม |
| OWASP JWT | https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html | Security best practices |
| jsonwebtoken npm | https://github.com/auth0/node-jsonwebtoken | Node.js library docs |

---

*Document Version: 1.0*
*Course: ENGSE207 Software Architecture*
*Instructor: นายธนิต เกตุแก้ว*
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
