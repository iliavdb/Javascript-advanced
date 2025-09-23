// Maak een person object
const person = {
  name: "John Doe",
  age: 30,
  birthdate: "1995-05-12",
  gender: "Male",
  alive: true,
  hobbies: ["Reading", "Cycling", "Gaming", "Cooking"],

  changeName: function(newName) {
    this.name = newName;
    this.show();
  },

  toggleAlive: function(status) {
    this.alive = status;
    this.show();
  },

  addHobby: function(newHobby) {
    this.hobbies.push(newHobby);
    this.show();
  },

  show: function() {
    const outputDiv = document.querySelector(".output");
    outputDiv.innerHTML = ""; 

    for (const key in this) {
      if (typeof this[key] !== "function") {
        const p = document.createElement("p");
        p.textContent = `${key}: ${Array.isArray(this[key]) ? this[key].join(", ") : this[key]}`;
        outputDiv.appendChild(p);
      }
    }
  }
};

person.show();

person.changeName("Jane Smith");
person.toggleAlive(false);
person.addHobby("Drawing");
