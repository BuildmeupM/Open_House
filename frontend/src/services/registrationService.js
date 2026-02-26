const API_BASE = '/api'

/**
 * ส่งข้อมูลลงทะเบียนไปยัง Backend
 * @param {Object} formData - ข้อมูลฟอร์ม
 * @returns {Promise<Object>} - ผลลัพธ์จาก API
 */
export async function submitRegistration(formData) {
  const response = await fetch(`${API_BASE}/registration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Registration failed')
  }

  return response.json()
}

/**
 * ดึงรายการผู้ลงทะเบียนทั้งหมด
 * @returns {Promise<Array>} - รายการผู้ลงทะเบียน
 */
export async function getRegistrations() {
  const response = await fetch(`${API_BASE}/registration`)

  if (!response.ok) {
    throw new Error('Failed to fetch registrations')
  }

  return response.json()
}

/**
 * ลบข้อมูลผู้ลงทะเบียนตาม ID
 * @param {number} id - ID ผู้ลงทะเบียน
 * @returns {Promise<Object>}
 */
export async function deleteRegistration(id) {
  const response = await fetch(`${API_BASE}/registration/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete registration')
  }

  return response.json()
}
