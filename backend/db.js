const mysql = require('mysql2/promise')
require('dotenv').config()

/**
 * สร้าง MySQL Connection Pool
 * ใช้ pool เพื่อประสิทธิภาพที่ดีกว่า single connection
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'openhouse',
  timezone: '+07:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

/**
 * ทดสอบเชื่อมต่อฐานข้อมูล
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ เชื่อมต่อฐานข้อมูล MySQL สำเร็จ')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ เชื่อมต่อฐานข้อมูลไม่สำเร็จ:', error.message)
    return false
  }
}

/**
 * สร้างตารางถ้ายังไม่มี
 */
async function initializeDatabase() {
  try {
    // ตาราง registrations
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        nickname VARCHAR(100) DEFAULT NULL,
        phone VARCHAR(50) NOT NULL,
        office_name VARCHAR(255) DEFAULT NULL,
        province VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // ตาราง schedules
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time_range VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        icon VARCHAR(50) DEFAULT 'calendar',
        highlight TINYINT(1) DEFAULT 0,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ ตารางในฐานข้อมูลพร้อมใช้งาน')
  } catch (error) {
    console.error('❌ สร้างตารางไม่สำเร็จ:', error.message)
  }
}

module.exports = { pool, testConnection, initializeDatabase }
