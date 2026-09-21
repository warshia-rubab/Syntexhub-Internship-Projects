(function () {
  var saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function getThemeIcon(theme) {
  return theme === 'dark' ? '☀️' : '🌙';
}

function attachThemeToggle(btn) {
  if (!btn) return;
  var cur = document.documentElement.getAttribute('data-theme') || 'light';
  btn.textContent = getThemeIcon(cur);
  btn.title = cur === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  btn.style.fontSize = '20px';

  btn.onclick = function () {
    var c = document.documentElement.getAttribute('data-theme');
    var n = c === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem('theme', n);
    btn.textContent = getThemeIcon(n);
    btn.title = n === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  };
}

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('themeToggle');
  if (btn) attachThemeToggle(btn);
});