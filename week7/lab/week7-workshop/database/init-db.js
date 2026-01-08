// ============================================
// Database Initialization
// ============================================

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'products.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Delete existing database
if (fs.existsSync(dbPath)) {
    console.log('🗑️  Deleting existing database...');
    fs.unlinkSync(dbPath);
}

// Create new database
console.log('📝 Creating new database...');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
    console.log('✅ Database created');
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error executing schema:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Schema created successfully');
    
    // Verify data
    db.all('SELECT COUNT(*) as count FROM products', (err, rows) => {
        if (!err) {
            console.log(`📊 Products in database: ${rows[0].count}`);
        }
        
        db.close();
        console.log('\n✅ Database initialization complete!\n');
    });
});