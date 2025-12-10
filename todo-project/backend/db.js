require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.log('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL correctamente.');
});

module.exports = connection;
