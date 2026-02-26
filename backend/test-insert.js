const { pool } = require('./db');

async function insertTestRegistration() {
  try {
    const [result] = await pool.execute(
      `INSERT INTO registrations (full_name, nickname, phone, office_name, province)
       VALUES (?, ?, ?, ?, ?)`,
      ['นายสมพงษ์ ยืนยง', 'พงษ์', '0899999999', 'สำนักงานบัญชีสมพงษ์', 'กรุงเทพมหานคร']
    );
    console.log('✅ บันทึกข้อมูลทดสอบสำเร็จ ID:', result.insertId);
    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

insertTestRegistration();
