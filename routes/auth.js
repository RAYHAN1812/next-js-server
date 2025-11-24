const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Register User
router.post('/register', async (req, res) => {
  const db = req.db;
  const { email, password, name } = req.body;

  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    res.status(201).json({
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login User
router.post('/login', async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
