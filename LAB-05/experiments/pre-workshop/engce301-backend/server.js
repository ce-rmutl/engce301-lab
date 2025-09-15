// server.js - My First Express Server
const express = require('express');
const app = express();
const PORT = 3000;

// สร้าง Route (เส้นทาง) แรกสำหรับหน้าหลัก
app.get('/', (req, res) => {
  res.send('<h1>Hello from ENGCE301 Express Server!</h1>');
});

// สร้าง Route (เส้นทาง) แรกสำหรับหน้าหลัก
app.get('/hello', (req, res) => {
  res.send('<h1>Hello สวัสดี!</h1>');
});

// เริ่มต้นให้ Server รอรับการเชื่อมต่อ
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});