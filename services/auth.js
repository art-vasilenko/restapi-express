const fs = require('fs').promises
const path = require('path')
const userFile = path.join(__dirname, '../data/users.json')

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization
  
  if (!token) {
    return res.status(400).json({ error: 'Токена не найден' })
  }

  try {
    const usersData = await fs.readFile(userFile, 'utf8')
    const users = JSON.parse(usersData)
    const user = users.find(u => u.token === token)
    
    if (!user) {
      return res.status(400).json({ error: 'Неверный токен' })
    }
    
    req.user = user
    next()
  } catch (error) {
    res.status(500).json({ error: 'Сервер не отвечает' })
  }
};

module.exports = authenticateToken