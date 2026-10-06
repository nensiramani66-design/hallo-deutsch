const vocabBank = [
  ["first","noun","der Anzug","suit"],
  ["first","noun","der Apfelstrudel","apple cake"],
  ["first","noun","die Autobahn","highway"],
  ["first","language","Bulgarisch","Bulgarian"],
  ["first","noun","das Butterbrot","sandwich"],
  ["first","language","Französisch","French"],
  ["first","noun","das Frühstück","breakfast"],
  ["first","adjective","international","international"],
  ["first","language","Italienisch","Italian"],
  ["first","language","Japanisch","Japanese"],
  ["first","noun","der/die Kranke","sick person"],
  ["first","noun","der Rucksack","backpack"],
  ["first","language","Russisch","Russian"],
  ["first","language","Türkisch","Turkish"],
  ["first","language","Ungarisch","Hungarian"],
  ["first","noun","der Walzer","waltz"],
  ["first","noun","das Würstchen / Würstel","sausage"],
  ["first","verb","zuordnen","to assign"],
  ["first","adjective","andere","other"],
  ["first","verb","kennen","to know someone"],
  ["first","verb","sammeln","to collect"],

  ["greetings","phrase","Bis bald!","See you soon!"],
  ["greetings","phrase","danke","thank you"],
  ["greetings","pronoun","dir","you (informal, dative)"],
  ["greetings","pronoun","du","you (informal)"],
  ["greetings","noun","die Entschuldigung","apology"],
  ["greetings","pronoun","es","it"],
  ["greetings","verb","gehen","to go"],
  ["greetings","adjective","gut","good"],
  ["greetings","phrase","Hallo!","hello"],
  ["greetings","verb","heißen","to be called"],
  ["greetings","verb","hören","to hear"],
  ["greetings","pronoun","ich","I"],
  ["greetings","noun","die Person","person"],
  ["greetings","adjective","sehr","very"],
  ["greetings","phrase","Tschüs!","bye"],
  ["greetings","conjunction","und","and"],
  ["greetings","pronoun","wer?","who?"],
  ["greetings","pronoun","wie?","how?"],
  ["greetings","phrase","Wie geht's?","How are you?"],
  ["greetings","adjective","auch","also"],
  ["greetings","verb","sein","to be"],
  ["greetings","phrase","Auf Wiedersehen!","goodbye"],
  ["greetings","pronoun","das","this / that"],
  ["greetings","noun","die Frau","woman"],
  ["greetings","phrase","Gute Nacht!","good night"],
  ["greetings","phrase","Guten Abend!","good evening"],
  ["greetings","phrase","Guten Morgen!","good morning"],
  ["greetings","phrase","Guten Tag!","good day / hello"],
  ["greetings","noun","der Herr","gentleman"],
  ["greetings","pronoun","Ihnen","you (formal, dative)"],
  ["greetings","noun","die Kollegin","female colleague"],
  ["greetings","pronoun","mein / meine","my"],
  ["greetings","noun","der Name","name"],
  ["greetings","pronoun","Sie","you (formal)"],
  ["greetings","noun","der Dialog","dialogue"],

  ["introductions","noun","die Antwort","answer"],
  ["introductions","preposition","aus","from"],
  ["introductions","language","Deutsch","German"],
  ["introductions","place","Deutschland","Germany"],
  ["introductions","language","Englisch","English"],
  ["introductions","preposition","in","in"],
  ["introductions","verb","kommen","to come from"],
  ["introductions","noun","der Reiseführer","travel guide"],
  ["introductions","language","Spanisch","Spanish"],
  ["introductions","verb","sprechen","to speak"],
  ["introductions","noun","das Telefon","telephone"],
  ["introductions","pronoun","welche? / welches?","which?"],
  ["introductions","pronoun","wo?","where?"],
  ["introductions","pronoun","woher?","from where?"],
  ["introductions","verb","wohnen","to live"],
  ["introductions","pronoun","sie","she"],
  ["introductions","pronoun","er","he"],
  ["introductions","verb","ergänzen","to complete"],
  ["introductions","noun","die Hausnummer","house number"],
  ["introductions","noun","die Postleitzahl","postal code"],
  ["introductions","noun","die Webseite","website"],
  ["introductions","noun","das Interview","interview"],
  ["introductions","verb","notieren","to note down"],
  ["introductions","noun","der Partner","male partner"],
  ["introductions","noun","die Partnerin","female partner"],
  ["introductions","verb","raten","to guess"],
  ["introductions","verb","vorstellen","to introduce"],

  ["world","noun","der Buchstabe","letter"],
  ["world","adjective","laut","loud / loudly"],
  ["world","noun","die Zahl","number"],
  ["world","verb","fragen","to ask"],
  ["world","noun","die Handynummer","cell phone number"],
  ["world","pronoun","Ihr / Ihre","your (formal) / her"],
  ["world","noun","die Telefonnummer","telephone number"],
  ["world","noun","das Alphabet","alphabet"],
  ["world","adjective","erst","first"],
  ["world","verb","schreiben","to write"],
  ["world","phrase","bitte","please"],
  ["world","verb","buchstabieren","to spell"],
  ["world","pronoun","dein / deine","your (informal)"],
  ["world","adjective","ein bisschen","a little"],
  ["world","noun","die E-Mail-Adresse","email address"],
  ["world","verb","können","to be able to"],
  ["world","adjective","langsam","slowly"],
  ["world","adjective","nicht","not"],
  ["world","phrase","noch einmal","once more"],
  ["world","verb","variieren","to vary"],
  ["world","verb","verstehen","to understand"],
  ["world","phrase","Wie bitte?","Come again?"],
  ["world","language","Arabisch","Arabic"],
  ["world","place","China","China"],
  ["world","language","Chinesisch","Chinese"],
  ["world","verb","lernen","to learn"],
  ["world","place","Österreich","Austria"],
  ["world","noun","die Tabelle","table / chart"],
  ["world","place","die USA","the USA"],
  ["world","place","Frankreich","France"],
  ["world","place","Großbritannien","Great Britain"],
  ["world","place","Italien","Italy"],
  ["world","place","Japan","Japan"],
  ["world","noun","das Land","country"],
  ["world","place","Polen","Poland"],
  ["world","language","Polnisch","Polish"],
  ["world","language","Rätoromanisch","Romansh"],
  ["world","place","Russland","Russia"],
  ["world","place","die Schweiz","Switzerland"],
  ["world","place","Spanien","Spain"],
  ["world","noun","die Sprache","language"],
  ["world","place","die Türkei","Turkey"],
  ["world","place","Schweden","Sweden"],
  ["world","place","die Ukraine","Ukraine"],
  ["world","noun","die E-Mail","email"],
  ["world","place","Portugal","Portugal"],
  ["world","place","Griechenland","Greece"],
  ["world","language","Griechisch","Greek"],
  ["world","place","Irland","Ireland"],
  ["world","place","Kanada","Canada"],
  ["world","language","Maori","Maori"],
  ["world","place","Mexiko","Mexico"],
  ["world","place","Neuseeland","New Zealand"],
  ["world","language","Portugiesisch","Portuguese"],
  ["world","language","Schwedisch","Swedish"],
  ["world","place","Syrien","Syria"],
  ["world","language","Thai","Thai"],
  ["world","place","Thailand","Thailand"],
  ["world","noun","der Film","film / movie"],
  ["world","adjective","klar","clear"]
];

