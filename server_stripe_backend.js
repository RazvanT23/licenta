// server_stripe_backend.js

const express = require('express');
const app = express();
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

// Initialize Stripe with your secret key
const stripe = Stripe('sk_test_51QGJBUDtj4OjoiAnOLRiS9Bc69l3KL1zd4p1iEbbBTONhQ53vLbqqShJb9i91IWxQP54mFUXOnYfmpPKqWU9Ogis00J3nPkq7e'); // Replace with your actual secret key

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'razvandiandra',
    database: 'user_authentication'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Serve static files
app.use(express.static(__dirname)); // Serves static files from the current directory

// Use CORS if needed
app.use(cors());

// ***** Logging middleware (Place this before route definitions) *****
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// ***** Apply raw body parser for /webhook route (Place this before applying bodyParser.json()) *****
app.post('/webhook', express.raw({ type: '*/*' }), (request, response) => {
  const endpointSecret = 'whsec_29f9e642bf4d7b6cde23be6369902610b81200b8c32efd99f8d0568ed89b8625'; // Use your webhook signing secret

  const sig = request.headers['stripe-signature'];
  let event;

  try {
      // Verify the webhook signature and extract the event
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('Webhook event received:', event.type);
  } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed event');
      const session = event.data.object;
      handleCheckoutSession(session);
  } else {
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});

// ***** Apply JSON body parser for all other routes (After /webhook route) *****
app.use(bodyParser.json());

// Define other routes after middleware
app.post('/create-checkout-session', async (req, res) => {
    const { items, userId } = req.body;
  
    // Map your items to match the format required by Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:4242/success.html',
        cancel_url: 'http://localhost:4242/cancel.html',
        metadata: {
          userId: userId.toString(),
          cart: JSON.stringify(items)
        }
      });
  
      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('An error occurred while creating the checkout session.');
    }
});

// Function to handle the checkout session
async function handleCheckoutSession(session) {
  console.log('handleCheckoutSession called with session:', session.id);
  const userId = parseInt(session.metadata.userId);
  const cart = JSON.parse(session.metadata.cart);

  console.log('User ID:', userId);
  console.log('Cart:', cart);

  if (!userId || !cart) {
    console.error("User ID or cart not found in session metadata.");
    return;
  }

  

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  console.log('Total Amount:', totalAmount);

  // Insert order into database
  const orderQuery = 'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)';
  db.query(orderQuery, [userId, totalAmount], (err, orderResult) => {
    if (err) {
      console.error("Error inserting order:", err);
      return;
    }

    const orderId = orderResult.insertId;
    console.log('Order ID:', orderId);

    const orderItemsData = cart.map(item => [orderId, item.id, item.quantity, item.price]);
    console.log('Order Items Data:', orderItemsData);

    const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
    db.query(orderItemsQuery, [orderItemsData], (itemsErr) => {
      if (itemsErr) {
        console.error("Error inserting order items:", itemsErr);
      } else {
        console.log(`Order ${orderId} and its items have been saved.`);
      }
    });
  });
}

// Start the server
app.listen(4242, () => console.log('Server running on port 4242'));
