const API_BASE = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }
async function apiCall(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  try {
    const res = await fetch(API_BASE + endpoint, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.detail || "Request failed");
    return data;
  } catch (e) { console.error("API Error:", e.message); throw e; }
}
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast" + (type !== "success" ? " " + type : "");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 3000);
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/pages/login.html";
}
function requireAuth() {
  if (!getToken()) { window.location.href = "/pages/login.html"; return false; }
  return true;
}
function getCurrentUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}
