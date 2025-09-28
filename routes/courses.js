// routes/courses.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Guard :id path param (keeps routes simple)
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ message: 'Invalid id' });
  next();
});

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

// Normalize types (numbers) and empty strings to null where appropriate
function normalize(rec) {
  if (rec.Level != null && rec.Level !== '') rec.Level = Number(rec.Level);
  if (rec.Hours != null && rec.Hours !== '') rec.Hours = Number(rec.Hours);
  if (rec.Description === '') rec.Description = null;
  return rec;
}

// LIST  GET /api/courses?q=
router.get('/', (req, res) => {
  const q = (req.query.q || '').trim();
  const like = `%${q}%`;

  const filter = q ? 'WHERE Dept LIKE ? OR Name LIKE ?' : '';
  const params = q ? [like, like] : [];

  const sql = `
    SELECT
      id,
      Dept              AS dept,
      \`Course Number\`  AS course_number,
      Level             AS level,
      Hours             AS hours,
      Name              AS name,
      Description       AS description,
      created_at,
      updated_at
    FROM courses
    ${filter}
    ORDER BY Dept, \`Course Number\`
  `;

  pool.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: { code: err.code, detail: err.sqlMessage } });
    res.json(rows);
  });
});

// READ  GET /api/courses/:id
router.get('/:id', (req, res) => {
  const sql = `
    SELECT
      id,
      Dept              AS dept,
      \`Course Number\`  AS course_number,
      Level             AS level,
      Hours             AS hours,
      Name              AS name,
      Description       AS description,
      created_at,
      updated_at
    FROM courses
    WHERE id = ?
    LIMIT 1
  `;
  pool.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: { code: err.code, detail: err.sqlMessage } });
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  });
});

// CREATE  POST /api/courses
router.post('/', (req, res) => {
  const rec = normalize(toDbColumns(req.body));

  // minimal required fields — adjust if your schema differs
  const required = ['Dept', 'Course Number', 'Level', 'Hours', 'Name'];
  const missing = required.filter(k => rec[k] == null || rec[k] === '' || Number.isNaN(rec[k]));
  if (missing.length) return res.status(400).json({ message: 'Missing: ' + missing.join(', ') });

  pool.query('INSERT INTO courses SET ?', rec, (err, result) => {
    if (err) return res.status(400).json({ error: { code: err.code, detail: err.sqlMessage } });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// UPDATE  PUT /api/courses/:id
router.put('/:id', (req, res) => {
  const rec = normalize(toDbColumns(req.body));
  pool.query('UPDATE courses SET ? WHERE id = ?', [rec, req.params.id], (err, result) => {
    if (err) return res.status(400).json({ error: { code: err.code, detail: err.sqlMessage } });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ id: Number(req.params.id), ...req.body });
  });
});

// DELETE  DELETE /api/courses/:id
router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: { code: err.code, detail: err.sqlMessage } });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  });
});

module.exports = router;
