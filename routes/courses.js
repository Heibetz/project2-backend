// routes/courses.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Map API body -> DB column names (note the space in "Course Number")
function toDbColumns(body) {
  return {
    Dept: body.dept,
    'Course Number': body.course_number,
    Level: body.level,
    Hours: body.hours,
    Name: body.name,
    Description: body.description
  };
}

// LIST  GET /api/courses?q=&page=&size=
router.get('/', (req, res) => {
  const { q = '' } = req.query;
  const like = `%${q}%`;

  // Select with aliases so the API returns clean snake_case keys
  const sql = `
    SELECT
      id,
      Dept            AS dept,
      \`Course Number\` AS course_number,
      Level           AS level,
      Hours           AS hours,
      Name            AS name,
      Description     AS description,
      created_at,
      updated_at
    FROM courses
    WHERE (? = '' OR Dept LIKE ? OR Name LIKE ?)
    ORDER BY Dept, \`Course Number\`
  `;

  pool.query(sql, [q, like, like], (err, rows) => {
    if (err) return res.status(500).json({ error: err.code, detail: err.sqlMessage });
    res.json(rows);
  });
});

// READ  GET /api/courses/:id
router.get('/:id', (req, res) => {
  const sql = `
    SELECT
      id,
      Dept            AS dept,
      \`Course Number\` AS course_number,
      Level           AS level,
      Hours           AS hours,
      Name            AS name,
      Description     AS description,
      created_at,
      updated_at
    FROM courses
    WHERE id = ?
    LIMIT 1
  `;
  pool.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.code, detail: err.sqlMessage });
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  });
});

// CREATE  POST /api/courses
router.post('/', (req, res) => {
  const rec = toDbColumns(req.body);

  // minimal required fields — adjust if your schema differs
  const required = ['Dept','Course Number','Level','Hours','Name'];
  const missing = required.filter(k => rec[k] == null || rec[k] === '');
  if (missing.length) return res.status(400).json({ message: 'Missing: ' + missing.join(', ') });

  pool.query('INSERT INTO courses SET ?', rec, (err, result) => {
    if (err) return res.status(400).json({ error: err.code, detail: err.sqlMessage });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// UPDATE  PUT /api/courses/:id
router.put('/:id', (req, res) => {
  const rec = toDbColumns(req.body);
  pool.query('UPDATE courses SET ? WHERE id = ?', [rec, req.params.id], (err, result) => {
    if (err) return res.status(400).json({ error: err.code, detail: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ id: Number(req.params.id), ...req.body });
  });
});

// DELETE  DELETE /api/courses/:id
router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.code, detail: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  });
});

module.exports = router;
