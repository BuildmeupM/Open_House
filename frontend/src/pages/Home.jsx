import { useState, useEffect, useRef } from "react";
import { CalendarDays, Clock, MapPin, Users, UserCheck } from "lucide-react";
import QRCodeSection from "../components/QRCodeSection";
import { getRegistrations } from "../services/registrationService";
import "../styles/Home.css";

const schedule = [
  {
    id: 1,
    startTime: "11:00",
    endTime: "13:00",
    title: "ลงทะเบียนเข้าร่วมงาน",
    img: "/สิงโต สวัสดี.png",
  },
  {
    id: 2,
    startTime: "13:00",
    endTime: "15:00",
    title: "บรรยายหัวข้อต่าง ๆ",
    speaker: "คุณ กนกวรรณ สมศรี",
    subItems: [
      "ที่มาและจุดเริ่มต้นของ Build Me Up",
      "ระบบการทำงานที่นำมาปรับใช้ในองค์กร",
      "แชร์ประสบการณ์จากมุมมองการดูแลลูกค้าและการบริหารทีมงาน",
      "สวัสดิการของบริษัท และผลต่อการตัดสินใจทำงาน รวมถึงการสรรหาบุคลากรได้อย่างรวดเร็ว",
      "ช่องทางและกลยุทธ์การหาลูกค้า",
    ],
    img: "/สิงโต ถือโทรโข่ง.png",
  },
  {
    id: 3,
    startTime: "15:00",
    endTime: "15:30",
    title: "พักเบรก",
    img: "/สิงโต นอนเท้าคาง.png",
  },
  {
    id: 4,
    startTime: "15:30",
    endTime: "16:00",
    title: "มุมมองจากพนักงาน “เสาหลักที่ 4” ต่อองค์กร",
    img: "/สิงโต ยืนถือโน๊ตบุค.png",
  },
  {
    id: 5,
    startTime: "16:00",
    endTime: "17:00",
    title: "เยี่ยมชมแต่ละแผนกภายในบริษัท",
    img: "/สิงโต สงสัย กำลังคิด.png",
  },
  {
    id: 6,
    startTime: "17:00",
    endTime: "17:30",
    title: "ช่วงถาม–ตอบ (Q&A)",
    img: "/สิงโต ชี้ขึ้น.png",
  },
];


