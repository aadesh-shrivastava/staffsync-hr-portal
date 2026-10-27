require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure database connection in serverless or standalone mode
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

const registerRoutes = (router) => {
  router.use('/auth', require('./routes/auth'));
  router.use('/users', require('./routes/users'));
  router.use('/leaves', require('./routes/leaves'));
  router.use('/attendance', require('./routes/attendance'));
  router.use('/announcements', require('./routes/announcements'));
  router.use('/trainings', require('./routes/trainings'));
  router.get('/health', (_req, res) => res.json({ ok: true }));
};

const apiRouter = express.Router();
registerRoutes(apiRouter);

// Support both /api/... and direct mounts
app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`API on :${PORT}`)))
    .catch((err) => console.error('Initial DB connection error:', err.message));
}

module.exports = app;
