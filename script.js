let startTime = Date.now();

const button = document.getElementById("submit");
button.addEventListener("click", scoreMe);

async function scoreMe() {
  const form = document.getElementById("ruskin");

  const questionGroups = [
    "question1", "question2", "question3", "question4", "question5", 
    "question6", "question7", "question8", "question9", "question10", 
    "question11", "question12", "question13", "question14", "question15", 
    "question16", "question17", "question18", "question19", "question20", 
    "question21", "question22", "question23", "question24", "question25", 
    "question26", "question27", "question28", "question29", "question30", 
    "question31", "question32", "question33", "question34", "question35", 
    "question36", "question37", "question38", "question39", "question40",
    "question41","question42", "question43", "question44", "question45",
    "question46",
  ];
  
  // Validate name field
  const userName = document.getElementById("name").value.trim();
  if (!userName) {
    alert("Please fill out your name before submitting.");
    return;
  }

  // Check if all questions are answered and collect answers
  let allAnswered = true;
  const individualAnswers = {};
  const selectedAnswers = {};

  questionGroups.forEach((question) => {
    const answer = form.querySelector(`input[name="${question}"]:checked`);
    selectedAnswers[question] = answer;
    if (!answer) allAnswered = false;
    else individualAnswers[question] = answer.value;
  });

  if (!allAnswered) {
    alert("Please answer all questions before submitting.");
    return;
  }
  // Initialize results object
  let results = {
    userName: document.getElementById("name").value, // Ensure this matches your HTML ID for the user's name input
    overallScore: 0, // Placeholder, will calculate and update below
    attentionToDetail: 0,
    continuousLearning: 0,
    communication: 0,
    integrity: 0,
    reliability: 0,
    teamwork: 0,
    answers: individualAnswers // Add individual answers to the results object
  };

  // Mapping of question groups to their respective scores
  const questionValues = {
    attentionToDetail: ["question1", "question6", "question8", "question11", "question22", "question26", "question33", "question41"],
    continuousLearning: ["question3", "question7", "question13", "question19", "question24", "question27", "question34", "question42"],
    communication: ["question2", "question12", "question16", "question21", "question31", "question38", "question39", "question43"],
    integrity: ["question15", "question20", "question30", "question37", "question44"],
    reliability: ["question4", "question9", "question18", "question25", "question29", "question32", "question35", "question40", "question45"],
    teamwork: ["question5", "question10", "question14", "question17", "question23", "question28", "question36", "question46"],
  };

  // Calculate scores based on selected answers
  for (let value in questionValues) {
    questionValues[value].forEach((question) => {
      const answer = form.querySelector(`input[name="${question}"]:checked`);
      if (answer) {
        results[value] += parseFloat(answer.value); // Add the answer value to the corresponding score
      }
    });
  }
  
  // Calculate the overall score
  results.overallScore = 
    results.attentionToDetail +
    results.continuousLearning +
    results.communication +
    results.integrity +
    results.reliability +
    results.teamwork;

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 60000).toFixed(2); // Converts milliseconds to minutes with 2 decimal places  

  results.duration = duration;
  // Send scores to the server
  try {
    const response = await fetch('/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results), // Send the scores as JSON, including individual answers
    });

    if (response.ok) {
      // Show thank you message to the candidate
      alert('Thank you for taking our questionnaire. Your response has been submitted.');
      form.reset(); // Optional: reset the form after submission
    } else {
      alert('Failed to submit scores. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the scores. Please try again.');
  }
}
