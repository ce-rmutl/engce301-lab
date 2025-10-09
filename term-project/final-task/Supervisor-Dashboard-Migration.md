# 📘 6.6.3.2 Supervisor Dashboard Migration Guide v4.0

**คู่มือการ Migrate Supervisor Dashboard ให้รองรับ Backend v1.2**

---

## 📋 สารบัญ

1. [ภาพรวม Supervisor Dashboard](#ภาพรวม-supervisor-dashboard)
2. [การเปลี่ยนแปลงที่สำคัญ](#การเปลี่ยนแปลงที่สำคัญ)
3. [Migration Checklist](#migration-checklist)
4. [ไฟล์ที่ต้องแก้ไข](#ไฟล์ที่ต้องแก้ไข)
5. [การทดสอบ](#การทดสอบ)
6. [Troubleshooting](#troubleshooting)

---

## ภาพรวม Supervisor Dashboard

### 🎯 ความสามารถหลัก

**Supervisor Dashboard** เป็น **React Web Application** สำหรับ Supervisors จัดการและติดตามทีม:

```
ฟีเจอร์หลัก:
├─ 🔐 Login (Supervisor accounts)
├─ 👥 View team agents (real-time)
├─ 📊 Monitor agent status
├─ 💬 Send messages (Direct + Broadcast)
├─ 📜 View message history
└─ 🔔 Real-time notifications
```

### 📁 โครงสร้างโปรเจค (Existing)

```
supervisor-dashboard/
├─ public/
│   └─ index.html
├─ src/
│   ├─ index.js
│   ├─ App.js
│   ├─ components/
│   │   ├─ LoginForm.js
│   │   ├─ Dashboard.js
│   │   ├─ AgentList.js
│   │   ├─ AgentCard.js
│   │   ├─ MessagePanel.js
│   │   ├─ SendMessageForm.js
│   │   └─ MessageHistory.js
│   ├─ services/
│   │   ├─ api.js
│   │   ├─ socket.js
│   │   └─ notifications.js
│   ├─ utils/
│   │   ├─ logger.js
│   │   └─ validation.js
│   └─ styles/
│       ├─ App.css
│       └─ components.css
└─ package.json
```

---

## การเปลี่ยนแปลงที่สำคัญ

### 🔄 Summary Table

| Component | เดิม (v3.2) | ใหม่ (v4.0) | ระดับความยาก |
|-----------|-------------|-------------|--------------|
| **Login** | `agentCode` (SP001) | `username` (SP001) | ⭐ ง่าย |
| **Agent List API** | `/api/agents` | `/api/agents` (structure เปลี่ยน) | ⭐⭐ ปานกลาง |
| **Agent Object** | `agentCode`, `agentName` | `username`, `fullName`, `role` | ⭐⭐ ปานกลาง |
| **Send Message** | `toCode` | `toCode` (ยังเหมือนเดิม) | ⭐ ง่าย |
| **WebSocket** | `agentCode` | `agentCode` (ไม่เปลี่ยน) | ⭐ ง่าย (อ่านเ