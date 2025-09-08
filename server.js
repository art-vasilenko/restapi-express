const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth-routes/auth');
const notesRoutes = require('./routes/notes-routes/notes');
const { notFound, errorHandler } = require('./services/error-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', notesRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
