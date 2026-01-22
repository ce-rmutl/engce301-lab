# 🔒 คู่มือ HTTPS และ SSL/TLS Certificate
## สำหรับ ENGCE301 Software Design and Development

**ระยะเวลาศึกษา:** 30-45 นาที | **ระดับ:** เริ่มต้น-กลาง

---

## 📋 สารบัญ

1. [HTTPS คืออะไร?](#1-https-คืออะไร)
2. [SSL/TLS Certificate คืออะไร?](#2-ssltls-certificate-คืออะไร)
3. [ประเภทของ Certificate](#3-ประเภทของ-certificate)
4. [Self-Signed Certificate](#4-self-signed-certificate)
5. [วิธีสร้าง Self-Signed Certificate](#5-วิธีสร้าง-self-signed-certificate)
6. [การติดตั้งกับ Nginx](#6-การติดตั้งกับ-nginx)
7. [การทดสอบ HTTPS](#7-การทดสอบ-https)
8. [แก้ปัญหาที่พบบ่อย](#8-แก้ปัญหาที่พบบ่อย)
9. [Best Practices](#9-best-practices)

---

## 1. HTTPS คืออะไร?

### 1.1 คำจำกัดความ

**HTTPS (HyperText Transfer Protocol Secure)** คือ HTTP ที่เพิ่มชั้นความปลอดภัยด้วย SSL/TLS encryption

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HTTP vs HTTPS                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   HTTP (Port 80)                    HTTPS (Port 443)                │
│   ─────────────────                 ──────────────────              │
│                                                                     │
│   Browser ──────────► Server        Browser ══════════► Server      │
│            Plain Text                        Encrypted              │
│                                                                     │
│   🔓 ไม่เข้ารหัส                    🔒 เข้ารหัสด้วย SSL/TLS               │
│   ❌ อ่านข้อมูลได้ง่าย                ✅ อ่านข้อมูลไม่ได้                     │
│   ❌ แก้ไขข้อมูลระหว่างทางได้         ✅ ตรวจจับการแก้ไขได้                 │
│   ❌ ไม่รู้ว่าเป็น Server จริงหรือไม่    ✅ ยืนยันตัวตน Server ได้              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 ทำไมต้องใช้ HTTPS?

| เหตุผล | รายละเอียด |
|--------|-----------|
| **🔐 Encryption** | เข้ารหัสข้อมูลระหว่าง Client และ Server |
| **✅ Authentication** | ยืนยันว่า Server เป็นตัวจริง |
| **🛡️ Data Integrity** | ตรวจจับว่าข้อมูลถูกแก้ไขระหว่างทางหรือไม่ |
| **📈 SEO Ranking** | Google ให้คะแนน HTTPS สูงกว่า |
| **🌐 Browser Trust** | Browser แสดง 🔒 และไม่แจ้งเตือน |
| **⚖️ Compliance** | กฎหมาย PDPA/GDPR กำหนดให้ใช้ |

### 1.3 HTTPS ทำงานอย่างไร? (TLS Handshake)

```
┌────────────────────────────────────────────────────────────────────┐
│                         TLS Handshake Process                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   Browser                                            Server        │
│      │                                                  │          │
│      │  1. ClientHello                                  │          │
│      │  ─────────────────────────────────────────────►  │          │
│      │  (รองรับ TLS version ไหน, cipher suites)          │          │
│      │                                                  │          │
│      │  2. ServerHello + Certificate                    │          │
│      │  ◄─────────────────────────────────────────────  │          │
│      │  (เลือก TLS version, ส่ง SSL Certificate)          │          │
│      │                                                  │          │
│      │  3. Verify Certificate                           │          │
│      │  ┌─────────────────────┐                         │          │
│      │  │ ตรวจสอบ:            │                         │          │
│      │  │ • ยังไม่หมดอายุ?       │                         │          │
│      │  │ • ออกโดย CA ที่เชื่อถือ? │                         │          │
│      │  │ • Domain ตรงกัน?     │                         │          │
│      │  └─────────────────────┘                         │          │
│      │                                                  │          │
│      │  4. Key Exchange                                 │          │
│      │  ─────────────────────────────────────────────►  │          │
│      │  (สร้าง Session Key ร่วมกัน)                        │          │
│      │                                                  │          │
│      │  5. Encrypted Communication                      │          │
│      │  ◄════════════════════════════════════════════►  │          │
│      │  (ส่งข้อมูลที่เข้ารหัสแล้ว)                              │          │
│      │                                                  │          │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. SSL/TLS Certificate คืออะไร?

### 2.1 คำจำกัดความ

**SSL Certificate** คือไฟล์ดิจิทัลที่ยืนยันตัวตนของ Website และเก็บ Public Key สำหรับเข้ารหัส

```
┌────────────────────────────────────────────────────────────────────┐
│                     SSL Certificate ประกอบด้วย                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  📜 SSL Certificate                                       │    │
│   ├───────────────────────────────────────────────────────────┤    │
│   │                                                           │    │
│   │  Subject (เจ้าของ):                                        │    │
│   │    • Common Name (CN): taskboard.local                    │    │
│   │    • Organization (O): RMUTL                              │    │
│   │    • Country (C): TH                                      │    │
│   │                                                           │    │
│   │  Issuer (ผู้ออก):                                           │    │
│   │    • CA Name: Let's Encrypt / Self-signed                 │    │
│   │                                                           │    │
│   │  Validity (อายุ):                                          │    │
│   │    • Not Before: 2024-01-01                               │    │
│   │    • Not After:  2025-01-01                               │    │
│   │                                                           │    │
│   │  Public Key:                                              │    │
│   │    • Algorithm: RSA 2048-bit                              │    │
│   │    • Key: MIIBIjANBgkqh...                                │    │
│   │                                                           │    │
│   │  Signature:                                               │    │
│   │    • Algorithm: SHA256withRSA                             │    │
│   │    • Value: (Digital Signature จาก CA)                    │    │
│   │                                                           │    │
│   └───────────────────────────────────────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | นามสกุล | หน้าที่ |
|------|---------|--------|
| **Private Key** | `.key`, `.pem` | กุญแจส่วนตัว (เก็บเป็นความลับ!) |
| **Certificate** | `.crt`, `.cer`, `.pem` | ใบรับรอง (แชร์ได้) |
| **CSR** | `.csr` | Certificate Signing Request |
| **CA Bundle** | `.ca-bundle`, `.crt` | Chain of Trust |

### 2.3 SSL vs TLS

| รายการ | SSL | TLS |
|--------|-----|-----|
| **ชื่อเต็ม** | Secure Sockets Layer | Transport Layer Security |
| **Version** | SSL 2.0, 3.0 (เลิกใช้แล้ว) | TLS 1.0, 1.1, 1.2, 1.3 |
| **ปัจจุบัน** | ❌ ไม่ปลอดภัย | ✅ TLS 1.2+ แนะนำ |
| **หมายเหตุ** | คำว่า "SSL" ยังใช้เรียกทั่วไป | TLS 1.3 เร็วและปลอดภัยที่สุด |

---

## 3. ประเภทของ Certificate

### 3.1 จำแนกตามการ Validate

```
┌────────────────────────────────────────────────────────────────────┐
│                    Certificate Validation Levels                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐    │
│  │   DV (Domain)   │  │ OV (Organization)│  │  EV (Extended)  │    │
│  ├─────────────────┤  ├──────────────────┤  ├─────────────────┤    │
│  │                 │  │                  │  │                 │    │
│  │ ✅ ยืนยัน Domain  │  │ ✅ ยืนยัน Domain   │  │ ✅ ยืนยัน Domain  │    │
│  │ ❌ ไม่ยืนยันองค์กร. │  │ ✅ ยืนยันองค์กร     │  │ ✅ ยืนยันองค์กร    │    │
│  │                 │  │                  │  │ ✅ ตรวจสอบละเอียด│    │
│  │                 │  │                  │  │                 │    │
│  │ 🕐 ออกภายนาที    │  │ 🕐 1-3 วัน        │  │ 🕐 1-2 สัปดาห์    │    │
│  │ 💰 ฟรี-ถูก        │  │ 💰 กลาง          │  │ 💰 แพง          │    │
│  │                 │  │                  │  │                 │    │
│  │ 🔒 Blog, ส่วนตัว  │  │ 🏢 Business      │  │ 🏦 Bank, E-comm │    │
│  │                 │  │                  │  │                 │    │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 จำแนกตาม Domain Coverage

| ประเภท | รายละเอียด | ตัวอย่าง |
|--------|-----------|---------|
| **Single Domain** | 1 Domain | `example.com` |
| **Wildcard** | 1 Domain + Subdomains | `*.example.com` |
| **Multi-Domain (SAN)** | หลาย Domain | `example.com`, `example.org` |

### 3.3 จำแนกตามผู้ออก

| ประเภท | ผู้ออก | ใช้งาน |
|--------|-------|-------|
| **Self-Signed** | ตัวเอง | Development, Internal |
| **Private CA** | องค์กร | Enterprise Internal |
| **Public CA** | Let's Encrypt, DigiCert, etc. | Production, Public |

---

## 4. Self-Signed Certificate

### 4.1 Self-Signed คืออะไร?

**Self-Signed Certificate** คือ Certificate ที่ออกและลงชื่อโดยตัวเอง ไม่ผ่าน CA

```
┌────────────────────────────────────────────────────────────────────┐
│              Self-Signed vs CA-Signed Certificate                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   Self-Signed:                      CA-Signed:                     │
│                                                                    │
│   ┌─────────────┐                   ┌─────────────┐                │
│   │  Website    │                   │    CA       │                │
│   │  ─────────  │                   │  (Trusted)  │                │
│   │  Signs own  │                   └──────┬──────┘                │
│   │  certificate│                          │ Signs                 │
│   └─────────────┘                          ▼                       │
│         │                           ┌─────────────┐                │
│         │                           │  Website    │                │
│         │                           │  Certificate│                │
│         │                           └─────────────┘                │
│         ▼                                  │                       │
│   ┌─────────────┐                          ▼                       │
│   │  Browser    │                   ┌─────────────┐                │
│   │  ⚠️ Warning │                   │  Browser    │                │
│   │  Not Trusted│                   │  🔒 Trusted │                │
│   └─────────────┘                   └─────────────┘                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 4.2 ข้อดี-ข้อเสียของ Self-Signed

**✅ ข้อดี:**
- ฟรี ไม่มีค่าใช้จ่าย
- สร้างได้ทันที ไม่ต้องรอ
- เหมาะกับ Development และ Testing
- ใช้ภายในองค์กร (Internal)

**❌ ข้อเสีย:**
- Browser แสดง Warning ⚠️
- ผู้ใช้ต้อง Accept manually
- ไม่เหมาะกับ Production public
- ไม่มีการยืนยันตัวตนจากภายนอก

### 4.3 เมื่อไหร่ควรใช้ Self-Signed?

| สถานการณ์ | ควรใช้? |
|-----------|--------|
| Development/Testing | ✅ ใช่ |
| CI/CD Pipeline | ✅ ใช่ |
| Internal Tools | ✅ ใช่ |
| Lab/Education | ✅ ใช่ |
| Public Website | ❌ ไม่ (ใช้ Let's Encrypt) |
| E-commerce | ❌ ไม่ (ใช้ CA Certificate) |

---

## 5. วิธีสร้าง Self-Signed Certificate

### 5.1 ติดตั้ง OpenSSL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y openssl

# ตรวจสอบ version
openssl version
# OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)
```

### 5.2 วิธีที่ 1: One-Line Command (แนะนำสำหรับ Lab)

```bash
# สร้าง directory เก็บ certificate
sudo mkdir -p /etc/nginx/ssl

# สร้าง certificate แบบ one-line
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/taskboard.key \
    -out /etc/nginx/ssl/taskboard.crt \
    -subj "/C=TH/ST=ChiangMai/L=ChiangMai/O=RMUTL/OU=SoftwareEngineering/CN=taskboard.local"
```

**อธิบาย Parameters:**

| Parameter | ความหมาย |
|-----------|----------|
| `req` | สร้าง Certificate Request |
| `-x509` | สร้าง Self-signed certificate (ไม่ใช่แค่ CSR) |
| `-nodes` | No DES = ไม่เข้ารหัส Private Key ด้วย password |
| `-days 365` | อายุ 365 วัน |
| `-newkey rsa:2048` | สร้าง RSA key ขนาด 2048 bits |
| `-keyout` | ไฟล์ output สำหรับ Private Key |
| `-out` | ไฟล์ output สำหรับ Certificate |
| `-subj` | Subject information (ไม่ต้อง interactive) |

**Subject Fields:**

| Field | ชื่อเต็ม | ตัวอย่าง |
|-------|---------|---------|
| C | Country | TH |
| ST | State/Province | ChiangMai |
| L | Locality/City | ChiangMai |
| O | Organization | RMUTL |
| OU | Organizational Unit | SoftwareEngineering |
| CN | Common Name | taskboard.local |

### 5.3 วิธีที่ 2: Step-by-Step (เข้าใจละเอียด)

**ขั้นตอนที่ 1: สร้าง Private Key**

```bash
# สร้าง RSA Private Key (2048 bits)
openssl genrsa -out taskboard.key 2048

# ตรวจสอบ key
openssl rsa -in taskboard.key -check
# RSA key ok
```

**ขั้นตอนที่ 2: สร้าง Certificate Signing Request (CSR)**

```bash
# สร้าง CSR
openssl req -new -key taskboard.key -out taskboard.csr

# จะถามข้อมูล:
# Country Name (2 letter code) [AU]: TH
# State or Province Name (full name) [Some-State]: ChiangMai
# Locality Name (eg, city) []: ChiangMai
# Organization Name (eg, company) [Internet Widgits Pty Ltd]: RMUTL
# Organizational Unit Name (eg, section) []: SoftwareEngineering
# Common Name (e.g. server FQDN or YOUR name) []: taskboard.local
# Email Address []: (Enter เว้นว่าง)
# A challenge password []: (Enter เว้นว่าง)

# ตรวจสอบ CSR
openssl req -in taskboard.csr -noout -text
```

**ขั้นตอนที่ 3: Sign Certificate (Self-sign)**

```bash
# Sign CSR เป็น Certificate
openssl x509 -req -days 365 \
    -in taskboard.csr \
    -signkey taskboard.key \
    -out taskboard.crt

# ตรวจสอบ certificate
openssl x509 -in taskboard.crt -noout -text
```

### 5.4 วิธีที่ 3: Certificate with SAN (Subject Alternative Name)

**สำหรับหลาย Domain หรือ IP Address**

**ขั้นตอนที่ 1: สร้างไฟล์ config**

```bash
# สร้างไฟล์ san.cnf
cat > san.cnf << 'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
C = TH
ST = ChiangMai
L = ChiangMai
O = RMUTL
OU = SoftwareEngineering
CN = taskboard.local

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = taskboard.local
DNS.2 = www.taskboard.local
DNS.3 = api.taskboard.local
DNS.4 = localhost
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100
EOF
```

**ขั้นตอนที่ 2: สร้าง Certificate ด้วย SAN**

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout taskboard.key \
    -out taskboard.crt \
    -config san.cnf

# ตรวจสอบ SAN
openssl x509 -in taskboard.crt -noout -text | grep -A1 "Subject Alternative Name"
# X509v3 Subject Alternative Name:
#     DNS:taskboard.local, DNS:www.taskboard.local, DNS:api.taskboard.local, DNS:localhost, IP:127.0.0.1, IP:192.168.1.100
```

### 5.5 ตั้งค่า Permissions

```bash
# ย้ายไฟล์ไปที่ที่เหมาะสม
sudo mv taskboard.key /etc/nginx/ssl/
sudo mv taskboard.crt /etc/nginx/ssl/

# ตั้งค่า permissions
sudo chown root:root /etc/nginx/ssl/taskboard.*
sudo chmod 600 /etc/nginx/ssl/taskboard.key   # Private key - เฉพาะ root
sudo chmod 644 /etc/nginx/ssl/taskboard.crt   # Certificate - อ่านได้

# ตรวจสอบ
ls -la /etc/nginx/ssl/
# -rw------- 1 root root 1704 Jan 15 10:00 taskboard.key
# -rw-r--r-- 1 root root 1245 Jan 15 10:00 taskboard.crt
```

---

## 6. การติดตั้งกับ Nginx

### 6.1 Nginx SSL Configuration

```nginx
# /etc/nginx/sites-available/taskboard

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name taskboard.local;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name taskboard.local;

    # ─────────────────────────────────────────────
    # SSL Certificate Configuration
    # ─────────────────────────────────────────────
    ssl_certificate /etc/nginx/ssl/taskboard.crt;
    ssl_certificate_key /etc/nginx/ssl/taskboard.key;

    # ─────────────────────────────────────────────
    # SSL Protocol Settings (Security)
    # ─────────────────────────────────────────────
    # เฉพาะ TLS 1.2 และ 1.3 (ปลอดภัย)
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Cipher Suites (ลำดับความสำคัญ)
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    
    # ─────────────────────────────────────────────
    # SSL Session Settings (Performance)
    # ─────────────────────────────────────────────
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # ─────────────────────────────────────────────
    # Security Headers
    # ─────────────────────────────────────────────
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ─────────────────────────────────────────────
    # Root & Locations
    # ─────────────────────────────────────────────
    root /var/www/taskboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.2 Enable และ Restart

```bash
# ลิงก์ไปยัง sites-enabled
sudo ln -sf /etc/nginx/sites-available/taskboard /etc/nginx/sites-enabled/

# ลบ default site
sudo rm -f /etc/nginx/sites-enabled/default

# ทดสอบ config
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload
sudo systemctl reload nginx
```

### 6.3 Setup hosts file

```bash
# ใน VM
echo "127.0.0.1 taskboard.local" | sudo tee -a /etc/hosts

# ในเครื่อง Local (ต้องแก้ไข hosts file)
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts
# เพิ่มบรรทัด:
# VM_IP    taskboard.local
```

---

## 7. การทดสอบ HTTPS

### 7.1 ทดสอบด้วย OpenSSL

```bash
# ทดสอบ SSL connection
openssl s_client -connect taskboard.local:443 -servername taskboard.local

# Output ที่สำคัญ:
# ---
# Certificate chain
#  0 s:C = TH, ST = ChiangMai, L = ChiangMai, O = RMUTL, OU = SoftwareEngineering, CN = taskboard.local
#    i:C = TH, ST = ChiangMai, L = ChiangMai, O = RMUTL, OU = SoftwareEngineering, CN = taskboard.local
# ---
# SSL handshake has read 1509 bytes and written 392 bytes
# ---
# New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
# ...
# Verify return code: 18 (self-signed certificate)  # <- ปกติสำหรับ self-signed
```

### 7.2 ทดสอบด้วย curl

```bash
# ทดสอบโดยไม่ verify certificate (-k หรือ --insecure)
curl -k https://taskboard.local
curl -k https://taskboard.local/api/health

# ทดสอบและแสดง certificate info
curl -k -v https://taskboard.local 2>&1 | grep -E "(SSL|subject|issuer|expire)"

# ทดสอบ HTTP redirect
curl -I http://taskboard.local
# HTTP/1.1 301 Moved Permanently
# Location: https://taskboard.local/
```

### 7.3 ทดสอบด้วย Browser

**ขั้นตอน:**

1. เปิด Browser ไปที่ `https://taskboard.local`

2. จะเห็น Warning "Your connection is not private" หรือ "NET::ERR_CERT_AUTHORITY_INVALID"

3. Click **Advanced** → **Proceed to taskboard.local (unsafe)**

4. ดู Certificate details:
   - Chrome: Click 🔒 → Certificate
   - Firefox: Click 🔒 → More Information → View Certificate

**สิ่งที่ต้องตรวจสอบ:**

| รายการ | ค่าที่คาดหวัง |
|--------|-------------|
| Common Name | taskboard.local |
| Issuer | (Self-signed - เหมือน Subject) |
| Valid From | วันที่สร้าง |
| Valid Until | +365 วัน |
| Public Key | RSA 2048 bit |

### 7.4 ทดสอบด้วย Script

**สร้างไฟล์ `test-ssl.sh`:**

```bash
#!/bin/bash
# test-ssl.sh - SSL/HTTPS Test Script

HOST="taskboard.local"
PORT="443"

echo "═══════════════════════════════════════════════════════"
echo "  🔒 SSL/HTTPS Test for $HOST"
echo "═══════════════════════════════════════════════════════"
echo ""

# Test 1: Check if port is open
echo "1. Testing port $PORT..."
if nc -z -w5 $HOST $PORT 2>/dev/null; then
    echo "   ✅ Port $PORT is open"
else
    echo "   ❌ Port $PORT is closed"
    exit 1
fi

# Test 2: Check SSL certificate
echo ""
echo "2. Checking SSL certificate..."
CERT_INFO=$(echo | openssl s_client -connect $HOST:$PORT -servername $HOST 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null)
if [ -n "$CERT_INFO" ]; then
    echo "   ✅ SSL certificate found"
    echo "$CERT_INFO" | sed 's/^/   /'
else
    echo "   ❌ Cannot retrieve certificate"
fi

# Test 3: Check TLS version
echo ""
echo "3. Checking TLS version..."
TLS_VERSION=$(echo | openssl s_client -connect $HOST:$PORT -servername $HOST 2>/dev/null | grep "Protocol" | head -1)
echo "   $TLS_VERSION"

# Test 4: Check cipher
echo ""
echo "4. Checking cipher..."
CIPHER=$(echo | openssl s_client -connect $HOST:$PORT -servername $HOST 2>/dev/null | grep "Cipher" | head -1)
echo "   $CIPHER"

# Test 5: HTTP redirect
echo ""
echo "5. Testing HTTP redirect..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST 2>/dev/null)
if [ "$HTTP_CODE" = "301" ]; then
    echo "   ✅ HTTP redirects to HTTPS (301)"
else
    echo "   ⚠️ HTTP response: $HTTP_CODE"
fi

# Test 6: HTTPS response
echo ""
echo "6. Testing HTTPS response..."
HTTPS_CODE=$(curl -s -k -o /dev/null -w "%{http_code}" https://$HOST 2>/dev/null)
if [ "$HTTPS_CODE" = "200" ]; then
    echo "   ✅ HTTPS works (200 OK)"
else
    echo "   ⚠️ HTTPS response: $HTTPS_CODE"
fi

# Test 7: API through HTTPS
echo ""
echo "7. Testing API through HTTPS..."
API_RESPONSE=$(curl -s -k https://$HOST/api/health 2>/dev/null)
if echo "$API_RESPONSE" | grep -q "success"; then
    echo "   ✅ API responds through HTTPS"
else
    echo "   ⚠️ API response: $API_RESPONSE"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Test completed!"
echo "═══════════════════════════════════════════════════════"
```

```bash
# รัน test
chmod +x test-ssl.sh
./test-ssl.sh
```

### 7.5 ดู Certificate Details

```bash
# แสดงข้อมูล certificate ทั้งหมด
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -text

# แสดงเฉพาะ subject
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -subject

# แสดงเฉพาะ issuer
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -issuer

# แสดงวันหมดอายุ
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -dates

# แสดง fingerprint
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -fingerprint -sha256

# แสดง SAN (Subject Alternative Name)
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -ext subjectAltName
```

---

## 8. แก้ปัญหาที่พบบ่อย

### 8.1 Error: Permission denied

```bash
# ปัญหา
nginx: [emerg] cannot load certificate key "/etc/nginx/ssl/taskboard.key": Permission denied

# แก้ไข
sudo chmod 600 /etc/nginx/ssl/taskboard.key
sudo chown root:root /etc/nginx/ssl/taskboard.key
sudo systemctl restart nginx
```

### 8.2 Error: Certificate not found

```bash
# ปัญหา
nginx: [emerg] cannot load certificate "/etc/nginx/ssl/taskboard.crt": No such file or directory

# ตรวจสอบ
ls -la /etc/nginx/ssl/

# แก้ไข - สร้างใหม่
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/taskboard.key \
    -out /etc/nginx/ssl/taskboard.crt \
    -subj "/CN=taskboard.local"
```

### 8.3 Error: SSL_ERROR_RX_RECORD_TOO_LONG

```bash
# ปัญหา: เข้า HTTPS แต่ server ส่ง HTTP กลับมา
# สาเหตุ: listen 443 แต่ไม่มี ssl directive

# ตรวจสอบ config
grep -n "listen 443" /etc/nginx/sites-available/taskboard
# ต้องมี: listen 443 ssl;

# แก้ไขให้ถูกต้อง
listen 443 ssl http2;
```

### 8.4 Error: Certificate expired

```bash
# ตรวจสอบวันหมดอายุ
openssl x509 -in /etc/nginx/ssl/taskboard.crt -noout -dates

# ถ้าหมดอายุแล้ว สร้างใหม่
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/taskboard.key \
    -out /etc/nginx/ssl/taskboard.crt \
    -subj "/CN=taskboard.local"

sudo systemctl reload nginx
```

### 8.5 Error: ERR_CERT_COMMON_NAME_INVALID

```bash
# ปัญหา: Domain ที่เข้าไม่ตรงกับ CN หรือ SAN
# เช่น เข้า https://192.168.1.100 แต่ cert เป็น taskboard.local

# แก้ไข: สร้าง certificate ใหม่ด้วย SAN ที่รวม IP
# ดูหัวข้อ 5.4 วิธีที่ 3
```

### 8.6 Browser ยังแสดง Warning ทั้งที่ Certificate ถูกต้อง

**Chrome:**
```
chrome://flags/#allow-insecure-localhost
Enable แล้ว Relaunch
```

**Firefox:**
```
about:config
security.enterprise_roots.enabled = true
```

---

## 9. Best Practices

### 9.1 Security Best Practices

```nginx
# ✅ ใช้ TLS 1.2+ เท่านั้น
ssl_protocols TLSv1.2 TLSv1.3;

# ✅ ใช้ Strong Ciphers
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

# ✅ Enable HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# ✅ Disable SSL session tickets (for Perfect Forward Secrecy)
ssl_session_tickets off;
```

### 9.2 Performance Best Practices

```nginx
# ✅ Enable SSL session cache
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# ✅ Enable HTTP/2
listen 443 ssl http2;

# ✅ Enable OCSP Stapling (สำหรับ CA certificate)
ssl_stapling on;
ssl_stapling_verify on;
```

### 9.3 Key Management

```bash
# ✅ ตั้ง permissions ที่เหมาะสม
chmod 600 private.key   # เฉพาะ owner อ่านได้
chmod 644 certificate.crt

# ✅ ไม่เก็บ key ใน version control
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore

# ✅ Backup certificates
cp /etc/nginx/ssl/* /backup/ssl/
```

### 9.4 สำหรับ Production

| Environment | แนะนำ |
|-------------|------|
| **Development** | Self-signed Certificate |
| **Staging** | Let's Encrypt (Free) |
| **Production** | Let's Encrypt หรือ Commercial CA |

**Let's Encrypt (Free, Automated):**
```bash
# ติดตั้ง Certbot
sudo apt install certbot python3-certbot-nginx

# สร้าง certificate
sudo certbot --nginx -d example.com

# Auto-renew
sudo certbot renew --dry-run
```

---

## 📚 สรุป

### Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SSL/HTTPS Quick Reference                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔧 สร้าง Self-Signed Certificate:                                   │
│  ─────────────────────────────────────────────────────────────────  │
│  sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \         │
│      -keyout /etc/nginx/ssl/site.key \                              │
│      -out /etc/nginx/ssl/site.crt \                                 │
│      -subj "/CN=domain.local"                                       │
│                                                                     │
│  🔍 ตรวจสอบ Certificate:                                            │
│  ─────────────────────────────────────────────────────────────────  │
│  openssl x509 -in cert.crt -noout -text                             │
│  openssl x509 -in cert.crt -noout -dates                            │
│                                                                     │
│  🧪 ทดสอบ SSL:                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  openssl s_client -connect host:443                                 │
│  curl -k https://host/                                              │
│                                                                     │
│  📁 Nginx Config:                                                   │
│  ─────────────────────────────────────────────────────────────────  │
│  listen 443 ssl http2;                                              │
│  ssl_certificate /etc/nginx/ssl/site.crt;                           │
│  ssl_certificate_key /etc/nginx/ssl/site.key;                       │
│  ssl_protocols TLSv1.2 TLSv1.3;                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*ENGCE301 - Software Design and Development*  
*เอกสารประกอบ: HTTPS และ SSL/TLS Certificate*
