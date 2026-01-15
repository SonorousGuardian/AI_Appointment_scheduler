const axios = require('axios');

console.log('🧪 Testing Expanded Medical Specialties\n');

const testCases = [
  // Original
  'Book dentist tomorrow at 10am',
  'See cardiologist Friday at 3pm',
  
  // ENT
  'Book ENT specialist next Monday at 2pm',
  
  // Eye Care
  'Schedule ophthalmologist on January 20th at 11am',
  'Book eye doctor tomorrow at 9am',
  
  // Pediatrics
  'Book pediatrician for my child next week at 3pm',
  
  // Mental Health
  'Schedule psychiatrist appointment Friday at 4pm',
  'Book therapist tomorrow at 2pm',
  
  // Gastro
  'See gastroenterologist next Wednesday at 10am',
  'Book stomach doctor on Monday at 11:30am',
  
  // Oncology
  'Schedule oncologist visit on Friday at 3pm',
  
  // Colloquial terms
  'Book GP tomorrow at 9am',
  'See physio next Monday at 2pm',
  'Schedule bone doctor on Tuesday at 11am'
];

async function testAll() {
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/parse', {
        text: testCase
      });
      
      if (response.data.status === 'ok') {
        console.log(`✅ "${testCase}"`);
        console.log(`   → ${response.data.appointment.department}\n`);
        passed++;
      } else {
        console.log(`⚠️  "${testCase}"`);
        console.log(`   → ${response.data.status}: ${response.data.message}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${testCase}`);
      console.log(`   → ${error.message}\n`);
      failed++;
    }
  }
  
  console.log('='.repeat(70));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  console.log(`\n🎉 ${passed === testCases.length ? 'ALL TESTS PASSED!' : 'Some tests need attention'}`);
}

testAll();
