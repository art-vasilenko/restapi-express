const fs = require('fs').promises
const path = require('path')
const userFile = path.join(__dirname, '../data/users.json')

const AuthController = {
    register: async (req, res) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Введите почту или пароль' })
        }

        try {
            const userData = await fs.readFile(userFile, 'utf8')
            const users = JSON.parse(userData)

            const existUser = users.find(user => user.email === email)

            if (existUser) {
                return res.status(400).json({ error: 'Пользователь существует' })
            }

            const user = {
                id: 2,
                email,
                password,
                token: 'token_2',
            }

            users.push(user)

            await fs.writeFile(userFile, JSON.stringify(users))

            res.status(200).json({
                message: 'Пользователь создан',
                token: user.token
            })

        } catch (error) {
            res.status(500).json({ error: 'Сервер не отвечает' })
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Неправильная почта или пароль' })
        }

        try {
            const userData = await fs.readFile(userFile, 'utf8')
            const users = JSON.parse(userData)

            const user = users.find(user => user.email === email && user.password === password)

            if (!user) {
                return res.status(400).json({ error: 'Пользователь не найден' })
            }

            res.json({
                message: 'Успешно вошли',
                token: user.token
            })
        } catch (error) {
            res.status(500).json({ error: 'Сервер не отвечает' })
        }
    }

}

module.exports = AuthController