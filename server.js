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
  const auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/your/credentials.json', // Update the path to your credentials file
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Required scopes
  });

  const client = await auth.getClient();
  const spreadsheetId = 'your-google-sheets-id'; // Replace with your Google Sheets ID

  // Prepare the row data, adding each question score to a new column
  const row = [
    scores.userName,
    scores.attentionToDetail,
    scores.continuousLearning,
    scores.communication,
    scores.integrity,
    scores.reliability,
    scores.teamwork,
    scores.answers.question1,
    scores.answers.question2,
    scores.answers.question3,
    scores.answers.question4,
    scores.answers.question5,
    scores.answers.question6,
    scores.answers.question7,
    scores.answers.question8,
    scores.answers.question9,
    scores.answers.question10,
    scores.answers.question11,
    scores.answers.question12,
    scores.answers.question13,
    scores.answers.question14,
    scores.answers.question15,
    scores.answers.question16,
    scores.answers.question17,
    scores.answers.question18,
    scores.answers.question19,
    scores.answers.question20,
    scores.answers.question21,
    scores.answers.question22,
    scores.answers.question23,
    scores.answers.question24,
    scores.answers.question25,
    scores.answers.question26,
    scores.answers.question27,
    scores.answers.question28,
    scores.answers.question29,
    scores.answers.question30,
    scores.answers.question31,
    scores.answers.question32,
    scores.answers.question33,
    scores.answers.question34,
    scores.answers.question35,
    scores.answers.question36,
    scores.answers.question37,
    scores.answers.question38,
    scores.answers.question39,
    scores.answers.question40,
  ];

  // Add a new row to the sheet
  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Sheet1!A:AR', // Adjust range to fit all columns (A:AR fits up to 44 columns)
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
