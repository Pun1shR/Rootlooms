import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars if running locally (Vercel injects them automatically in production)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Admin client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

// Initialize Razorpay
let razorpayInstance = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) {
  console.error("Failed to initialize Razorpay:", e);
}

// 1. Create Order API
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;

    if (!razorpayInstance) {
      return res.status(500).json({ error: 'Razorpay keys not configured' });
    }

    const amountInPaise = amount * 100;
    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Amount must be at least 1 INR (100 paise)' });
    }

    const options = {
      amount: amountInPaise, // Razorpay works in paise (amount * 100)
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Razorpay Authentication Failed' });
    }
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// 2. Verify Payment & Create DB Order API
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderDetails 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required Razorpay fields' });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    if (!supabase) {
      console.warn("Supabase not configured on backend. Skipping DB save.");
      return res.json({ success: true, message: 'Payment verified, but DB save skipped.' });
    }

    // Save order to Supabase
    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: orderDetails.user_id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: orderDetails.amount,
          shipping_cost: orderDetails.shipping_cost,
          status: 'paid',
          items: orderDetails.items,
          shipping_address: orderDetails.shipping_address || 'TBD'
        }
      ])
      .select();

    if (orderError) throw orderError;

    // Reduce stock for each item
    for (const item of orderDetails.items) {
      // Get current stock
      const { data: sareeData } = await supabase
        .from('sarees')
        .select('stock')
        .eq('id', item.id)
        .single();
        
      if (sareeData) {
        const newStock = Math.max(0, (sareeData.stock || 1) - item.quantity);
        await supabase
          .from('sarees')
          .update({ stock: newStock })
          .eq('id', item.id);
      }
    }

    res.json({ success: true, order: insertedOrder[0] });

  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// For local development only. Vercel ignores this since it exports the app directly.
if (process.env.NODE_ENV !== 'production' && process.argv[1] && process.argv[1].includes('api/index.js')) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
}

export default app;
