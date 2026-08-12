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

const PORT = process.env.PORT || 5000;


/* =====================================================
   CORS
===================================================== */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an origin
      // Example: Postman or server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured frontend URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);

      return callback(
        new Error('Not allowed by CORS')
      );
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);


/* =====================================================
   BODY PARSER
===================================================== */

app.use(express.json());


/* =====================================================
   MONGODB CONNECTION
===================================================== */

if (!process.env.MONGO_URI) {

  console.error(
    'ERROR: MONGO_URI is missing in .env'
  );

} else {

  mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {
      console.log('Connected to MongoDB');
    })

    .catch((error) => {
      console.error(
        'Failed to connect to MongoDB:',
        error.message
      );
    });
}


/* =====================================================
   NODEMAILER
===================================================== */

let transporter = null;

if (
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS
) {

  transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }

  });

  console.log('Nodemailer configured');

} else {

  console.log(
    'Email not configured.'
  );

}


/* =====================================================
   TEST ROUTE
===================================================== */

app.get('/', (req, res) => {

  res.status(200).json({

    success: true,

    message:
      'DDWebsite backend is running'

  });

});


/* =====================================================
   CONTACT API
===================================================== */

app.post('/api/contact', async (req, res) => {

  try {

    const {
      name,
      email,
      profession,
      message
    } = req.body;


    /* ---------------------------------------------
       Validate form
    --------------------------------------------- */

    if (
      !name ||
      !email ||
      !profession ||
      !message
    ) {

      return res.status(400).json({

        success: false,

        message:
          'All fields are required.'

      });

    }


    /* ---------------------------------------------
       Save contact to MongoDB
    --------------------------------------------- */

    const newContact = new Contact({

      name,
      email,
      profession,
      message

    });

    await newContact.save();

    console.log(
      'Contact saved to MongoDB'
    );


    /* ---------------------------------------------
       Send emails
    --------------------------------------------- */

    if (transporter) {

      /* Email to website owner */

      const mailOptionsOwner = {

        from: process.env.EMAIL_USER,

        to: process.env.EMAIL_USER,

        subject:
          `New Client: ${name} (${profession})`,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              line-height: 1.6;
            "
          >

            <h2>
              New Contact Request
            </h2>

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Profession:</strong>
              ${profession}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <p>
              ${message}
            </p>

          </div>
        `
      };


      /* Auto reply to client */

      const mailOptionsClient = {

        from: process.env.EMAIL_USER,

        to: email,

        subject:
          'Thank you for contacting DDWebsite!',

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              line-height: 1.6;
            "
          >

            <h2>
              Dear ${name},
            </h2>

            <p>
              Thank you for contacting
              <strong>DDWebsite</strong>.
            </p>

            <p>
              We have received your message
              regarding your
              <strong>${profession}</strong>
              needs.
            </p>

            <p>
              Our team will review your
              requirements and get back to
              you shortly.
            </p>

            <br />

            <p>
              Best Regards,
            </p>

            <p>
              <strong>DDWebsite</strong>
            </p>

          </div>
        `
      };


      /* Send email to owner */

      await transporter.sendMail(
        mailOptionsOwner
      );


      /* Send auto-reply */

      await transporter.sendMail(
        mailOptionsClient
      );


      console.log(
        'Emails sent successfully'
      );

    } else {

      console.log(
        'Emails skipped because email credentials are not configured.'
      );

    }


    /* ---------------------------------------------
       Success
    --------------------------------------------- */

    return res.status(200).json({

      success: true,

      message:
        'Message received and saved successfully.'

    });

  } catch (error) {

    console.error(
      'Contact form error:',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Server Error. Please try again later.'

    });

  }

});


/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});