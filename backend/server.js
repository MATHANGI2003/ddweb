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

  // Frontend Vercel URL
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman/server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost and configured frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel frontend domains
      if (
        origin.endsWith('.vercel.app')
      ) {
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
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);


/* =====================================================
   JSON MIDDLEWARE
===================================================== */

app.use(express.json());


/* =====================================================
   MONGODB CONNECTION
===================================================== */

let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      'MONGO_URI is missing'
    );
  }

  await mongoose.connect(
    process.env.MONGO_URI
  );

  isConnected = true;

  console.log(
    'Connected to MongoDB'
  );
};


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

  console.log(
    'Nodemailer configured'
  );

} else {

  console.log(
    'Email credentials not configured'
  );

}


/* =====================================================
   HOME ROUTE
===================================================== */

app.get('/', (req, res) => {

  res.status(200).json({

    success: true,

    message:
      'Backend deployed successfully'

  });

});


/* =====================================================
   CONTACT ROUTE
===================================================== */

app.post(
  '/api/contact',
  async (req, res) => {

    try {

      const {
        name,
        email,
        profession,
        message
      } = req.body;


      /* ---------------------------------------------
         VALIDATION
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
         CONNECT DATABASE
      --------------------------------------------- */

      await connectDB();


      /* ---------------------------------------------
         SAVE CONTACT
      --------------------------------------------- */

      const newContact =
        new Contact({

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
         SEND EMAILS
      --------------------------------------------- */

      if (transporter) {


        /* ==========================================
           EMAIL TO WEBSITE OWNER
        ========================================== */

        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to:
            process.env.EMAIL_USER,

          replyTo:
            email,

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

        });


        /* ==========================================
           AUTO REPLY TO CLIENT
        ========================================== */

        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to:
            email,

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

        });


        console.log(
          'Emails sent successfully'
        );

      } else {

        console.log(
          'Emails skipped - credentials not configured'
        );

      }


      /* ---------------------------------------------
         SUCCESS RESPONSE
      --------------------------------------------- */

      return res.status(200).json({

        success: true,

        message:
          'Message received and saved successfully.'

      });

    } catch (error) {

      console.error(
        'Contact error:',
        error
      );

      return res.status(500).json({

        success: false,

        message:
          'Server Error: ' +
          error.message

      });

    }

  }
);


/* =====================================================
   ERROR HANDLER
===================================================== */

app.use(
  (err, req, res, next) => {

    console.error(err);

    res.status(500).json({

      success: false,

      message:
        'Internal Server Error'

    });

  }
);


/* =====================================================
   LOCALHOST
===================================================== */

if (require.main === module) {

  connectDB()

    .then(() => {

      app.listen(
        PORT,
        () => {

          console.log(
            `Server running on port ${PORT}`
          );

        }
      );

    })

    .catch((error) => {

      console.error(
        'MongoDB connection error:',
        error.message
      );

    });

}


/* =====================================================
   VERCEL
===================================================== */

module.exports = app;