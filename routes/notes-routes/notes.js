const express = require('express');

const NotesController = require('../../controllers/notes-controller');
const authenticateToken = require('../../services/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', NotesController.getNotes);
router.post('/', NotesController.createNote);
router.put('/:id', NotesController.updateNote);
router.delete('/:id', NotesController.deleteNote);

module.exports = router;
