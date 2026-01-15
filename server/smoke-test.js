const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1/parse';

// Quick smoke tests to verify fixes
const smokeTests = [
  {
    name: 'Cardiologist keyword recognition',
    text: 'Book an appointment with the cardiologist tomorrow at 10am',
    expectedDept: 'cardiology'
  },
  {
    name: 'Neurologist keyword recognition',
    text: 'I need to see a neurologist on Friday at 2pm',
    expectedDept: 'neurology'
  },
  {
    name: 'Time extraction for "January 20th at 11:30am"',
    text: 'Schedule orthopedics visit on January 20th at 11:30am',
    expectedTime: '11:30'
  },
  {
    name: 'Time extraction for "3pm"',
    text: 'Book dentist on next Friday at 3pm',
    expectedTime: '15:00'
  }
];

async function runSmokeTests() {
  console.log('🔬 Running Smoke Tests to Verify Fixes\n');
  let passed = 0;
  let failed = 0;
  
  for (const test of smokeTests) {
    try {
      const response = await axios.post(API_URL, { text: test.text });
      const data = response.data;
      
      let testPassed = true;
      
      if (test.expectedDept && data.appointment) {
        const actualDept = data.appointment.department.toLowerCase();
        const expectedDept = test.expectedDept.toLowerCase();
        if (actualDept !== expectedDept) {
          console.log(`❌ ${test.name}: Expected ${test.expectedDept}, got ${data.appointment.department}`);
          testPassed = false;
        }
      }
      
      if (test.expectedTime && data.appointment) {
        if (data.appointment.time !== test.expectedTime) {
          console.log(`❌ ${test.name}: Expected time ${test.expectedTime}, got ${data.appointment.time}`);
          testPassed = false;
        }
      }
      
      if (testPassed && data.status === 'ok') {
        console.log(`✅ ${test.name}`);
        passed++;
      } else if (testPassed) {
        console.log(`⚠️  ${test.name}: Status is ${data.status}`);
        failed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (passed === smokeTests.length) {
    console.log('✅ All smoke tests passed! The fixes are working.');
  } else {
    console.log('⚠️  Some tests failed. The server may need to be restarted with the new code.');
  }
}

runSmokeTests().catch(console.error);
