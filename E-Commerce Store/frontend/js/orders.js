async function placeOrder() {
  var cart = getCart();
  if (!cart.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  // Validate shipping info if on checkout page
  var nameEl = document.getElementById('shipName');
  var emailEl = document.getElementById('shipEmail');
  var phoneEl = document.getElementById('shipPhone');
  var addressEl = document.getElementById('shipAddress');
  var cityEl = document.getElementById('shipCity');

  if (nameEl) {
    var name = nameEl.value.trim();
    var email = emailEl ? emailEl.value.trim() : '';
    var phone = phoneEl ? phoneEl.value.trim() : '';
    var address = addressEl ? addressEl.value.trim() : '';
    var city = cityEl ? cityEl.value.trim() : '';

    if (!name || !email || !phone || !address || !city) {
      showToast('Please fill all required fields', 'error');
      return;
    }
  }

  var items = cart.map(function (i) {
    return { product_id: i.product_id, quantity: i.quantity };
  });

  var btn = document.getElementById('placeOrderBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Placing order...';
  }

  try {
    var data = await apiCall('/orders', 'POST', { items: items });
    localStorage.removeItem('cart');
    if (typeof updateCartBadge === 'function') updateCartBadge();
    showToast('Order placed successfully! Order #' + data.orderId, 'success');
    setTimeout(function () {
      window.location.href = '/pages/orders.html';
    }, 1200);
  } catch (err) {
    showToast('Order could not be placed: ' + (err.message || 'Please try again'), 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Confirm Order';
    }
  }
}

function getStatusBadge(status) {
  var map = {
    pending: 'badge-warning',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  };
  return map[status] || 'badge-primary';
}

async function loadMyOrders() {
  if (!requireAuth()) return;

  var container = document.getElementById('ordersList');
  if (!container) return;

  container.innerHTML = '<div class="spinner"></div>';

  try {
    var orders = await apiCall('/orders/mine');

    if (!orders || !orders.length) {
      container.innerHTML = '' +
        '<div class="empty-state" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:80px 20px">' +
          '<div class="empty-state-icon">📦</div>' +
          '<h3>No orders yet</h3>' +
          '<p style="margin-bottom:20px">You haven\'t placed any orders yet.</p>' +
          '<a href="/pages/home.html" class="btn btn-primary btn-lg">Start Shopping</a>' +
        '</div>';
      return;
    }

    var html = '';
    orders.forEach(function (o) {
      var itemsHtml = '';
      (o.items || []).forEach(function (i) {
        itemsHtml += '' +
          '<div class="flex-between" style="padding:6px 0;font-size:14px;border-bottom:1px solid var(--border)">' +
            '<span>' + (i.name || 'Product') + ' × ' + i.quantity + '</span>' +
            '<span style="font-weight:600">$' + (parseFloat(i.price) * i.quantity).toFixed(2) + '</span>' +
          '</div>';
      });

      html += '' +
        '<div class="card mb-3">' +
          '<div class="flex-between mb-2" style="flex-wrap:wrap;gap:12px">' +
            '<div>' +
              '<div style="font-weight:800;font-size:18px">Order #' + o.id + '</div>' +
              '<div style="color:var(--text-muted);font-size:13px">' + new Date(o.created_at).toLocaleString() + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div class="badge ' + getStatusBadge(o.status) + ' mb-1">' + o.status + '</div>' +
              '<div style="font-weight:800;color:var(--accent);font-size:20px">$' + parseFloat(o.total).toFixed(2) + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px">' +
            '<div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Items</div>' +
            itemsHtml +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '' +
      '<div class="empty-state">' +
        '<div class="empty-state-icon">⚠️</div>' +
        '<h3>Unable to load orders</h3>' +
        '<p>Please refresh the page and try again.</p>' +
        '<button class="btn btn-primary mt-3" onclick="loadMyOrders()">Retry</button>' +
      '</div>';
  }
}

function renderCheckout() {
  var container = document.getElementById('checkoutItems');
  if (!container) return;

  var cart = getCart();

  if (!cart.length) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">Your cart is empty</p>';
    var ct = document.getElementById('checkoutTotal');
    if (ct) ct.textContent = '$0.00';
    return;
  }

  var html = '';
  var total = 0;
  cart.forEach(function (i) {
    total += i.price * i.quantity;
    html += '' +
      '<div class="flex-between" style="padding:8px 0;font-size:14px;border-bottom:1px solid var(--border)">' +
        '<span>' + i.name + ' × ' + i.quantity + '</span>' +
        '<span style="font-weight:600">$' + (i.price * i.quantity).toFixed(2) + '</span>' +
      '</div>';
  });
  container.innerHTML = html;

  var ctEl = document.getElementById('checkoutTotal');
  if (ctEl) ctEl.textContent = '$' + total.toFixed(2);
}