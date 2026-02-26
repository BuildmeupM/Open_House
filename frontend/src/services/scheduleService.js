const API_BASE = '/api'

/**
 * ดึงข้อมูลกำหนดการทั้งหมด
 * @returns {Promise<Array>} - รายการกำหนดการ
 */
export async function getSchedules() {
  const response = await fetch(`${API_BASE}/schedule`)

  if (!response.ok) {
    throw new Error('Failed to fetch schedules')
  }

  return response.json()
}

/**
 * เพิ่มกำหนดการใหม่
 * @param {Object} scheduleData - ข้อมูลกำหนดการ
 * @returns {Promise<Object>}
 */
export async function createSchedule(scheduleData) {
  const response = await fetch(`${API_BASE}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheduleData)
  })

  if (!response.ok) {
    throw new Error('Failed to create schedule')
  }

  return response.json()
}

/**
 * แก้ไขกำหนดการ
 * @param {number} id - ID กำหนดการ
 * @param {Object} scheduleData - ข้อมูลที่จะอัปเดต
 * @returns {Promise<Object>}
 */
export async function updateSchedule(id, scheduleData) {
  const response = await fetch(`${API_BASE}/schedule/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheduleData)
  })

  if (!response.ok) {
    throw new Error('Failed to update schedule')
  }

  return response.json()
}

/**
 * ลบกำหนดการ
 * @param {number} id - ID กำหนดการ
 * @returns {Promise<Object>}
 */
export async function deleteSchedule(id) {
  const response = await fetch(`${API_BASE}/schedule/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete schedule')
  }

  return response.json()
}
