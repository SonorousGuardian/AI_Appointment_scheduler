const axios = require('axios');

async function testBoth() {
  console.log('Testing both cases:\n');
  
  // Test 1: Dentist (should work)
  console.log('1️⃣ Testing: "book a dentist on friday at 3pm"');
  try {
    const res1 = await axios.post('http://localhost:3000/api/v1/parse', {
      text: 'book a dentist on friday at 3pm'
    });
    console.log(`   Status: ${res1.data.status}`);
    if (res1.data.appointment) {
      console.log(`   ✅ Department: ${res1.data.appointment.department}`);
    } else {
      console.log(`   ❌ No department extracted`);
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  console.log('\n');
  
  // Test 2: Cardiologist (currently fails due to old server)
  console.log('2️⃣ Testing: "book a cardiologist on friday at 3pm"');
  try {
    const res2 = await axios.post('http://localhost:3000/api/v1/parse', {
      text: 'book a cardiologist on friday at 3pm'
    });
    console.log(`   Status: ${res2.data.status}`);
    if (res2.data.appointment) {
      console.log(`   ✅ Department: ${res2.data.appointment.department}`);
    } else {
      console.log(`   ❌ No department extracted - Server running OLD code`);
      console.log(`   Message: ${res2.data.message}`);
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔄 SOLUTION: Restart the server to load the fixed code');
  console.log('   1. Press Ctrl+C in the server terminal');
  console.log('   2. Run: npm start');
  console.log('='.repeat(60));
}

testBoth();
