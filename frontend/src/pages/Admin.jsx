import { useState, useEffect } from 'react'
import { Trash2, ShieldAlert, LogIn, Users } from 'lucide-react'
import { getRegistrations, deleteRegistration } from '../services/registrationService'
import '../styles/Admin.css'

function Admin() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // จัดการการเข้าระบบ
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === '9996') {
      setIsAuthenticated(true)
      setError('')
      fetchData()
    } else {
      setError('รหัสผ่านไม่ถูกต้อง')
      setPassword('')
    }
  }

  // ดึงข้อมูล
  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getRegistrations()
      setRegistrations(data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('ไม่สามารถดึงข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  // ลบข้อมูล
  const confirmDelete = (id) => {
    setDeleteTarget(id)
  }

  const executeDelete = async () => {
    if (!deleteTarget) return
    
    setIsDeleting(true)
    try {
      await deleteRegistration(deleteTarget)
      // อัปเดต state ทันทีด้วยการกรองตัวที่ลบออก
      setRegistrations(prev => prev.filter(reg => reg.id !== deleteTarget))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting registration:', err)
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    } finally {
      setIsDeleting(false)
    }
  }

  // หน้า Login ถ้ายังไม่ได้ยืนยันตัวตน
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <ShieldAlert size={48} color="#ea580c" style={{ marginBottom: '1rem' }} />
            <h2>Admin Login</h2>
            <p>กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบจัดการข้อมูล</p>
            
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                className="admin-login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
              <button type="submit" className="btn btn-primary admin-login-btn">
                <LogIn size={18} style={{ marginRight: '8px' }} />
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // หน้าจอเมื่อ Login ผ่าน
  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h2 className="admin-title">
            <Users size={24} color="#ea580c" />
            ข้อมูลผู้ลงทะเบียนทั้งหมด
          </h2>
          <div className="admin-stats">
            ยอดลงทะเบียน: {registrations.length} คน
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            กำลังโหลดข้อมูล...
          </div>
        ) : registrations.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ชื่อเล่น</th>
                  <th>เบอร์โทร</th>
                  <th>สำนักงานบัญชี</th>
                  <th>จังหวัด</th>
                  <th>วันที่ลงทะเบียน</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, index) => (
                  <tr key={reg.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: '500' }}>{reg.full_name}</td>
                    <td>{reg.nickname || '-'}</td>
                    <td>{reg.phone}</td>
                    <td>{reg.office_name || '-'}</td>
                    <td>{reg.province || '-'}</td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(reg.created_at).toLocaleString('th-TH')}
                    </td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => confirmDelete(reg.id)}
                        title="ลบข้อมูล"
                      >
                        <Trash2 size={14} />
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <p>ยังไม่มีข้อมูลผู้ลงทะเบียน</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget !== null && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 className="admin-modal-title">ยืนยันการลบข้อมูล</h3>
            <p className="admin-modal-desc">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การกระทำนี้ไม่สามารถกู้คืนได้</p>
            <div className="admin-modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
              >
                ยกเลิก
              </button>
              <button 
                className="btn-delete admin-modal-confirm" 
                onClick={executeDelete}
                disabled={isDeleting}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
