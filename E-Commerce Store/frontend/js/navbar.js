function renderNavbarActions() {
  var container = document.getElementById('navbarActions');
  if (!container) return;

  var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;

  var themeBtn = '<button class="btn-icon" id="themeToggle" title="Toggle theme">🌙</button>';

  if (user) {
    container.innerHTML =
      themeBtn +
      '<a href="/pages/cart.html" class="btn btn-outline btn-sm" style="position:relative">' +
        '🛒 Cart' +
        '<span id="cartBadge" class="badge badge-primary" style="position:absolute;top:-8px;right:-8px;display:none">0</span>' +
      '</a>' +
      '<span id="userName" style="color:var(--text-muted);font-size:14px">' + (user.name || '') + '</span>' +
      '<button class="btn btn-outline btn-sm" onclick="logout()">Logout</button>';
  } else {
    container.innerHTML =
      themeBtn +
      '<a href="/pages/login.html" class="btn btn-outline btn-sm">Sign In</a>' +
      '<a href="/pages/register.html" class="btn btn-primary btn-sm">Get Started</a>';
  }

  var btn = document.getElementById('themeToggle');
  if (btn && typeof attachThemeToggle === 'function') {
    attachThemeToggle(btn);
  } else if (btn) {
    var cur = document.documentElement.getAttribute('data-theme') || 'light';
    btn.textContent = cur === 'dark' ? '☀️' : '🌙';
    btn.onclick = function () {
      var c = document.documentElement.getAttribute('data-theme');
      var n = c === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', n);
      localStorage.setItem('theme', n);
      btn.textContent = n === 'light' ? '🌙' : '☀️';
    };
  }

  if (typeof updateCartBadge === 'function') updateCartBadge();
}

document.addEventListener('DOMContentLoaded', renderNavbarActions);