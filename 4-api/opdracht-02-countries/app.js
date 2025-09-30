let output = document.querySelector('#countries-container');

fetch('https://restcountries.com/v3.1/all?fields=name,flags')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    for (let item of data) {
      output.innerHTML += `
        <div class="card">
      <img src="${item.flags.png}" alt="${item.name}">
          <h2>${item.name.common}</h2>
        </div>
      `;
    }
  });
