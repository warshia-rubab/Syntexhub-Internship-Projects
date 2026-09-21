function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  if (typeof updateCartBadge === 'function') updateCartBadge();
}

function updateCartBadge() {
  var badge = document.getElementById('cartBadge');
  if (!badge) return;
  var count = getCart().reduce(function (s, i) { return s + i.quantity; }, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

function addToCart(id, name, price, image) {
  var qtyInput = document.getElementById('qty');
  var qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

  var cart = getCart();
  var existing = cart.find(function (i) { return i.product_id === id; });

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      product_id: id,
      name: name,
      price: parseFloat(price),
      image: image,
      quantity: qty
    });
  }
  saveCart(cart);
  if (typeof showToast === 'function') showToast('Added to cart!', 'success');
}

function updateQuantity(id, delta) {
  var cart = getCart();
  var item = cart.find(function (i) { return i.product_id === id; });
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(function (i) { return i.product_id !== id; });
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  var cart = getCart().filter(function (i) { return i.product_id !== id; });
  saveCart(cart);
  renderCart();
}

function renderCart() {
  var container = document.getElementById('cartItems');
  if (!container) return;

  var cart = getCart();

  if (!cart.length) {
    container.innerHTML = '' +
      '<div class="empty-state" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:60px 20px">' +
        '<div class="empty-state-icon">🛒</div>' +
        '<h3>Your Cart is Empty</h3>' +
        '<p style="margin-bottom:20px">Looks like you haven\'t added anything yet.</p>' +
        '<a href="/pages/home.html" class="btn btn-primary btn-lg">Continue Shopping</a>' +
      '</div>';
    var st = document.getElementById('cartSubtotal');
    if (st) st.textContent = '$0.00';
    var t = document.getElementById('cartTotal');
    if (t) t.textContent = '$0.00';
    return;
  }

  var subtotal = 0;
  var html = '';

  cart.forEach(function (item) {
    var lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    html += '' +
      '<div class="card mb-2" style="display:grid;grid-template-columns:100px 1fr auto;gap:16px;align-items:center">' +
        '<img src="' + (item.image || 'https://via.placeholder.com/100') + '" ' +
          'style="width:100px;height:100px;object-fit:cover;border-radius:8px" ' +
          'onerror="this.src=\'https://via.placeholder.com/100\'">' +
        '<div>' +
          '<div style="font-weight:700;font-size:16px;margin-bottom:4px">' + item.name + '</div>' +
          '<div style="color:var(--text-muted);font-size:13px;margin-bottom:8px">$' + item.price.toFixed(2) + ' each</div>' +
          '<div class="flex gap-1" style="align-items:center">' +
            '<button class="btn btn-icon" onclick="updateQuantity(' + item.product_id + ', -1)" title="Decrease">−</button>' +
            '<span style="min-width:40px;text-align:center;font-weight:700;font-size:16px">' + item.quantity + '</span>' +
            '<button class="btn btn-icon" onclick="updateQuantity(' + item.product_id + ', 1)" title="Increase">+</button>' +
            '<button class="btn btn-ghost btn-sm" style="margin-left:12px;color:var(--danger)" onclick="removeFromCart(' + item.product_id + ')">Remove</button>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div style="font-size:18px;font-weight:800;color:var(--accent)">$' + lineTotal.toFixed(2) + '</div>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  var stEl = document.getElementById('cartSubtotal');
  if (stEl) stEl.textContent = '$' + subtotal.toFixed(2);
  var tEl = document.getElementById('cartTotal');
  if (tEl) tEl.textContent = '$' + subtotal.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function () {
  if (typeof updateCartBadge === 'function') updateCartBadge();
});