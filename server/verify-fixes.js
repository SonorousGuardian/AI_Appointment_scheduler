const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1/parse';

console.log('🎯 Final Verification Tests\n');
console.log('Testing the three critical bug fixes:\n');

async function test(name, input, checks) {
  console.log(`\n=== ${name} ===`);
  console.log(`Input: "${input}"`);
  
  try {
    const response = await axios.post(API_URL, { text: input });
    const data = response.data;
    
    let allPassed = true;
    
    for (const check of checks) {
      const actual = check.getValue(data);
      if (actual === check.expected) {
        console.log(`  ✅ ${check.name}: ${actual}`);
      } else {
        console.log(`  ❌ ${check.name}: Expected "${check.expected}", got "${actual}"`);
        allPassed = false;
      }
    }
    
    return allPassed;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function runVerification() {
  let passCount = 0;
  let failCount = 0;
  
  // Bug Fix #1: Cardiologist keyword recognition
  if (await test(
    'Bug Fix #1: Cardiologist Keyword',
    'Book an appointment with the cardiologist tomorrow at 10am',
    [
      { name: 'Department', getValue: (d) => d.appointment?.department, expected: 'Cardiology' },
      { name: 'Status', getValue: (d) => d.status, expected: 'ok' }
    ]
  )) passCount++; else failCount++;
  
  // Bug Fix #1b: Neurologist keyword  
  if (await test(
    'Bug Fix #1b: Neurologist Keyword',
    'I need to see a neurologist on Friday at 2pm',
    [
      { name: 'Department', getValue: (d) => d.appointment?.department, expected: 'Neurology' },
      { name: 'Status', getValue: (d) => d.status, expected: 'ok' }
    ]
  )) passCount++; else failCount++;
  
  // Bug Fix #2: Time extraction for dates with numbers
  if (await test(
    'Bug Fix #2: Time Extraction (January 20th at 11:30am)',
    'Schedule orthopedics visit on January 20th at 11:30am',
    [
      { name: 'Time', getValue: (d) => d.appointment?.time, expected: '11:30' },
      { name: 'Time Phrase', getValue: (d) => d.step2_extraction?.entities?.time_phrase, expected: '11:30am' }
    ]
  )) passCount++; else failCount++;
  
  // Bug Fix #2b: Another time extraction test
  if (await test(
    'Bug Fix #2b: Time Extraction (25/01/2026 at 3pm)',
    'Book dentist on 25/01/2026 at 3pm',
    [
      { name: 'Time', getValue: (d) => d.appointment?.time, expected: '15:00' },
      { name: 'Time Phrase', getValue: (d) => d.step2_extraction?.entities?.time_phrase, expected: '3pm' }
    ]
  )) passCount++; else failCount++;
  
  // Bug Fix #3: Department normalization
  if (await test(
    'Bug Fix #3: Department Normalization (dermatologist → dermatology)',
    'Book with the dermatologist for next Wednesday at 3pm',
    [
      { name: 'Department', getValue: (d) => d.appointment?.department, expected: 'Dermatology' },
      { name: 'Normalized', getValue: (d) => d.step2_extraction?.entities?.department, expected: 'dermatology' }
    ]
  )) passCount++; else failCount++;
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n📊 VERIFICATION SUMMARY`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failCount === 0) {
    console.log(`\n🎉 SUCCESS! All bug fixes are working correctly!`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the results above.`);
  }
}

runVerification().catch(console.error);
