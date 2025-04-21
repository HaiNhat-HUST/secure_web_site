// Simple script to debug environment variables
require('dotenv').config();
const path = require('path');

console.log('Debug Environment Variables:');
console.log('------------------------------');
console.log('__dirname:', __dirname);
console.log('Current working directory:', process.cwd());
console.log('Expected .env location:', path.resolve(process.cwd(), '.env'));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_CLIENT_ID exists:', Boolean(process.env.GOOGLE_CLIENT_ID));
console.log('GOOGLE_CLIENT_SECRET exists:', Boolean(process.env.GOOGLE_CLIENT_SECRET));
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('SESSION_SECRET exists:', Boolean(process.env.SESSION_SECRET));
console.log('------------------------------');

