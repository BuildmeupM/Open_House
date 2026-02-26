const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { testConnection, initializeDatabase } = require('./db')
const registrationRoutes = require('./routes/registration')
const scheduleRoutes = require('./routes/schedule')

const app = express()
const PORT = process.env.PORT || 6000

// --- Middleware ---
app.use(cors())
app.use(express.json())

// --- Routes ---
app.use('/api/registration', registrationRoutes)
app.use('/api/schedule', scheduleRoutes)

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Open House API is running 🚀' })
})

// --- Start Server ---
async function startServer() {
  // ทดสอบเชื่อมต่อ DB
  const connected = await testConnection()
  if (connected) {
    await initializeDatabase()
  } else {
    console.warn('⚠️ เซิร์ฟเวอร์จะทำงานต่อ แต่ยังไม่สามารถเชื่อมต่อ DB ได้')
  }

  app.listen(PORT, () => {
    console.log(`\n🏠 Open House API Server`)
    console.log(`   Running on: http://localhost:${PORT}`)
    console.log(`   Health:     http://localhost:${PORT}/api/health\n`)
  })
}

startServer()
