import { useState } from 'react'
import { 
  User, 
  Phone, 
  Building, 
  MapPin,
  Send, 
  CheckCircle2, 
  AlertCircle,
  Smile
} from 'lucide-react'
import { submitRegistration } from '../services/registrationService'
import SearchableSelect from '../components/SearchableSelect'
import '../styles/Registration.css'

const PROVINCES = [
  'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร',
  'ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท',
  'ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง',
  'ตราด','ตาก','นครนายก','นครปฐม','นครพนม',
  'นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส',
  'น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์',
  'ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พังงา','พัทลุง',
  'พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์','แพร่',
  'พะเยา','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน',
  'ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง',
  'ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย',
  'ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ',
  'สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี',
  'สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย',
  'หนองบัวลำภู','อ่างทอง','อุดรธานี','อุทัยธานี','อุตรดิตถ์',
  'อุบลราชธานี','อำนาจเจริญ'
]

function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    phone: '',
    officeName: '',
    province: ''
  })

  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.nickname || !formData.phone || !formData.officeName || !formData.province) {
      setStatus({ type: 'error', message: 'กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบทุกช่อง' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      await submitRegistration(formData)
      setStatus({ type: 'success', message: 'ลงทะเบียนสำเร็จ! 🎉 ขอบคุณที่ลงทะเบียนเข้าร่วมงาน' })
      
      // Show success video modal
      setShowSuccessModal(true)
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 3000)
      
      setFormData({
        fullName: '',
        nickname: '',
        phone: '',
        officeName: '',
        province: ''
      })
    } catch (error) {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="registration-page">
      <div className="registration-page__bg">
        <div className="registration-page__orb registration-page__orb--1"></div>
        <div className="registration-page__orb registration-page__orb--2"></div>
      </div>

      <div className="container">
        <div className="registration-page__header">
          <h1 className="section-title">ลงทะเบียนเข้าร่วมงาน เปิดบ้าน BMU</h1>
          <p className="section-subtitle">
            กรอกข้อมูลด้านล่างเพื่อลงชื่อเข้าร่วมการเปิดบ้าน BMU
          </p>
        </div>

        <div className="registration-form-wrapper">
          <form className="registration-form" onSubmit={handleSubmit}>
            {/* ชื่อ-นามสกุล */}
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                ชื่อ-นามสกุล <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* ชื่อเล่น */}
            <div className="form-group">
              <label className="form-label">
                <Smile size={16} />
                ชื่อเล่น <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nickname"
                className="form-input"
                placeholder="กรอกชื่อเล่น"
                value={formData.nickname}
                onChange={handleChange}
              />
            </div>

            {/* เบอร์โทร */}
            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                เบอร์โทรศัพท์ <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="0XX-XXX-XXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* ชื่อสำนักงานบัญชี */}
            <div className="form-group">
              <label className="form-label">
                <Building size={16} />
                ชื่อสำนักงานบัญชี <span className="required">*</span>
              </label>
              <input
                type="text"
                name="officeName"
                className="form-input"
                placeholder="กรอกชื่อสำนักงานบัญชี"
                value={formData.officeName}
                onChange={handleChange}
              />
            </div>

            {/* จังหวัด */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                จังหวัด <span className="required">*</span>
              </label>
              <SearchableSelect
                options={PROVINCES}
                value={formData.province}
                onChange={handleChange}
                name="province"
                placeholder="-- เลือกจังหวัด --"
              />
            </div>

            {/* Status */}
            {status.message && (
              <div className={`form-status form-status--${status.type}`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="form-loading">กำลังส่ง...</span>
              ) : (
                <>
                  <Send size={18} />
                  ลงทะเบียน
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Video Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <button 
              className="success-modal-close" 
              onClick={() => setShowSuccessModal(false)}
            >
              &times;
            </button>
            <div className="success-modal-video-container">
              <video 
                src="/สิงโตไหว้%20แก้ไข2.mp4" 
                className="success-modal-video" 
                autoPlay 
                muted 
                loop 
                playsInline
              />
            </div>
            {/* ฝังไฟล์เสียงไว้ใน Modal ให้เล่นอัตโนมัติเมื่อ Modal เปิดขึ้นมา */}
            <audio src="/ลงทะเบียนเรียบร้อยแล้วค่ะ.wav" autoPlay />
            <h3 className="success-modal-title">ลงทะเบียนสำเร็จแล้วค่ะ!</h3>
            <p className="success-modal-desc">ขอบคุณที่มาร่วมงานเปิดบ้าน BMU ของเรา</p>
            <button 
              className="btn btn-primary success-modal-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Registration
