const pool = require('./config/db');

pool.query('SELECT 1 + 1 AS two', (err, rows) => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('DB OK:', rows[0]);
  process.exit(0);
});
