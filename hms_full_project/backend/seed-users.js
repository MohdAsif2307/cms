require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms';

async function upsertUser({ name, email, password, role = 'student' }) {
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`User exists: ${email} -> updating role/name`);
    existing.name = name;
    existing.role = role;
    await existing.save();
    return existing;
  }
  const hash = await bcrypt.hash(password, 10);
  const created = await User.create({ name, email, passwordHash: hash, role });
  console.log(`Created user ${email} with role ${role}`);
  return created;
}

async function main() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Mongo at', MONGO);

    const admin = await upsertUser({ name: 'Seed Admin', email: 'admin@hms.test', password: 'admin123', role: 'admin' });
    const student = await upsertUser({ name: 'Seed Student', email: 'student1@hms.test', password: 'student123', role: 'student' });
    const staff = await upsertUser({ name: 'Seed Staff', email: 'staff1@hms.test', password: 'staff123', role: 'staff' });

    console.log('\nSeeding complete. Credentials:');
    console.log(' Admin -> email: admin@hms.test  password: admin123');
    console.log(' Student -> email: student1@hms.test  password: student123');
    console.log(' Staff -> email: staff1@hms.test  password: staff123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