const labels = {
  en: { first:"First words", greetings:"Greetings & goodbyes", introductions:"Names & introductions", world:"Letters & the world", question:"Choose the German word for", correct:"Correct!", wrong:"Good try. The green answer is correct.", next:"Next word", last:"Finish set", complete:"Word set complete!", correctCount:"correct", of:"Question", back:"Back to home" },
  de: { first:"Erste Wörter", greetings:"Grüßen & verabschieden", introductions:"Namen & Vorstellungen", world:"Buchstaben & die Welt", question:"Wähle das deutsche Wort für", correct:"Richtig!", wrong:"Guter Versuch. Die grüne Antwort ist richtig.", next:"Nächstes Wort", last:"Set beenden", complete:"Wortbereich geschafft!", correctCount:"richtig", of:"Frage", back:"Zurück zur Startseite" }
};
let language = "en";
let activeSet = "first";
let questionIndex = 0;
let score = 0;
let answered = false;
let currentOptions = [];

const setCards = Array.from(document.querySelectorAll(".set-card"));
const answerGrid = document.getElementById("answerGrid");
const questionTitle = document.getElementById("question-title");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");
const questionBlock = document.getElementById("questionBlock");
const completion = document.getElementById("completion");

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function itemsForSet(set) {
  return vocabBank.filter((item) => item[0] === set);
}

