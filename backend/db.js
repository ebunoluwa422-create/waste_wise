const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',          // leave empty (default XAMPP password)
  database: 'wastewise'
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL successfully!');
  }
});

module.exports = db;