const book = {
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  publisher: "HarperCollins",
  year: 1937,
  sold: 10000,
  price: "€12.99"
};

const outputDiv = document.querySelector(".output");

for (const key in book) {
  const paragraph = document.createElement("p");
  paragraph.textContent = `${key}: ${book[key]}`;
  outputDiv.appendChild(paragraph);
}
