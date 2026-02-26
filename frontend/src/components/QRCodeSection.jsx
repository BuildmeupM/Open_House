import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ScanLine, Copy, Check, ExternalLink } from 'lucide-react'
import '../styles/QRCodeSection.css'

function QRCodeSection({ inline }) {
  const [copied, setCopied] = useState(false)
  const [registrationUrl, setRegistrationUrl] = useState('')

  useEffect(() => {
    const { protocol, hostname, port } = window.location
    const host = port ? `${hostname}:${port}` : hostname
    setRegistrationUrl(`${protocol}//${host}/registration`)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className={`qr-section ${inline ? 'qr-section--inline' : ''}`}>
      <div className="container">
        <h2 className="section-title">สแกนเพื่อลงทะเบียน</h2>
        <p className="section-subtitle">
          ใช้กล้องมือถือสแกน QR Code ด้านล่างเพื่อเข้าสู่หน้าลงทะเบียนได้ทันที
        </p>

        <div className="qr-card">
          <div className="qr-card__glow"></div>

          {/* QR Code */}
          <div className="qr-card__code-wrapper">
            <div className="qr-card__code">
              {registrationUrl && (
                <QRCodeSVG
                  value={registrationUrl}
                  size={320}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
            <div className="qr-card__corners">
              <span></span><span></span><span></span><span></span>
            </div>
            <img src="/สิงโต ชู 2 นิ้ว.png" alt="มาสคอต" className="qr-lion-corner" />
          </div>

          {/* Info */}
          <div className="qr-card__info">
            <div className="qr-card__label">
              <ScanLine size={18} />
              <span>สแกน QR Code นี้ด้วยกล้องมือถือ</span>
            </div>

            <div className="qr-card__url-box">
              <span className="qr-card__url">{registrationUrl}</span>
              <button
                className="qr-card__copy-btn"
                onClick={handleCopy}
                title="คัดลอกลิงก์"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <a
              href={registrationUrl}
              className="btn btn-primary qr-card__open-btn"
            >
              <ExternalLink size={16} />
              เปิดหน้าลงทะเบียน
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QRCodeSection
