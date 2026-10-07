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
        {prompt:"Greet your new neighbor: “Good afternoon, Sam!”", target:"Guten Tag, Sam!", hint:"Guten Tag is a polite greeting. Use a comma before the name.", note:"Guten Tag is a common greeting when you meet someone."},
        {prompt:"Ask Sam: “Is this your mailbox?”", target:"Ist das dein Briefkasten?", hint:"A yes/no question starts with the conjugated verb Ist.", note:"The verb Ist comes first in this yes/no question. Dein matches the masculine noun Briefkasten."},
        {prompt:"Say: “I live on the third floor.”", target:"Ich wohne im dritten Stock.", hint:"Im means in dem. After im, Stock uses the dative form dritten.", note:"Im dritten Stock tells where you live. Im is short for in dem."},
        {prompt:"Say: “I live in Berlin.”", target:"Ich wohne in Berlin.", hint:"Use the ich form wohne. In Berlin tells where you live.", note:"Wohne matches ich. In Berlin names the place where you live."},
        {prompt:"Ask: “Where do you live?”", target:"Wo wohnst du?", hint:"Start with Wo, then use the verb wohnst before du.", note:"A question word comes first; the conjugated verb comes next."},
        {prompt:"Say: “I am twenty years old.”", target:"Ich bin zwanzig Jahre alt.", hint:"Use bin with ich. German says the years are old.", note:"Bin is the first-person form of sein. Jahre is a noun and is capitalized."},
        {prompt:"Ask Sam: “How old are you?”", target:"Wie alt bist du?", hint:"Start with Wie alt, then put bist before du.", note:"In this question, the phrase Wie alt comes first, followed by bist and du."},
        {prompt:"Say: “I like drinking tea.”", target:"Ich trinke gern Tee.", hint:"Put gern after trinke to say that you enjoy drinking tea.", note:"Trinke matches ich. Gern tells that you enjoy the activity."},
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
        {prompt:"Order: “I would like one loaf of bread and two rolls, please.”", target:"Ich möchte ein Brot und zwei Brötchen, bitte.", hint:"Möchte is a polite form. Put bitte at the end.", note:"Möchte is a polite request form; ein Brot and zwei Brötchen are the items."},
        {prompt:"Ask the baker: “Is the bread fresh?”", target:"Ist das Brot frisch?", hint:"Start a yes/no question with Ist. Brot is neuter, so use das.", note:"In a yes/no question, Ist comes first. Frisch describes the bread."},
        {prompt:"Say: “The strawberries are very sweet today.”", target:"Die Erdbeeren sind heute sehr süß.", hint:"Erdbeeren is plural, so use sind.", note:"The plural subject Erdbeeren takes sind. Heute and sehr süß add time and description."},
        {prompt:"Ask: “How much does one kilo of bananas cost?”", target:"Was kostet ein Kilo Bananen?", hint:"Begin with Was kostet, then name the amount you are asking about.", note:"Was is the question word; kostet agrees with the singular subject ein Kilo."},
        {prompt:"At checkout, say: “That comes to twelve euros altogether.”", target:"Das macht zusammen zwölf Euro.", hint:"This useful checkout phrase begins with Das macht.", note:"Das macht zusammen is a natural phrase for stating the total price."},
        {prompt:"Ask: “Can I pay by card?”", target:"Kann ich mit Karte bezahlen?", hint:"In a yes/no question, Kann comes first; the infinitive bezahlen goes last.", note:"Kann is the modal verb. The infinitive bezahlen stays at the end."},
        {prompt:"Ask at the market map: “Where can I find the cheese stand?”", target:"Wo finde ich den Käsestand?", hint:"Start with Wo, then the verb finde and the subject ich.", note:"The question word Wo is followed by the verb finde, then ich."},
        {prompt:"Say: “We are going to the cheese stand now.”", target:"Wir gehen jetzt zum Käsestand.", hint:"Zum means zu dem. The place comes after the verb gehen.", note:"Gehen matches wir. Zum is the contraction of zu dem."}
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
        {prompt:"Ask: “Where is the elephant drinking?”", target:"Wo trinkt der Elefant?", hint:"After Wo, use the singular verb trinkt before der Elefant.", note:"The question word Wo comes first, followed by trinkt and the subject der Elefant."},
        {prompt:"Ask: “Where are the lions sleeping?”", target:"Wo schlafen die Löwen?", hint:"After Wo, put the plural verb schlafen before die Löwen.", note:"The question word Wo is followed by schlafen and then the plural subject die Löwen."},
        {prompt:"Say: “The lions are sleeping under the tree.”", target:"Die Löwen schlafen unter dem Baum.", hint:"Löwen is plural, so use schlafen. Unter dem Baum describes where.", note:"Schlafen matches the plural subject. Unter dem Baum tells where they rest."},
        {prompt:"Say: “We see a giraffe next to the tree.”", target:"Wir sehen eine Giraffe neben dem Baum.", hint:"Giraffe is feminine, so the object is eine Giraffe. Dem Baum follows neben for a location.", note:"Eine Giraffe is the direct object; neben dem Baum gives the location."},
        {prompt:"Say: “The giraffe is standing next to a tree.”", target:"Die Giraffe steht neben einem Baum.", hint:"Steht matches Die Giraffe. For a location after neben, use dative einem Baum.", note:"Die Giraffe is singular, so use steht. Neben a location takes the dative."},
        {prompt:"Ask: “Why are the zebras running to the waterhole?”", target:"Warum laufen die Zebras zur Wasserstelle?", hint:"Zebras is plural, so use laufen. Zur means zu der.", note:"The question word comes first, then the plural verb laufen. Zur is zu + der."},
        {prompt:"Say: “The zebras are drinking at the waterhole.”", target:"Die Zebras trinken an der Wasserstelle.", hint:"Use trinken with plural Zebras. An der Wasserstelle gives the location.", note:"Trinken matches the plural subject. An a static location takes dative der."},
        {prompt:"Say: “Before the drive, we check the map.”", target:"Vor der Fahrt prüfen wir die Karte.", hint:"When Vor der Fahrt comes first, the verb prüfen must come second.", note:"The time phrase is first; prüfen stays in position two before wir."},
        {prompt:"Say: “The camera is next to the map.”", target:"Die Kamera liegt neben der Karte.", hint:"Use liegt for where the camera is. Neben a location takes the dative.", note:"Die Kamera is singular, so use liegt. Neben der Karte describes its location."}
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
        {prompt:"Say: “We see the Moon through the window.”", target:"Wir sehen den Mond durch das Fenster.", hint:"Mond is masculine, so use den in the accusative. Durch takes the accusative.", note:"Den Mond is the direct object. Durch das Fenster tells how we see it."},
        {prompt:"Describe the Moon: “It is big and bright.”", target:"Der Mond ist groß und hell.", hint:"Use ist with the singular subject Der Mond.", note:"Der Mond is singular; ist links the subject to the two descriptions."},
        {prompt:"Say: “Our rocket launches at six o’clock.”", target:"Unsere Rakete startet um sechs Uhr.", hint:"Rakete is singular, so start takes the ending -et: startet.", note:"The singular subject Rakete takes startet. Um sechs Uhr tells the time."},
        {prompt:"Say: “The astronaut is checking the launch.”", target:"Die Astronautin kontrolliert den Start.", hint:"Start is masculine, so use den as the direct object.", note:"Kontrolliert matches Die Astronautin; den Start is the direct object."},
        {prompt:"Say: “The small robot helps us in the laboratory.”", target:"Der kleine Roboter hilft uns im Labor.", hint:"Roboter is singular; helfen changes to hilft. Uns is the object form.", note:"The subject is masculine singular, so helfen becomes hilft. Uns is the object pronoun."},
        {prompt:"Say: “The astronaut has to check the robot.”", target:"Die Astronautin muss den Roboter prüfen.", hint:"Muss matches the singular subject; the infinitive prüfen goes last.", note:"With the modal verb muss, prüfen stays in the infinitive at the end."},
        {prompt:"Ask: “Where can we find the oxygen tanks?”", target:"Wo können wir die Sauerstoffflaschen finden?", hint:"Begin with Wo. After können, put the infinitive finden at the end.", note:"Können matches wir; finden is the infinitive and goes at the end."},
        {prompt:"Say: “The astronaut is checking the tank.”", target:"Die Astronautin prüft den Tank.", hint:"Tank is masculine, so use den as the direct object.", note:"Prüft matches Die Astronautin; den Tank is the direct object."},
        {prompt:"Say: “We see the Earth through the window.”", target:"Wir sehen die Erde durch das Fenster.", hint:"Erde is feminine. Durch takes the accusative: das Fenster.", note:"Die Erde is the direct object; durch is followed by the accusative."},
        {prompt:"Say: “The Earth looks blue and white.”", target:"Die Erde sieht blau und weiß aus.", hint:"Aussehen is separable: sieht comes second and aus goes at the end.", note:"The verb aussehen separates: sieht is conjugated, and aus closes the sentence."}
      ]
    }
  };
  window.SENTENCE_BUILDER_LEVELS = levels;
})();

