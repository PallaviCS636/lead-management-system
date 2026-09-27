// Seeds a demo user + sample leads so the evaluator can log in and see a populated dashboard immediately.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Lead = require('./src/models/Lead');

const SERVICES = ['Web Development', 'SEO', 'Social Media Marketing', 'Branding', 'Mobile App Development', 'PPC Advertising'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const COMPANIES = ['Acme Corp', 'Bluewave Media', 'Nimbus Retail', 'Skyline Realty', 'Vertex Foods', 'Northstar Logistics', 'Coral Tech', 'Amber Studios'];
const FIRST_NAMES = ['Aarav', 'Isha', 'Rohan', 'Meera', 'Kabir', 'Ananya', 'Vikram', 'Sanya', 'Dev', 'Priya', 'Arjun', 'Neha'];
const LAST_NAMES = ['Sharma', 'Patel', 'Verma', 'Nair', 'Iyer', 'Gupta', 'Reddy', 'Khan', 'Joshi', 'Chopra'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPastDate = (maxDaysBack) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysBack));
  return d;
};
const randomFutureDate = (maxDaysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * maxDaysAhead));
  return d;
};

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Lead.deleteMany({});

  const demoUser = await User.create({
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'Demo@1234',
    role: 'admin',
  });

  const leads = [];
  for (let i = 0; i < 45; i++) {
    const first = randomFrom(FIRST_NAMES);
    const last = randomFrom(LAST_NAMES);
    const createdDate = randomPastDate(30);
    leads.push({
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      phone: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
      company: randomFrom(COMPANIES),
      serviceInterested: randomFrom(SERVICES),
      status: randomFrom(STATUSES),
      followUpDate: Math.random() > 0.3 ? randomFutureDate(10) : null,
      notes: 'Auto-generated demo lead for evaluation purposes.',
      owner: demoUser._id,
      createdDate,
    });
  }

  await Lead.insertMany(leads);

  console.log('Seed complete.');
  console.log('Demo login -> email: admin@demo.com | password: Demo@1234');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
