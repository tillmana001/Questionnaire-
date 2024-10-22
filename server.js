const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ExcelJS = require('exceljs'); // Import ExcelJS
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

// Function to write results to an Excel file
async function writeResultsToExcel(scores) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Survey Results');

  // Add column headers if this is the first entry
  const filePath = 'SurveyResults.xlsx';
  if (require('fs').existsSync(filePath)) {
    // If the file already exists, load it
    await workbook.xlsx.readFile(filePath);
    sheet = workbook.getWorksheet('Survey Results');
  } else {
    // Add column headers
    sheet.columns = [
      { header: 'User Name', key: 'userName' },
      { header: 'Attention to Detail', key: 'attentionToDetail' },
      { header: 'Continuous Learning', key: 'continuousLearning' },
      { header: 'Communication', key: 'communication' },
      { header: 'Integrity', key: 'integrity' },
      { header: 'Reliability', key: 'reliability' },
      { header: 'Teamwork', key: 'teamwork' },
      { header: 'Answers', key: 'answers' }
    ];
  }

  // Add a row with the scores
  await sheet.addRow({
    userName: scores.userName,
    attentionToDetail: scores.attentionToDetail,
    continuousLearning: scores.continuousLearning,
    communication: scores.communication,
    integrity: scores.integrity,
    reliability: scores.reliability,
    teamwork: scores.teamwork,
    answers: JSON.stringify(scores.answers) // Convert individual answers to a string
  });

  // Save the workbook
  await workbook.xlsx.writeFile(filePath);
}

// Route to handle form submission
app.post('/send', async (req, res) => {
  const scores = req.body;
  const { userName } = scores;
  console.log('Received scores:', scores);

  // Write results to Excel
  try {
    await writeResultsToExcel(scores);
    res.status(200).send('Survey results saved successfully');
  } catch (error) {
    console.error('Error writing to Excel:', error);
    res.status(500).send('Error saving to Excel');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
