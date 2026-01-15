const axios = require('axios');

async function testSpecificCase() {
  const testInput = 'Book a cardiologist at 3pm on friday at 3/2/13';
  
  console.log('Testing specific case:', testInput);
  console.log('='.repeat(60));
  
  try {
    const response = await axios.post('http://localhost:3000/api/v1/parse', {
      text: testInput
    });
    
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.status === 'ok') {
      console.log('\n✅ SUCCESS');
      console.log(`Department: ${response.data.appointment.department}`);
      console.log(`Date: ${response.data.appointment.date}`);
      console.log(`Time: ${response.data.appointment.time}`);
    } else {
      console.log('\n⚠️ Status:', response.data.status);
      console.log('Message:', response.data.message);
    }
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    if (error.response) {
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSpecificCase();
