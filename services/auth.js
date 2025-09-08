const fs = require('fs').promises;
const path = require('path');

const userFile = path.join(__dirname, '../data/users.json');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Access token required' });
  }

  try {
    const usersData = await fs.readFile(userFile, 'utf8');
    const users = JSON.parse(usersData);
    const user = users.find((u) => u.token === token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
    return;
  }
};

module.exports = authenticateToken;
