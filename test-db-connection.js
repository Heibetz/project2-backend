const mariadb = require('mariadb');
const dbConfig = require('./app/config/db.config');

async function testConnection() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });
    console.log('Connection successful!');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    if (conn) await conn.end();
  }
}

testConnection();
