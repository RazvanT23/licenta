const express = require('express');
const mysql = require('mysql');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
console.log('Starting server...');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname))); // Ensure this is included to serve CSS files

// MySQL connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', 
    password: 'razvandiandra', 
    database: 'user_authentication' 
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL');
});

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle user registration
app.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), // Add password validation
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;

    // Check if email already exists
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server error.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Insert new user
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(sql, [email, password], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error registering user.' });
            }
            res.redirect('/login');
        });
    });
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add route for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error during login." });
        } else if (result.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Invalid credentials." });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});