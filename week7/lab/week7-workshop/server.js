// ============================================
// ENGCE301 Week 7 Workshop - Main Server
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== ROUTES =====
const productsRouter = require('./routes/products.route');

app.use('/api/products', productsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Week 7 Workshop - SQLite + Layered Architecture',
        endpoints: {
            products: '/api/products',
            search: '/api/products/search?q=keyword'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Week 7 Workshop Server');
    console.log('='.repeat(60));
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/products`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    console.log('  GET    /api/products');
    console.log('  GET    /api/products/search?q=keyword');
    console.log('  GET    /api/products/:id');
    console.log('  POST   /api/products');
    console.log('  PUT    /api/products/:id');
    console.log('  DELETE /api/products/:id');
    console.log('\n' + '='.repeat(60) + '\n');
});