// module.exports = {
//     HOST: 'localhost',
//     USER: 'root',
//     PASSWORD: '',
//     DB: 'seiv_project2_t5',
//     dialect: 'mariadb',
//     pool: {
//         max: 5,
//         min: 0,  
//         acquire: 30000,
//         idle: 10000,
//     },
// };

// module.exports = {
//     HOST: 't0-database.czjofbims6cw.us-west-2.rds.amazonaws.com',
//     port: 3306,
//     USER: 'admin',
//     PASSWORD: 'passwordt0',
//     DB: 'course',
//     dialect: 'mysql',
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// };

require('dotenv').config();

const _base = module.exports || {};
module.exports = {
  ..._base,
  HOST: process.env.DB_HOST,
  port: 3306,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PW,
  DB: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  pool: {
    ...(_base.pool || {}),
    max: Number(process.env.DB_POOL_MAX || (_base.pool && _base.pool.max) || 5),
    min: Number(process.env.DB_POOL_MIN || (_base.pool && _base.pool.min) || 0),
    acquire: Number(process.env.DB_POOL_ACQUIRE || (_base.pool && _base.pool.acquire) || 30000),
    idle: Number(process.env.DB_POOL_IDLE || (_base.pool && _base.pool.idle) || 10000),
  },
};