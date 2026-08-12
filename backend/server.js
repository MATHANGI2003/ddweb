const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '.env')
});

const Contact = require('./models/Contact');

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
);


/* =========================
   MONGODB
========================= */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }

  await mongoose.connect(process.env.MONGO_URI);

  isConnected = true;

  console.log('Connected to MongoDB');
};


/* =========================
   NODEMAILER
========================= */

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


/* =========================
   HOME ROUTE
========================= */

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DDWebsite backend is running'
  });
});


/* =========================
   CONTACT ROUTE
========================= */

app.post('/api/contact', async (req, res) => {
  try {
    await connectDB();

    const {
      name,
      email,
      profession,
      message
    } = req.body;

    if (!name || !email || !profession || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    /* Save to MongoDB */

    const newContact = new Contact({
      name,
      email,
      profession,
      message
    });

    await newContact.save();


    /* Send emails */

    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    ) {

      /* Email to website owner */

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,

        subject: `New Client: ${name} (${profession})`,

        html: `
          <h2>New Contact Request</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Profession:</strong> ${profession}</p>

          <p><strong>Message:</strong></p>

          <p>${message}</p>
        `
      });


      /* Auto reply to client */

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,

        subject: 'Thank you for contacting DDWebsite!',

        html: `
          <h2>Dear ${name},</h2>

          <p>
            Thank you for contacting DDWebsite.
          </p>

          <p>
            We have received your message regarding
            your <strong>${profession}</strong> needs.
          </p>

          <p>
            Our team will get back to you shortly.
          </p>

          <br>

          <p>Best Regards,</p>

          <p><strong>DDWebsite</strong></p>
        `
      });

      console.log('Emails sent successfully');
    }


    return res.status(200).json({
      success: true,
      message: 'Message received and saved successfully.'
    });

  } catch (error) {

    console.error('Contact error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});


/* =========================
   LOCALHOST ONLY
========================= */

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `Server running on port ${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error(
        'MongoDB connection error:',
        error.message
      );
    });
}


/* =========================
   EXPORT FOR VERCEL
========================= */

module.exports = app;