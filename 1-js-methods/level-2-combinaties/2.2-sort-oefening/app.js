// Opdracht 2.2: Sort Oefening
console.log('🚀 Opdracht 2.2: Sort Oefening');

const scores = [85, 92, 76, 88, 95, 73, 89];
const steden = ['Amsterdam', 'Utrecht', 'Rotterdam', 'Den Haag', 'Eindhoven'];

console.log('Originele scores:', scores);
console.log('Originele steden:', steden);

// TODO: Sorteer scores van laag naar hoog
const gesorteerdeScores = [...scores].sort((a, b) => a - b);
console.log('Scores laag naar hoog:', gesorteerdeScores);

// TODO: Sorteer scores van hoog naar laag  
const scoresHoogNaarLaag = [...scores].sort((a, b) => b - a);
console.log('Scores hoog naar laag:', scoresHoogNaarLaag);

// TODO: Sorteer steden alfabetisch
const gesorteerdeSteden = [...steden].sort();
console.log('Steden alfabetisch:', gesorteerdeSteden);
