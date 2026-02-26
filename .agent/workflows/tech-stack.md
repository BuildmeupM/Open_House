---
description: กฎ Tech Stack - ใช้ Vite + Node.js เท่านั้น
---

# Tech Stack Rules (กฎเทคโนโลยีที่ใช้)

## Frontend: Vite + React เท่านั้น

- **Framework**: React (via Vite)
- **Styling**: Vanilla CSS เท่านั้น (ห้ามใช้ TailwindCSS, Sass, LESS)
- **Routing**: react-router-dom
- **Icons**: lucide-react
- **HTTP Client**: fetch API (built-in) หรือ axios
- **ห้ามใช้**: Next.js, Nuxt.js, Angular, Vue, Svelte หรือ framework อื่น

## Backend: Node.js + Express เท่านั้น

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Driver**: mysql2
- **Environment**: dotenv
- **CORS**: cors package
- **ห้ามใช้**: NestJS, Fastify, Hapi, Koa หรือ framework อื่น

## Database: MySQL

- ใช้ MySQL ที่อยู่บน NAS
- ข้อมูลเป็นแบบชั่วคราว สามารถลบออกได้
- ตั้งค่าการเชื่อมต่อผ่าน `.env` file

## สรุป Dependencies

### Frontend (`frontend/package.json`)

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x"
  }
}
```

### Backend (`backend/package.json`)

```json
{
  "dependencies": {
    "express": "^4.x",
    "mysql2": "^3.x",
    "cors": "^2.x",
    "dotenv": "^16.x"
  }
}
```
