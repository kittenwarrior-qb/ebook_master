// Simple script to test Supabase connection
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    console.log('🔄 Connecting to Supabase...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
    console.log(`User: ${process.env.DB_USERNAME}`);
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    await client.end();
    console.log('✅ Connection test completed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Tips:');
    console.error('1. Check DB_HOST in .env file');
    console.error('2. Verify password is correct');
    console.error('3. Ensure Supabase project is active');
    console.error('4. Check if you copied the correct host from Supabase Dashboard');
    process.exit(1);
  }
}

testConnection();
