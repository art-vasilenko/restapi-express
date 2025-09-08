const fs = require('fs').promises
const path = require('path')
const notesFile = path.join(__dirname, '../data/notes.json')

const NotesController = {
  getNotes: async (req, res) => {
    try {
      const notesData = await fs.readFile(notesFile, 'utf8')
      const notes = JSON.parse(notesData)
      const userNotes = notes.filter(note => note.userId === req.user.id)
      res.json(userNotes)
    } catch (error) {
      res.status(500).json({ error: 'Сервер не отвечает' })
    }
  },

  createNote: async (req, res) => {
    const { title, text } = req.body

    if (!title || !text) {
      return res.status(400).json({ error: 'Введите заголовок и текст' })
    }

    try {
      const notesData = await fs.readFile(notesFile, 'utf8')
      const notes = JSON.parse(notesData);
      const newNote = {
        id: 3,
        title,
        text,
        userId: req.user.id
      };

      notes.push(newNote)
      await fs.writeFile(notesFile, JSON.stringify(notes))
      res.status(200).json(newNote)
    } catch (error) {
      res.status(500).json({ error: 'Сервер не отвечает' })
    }
  },

  updateNote: async (req, res) => {
    const { id } = req.params
    const { title, text } = req.body

    if (!title || !text) {
      return res.status(400).json({ error: 'Введите заголовок и текст' })
    }

    try {
      const notesData = await fs.readFile(notesFile, 'utf8')
      const notes = JSON.parse(notesData)
      const noteIndex = notes.findIndex(note => note.id === parseInt(id) && note.userId === req.user.id)

      notes[noteIndex] = { ...notes[noteIndex], title, text }
      await fs.writeFile(notesFile, JSON.stringify(notes))
      res.json(notes[noteIndex])

    } catch (error) {
      res.status(500).json({ error: 'Сервер не отвечает' })
    }
  },

  deleteNote: async (req, res) => {
    const { id } = req.params

    try {
      const notesData = await fs.readFile(notesFile, 'utf8')
      let notes = JSON.parse(notesData)
      const noteIndex = notes.findIndex(note => note.id === parseInt(id) && note.userId === req.user.id)

      notes.splice(noteIndex, 1)
      await fs.writeFile(notesFile, JSON.stringify(notes))
      res.json({ message: 'Заметка удалена' })
    } catch (error) {
      res.status(500).json({ error: 'Сервер не отвечает' })
    }
  }
};

module.exports = NotesController