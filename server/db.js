const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({ path: '/.env' });

const dbConfig = {
  connectionLimit: process.env.DB_connectionLimit,
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB_database,
  port: process.env.DB_PORT || 3306
  // this is for when we deploy
  // ssl: {
  //   rejectUnauthorized: true
  // }
};

const db = mysql.createPool(dbConfig);
db.getConnection((error) => {
  if(error) {
    console.error(error);
  } else {
    console.log('MySQL Connected...');
  }
});

module.exports = db.promise();