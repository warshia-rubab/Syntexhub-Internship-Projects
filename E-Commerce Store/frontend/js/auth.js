async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Signing in...";
  try {
    const data = await apiCall("/auth/login", "POST", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    showToast("Welcome back, " + data.user.name + "!");
    setTimeout(() => {
      window.location.href = data.user.role === "admin" ? "/pages/admin/dashboard.html" : "/pages/home.html";
    }, 800);
  } catch (err) {
    showToast(err.message || "Invalid credentials", "error");
    btn.disabled = false; btn.textContent = "Sign In";
  }
}
async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Creating account...";
  try {
    await apiCall("/auth/register", "POST", { name, email, password });
    showToast("Account created! Please log in.");
    setTimeout(() => { window.location.href = "/pages/login.html"; }, 1000);
  } catch (err) {
    showToast(err.message || "Registration failed", "error");
    btn.disabled = false; btn.textContent = "Create Account";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const lf = document.getElementById("loginForm");
  if (lf) lf.addEventListener("submit", handleLogin);
  const rf = document.getElementById("registerForm");
  if (rf) rf.addEventListener("submit", handleRegister);
  const u = getCurrentUser();
  const un = document.getElementById("userName");
  if (un && u) un.textContent = u.name;
});
