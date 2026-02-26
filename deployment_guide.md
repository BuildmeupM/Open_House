# คู่มือการนำระบบ Open House ขึ้นใช้งานจริง (Deployment Guide)

เอกสารนี้ครอบคลุมขั้นตอนการนำระบบ **Open House Registration** ขึ้นสู่ Production โดยใช้ **Vercel** สำหรับฝั่ง Frontend และ **Railway** สำหรับฝั่ง Backend (API)

เนื่องจากระบบนี้ฐานข้อมูล (Database) รันอยู่บน NAS ภายในที่ถูก Forward Port / DDNS เอาไว้แล้ว (buildmeupconsultant...) ดังนั้นเราจะจับคู่ Backend API ของเราไปต่อเข้ากับ NAS โดยตรงจากบน Cloud

---

## 1. การเตรียมตัว (Preparation)

ก่อนเริ่มนำขึ้นระบบ คุณต้องมั่นใจว่าโค้ดทั้งหมด (Frontend และ Backend) ถูกอัพโหลดขึ้นไปเก็บบน **GitHub Repository** เรียบร้อยแล้ว

---

## 2. การนำ Backend ขึ้น Server (ด้วย Railway.app)

**Railway** เป็นบริการที่รัน Node.js ง่ายและเชื่อมต่อกับ GitHub ได้โดยตรง

1. สมัครใช้งานและล็อกอินเข้าสู่ [Railway.app](https://railway.app/)
2. กดปุ่ม `New Project` -> เลือก `Deploy from GitHub repo`
3. เลือก Repository ของคุณ
4. **ตั้งค่า Root Directory:**
   - ไปที่แท็บ `Settings` ของ Service
   - หาหัวข้อ `Root Directory` แล้วพิมพ์ `/backend` ลงไป (เพื่อให้ Railway รู้ว่าต้องรันจากโฟลเดอร์ฝั่ง API)
5. **ตั้งค่า Environment Variables (ตัวแปรระบบ):**
   - ไปที่แท็บ `Variables` รบกวนกด `New Variable` แล้วใส่ข้อมูลให้ครบถ้วนเหมือนในไฟล์ `.env` ของคุณ:
     ```env
     DB_HOST=buildmeupconsultant.direct.quickconnect.to
     DB_PORT=3306
     DB_USER=buildmeM
     DB_PASSWORD=Buildmeup23.04.2022
     DB_NAME=openhouse
     PORT=6000
     ```
6. **เปิดให้ API ถูกเข้าถึงได้จากภายนอก:**
   - ไปที่แท็บ `Settings` -> เลื่อนลงมาที่ `Networking`
   - คลิกปุ่ม `Generate Domain` (Railway จะสร้าง URL มาให้ เช่น `https://web-production-abcd.up.railway.app`)
   - **⚠️ ข้อสำคัญ:** ให้คัดลอก URL นี้เก็บไว้ เราจะต้องนำไปใช้ในฝั่ง Frontend

---

## 3. การนำ Frontend ขึ้น Server (ด้วย Vercel.com)

**Vercel** เป็นพื้นที่ให้บริการสำหรับรันเว็บ React/Vite ที่เร็วและฟรี

1. สมัครใช้งานและล็อกอินเข้าสู่ [Vercel.com](https://vercel.com/)
2. กดปุ่ม `Add New...` -> `Project`
3. เลือก Repository GitHub ตัวเดียวกัน
4. ในหน้าตั้งค่าโปรเจกต์ (Configure Project):
   - **Framework Preset**: เลือกเป็น `Vite`
   - **Root Directory**: กด `Edit` และเลือกโฟลเดอร์ `/frontend`
5. **ตั้งค่าให้ Frontend รู้จัก Backend บน Railway:**
   - ในระบบนี้ ฝั่ง Frontend เราเรียก API ผ่านไฟล์ `registrationService.js` โดยใช้ตัวแปร `const API_BASE = '/api' `
   - **การแก้ไขโค้ดที่จำเป็นก่อน Deploy Frontend:** คุณต้องกลับเข้าไปแก้ไฟล์ `frontend/src/services/registrationService.js` ชั่วคราว (หรือจะเขียนระบบ Environment Variable `.env` ฝั่ง React ไว้ดักด้วยก็ได้)
   - **วิธีที่ 1 (แก้ Hardcode - ง่ายสุด):**
     เปลี่ยนบรรทัดที่ 1 ใน `registrationService.js` จาก
     `const API_BASE = '/api'`
     ไปเป็น
     `const API_BASE = 'https://[URL-จาก-RAILWAY-ของคุณ]/api'`
6. กดปุ่ม `Deploy` รอประมาณ 1-2 นาที Vercel จะสร้าง URL สำหรับเปิดหน้าเว็บให้ เช่น `https://openhouse-frontend.vercel.app`

---

## 4. จัดการปัญหา CORS (การเชื่อมต่อข้ามโดเมน)

เมื่อคุณแยก Frontend และ Backend ให้อยู่คนละที่ การยิง API จะถูกบล็อกด้วยระบบความปลอดภัย (CORS)

คุณต้องกลับไปแก้ไฟล์ที่ฝั่ง **Backend** (`backend/server.js`) บริเวณบรรทัดที่เกี่ยวกับ CORS จากเดิมที่เป็น `app.use(cors())` ธรรมดา ให้กลายเป็น:

```javascript
app.use(
  cors({
    origin: "https://[URL-จาก-VERCEL-ของคุณ].vercel.app",
    credentials: true,
  }),
);
```

_(ถ้าขี้เกียจใส่เจาะจงโดเมนสามารถใช้ `app.use(cors())` แบบเดิมได้ แต่ต้องระวังเรื่องความจุและใครก็สามารถดูด API เราไปใช้ได้)_

เมื่อเชื่อมต่อโค้ดเสร็จแล้ว อย่าลืม **Git Commit & Push** โค้ดทั้งหมดขึ้น GitHub อีกรอบ ทั้ง Railway และ Vercel จะทำการอัปเดตระบบให้ใหม่โดยอัตโนมัติ

---

## 5. ตรวจสอบระบบรอบสุดท้าย

1. เข้าไปที่ลิงก์ Production URL ของ Vercel
2. ลองกด **ลงทะเบียน** ผู้ใช้งานใหม่ผ่านหน้าเว็บ หากข้อมูลถูกบันทึกสำเร็จ (เด้งวิดีโอป๊อปอัพ) แสดงว่า Frontend คุยกับ Railway และ Railway คุยกับ NAS สำเร็จ
3. เข้า URL `/admin` แล้วกรอกรหัส `9996`
4. เทสการลบข้อมูล (Delete) หากลบได้สมบูรณ์ ก็ถือว่าพร้อมใช้ 100% ครับ!
