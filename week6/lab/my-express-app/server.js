const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware สำหรับ parse JSON body
app.use(express.json());

// 🟢 GET - อ่านข้อมูลทั้งหมด
app.get('/api/products', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    res.json(jsonData.products);
  });
});

// 🟢 GET - อ่านข้อมูลตาม ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    const product = jsonData.products.find(p => p.id === id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ 
        error: 'Product not found' 
      });
    }
  });
});

// 🔵 POST - เพิ่มข้อมูลใหม่
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    
    // สร้าง ID ใหม่
    newProduct.id = jsonData.products.length > 0 
      ? Math.max(...jsonData.products.map(p => p.id)) + 1 
      : 1;
    
    jsonData.products.push(newProduct);
    
    // บันทึกกลับลงไฟล์
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile('data.json', jsonString, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error writing file' 
        });
      }
      res.status(201).json(newProduct);
    });
  });
});

// 🟠 PUT - อัปเดตข้อมูล
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    const index = jsonData.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }
    
    // อัปเดตข้อมูล
    jsonData.products[index] = { 
      ...jsonData.products[index], 
      ...updatedData, 
      id 
    };
    
    // บันทึกกลับลงไฟล์
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile('data.json', jsonString, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error writing file' 
        });
      }
      res.json(jsonData.products[index]);
    });
  });
});

// 🔴 DELETE - ลบข้อมูล
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error reading file' 
      });
    }
    
    const jsonData = JSON.parse(data);
    const index = jsonData.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }
    
    // ลบข้อมูล
    jsonData.products.splice(index, 1);
    
    // บันทึกกลับลงไฟล์
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile('data.json', jsonString, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error writing file' 
        });
      }
      res.json({ 
        message: 'Product deleted successfully' 
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});