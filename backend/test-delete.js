require('dotenv').config()
const mysql = require('mysql2/promise')

async function testDelete() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })

    console.log('Connecting to database and testing DELETE privilege...')
    
    // We try to delete heavily a non-existent row
    const [result] = await pool.execute('DELETE FROM registrations WHERE id = 99999')
    console.log('Delete query successful (privilege allows it). Affected rows:', result.affectedRows)
    
  } catch (err) {
    console.error('Failed to execute DELETE query:', err.message)
    console.error('Full Error:', err)
  }
  process.exit(0)
}

testDelete()
