const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./maxproductivity.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create tasks table
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'To Do',
    due_date TEXT
  )`
);

// Routes
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, status, due_date } = req.body;
  db.run(
    `INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)`,
    [title, description, status, due_date],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put('/tasks/:id', (req, res) => {
    const { title, description, status, due_date } = req.body;
    const { id } = req.params;
  
    db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, due_date = ?
       WHERE id = ?`,
      [title, description, status, due_date, id],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Task updated', changes: this.changes });
      }
    );
  });
  

app.delete('/tasks/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Task deleted', changes: this.changes });
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
