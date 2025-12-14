// todo-project/backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Crear tabla automáticamente si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done TINYINT(1) DEFAULT 0,
    created_at DATETIME
  )
`, (err) => {
  if (err) {
    console.log('Error verificando tabla tasks:', err.message);
  } else {
    console.log('Tabla "tasks" lista para usar');
  }
});

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error obteniendo tareas:', err.message);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
});

// Crear tarea
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Título vacío' });
  }

  // Fecha actual en formato MySQL
  const createdAt = new Date();
  const formattedDate = createdAt.toISOString().slice(0, 19).replace('T', ' ');

  db.query(
    'INSERT INTO tasks (title, done, created_at) VALUES (?, 0, ?)',
    [title.trim(), formattedDate],
    (err, result) => {
      if (err) {
        console.error('Error creando tarea:', err.message);
        return res.status(500).json({ error: 'Error creando tarea' });
      }
      
      const id = result.insertId;
      db.query('SELECT * FROM tasks WHERE id = ?', [id], (err2, rows) => {
        if (err2) {
          console.error('Error obteniendo tarea creada:', err2.message);
          return res.status(500).json({ error: 'Error obteniendo tarea' });
        }
        res.status(201).json(rows[0]);
      });
    }
  );
});

// Actualizar tarea (title y/o done)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  // Validar ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Obtener primero la tarea para valores por defecto
  db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, rows) => {
    if (err) {
      console.error('Error buscando tarea:', err.message);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const current = rows[0];
    const newTitle = typeof title === 'string' ? title.trim() : current.title;
    const newDone = typeof done === 'number' ? (done ? 1 : 0) : current.done;

    db.query(
      'UPDATE tasks SET title = ?, done = ? WHERE id = ?',
      [newTitle, newDone, id],
      (err2) => {
        if (err2) {
          console.error('Error actualizando tarea:', err2.message);
          return res.status(500).json({ error: 'Error actualizando tarea' });
        }
        
        db.query('SELECT * FROM tasks WHERE id = ?', [id], (err3, updated) => {
          if (err3) {
            console.error('Error obteniendo tarea actualizada:', err3.message);
            return res.status(500).json({ error: 'Error obteniendo tarea' });
          }
          res.json(updated[0]);
        });
      }
    );
  });
});

// Eliminar tarea
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  // Validar ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error eliminando tarea:', err.message);
      return res.status(500).json({ error: 'Error eliminando tarea' });
    }
    res.status(204).end();
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Todo List funcionando',
    endpoints: {
      getAll: 'GET /tasks',
      create: 'POST /tasks',
      update: 'PUT /tasks/:id',
      delete: 'DELETE /tasks/:id'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
  console.log(`📁 Base de datos: ${process.env.DB_NAME || 'No configurada'}`);
});