// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear tarea
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Título vacío' });

  db.query('INSERT INTO tasks (title) VALUES (?)', [title.trim()], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const id = result.insertId;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(rows[0]);
    });
  });
});

// Actualizar tarea (title y/o done)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  // Obtener primero la tarea para valores por defecto
  db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'Tarea no encontrada' });
    const current = rows[0];
    const newTitle = typeof title === 'string' ? title.trim() : current.title;
    const newDone = typeof done === 'number' ? (done ? 1 : 0) : current.done;

    db.query(
      'UPDATE tasks SET title = ?, done = ? WHERE id = ?',
      [newTitle, newDone, id],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        db.query('SELECT * FROM tasks WHERE id = ?', [id], (err3, updated) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json(updated[0]);
        });
      }
    );
  });
});

// Eliminar tarea
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
