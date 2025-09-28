const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/courses — list all courses
router.get('/', (req, res) => {
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
    ORDER BY Dept, \`Course Number\`
  `;
  pool.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: { code: err.code, detail: err.sqlMessage } });
    }
    res.json(rows);
  });
});

module.exports = router;
