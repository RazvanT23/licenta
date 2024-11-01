// server2.js
const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
app.use(cors());
// Set up MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', 
    password: 'razvandiandra', 
    database: 'user_authentication' 
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Set up a route to fetch product details
app.get('/product/:id', (req, res) => {
    let productId = req.params.id;
    let sql = `SELECT * FROM products2 WHERE id = ?`;
    db.query(sql, [productId], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send('Product not found');
            }
        }
    });
});

// Serve static files (like your HTML and CSS files)
app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

// Set up a route to handle product purchases
app.post('/purchase/:id', (req, res) => {
    let productId = req.params.id;
    let sql = `UPDATE products2 SET quantity = quantity - 1 WHERE id = ? AND quantity > 0`;
    db.query(sql, [productId], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(400).send('Product out of stock or not found');
        } else {
            res.send('Product purchased successfully');
        }
    });
});
