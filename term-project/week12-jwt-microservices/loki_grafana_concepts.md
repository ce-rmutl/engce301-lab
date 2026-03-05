# 📊 ระบบ Centralized Logging: Loki + Grafana
## ENGSE207 Software Architecture — เอกสารประกอบการเรียน

---

## 📋 สารบัญ

1. [Logging คืออะไร และทำไมถึงสำคัญ?](#1-logging-คืออะไร-และทำไมถึงสำคัญ)
2. [Centralized Logging vs Local Logging](#2-centralized-logging-vs-local-logging)
3. [Loki คืออะไร?](#3-loki-คืออะไร)
4. [Grafana คืออะไร?](#4-grafana-คืออะไร)
5. [สถาปัตยกรรม Loki + Grafana](#5-สถาปัตยกรรม-loki--grafana)
6. [การ Setup ใน Docker](#6-การ-setup-ใน-docker)
7. [LogQL: ภาษาค้นหา Log ของ Loki](#7-logql-ภาษาค้นหา-log-ของ-loki)
8. [Security Logging Patterns](#8-security-logging-patterns)
9. [การสร้าง Dashboard ใน Grafana](#9-การสร้าง-dashboard-ใน-grafana)
10. [Logging Best Practices สำหรับ Node.js](#10-logging-best-practices-สำหรับ-nodejs)
11. [ELK Stack: สำหรับการต่อยอด](#11-elk-stack-สำหรับการต่อยอด)
12. [สรุปและ Cheat Sheet](#12-สรุปและ-cheat-sheet)

---

## 1. Logging คืออะไร และทำไมถึงสำคัญ?

**Log** คือบันทึกเหตุการณ์ที่เกิดขึ้นในระบบ — เหมือนสมุดบันทึกของแอปพลิเคชัน

```
┌──────────────────────────────────────────────────────────────────────┐
│                  Log ในชีวิตประจำวัน                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ระบบ ATM:                                                           │
│  2024-01-15 09:23:41 [INFO]  Card inserted: ****1234                 │
│  2024-01-15 09:23:45 [INFO]  PIN verified: success                   │
│  2024-01-15 09:23:50 [INFO]  Withdrawal: ฿5,000                      │
│  2024-01-15 09:24:01 [INFO]  Transaction complete                    │
│                                                                      │
│  ระบบ Mobile Banking:                                                │
│  2024-01-15 10:15:22 [WARN]  Login failed: wrong password (attempt 1)│
│  2024-01-15 10:15:35 [WARN]  Login failed: wrong password (attempt 2)│
│  2024-01-15 10:15:48 [WARN]  Login failed: wrong password (attempt 3)│
│  2024-01-15 10:15:49 [ERROR] Account locked: too many failed attempts│
│  2024-01-15 10:15:49 [ALERT] Suspicious activity: IP 1.2.3.4 🚨      │
│                                                                      │
│  ถ้าไม่มี Log → ไม่รู้ว่าเกิดอะไรขึ้น ใครโดน attack                            │
│  มี Log → ตรวจสอบย้อนหลังได้ แจ้งเตือนได้ ป้องกันได้                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Log Level Standards

```
FATAL  → ระบบล่ม ต้องหยุดทำงาน
ERROR  → เกิดข้อผิดพลาดที่ต้องแก้ไข (เช่น DB connection failed)
WARN   → มีสิ่งผิดปกติแต่ยังทำงานได้ (เช่น login failed)
INFO   → ข้อมูลทั่วไปที่ควรรู้ (เช่น server started, user logged in)
DEBUG  → ข้อมูลละเอียดสำหรับ debug (เปิดเฉพาะตอน dev)
TRACE  → ข้อมูลละเอียดมากๆ (performance tracing)
```

### Security Log Categories

| ประเภท | ตัวอย่าง |
|--------|---------|
| **Authentication** | Login success/failure, logout |
| **Authorization** | Access denied, permission check |
| **Data Access** | Read/write sensitive data |
| **Configuration** | Settings changed |
| **Anomaly** | Unusual patterns, rate limit hit |

---

## 2. Centralized Logging vs Local Logging

```
┌──────────────────────────────────────────────────────────────────────┐
│              Local Logging (ปัญหา)                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Auth Service          Task Service         User Service            │
│   ┌────────────┐        ┌────────────┐       ┌────────────┐          │
│   │ auth.log   │        │ task.log   │       │ user.log   │          │
│   │ 10:00 Login│        │ 10:01 GET  │       │ 10:02 GET  │          │
│   │ ...        │        │ ...        │       │ ...        │          │
│   └────────────┘        └────────────┘       └────────────┘          │
│        │                     │                     │                 │
│        ?                     ?                     ?                 │
│                                                                      │
│   ปัญหา:                                                              │
│   ❌ ต้องเปิดหลาย terminal เพื่อดู log หลาย service                       │
│   ❌ Container restart → log หาย                                     │
│   ❌ ค้นหา log ข้าม service ยาก                                        │
│   ❌ ไม่รู้ลำดับเหตุการณ์ที่แท้จริง                                            │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│              Centralized Logging (วิธีแก้)                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Auth Service          Task Service          User Service           │
│   ┌────────────┐        ┌────────────┐        ┌────────────┐         │
│   │ stdout     │        │ stdout     │        │ stdout     │         │
│   └─────┬──────┘        └─────┬──────┘        └─────┬──────┘         │
│         │                     │                     │                │
│         └─────────────────────┼─────────────────────┘                │
│                               │                                      │
│                               ▼                                      │
│                    ┌──────────────────────┐                          │
│                    │   Loki (Log Store)   │                          │
│                    │   รวม logs ทุก service│                          │
│                    └──────────┬───────────┘                          │
│                               │                                      │
│                               ▼                                      │
│                    ┌─────────────────────┐                           │
│                    │  Grafana Dashboard  │                           │
│                    │  ค้นหา/ดู/แจ้งเตือน     │                           │
│                    └─────────────────────┘                           │
│                                                                      │
│   ✅ ดู logs ทุก service ในที่เดียว                                       │
│   ✅ ค้นหา logs ข้าม service ได้                                        │
│   ✅ Correlate events: "user X ทำอะไรบ้างใน 5 นาที?"                   │
│   ✅ Alert เมื่อพบ pattern น่าสงสัย                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Loki คืออะไร?

**Loki** คือ log aggregation system ที่สร้างโดย Grafana Labs ได้รับแรงบันดาลใจจาก Prometheus

```
┌───────────────────────────────────────────────────────────────────┐
│                    Loki Architecture                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   แนวคิดหลัก:                                                       │
│   "Logs-as-Metric" — เก็บ index เฉพาะ labels ไม่ใช่เนื้อหา log         │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐    │
│   │                    Loki Components                       │    │
│   │                                                          │    │
│   │  1. Log Entry = Labels + Log Line                        │    │
│   │     Labels:   { job="auth-service", level="error" }      │    │
│   │     Log line: "[AUTH] Login failed: alice@example.com"   │    │
│   │                                                          │    │
│   │  2. Distributor — รับ logs จาก clients                    │    │
│   │                                                          │    │
│   │  3. Ingester — เขียน logs ลง storage                      │    │
│   │                                                          │    │
│   │  4. Querier — ค้นหา logs ด้วย LogQL                        │    │
│   │                                                          │    │
│   │  5. Compactor — compress และ index old logs              │    │
│   └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│   ข้อดีของ Loki:                                                    │
│   ✅ RAM น้อย (index แค่ labels ไม่ใช่ full-text)                     │
│   ✅ Cost ถูก (เก็บใน object storage ได้)                            │
│   ✅ Integrate กับ Grafana ได้ดี                                     │
│   ✅ ง่ายต่อการ setup                                               │
│   ✅ Compatible กับ Prometheus labels                              │
│                                                                   │
│   ข้อเสียของ Loki:                                                  │
│   ❌ Full-text search ช้ากว่า Elasticsearch                         │
│   ❌ Query syntax แตกต่างจาก SQL                                   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### วิธีที่ Docker Services ส่ง Log ไป Loki

**Option 1: Docker Logging Driver (ง่ายที่สุด — ใช้ใน Lab)**

```yaml
# ใน docker-compose.yml
services:
  auth-service:
    logging:
      driver: json-file          # เก็บเป็น JSON file ก่อน
      options:
        max-size: "10m"
        max-file: "3"
        tag: "auth-service"     # label สำหรับค้นหา
```

> ⚠️ Option นี้ไม่ส่ง log ตรงไป Loki แต่เก็บใน Docker json log files
> Loki อ่าน stdout ผ่าน promtail หรือ Docker log driver โดยตรง

**Option 2: Loki Docker Driver (ส่งตรง)**

```yaml
services:
  auth-service:
    logging:
      driver: loki               # ต้อง install plugin ก่อน
      options:
        loki-url: "http://loki:3100/loki/api/v1/push"
        loki-batch-size: "400"
        labels: "service"
        # labels จะเป็น: {service="auth-service", ...}
```

```bash
# ติดตั้ง Loki Docker driver plugin
docker plugin install grafana/loki-docker-driver:latest \
  --alias loki \
  --grant-all-permissions
```

**Option 3: Promtail (agent ทั่วไป)**

```yaml
  promtail:
    image: grafana/promtail:2.9.0
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
```

---

## 4. Grafana คืออะไร?

**Grafana** คือ Open-source analytics and visualization platform — ใช้ดู metrics, logs, traces

```
┌───────────────────────────────────────────────────────────────────┐
│                    Grafana ทำอะไรได้?                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Data Sources ที่รองรับ:                                            │
│   • Loki (Logs)                                                   │
│   • Prometheus (Metrics)                                          │
│   • InfluxDB                                                      │
│   • PostgreSQL, MySQL                                             │
│   • Elasticsearch                                                 │
│   • Jaeger, Tempo (Tracing)                                       │
│   • + 100+ data sources                                           │
│                                                                   │
│   ฟีเจอร์หลัก:                                                       │
│   ┌──────────────────────────────────────────────────────────┐    │
│   │                                                          │    │
│   │   Dashboard        Explore           Alerting            │    │
│   │   ─────────        ───────           ────────            │    │
│   │   • สร้าง panels  • Query logs live  • แจ้งเตือนผ่าน         │    │
│   │   • Visualize     • Debug & search  • Email/Slack/       │    │
│   │   • Share         • ค้นหา patterns  • PagerDuty           │    │
│   │                                                          │    │
│   └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 5. สถาปัตยกรรม Loki + Grafana

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  Task Board Logging Architecture                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Services (Producers)                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│   │ auth-service │  │ task-service │  │ user-service │                  │
│   │  console.log │  │  console.log │  │  console.log │                  │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│          │                 │                 │                          │
│          │    stdout (Docker captures)       │                          │
│          └─────────────────┼─────────────────┘                          │
│                            │                                            │
│                            ▼                                            │
│   ┌─────────────────────────────────────────────┐                       │
│   │         Docker Engine                       │                       │
│   │   json-file driver (default logging)        │                       │
│   │   /var/lib/docker/containers/*/log.json     │                       │
│   └────────────────────┬────────────────────────┘                       │
│                        │                                                │
│              (ใน Lab นี้เราดู logs ผ่าน docker compose logs)                │
│              (Production: ใช้ Loki Docker Driver หรือ Promtail)           │
│                        │                                                │
│                        ▼                                                │
│   ┌─────────────────────────────────────────────┐                       │
│   │                  Loki :3100                 │                       │
│   │   • รับและเก็บ log entries                    │                        │
│   │   • Index: labels (service, level, etc.)    │                       │
│   │   • Storage: /tmp/loki/chunks               │                       │
│   └────────────────────┬────────────────────────┘                       │
│                        │                                                │
│                        ▼                                                │
│   ┌─────────────────────────────────────────────┐                       │
│   │                Grafana :3000                │                       │
│   │   • Datasource: Loki                        │                       │
│   │   • Explore: Query logs ด้วย LogQL           │                       │
│   │   • Dashboard: แสดงกราฟและ log streams      │                       │
│   │   • Alert: แจ้งเตือนเมื่อ error เยอะ          │                       │
│   └─────────────────────────────────────────────┘                       │
│                                                                         │
│   📌 สำหรับ Lab นี้:                                                      │
│   เราดู logs ผ่าน 2 ทาง:                                                  │
│   1. docker compose logs -f (real-time terminal)                        │
│   2. Grafana Explore (http://localhost:3000)                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. การ Setup ใน Docker

### 6.1 docker-compose.yml ส่วน Monitoring

```yaml
services:

  # ── Loki: เก็บ logs ──
  loki:
    image: grafana/loki:2.9.0
    container_name: taskboard-loki
    ports:
      - "3100:3100"    # HTTP API สำหรับรับ logs
    volumes:
      - ./monitoring/loki-config.yaml:/etc/loki/local-config.yaml:ro
      - loki-data:/tmp/loki    # เก็บ data ไว้
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - taskboard-net

  # ── Grafana: Dashboard ──
  grafana:
    image: grafana/grafana:10.0.0
    container_name: taskboard-grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafana-data:/var/lib/grafana
      # Auto-provision Loki datasource
      - ./monitoring/grafana/datasource.yml:/etc/grafana/provisioning/datasources/loki.yml:ro
    depends_on:
      - loki
    networks:
      - taskboard-net

volumes:
  loki-data:
  grafana-data:
```

### 6.2 Loki Config

**`monitoring/loki-config.yaml`:**
```yaml
auth_enabled: false

server:
  http_listen_port: 3100

# Storage แบบ single instance (เหมาะสำหรับ dev/lab)
common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

# Schema config
schema_config:
  configs:
    - from: 2020-10-24
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

# ขีดจำกัดพื้นฐาน
limits_config:
  reject_old_samples: true
  reject_old_samples_max_age: 168h   # 7 วัน
  ingestion_rate_mb: 4
  ingestion_burst_size_mb: 6
```

### 6.3 Grafana Datasource Auto-Provision

**`monitoring/grafana/datasource.yml`:**
```yaml
apiVersion: 1
datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: true
    version: 1
    editable: true
    jsonData:
      timeout: 60
      maxLines: 5000
```

### 6.4 วิธีใช้ Loki Docker Driver (สำหรับส่ง log โดยตรง)

```bash
# ติดตั้ง plugin ก่อน (ครั้งเดียว)
docker plugin install grafana/loki-docker-driver:latest \
  --alias loki \
  --grant-all-permissions

# ตรวจสอบ
docker plugin ls
```

```yaml
# ใน docker-compose.yml เปลี่ยน logging ของแต่ละ service เป็น:
services:
  auth-service:
    logging:
      driver: loki
      options:
        loki-url: "http://localhost:3100/loki/api/v1/push"
        loki-retries: "5"
        loki-batch-size: "400"
        loki-external-labels: "service=auth-service,env=lab"
```

---

## 7. LogQL: ภาษาค้นหา Log ของ Loki

**LogQL** คล้าย PromQL (Prometheus Query Language) ใช้สำหรับค้นหา logs ใน Loki

### 7.1 โครงสร้าง LogQL

```
{label_selector} | filter_expression | format_expression | metric_expression
     │                   │                    │                   │
  เลือก stream         กรองข้อความ          parse log           คำนวณตัวเลข
```

### 7.2 Label Selector (เลือก Log Stream)

```logql
# ดู logs จาก service เดียว
{container_name="task-board-security-auth-service-1"}

# ดู logs จากหลาย service (regex)
{container_name=~".*task-board.*"}

# ดู logs ทั้งหมด (ทุก container)
{job="docker"}

# กรองด้วย compose service name
{compose_service="auth-service"}

# หลาย labels
{compose_service="auth-service", compose_project="task-board-security"}
```

**Label Operators:**
| Operator | ความหมาย | ตัวอย่าง |
|---------|---------|---------|
| `=` | เท่ากับ | `{service="auth"}` |
| `!=` | ไม่เท่ากับ | `{service!="nginx"}` |
| `=~` | regex match | `{service=~"auth|task"}` |
| `!~` | regex not match | `{service!~".*db.*"}` |

### 7.3 Filter Expressions

```logql
# ค้นหา keyword
{compose_service="auth-service"} |= "Login failed"
{compose_service="auth-service"} |= "error" or |= "Error"

# ไม่รวม keyword
{compose_service="task-service"} != "health"

# Regex filter
{compose_service=~".*service.*"} |~ "\\d{3}" |~ "(4|5)\\d{2}"

# Case-insensitive (ใช้ (?i))
{compose_service="auth-service"} |~ "(?i)login"
```

### 7.4 Metric Queries (นับจำนวน)

```logql
# นับจำนวน log entries ต่อนาที
count_over_time({compose_service="auth-service"}[1m])

# นับ "Login failed" ต่อ 5 นาที
count_over_time(
  {compose_service="auth-service"} |= "Login failed" [5m]
)

# Rate ของ errors ต่อวินาที
rate(
  {compose_service=~".*service.*"} |= "error" [5m]
)

# นับ 401 responses
count_over_time(
  {compose_service="nginx"} |= "\" 401 " [1m]
)
```

### 7.5 Query ที่มีประโยชน์สำหรับ Security

```logql
── ด้าน Authentication ──────────────────────────────────────────
# ดู login attempts ทั้งหมด
{compose_service="auth-service"} |= "Login"

# Login failures เท่านั้น
{compose_service="auth-service"} |= "Login failed"

# Login successes เท่านั้น
{compose_service="auth-service"} |= "Login success"

# นับ failed logins ใน 5 นาที (ตรวจจับ brute force)
count_over_time(
  {compose_service="auth-service"} |= "Login failed" [5m]
)

── ด้าน Authorization ───────────────────────────────────────────
# 401 Unauthorized requests
{compose_service=~"(task|user)-service"} |= "401"

# 403 Forbidden requests
{compose_service=~"(task|user)-service"} |= "403"

# ดู request ที่ไม่มี token
{compose_service=~".*service.*"} |= "No token provided"

── ด้าน Rate Limiting ────────────────────────────────────────────
# Rate limit events จาก Nginx
{compose_service="nginx"} |= "429"
{compose_service="nginx"} |= "limiting requests"

── Error Monitoring ──────────────────────────────────────────────
# ดู errors ทุก service
{compose_service=~".*service.*"} |= "error"

# 5xx responses
{compose_service="nginx"} |~ "\" 5[0-9][0-9] "

# Database errors
{compose_service=~".*service.*"} |= "DB" |= "error"

── Task Operations ────────────────────────────────────────────────
# ดู CRUD operations
{compose_service="task-service"} |= "Created"
{compose_service="task-service"} |= "Deleted"
```

---

## 8. Security Logging Patterns

### 8.1 สิ่งที่ควร Log (Security Events)

```javascript
// ── ใน auth-service ──────────────────────────────────────────────

// 1. Login success
console.log(JSON.stringify({
  level: 'info',
  event: 'LOGIN_SUCCESS',
  email: user.email,
  userId: user.user_id,
  role: user.role,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString()
}));

// 2. Login failure
console.log(JSON.stringify({
  level: 'warn',
  event: 'LOGIN_FAILED',
  email: req.body.email,
  ip: req.ip,
  reason: 'invalid_credentials',
  timestamp: new Date().toISOString()
}));

// 3. Register
console.log(JSON.stringify({
  level: 'info',
  event: 'REGISTER',
  email: user.email,
  userId: user.user_id,
  ip: req.ip,
  timestamp: new Date().toISOString()
}));

// ── ใน task-service ──────────────────────────────────────────────

// 4. Task created
console.log(JSON.stringify({
  level: 'info',
  event: 'TASK_CREATED',
  taskId: task.id,
  title: task.title,
  ownerId: req.user.sub,
  timestamp: new Date().toISOString()
}));

// 5. Unauthorized access attempt
console.log(JSON.stringify({
  level: 'warn',
  event: 'UNAUTHORIZED_ACCESS',
  path: req.path,
  method: req.method,
  ip: req.ip,
  reason: 'no_token',
  timestamp: new Date().toISOString()
}));

// 6. Forbidden (403)
console.log(JSON.stringify({
  level: 'warn',
  event: 'FORBIDDEN',
  userId: req.user.sub,
  role: req.user.role,
  resource: `task:${req.params.id}`,
  action: req.method,
  timestamp: new Date().toISOString()
}));
```

### 8.2 Structured Logging (JSON format)

```
┌────────────────────────────────────────────────────────────────────┐
│               Plain Text vs Structured Log                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ❌ Plain Text (ค้นหายาก):                                          │
│  User alice@example.com logged in from 192.168.1.1 at 10:23 AM    │
│  Failed login for unknown user bob@example.com                     │
│                                                                    │
│  ✅ Structured JSON (ค้นหาง่าย, filter ได้):                        │
│  {"level":"info","event":"LOGIN_SUCCESS",                          │
│   "email":"alice@example.com",                                     │
│   "ip":"192.168.1.1",                                              │
│   "timestamp":"2024-01-15T10:23:00.000Z"}                          │
│                                                                    │
│  {"level":"warn","event":"LOGIN_FAILED",                           │
│   "email":"bob@example.com",                                       │
│   "ip":"192.168.1.1",                                              │
│   "timestamp":"2024-01-15T10:23:05.000Z"}                          │
│                                                                    │
│  ข้อดีของ JSON logs:                                                │
│  ✅ กรองด้วย field ได้: | json | level = "warn"                    │
│  ✅ Parse อัตโนมัติ                                                 │
│  ✅ ค้นหาด้วย LogQL ได้แม่นยำกว่า                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 8.3 สิ่งที่ **ไม่ควร** Log

```
❌ NEVER log sensitive data:
• Password (hash หรือ plaintext)
• Full credit card numbers  
• JWT token เต็มๆ (log แค่ first 10 chars)
• SSN/National ID
• Personal health information
• API keys / secrets

✅ OK to log:
• User ID (ไม่ใช่ email ถ้าไม่จำเป็น)
• Action performed
• Timestamp
• IP address (ระวัง GDPR)
• Success/Failure status
• Error code (ไม่ใช่ full error message ที่มี sensitive data)
```

---

## 9. การสร้าง Dashboard ใน Grafana

### 9.1 เข้าใช้งาน Grafana

```
URL:      http://localhost:3000
Username: admin
Password: admin (หรือตามที่ set ใน GF_SECURITY_ADMIN_PASSWORD)
```

### 9.2 ดู Logs ใน Explore Mode

```
1. คลิก Explore (icon compass ซ้ายมือ)
2. เลือก Datasource: Loki
3. ใช้ Label filters หรือพิมพ์ LogQL โดยตรง
```

### 9.3 สร้าง Dashboard สำหรับ Security

**Panel 1: Login Activity (Log Panel)**
```
Query: {compose_service="auth-service"} |= "LOGIN"
Visualization: Logs
Title: "Authentication Events"
```

**Panel 2: Failed Login Count (Time Series)**
```
Query: count_over_time(
  {compose_service="auth-service"} |= "LOGIN_FAILED" [5m]
)
Visualization: Time series
Title: "Failed Logins (per 5 min)"
```

**Panel 3: 4xx/5xx Errors (Stat)**
```
Query: count_over_time(
  {compose_service="nginx"} |~ "\" [45][0-9][0-9] " [1h]
)
Visualization: Stat
Title: "Error Responses (last 1h)"
```

**Panel 4: Recent Security Events (Table)**
```
Query: {compose_service=~".*service.*"} 
       |= "FAILED" or |= "FORBIDDEN" or |= "UNAUTHORIZED"
Visualization: Logs
Title: "Recent Security Alerts"
```

### 9.4 ขั้นตอนสร้าง Dashboard

```
1. New → Dashboard → + Add visualization
2. เลือก Data source: Loki
3. เขียน Query ใน LogQL
4. เลือก Visualization type (Logs, Time series, Stat, etc.)
5. ตั้งค่า Title, Description
6. Save Dashboard
```

---

## 10. Logging Best Practices สำหรับ Node.js

### 10.1 ใช้ Logging Library (Production)

```bash
npm install winston
```

```javascript
// logger.js — reusable logger
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()         // output as JSON → ดีกับ Loki
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'unknown-service'
  },
  transports: [
    new winston.transports.Console()  // stdout → Docker log driver → Loki
  ]
});

module.exports = logger;

// ใช้งาน:
const logger = require('./logger');
logger.info('Login success', { userId: 'user-001', email: 'alice@example.com' });
logger.warn('Login failed', { email: 'bob@example.com', ip: '1.2.3.4' });
logger.error('Database connection failed', { error: err.message });
```

### 10.2 HTTP Request Logging ด้วย Morgan

```javascript
const morgan  = require('morgan');
const logger  = require('./logger');

// Custom Morgan format → JSON
morgan.token('user-id', (req) => req.user?.sub || 'anonymous');
morgan.token('body-size', (req) => {
  return req.body ? JSON.stringify(req.body).length + 'b' : '0b';
});

app.use(morgan(
  (tokens, req, res) => JSON.stringify({
    type:       'http',
    method:     tokens.method(req, res),
    url:        tokens.url(req, res),
    status:     parseInt(tokens.status(req, res)),
    responseMs: parseFloat(tokens['response-time'](req, res)),
    userId:     tokens['user-id'](req, res),
    ip:         req.ip,
    timestamp:  new Date().toISOString()
  }),
  { stream: { write: (msg) => logger.info(msg.trim()) } }
));
```

### 10.3 ควรทำ vs ไม่ควรทำ

```
┌────────────────────────────────────────────────────────────────────┐
│              Node.js Logging Do's and Don'ts                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ✅ DO:                                                            │
│  • Log ทุก authentication event (success + failure)               │
│  • ใช้ structured JSON format                                       │
│  • ใส่ timestamp, userId, IP ใน security events                    │
│  • Log ผ่าน stdout (ไม่ใช่ไฟล์) — Docker จัดการให้                  │
│  • ใช้ log levels อย่างถูกต้อง (info/warn/error)                    │
│  • ทดสอบ logging ว่า log ถูกต้องหรือไม่                               │
│                                                                    │
│  ❌ DON'T:                                                         │
│  • console.log ใน production ที่มี sensitive data                  │
│  • Log password, token, credit card                                │
│  • ใช้ try-catch โดยไม่ log error                                   │
│  • ใช้ synchronous file I/O สำหรับ logging (block event loop)       │
│  • Log ทุกอย่าง (มากเกินไปก็ไม่ดี — cost และ noise)                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 11. ELK Stack: สำหรับการต่อยอด

เมื่อนักศึกษาเข้าใจ Loki + Grafana แล้ว สามารถต่อยอดไปเรียน ELK Stack ซึ่งใช้ใน Production ขนาดใหญ่

```
┌────────────────────────────────────────────────────────────────────┐
│                    ELK Stack Architecture                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   E = Elasticsearch  — เก็บ index log, full-text search            │
│   L = Logstash       — pipeline: รับ, กรอง, transform logs         │
│   K = Kibana         — UI ดู/ค้นหา logs, สร้าง dashboard          │
│                                                                    │
│   Services  →  Filebeat/Fluentd  →  Logstash  →  Elasticsearch    │
│                   (agent)          (pipeline)     (storage)        │
│                                                          │         │
│                                                          ▼         │
│                                                        Kibana       │
│                                                      (dashboard)   │
│                                                                    │
│   เปรียบเทียบ:                                                       │
│                                                                    │
│   Feature       │ Loki + Grafana     │ ELK Stack                   │
│   ─────────────────────────────────────────────────               │
│   Full-text     │ จำกัด              │ ✅ ดีมาก                    │
│   search        │                    │                             │
│   Memory        │ 200MB-500MB        │ 4GB+                        │
│   Setup         │ ง่าย               │ ซับซ้อนกว่า                   │
│   Cost          │ ถูก                │ แพงกว่า                      │
│   Scale         │ ดี                 │ ดีมากสำหรับ PB ข้อมูล          │
│   Visualization │ Grafana (ดี)       │ Kibana (ดี)                  │
│                                                                    │
│   → เรียน Loki ก่อน → ต่อยอด ELK ได้ง่าย                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### ELK Quick Start (สำหรับศึกษาต่อ)

```yaml
# docker-compose-elk.yml (minimum config)
services:
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  filebeat:
    image: elastic/filebeat:8.11.0
    volumes:
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - elasticsearch
```

---

## 12. สรุปและ Cheat Sheet

```
┌────────────────────────────────────────────────────────────────────────┐
│                  Loki + Grafana Cheat Sheet                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  URLs:                                                                 │
│  Grafana:  http://localhost:3000  (admin/admin)                        │
│  Loki API: http://localhost:3100/ready                                 │
│  Loki logs: http://localhost:3100/loki/api/v1/query_range              │
│                                                                        │
│  LogQL Basics:                                                         │
│  ดู logs:  {compose_service="auth-service"}                            │
│  Filter:   {compose_service="auth-service"} |= "error"                │
│  Count:    count_over_time({compose_service="auth-service"}[5m])       │
│  Rate:     rate({compose_service=~".*service.*"} |= "error"[5m])       │
│                                                                        │
│  Security Queries:                                                     │
│  Login fail:  {compose_service="auth-service"} |= "Login failed"      │
│  401 errors:  {compose_service=~".*service.*"} |= "401"               │
│  403 errors:  {compose_service=~".*service.*"} |= "403"               │
│  Rate limit:  {compose_service="nginx"} |= "429"                      │
│                                                                        │
│  Docker commands:                                                      │
│  ดู logs real-time: docker compose logs -f                             │
│  ดู service เดียว: docker compose logs -f auth-service                 │
│  ดู น lines ล่าสุด: docker compose logs --tail=100 task-service        │
│                                                                        │
│  Log Levels:                                                           │
│  FATAL > ERROR > WARN > INFO > DEBUG > TRACE                          │
│                                                                        │
│  ❌ ห้าม log: password, token, credit card, SSN                        │
│  ✅ ควร log: event, userId, IP, timestamp, status                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### ขั้นตอนแก้ปัญหา Logging

```bash
# 1. ตรวจว่า Loki พร้อม
curl http://localhost:3100/ready

# 2. ดู logs ผ่าน Docker (ไม่ต้องผ่าน Loki)
docker compose logs -f auth-service | grep "Login"

# 3. ตรวจว่า Grafana เชื่อมต่อ Loki ได้
# Grafana → Configuration → Data Sources → Loki → Test

# 4. ลอง query พื้นฐานใน Grafana Explore
# {job="docker"} → ควรเห็น logs ทั้งหมด

# 5. ถ้า logs ไม่ขึ้นใน Loki ให้ตรวจ Docker log driver
docker inspect taskboard-auth | grep LogConfig
```

---

## 📚 แหล่งศึกษาเพิ่มเติม

| แหล่ง | URL |
|-------|-----|
| Loki Documentation | https://grafana.com/docs/loki/latest/ |
| LogQL Reference | https://grafana.com/docs/loki/latest/query/ |
| Grafana Docs | https://grafana.com/docs/grafana/latest/ |
| Loki Docker Driver | https://grafana.com/docs/loki/latest/send-data/docker-driver/ |
| Winston (Node.js) | https://github.com/winstonjs/winston |

---

*Document Version: 1.0*
*Course: ENGSE207 Software Architecture*
*Instructor: นายธนิต เกตุแก้ว*
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
