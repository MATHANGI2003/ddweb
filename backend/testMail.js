const nodemailer = require('nodemailer');
require('dotenv').config({ path: 'c:/ddwebsite/backend/.env' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error verifying mail:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
