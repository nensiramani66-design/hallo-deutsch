(() => {
  "use strict";
  const chapters = [
    {
      title: "Meet your neighbor",
      note: "Say hello, introduce yourself, and ask a simple question.",
      caption: "Lea has just moved in and is meeting her neighbor Sam.",
      alt: "Lea greets her new neighbor Sam at her apartment doorway.",
      desktop: "assets/sentence-builder/scene-1-desktop.png",
      phone: "assets/sentence-builder/scene-1-phone.png",
      tasks: [
        {prompt:"Tell Sam: “My name is Lea.”",tokens:["Ich","heiße","Lea."],extra:["wohnt"],hint:"Start with “Ich”. With ich, heißen becomes heiße.",feedback:"The subject is ich, so the verb is heiße."},
        {prompt:"Tell Sam: “I come from Spain.”",tokens:["Ich","komme","aus","Spanien."],extra:["wohne"],hint:"Use Ich + komme + aus + the country.",feedback:"Kommt is used with er/sie/es and ihr. With ich, use komme."},
        {prompt:"Tell Sam: “I live in Berlin now.”",tokens:["Ich","wohne","jetzt","in","Berlin."],extra:["komme"],accepted:["Jetzt wohne ich in Berlin."],hint:"Start with Ich, then the verb wohne. Add jetzt and the place.",feedback:"In a simple statement, the conjugated verb follows the subject."},
        {prompt:"Ask Sam: “Where do you live?”",tokens:["Wo","wohnst","du?"],extra:["wohnt"],hint:"A W-question starts with Wo. Put the conjugated verb before du.",feedback:"In a W-question, the question word comes first, then the verb, then the subject."}
      ]
    },
    {
      title: "Describe your new home",
      note: "Name rooms and furniture, then describe them with a simple adjective.",
      caption: "Lea shows Sam the rooms and furniture in her new apartment.",
      alt: "Lea shows Sam the bright living room in her new apartment.",
      desktop: "assets/sentence-builder/scene-2-desktop.png",
      phone: "assets/sentence-builder/scene-2-phone.png",
      tasks: [
        {prompt:"Say: “My room is bright.”",tokens:["Mein","Zimmer","ist","hell."],extra:["helles"],hint:"Zimmer is neuter: Mein Zimmer. Use ist before the description.",feedback:"The noun Zimmer is neuter, so the possessive is Mein."},
        {prompt:"Say: “The kitchen is big.”",tokens:["Die","Küche","ist","groß."],extra:["große"],hint:"Start with the noun group Die Küche, then ist, then the adjective.",feedback:"After ist, this adjective stays unchanged: groß."},
        {prompt:"Say: “I have a table.”",tokens:["Ich","habe","einen","Tisch."],extra:["ein"],hint:"Tisch is masculine. As the object of habe, use einen Tisch.",feedback:"Tisch is masculine and is the direct object, so use einen."},
        {prompt:"Say: “The sofa is in the living room.”",tokens:["Das","Sofa","ist","im","Wohnzimmer."],extra:["Wohnzimmer"],hint:"Use Das Sofa + ist + im Wohnzimmer.",feedback:"Im is the common contraction of in dem."}
      ]
    },
    {
      title: "Talk about your routine",
      note: "Add days and times. The conjugated verb still belongs in position two.",
      caption: "Lea and Sam compare their weekly schedules at home.",
      alt: "Lea writes in a blank weekly calendar while Sam looks on.",
      desktop: "assets/sentence-builder/scene-3-desktop.png",
      phone: "assets/sentence-builder/scene-3-phone.png",
      tasks: [
        {prompt:"Say: “I learn German every day.”",tokens:["Ich","lerne","jeden","Tag","Deutsch."],extra:["lernt"],accepted:["Jeden Tag lerne ich Deutsch."],hint:"Start with Ich and use the ich form lerne.",feedback:"The subject ich needs lerne; Tag is a noun and starts with a capital letter."},
        {prompt:"Say: “I work on Monday.”",tokens:["Am","Montag","arbeite","ich."],extra:["arbeitet"],accepted:["Ich arbeite am Montag."],hint:"When Am Montag comes first, the conjugated verb still comes second.",feedback:"Am Montag is the first phrase; arbeite is the second element, before ich."},
        {prompt:"Say: “I get up at seven.”",tokens:["Um","sieben","Uhr","stehe","ich","auf."],extra:["steht"],accepted:["Ich stehe um sieben Uhr auf."],hint:"Aufstehen is separable: stehe goes in position two and auf goes at the end.",feedback:"With the separable verb aufstehen, its prefix auf goes at the end."},
        {prompt:"Ask: “When does your course begin?”",tokens:["Wann","beginnt","dein","Kurs?"],extra:["beginnen"],hint:"Start with Wann, then the verb beginnt, then the subject dein Kurs.",feedback:"Kurs is singular, so begin is conjugated as beginnt."}
      ]
    },
    {
      title: "Make plans together",
      note: "Ask for help and make a friendly weekend plan with a modal verb.",
      caption: "Lea and Sam look at a blank calendar and make a weekend plan.",
      alt: "Lea and Sam plan a weekend together while looking at a blank calendar.",
      desktop: "assets/sentence-builder/scene-4-desktop.png",
      phone: "assets/sentence-builder/scene-4-phone.png",
      tasks: [
        {prompt:"Say: “I have time on Saturday.”",tokens:["Am","Samstag","habe","ich","Zeit."],extra:["hat"],accepted:["Ich habe am Samstag Zeit."],hint:"Start with Am Samstag. The conjugated verb habe comes next.",feedback:"The time phrase is first, so habe must stay in position two."},
        {prompt:"Ask Sam: “Can you help me?”",tokens:["Kannst","du","mir","helfen?"],extra:["kann"],hint:"In a yes/no question, the conjugated verb comes first. The infinitive helfen goes last.",feedback:"Kannst matches du. With a modal verb, helfen stays in the infinitive at the end."},
        {prompt:"Answer: “Yes, I can help you.”",tokens:["Ja,","ich","kann","dir","helfen."],extra:["hilfst"],hint:"After Ja, use ich + kann. Put the infinitive helfen at the end.",feedback:"The modal kann is conjugated; helfen remains at the end in the infinitive."},
        {prompt:"Suggest: “We can go for a walk on Sunday.”",tokens:["Wir","können","am","Sonntag","spazieren","gehen."],extra:["geht"],accepted:["Am Sonntag können wir spazieren gehen."],hint:"Use Wir + können, then the time phrase. The two infinitives go at the end.",feedback:"With können, the other verbs stay in the infinitive at the end: spazieren gehen."}
      ]
    }
  ];

  const allTasks = [];
  chapters.forEach((chapter, chapterIndex) => {
    chapter.tasks.forEach((task) => allTasks.push({chapterIndex, task}));
  });
  const startPanel = document.getElementById("sb-start");
  const board = document.getElementById("sb-board");
  const results = document.getElementById("sb-results");
  const source = document.getElementById("sb-phone-source");
  const image = document.getElementById("sb-scene-image");
  const bankNode = document.getElementById("sb-word-bank");
  const answerNode = document.getElementById("sb-answer-zone");
  const promptNode = document.getElementById("sb-prompt");
  const feedbackNode = document.getElementById("sb-feedback");
  const hintNode = document.getElementById("sb-hint");
  const correctionNode = document.getElementById("sb-correction");
  const wrongAnswerNode = document.getElementById("sb-wrong-answer");
  const attemptTextNode = document.getElementById("sb-attempt-text");
  const correctTextNode = document.getElementById("sb-correct-text");
  const explainLink = document.getElementById("sb-explain-link");
  const scored = new Set();
  let current = 0;
  let points = 0;
  let attempts = 0;
  let bank = [];
  let answer = [];
  let hintShown = false;
  let locked = false;

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = items[i]; items[i] = items[j]; items[j] = temp;
    }
    return items;
  }

  function setFeedback(message, wrong) {
    feedbackNode.textContent = message;
    feedbackNode.classList.toggle("is-wrong", Boolean(wrong));
    feedbackNode.hidden = false;
  }

  function clearCorrection() {
    correctionNode.hidden = true;
    wrongAnswerNode.hidden = true;
    answerNode.classList.remove("is-wrong", "is-correct");
  }

  function showCorrection(built, correct, model) {
    correctionNode.hidden = false;
    wrongAnswerNode.hidden = correct;
    attemptTextNode.textContent = built;
    correctTextNode.textContent = model;
    explainLink.href = "a1-sentence-builder-guide.html#sentence-" + (current + 1);
    answerNode.classList.toggle("is-wrong", !correct);
    answerNode.classList.toggle("is-correct", correct);
  }

  function renderTiles() {
    answerNode.replaceChildren();
    if (!answer.length) {
      const empty = document.createElement("span");
      empty.className = "sb-empty-note";
      empty.textContent = "Your sentence will appear here.";
      answerNode.appendChild(empty);
    }
    answer.forEach((tile, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sb-tile";
      button.textContent = tile.word;
      button.setAttribute("aria-label", tile.word + ", remove from sentence");
      button.dataset.answerIndex = String(index);
      button.addEventListener("click", () => {
        if (locked) return;
        bank.push(answer.splice(index, 1)[0]);
        renderTiles();
      });
      answerNode.appendChild(button);
    });
    bankNode.replaceChildren();
    bank.forEach((tile, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sb-tile";
      button.textContent = tile.word;
      button.dataset.bankIndex = String(index);
      button.addEventListener("click", () => {
        if (locked) return;
        answer.push(bank.splice(index, 1)[0]);
        renderTiles();
      });
      bankNode.appendChild(button);
    });
    document.getElementById("sb-check-button").disabled = locked || answer.length === 0;
  }

  function renderQuestion() {
    if (current >= allTasks.length) { finish(); return; }
    const item = allTasks[current];
    const chapter = chapters[item.chapterIndex];
    const task = item.task;
    document.getElementById("sb-round").textContent = "Sentence " + (current + 1) + " of " + allTasks.length;
    document.getElementById("sb-score").textContent = "Score: " + points;
    const progress = Math.round((current / allTasks.length) * 100);
    document.getElementById("sb-progress").style.width = progress + "%";
    document.getElementById("sb-progressbar").setAttribute("aria-valuenow", String(current));
    document.getElementById("sb-chapter-label").textContent = "CHAPTER " + (item.chapterIndex + 1) + " OF " + chapters.length;
    document.getElementById("sb-chapter-title").textContent = chapter.title;
    document.getElementById("sb-chapter-note").textContent = chapter.note;
    document.getElementById("sb-scene-caption").textContent = chapter.caption;
    source.srcset = chapter.phone;
    image.src = chapter.desktop;
    image.alt = chapter.alt;
    promptNode.textContent = task.prompt;
    answer = [];
    bank = shuffle(task.tokens.concat(task.extra).map((word, index) => ({word, id:index})));
    attempts = 0;
    hintShown = false;
    locked = false;
    hintNode.hidden = true;
    hintNode.textContent = task.hint;
    document.getElementById("sb-hint-button").setAttribute("aria-expanded","false");
    document.getElementById("sb-next-button").hidden = true;
    document.getElementById("sb-retry-button").hidden = true;
    document.getElementById("sb-previous-button").hidden = current === 0;
    document.getElementById("sb-check-button").hidden = false;
    feedbackNode.hidden = true;
    clearCorrection();
    renderTiles();
  }

  function finish() {
    board.hidden = true;
    results.hidden = false;
    document.getElementById("sb-progress").style.width = "100%";
    document.getElementById("sb-progressbar").setAttribute("aria-valuenow", String(allTasks.length));
    document.getElementById("sb-final-score").textContent = points + " points";
    document.getElementById("sb-result-title").textContent = points >= 120 ? "You built a strong first-week conversation!" : "You built your first conversation!";
    document.getElementById("sb-result-copy").textContent = "You completed all four chapters: introductions, your home, daily routines, and making plans. Replay any time to practise the sentence patterns again.";
  }

  function restart() {
    current = 0;
    points = 0;
    scored.clear();
    results.hidden = true;
    startPanel.hidden = true;
    board.hidden = false;
    renderQuestion();
  }

  document.getElementById("sb-start-button").addEventListener("click", restart);
  document.getElementById("sb-reset-button").addEventListener("click", () => {
    if (locked) return;
    bank = shuffle(answer.concat(bank));
    answer = [];
    feedbackNode.hidden = true;
    clearCorrection();
    document.getElementById("sb-check-button").hidden = false;
    document.getElementById("sb-retry-button").hidden = true;
    document.getElementById("sb-next-button").hidden = true;
    locked = false;
    renderTiles();
  });
  document.getElementById("sb-hint-button").addEventListener("click", (event) => {
    const opening = hintNode.hidden;
    hintNode.hidden = !opening;
    event.currentTarget.setAttribute("aria-expanded", String(opening));
    hintShown = hintShown || opening;
  });
  document.getElementById("sb-retry-button").addEventListener("click", () => {
    bank = shuffle(answer.concat(bank));
    answer = [];
    locked = false;
    feedbackNode.hidden = true;
    clearCorrection();
    document.getElementById("sb-check-button").hidden = false;
    document.getElementById("sb-retry-button").hidden = true;
    document.getElementById("sb-next-button").hidden = true;
    renderTiles();
  });
  document.getElementById("sb-previous-button").addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      renderQuestion();
    }
  });
  document.getElementById("sb-check-button").addEventListener("click", () => {
    if (locked || !answer.length) return;
    const task = allTasks[current].task;
    const built = answer.map((tile) => tile.word).join(" ");
    const target = task.tokens.join(" ");
    const normalized = built.trim().toLocaleLowerCase("de-DE");
    const accepted = (task.accepted || []).find((sentence) => sentence.toLocaleLowerCase("de-DE") === normalized);
    const isCorrect = built === target || Boolean(accepted);
    if (isCorrect) {
      locked = true;
      if (!scored.has(current)) {
        points += (attempts === 0 && !hintShown) ? 10 : 5;
        scored.add(current);
      }
      const model = accepted || target;
      setFeedback("Correct! " + task.feedback, false);
      showCorrection(built, true, model);
      document.getElementById("sb-check-button").hidden = true;
      document.getElementById("sb-retry-button").hidden = true;
      document.getElementById("sb-next-button").hidden = false;
      document.getElementById("sb-score").textContent = "Score: " + points;
      renderTiles();
    } else {
      attempts += 1;
      locked = true;
      setFeedback("Not quite. Compare your sentence with the correct version below, then try again or continue.", true);
      showCorrection(built, false, target);
      document.getElementById("sb-check-button").hidden = true;
      document.getElementById("sb-retry-button").hidden = false;
      document.getElementById("sb-next-button").hidden = false;
      renderTiles();
    }
  });
  document.getElementById("sb-next-button").addEventListener("click", () => {
    current += 1;
    renderQuestion();
  });
  document.getElementById("sb-replay-button").addEventListener("click", restart);
})();