function renderQuestion() {
  const items = itemsForSet(activeSet);
  const item = items[questionIndex];
  if (!item) return;
  answered = false;
  const [set, type, german, english] = item;
  document.getElementById("activeSetLabel").textContent = labels[language][set];
  document.getElementById("questionCount").textContent = labels[language].of + " " + (questionIndex + 1) + " / " + items.length;
  document.getElementById("scoreCount").textContent = score + " " + labels[language].correctCount;
  document.querySelector(".question-instruction").textContent = labels[language].question;
  questionTitle.textContent = "“" + english + "”";
  document.querySelector("#practice .next-button span:first-child").textContent =
    questionIndex === items.length - 1 ? labels[language].last : labels[language].next;

  const sameKind = vocabBank.filter((other) => other[1] === type && other[2] !== german);
  let distractors = shuffle(sameKind.filter((other) => other[0] === set));
  if (distractors.length < 3) distractors = shuffle(sameKind);
  const choices = shuffle([item, ...distractors.slice(0, 3)]);
  currentOptions = choices;
  answerGrid.replaceChildren();
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = '<span></span><span class="answer-mark" aria-hidden="true"></span>';
    button.querySelector("span").textContent = choice[2];
    button.addEventListener("click", () => chooseAnswer(choice, button));
    answerGrid.append(button);
  });
  feedback.hidden = true;
  feedback.className = "feedback";
  nextButton.disabled = true;
  const progress = Math.round((questionIndex / items.length) * 100);
  document.getElementById("progressFill").style.width = progress + "%";
  document.querySelector(".progress-track").setAttribute("aria-valuenow", String(progress));
  questionBlock.hidden = false;
  completion.hidden = true;
  document.querySelector(".quiz-bottom").hidden = false;
}

function chooseAnswer(choice, selectedButton) {
  if (answered) return;
  answered = true;
  const isCorrect = choice[2] === currentOptions[0][2] && choice[0] === activeSet && choice[3] === questionTitle.textContent.slice(1, -1);
  // The correct option is the vocabulary row matching the displayed English prompt.
  const prompt = questionTitle.textContent.slice(1, -1);
  const correctItem = itemsForSet(activeSet)[questionIndex];
  const correct = choice[2] === correctItem[2];
  if (correct) score++;
  Array.from(answerGrid.children).forEach((button) => {
    const isRight = button.querySelector("span").textContent === correctItem[2];
    button.disabled = true;
    if (isRight && (!correct || button === selectedButton)) {
      button.classList.add("is-correct");
      button.querySelector(".answer-mark").textContent = "✓";
      button.setAttribute("aria-pressed", button === selectedButton ? "true" : "false");
    } else if (!correct) {
      button.classList.add("is-wrong");
      button.querySelector(".answer-mark").textContent = "×";
    } else {
      button.setAttribute("aria-pressed", "false");
    }
  });
  feedback.hidden = false;
  feedback.className = "feedback" + (correct ? "" : " is-wrong");
  feedback.innerHTML = '<span class="feedback-icon" aria-hidden="true"></span><span></span>';
  feedback.querySelector(".feedback-icon").textContent = correct ? "✓" : "×";
  feedback.querySelector("span:last-child").textContent = correct ? labels[language].correct : labels[language].wrong + " " + correctItem[2] + " = " + correctItem[3] + ".";
  document.getElementById("scoreCount").textContent = score + " " + labels[language].correctCount;
  nextButton.disabled = false;
}

function selectSet(set) {
  activeSet = set;
  questionIndex = 0;
  score = 0;
  setCards.forEach((card) => card.classList.toggle("is-selected", card.dataset.set === set));
  renderQuestion();
}

setCards.forEach((card) => {
  const count = itemsForSet(card.dataset.set).length;
  card.querySelector("[data-count]").textContent = count + " words";
  card.addEventListener("click", () => selectSet(card.dataset.set));
});

nextButton.addEventListener("click", () => {
  const items = itemsForSet(activeSet);
  if (!answered) return;
  if (questionIndex < items.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    finishSet();
  }
});

function finishSet() {
  questionBlock.hidden = true;
  completion.hidden = false;
  document.querySelector(".quiz-bottom").hidden = true;
  document.getElementById("progressFill").style.width = "100%";
  document.querySelector(".progress-track").setAttribute("aria-valuenow", "100");
  document.getElementById("questionCount").textContent = labels[language].complete;
  document.getElementById("finalScore").textContent = score + " / " + itemsForSet(activeSet).length + " " + labels[language].correctCount;
  document.getElementById("scoreCount").textContent = score + " " + labels[language].correctCount;
}

document.getElementById("restartButton").addEventListener("click", () => {
  questionIndex = 0;
  score = 0;
  renderQuestion();
});

document.getElementById("language").addEventListener("change", (event) => {
  language = event.target.value;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-en][data-de]").forEach((node) => {
    node.textContent = node.dataset[language];
  });
  document.querySelectorAll("[data-placeholder-en][data-placeholder-de]").forEach((node) => {
    node.placeholder = node.dataset["placeholder" + (language === "en" ? "En" : "De")];
  });
  if (!completion.hidden) {
    document.getElementById("questionCount").textContent = labels[language].complete;
    document.querySelector("#completion h2").textContent = labels[language].complete;
    document.getElementById("restartButton").textContent = language === "en" ? "Practise again" : "Noch einmal üben";
  } else {
    renderQuestion();
  }
});
renderQuestion();
