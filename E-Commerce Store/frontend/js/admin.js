async function loadDashboard() {
  if (!requireAuth()) return;

  var user = getCurrentUser();
  if (!user || user.role !== "admin") {
    showToast("Admin access required", "error");
    setTimeout(function () { window.location.href = "/pages/home.html"; }, 1200);
    return;
  }

  console.log("Loading dashboard...");

  try {
    var stats = await apiCall("/admin/stats");
    console.log("Stats loaded:", stats);

    var su = document.getElementById("statUsers");
    if (su) su.textContent = stats.users;
    var sp = document.getElementById("statProducts");
    if (sp) sp.textContent = stats.products;
    var so = document.getElementById("statOrders");
    if (so) so.textContent = stats.orders;
    var sr = document.getElementById("statRevenue");
    if (sr) sr.textContent = "$" + parseFloat(stats.revenue).toFixed(2);

    renderSalesChart(stats.salesChart);
    await renderActivityLogs();
  } catch (err) {
    console.error("Dashboard load failed:", err);
    showToast("Failed to load dashboard: " + err.message, "error");
  }
}

function renderSalesChart(data) {
  var ctx = document.getElementById("salesChart");
  if (!ctx) return;

  var emptyEl = document.getElementById("chartEmpty");

  if (!data || !data.length) {
    ctx.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }

  function formatDay(d) {
    if (!d) return "";
    var date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  var isDark = document.documentElement.getAttribute("data-theme") === "dark";
  var textColor = isDark ? "#CBD5E1" : "#334155";
  var gridColor = isDark ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.15)";
  var accentColor = "#6366F1";
  var fillColor = isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)";

  var labels = data.map(function (d) { return formatDay(d.day); });
  var values = data.map(function (d) { return parseFloat(d.total) || 0; });

  if (labels.length === 1) {
    labels.unshift("Start");
    values.unshift(0);
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Sales",
        data: values,
        borderColor: accentColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: accentColor,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#10B981",
        pointHoverBorderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? "#1E293B" : "#0F172A",
          titleColor: "#F1F5F9",
          bodyColor: "#F1F5F9",
          borderColor: accentColor,
          borderWidth: 1,
          padding: 14,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (item) {
              return "$" + item.parsed.y.toFixed(2) + " in sales";
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor, drawBorder: false },
          ticks: {
            color: textColor,
            font: { size: 12 },
            callback: function (value) { return "$" + value.toLocaleString(); }
          },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 12 } },
          border: { display: false }
        }
      }
    }
  });
}

async function renderActivityLogs() {
  var container = document.getElementById("activityLogs");
  if (!container) return;

  try {
    var logs = await apiCall("/admin/logs");
    if (!logs || !logs.length) {
      container.innerHTML = '<div class="empty-state" style="padding:40px 20px"><p style="color:var(--text-muted)">No activity yet</p></div>';
      return;
    }

    container.innerHTML =
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">' +
        '<thead><tr style="background:var(--surface-2);text-transform:uppercase;font-size:11px;letter-spacing:0.5px">' +
          '<th style="padding:12px;text-align:left;color:var(--text-muted);font-weight:700">Time</th>' +
          '<th style="padding:12px;text-align:left;color:var(--text-muted);font-weight:700">User</th>' +
          '<th style="padding:12px;text-align:left;color:var(--text-muted);font-weight:700">Action</th>' +
          '<th style="padding:12px;text-align:left;color:var(--text-muted);font-weight:700">IP</th>' +
        '</tr></thead>' +
        '<tbody>' +
          logs.slice(0, 15).map(function (l) {
            return '<tr style="border-bottom:1px solid var(--border)">' +
              '<td style="padding:12px;font-size:13px;color:var(--text-secondary)">' + new Date(l.created_at).toLocaleString() + '</td>' +
              '<td style="padding:12px;font-size:13px;font-weight:600;color:var(--text)">' + (l.name || "system") + '</td>' +
              '<td style="padding:12px;font-size:13px;color:var(--text-secondary)">' + l.action + '</td>' +
              '<td style="padding:12px;font-size:12px;color:var(--text-muted)">' + (l.ip || "-") + '</td>' +
            '</tr>';
          }).join("") +
        '</tbody>' +
      '</table></div>';
  } catch (err) {
    console.error("Logs failed:", err);
    container.innerHTML = '<div class="empty-state" style="padding:40px 20px"><p style="color:var(--text-muted)">Unable to load activity. ' + err.message + '</p></div>';
  }
}