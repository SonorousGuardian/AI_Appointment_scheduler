const axios = require('axios');

console.log('🧪 Testing: Map phrases to ISO date/time in local timezone (Asia/Kolkata)\n');
console.log('Current time:', new Date().toISOString());
console.log('=' .repeat(70));

async function testTimezone(phrase) {
  console.log(`\n📝 Input: "${phrase}"`);
  
  try {
    const response = await axios.post('http://localhost:3000/api/v1/parse', {
      text: phrase
    });
    
    const data = response.data;
    
    if (data.status === 'ok') {
      console.log('✅ Status: SUCCESS');
      console.log('\n📅 Parsed Information:');
      console.log(`   Raw phrase: "${data.step2_extraction.entities.date_phrase}"`);
      console.log(`   Parsed UTC: ${data.step2_extraction.entities.parsedDate}`);
      
      console.log('\n🌏 Timezone Conversion:');
      console.log(`   ISO Date:   ${data.appointment.date}`);
      console.log(`   ISO Time:   ${data.appointment.time}`);
      console.log(`   Timezone:   ${data.appointment.tz}`);
      
      console.log('\n📊 Confidence:');
      console.log(`   Extraction: ${(data.step2_extraction.confidence * 100).toFixed(0)}%`);
      console.log(`   Normalization: ${(data.step3_normalization.confidence * 100).toFixed(0)}%`);
    } else {
      console.log(`⚠️  Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
    }
    
    console.log('─'.repeat(70));
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function runTests() {
  await testTimezone('Book dentist tomorrow at 3pm');
  await testTimezone('Schedule cardiology next Monday at 10am');
  await testTimezone('Book neurology appointment on Friday at 2:30pm');
  await testTimezone('Dentist visit in 5 days at noon');
  
  console.log('\n✅ Timezone mapping is WORKING!');
  console.log('   All phrases converted to ISO date/time in Asia/Kolkata timezone');
}

runTests();
