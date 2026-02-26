---
description: กฎโครงสร้างโปรเจกต์ - แยกไฟล์เป็นส่วนๆ ห้ามรวมไฟล์
---

# Project Structure Rules (โครงสร้างโปรเจกต์)

## ภาพรวม

โปรเจกต์ Open House ใช้สถาปัตยกรรมแบบ Monorepo โดยแบ่งเป็น 2 ส่วนหลัก:

- `frontend/` — Vite + React
- `backend/` — Node.js + Express

---

## กฎข้อที่ 1: แยกไฟล์เพจ (Pages) ออกเป็นไฟล์ละหน้า

- ทุกหน้าเพจต้องอยู่ใน `frontend/src/pages/` โดย **1 ไฟล์ = 1 หน้า**
- ห้ามรวมหลายหน้าไว้ในไฟล์เดียวกัน
- ตัวอย่าง:
  ```
  frontend/src/pages/
  ├── Home.jsx
  ├── Registration.jsx
  ├── Schedule.jsx
  └── Admin.jsx
  ```

## กฎข้อที่ 2: แยกไฟล์ Component ออกเป็นส่วนๆ

- ทุก Component ที่ใช้ซ้ำได้ต้องอยู่ใน `frontend/src/components/`
- **1 Component = 1 ไฟล์**
- ตัวอย่าง:
  ```
  frontend/src/components/
  ├── Navbar.jsx
  ├── Footer.jsx
  ├── RegistrationForm.jsx
  └── ScheduleCard.jsx
  ```

## กฎข้อที่ 3: แยกไฟล์ CSS ตาม Component/Page

- ทุกไฟล์ CSS ต้องแยกตาม Component หรือ Page ที่เกี่ยวข้อง
- ใช้ Vanilla CSS เท่านั้น ห้ามใช้ TailwindCSS
- ตัวอย่าง:
  ```
  frontend/src/styles/
  ├── global.css        (เฉพาะ reset, font, color variables)
  ├── Navbar.css
  ├── Home.css
  ├── Registration.css
  └── Schedule.css
  ```

## กฎข้อที่ 4: แยกไฟล์ API Routes ฝั่ง Backend ออกเป็นส่วนๆ

- ทุก API Route ต้องอยู่ใน `backend/routes/` โดย **1 ไฟล์ = 1 กลุ่ม API**
- ห้ามรวม Route ทั้งหมดไว้ใน `server.js`
- `server.js` ทำหน้าที่เป็น entry point และ mount routes เท่านั้น
- ตัวอย่าง:
  ```
  backend/
  ├── server.js             (entry point, mount routes)
  ├── db.js                 (database connection config)
  ├── routes/
  │   ├── registration.js   (API สำหรับลงทะเบียน)
  │   └── schedule.js       (API สำหรับกำหนดการ)
  └── .env                  (ข้อมูลเชื่อมต่อ DB - ห้าม commit)
  ```

## กฎข้อที่ 5: แยกไฟล์ Service ฝั่ง Frontend

- ทุก Service (เรียก API) ต้องอยู่ใน `frontend/src/services/`
- **1 ไฟล์ = 1 กลุ่ม API calls**
- ตัวอย่าง:
  ```
  frontend/src/services/
  ├── registrationService.js
  └── scheduleService.js
  ```

## โครงสร้างรวม

```
OpenHouse/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── routes/
│   ├── server.js
│   ├── db.js
│   ├── .env
│   └── package.json
└── README.md
```
