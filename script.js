let startTime = Date.now();

const button = document.getElementById("submit");
button.addEventListener("click", scoreMe);

async function scoreMe() {
  const form = document.getElementById("ruskin");
  
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

  const results = {
    userName,
    duration: ((Date.now() - startTime) / 60000).toFixed(2),
    answers: individualAnswers,
    attentionToDetail: 0,
    continuousLearning: 0,
    communication: 0,
    integrity: 0,
    reliability: 0,
    teamwork: 0,
  };

  for (let value in questionValues) {
    questionValues[value].forEach((question) => {
      const answer = selectedAnswers[question];
      if (answer && !isNaN(parseFloat(answer.value))) {
        results[value] += parseFloat(answer.value);
      }
    });
  }

  try {
    const response = await fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results),
    });

    if (response.ok) {
      alert("Thank you for taking our questionnaire. Your response has been submitted.");
      form.reset();
    } else {
      alert(`Failed to submit scores. Server responded with: ${await response.text()}`);
    }
  } catch (error) {
    console.error("Error while submitting scores:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}
