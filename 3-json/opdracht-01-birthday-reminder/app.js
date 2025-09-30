// HTML elementen ophalen
const title = document.getElementById("title");
const list = document.getElementById("list");
const clearBtn = document.getElementById("clear-btn");

let people = [];

fetch("birthday.json")
  .then(response => response.json())
  .then(data => {
    people = data;
    renderList(people);
  });

function renderList(people) {
  title.textContent = `${people.length} Birthdays Today`;
  list.innerHTML = "";

  people.forEach(person => {
    const item = document.createElement("div");
    item.classList.add("person");
    item.innerHTML = `
      <img src="${person.image}" alt="${person.name}">
      <div>
        <h4>${person.name}</h4>
        <p>${person.age} years</p>
      </div>
    `;
    list.appendChild(item);
  });
}

clearBtn.addEventListener("click", () => {
  renderList([]); 
});
