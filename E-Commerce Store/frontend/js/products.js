let ALL_PRODUCTS = [];
let FILTERS = {
  category: 'All',
  search: '',
  minPrice: 0,
  maxPrice: Infinity,
  sort: 'default'
};

async function fetchProducts() {
  if (ALL_PRODUCTS.length) return ALL_PRODUCTS;
  ALL_PRODUCTS = await apiCall('/products');
  return ALL_PRODUCTS;
}

function applyFilters(products) {
  return products.filter(p => {
    if (FILTERS.category !== 'All' && p.category !== FILTERS.category) return false;
    if (FILTERS.search) {
      const q = FILTERS.search.toLowerCase();
      const hay = `${p.name} ${p.description || ''} ${p.category || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    const price = parseFloat(p.price);
    if (price < FILTERS.minPrice) return false;
    if (FILTERS.maxPrice !== Infinity && price > FILTERS.maxPrice) return false;
    return true;
  });
}

function sortProducts(products) {
  const s = FILTERS.sort;
  if (s === 'price_asc')  return [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  if (s === 'price_desc') return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  if (s === 'name_asc')   return [...products].sort((a, b) => a.name.localeCompare(b.name));
  if (s === 'name_desc')  return [...products].sort((a, b) => b.name.localeCompare(a.name));
  return products;
}

function productCardHtml(p) {
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  return `
    <a href="/pages/product-detail.html?id=${p.id}" class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHtml(p.image_url) || 'https://via.placeholder.com/400'}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/400?text=Product'">
      </div>
      <div class="product-body">
        <div class="product-category">${escapeHtml(p.category || 'General')}</div>
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="product-desc">${escapeHtml(p.description || '')}</div>
        <div style="font-size:12px;color:var(--warning);margin-bottom:10px">★★★★★ <span style="color:var(--text-muted)">${rating}</span></div>
        <div class="flex-between" style="margin-top:auto">
          <div class="product-price">$${parseFloat(p.price).toFixed(2)}</div>
          <div class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}">${p.stock > 0 ? 'In Stock' : 'Out'}</div>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.preventDefault(); quickAdd(${p.id})">Add to Cart</button>
        </div>
      </div>
    </a>
  `;
}

async function quickAdd(productId) {
  const products = await fetchProducts();
  const p = products.find(x => x.id === productId);
  if (!p) return;
  addToCart(p.id, p.name, p.price, p.image_url);
}

async function renderProductGrid() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  renderSkeletonGrid(grid, 8);

  try {
    const products = await fetchProducts();
    const filtered = sortProducts(applyFilters(products));

    if (!filtered.length) {
      renderEmpty(grid, '🔍', 'No products found', 'Try adjusting your filters or search.');
      return;
    }

    grid.innerHTML = filtered.map(productCardHtml).join('');
  } catch (e) {
    renderEmpty(grid, '⚠️', 'Failed to load products', e.message);
  }
}

function initFilters() {
  // Category tabs
  const tabs = document.getElementById('categoryTabs');
  if (tabs) {
    tabs.innerHTML = CATEGORIES.map(c => `
      <button class="btn btn-outline btn-sm category-tab ${c.slug === FILTERS.category ? 'active' : ''}" data-cat="${c.slug}">
        ${c.icon} ${c.label}
      </button>
    `).join('');

    tabs.addEventListener('click', e => {
      const btn = e.target.closest('.category-tab');
      if (!btn) return;
      FILTERS.category = btn.dataset.cat;
      tabs.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProductGrid();
    });
  }

  // Search
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', e => {
      FILTERS.search = e.target.value.trim();
      renderProductGrid();
    });
  }

  // Price
  const minP = document.getElementById('minPrice');
  const maxP = document.getElementById('maxPrice');
  if (minP) minP.addEventListener('input', e => {
    FILTERS.minPrice = parseFloat(e.target.value) || 0;
    renderProductGrid();
  });
  if (maxP) maxP.addEventListener('input', e => {
    FILTERS.maxPrice = parseFloat(e.target.value) || Infinity;
    renderProductGrid();
  });

  // Sort
  const sort = document.getElementById('sortSelect');
  if (sort) sort.addEventListener('change', e => {
    FILTERS.sort = e.target.value;
    renderProductGrid();
  });

  // Clear
  const clear = document.getElementById('clearFilters');
  if (clear) clear.addEventListener('click', () => {
    FILTERS = { category: 'All', search: '', minPrice: 0, maxPrice: Infinity, sort: 'default' };
    if (search) search.value = '';
    if (minP) minP.value = '';
    if (maxP) maxP.value = '';
    if (sort) sort.value = 'default';
    if (tabs) {
      tabs.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
      tabs.querySelector('.category-tab[data-cat="All"]')?.classList.add('active');
    }
    renderProductGrid();
  });
}

async function loadProductDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;

  const container = document.getElementById('productDetail');
  if (!container) return;

  container.innerHTML = '<div class="spinner"></div>';

  try {
    const p = await apiCall('/products/' + id);
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);

    container.innerHTML = `
      <div class="grid grid-2" style="align-items:start;gap:48px">
        <div>
          <img class="product-image" style="border-radius:16px;aspect-ratio:1" src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" onerror="this.src='https://via.placeholder.com/600'">
        </div>
        <div>
          <div class="product-category mb-2">${escapeHtml(p.category || 'General')}</div>
          <h1 class="page-title" style="font-size:40px">${escapeHtml(p.name)}</h1>
          <div style="color:var(--warning);font-size:20px;margin:12px 0">★★★★★ <span style="color:var(--text-muted);font-size:14px">${rating} rating</span></div>
          <div class="product-price" style="font-size:44px;margin:20px 0">$${parseFloat(p.price).toFixed(2)}</div>
          <p style="color:var(--text-secondary);margin-bottom:28px;line-height:1.8;font-size:16px">${escapeHtml(p.description || 'No description available.')}</p>
          <div class="mb-3">
            <span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}">${p.stock > 0 ? 'In Stock (' + p.stock + ' units)' : 'Out of Stock'}</span>
          </div>
          <div class="flex gap-2 mb-3">
            <input type="number" id="qty" class="form-input" value="1" min="1" max="${p.stock}" style="width:110px">
            <button class="btn btn-primary btn-lg" ${p.stock < 1 ? 'disabled' : ''} onclick="addToCart(${p.id}, '${escapeHtml(p.name).replace(/'/g, "\\'")}', ${p.price}, '${(p.image_url || '').replace(/'/g, "\\'")}')">
              🛒 Add to Cart
            </button>
          </div>
          <a href="/pages/home.html" class="btn btn-outline mt-3">← Back to Products</a>
        </div>
      </div>
    `;
  } catch (e) {
    renderEmpty(container, '❌', 'Product not found', e.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productsGrid');
  if (grid) {
    initFilters();
    renderProductGrid();
  }
  const detail = document.getElementById('productDetail');
  if (detail) loadProductDetail();
});