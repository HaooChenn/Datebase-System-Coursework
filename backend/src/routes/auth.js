const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request:', req.body);
    const { username, password } = req.body;
    
    // Query user
    const [users] = await db.execute(
      'SELECT * FROM user_auth WHERE username = ?',
      [username]
    );
    console.log('Found user:', users);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];
    
    // Verify password using SHA2
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    console.log('Password verification:', {
      input: hashedPassword,
      stored: user.password_hash
    });
    
    if (hashedPassword !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 