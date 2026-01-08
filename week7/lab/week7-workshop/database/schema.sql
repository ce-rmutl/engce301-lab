-- ============================================
-- Database Schema for Products
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== CATEGORIES TABLE =====
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== PRODUCTS TABLE =====
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_products_category 
    ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_products_name 
    ON products(name);

-- ===== TRIGGER: Update timestamp =====
CREATE TRIGGER IF NOT EXISTS update_products_timestamp
AFTER UPDATE ON products
BEGIN
    UPDATE products 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- ===== SAMPLE DATA: Categories =====
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Electronic devices and gadgets'),
    ('Computers', 'Computers and accessories'),
    ('Audio', 'Audio equipment');

-- ===== SAMPLE DATA: Products =====
INSERT INTO products (name, category_id, price, stock, description) VALUES
    ('iPhone 15 Pro', 1, 42900, 15, 'Latest iPhone with A17 Pro chip'),
    ('MacBook Air M2', 2, 39900, 8, '13-inch MacBook Air with M2 chip'),
    ('AirPods Pro', 3, 8990, 25, 'Active Noise Cancellation'),
    ('iPad Air', 1, 19900, 12, '10.9-inch iPad Air'),
    ('Magic Keyboard', 2, 3590, 30, 'Wireless keyboard for Mac');