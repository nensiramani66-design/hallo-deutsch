(() => {
  "use strict";
  const sceneCaptions = {
    introduction: [
      ["Lea meets her new neighbor Sam in a sunny apartment courtyard.", "Lea and Sam talk beside the courtyard mailboxes.", "Lea introduces herself to Sam by the garden gate.", "The neighbors meet on a quiet Berlin residential street.", "Lea and Sam chat at a small community garden table."],
      ["Lea greets her new neighbor Sam.", "They talk by the apartment mailboxes.", "They meet beside the garden gate.", "They get to know each other on their street.", "They talk together in the community garden."]
    ],
    intermediate: [
      ["Two neighbors choose fresh apples and tomatoes at a colorful weekly market.", "They pick up a loaf of bread at a neighborhood bakery stall.", "They compare fruit and ask about the price.", "They choose groceries at a cheerful market checkout.", "They look for a cheese stand near the market entrance."],
      ["Lea and Sam shop together at a lively Berlin market.", "They buy bread at the market bakery.", "They compare fresh fruit at a stall.", "They pay for their groceries at the market.", "They search for cheese in the market plaza."]
    ],
    hard: [
      ["Two safari guides watch an elephant drinking at a river in the Maasai Mara.", "They observe lions resting safely under an acacia tree.", "They spot a giraffe near a tree on the savannah.", "They look for zebras near a watering hole.", "They plan their next wildlife drive at camp."],
      ["The safari guides observe wildlife from a safe distance.", "They watch animals in the Maasai Mara.", "They spot a giraffe beside an acacia tree.", "They look toward zebras at the water.", "They plan a wildlife outing together."]
    ],
    veryHard: [
      ["Two astronauts look at the Moon from their space station.", "The crew prepare for launch in the control room.", "They study a small robot in the station laboratory.", "The astronauts check oxygen tanks before a mission.", "They work together while looking at Earth from orbit."],
      ["The astronauts talk about their mission.", "They prepare the rocket for launch.", "They work together in the station laboratory.", "They check their equipment before departure.", "They watch Earth from the spacecraft."]
    ]
  };
  const scenes = (level, prefix) => Array.from({length:5}, (_,i) => ({
    desktop: `assets/sentence-builder/levels/${prefix}/scene-${i+1}-desktop.webp`,
    phone: `assets/sentence-builder/levels/${prefix}/scene-${i+1}-phone.webp`,
    caption: sceneCaptions[level][0][i],
    alt: sceneCaptions[level][1][i]
  }));
  const levels = {
    introduction: {
      title: "Basic introduction",
      shortTitle: "Introduction",
      subtitle: "Say hello, share a few details, and ask simple questions.",
      theme: "Meet your neighbors",
      label: "FOUNDATION · NEIGHBORHOOD",
      prefix: "intro",
      scenes: scenes("introduction", "intro"),
      tasks: [
        {prompt:"Tell Mia: “My name is Lea.”", target:"Ich heiße Lea.", hint:"Start with Ich. The verb heißen becomes heiße with ich.", note:"The subject Ich comes first. The matching verb heiße comes second."},
        {prompt:"Ask Ben: “What is your name?”", target:"Wie heißt du?", hint:"A question word comes first, followed by the verb and then du.", note:"Wie asks “what/how”; heißt comes before the subject du in this question."},
        {prompt:"Say: “I come from Spain.”", target:"Ich komme aus Spanien.", hint:"Use Ich + komme + aus + the country.", note:"Kommen changes to komme with ich. Aus comes before the country."},
        {prompt:"Ask: “Where are you from?”", target:"Woher kommst du?", hint:"Begin with Woher, then the verb kommst, and finish with du.", note:"In this question, Woher is followed by the verb kommst and then du."},
        {prompt:"Say: “I live in Berlin now.”", target:"Ich wohne jetzt in Berlin.", accepted:["Jetzt wohne ich in Berlin."], hint:"In a simple statement, the conjugated verb follows the subject.", note:"Wohne matches ich. The time and place phrases add when and where."},
        {prompt:"Ask: “Where do you live?”", target:"Wo wohnst du?", hint:"Start with Wo, then use the verb wohnst before du.", note:"A question word comes first; the conjugated verb comes next."},
        {prompt:"Say: “I speak a little German.”", target:"Ich spreche ein bisschen Deutsch.", hint:"Sprechen changes to spreche with ich. Deutsch is capitalized.", note:"The verb spreche matches ich; ein bisschen describes how much German."},
        {prompt:"Say: “I am twenty years old.”", target:"Ich bin zwanzig Jahre alt.", hint:"Use bin with ich. German says the years are old.", note:"Bin is the first-person form of sein. Jahre is a noun and is capitalized."},
        {prompt:"Say: “I like playing tennis.”", target:"Ich spiele gern Tennis.", hint:"Put gern after the verb to say that you enjoy an activity.", note:"Spiele matches ich. Gern means that you like doing the activity."},
        {prompt:"Greet Mia: “Nice to meet you.”", target:"Freut mich.", hint:"This is a common short German expression when meeting someone.", note:"Freut mich is a natural, polite expression meaning “Nice to meet you.”"}
      ]
    },
    intermediate: {
      title: "Intermediate A1",
      shortTitle: "Intermediate",
      subtitle: "Shop at a weekly market, ask for prices, and pay politely.",
      theme: "At the weekly market",
      label: "INTERMEDIATE · MARKET DAY",
      prefix: "market",
      scenes: scenes("intermediate", "market"),
      tasks: [
        {prompt:"Say: “I am buying three apples.”", target:"Ich kaufe drei Äpfel.", hint:"Use the ich form kaufe. Äpfel is the plural of Apfel.", note:"The subject and conjugated verb start the statement; the amount and object follow."},
        {prompt:"Ask the seller: “Do you have fresh tomatoes?”", target:"Haben Sie frische Tomaten?", hint:"A polite yes/no question starts with the verb Haben.", note:"Haben comes first in a yes/no question. Sie is the polite form of “you.”"},
        {prompt:"Ask: “How much does one kilo of bananas cost?”", target:"Was kostet ein Kilo Bananen?", hint:"Begin with Was kostet, then name the amount you are asking about.", note:"Was is the question word; kostet agrees with the singular subject ein Kilo."},
        {prompt:"Order: “I would like one loaf of bread and two rolls, please.”", target:"Ich möchte ein Brot und zwei Brötchen, bitte.", hint:"Möchte is a polite form. Put bitte at the end.", note:"Möchte is a polite request form; ein Brot and zwei Brötchen are the items."},
        {prompt:"Say: “The strawberries are very sweet today.”", target:"Die Erdbeeren sind heute sehr süß.", hint:"Erdbeeren is plural, so use sind.", note:"The plural subject Erdbeeren takes sind. Heute and sehr süß add time and description."},
        {prompt:"Say: “We still need a bottle of water.”", target:"Wir brauchen noch eine Flasche Wasser.", hint:"Brauchen matches wir. Noch means “still” or “another” here.", note:"Brauchen matches wir. Eine agrees with the feminine noun Flasche."},
        {prompt:"Ask: “Can I pay by card?”", target:"Kann ich mit Karte bezahlen?", hint:"In a yes/no question, Kann comes first; the infinitive bezahlen goes last.", note:"Kann is the modal verb. The infinitive bezahlen stays at the end."},
        {prompt:"Say: “The cheese stand is next to the entrance.”", target:"Der Käsestand ist neben dem Eingang.", hint:"After neben for a location, use the dative: dem Eingang.", note:"Neben describes a location here, so Eingang takes the dative form dem."},
        {prompt:"Tell the seller: “I am looking for a small cheese.”", target:"Ich suche einen kleinen Käse.", hint:"Käse is masculine. After suchen, use the accusative form einen kleinen Käse.", note:"Käse is masculine and is the direct object, so the adjective ending is -en."},
        {prompt:"At checkout, say: “That comes to twelve euros altogether.”", target:"Das macht zusammen zwölf Euro.", hint:"This useful checkout phrase begins with Das macht.", note:"Das macht zusammen is a natural phrase for stating the total price."}
      ]
    },
    hard: {
      title: "Hard A1",
      shortTitle: "Hard",
      subtitle: "Describe wildlife, ask questions, and combine details clearly.",
      theme: "Wildlife in the Maasai Mara",
      label: "HARD · SAFARI RESERVE",
      prefix: "safari",
      scenes: scenes("hard", "safari"),
      tasks: [
        {prompt:"Describe the scene: “The elephant is drinking water by the river.”", target:"Der Elefant trinkt Wasser am Fluss.", hint:"Elefant is singular, so use trinkt. Am is short for an dem.", note:"The singular subject takes trinkt. Am Fluss tells where the elephant drinks."},
        {prompt:"Ask: “Where do the lions sleep in the evening?”", target:"Wo schlafen die Löwen am Abend?", hint:"After the question word Wo, use the plural verb schlafen.", note:"Löwen is plural, so the verb is schlafen. The time phrase comes later."},
        {prompt:"Say: “We see a giraffe next to the tree.”", target:"Wir sehen eine Giraffe neben dem Baum.", hint:"Giraffe is feminine, so the object is eine Giraffe. Dem Baum follows neben for a location.", note:"Eine Giraffe is the direct object; neben dem Baum gives the location."},
        {prompt:"Say: “The giraffe eats leaves from a tree.”", target:"Die Giraffe frisst Blätter von einem Baum.", hint:"Frisst is the er/sie form of fressen. Von is followed by the dative.", note:"Frisst matches the singular subject. Von takes the dative: einem Baum."},
        {prompt:"Ask: “Why are the zebras running to the waterhole?”", target:"Warum laufen die Zebras zur Wasserstelle?", hint:"Zebras is plural, so use laufen. Zur means zu der.", note:"The question word comes first, then the plural verb laufen. Zur is zu + der."},
        {prompt:"Say: “Our group is waiting for the ranger.”", target:"Unsere Gruppe wartet auf den Ranger.", hint:"Gruppe is singular. Warten auf takes the accusative: den Ranger.", note:"Gruppe is a singular noun, so use wartet. Auf den Ranger is the object of warten auf."},
        {prompt:"Say: “I do not have binoculars with me today.”", target:"Ich habe heute kein Fernglas dabei.", hint:"Fernglas is neuter. Use kein, and keep dabei at the end.", note:"Kein negates the neuter noun Fernglas. Dabei completes the expression dabei haben."},
        {prompt:"Ask: “Can you see the monkeys in the tree?”", target:"Kannst du die Affen im Baum sehen?", hint:"Start the yes/no question with Kannst. With können, sehen goes at the end.", note:"Kannst matches du. The infinitive sehen follows the location phrase at the end."},
        {prompt:"Say: “After lunch, we photograph the animals.”", target:"Nach dem Mittagessen fotografieren wir die Tiere.", hint:"When the time phrase comes first, the verb still comes second.", note:"Nach dem Mittagessen occupies the first position; fotografieren stays second."},
        {prompt:"Say: “The animals are calm, but we are staying in the jeep.”", target:"Die Tiere sind ruhig, aber wir bleiben im Jeep.", hint:"Use sind with plural Tiere and bleiben with wir.", note:"Sind agrees with die Tiere; bleiben agrees with wir. Aber joins the two clauses."}
      ]
    },
    veryHard: {
      title: "Very hard A1",
      shortTitle: "Very hard",
      subtitle: "Use time phrases, modal verbs, and separable verbs in mission situations.",
      theme: "A mission in space",
      label: "CHALLENGE · SPACE STATION",
      prefix: "space",
      scenes: scenes("veryHard", "space"),
      tasks: [
        {prompt:"Say: “Tomorrow we are flying to the Moon.”", target:"Morgen fliegen wir zum Mond.", hint:"Morgen is first, so the conjugated verb fliegen comes second. Zum means zu dem.", note:"The time phrase comes first; fliegen must remain in position two."},
        {prompt:"Say: “Our rocket launches at six o’clock.”", target:"Unsere Rakete startet um sechs Uhr.", hint:"Rakete is singular, so start takes the ending -et: startet.", note:"The singular subject Rakete takes startet. Um sechs Uhr tells the time."},
        {prompt:"Say: “The astronaut has to press the red button.”", target:"Die Astronautin muss den roten Knopf drücken.", hint:"Muss matches the singular subject; the infinitive drücken goes last.", note:"With the modal verb muss, drücken stays in the infinitive at the end."},
        {prompt:"Ask: “Where can we find the oxygen tanks?”", target:"Wo können wir die Sauerstoffflaschen finden?", hint:"Begin with Wo. After können, put the infinitive finden at the end.", note:"Können matches wir; finden is the infinitive and goes at the end."},
        {prompt:"Say: “The small robot helps us in the laboratory.”", target:"Der kleine Roboter hilft uns im Labor.", hint:"Roboter is singular; helfen changes to hilft. Uns is the object form.", note:"The subject is masculine singular, so helfen becomes hilft. Uns is the object pronoun."},
        {prompt:"Say: “I put on my spacesuit before launch.”", target:"Ich ziehe meinen Raumanzug vor dem Start an.", hint:"Anziehen is separable: ziehe is in position two and an goes at the end.", note:"The prefix an separates from ziehe and moves to the end of the clause."},
        {prompt:"Say: “Two technicians are working together in the control room.”", target:"Im Kontrollraum arbeiten zwei Techniker zusammen.", hint:"The place phrase comes first, so arbeiten comes second. Zusammen completes zusammenarbeiten.", note:"Im Kontrollraum is first; the verb arbeiten remains in position two."},
        {prompt:"Say: “After the alarm, we go straight to the cabin.”", target:"Nach dem Alarm gehen wir sofort zur Kabine.", hint:"After a phrase at the beginning, the verb goes second. Zur is zu der.", note:"The time phrase is first, so gehen comes second, before wir."},
        {prompt:"Say: “We see the Earth through the window.”", target:"Wir sehen die Erde durch das Fenster.", hint:"Erde is feminine. Durch takes the accusative: das Fenster.", note:"Die Erde is the direct object; durch is followed by the accusative."},
        {prompt:"Ask two astronauts: “Can you close the door from the outside?”", target:"Könnt ihr die Tür von außen schließen?", hint:"Use könnt with ihr. In a modal question, schließen goes at the end.", note:"Könnt matches ihr; the infinitive schließen stays at the end."}
      ]
    }
  };
  window.SENTENCE_BUILDER_LEVELS = levels;
})();

