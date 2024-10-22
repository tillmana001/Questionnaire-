const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis'); // Import googleapis
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to handle form data and allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html when accessing the root URL with error handling
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Function to write results to Google Sheets
async function writeResultsToGoogleSheets(scores) {
  const sheets = google.sheets('v4');
  
  // Decode the Base64 credentials
  const credentials = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials), // Parse the decoded JSON
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Required scopes
  });

  const client = await auth.getClient();
  const spreadsheetId = '1c5MQAB4rhbH4eBdajDlqucZIXd5U_4Zqxlqyj7V1Dbo'; // Replace with your Google Sheets ID

  // Prepare the row data
  const row = [
    scores.userName,
    scores.attentionToDetail,
    scores.continuousLearning,
    scores.communication,
    scores.integrity,
    scores.reliability,
    scores.teamwork,
    JSON.stringify(scores.answers), // Convert individual answers to a string
  ];

  // Add a new row to the sheet
  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Sheet1!A:H', // Update with your target sheet and range
    valueInputOption: 'RAW',
    resource: {
      values: [row], // Array of rows to be added
    },
  });
}

// Route to handle form submission
app.post('/send', async (req, res) => {
  const scores = req.body;
  console.log('Received scores:', scores);

  // Write results to Google Sheets
  try {
    await writeResultsToGoogleSheets(scores);
    res.status(200).send('Survey results saved successfully');
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error saving to Google Sheets');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
