const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Import dotenv for environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle form data and allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'Project' directory
app.use(express.static(path.join(__dirname, 'Project')));

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Project', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Replace with your Gmail address
    pass: process.env.GMAIL_PASS // Replace with your Gmail app password
  }
});

// Route to handle form submission
app.post('/send', (req, res) => {
  const scores = req.body; // Assuming the front-end sends a JSON object with scores
  console.log('Received scores:', scores); // Log incoming scores

  // Email options
  const mailOptions = {
    from: process.env.GMAIL_USER, // Use environment variable
    to: process.env.GMAIL_USER, // Use environment variable
    subject: 'New Survey Response',
    text: `Scores: ${JSON.stringify(scores, null, 2)}`
  };

  // Send email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
