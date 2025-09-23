
const marvels = ["Iron Man", "Thor", "Captain America: The First Avenger", "The Avengers"]
const addmarvel = (film) => {
    marvels.push(film);
}; 
addmarvel("blackpanther");
for (const film of marvels) {
    console.log(film)
}