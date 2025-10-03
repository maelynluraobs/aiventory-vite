# AIventory Database Setup

## Prerequisites
1. Install XAMPP or any MySQL server
2. Start MySQL service

## Database Setup Instructions

### 1. Create Database
```sql
CREATE DATABASE aiventory;
USE aiventory;
```

### 2. Create Tables

#### Admin Table
```sql
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_username VARCHAR(50) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    admin_email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Staff Table
```sql
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    staff_username VARCHAR(50) UNIQUE NOT NULL,
    staff_password VARCHAR(255) NOT NULL,
    staff_email VARCHAR(100) UNIQUE NOT NULL,
    staff_role VARCHAR(20) DEFAULT 'Staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Supplier Table
```sql
CREATE TABLE supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    supplier_contactnum VARCHAR(20),
    supplier_email VARCHAR(100),
    supplier_address TEXT,
    supplier_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Product Table
```sql
CREATE TABLE product (
    Product_id INT AUTO_INCREMENT PRIMARY KEY,
    Product_name VARCHAR(100) NOT NULL,
    Product_description TEXT,
    Product_price DECIMAL(10,2) NOT NULL,
    Product_stock INT DEFAULT 0,
    Product_category VARCHAR(50),
    reorder_level INT DEFAULT 10,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE SET NULL
);
```

#### Orders from Supplier Table
```sql
CREATE TABLE orders_from_supplier (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATE NOT NULL,
    order_status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    total_amount DECIMAL(10,2) NOT NULL,
    supplier_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE CASCADE
);
```

#### Order Item Table
```sql
CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    received_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders_from_supplier(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(Product_id) ON DELETE CASCADE
);
```

### 3. Insert Sample Data

#### Sample Admin User
```sql
INSERT INTO admin (admin_name, admin_username, admin_password, admin_email) 
VALUES ('Administrator', 'admin', '$2b$10$example_hashed_password', 'admin@aiventory.com');
```

#### Sample Staff User
```sql
INSERT INTO staff (staff_name, staff_username, staff_password, staff_email, staff_role) 
VALUES ('Staff User', 'staff', '$2b$10$example_hashed_password', 'staff@aiventory.com', 'Staff');
```

#### Sample Suppliers
```sql
INSERT INTO supplier (supplier_name, supplier_contactnum, supplier_email, supplier_address, supplier_rating) VALUES
('TechSupply Co.', '+1234567890', 'contact@techsupply.com', '123 Tech Street, Silicon Valley', 4.5),
('Office Essentials', '+0987654321', 'sales@officeessentials.com', '456 Business Ave, Downtown', 4.2),
('Global Electronics', '+1122334455', 'info@globalelectronics.com', '789 Electronics Blvd, Tech City', 4.8);
```

#### Sample Products
```sql
INSERT INTO product (Product_name, Product_description, Product_price, Product_stock, Product_category, reorder_level, supplier_id) VALUES
('Laptop Computer', 'High-performance business laptop', 899.99, 25, 'Electronics', 5, 1),
('Office Chair', 'Ergonomic office chair with lumbar support', 199.99, 15, 'Furniture', 3, 2),
('Wireless Mouse', 'Bluetooth wireless mouse', 29.99, 50, 'Electronics', 10, 3),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 49.99, 20, 'Furniture', 5, 2);
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aiventory

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=5000
```

### 5. Test Login Credentials

For testing purposes, you can create simple credentials:

**Admin Login:**
- Username: admin
- Password: admin123

**Staff Login:**
- Username: staff
- Password: staff123

To create these, run:
```sql
-- Simple passwords for testing (in production, use hashed passwords)
UPDATE admin SET admin_password = 'admin123' WHERE admin_username = 'admin';
UPDATE staff SET staff_password = 'staff123' WHERE staff_username = 'staff';
```

## Running the Application

1. Start MySQL server (via XAMPP or standalone)
2. Create the database and tables using the SQL above
3. Navigate to the server directory: `cd server`
4. Install dependencies: `npm install`
5. Start the backend: `npm start`
6. In another terminal, navigate to the project root
7. Install frontend dependencies: `npm install`
8. Start the frontend: `npm run dev`

The application should now be accessible at `http://localhost:5173` (frontend) and the API at `http://localhost:5000` (backend).
