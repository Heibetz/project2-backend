//const mariadb = require('mariadb');
//const dbConfig = require('./routes/db.config');

//async function testConnection() {
  //let conn;
  //try {
    //conn = await mariadb.createConnection({
      //host: dbConfig.HOST,
      //user: dbConfig.USER,
      //password: dbConfig.PASSWORD,
      //database: dbConfig.DB
    //});
    //console.log('Connection successful!');
  //} catch (err) {
    //console.error('Connection failed:', err);
  //} finally {
    //if (conn) await conn.end();
  //}
  //testConnection();

//testConnection();


const pool = require('./config/db');

pool.query('SELECT 1 + 1 AS two', (err, rows) => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('DB OK:', rows[0]); // { two: 2 }
  process.exit(0);
});
