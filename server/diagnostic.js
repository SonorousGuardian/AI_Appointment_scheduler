// Detailed diagnostic test
const axios = require('axios');

console.log('🔍 Diagnostic Test - Checking if server picked up code changes\n');

async function diagnosticTest() {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/parse', {
      text: 'Book appointment with cardiologist tomorrow at 10am'
    });
    
    const data = response.data;
    
    console.log('Raw Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n' + '='.repeat(60));
    
    // Check department extraction
    console.log('\n📋 Diagnostic Results:');
    console.log(`Status: ${data.status}`);
    console.log(`Department extracted: ${data.step2_extraction?.entities?.department || 'NONE'}`);
    console.log(`Department in appointment: ${data.appointment?.department || 'NONE'}`);
    console.log(`Date: ${data.appointment?.date || 'NONE'}`);
    console.log(`Time: ${data.appointment?.time || 'NONE'}`);
    
    console.log('\n🔬 Analysis:');
    if (!data.step2_extraction?.entities?.department) {
      console.log('❌ PROBLEM: "cardiologist" keyword not being recognized');
      console.log('   This means the server is still running OLD code');
      console.log('   Solution: Restart the server manually');
    } else if (data.step2_extraction.entities.department !== 'cardiology') {
      console.log(`⚠️  Department found but not normalized: ${data.step2_extraction.entities.department}`);
    } else {
      console.log('✅ All fixes are working correctly!');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   Server is not running. Please start it with: npm start');
    }
  }
}

diagnosticTest();
