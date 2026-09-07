// ============================================
// APPLY SAVED THEME ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

// ============================================
// DASHBOARD LOGIC - CLEAN VERSION
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    // ✅ UPDATE SIDE PANEL WITH LOGGED-IN USER
    updateSidePanel(user);

    // Update Date & Time
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Load stats
    loadStats();

    // Logout
    document.getElementById('logoutSideBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

});

// ============================================
// UPDATE DATE & TIME
// ============================================

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// ============================================
// UPDATE SIDE PANEL - SINGLE FUNCTION
// ============================================

function updateSidePanel(user) {
    const sideAvatar = document.getElementById('sideAvatar');
    const sideUserName = document.getElementById('sideUserName');
    const sideUserRole = document.getElementById('sideUserRole');

    if (sideAvatar) {
        sideAvatar.textContent = `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (sideUserName) {
        sideUserName.textContent = `${user.firstName} ${user.lastName}`;
    }
    if (sideUserRole) {
        sideUserRole.textContent = user.role;
    }
}

// ============================================
// LOAD STATS
// ============================================

async function loadStats() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/api/users/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const users = data.data;

            const total = users.length;
            const active = users.filter(u => u.isActive).length;
            const inactive = users.filter(u => !u.isActive).length;
            const admin = users.filter(u => u.role === 'admin').length;

            document.getElementById('totalUsers').textContent = total;
            document.getElementById('activeUsers').textContent = active;
            document.getElementById('inactiveUsers').textContent = inactive;
            document.getElementById('adminUsers').textContent = admin;

            // Create charts
            createDistributionChart(active, inactive, admin);
            createGrowthChart(total);
        }
    } catch (error) {
        console.error('Load stats error:', error);
    }
}

// ============================================
// USER DISTRIBUTION CHART
// ============================================

let distributionChart = null;

function createDistributionChart(active, inactive, admin) {
    const ctx = document.getElementById('userDistributionChart');
    if (!ctx) return;

    if (distributionChart) {
        distributionChart.destroy();
    }

    // Get theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#F1F5F9' : '#1E293B';
    const legendColor = isDark ? '#F1F5F9' : '#1E293B';

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Inactive', 'Admin'],
            datasets: [{
                data: [active, inactive, admin],
                backgroundColor: ['#10B981', '#EF4444', '#6C3CE1'],
                borderWidth: 2,
                borderColor: isDark ? '#1E293B' : '#FFFFFF',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: legendColor,
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// ============================================
// USER GROWTH CHART
// ============================================

let growthChart = null;

function createGrowthChart(total) {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;

    if (growthChart) {
        growthChart.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#F1F5F9' : '#1E293B';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const borderColor = isDark ? '#1E293B' : '#FFFFFF';

    // Generate data for last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [];
    let current = Math.max(0, total - 10);
    for (let i = 0; i < 7; i++) {
        current = current + Math.floor(Math.random() * 4) + 1;
        data.push(Math.min(current, total + 3));
    }

    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Users',
                data: data,
                borderColor: '#6C3CE1',
                backgroundColor: isDark ? 'rgba(108, 60, 225, 0.15)' : 'rgba(108, 60, 225, 0.08)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6C3CE1',
                pointBorderColor: borderColor,
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        stepSize: Math.max(1, Math.ceil(total / 6))
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 11,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// THEME CHANGE OBSERVER - Update Charts
// ============================================

// Listen for theme changes and update charts
const themeObserver = new MutationObserver(function() {
    const token = localStorage.getItem('token');
    if (token) {
        // Reload stats to redraw charts with new theme
        loadStats();
    }
});

// Observe the html element for data-theme changes
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

// Also update charts when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const token = localStorage.getItem('token');
        if (token) {
            loadStats();
        }
    }
});