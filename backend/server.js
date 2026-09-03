const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log('ADMIN_PASSWORD is set:', !!process.env.ADMIN_PASSWORD);
console.log('ADMIN_PASSWORD length:', (process.env.ADMIN_PASSWORD || '').length);
const bcrypt = require('bcryptjs');
const db = require('./db');
const path = require('path');
const sendEmail = require('./utils/brevoMailer');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api', '');
  }
  next();
});

// ====================== REGISTER ======================
app.post('/register', async (req, res) => {
  const { fullName, email, phone, password, address } = req.body;

  if (!fullName || !email || !password || !address) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (full_name, email, phone, password, address) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [fullName, email, phone || null, hashedPassword, address]
    );

    res.status(201).json({
      message: 'Account created successfully',
      userId: result.rows[0].id,
      fullName,
      email,
      address
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ====================== LOGIN ======================
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});
// ====================== ADMIN LOGIN ======================
app.post('/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@wastewise.com' && password === process.env.ADMIN_PASSWORD) {
    return res.json({ message: 'Admin login successful' });
  }

  res.status(401).json({ message: 'Invalid admin credentials' });
});

// ====================== CREATE PAYMENT ======================
app.post('/payments', async (req, res) => {
  const { userId, amount, method } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: 'userId and amount are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO payments (user_id, amount, status, method, paid_at)
       VALUES ($1, $2, 'Paid', $3, NOW()) RETURNING id`,
      [userId, amount, method || 'Card']
    );

    res.status(201).json({
      message: 'Payment recorded successfully',
      paymentId: result.rows[0].id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to record payment' });
  }
});

// ====================== CREATE PICKUP ======================
app.post('/pickups', async (req, res) => {
  const { userId, wasteType, pickupDate, timeWindow } = req.body;

  if (!userId || !pickupDate || !timeWindow) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const requestId = 'WW-' + Math.floor(1000 + Math.random() * 9000);

  try {
    const result = await db.query(
      `INSERT INTO pickups (user_id, waste_type, pickup_date, time_window, status, request_id)
       VALUES ($1, $2, $3, $4, 'Scheduled', $5) RETURNING id`,
      [userId, wasteType || 'General', pickupDate, timeWindow, requestId]
    );

    res.status(201).json({
      message: 'Pickup scheduled successfully',
      requestId: requestId,
      pickupId: result.rows[0].id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to schedule pickup' });
  }
});

// ====================== GET ALL USERS (Admin) ======================
app.get('/admin/users', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, full_name, email, phone, address, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

// ====================== GET ALL PICKUPS (Admin) ======================
app.get('/admin/pickups', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.full_name, u.email, u.address 
      FROM pickups p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

// ====================== SEND MESSAGE TO A USER + EMAIL ======================
app.post('/admin/messages', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: 'userId and message are required' });
  }

  try {
    const userResult = await db.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(500).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    await db.query('INSERT INTO messages (user_id, message) VALUES ($1, $2)', [userId, message]);

    try {
  await sendEmail({
    to: user.email,
    subject: 'New Message from WasteWise Admin',
    htmlContent: `<p>Hello ${user.full_name},</p>
                  <p>You have a new message from WasteWise Admin:</p>
                  <p><em>"${message}"</em></p>
                  <p>Please login to your WasteWise account to view it.</p>
                  <p>Thank you,<br/>WasteWise Team</p>`
  });

  res.status(201).json({ message: 'Message saved and email sent successfully' });
} catch (emailError) {
  console.log('Email error:', emailError);
  res.status(201).json({ message: 'Message saved, but email failed to send' });
}
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

// ====================== GET MESSAGES FOR A USER ======================
app.get('/messages/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.query(
      'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});
// ====================== SERVE REACT FRONTEND ======================
app.use(express.static(path.join(__dirname, '../build')));

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});