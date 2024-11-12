const express = require('express');
const mysql = require('mysql');
const path = require('path');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express(); 
app.use(cors());

console.log('Starting server...');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname)));


const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'razvandiandra',
    database: 'user_authentication'
});



db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL');
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});




app.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;

    
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server error.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(sql, [email, password], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error registering user.' });
            }
            res.redirect('/login');
        });
    });
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Email or password missing");
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    console.log("Login attempt with:", email, password); 

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Error during login query:", err);
            return res.status(500).json({ success: false, message: "Error during login." });
        } 
        
        if (result.length > 0) {
            console.log("User found:", result[0]); 
            res.json({ success: true, userId: result[0].id });
        } else {
            console.log("Invalid credentials provided"); 
            res.json({ success: false, message: "Invalid credentials." });
        }
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});