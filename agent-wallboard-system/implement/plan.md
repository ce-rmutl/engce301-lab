## 🎯 **แผนงาน Agent Wallboard System - แบบปรับปรุงใหม่ (2 สัปดาห์)**

### 📋 **ขอบเขตงานที่ปรับใหม่**

#### **Frontend Applications (2 ตัวแยกกัน):**
1. **Agent Desktop App** - **Electron.js** สำหรับ Agent ใช้งาน
   - เข้าสู่ระบบด้วย Agent Code (ไม่มี password)
   - เปลี่ยนสถานะ (Available/Busy/Break/Offline)
   - รับข้อความจาก Supervisor แบบ Real-time
   - แสดง notification บน desktop

2. **Supervisor Web Dashboard** - **React.js** สำหรับ Supervisor
   - ดูสถานะทีม Real-time
   - ส่งข้อความถึง Agent
   - แสดงสถิติทีมแบบง่าย

#### **Backend & Database:**
- **Node.js + Express** - REST API Server
- **Socket.io** - WebSocket Server สำหรับ Real-time
- **SQLite** - เก็บข้อมูล User/Agent (ใส่ข้อมูลโดยตรง)
- **MongoDB** - เก็บข้อมูล Real-time (Status/Messages)
- **ไม่มี JWT** - Authentication แบบง่าย ตรวจสอบ Agent Code จาก Database

### 👥 **การแบ่งทีม (4-5 คน)**
- **Electron Developer (1 คน)** - Agent Desktop App
- **React Developer (1 คน)** - Supervisor Web Dashboard  
- **Backend Developer (1 คน)** - API + WebSocket Server
- **Database Developer (1 คน)** - SQLite + MongoDB Schema
- **Integration & Testing (1 คน)** - Testing + Documentation

### 📅 **Timeline 2 สัปดาห์**

#### **สัปดาห์ที่ 1: Foundation & Core Development**

**วันที่ 1-2: Project Setup**
- **ทีมร่วมกัน**: Project Structure + Git Repository
- **Database**: SQLite Schema + Sample Data + MongoDB Setup
- **Backend**: Basic API Server + Authentication
- **Frontend**: Electron App Shell + React App Shell

**วันที่ 3-5: Core Features**
- **Electron**: Login UI + Status Management UI
- **React**: Dashboard Layout + Real-time Status Display
- **Backend**: Status API + WebSocket Basic Functions
- **Database**: CRUD Operations + Data Access Layer

#### **สัปดาห์ที่ 2: Real-time & Integration**

**วันที่ 6-8: Real-time Features**
- **Electron**: WebSocket Integration + Desktop Notifications
- **React**: Real-time Updates + Message UI
- **Backend**: Complete WebSocket Events + Message Routing
- **Database**: Message Collections + Performance Queries

**วันที่ 9-10: Integration & Demo**
- **System Integration**: End-to-end Testing
- **Bug Fixes**: Performance Tuning
- **Demo Preparation**: Documentation + Presentation

## 💻 **Technology Stack ที่ปรับใหม่**

### **Agent Desktop App (Electron.js):**
```javascript
// Main Process
const { app, BrowserWindow, ipcMain, Notification } = require('electron')

// Renderer Process (React)
import io from 'socket.io-client'
import axios from 'axios'
```

### **Supervisor Dashboard (React.js):**
```javascript
import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import MaterialUI from '@mui/material'
```

### **Backend (Node.js):**
```javascript
const express = require('express')
const socketio = require('socket.io')
const sqlite3 = require('sqlite3')
const mongoose = require('mongoose')
```

### **Database Structure:**

#### **SQLite (Master Data):**
```sql
-- ไม่มี password, ใส่ข้อมูลโดยตรง
CREATE TABLE agents (
  agent_code VARCHAR(10) PRIMARY KEY,
  agent_name VARCHAR(100),
  team_id INT,
  role VARCHAR(20), -- 'agent' or 'supervisor'
  is_active BOOLEAN DEFAULT 1
);

CREATE TABLE teams (
  team_id INT PRIMARY KEY,
  team_name VARCHAR(50),
  supervisor_code VARCHAR(10)
);

-- Sample Data
INSERT INTO agents VALUES 
('AG001', 'Agent Smith', 1, 'agent', 1),
('AG002', 'Agent Johnson', 1, 'agent', 1),
('SP001', 'Supervisor Wilson', 1, 'supervisor', 1);
```

#### **MongoDB (Real-time Data):**
```javascript
// Agent Status
{
  agentCode: "AG001",
  status: "Available", // Available, Busy, Break, Offline
  timestamp: new Date(),
  sessionId: "session123"
}

// Messages
{
  fromCode: "SP001",
  toCode: "AG001", // null for broadcast
  message: "Please check your queue",
  timestamp: new Date(),
  isRead: false
}
```

## 🚀 **สิ่งที่จะได้รับหลัง 2 สัปดาห์**

### ✅ **Working Applications:**

#### **Agent Desktop App (Electron):**
- Login ด้วย Agent Code
- Status Selection (Available/Busy/Break/Offline)
- Real-time Message Reception
- Desktop Notifications
- Always-on-top option

#### **Supervisor Web Dashboard (React):**
- Team Status Overview (Real-time)
- Agent List with Current Status
- Send Direct Messages to Agents
- Simple Team Statistics
- Message History

#### **Backend System:**
- REST API for Authentication & CRUD
- WebSocket Server for Real-time Updates
- Database Integration (SQLite + MongoDB)
- Message Routing System

### 📚 **Documentation:**
- **API Documentation** (REST + WebSocket)
- **Database Schema** (SQLite + MongoDB)
- **User Manual** (Agent + Supervisor)
- **Setup Guide** (Installation + Configuration)

## 🏆 **Challenge Activities (สำหรับทีมที่เสร็จเร็ว)**

### **Basic Challenges:**
1. **Enhanced UI**: Dark Mode + Better Styling
2. **Sound Notifications**: เสียงแจ้งเตือนเมื่อมีข้อความ
3. **Status History**: แสดงประวัติการเปลี่ยนสถานะ
4. **Auto Status**: Auto-set status based on activity

### **Advanced Challenges:**
1. **Broadcast Messages**: ส่งข้อความกระจายทั้งทีม
2. **Team Performance**: สถิติ utilization rate
3. **Export Data**: Export ข้อมูลเป็น CSV
4. **Multiple Teams**: Support หลายทีมใน 1 ระบบ
5. **Mobile Dashboard**: Responsive design สำหรับ mobile

