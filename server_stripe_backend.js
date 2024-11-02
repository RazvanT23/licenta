// server.js
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51QGJBUDtj4OjoiAnOLRiS9Bc69l3KL1zd4p1iEbbBTONhQ53vLbqqShJb9i91IWxQP54mFUXOnYfmpPKqWU9Ogis00J3nPkq7e'); // Replace with your Stripe secret key

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    const items = req.body.items;

    // Create line items for Stripe from the cart items
    const lineItems = items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:4242/success', // Replace with your success URL
            cancel_url: 'http://localhost:4242/cancel',   // Replace with your cancel URL
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});




const path = require('path'); // Add this if not already included

// Add the `/success` route to server2.js
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'succes.html')); // Ensure the correct path to `succes.html`
});





// Start the server
app.listen(4242, () => console.log('Server running on port 4242'));
