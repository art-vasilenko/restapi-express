const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const notesFile = path.join(__dirname, '../data/notes.json');

const NotesController = {
  getNotes: async (req, res) => {
    try {
      const notesData = await fs.readFile(notesFile, 'utf8');
      const notes = JSON.parse(notesData);
      const userNotes = notes.filter((note) => note.userId === req.user.userId);
      res.json({ success: true, data: userNotes });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server error',
      });
      return;
    }
  },

  createNote: async (req, res) => {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({
        success: false,
        error: 'Title and text are required',
      });
    }

    if (title.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Title must be at least 10 characters',
      });
    }

    if (text.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Text must be at least 20 characters',
      });
    }

    try {
      const notesData = await fs.readFile(notesFile, 'utf8');
      const notes = JSON.parse(notesData);

      const newNote = {
        id: crypto.randomUUID(),
        title,
        text,
        userId: req.user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      notes.push(newNote);
      await fs.writeFile(notesFile, JSON.stringify(notes));

      res.status(201).json({ success: true, data: newNote });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server error',
      });
      return;
    }
  },

  updateNote: async (req, res) => {
    const { id } = req.params;
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({
        success: false,
        error: 'Title and text are required',
      });
    }

    if (title.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Title must be at least 10 characters',
      });
    }

    if (text.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Text must be at least 20 characters',
      });
    }

    try {
      const notesData = await fs.readFile(notesFile, 'utf8');
      const notes = JSON.parse(notesData);

      const noteIndex = notes.findIndex(
        (note) => note.id === id && note.userId === req.user.userId,
      );

      if (noteIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Note not found',
        });
      }

      notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        text,
        updatedAt: new Date().toISOString(),
      };

      await fs.writeFile(notesFile, JSON.stringify(notes));
      res.json({ success: true, data: notes[noteIndex] });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server error',
      });
      return;
    }
  },

  deleteNote: async (req, res) => {
    const { id } = req.params;

    try {
      const notesData = await fs.readFile(notesFile, 'utf8');
      const notes = JSON.parse(notesData);

      const noteIndex = notes.findIndex(
        (note) => note.id === id && note.userId === req.user.userId,
      );

      if (noteIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Note not found',
        });
      }

      notes.splice(noteIndex, 1);
      await fs.writeFile(notesFile, JSON.stringify(notes));

      res.json({
        success: true,
        data: { message: 'Note deleted' },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server error',
      });
      return;
    }
  },
};

module.exports = NotesController;
