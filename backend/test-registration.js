const fetch = require('node-fetch');

async function testRegistration() {
  const data = {
    fullName: "นายทดสอบ ระบบดี",
    nickname: "เทส",
    phone: "0812345678",
    officeName: "บจก. ทดสอบบัญชี",
    province: "กรุงเทพมหานคร"
  };

  try {
    const res = await fetch('http://localhost:6000/api/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testRegistration();
