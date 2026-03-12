const express = require('express')
const router = express.Router()
const { pool } = require('../db')

/**
 * GET /api/registration
 * ดึงรายการผู้ลงทะเบียน (กรองตามวันที่ได้ด้วย ?date=YYYY-MM-DD)
 */
router.get('/', async (req, res) => {
  try {
    const { date } = req.query

    let rows
    if (date) {
      // กรองตามวันที่ที่เลือก
      ;[rows] = await pool.execute(
        `SELECT * FROM registrations 
         WHERE DATE(created_at) = ?
         ORDER BY created_at DESC`,
        [date]
      )
    } else {
      // ดึงทั้งหมด
      ;[rows] = await pool.execute(
        'SELECT * FROM registrations ORDER BY created_at DESC'
      )
    }

    res.json(rows)
  } catch (error) {
    console.error('Error fetching registrations:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' })
  }
})

/**
 * POST /api/registration
 * บันทึกข้อมูลลงทะเบียนใหม่
 */
router.post('/', async (req, res) => {
  try {
    const { fullName, nickname, phone, officeName, province } = req.body

    if (!fullName || !nickname || !phone || !officeName || !province) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' })
    }

    const [result] = await pool.execute(
      `INSERT INTO registrations (full_name, nickname, phone, office_name, province)
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, nickname || null, phone, officeName || null, province || null]
    )

    res.status(201).json({
      message: 'ลงทะเบียนสำเร็จ',
      id: result.insertId
    })
  } catch (error) {
    console.error('Error saving registration:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' })
  }
})

/**
 * DELETE /api/registration/:id
 * ลบข้อมูลผู้ลงทะเบียนตาม ID
 */
const fs = require('fs')
const path = require('path')

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log(`[DELETE API] Request to delete ID: ${id}`)
    
    const numericId = Number(id)
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'ID ไม่ถูกต้อง' })
    }

    const [result] = await pool.execute(
      'DELETE FROM registrations WHERE id = ?',
      [numericId]
    )

    console.log(`[DELETE API] Result:`, result)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ลงทะเบียน' })
    }

    res.json({ message: 'ลบข้อมูลสำเร็จ' })
  } catch (error) {
    console.error('Error deleting registration:', error)
    
    // Write error to file for debugging
    const logPath = path.join(__dirname, '..', 'error_delete.log')
    fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] DELETE ID ${req.params.id} ERROR: ${error.message}\n${error.stack}\n`)

    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message })
  }
})

/**
 * DELETE /api/registration
 * ลบข้อมูลผู้ลงทะเบียนทั้งหมด (ล้างข้อมูลชั่วคราว)
 */
router.delete('/', async (req, res) => {
  try {
    await pool.execute('DELETE FROM registrations')
    res.json({ message: 'ล้างข้อมูลลงทะเบียนทั้งหมดสำเร็จ' })
  } catch (error) {
    console.error('Error clearing registrations:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการล้างข้อมูล' })
  }
})

module.exports = router
