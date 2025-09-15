// Opdracht 1.2: Map Oefening
console.log('🚀 Opdracht 1.2: Map Oefening');

const namen = ['sanne', 'johan', 'sjoerd'];
console.log('Originele namen:', namen);

// TODO: Zet alle namen om naar hoofdletter
const hoofdletterNamen = namen.map(naam => naam.charAt(0).toUpperCase() + naam.slice(1));
console.log(hoofdletterNamen); // ['Jan', 'Piet', 'Klaas']

console.log('Namen met hoofdletter:', hoofdletterNamen);
console.log('Verwacht resultaat: [\'Sanne\', \'Johan\', \'Sjoerd\']');