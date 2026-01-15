const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api/v1/parse';

// Test results storage
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

async function testAppointment(testName, text, expectedDepartment) {
  console.log(`\n=== ${testName} ===`);
  console.log(`Input: "${text}"`);
  
  try {
    const response = await axios.post(API_URL, { text });
    const data = response.data;
    
    const result = {
      testName,
      input: text,
      expectedDepartment,
      actualDepartment: data.appointment?.department,
      status: data.status,
      response: data
    };
    
    // Validate expected department if provided
    if (expectedDepartment && data.appointment) {
      const actualDept = data.appointment.department.toLowerCase();
      const expectedDept = expectedDepartment.toLowerCase();
      
      if (actualDept === expectedDept) {
        console.log(`✓ Department Match: ${data.appointment.department}`);
        result.departmentMatch = true;
      } else {
        console.log(`✗ Department Mismatch: Expected '${expectedDepartment}', Got '${data.appointment.department}'`);
        result.departmentMatch = false;
        testResults.failed.push(result);
        return data;
      }
    }
    
    // Check for status
    if (data.status === 'ok') {
      console.log(`✓ Status: OK`);
      console.log(`  Department: ${data.appointment.department}`);
      console.log(`  Date: ${data.appointment.date}`);
      console.log(`  Time: ${data.appointment.time}`);
      testResults.passed.push(result);
    } else if (data.status === 'needs_clarification') {
      console.log(`⚠ Status: Needs Clarification - ${data.message}`);
      testResults.warnings.push(result);
    } else {
      console.log(`✗ Status: ${data.status}`);
      testResults.failed.push(result);
    }
    
    return data;
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    testResults.failed.push({
      testName,
      input: text,
      error: error.message
    });
    return null;
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  AI-Powered Appointment Scheduler - Test Suite        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // ===== TEST CATEGORY 1: Different Departments =====
  console.log('\n━━━━━ CATEGORY 1: Different Departments ━━━━━');
  
  await testAppointment(
    'Test 1.1: Cardiologist Appointment',
    'Book a cardiology appointment next Monday at 10am',
    'cardiology'
  );
  
  await testAppointment(
    'Test 1.1b: Cardiologist Variation',
    'Book an appointment with the cardiologist next Monday at 10am',
    'cardiology'
  );
  
  await testAppointment(
    'Test 1.2: Neurologist Appointment',
    'Schedule neurology consultation on Friday at 2:30pm',
    'neurology'
  );
  
  await testAppointment(
    'Test 1.2b: Neurologist Variation',
    'I need to see a neurologist on Friday at 2:30pm',
    'neurology'
  );
  
  await testAppointment(
    'Test 1.3: Dentist Appointment',
    'I need a dentist appointment tomorrow at 9am',
    'dentist'
  );
  
  await testAppointment(
    'Test 1.4: Dermatology Appointment',
    'Book dermatology checkup for next Wednesday at 3pm',
    'dermatology'
  );
  
  await testAppointment(
    'Test 1.4b: Dermatologist Variation',
    'Book with the dermatologist for next Wednesday at 3pm',
    'dermatology'
  );
  
  await testAppointment(
    'Test 1.5: Orthopedics Appointment',
    'Schedule orthopedics visit on January 20th at 11:30am',
    'orthopedics'
  );
  
  await testAppointment(
    'Test 1.5b: Orthopedist Variation',
    'Schedule with orthopedist on January 20th at 11:30am',
    'orthopedics'
  );
  
  await testAppointment(
    'Test 1.6: General Appointment',
    'General checkup needed next week Tuesday at 4pm',
    'general'
  );
  
  // ===== TEST CATEGORY 2: Multiple Departments =====
  console.log('\n━━━━━ CATEGORY 2: Multiple Departments Mentioned ━━━━━');
  
  await testAppointment(
    'Test 2.1: Two Departments (should pick first)',
    'I need cardiology and neurology appointments, book cardiology for tomorrow at 10am',
    'cardiology'
  );
  
  await testAppointment(
    'Test 2.2: Multiple Mentions',
    'After my dentist appointment, I also have dermatology, but schedule the dentist first for Friday at 2pm',
    'dentist'
  );
  
  // ===== TEST CATEGORY 3: Edge Cases =====
  console.log('\n━━━━━ CATEGORY 3: Edge Cases ━━━━━');
  
  await testAppointment(
    'Test 3.1: Missing Department',
    'Book appointment for next Friday at 3pm',
    null
  );
  
  await testAppointment(
    'Test 3.2: Missing Date/Time',
    'I need a cardiology appointment',
    'cardiology'
  );
  
  await testAppointment(
    'Test 3.3: Ambiguous Time',
    'Book neurology appointment tomorrow morning',
    'neurology'
  );
  
  await testAppointment(
    'Test 3.4: Midnight Time',
    'Schedule cardiology for tomorrow at midnight',
    'cardiology'
  );
  
  await testAppointment(
    'Test 3.5: Noon Time',
    'Book dentist appointment next Monday at noon',
    'dentist'
  );
  
  await testAppointment(
    'Test 3.6: 24-hour Format',
    'Schedule neurology for January 18th at 14:30',
    'neurology'
  );
  
  await testAppointment(
    'Test 3.7: Past Date',
    'Book cardiology appointment yesterday at 2pm',
    'cardiology'
  );
  
  await testAppointment(
    'Test 3.8: Far Future Date',
    'Schedule neurology for December 25th 2026 at 10am',
    'neurology'
  );
  
  await testAppointment(
    'Test 3.9: Different Date Format (DD/MM/YYYY)',
    'Book dentist on 25/01/2026 at 3pm',
    'dentist'
  );
  
  await testAppointment(
    'Test 3.10: Relative Date (in X days)',
    'Schedule cardiology in 5 days at 11am',
    'cardiology'
  );
  
  await testAppointment(
    'Test 3.11: Empty Input',
    '',
    null
  );
  
  await testAppointment(
    'Test 3.12: Only Department Name',
    'cardiology',
    'cardiology'
  );
  
  await testAppointment(
    'Test 3.13: Complex Natural Language',
    'Can you please help me book an appointment with the cardiologist sometime next week, preferably Thursday afternoon around 3 or 4 pm?',
    'cardiology'
  );
  
  await testAppointment(
    'Test 3.14: Typos in Department',
    'Book cardiologi appointment for tomorrow at 2pm',
    null
  );
  
  await testAppointment(
    'Test 3.15: Case Sensitivity',
    'BOOK NEUROLOGY APPOINTMENT NEXT FRIDAY AT 10AM',
    'neurology'
  );
  
  // Print Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✓ Passed: ${testResults.passed.length}`);
  console.log(`⚠ Warnings (needs_clarification): ${testResults.warnings.length}`);
  console.log(`✗ Failed: ${testResults.failed.length}`);
  console.log(`Total: ${testResults.passed.length + testResults.warnings.length + testResults.failed.length}`);
  
  // Save detailed results to file
  fs.writeFileSync(
    'test-results.json',
    JSON.stringify(testResults, null, 2)
  );
  console.log('\n📝 Detailed results saved to test-results.json');
  
  // Print failures if any
  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.failed.forEach(test => {
      console.log(`  - ${test.testName}: ${test.error || 'See test-results.json for details'}`);
    });
  }
  
  // Print warnings if any
  if (testResults.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (Expected behavior for some edge cases):');
    testResults.warnings.forEach(test => {
      console.log(`  - ${test.testName}`);
    });
  }
}

// Run all tests
runTests().catch(console.error);
