/* Original, accessible visual cues for A1 Hören choices. Captions remain the answers. */
(() => {
  'use strict';
  const weekdays = {montag:'Mo',dienstag:'Di',mittwoch:'Mi',donnerstag:'Do',freitag:'Fr',samstag:'Sa',sonntag:'So'};
  const numbers = {eins:'1',zwei:'2',drei:'3',vier:'4',fünf:'5',sechs:'6',sieben:'7',acht:'8',neun:'9',zehn:'10'};
  const objects = [
    [/straßenbahn/i,'🚋'],[/taxi/i,'🚕'],[/auto/i,'🚗'],[/fahrrad|radfahren|radtour/i,'🚲'],[/bus|bushaltestelle/i,'🚌'],
    [/schiff|fähre/i,'🚢'],[/flugzeug|flughafen/i,'✈️'],[/zug|bahnhof|gleis/i,'🚆'],
    [/stadtrundfahrt/i,'🏙️'],[/information|rezeption|personalbüro/i,'ℹ️'],
    [/hotel|pension/i,'🏨'],[/reisebüro/i,'🧳'],[/koffer/i,'🧳'],[/reisepass|ausweis/i,'🪪'],
    [/schule|klassenzimmer|schultor/i,'🏫'],[/bibliothek/i,'📚'],[/museum/i,'🏛️'],
    [/café|kaffee/i,'☕'],[/restaurant|mensa/i,'🍽️'],[/park|garten/i,'🌳'],
    [/arzt|praxis|krankenhaus/i,'🏥'],[/bäckerei|brot|brötchen/i,'🥖'],
    [/milch/i,'🥛'],[/ei(?:er)?\b/i,'🥚'],[/apfel|äpfel/i,'🍎'],[/banane/i,'🍌'],
    [/orange|orangensaft/i,'🍊'],[/tee/i,'🍵'],[/reis/i,'🍚'],[/tomaten|gemüse/i,'🥕'],
    [/käse/i,'🧀'],[/pilze/i,'🍄'],[/schinken/i,'🥓'],[/wasser|flasche/i,'💧'],
    [/kuchen/i,'🍰'],[/salat/i,'🥗'],[/eis essen/i,'🍨'],
    [/jacke|mantel|schal/i,'🧥'],[/schuhe|sandalen/i,'👟'],[/kleid/i,'👗'],
    [/hut/i,'👒'],[/tasche|geldbörse/i,'👜'],[/regenschirm/i,'☂️'],
    [/brille/i,'👓'],[/handy|telefon/i,'📱'],[/foto|fotografie/i,'📷'],
    [/fenster/i,'🪟'],[/tür/i,'🚪'],[/schlüssel/i,'🔑'],[/stuhl|sitz/i,'🪑'],
    [/tisch/i,'🪑'],[/kühlschrank/i,'🧊'],[/herd/i,'🍳'],[/heizung/i,'♨️'],
    [/papier|heft|buch|zeugnis|brief|vertrag|formular|rechnung|zeitung/i,'📄'],
    [/stift|lineal/i,'✏️'],[/computer|drucker/i,'🖨️'],[/radio/i,'📻'],
    [/post|paket/i,'📦'],[/kino|film|komödie|krimi/i,'🎬'],[/sport|fußball|ball/i,'⚽'],
    [/schwimmen/i,'🏊'],[/joggen/i,'🏃'],[/gitarre/i,'🎸'],[/malen/i,'🎨'],
    [/elefant/i,'🐘'],[/pinguin/i,'🐧'],[/löwe/i,'🦁'],[/puzzle/i,'🧩'],
    [/windeln|fläschchen/i,'🍼'],[/blumen/i,'💐'],[/schnee/i,'❄️'],[/sonne/i,'☀️'],[/regen/i,'🌧️'],
    [/decke/i,'🛏️'],[/taschenlampe|schlafsack/i,'🔦'],[/salbe|hustensaft|augentropfen/i,'💊'],
    [/kopf/i,'🧑'],[/fuß/i,'🦶'],[/rücken/i,'🧍'],
    [/überweisung|online/i,'💳'],[/kasse|schalter|automat/i,'🏧'],[/klimaanlage/i,'❄️'],
    [/meer|see|strand/i,'🏖️'],[/wald|wander/i,'🌲'],[/wohnung|zuhause|zu hause|haus/i,'🏠']
  ];

  function forOption(label, fallback = '◯') {
    const value = String(label).trim();
    const color = /^(?:ein(?:e|en|es)? )?(rot(?:es|e|en)?|blau(?:es|e|en)?|grün(?:es|e|en)?|schwarz(?:es|e|en)?|gelb(?:es|e|en)?)$/i.exec(value);
    if (color) {
      const base = color[1].toLowerCase().match(/^(rot|blau|grün|schwarz|gelb)/)[1];
      return {text:'',className:'is-color is-'+base};
    }
    const time = /(?:^|\b)(\d{1,2})[:.](\d{2})(?:\s*Uhr)?\b/.exec(value);
    if (time) return {text:`${time[1].padStart(2,'0')}:${time[2]}`,className:'is-time'};
    const hour = /^(?:um )?(\d{1,2})\s*Uhr$/i.exec(value);
    if (hour) return {text:hour[1].padStart(2,'0')+':00',className:'is-time'};
    const price = /^(\d+(?:[,.]\d+)?)\s*(?:Euro|€)$/i.exec(value);
    if (price) return {text:price[1]+' €',className:'is-price'};
    const number = /^(?:(?:Gleis|Raum|Linie|Nummer|Reihe|Schalter)\s+)(\d{1,3})$/i.exec(value);
    if (number) return {text:number[1],className:'is-number'};
    if (/^\d{1,3}$/.test(value)) return {text:value,className:'is-number'};
    const floor = /^im (ersten|zweiten|dritten) Stock$/i.exec(value);
    if (floor) return {text:{ersten:'1',zweiten:'2',dritten:'3'}[floor[1].toLowerCase()]+'.',className:'is-number'};
    if (/Erdgeschoss/i.test(value)) return {text:'EG',className:'is-number'};
    const duration = /^(\d{1,2}) Minuten$/.exec(value);
    if (duration) return {text:duration[1]+' min',className:'is-time'};
    const frequency = /^(Einmal|Zweimal|Dreimal) pro Woche$/i.exec(value);
    if (frequency) return {text:{einmal:'1×',zweimal:'2×',dreimal:'3×'}[frequency[1].toLowerCase()],className:'is-number'};
    const month = /^im (Mai|Juni|Juli)$/i.exec(value);
    if (month) return {text:month[1],className:'is-weekday'};
    const weekday = /^(?:am |bis )?(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)(?:abend|morgen|mittag)?$/i.exec(value);
    if (weekday) return {text:weekdays[weekday[1].toLowerCase()],className:'is-weekday'};
    const smallNumber = numbers[value.toLowerCase()];
    if (smallNumber) return {text:smallNumber,className:'is-number'};
    const object = objects.find(([test]) => test.test(value));
    if (object) return {text:object[1],className:'is-object'};
    return {text:fallback === '◯' ? '◇' : fallback,className:'is-symbol'};
  }
  window.HOEREN_VISUALS = Object.freeze({forOption});
})();
