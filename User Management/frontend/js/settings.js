// ============================================
// SETTINGS LOGIC - With Global Dark Mode
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    // Side panel user info
    document.getElementById('sideAvatar').textContent = `${user.firstName[0]}${user.lastName[0]}`;
    document.getElementById('sideUserName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('sideUserRole').textContent = user.role;

    // Load total users
    loadUserCount();

    // ============================================
    // DARK MODE - Global Toggle
    // ============================================

    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme to ALL pages
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            showToast('🌙 Dark Mode enabled globally', 'success');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            showToast('☀️ Light Mode enabled globally', 'success');
        }
    });

    // ============================================
    // COMPACT MODE
    // ============================================

    const compactToggle = document.getElementById('compactToggle');
    const compactMode = localStorage.getItem('compactMode') === 'true';

    if (compactMode) {
        document.body.classList.add('compact-mode');
        compactToggle.checked = true;
    }

    compactToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('compact-mode');
            localStorage.setItem('compactMode', 'true');
            showToast('📐 Compact Mode enabled', 'success');
        } else {
            document.body.classList.remove('compact-mode');
            localStorage.setItem('compactMode', 'false');
            showToast('📐 Compact Mode disabled', 'success');
        }
    });

    // ============================================
    // FONT SIZE
    // ============================================

    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';

    fontSizeSelect.value = savedFontSize;
    document.documentElement.style.fontSize = getFontSizeValue(savedFontSize);

    fontSizeSelect.addEventListener('change', function() {
        const size = this.value;
        localStorage.setItem('fontSize', size);
        document.documentElement.style.fontSize = getFontSizeValue(size);
        showToast(`🔤 Font size changed to ${size}`, 'success');
    });

    function getFontSizeValue(size) {
        switch(size) {
            case 'small': return '13px';
            case 'medium': return '15px';
            case 'large': return '17px';
            case 'xlarge': return '19px';
            default: return '15px';
        }
    }

    // ============================================
    // LOGOUT
    // ============================================

    document.getElementById('logoutSideBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // ============================================
    // CLEAR LOGS
    // ============================================

    document.getElementById('clearLogsBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all logs?')) {
            fetch('http://localhost/log_handler.php', {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                showToast('✅ Logs cleared successfully!', 'success');
            })
            .catch(() => {
                showToast('❌ Error clearing logs', 'error');
            });
        }
    });

});

// ============================================
// LOAD USER COUNT
// ============================================

async function loadUserCount() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('totalUsersSettings').textContent = data.data.length;
        }
    } catch (error) {
        console.error('Error loading user count:', error);
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
        const el = document.createElement('div');
        el.className = 'toast-container';
        document.body.appendChild(el);
        return el;
    })();

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}