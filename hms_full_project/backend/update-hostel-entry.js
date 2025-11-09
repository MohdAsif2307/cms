require('dotenv').config();
const mongoose = require('mongoose');
const HostelStudent = require('./models/HostelStudent');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms';

async function main(){
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  await HostelStudent.updateOne({ studentId: '690fcda48a3c3b9dcb1d3b7a' }, { $set: { hostelName: 'Central Hostel', roomNumber: 'B-101', warden: 'Warden Name', status: 'active' } }, { upsert: true });
  console.log('Hostel entry updated');
  await mongoose.disconnect();
}

main().catch(err=>{ console.error(err); process.exit(1); });
