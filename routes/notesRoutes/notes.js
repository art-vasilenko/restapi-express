const express = require('express')

const router = express.Router()
const NotesController = require('../../controllers/notes-controller')
const authenticateToken = require('../../services/auth')

router.use(authenticateToken)

router.get('/notes', NotesController.getNotes)
router.post('/notes', NotesController.createNote)
router.put('/notes/:id', NotesController.updateNote)
router.delete('/notes/:id', NotesController.deleteNote)

module.exports = router