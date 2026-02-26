import { useState, useEffect } from 'react'
import { 
  Clock, 
  MapPin, 
  CalendarDays,
  Coffee,
  Presentation,
  Users,
  PartyPopper,
  Utensils,
  MessageCircle
} from 'lucide-react'
import { getSchedules } from '../services/scheduleService'
import '../styles/Schedule.css'

// Default schedule if API not available yet
const defaultSchedule = [
  {
    id: 1,
    time: '11:00 - 13:00',
    title: 'ลงทะเบียนเข้าร่วมงานเปิดบ้าน',
    description: 'ลงทะเบียนและรับเอกสารประกอบการเข้าชม พร้อมเครื่องดื่มต้อนรับ',
    icon: 'coffee',
    highlight: false
  },
  {
    id: 2,
    time: '13:00 - 15:00',
    title: 'อธิบายเล่าที่มาของ บิลด์มีอัพ',
    description: 'รับฟังเรื่องราวความเป็นมาและวิสัยทัศน์ของบิลด์มีอัพ',
    icon: 'presentation',
    highlight: true
  },
  {
    id: 3,
    time: '15:00 - 15:30',
    title: 'พักเบรก',
    description: 'พักผ่อนและรับประทานอาหารว่าง',
    icon: 'utensils',
    highlight: false
  },
  {
    id: 4,
    time: '15:30 - 16:30',
    title: 'เดินชมสำนักงานแผนกต่าง ๆ',
    description: 'พาชมสภาพแวดล้อมการทำงาน ห้องประชุม และแผนกต่าง ๆ ภายในสำนักงาน',
    icon: 'users',
    highlight: true
  },
  {
    id: 5,
    time: '16:30 - 17:30',
    title: 'ตอบคำถามข้อสงสัยต่าง ๆ',
    description: 'ตอบข้อสงสัยทุกคำถาม พูดคุยแลกเปลี่ยนอย่างเป็นกันเอง',
    icon: 'message',
    highlight: false
  }
]

const iconMap = {
  coffee: <Coffee size={24} />,
  presentation: <Presentation size={24} />,
  users: <Users size={24} />,
  utensils: <Utensils size={24} />,
  message: <MessageCircle size={24} />,
  party: <PartyPopper size={24} />
}

function Schedule() {
  const [schedules, setSchedules] = useState(defaultSchedule)

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedules()
        if (data && data.length > 0) {
          setSchedules(data)
        }
      } catch {
        // Use default schedule if API is not ready
      }
    }
    fetchSchedules()
  }, [])

  return (
    <div className="schedule-page">
      <div className="schedule-page__bg">
        <div className="schedule-page__orb schedule-page__orb--1"></div>
        <div className="schedule-page__orb schedule-page__orb--2"></div>
      </div>

      <div className="container">
        <div className="schedule-page__header">
          <h1 className="section-title">กำหนดการ</h1>
          <p className="section-subtitle">
            ตารางกิจกรรมตลอดทั้งวันในงาน Open House
          </p>
          <div className="schedule-page__meta">
            <div className="schedule-page__meta-item">
              <CalendarDays size={18} />
              <span>เร็วๆ นี้</span>
            </div>
            <div className="schedule-page__meta-item">
              <MapPin size={18} />
              <span>สำนักงานบริษัท</span>
            </div>
          </div>
        </div>

        <div className="timeline">
          {schedules.map((item, index) => (
            <div
              key={item.id || index}
              className={`timeline-item ${item.highlight ? 'timeline-item--highlight' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="timeline-item__marker">
                <div className="timeline-item__dot"></div>
                {index < schedules.length - 1 && <div className="timeline-item__line"></div>}
              </div>

              <div className="timeline-item__content">
                <div className="timeline-item__time">
                  <Clock size={14} />
                  <span>{item.time}</span>
                </div>
                <div className="timeline-item__card">
                  <div className="timeline-item__icon">
                    {iconMap[item.icon] || <CalendarDays size={24} />}
                  </div>
                  <div className="timeline-item__info">
                    <h3 className="timeline-item__title">{item.title}</h3>
                    <p className="timeline-item__desc">{item.description}</p>
                  </div>
                  {item.highlight && (
                    <span className="timeline-item__badge">แนะนำ</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Schedule
