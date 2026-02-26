const id = 33;
fetch(`http://localhost:6000/api/registration/${id}`, { method: 'DELETE' })
  .then(async res => {
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
  })
  .catch(err => console.error(err));
