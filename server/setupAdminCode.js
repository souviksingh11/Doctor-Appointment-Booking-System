const fs = require('fs');
const path = require('path');

// Default admin code
const ADMIN_CODE = 'ADMIN2024';

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if ADMIN_CODE already exists in .env
if (!envContent.includes('ADMIN_CODE=')) {
  // Add ADMIN_CODE to .env
  const newEnvContent = envContent + `\nADMIN_CODE=${ADMIN_CODE}\n`;
  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ Admin code added to .env file');
  console.log(`🔑 Admin Code: ${ADMIN_CODE}`);
} else {
  console.log('ℹ️  ADMIN_CODE already exists in .env file');
}

console.log('\n📝 Instructions:');
console.log('1. The admin code is set to: ADMIN2024');
console.log('2. Only users who know this code can register/login as admin');
console.log('3. You can change this code in the .env file');
console.log('4. Share this code only with trusted administrators');
console.log('\n🔐 Security Notes:');
console.log('- Change the default code for production');
console.log('- Use a strong, unique code');
console.log('- Keep the code secure and private'); 