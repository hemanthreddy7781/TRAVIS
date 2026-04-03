// --- controllers/authController.js ---

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// The frontend combines register/login, so this function handles both.
exports.registerAndLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // --- LOGIN LOGIC ---
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    } else {
      // --- REGISTER LOGIC ---
      const name = email.split('@')[0];
      // Simple logic to assign role based on email domain
      const role = email.endsWith('@agent.vibank.com') ? 'agent' : 'customer';

      user = new User({
        name,
        email,
        password,
        role,
      });

      await user.save();
    }

    // 2. If login or registration is successful, create and return JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.role, // 'type' to match frontend expectation
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};