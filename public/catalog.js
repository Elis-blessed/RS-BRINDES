const state = { products: [], filtered: [], tags: new Set(), q: '', cat: 'Todas' };

const $grid = document.getElementById('grid');
const $search = document.getElementById('search');
const $category = document.getElementById('category');
const $chips = document.getElementById('chips');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

fetch('data/products.json')
  .then(r => r.json())
  .then(items => {
    state.products = items;
    buildCategories(items);
    applyFilters();
  });

function buildCategories(items){
  const cats = Array.from(new Set(items.map(i => i.category))).sort();
  $category.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = 'Todas'; optAll.textContent = 'Todas';
  $category.appendChild(optAll);
  cats.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    $category.appendChild(o);
  });
  $category.addEventListener('change', () => { state.cat = $category.value; applyFilters(); });
}

$search.addEventListener('input', () => { state.q = $search.value.toLowerCase(); applyFilters(); });

function applyFilters(){
  const { products, q, cat } = state;
  state.filtered = products.filter(p => 
    (cat === 'Todas' || p.category === cat) &&
    (q === '' || p.name.toLowerCase().includes(q))
  );
  render();
}

function render(){
  if (state.filtered.length === 0){
    $grid.innerHTML = '<div class="card card-pad" style="grid-column:1/-1;text-align:center">Nenhum item encontrado</div>';
    return;
  }
  $grid.innerHTML = state.filtered.map(p => `
    <div class="card">
      <img class="product" src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"/>
      <div class="card-pad">
        <div class="title">${p.name}</div>
        <div class="cat">${p.category}</div>
        <div style="margin-top:8px">
          <a class="btn btn-primary" href="index.html#contato">Solicitar Orçamento</a>
        </div>
      </div>
    </div>
  `).join('');
}
