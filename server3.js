const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 4243;


app.use(cors());
app.use(express.json());


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




app.post('/add-favorite', (req, res) => {
    const { userId, productId } = req.body;
    
    // Check if the product is already in the user's favorites
    const checkQuery = 'SELECT * FROM favorites WHERE user_id = ? AND product_id = ?';
    db.query(checkQuery, [userId, productId], (err, results) => {
        if (err) {
            console.error('Error checking favorites:', err);
            return res.status(500).send('Error checking favorites');
        }
        
        if (results.length > 0) {
            // Product is already in favorites, so don't add it again
            return res.send('Product is already in favorites');
        }
        
        // If not in favorites, proceed to add it
        const insertQuery = 'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)';
        db.query(insertQuery, [userId, productId], (err) => {
            if (err) {
                console.error('Error adding to favorites:', err);
                res.status(500).send('Error adding to favorites');
            } else {
                res.send('Product added to favorites');
            }
        });
    });
});

app.delete('/remove-favorite', (req, res) => {
    const { userId, productId } = req.body;
    const query = 'DELETE FROM favorites WHERE user_id = ? AND product_id = ?';
    db.query(query, [userId, productId], (err) => {
        if (err) {
            console.error('Error removing from favorites:', err);
            res.status(500).send('Error removing from favorites');
        } else {
            res.send('Product removed from favorites');
        }
    });
});

app.get('/get-favorites/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT products.* FROM products 
        JOIN favorites ON products.id = favorites.product_id 
        WHERE favorites.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching favorites:', err);
            res.status(500).send('Error fetching favorites');
        } else {
            res.json(results);
        }
    });
});




app.get('/get-user-email/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT email FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user email:', err);
            res.status(500).send('Error fetching user email');
        } else if (results.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.json(results[0]);
        }
    });
});






app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
