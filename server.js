const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'testt' // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create users table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  }
});

// Handle form submission (registration)
app.post('/submit-form', (req, res) => {
  const { name, email, password } = req.body;

  console.log('Received form data:', { name, email, password });

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, results) => {
    if (err) {
      console.error('Error saving data:', err.message); // Detailed error message
      return res.status(500).json({ message: 'Error saving data' });
    }
    res.json({ message: 'Data saved successfully' });
  });
});

// Handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Received login data:', { email, password });

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      return res.status(500).json({ message: 'Error fetching data' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Sign Up first invalid  User Id and password' });
    }
  });
});

// Serve HTML file from the main directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
