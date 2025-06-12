require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Créer un client Stripe
app.post('/create-customer', async (req, res) => {
  const { email, name } = req.body;
  try {
    const customer = await stripe.customers.create({ email, name });
    res.json({ customerId: customer.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Créer une intent de paiement
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, customerId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency,
      customer: customerId,
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('✅ Backend Stripe running on http://localhost:3000'));
