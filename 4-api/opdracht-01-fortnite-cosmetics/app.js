// ELEMENTS
const grid = document.getElementById('grid');
const loadBtn = document.getElementById('load-btn');
const resetBtn = document.getElementById('reset-btn');
const apiKeyInput = document.getElementById('api-key');
const errorBox = document.getElementById('error');
const subtitle = document.getElementById('subtitle');

// Endpoint van jou (de link die je gaf)
const API_URL = 'https://fortnite-api.com/v2/cosmetics/new';

// fallback sample file (optioneel)
const SAMPLE_JSON = 'fortnite.json';

// helper: maak card
function makeCard(item){
  // sommige endpoints nesten image links op verschillende plekken — probeer veilige paden
  const image = item.images && (item.images.icon || item.images.featured || item.images.smallIcon) || item.image || item.icon || '';
  const name = item.name || item.displayName || item.type || 'Unknown';
  const rarity = (item.rarity && item.rarity.value) || (item.rarity) || 'common';
  const type = item.type || item.type?.value || '';

  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <div class="thumb">
      ${ image ? `<img src="${image}" alt="${name}" />` : `<div style="color:#8894ad">${name}</div>`}
      <span class="badge ${rarity.toLowerCase()}">${rarity}</span>
    </div>
    <div class="meta">
      <h3>${name}</h3>
      <p>${type}</p>
      <p style="color:var(--muted); font-size:12px; margin-top:8px;">ID: ${item.id || item.itemId || '—'}</p>
    </div>
  `;
  return el;
}

function showError(text){
  errorBox.textContent = text;
  errorBox.classList.remove('hidden');
}

function clearError(){ errorBox.classList.add('hidden'); errorBox.textContent = ''; }

async function loadFromAPI(key){
  clearError();
  subtitle.textContent = 'Ophalen van Fortnite API…';
  grid.innerHTML = '';

  try{
    const headers = {};
    if (key && key.trim()) headers['Authorization'] = key.trim();

    const res = await fetch(API_URL, { headers });
    if (!res.ok){
      // vaak 401 of 403 als key ontbreekt of CORS probleem
      throw new Error(`API returned ${res.status} ${res.statusText}`);
    }
    const json = await res.json();

    // v2 responses: data zit meestal in json.data of json.data.items
    let items = [];
    if (json.data && Array.isArray(json.data)) items = json.data;
    else if (json.data && Array.isArray(json.data.items)) items = json.data.items;
    else if (json.data && Array.isArray(json.data.results)) items = json.data.results;
    else if (json.data && json.data.items && json.data.items.data) items = json.data.items.data;
    else if (Array.isArray(json)) items = json;
    else if (json.data && json.data.length) items = json.data;
    else {
      // soms object met 'items' map
      const maybeItems = json.data && (json.data.items || json.data.objects || json.data.results);
      if (maybeItems && Array.isArray(maybeItems)) items = maybeItems;
    }

    if (!items || items.length === 0){
      showError('Geen items gevonden in het antwoord van de API. Mogelijk vereist de endpoint een API-key of heeft de API een andere structuur.');
      subtitle.textContent = 'Geen items gevonden';
      return;
    }

    subtitle.textContent = `${items.length} nieuwe cosmetics gevonden`;
    items.forEach(it => grid.appendChild(makeCard(it)));
  }catch(err){
    console.error(err);
    showError('Fout bij ophalen van API: ' + err.message + '. Probeer je API key in te vullen of klik op Reset om sample data te laden.');
    subtitle.textContent = 'Fout bij ophalen';
  }
}

// laad sample data (fallback)
async function loadSample(){
  clearError();
  subtitle.textContent = 'Laden van sample data';
  grid.innerHTML = '';
  try{
    const res = await fetch(SAMPLE_JSON);
    const items = await res.json();
    subtitle.textContent = `${items.length} sample items geladen`;
    items.forEach(it => grid.appendChild(makeCard(it)));
  }catch(err){
    showError('Kon sample-data niet laden: ' + err.message);
  }
}

// events
loadBtn.addEventListener('click', () => {
  const key = apiKeyInput.value;
  loadFromAPI(key);
});
resetBtn.addEventListener('click', () => loadSample());

// auto load sample on first run (so page niet leeg is)
loadSample();
