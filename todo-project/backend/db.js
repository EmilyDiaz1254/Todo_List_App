// todo-project/backend/db.js
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tododb',
  port: process.env.DB_PORT || 3306,
  // Configuraciones adicionales para Railway
  connectTimeout: 10000,
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    console.log('🔧 Variables disponibles:');
    console.log('- DB_HOST:', process.env.DB_HOST ? '✓' : '✗');
    console.log('- DB_NAME:', process.env.DB_NAME ? '✓' : '✗');
    console.log('- DB_USER:', process.env.DB_USER ? '✓' : '✗');
    console.log('- DB_PORT:', process.env.DB_PORT ? '✓' : '✗');
    return;
  }
  console.log('✅ Conectado a MySQL correctamente');
  console.log(`📊 Base de datos: ${process.env.DB_NAME || 'No especificada'}`);
});

module.exports = connection;