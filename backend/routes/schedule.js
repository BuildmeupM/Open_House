const express = require('express')
const router = express.Router()
const { pool } = require('../db')

/**
 * GET /api/schedule
 * ดึงรายการกำหนดการทั้งหมด (เรียงตาม sort_order)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM schedules ORDER BY sort_order ASC, id ASC'
    )

    // แปลง field ให้ตรงกับ frontend
    const formatted = rows.map(row => ({
      id: row.id,
      time: row.time_range,
      title: row.title,
      description: row.description,
      icon: row.icon,
      highlight: row.highlight === 1,
      sortOrder: row.sort_order
    }))

    res.json(formatted)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกำหนดการ' })
  }
})

/**
 * POST /api/schedule
 * เพิ่มกำหนดการใหม่
 */
router.post('/', async (req, res) => {
  try {
    const { time, title, description, icon, highlight, sortOrder } = req.body

    if (!time || !title) {
      return res.status(400).json({ message: 'กรุณากรอกเวลาและชื่อกำหนดการ' })
    }

    const [result] = await pool.execute(
      `INSERT INTO schedules (time_range, title, description, icon, highlight, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [time, title, description || null, icon || 'calendar', highlight ? 1 : 0, sortOrder || 0]
    )

    res.status(201).json({
      message: 'เพิ่มกำหนดการสำเร็จ',
      id: result.insertId
    })
  } catch (error) {
    console.error('Error creating schedule:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มกำหนดการ' })
  }
})

/**
 * PUT /api/schedule/:id
 * แก้ไขกำหนดการ
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { time, title, description, icon, highlight, sortOrder } = req.body

    const [result] = await pool.execute(
      `UPDATE schedules 
       SET time_range = ?, title = ?, description = ?, icon = ?, highlight = ?, sort_order = ?
       WHERE id = ?`,
      [time, title, description || null, icon || 'calendar', highlight ? 1 : 0, sortOrder || 0, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบกำหนดการ' })
    }

    res.json({ message: 'แก้ไขกำหนดการสำเร็จ' })
  } catch (error) {
    console.error('Error updating schedule:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขกำหนดการ' })
  }
})

/**
 * DELETE /api/schedule/:id
 * ลบกำหนดการ
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.execute(
      'DELETE FROM schedules WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบกำหนดการ' })
    }

    res.json({ message: 'ลบกำหนดการสำเร็จ' })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบกำหนดการ' })
  }
})

module.exports = router
