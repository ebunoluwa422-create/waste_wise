const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ====================== TEST ROUTE ======================
app.get('/', (req, res) => {
  res.send('WasteWise Backend is running');
});

// ====================== REGISTER ======================
app.post('/register', async (req, res) => {
  const { fullName, email, phone, password, address } = req.body;

  if (!fullName || !email || !password || !address) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.query(
        'INSERT INTO users (full_name, email, phone, password, address) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, phone || null, hashedPassword, address],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to register user' });
          }

          res.status(201).json({
            message: 'Account created successfully',
            userId: result.insertId,
            fullName,
            email,
            address
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ====================== LOGIN ======================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Login successful
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
  });
});
// ====================== CREATE PAYMENT ======================
app.post('/payments', (req, res) => {
  const { userId, amount, method } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: 'userId and amount are required' });
  }

  const sql = `
    INSERT INTO payments (user_id, amount, status, method, paid_at)
    VALUES (?, ?, 'Paid', ?, NOW())
  `;

  db.query(sql, [userId, amount, method || 'Card'], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to record payment' });
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      paymentId: result.insertId
    });
  });
});
// ====================== CREATE PICKUP ======================
app.post('/pickups', (req, res) => {
  const { userId, wasteType, pickupDate, timeWindow } = req.body;

  if (!userId || !pickupDate || !timeWindow) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Generate a simple request ID
  const requestId = 'WW-' + Math.floor(1000 + Math.random() * 9000);

  const sql = `
    INSERT INTO pickups (user_id, waste_type, pickup_date, time_window, status, request_id)
    VALUES (?, ?, ?, ?, 'Scheduled', ?)
  `;

  db.query(sql, [userId, wasteType || 'General', pickupDate, timeWindow, requestId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to schedule pickup' });
    }

    res.status(201).json({
      message: 'Pickup scheduled successfully',
      requestId: requestId,
      pickupId: result.insertId
    });
  });
});
// ====================== GET ALL USERS (Admin) ======================
app.get('/admin/users', (req, res) => {
  db.query('SELECT id, full_name, email, phone, address, created_at FROM users ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// ====================== GET ALL PICKUPS (Admin) ======================
app.get('/admin/pickups', (req, res) => {
  const sql = `
    SELECT p.*, u.full_name, u.email, u.address 
    FROM pickups p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});
// ====================== SEND MESSAGE TO A USER ======================
// ====================== SEND MESSAGE TO A USER + EMAIL ======================
app.post('/admin/messages', (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: 'userId and message are required' });
  }

  // First get the user's email
  db.query('SELECT full_name, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: 'User not found' });
    }

    const user = results[0];

    // Save the message in the database
    db.query(
      'INSERT INTO messages (user_id, message) VALUES (?, ?)',
      [userId, message],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Failed to save message' });
        }

        // Now send the email
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ayandiranebunoluwa@gmail.com',       // ← replace this
              pass: 'befl qlsa tkoa qgkg'     // ← replace this
            }
          });

          await transporter.sendMail({
            from: '"WasteWise Admin" <ayandiranebunoluwa@gmail.com>',
            to: user.email,
            subject: 'New Message from WasteWise Admin',
            text: `Hello ${user.full_name},\n\nYou have a new message from WasteWise Admin:\n\n"${message}"\n\nPlease login to your WasteWise account to view it.\n\nThank you,\nWasteWise Team`
          });

          res.status(201).json({ message: 'Message saved and email sent successfully' });
        } catch (emailError) {
          console.log('Email error:', emailError);
          // Even if email fails, the message is already saved
          res.status(201).json({ message: 'Message saved, but email failed to send' });
        }
      }
    );
  });
});

// ====================== GET MESSAGES FOR A USER ======================
app.get('/messages/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query(
    'SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
});

// ====================== START SERVER ======================
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});