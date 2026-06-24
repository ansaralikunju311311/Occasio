require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    const uri = process.env.Mongo_URI;
    console.log('URI is', uri ? 'Present' : 'Missing');
    await mongoose.connect(uri);
    console.log('Connected successfully');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}
run();
