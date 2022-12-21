const mysql = require('promise-mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'gcontacto'
});

function getConnection() {
  return connection;
}

module.exports = { getConnection };