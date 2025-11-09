const connectToMongo = require('./Database/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const Branch = require('./models/branch.model');
const Subject = require('./models/subject.model');
const AdminDetail = require('./models/details/admin-details.model');
const FacultyDetail = require('./models/details/faculty-details.model');
const StudentDetail = require('./models/details/student-details.model');
const Exam = require('./models/exam.model');
const Material = require('./models/material.model');
const Notice = require('./models/notice.model');
const Timetable = require('./models/timetable.model');
const Marks = require('./models/marks.model');

async function ensure(model, query, data) {
  // Use upsert to avoid race conditions and duplicate key errors.
  const updated = await model.findOneAndUpdate(query, { $set: data }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec();
  return updated;
}

async function hashPasswordIfNeeded(data) {
  if (!data || !data.password) return data;
  // If already hashed (starts with $2), skip
  if (typeof data.password === 'string' && data.password.startsWith('$2')) return data;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(data.password, salt);
  return { ...data, password: hashed };
}

async function seed() {
  try {
    await connectToMongo();

    console.log('Seeding branches...');
    const branchesData = [
      { branchId: 'DEFAULT', name: 'Default Branch' },
      { branchId: 'CSE', name: 'Computer Science' },
      { branchId: 'ECE', name: 'Electronics' },
    ];
    const branches = [];
    for (const b of branchesData) {
      // Upsert by branchId or name to avoid duplicate-key on name/index
      const branch = await Branch.findOneAndUpdate(
        { $or: [{ branchId: b.branchId }, { name: b.name }] },
        { $set: b },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).exec();
      branches.push(branch);
    }

    console.log('Seeding admin...');
    const adminData = await hashPasswordIfNeeded({
      employeeId: 123456,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      phone: '9999999999',
      address: 'Admin Address',
      city: 'City',
      state: 'State',
      pincode: '000000',
      country: 'Country',
      gender: 'male',
      dob: new Date('1990-01-01'),
      designation: 'Principal',
      joiningDate: new Date(),
      salary: 100000,
      isSuperAdmin: true,
      emergencyContact: { name: 'Emergency', relationship: 'Brother', phone: '9999999998' },
      bloodGroup: 'O+',
      password: 'admin123',
    });

    const admin = await ensure(AdminDetail, { email: 'admin@gmail.com' }, adminData);

    console.log('Seeding faculty...');
    const facultyData = await hashPasswordIfNeeded({
      employeeId: 2001,
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'faculty1@college.edu',
      phone: '8888888888',
      address: 'Faculty Address',
      city: 'City',
      state: 'State',
      pincode: '111111',
      country: 'Country',
      gender: 'female',
      dob: new Date('1985-05-15'),
      designation: 'Professor',
      joiningDate: new Date(),
      salary: 70000,
      branchId: branches[0]._id,
      password: 'faculty123',
    });

    const faculty1 = await ensure(FacultyDetail, { email: 'faculty1@college.edu' }, facultyData);

    console.log('Seeding students...');
    const studentData = await hashPasswordIfNeeded({
      enrollmentNo: 100001,
      firstName: 'Bob',
      middleName: 'M',
      lastName: 'Student',
      email: 'student1@college.edu',
      phone: '7777777777',
      semester: 1,
      branchId: branches[0]._id,
      gender: 'male',
      dob: new Date('2003-07-01'),
      address: 'Student Address',
      city: 'City',
      state: 'State',
      pincode: '222222',
      country: 'Country',
      status: 'active',
      bloodGroup: 'A+',
      emergencyContact: { name: 'Parent', relationship: 'Father', phone: '7777777776' },
      password: 'student123',
    });

    const student1 = await ensure(StudentDetail, { email: 'student1@college.edu' }, studentData);

    console.log('Seeding subjects...');
    const subj1 = await ensure(
      Subject,
      { code: 'CS101' },
      { name: 'Introduction to CS', code: 'CS101', branch: branches[0]._id, semester: 1, credits: 3 },
    );

    console.log('Seeding exam...');
    const exam1 = await ensure(
      Exam,
      { name: 'Mid Term 1', semester: 1 },
      { name: 'Mid Term 1', date: new Date(), semester: 1, examType: 'mid', timetableLink: '', totalMarks: 100 },
    );

    console.log('Seeding material...');
    await ensure(
      Material,
      { title: 'Intro Notes' },
      {
        title: 'Intro Notes',
        subject: subj1._id,
        faculty: faculty1._id,
        file: 'notes/intro.pdf',
        semester: 1,
        branch: branches[0]._id,
        type: 'notes',
      },
    );

    console.log('Seeding notice...');
    await ensure(
      Notice,
      { title: 'Welcome Notice' },
      { title: 'Welcome Notice', description: 'Welcome to the college', type: 'both', link: '' },
    );

    console.log('Seeding timetable...');
    await ensure(
      Timetable,
      { link: 'timetable/default.pdf' },
      { link: 'timetable/default.pdf', branch: branches[0]._id, semester: 1 },
    );

    console.log('Seeding marks...');
    await ensure(
      Marks,
      { studentId: student1._id, subjectId: subj1._id, examId: exam1._id },
      { studentId: student1._id, subjectId: subj1._id, marksObtained: 85, semester: 1, examId: exam1._id },
    );

    console.log('Seeding completed.');
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}

seed();
