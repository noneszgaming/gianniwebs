const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Item = require('../models/Item'); // Add this import

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post('/send-order-email', async (req, res) => {
  const orderData = req.body;

  // Fetch full item details from database
  try {
    const itemDetails = await Promise.all(
      orderData.items.map(async (item) => {
        const fullItem = await Item.findById(item._id);
        return {
          name: fullItem.name.hu, // Using Hungarian name
          quantity: item.quantity,
          price: fullItem.price
        };
      })
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orderData.customer.email,
      subject: 'Rendelés visszaigazolás',
      html: `
        <h1>Köszönjük a rendelését!</h1>
        <p>Kedves ${orderData.customer.name}!</p>
        <h2>Rendelési adatok:</h2>
        <p>Rendelési azonosító: ${orderData.paymentId}</p>
        <h3>Rendelt termékek:</h3>
        <ul>
          ${itemDetails.map(item => `
            <li>${item.name} x ${item.quantity} - ${item.price * item.quantity} Ft</li>
          `).join('')}
        </ul>
        <p><strong>Végösszeg: ${orderData.total} Ft</strong></p>
        <p>Szállítási mód: ${orderData.isInstantDelivery ? 'Azonnali kiszállítás' : 
          `Időpontra kiszállítás: ${orderData.deliveryDate} ${orderData.deliveryTime}`}</p>
        <p>Szállítási cím: ${orderData.address.addressLine1}, ${orderData.address.city}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email elküldve' });
  } catch (error) {
    console.error('Email küldési hiba:', error);
    res.status(500).json({ error: 'Hiba történt az email küldése során' });
  }
});

module.exports = router;