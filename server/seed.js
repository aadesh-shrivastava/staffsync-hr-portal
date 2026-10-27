require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Announcement.deleteMany({})]);
  const hr = await User.create({ name: 'Hannah HR', email: 'hr@staffsync.com', password: 'hr1234', role: 'hr', department: 'Human Resources', position: 'HR Lead' });
  const mgr = await User.create({ name: 'Mike Manager', email: 'manager@staffsync.com', password: 'mgr1234', role: 'manager', department: 'Engineering', position: 'Engineering Manager' });
  await User.create({ name: 'Eva Employee', email: 'employee@staffsync.com', password: 'emp1234', role: 'employee', department: 'Engineering', position: 'Developer', manager: mgr._id });
  await Announcement.create({ title: 'Welcome to StaffSync', message: 'Mark attendance daily and apply leaves from the Leaves page.', postedBy: hr._id });
  console.log('Seeded. Logins: hr@staffsync.com/hr1234, manager@staffsync.com/mgr1234, employee@staffsync.com/emp1234');
  process.exit();
})();
