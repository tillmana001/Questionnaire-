const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');

// Initialize Express app and port
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

  // Get credentials from environment variable
  const credentials = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
  
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();

  // Access the spreadsheet ID from an environment variable (if configured)
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Dynamically get the first sheet name
  const sheetInfo = await sheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });
  
  const firstSheet = sheetInfo.data.sheets[0].properties.title;
// Get the current date in your local time zone, remove time part
const localDate = new Date(Date.now()).toLocaleDateString("en-US", { timeZone: "America/Chicago" });

// Format it to YYYY-MM-DD
const [month, day, year] = localDate.split("/");

// Format the date as YYYY-MM-DD
const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

// Prepare the row data with the formatted date
const row = [
    formattedDate,
    scores.userName,
    scores.duration,
    Number(scores.attentionToDetail),
    Number(scores.continuousLearning),
    Number(scores.communication),
    Number(scores.integrity),
    Number(scores.reliability),
    Number(scores.teamwork),
    Number(scores.answers.question1),
    Number(scores.answers.question2),
    Number(scores.answers.question3),
    Number(scores.answers.question4),
    Number(scores.answers.question5),
    Number(scores.answers.question6),
    Number(scores.answers.question7),
    Number(scores.answers.question8),
    Number(scores.answers.question9),
    Number(scores.answers.question10),
    Number(scores.answers.question11),
    Number(scores.answers.question12),
    Number(scores.answers.question13),
    Number(scores.answers.question14),
    Number(scores.answers.question15),
    Number(scores.answers.question16),
    Number(scores.answers.question17),
    Number(scores.answers.question18),
    Number(scores.answers.question19),
    Number(scores.answers.question20),
    Number(scores.answers.question21),
    Number(scores.answers.question22),
    Number(scores.answers.question23),
    Number(scores.answers.question24),
    Number(scores.answers.question25),
    Number(scores.answers.question26),
    Number(scores.answers.question27),
    Number(scores.answers.question28),
    Number(scores.answers.question29),
    Number(scores.answers.question30),
    Number(scores.answers.question31),
    Number(scores.answers.question32),
    Number(scores.answers.question33),
    Number(scores.answers.question34),
    Number(scores.answers.question35),
    Number(scores.answers.question36),
    Number(scores.answers.question37),
    Number(scores.answers.question38),
    Number(scores.answers.question39),
    Number(scores.answers.question40),
    Number(scores.answers.question41),
    Number(scores.answers.question42),
    Number(scores.answers.question43),
    Number(scores.answers.question44),
    Number(scores.answers.question45),
    Number(scores.answers.question46),
  ];

  // Add a new row to the sheet
  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `${firstSheet}!A:H`, // Dynamically use the first sheet name
    valueInputOption: 'RAW',
    resource: {
      values: [row],
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

