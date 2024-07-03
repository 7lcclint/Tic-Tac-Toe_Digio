const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'seraveeII1/100',
  database: 'tictactoe'
});

connection.connect(error => {
  if (error) {
    console.error('An error occurred while connecting to the DB:', error);
    return;
  }
  console.log('Connected to the MySQL server.');
});

module.exports = connection;
