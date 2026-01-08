// ============================================
// DATABASE LAYER - Products
// ============================================

const db = require('./connection');

class ProductDatabase {
    // ===== CREATE =====
    // ✅ ให้โค้ดสมบูรณ์
    static create(productData) {
        const sql = `
            INSERT INTO products (name, category_id, price, stock, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(
                sql,
                [
                    productData.name,
                    productData.category_id,
                    productData.price,
                    productData.stock,
                    productData.description || ''
                ],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            ...productData
                        });
                    }
                }
            );
        });
    }

    // ===== READ ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;

        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // ===== READ ONE =====
    // ⚠️ นักศึกษาเติมโค้ด 30%
    static findById(id) {
        const sql = `
        SELECT 
            p.*,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;

        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // ===== UPDATE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static update(id, productData) {
        // TODO: เขียน SQL UPDATE query
        const sql = `
            /* เติม SQL query ตรงนี้ */
        `;

        return new Promise((resolve, reject) => {
            // TODO: เติมโค้ด db.run
        });
    }

    // ===== DELETE =====
    // ⚠️ นักศึกษาเติมโค้ดทั้งหมด
    static delete(id) {
        // TODO: เขียน SQL DELETE query



    }

    // ===== SEARCH =====
    // ⚠️ นักศึกษาเติมโค้ด
    static search(keyword) {
        const sql = `
        SELECT 
            p.*,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR p.description LIKE ?
        ORDER BY p.id DESC
    `;
        console.log('Searching products with keyword:', keyword);
        
        return new Promise((resolve, reject) => {
            const searchTerm = `%${keyword}%`;
            db.all(sql, [searchTerm, searchTerm], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

}

module.exports = ProductDatabase;