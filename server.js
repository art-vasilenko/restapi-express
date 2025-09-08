const express = require('express')
const app = express()
require('dotenv').config

const authRoutes = require('./routes/authRoutes/auth')
const notesRoutes = require('./routes/notesRoutes/notes')

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/notes', notesRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('Сервера на порту 5000'))


