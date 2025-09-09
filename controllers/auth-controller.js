const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userFile = path.join(__dirname, '../data/users.json');

const AuthController = {
  register: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const usersData = await fs.readFile(userFile, 'utf8');
      const users = JSON.parse(usersData);

      const existUser = users.find((user) => user.email === email);

      if (existUser) {
        return res
          .status(400)
          .json({ success: false, error: 'User already exists' });
      }

      const user = {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        token: null,
      };

      users.push(user);
      await fs.writeFile(userFile, JSON.stringify(users));

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error' });
      return;
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email and password are required' });
    }

    try {
      const usersData = await fs.readFile(userFile, 'utf8');
      const users = JSON.parse(usersData);
      const user = users.find((user) => user.email === email);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res
          .status(401)
          .json({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

      user.token = token;

      await fs.writeFile(userFile, JSON.stringify(users));

      res.json({
        success: true,
        data: { token },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error' });
      return;
    }
  },
};

module.exports = AuthController;
