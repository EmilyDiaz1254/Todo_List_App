require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/* ===========================
   VERIFICAR / CREAR TABLA
=========================== */
db.query(`
  CREATE TABLE IF NOT EXISTS trabajos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done TINYINT(1) DEFAULT 0,
    created_at DATETIME
  )
`, (err) => {
  if (err) {
    console.error('❌ Error verificando tabla trabajos:', err.message);
  } else {
    console.log('✅ Tabla "trabajos" lista para usar');
  }
});

/* ===========================
   OBTENER TODAS LAS TAREAS
=========================== */
app.get('/trabajos', (req, res) => {
  db.query(
    'SELECT * FROM trabajos ORDER BY created_at DESC',
    (err, results) => {
      if (err) {
        console.error('❌ Error obteniendo trabajos:', err.message);
        // 🔒 SIEMPRE devolver array
        return res.status(500).json([]);
      }
      res.json(results || []);
    }
  );
});

/* ===========================
   CREAR TAREA
=========================== */
app.post('/trabajos', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Título inválido' });
  }

  const createdAt = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  db.query(
    'INSERT INTO trabajos (title, done, created_at) VALUES (?, 0, ?)',
    [title.trim(), createdAt],
    (err, result) => {
      if (err) {
        console.error('❌ Error creando trabajo:', err.message);
        return res.status(500).json({ error: 'Error creando trabajo' });
      }

      db.query(
        'SELECT * FROM trabajos WHERE id = ?',
        [result.insertId],
        (err2, rows) => {
          if (err2 || !rows.length) {
            console.error('❌ Error leyendo trabajo creado:', err2?.message);
            return res.status(500).json({ error: 'Error leyendo trabajo' });
          }
          res.status(201).json(rows[0]);
        }
      );
    }
  );
});

/* ===========================
   ACTUALIZAR TAREA
=========================== */
app.put('/trabajos/:id', (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  db.query(
    'SELECT * FROM trabajos WHERE id = ?',
    [id],
    (err, rows) => {
      if (err) {
        console.error('❌ Error buscando trabajo:', err.message);
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (!rows.length) {
        return res.status(404).json({ error: 'Trabajo no encontrado' });
      }

      const current = rows[0];
      const newTitle =
        typeof title === 'string' && title.trim()
          ? title.trim()
          : current.title;

      const newDone =
        typeof done === 'number'
          ? done ? 1 : 0
          : current.done;

      db.query(
        'UPDATE trabajos SET title = ?, done = ? WHERE id = ?',
        [newTitle, newDone, id],
        (err2) => {
          if (err2) {
            console.error('❌ Error actualizando trabajo:', err2.message);
            return res.status(500).json({ error: 'Error actualizando trabajo' });
          }

          db.query(
            'SELECT * FROM trabajos WHERE id = ?',
            [id],
            (err3, updated) => {
              if (err3 || !updated.length) {
                console.error('❌ Error leyendo trabajo actualizado:', err3?.message);
                return res.status(500).json({ error: 'Error leyendo trabajo' });
              }
              res.json(updated[0]);
            }
          );
        }
      );
    }
  );
});

/* ===========================
   ELIMINAR TAREA
=========================== */
app.delete('/trabajos/:id', (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  db.query(
    'DELETE FROM trabajos WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        console.error('❌ Error eliminando trabajo:', err.message);
        return res.status(500).json({ error: 'Error eliminando trabajo' });
      }
      res.status(204).end();
    }
  );
});

/* ===========================
   RUTA BASE
=========================== */
app.get('/trabajos', (req, res) => {
  res.json({
    message: 'API Todo List funcionando correctamente',
    endpoints: {
      getAll: 'GET /trabajos',
      create: 'POST /trabajos',
      update: 'PUT /trabajos/:id',
      delete: 'DELETE /trabajos/:id'
    }
  });
});

/* ===========================
   404 CONTROLADO
=========================== */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

/* ===========================
   INICIAR SERVIDOR
=========================== */
app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
  console.log(`📁 Base de datos: ${process.env.DB_NAME || 'No configurada'}`);
});
