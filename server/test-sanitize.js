const { sanitizeText } = require('./dist/utils/validation');

const inputs = [
  'Book a cardiologist at 3pm on friday at 3/2/13',
  'cardiologist',
  'Book cardiologist appointment'
];

inputs.forEach(input => {
  const sanitized = sanitizeText(input);
  console.log(`Input: "${input}"`);
  console.log(`Sanitized: "${sanitized}"`);
  console.log(`Same: ${input === sanitized}`);
  console.log('---');
});
