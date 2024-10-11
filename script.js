const score = document.getElementById("score");
const button = document.getElementById("submit");

button.addEventListener("click", scoreMe);

function tryMe(){
  score.innerText = "hello"
}


function scoreMe() {
  const form = document.getElementById("ruskin");

  let results = {
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
    reliability: ["question4", "question9", "question18", "question25", "question29", "question32"],
    teamwork: ["question5", "question10", "question14", "question17", "question23", "question28", "question36"],
  };

  for (let value in questionValues) {
    questionValues[value].forEach((question) => {
      const answer = form.querySelector(`input[name="${question}"]:checked`);
      if (answer) {
        results[value] += parseInt(answer.value);
      }
    });
  }

  score.innerText = `
    Attention to Detail Score: ${results.attentionToDetail} 
    Continuous Learning Score: ${results.continuousLearning} 
    Communication Score: ${results.communication} 
    Integrity Score: ${results.integrity} 
    Reliability Score: ${results.reliability} 
    Teamwork Score: ${results.teamwork}`;
}
