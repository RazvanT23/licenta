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





app.get('/get-recommendations/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT p.id, p.name, p.description, p.price, p.image_url
        FROM products p
        JOIN favorites f ON p.id = f.product_id
        WHERE f.user_id IN (
            SELECT DISTINCT f2.user_id
            FROM favorites f1
            JOIN favorites f2 ON f1.product_id = f2.product_id AND f1.user_id != f2.user_id
            WHERE f1.user_id = ?
        )
        AND p.id NOT IN (
            SELECT product_id FROM favorites WHERE user_id = ?
        )
        GROUP BY p.id
        ORDER BY COUNT(f.user_id) DESC
        LIMIT 2;  
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching recommendations:', err);
            res.status(500).send('Error fetching recommendations');
        } else {
            res.json(results);
        }
    });
});



app.get('/get-orders/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT 
            o.id AS order_id, 
            o.total_amount, 
            o.order_date, 
            GROUP_CONCAT(p.name) AS product_names,
            IFNULL(ANY_VALUE(rr.status), 'None') AS refund_status
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN refund_requests rr ON o.id = rr.order_id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.order_date DESC;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).send('Error fetching orders');
        } else {
            res.json(results);
        }
    });
});






app.post('/request-refund', (req, res) => {
    const { orderId, userId, reason } = req.body;

    const query = `
        INSERT INTO refund_requests (order_id, user_id, reason, status)
        VALUES (?, ?, ?, 'Pending')
    `;
    db.query(query, [orderId, userId, reason], (err, result) => {
        if (err) {
            console.error('Error creating refund request:', err);
            res.status(500).send('Error creating refund request');
        } else {
            res.send('Refund request submitted successfully');
        }
    });
});






app.post('/cancel-refund', (req, res) => {
    const { orderId } = req.body;

    const query = 'DELETE FROM refund_requests WHERE order_id = ? AND status = "Pending"';
    db.query(query, [orderId], (err, result) => {
        if (err) {
            console.error('Error canceling refund:', err);
            res.status(500).send('Error canceling refund');
        } else {
            res.send('Refund request canceled successfully');
        }
    });
});


app.post('/evaluate-refund', (req, res) => {
    const { reason, orderAmount, previousRefunds } = req.body;

    const axios = require('axios');
    axios.post('http://localhost:5000/evaluate-refund', {
        reason, order_amount: orderAmount, previous_refunds: previousRefunds
    })
    .then(response => res.json(response.data))
    .catch(error => res.status(500).send('Error evaluating refund'));
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
