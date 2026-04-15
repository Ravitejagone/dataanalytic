const axios = require('axios');

async function testSignup() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', {
      username: 'testuser',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'User'
    });
    console.log(res.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

testSignup();
