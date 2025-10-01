const mysql = require('mysql2/promise');
const dbConfig = require('./app/config/db.config');

(async () => {
  console.log('Using DB config:', {
    host: dbConfig.HOST, port: dbConfig.port || 3306,
    user: dbConfig.USER, database: dbConfig.DB
  });
  try {
    const conn = await mysql.createConnection({
      host: dbConfig.HOST,
      port: dbConfig.port || 3306,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB,
      connectTimeout: 10000
    });
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('Connection successful!', rows);
    await conn.end();
  } catch (e) {
    console.error('Connection failed:', e);
  }
})();