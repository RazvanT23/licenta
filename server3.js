const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 4243;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'razvandiandra',
    database: 'user_authentication'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Get all products
app.get('/get-products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Error fetching products');
        } else {
            res.json(results);
        }
    });
});

// Get product by ID
app.get('/get-product/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).send('Error fetching product');
        } else if (results.length === 0) {
            res.status(404).send('Product not found');
        } else {
            res.json(results[0]);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
