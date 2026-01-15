// Simple single test to verify cardiologist keyword
const axios = require('axios');

axios.post('http://localhost:3000/api/v1/parse', {
  text: 'Book appointment with cardiologist tomorrow at 10am'
}).then(response => {
  console.log('TEST: Cardiologist keyword recognition');
  console.log('=====================================');
  console.log(JSON.stringify(response.data, null, 2));
  console.log('\n=====================================');
  
  if (response.data.appointment && response.data.appointment.department.toLowerCase() === 'cardiology') {
    console.log('✅ SUCCESS: Cardiologist correctly mapped to Cardiology!');
    console.log(`Department: ${response.data.appointment.department}`);
    console.log(`Date: ${response.data.appointment.date}`);
    console.log(`Time: ${response.data.appointment.time}`);
  } else {
    console.log('❌ FAILED: Department not correctly extracted');
  }
}).catch(error => {
  console.log('❌ ERROR:', error.message);
});
