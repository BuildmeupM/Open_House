import { Heart, Sparkles } from 'lucide-react'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__brand">
          <Sparkles size={20} className="footer__icon" />
          <span>Open House</span>
        </div>
        <p className="footer__text">
          ขอบคุณที่ให้ความสนใจ — พบกันในงาน!
        </p>
        <p className="footer__copyright">
          Made with <Heart size={14} className="footer__heart" /> &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
