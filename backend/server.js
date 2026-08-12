const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

// Configure Nodemailer Transporter
// Using ethereal email or user's provided SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Default to gmail, can be changed
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, profession, message } = req.body;

    // 1. Save to Database
    const newContact = new Contact({ name, email, profession, message });
    await newContact.save();

    // 2. Send Email to Agency Owner
    const mailOptionsOwner = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself
      subject: `New Client: ${name} (${profession})`,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Profession:</strong> ${profession}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // 3. Send Auto-Reply to Client
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting DDWebsite!`,
      html: `
        <h3>Dear client ${name},</h3>
        <p>Thank you for reaching out to DDWebsite. We have received your message regarding your <strong>${profession}</strong> needs.</p>
        <p>Our team will review your requirements and get back to you shortly.</p>
        <br/>
        <p>Best Regards,</p>
        <p>DDWebsite</p>
      `
    };

    // Send emails (optional in dev if not configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptionsOwner);
      await transporter.sendMail(mailOptionsClient);
      console.log('Emails sent successfully');
    } else {
      console.log('Emails skipped: EMAIL_USER and EMAIL_PASS not fully configured in .env');
    }

    res.status(200).json({ success: true, message: 'Message received and saved.' });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
