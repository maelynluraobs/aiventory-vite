// Simple test script to verify database connection and accounts
import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "",
  database: "aiventory"
});

console.log("🔍 Testing database connection...");

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    console.log("📝 Please ensure:");
    console.log("  1. MySQL server is running (XAMPP/WAMP)");
    console.log("  2. Database 'aiventory' exists");
    console.log("  3. Run setup_database.sql script");
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL database");
    
    // Test if accounts exist
    const sql = `
      SELECT 'admin' as type, admin_username, admin_email, admin_password FROM admin
      UNION ALL
      SELECT 'staff' as type, staff_username, staff_email, staff_password FROM staff
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Query error:", err.message);
        console.log("📝 Please run setup_database.sql script");
      } else {
        console.log("✅ Found", results.length, "accounts:");
        results.forEach(account => {
          console.log(`  - ${account.type}: ${account.admin_username || account.staff_username} (${account.admin_email || account.staff_email})`);
        });
        
        if (results.length === 0) {
          console.log("⚠️  No accounts found! Please run setup_database.sql");
        }
      }
      
      db.end();
    });
  }
});
