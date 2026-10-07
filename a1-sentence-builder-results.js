(() => {
  "use strict";
  const root = document.getElementById("sb-review-list");
  const summaryNode = document.getElementById("sb-review-summary");
  let summary = null;
  try { summary = JSON.parse(sessionStorage.getItem("a1SentenceBuilderResults") || "null"); } catch (error) {}
  if (!summary || !Array.isArray(summary.questions)) {
    summaryNode.textContent = "Your review is not available in this tab yet. Start the game and complete its questions to see your answers here.";
    root.hidden = true;
    return;
  }
  summaryNode.textContent = "Final score: " + (Number(summary.score) || 0) + " points";
  summary.questions.forEach((item) => {
    const card = document.createElement("article");
    const wrong = Array.isArray(item.wrongAttempts) ? item.wrongAttempts : [];
    const state = wrong.length ? "mistake" : item.answeredCorrectly ? "correct" : "unanswered";
    card.className = "sb-review-card is-" + state;
    const label = document.createElement("p");
    label.className = "sb-review-number";
    label.textContent = "QUESTION " + item.number + " OF 16";
    card.appendChild(label);
    const prompt = document.createElement("h2");
    prompt.textContent = item.prompt;
    card.appendChild(prompt);
    if (wrong.length) {
      wrong.forEach((attempt, index) => {
        const wrongLine = document.createElement("p");
        wrongLine.className = "sb-review-wrong";
        const wrongLabel = document.createElement("span");
        wrongLabel.textContent = wrong.length > 1 ? "Your attempt " + (index + 1) : "Your attempt";
        const wrongText = document.createElement("strong");
        wrongText.textContent = attempt;
        wrongLine.append(wrongLabel, wrongText);
        card.appendChild(wrongLine);
      });
      const correctLine = document.createElement("p");
      correctLine.className = "sb-review-correct";
      const correctLabel = document.createElement("span");
      correctLabel.textContent = "Correct sentence";
      const correctText = document.createElement("strong");
      correctText.textContent = item.correctSentence;
      correctLine.append(correctLabel, correctText);
      card.appendChild(correctLine);
    } else if (item.answeredCorrectly) {
      const correctText = document.createElement("p");
      correctText.className = "sb-review-correct-only";
      correctText.textContent = item.correctSentence;
      card.appendChild(correctText);
    } else {
      const unanswered = document.createElement("p");
      unanswered.className = "sb-review-unanswered";
      unanswered.textContent = "Not answered yet";
      card.appendChild(unanswered);
      const answer = document.createElement("p");
      answer.className = "sb-review-model";
      answer.textContent = "Correct sentence: " + item.correctSentence;
      card.appendChild(answer);
    }
    root.appendChild(card);
  });
})();