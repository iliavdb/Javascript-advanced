// app.js (ES module)
const API = 'https://restcountries.com/v3.1/all';
const CACHE_KEY = 'countries_cache_v1';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 uur

const statusEl = document.getElementById('status');
const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');
const sortSelect = document.getElementById('sortSelect');
const refreshBtn = document.getElementById('refreshBtn');
const template = document.getElementById('cardTemplate');

let countries = []; // volledige dataset
let filtered = [];

// ---- Utility ----
function setStatus(text, busy = false) {
  statusEl.textContent = text;
  statusEl.style.opacity = busy ? '1' : '0.9';
}
function formatNumber(n){
  return Intl.NumberFormat('nl-NL').format(n ?? 0);
}
function safeGetCurrency(country){
  try{
    const cur = country.currencies;
    if(!cur) return '-';
    return Object.values(cur).map(c => `${c.name} (${c.symbol ?? ''})`).join(', ');
  }catch(e){
    return '-';
  }
}
function wikiSearchUrl(name){
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`;
}

// ---- Caching ----
function saveCache(data){
  const payload = {
    ts: Date.now(),
    data
  };
  try{ localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); }catch(e){}
}
function loadCache(){
  try{
    const raw = localStorage.getItem(CACHE_KEY);
    if(!raw) return null;
    const p = JSON.parse(raw);
    if(!p.ts || !p.data) return null;
    if(Date.now() - p.ts > CACHE_TTL) return null;
    return p.data;
  }catch(e){ return null; }
}

// ---- Fetch ----
async function fetchCountries(force = false){
  setStatus('Laden van landen...', true);
  // probeer cache
  if(!force){
    const cached = loadCache();
    if(cached && Array.isArray(cached)){
      setStatus(`Gelaadde landen uit lokale cache (${cached.length})`);
      countries = cached;
      applyFilters();
      return;
    }
  }

  try{
    const res = await fetch(API);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // bewaar alleen wat we nodig hebben — reduceer payload
    const small = data.map(c => ({
      name: c.name?.common ?? '',
      official: c.name?.official ?? '',
      cca2: c.cca2 ?? '',
      cca3: c.cca3 ?? '',
      capital: Array.isArray(c.capital) ? c.capital.join(', ') : (c.capital ?? '-'),
      region: c.region ?? '',
      subregion: c.subregion ?? '',
      population: c.population ?? 0,
      area: c.area ?? 0,
      flags: c.flags ?? {},
      currencies: c.currencies ?? null,
      languages: c.languages ?? null,
      latlng: c.latlng ?? null,
    }));
    countries = small;
    saveCache(small);
    setStatus(`Opgehaald ${countries.length} landen van API`);
    applyFilters();
  }catch(err){
    console.error(err);
    setStatus('Fout bij ophalen data. Probeer opnieuw of open console voor details.');
    // als cache onbruikbaar maar we hebben geen data, toon fallback
    const cached = loadCache();
    if(cached){
      countries = cached;
      applyFilters();
    }
  }
}

// ---- Render ----
function clearCards(){ cardsContainer.innerHTML = ''; }
function renderCards(list){
  clearCards();
  if(!list.length){
    setStatus('Geen landen gevonden voor de huidige filters.');
    return;
  }
  setStatus(`${list.length} landen getoond`);
  const frag = document.createDocumentFragment();
  for(const c of list){
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('.flag');
    const name = clone.querySelector('.country-name');
    const region = clone.querySelector('.region');
    const capital = clone.querySelector('.capital');
    const population = clone.querySelector('.population');
    const area = clone.querySelector('.area');
    const currencies = clone.querySelector('.currencies');
    const more = clone.querySelector('.more-btn');

    img.src = c.flags?.png || c.flags?.svg || '';
    img.alt = `${c.name} vlag`;

    name.textContent = c.name;
    region.textContent = c.region || '-';
    capital.textContent = c.capital || '-';
    population.textContent = formatNumber(c.population);
    area.textContent = c.area ? formatNumber(Math.round(c.area)) : '-';
    currencies.textContent = safeGetCurrency(c);
    more.href = wikiSearchUrl(c.name);

    frag.appendChild(clone);
  }
  cardsContainer.appendChild(frag);
}

// ---- Filtering / Searching / Sorting ----
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const region = regionSelect.value;
  const sort = sortSelect.value;

  filtered = countries.filter(c => {
    let matchesRegion = true;
    if(region) matchesRegion = (c.region === region);

    if(!q) return matchesRegion;

    // zoek in naam, official, capital, cca2, cca3
    const hay = [
      c.name?.toLowerCase(),
      c.official?.toLowerCase(),
      (c.capital||'').toLowerCase(),
      (c.cca2||'').toLowerCase(),
      (c.cca3||'').toLowerCase()
    ].join(' ');
    return matchesRegion && hay.includes(q);
  });

  // sorteren
  const [by, dir] = sort.split('-');
  filtered.sort((a,b) => {
    let va = a[by === 'name' ? 'name' : (by === 'pop' ? 'population' : 'area')];
    let vb = b[by === 'name' ? 'name' : (by === 'pop' ? 'population' : 'area')];
    if(by === 'name'){
      va = String(va).toLowerCase();
      vb = String(vb).toLowerCase();
      if(va < vb) return dir === 'asc' ? -1 : 1;
      if(va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    }else{
      va = Number(va) || 0;
      vb = Number(vb) || 0;
      return dir === 'asc' ? va - vb : vb - va;
    }
  });

  renderCards(filtered);
}

// ---- Debounce helper ----
function debounce(fn, ms=250){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ---- Events ----
searchInput.addEventListener('input', debounce(() => applyFilters(), 200));
regionSelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

refreshBtn.addEventListener('click', () => {
  setStatus('Herversing: data wordt direct van API gehaald...', true);
  fetchCountries(true);
});

// ---- Init ----
(async function init(){
  setStatus('Initialiseren...');
  await fetchCountries(false);
})();
