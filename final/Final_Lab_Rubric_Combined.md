# ENGSE207 Final Lab Rubric (Combined — Full Detailed v2)

## คะแนนรวม
- Set 1 = 40
- Set 2 = 40
- รายบุคคล = 20
- รวม = 100

---

## Set 1 (40 คะแนน)

### 1) Architecture & 2-Service Separation — 10
ตรวจว่าแยก
- nginx gateway
- auth service
- task service
- single DB design
ได้ชัดเจนหรือไม่

### 2) Nginx HTTPS + Docker Runability — 10
ตรวจว่า
- 80 → 443 redirect
- https ใช้งานได้
- compose รันได้
- frontend ถูก serve ผ่าน nginx

### 3) JWT + Protected APIs — 8
ตรวจว่า
- login ได้
- token ถูกใช้จริง
- protected routes ทำงาน
- unauthorized case มีหลักฐาน

### 4) Basic Activity Log + Frontend Log Viewer — 7
ตรวจว่า
- integrate starter kit
- มี logs endpoint หรือทางเทียบเท่า
- มีหน้า frontend ดู log
- มี event ครบพอสมควร

### 5) Documentation & Evidence — 5
ตรวจ README / MEMBER / screenshots / diagram

---

## Set 2 (40 คะแนน)

### 1) 3 Services + 3 Databases Local Preparation — 8
ตรวจว่ามีการแยก auth/task/user และ auth-db/task-db/user-db ใน local version ก่อนขึ้น cloud

### 2) Railway Deployment Success — 10
ตรวจว่าขึ้น Railway สำเร็จและมี public evidence

### 3) Cloud Configuration Correctness — 6
ตรวจ env vars, db mapping, no localhost coupling

### 4) Functional Verification on Cloud + Log Viewer — 11
ตรวจ auth/tasks/users/logs viewer/challenge ใช้งานได้จริง

### 5) Documentation & Exam Evidence — 5
ตรวจ EXAM_REPORT + screenshots + URLs

---

## รายบุคคล (20 คะแนน)

### Mini Viva / Oral Check — 15
ถามเรื่อง
- nginx https
- auth/task split
- jwt flow
- log viewer
- set 1 → set 2 migration
- 3 services / 3 db mapping

### Peer Evaluation — 5
contribution / responsibility / communication
