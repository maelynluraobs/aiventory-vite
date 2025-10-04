// index.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";      // or bcryptjs
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { exec } from "child_process";

// Load environment variables
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "aiventory_secret_fallback";

// ------------------ INIT ------------------
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aiventory"
});

// ✅ Test DB connection
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ------------------ ROUTES ------------------

// Login route
app.post("/api/login", (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("📥 Login request:", { email, username, password, role });
  
  // Validate required fields
  if (!password || !role) {
    return res.status(400).json({ error: "Missing email/username, password, or role" });
  }
  
  // Accept either email or username from frontend
  const identifier = email || username;
  if (!identifier) {
    return res.status(400).json({ error: "Email or username is required" });
  }

  const table = role === 'Admin' ? 'admin' : 'staff';
  const id_field = role === 'Admin' ? 'admin_id' : 'staff_id';
  const email_field = role === 'Admin' ? 'admin_email' : 'staff_email';
  const password_field = role === 'Admin' ? 'admin_password' : 'staff_password';
  const name_field = role === 'Admin' ? 'admin_name' : 'staff_name';

  // Try to match by email or username
  const sql = role === 'Admin'
    ? `SELECT * FROM ${table} WHERE ${email_field} = ? OR admin_username = ?`
    : `SELECT * FROM ${table} WHERE ${email_field} = ? OR staff_username = ?`;

  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      console.log("❌ User not found:", identifier);
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];
    
    try {
      const passwordMatch = await bcrypt.compare(password, user[password_field]);
      
      if (!passwordMatch) {
        console.log("❌ Invalid password for user:", identifier);
        return res.status(401).json({ error: "Invalid password" });
      }

      // Update last login
      const updateSql = role === 'Admin'
        ? `UPDATE admin SET last_login = NOW() WHERE admin_id = ?`
        : `UPDATE staff SET last_login = NOW() WHERE staff_id = ?`;
      
      db.query(updateSql, [user[id_field]], (err) => {
        if (err) {
          console.error("❌ Update login time error:", err);
          // Don't fail login for this error
        }
      });

      const token = jwt.sign({ id: user[id_field], role: role }, SECRET_KEY, { expiresIn: "2h" });
      console.log("✅ Login successful for:", user[name_field]);
      
      // Return user info for frontend
      res.json({ 
        message: "Login success", 
        token, 
        role: role, 
        user: { 
          id: user[id_field], 
          name: user[name_field], 
          email: user[email_field] 
        } 
      });
    } catch (bcryptErr) {
      console.error("❌ Password comparison error:", bcryptErr);
      return res.status(500).json({ error: "Authentication error" });
    }
  });
});

