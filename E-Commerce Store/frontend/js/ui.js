function showToast(message, type) {
  type = type || "success";
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();
  var toast = document.createElement("div");
  toast.className = "toast" + (type !== "success" ? " " + type : "");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSkeletonGrid(container, count) {
  count = count || 8;
  var card = '<div class="product-card" style="pointer-events:none;opacity:0.6"><div class="product-image-wrap" style="background:var(--surface-2)"></div><div class="product-body"><div style="height:12px;width:40%;background:var(--surface-2);border-radius:4px;margin-bottom:12px"></div><div style="height:16px;width:80%;background:var(--surface-2);border-radius:4px;margin-bottom:8px"></div><div style="height:12px;width:60%;background:var(--surface-2);border-radius:4px;margin-bottom:16px"></div><div style="height:24px;width:30%;background:var(--surface-2);border-radius:4px"></div></div></div>';
  var html = "";
  for (var i = 0; i < count; i++) html += card;
  container.innerHTML = html;
}

function renderEmpty(container, icon, title, subtitle, ctaHtml) {
  subtitle = subtitle || "";
  ctaHtml = ctaHtml || "";
  container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">' + icon + '</div><h3>' + title + '</h3>' + (subtitle ? '<p style="margin-bottom:20px">' + subtitle + '</p>' : '') + ctaHtml + '</div>';
}