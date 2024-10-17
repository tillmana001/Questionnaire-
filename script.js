const button = document.getElementById("submit");

button.addEventListener("click", scoreMe);

async function scoreMe() {
  const form = document.getElementById("ruskin");

  const questionGroups = [
    "question1", "question2", "question3", "question4", "question5", "question6", "question7", "question8", "question9", "question10", 
    "question11", "question12", "question13", "question14", "question15", "question16", "question17", "question18", "question19", 
    "question20", "question21", "question22", "question23", "question24", "question25", "question26", "question27", "question28", 
    "question29", "question30", "question31", "question32", "question33", "question34", "question35", "question36", "question37", 
    "question38", "question39", "question40"
  ];

  let allAnswered = true;

  questionGroups.forEach((question) => {
    const selectedAnswer = form.querySelector(`input[name="${question}"]:checked`);
    if (!selectedAnswer) {
      allAnswered = false;
    }
  });

  if (!allAnswered) {
    alert('Please answer all questions before submitting.');
    return;
  }

  let results = {
    userName: document.getElementById("name").value, // Ensure this matches your HTML ID for the user's name input
    attentionToDetail: 0,
    continuousLearning: 0,
    communication: 0,
    integrity: 0,
    reliability: 0,
    teamwork: 0,
  };

  const questionValues = {
    attentionToDetail: ["question1", "question6", "question8", "question11", "question22", "question26", "question33"],
    continuousLearning: ["question3", "question7", "question13", "question19", "question24", "question27", "question34"],
    communication: ["question2", "question12", "question16", "question21", "question31", "question38", "question39"],
    integrity: ["question15", "question20", "question30", "question37"],
    reliability: ["question4", "question9", "question18", "question25", "question29", "question32", "question40", "question35"],
    teamwork: ["question5", "question10", "question14", "question17", "question23", "question28", "question36"],
  };

  // Calculate scores
  for (let value in questionValues) {
    questionValues[value].forEach((question) => {
      const answer = form.querySelector(`input[name="${question}"]:checked`);
      if (answer) {
        results[value] += parseInt(answer.value);
      }
    });
  }

  // Send scores to the server
  try {
    const response = await fetch('/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results), // Send the scores as JSON
    });

    if (response.ok) {
      // Show thank you message to the candidate
      alert('Thank you for taking our questionnaire. Your response has been submitted.');
      form.reset(); // Optional: reset the form after submission
    } else {
      alert('Failed to submit scores.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the scores.');
  }
}