// Register new user
app.post("/api/register", async (req, res) => {
  const { fullName, email, username, password, role } = req.body;
  console.log("📥 Registration request:", { fullName, email, username, password, role });
  
  // Validate required fields
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Accept username from frontend, fallback to email if not provided
  const userName = username || email;

  try {
    // Check if user already exists
    const checkSql = role === "Admin" 
      ? `SELECT admin_id FROM admin WHERE admin_email = ? OR admin_username = ?`
      : `SELECT staff_id FROM staff WHERE staff_email = ? OR staff_username = ?`;
    
    db.query(checkSql, [email, userName], async (err, results) => {
      if (err) {
        console.error("❌ Check user error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists with this email or username" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      if (role === "Admin") {
        const sql = `INSERT INTO admin (admin_name, admin_username, admin_password, admin_email) VALUES (?, ?, ?, ?)`;
        db.query(sql, [fullName, userName, hashedPassword, email], (err, result) => {
          if (err) {
            console.error("❌ MySQL Error:", err);
            return res.status(500).json({ error: err.message });
          }
          console.log("✅ Admin account created:", result.insertId);
          res.json({ message: "Admin account created successfully!", user: { id: result.insertId, name: fullName, email } });
        });
      } else {
        const sql = `INSERT INTO staff (staff_name, staff_username, staff_password, staff_email, staff_role) VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [fullName, userName, hashedPassword, email, "Staff"], (err, result) => {
          if (err) {
            console.error("❌ MySQL Error:", err);
            return res.status(500).json({ error: err.message });
          }
          console.log("✅ Staff account created:", result.insertId);
          res.json({ message: "Staff account created successfully!", user: { id: result.insertId, name: fullName, email } });
        });
      }
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ===================== SUPPLIERS =========================

// Get all suppliers
app.get("/api/suppliers", (req, res) => {
  db.query("SELECT * FROM supplier", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add supplier
app.post("/api/suppliers", (req, res) => {
  console.log("📥 Incoming supplier body:", req.body); // 👀 Debug log

  const { supplier_name, supplier_contactnum, supplier_email, supplier_address, supplier_rating } = req.body;

  if (!supplier_name || !supplier_email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO supplier (supplier_name, supplier_contactnum, supplier_email, supplier_address, supplier_rating) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [supplier_name, supplier_contactnum, supplier_email, supplier_address, supplier_rating],
    (err, result) => {
      if (err) {
        console.error("❌ MySQL Insert Error:", err);
        return res.status(500).json(err);
      }
      res.json({ supplier_id: result.insertId, ...req.body });
    }
  );
});

// Update supplier
app.put("/api/suppliers/:id", (req, res) => {
  const { id } = req.params;
  const { supplier_name, supplier_contactnum, supplier_email, supplier_address, supplier_rating } = req.body;

  const sql =
    "UPDATE supplier SET supplier_name=?, supplier_contactnum=?, supplier_email=?, supplier_address=?, supplier_rating=? WHERE supplier_id=?";

  db.query(
    sql,
    [supplier_name, supplier_contactnum, supplier_email, supplier_address, supplier_rating, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ supplier_id: id, ...req.body });
    }
  );
});

// Delete supplier
app.delete("/api/suppliers/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM supplier WHERE supplier_id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});


// ===================== SUPPLIERS ===============================

// ==================== ORDERS FROM SUPPLIERS ====================

// Get all orders (with supplier info)
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT o.*, s.supplier_name, s.supplier_contactnum
    FROM orders_from_supplier o
    JOIN supplier s ON o.supplier_id = s.supplier_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Fetch Orders Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Add new order
app.post("/api/orders", (req, res) => {
  console.log("📥 Incoming order body:", req.body);

  const { order_date, order_status, total_amount, supplier_id } = req.body;

  if (!order_date || !order_status || !total_amount || !supplier_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO orders_from_supplier (order_date, order_status, total_amount, supplier_id) VALUES (?, ?, ?, ?)";

  db.query(sql, [order_date, order_status, total_amount, supplier_id], (err, result) => {
    if (err) {
      console.error("❌ Insert Order Error:", err);
      return res.status(500).json(err);
    }
    res.json({ order_id: result.insertId, ...req.body });
  });
});

// Update order
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { order_status, total_amount } = req.body;

  if (!order_status || !total_amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "UPDATE orders_from_supplier SET order_status=?, total_amount=?, updated_at=NOW() WHERE order_id=?";

  db.query(sql, [order_status, total_amount, id], (err) => {
    if (err) {
      console.error("❌ Update Order Error:", err);
      return res.status(500).json(err);
    }
    res.json({ order_id: id, ...req.body });
  });
});

// Delete order
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM orders_from_supplier WHERE order_id=?", [id], (err) => {
    if (err) {
      console.error("❌ Delete Order Error:", err);
      return res.status(500).json(err);
    }
    res.json({ success: true });
  });
});

// ==================== ORDERS FROM SUPPLIERS -====================
// ==================== ORDER ITEMS ===========================

// Get items of an order
app.get("/api/orders/:id/items", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT oi.*, p.Product_name 
    FROM order_item oi
    JOIN product p ON oi.product_id = p.Product_id
    WHERE oi.order_id=?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Fetch Order Items Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Add item to order
app.post("/api/orders/:id/items", (req, res) => {
  console.log("📥 Incoming order item body:", req.body);

  const { id } = req.params;
  const { product_id, quantity, price, received_date } = req.body;

  if (!product_id || !quantity || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO order_item (order_id, product_id, quantity, price, received_date) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [id, product_id, quantity, price, received_date], (err, result) => {
    if (err) {
      console.error("❌ Insert Order Item Error:", err);
      return res.status(500).json(err);
    }
    res.json({ order_item_id: result.insertId, order_id: id, ...req.body });
  });
});

// Update order item
app.put("/api/order-items/:itemId", (req, res) => {
  const { itemId } = req.params;
  const { quantity, price, received_date } = req.body;

  if (!quantity || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "UPDATE order_item SET quantity=?, price=?, received_date=? WHERE order_item_id=?";

  db.query(sql, [quantity, price, received_date, itemId], (err) => {
    if (err) {
      console.error("❌ Update Order Item Error:", err);
      return res.status(500).json(err);
    }
    res.json({ order_item_id: itemId, ...req.body });
  });
});

// Delete order item
app.delete("/api/order-items/:itemId", (req, res) => {
  const { itemId } = req.params;
  db.query("DELETE FROM order_item WHERE order_item_id=?", [itemId], (err) => {
    if (err) {
      console.error("❌ Delete Order Item Error:", err);
      return res.status(500).json(err);
    }
    res.json({ success: true });
  });
});
// =================== ORDER ITEMS ==========================
// ===================== PRODUCTS CRUD =========================

// Get all products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM product", (err, results) => {
    if (err) {
      console.error("❌ Fetch Products Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM product WHERE Product_id=?", [id], (err, results) => {
    if (err) {
      console.error("❌ Fetch Product Error:", err);
      return res.status(500).json(err);
    }
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
});

// Add product
app.post("/api/products", (req, res) => {
  const { Product_name, Product_sku, Product_price, Product_category, reorder_level, supplier_id, Product_stock, Product_status } = req.body;

  if (!Product_name || !Product_price || !Product_sku) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO product 
    (Product_name, Product_sku, Product_price, Product_category, reorder_level, supplier_id, Product_stock, Product_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [Product_name, Product_sku, Product_price, Product_category, reorder_level, supplier_id, Product_stock, Product_status], (err, result) => {
    if (err) {
      console.error("❌ Insert Product Error:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json({ Product_id: result.insertId, ...req.body });
  });
});


// Update product
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { 
    Product_name, 
    Product_sku, 
    Product_price, 
    Product_category, 
    reorder_level, 
    supplier_id, 
    Product_stock, 
    Product_status 
  } = req.body;

  if (!Product_name || !Product_sku || !Product_price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE product 
    SET Product_name=?, 
        Product_sku=?, 
        Product_price=?, 
        Product_category=?, 
        reorder_level=?, 
        supplier_id=?, 
        Product_stock=?, 
        Product_status=? 
    WHERE Product_id=?
  `;

  db.query(
    sql, 
    [Product_name, Product_sku, Product_price, Product_category, reorder_level, supplier_id, Product_stock, Product_status, id], 
    (err) => {
      if (err) {
        console.error("❌ Update Product Error:", err.sqlMessage);
        return res.status(500).json({ error: err.sqlMessage });
      }
      res.json({ Product_id: id, ...req.body });
    }
  );
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM product WHERE Product_id=?", [id], (err) => {
    if (err) {
      console.error("❌ Delete Product Error:", err);
      return res.status(500).json(err);
    }
    res.json({ success: true });
  });
});

// ===================== PRODUCTS CRUD =========================


// ===================== REPORTS & ANALYTICS =========================

// 1) Low Stock Products
app.get("/api/reports/low-stock", (req, res) => {
  const sql = `
    SELECT Product_id, Product_name, Product_stock, reorder_level
    FROM product
    WHERE Product_stock <= reorder_level
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Low Stock Report Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// 2) Stock by Category
app.get("/api/reports/stock-by-category", (req, res) => {
  const sql = `
    SELECT Product_category, SUM(Product_stock) as total_stock
    FROM product
    GROUP BY Product_category
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Stock by Category Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// 3) Supplier Performance (total orders + amount)
app.get("/api/reports/supplier-performance", (req, res) => {
  const sql = `
    SELECT s.supplier_name,
           COUNT(o.order_id) AS total_orders,
           COALESCE(SUM(o.total_amount), 0) AS total_amount
    FROM supplier s
    LEFT JOIN orders_from_supplier o ON s.supplier_id = o.supplier_id
    GROUP BY s.supplier_id, s.supplier_name
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Supplier Performance Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// 4) Monthly Orders Summary
app.get("/api/reports/monthly-orders", (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(order_date, '%Y-%m') as month,
           COUNT(order_id) AS total_orders,
           COALESCE(SUM(total_amount), 0) AS total_amount
    FROM orders_from_supplier
    GROUP BY DATE_FORMAT(order_date, '%Y-%m')
    ORDER BY month ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Monthly Orders Report Error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// ===================== REPORTS & ANALYTICS =========================

// ===================== ML | PREDICT STOCK =========================

app.get("/api/predict/:productId", (req, res) => {
  const { productId } = req.params;

  exec(`python predict_arima.py ${productId}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ ARIMA Error:", stderr);
      return res.status(500).json({ error: "Prediction failed" });
    }

    try {
      const forecast = JSON.parse(stdout.replace("'", '"'));
      res.json({ productId, forecast });
    } catch (e) {
      res.status(200).send(stdout); // fallback plain text
    }
  });
});


// ===================== PREDICT STOCK =========================
// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
