let output = document.querySelector('#cosmetics-container');

fetch('https://fortnite-api.com/v2/cosmetics/new')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    for (let item of data.data.items.br) {
      output.innerHTML += `
        <div class="card">
          <img src="${item.images.icon}" alt="${item.name}">
          <h2>${item.name}</h2>
          <p>Rarity: ${item.rarity.value}</p>
          <p>Type: ${item.type.value}</p>
        </div>
      `;
    }
  });