/* แปลง "HH:MM" เป็นจำนวนนาที */
function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function Home() {
  const [now, setNow] = useState(new Date());
  const alertedRef = useRef(new Set());
  const [registrations, setRegistrations] = useState([]);
  const [newEntryId, setNewEntryId] = useState(null);

  /* อัปเดตเวลา */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ดึงรายชื่อผู้ลงทะเบียน + polling ทุก 5 วินาที */
  useEffect(() => {
    let prevIds = new Set();

    const fetchData = async () => {
      try {
        const data = await getRegistrations();
        // ตรวจหา entry ใหม่
        const currentIds = new Set(data.map((r) => r.id));
        const newIds = [...currentIds].filter((id) => !prevIds.has(id));
        if (newIds.length > 0 && prevIds.size > 0) {
          setNewEntryId(newIds[0]);
          setTimeout(() => setNewEntryId(null), 3000);
        }
        prevIds = currentIds;
        setRegistrations(data);
      } catch (err) {
        console.error("ดึงข้อมูลผู้ลงทะเบียนไม่ได้:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  /* เวลาปัจจุบันเป็นนาที */
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  /* ฟังก์ชันเล่นเสียงเตือน */
  const playAlert = (id) => {
    if (alertedRef.current.has(id)) return;
    alertedRef.current.add(id);
    try {
      const audio = new Audio("/sounds/alert.mp3");
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch (e) {
      /* ไม่มีไฟล์เสียง */
    }
  };

  /* ตรวจสอบว่าเป็นวันงานหรือไม่ (26 ก.พ. 2026) */
  const isEventDay =
    now.getFullYear() === 2026 && now.getMonth() === 1 && now.getDate() === 26;

  /* หาสถานะของแต่ละรายการ */
  const getStatus = (item) => {
    if (!isEventDay) return "normal";
    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);
    if (currentMinutes >= end) return "past";
    if (currentMinutes >= start && currentMinutes < end) return "active";
    return "upcoming";
  };

  /* ตรวจสอบเสียงเตือน */
  useEffect(() => {
    schedule.forEach((item) => {
      if (getStatus(item) === "active") {
        playAlert(item.id);
      }
    });
  }, [currentMinutes]);

  /* format เวลาปัจจุบัน */
  const clockStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="home-full">
      {/* ===== แถบหัวข้อด้านบน ===== */}
      <header className="home-banner">
        <img
          src="/logo-banner.png"
          alt="BMU Logo"
          className="home-banner__logo"
        />
        <h1 className="home-banner__title">ยินดีต้อนรับสู่บ้านของพวกเรา</h1>
        <div className="home-banner__meta">
          <span>
            <CalendarDays size={15} /> วันพฤหัสที่ 26 กุมภาพันธ์
          </span>
          <span>
            <Clock size={15} /> 11:00 - 17:30 น.
          </span>
          <span>
            <MapPin size={15} /> สำนักงาน BMU
          </span>
        </div>
        <div className="home-banner__clock">
          <Clock size={20} />
          <span className="home-banner__clock-time">{clockStr}</span>
        </div>
      </header>

      {/* ===== 3 กล่องด้านล่าง ===== */}
      <div className="home-columns">
        {/* กล่อง 1: QR Code (ซ้าย) */}
        <div className="home-box">
          <h2 className="home-box__title">QR Code ลงทะเบียน</h2>
          <div className="home-box__content home-box__content--center">
            <QRCodeSection inline />
          </div>
        </div>

        {/* กล่อง 2: รายชื่อผู้ลงทะเบียน (กลาง) */}
        <div className="home-box">
          <h2 className="home-box__title">
            รายชื่อผู้ลงทะเบียน
            <span className="reg-list__count">
              <UserCheck size={16} />
              {registrations.length} คน
            </span>
          </h2>
          <div className="home-box__content reg-list-wrapper">
            {registrations.length === 0 ? (
              <div className="reg-list__empty">
                <Users size={48} strokeWidth={1} />
                <p>ยังไม่มีผู้ลงทะเบียน</p>
                <span>เมื่อมีคนลงทะเบียนจะแสดงขึ้นที่นี่ทันที</span>
              </div>
            ) : (
              <ul className="reg-list">
                {registrations.map((reg, idx) => (
                  <li
                    key={reg.id}
                    className={`reg-list__item ${newEntryId === reg.id ? "reg-list__item--new" : ""}`}
                  >
                    <span className="reg-list__num">
                      {registrations.length - idx}
                    </span>
                    <div className="reg-list__info">
                      <span className="reg-list__name">{reg.full_name}</span>
                      {reg.nickname && (
                        <span className="reg-list__nickname">
                          ({reg.nickname})
                        </span>
                      )}
                      {reg.office_name && (
                        <span className="reg-list__office">
                          {reg.office_name}
                        </span>
                      )}
                    </div>
                    {newEntryId === reg.id && (
                      <span className="reg-list__new-badge">✨ ใหม่</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* กล่อง 3: กำหนดการ (ขวา) */}
        <div className="home-box">
          <h2 className="home-box__title">กำหนดการ</h2>
          <div className="home-box__content">
            {schedule.map((item) => {
              const status = getStatus(item);
              return (
                <div key={item.id} className={`sched-row sched-row--${status}`}>
                  <div className="sched-row__icon sched-row__icon--mascot">
                    <img
                      src={item.img}
                      alt=""
                      className="sched-row__mascot-img"
                    />
                  </div>
                  <div className="sched-row__info">
                    <span className="sched-row__time">
                      {item.startTime} - {item.endTime}
                    </span>
                    <span className="sched-row__name">
                      {item.title}
                      {item.speaker && (
                        <span className="sched-row__speaker"> โดย <strong>{item.speaker}</strong></span>
                      )}
                    </span>
                    {item.subItems && (
                      <ul className="sched-row__subitems">
                        {item.subItems.map((sub, i) => (
                          <li key={i}>{sub}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {status === "active" && (
                    <span className="sched-row__live-badge">
                      <span className="sched-row__live-dot"></span>
                      กำลังดำเนินการ
                    </span>
                  )}
                  {status === "past" && (
                    <span className="sched-row__done-badge">✓ เสร็จแล้ว</span>
                  )}
                </div>
              );
            })}
            <p className="sched-note">หมายเหตุ : กำหนดการอาจมีการเปลี่ยนแปลง</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
