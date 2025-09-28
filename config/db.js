const mysql = require('mysql');
const dbConfig = require('../routes/db.config.js');

// Create a connection pool using the config
const pool = mysql.createPool({
  connectionLimit: dbConfig.pool.max,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

module.exports = pool;
