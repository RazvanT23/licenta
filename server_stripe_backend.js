const express = require('express');
const Stripe = require('stripe');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const stripe = Stripe('sk_test_51QGJBUDtj4OjoiAnOLRiS9Bc69l3KL1zd4p1iEbbBTONhQ53vLbqqShJb9i91IWxQP54mFUXOnYfmpPKqWU9Ogis00J3nPkq7e');

// CORS configuration
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Replace with your actual front-end origin
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Important for session persistence
}));

app.use(express.static('public'));
app.use(express.json());

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'razvandiandra',
    database: 'user_authentication'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
    console.log('Connected to the MySQL database.');
});

// Configure MySQL session store
const sessionStore = new MySQLStore({}, db);

// Configure session middleware with MySQL store
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    proxy:true,
    cookie: {
        secure: false,  // Set to true if using HTTPS
        httpOnly: true,
        sameSite: false 
    }
}));



// Middleware to log session ID and data for each request
app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session Data:", req.session);
    next();
});

// Route to initialize session with userId and cart
app.post('/start-checkout', (req, res) => {
    const { userId, cart } = req.body;
    req.session.userId = userId;
    req.session.cart = cart;

    console.log("Session initialized with User ID:", req.session.userId, "Cart:", req.session.cart);

    // Explicitly save the session to ensure persistence
    req.session.save(err => {
        if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ message: "Failed to save session." });
        }
        res.json({ message: "Session initialized for checkout" });
    });
});

// Route to create a Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    const items = req.body.items;
    const lineItems = items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:4242/success',
            cancel_url: 'http://localhost:4242/cancel',
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle successful checkout
app.get('/success', (req, res) => {
    console.log("Session data at /success:", req.session);

    const userId = req.session.userId;
    const cart = req.session.cart;

    if (!userId || !cart) {
        console.error("User or Cart not found in session");
        return res.status(400).send("User or Cart not found");
    }

    // Calculate total amount and insert order
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderQuery = 'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)';
    db.query(orderQuery, [userId, totalAmount], (err, orderResult) => {
        if (err) {
            console.error("Error inserting order:", err);
            return res.status(500).send("Internal Server Error");
        }

        const orderId = orderResult.insertId;
        const orderItemsData = cart.map(item => [orderId, item.id, item.quantity, item.price]);

        const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
        db.query(orderItemsQuery, [orderItemsData], (itemsErr) => {
            if (itemsErr) {
                console.error("Error inserting order items:", itemsErr);
                return res.status(500).send("Internal Server Error");
            }

            req.session.cart = null; // Clear cart after successful order creation
            res.sendFile(path.join(__dirname, 'succes.html'));
        });
    });
});

app.listen(4242, () => console.log('Server running on port 4242'));
