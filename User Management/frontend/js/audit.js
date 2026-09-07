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
// AUDIT LOGS LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('sideAvatar').textContent = `${user.firstName[0]}${user.lastName[0]}`;
    document.getElementById('sideUserName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('sideUserRole').textContent = user.role;

    loadAuditLogs();

    document.getElementById('refreshAudit').addEventListener('click', loadAuditLogs);
    document.getElementById('clearAudit').addEventListener('click', clearAuditLogs);
    document.getElementById('auditSearch').addEventListener('input', filterAuditLogs);
    document.getElementById('auditLevel').addEventListener('change', filterAuditLogs);

    document.getElementById('logoutSideBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

});

async function loadAuditLogs() {
    try {
        const response = await fetch('http://localhost/log_handler.php');
        const data = await response.json();

        const tbody = document.getElementById('auditTableBody');

        if (data.success && data.data && data.data.length > 0) {
            const logs = data.data;

            // Update stats
            document.getElementById('totalLogs').textContent = logs.length;
            document.getElementById('todayLogs').textContent = logs.filter(l => 
                l.timestamp && l.timestamp.startsWith(new Date().toISOString().split('T')[0])
            ).length;
            document.getElementById('errorLogs').textContent = logs.filter(l => l.level === 'ERROR').length;
            document.getElementById('uniqueUsers').textContent = [...new Set(logs.map(l => l.user_id))].filter(Boolean).length;
            document.getElementById('last24hCount').textContent = logs.filter(l => {
                if (!l.timestamp) return false;
                const logDate = new Date(l.timestamp);
                const now = new Date();
                const diff = (now - logDate) / (1000 * 60 * 60);
                return diff <= 24;
            }).length;
            document.getElementById('totalCount').textContent = logs.length;
            document.getElementById('showingCount').textContent = logs.length;

            // Render table
            tbody.innerHTML = logs.slice(0, 100).map((log, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${log.timestamp || 'N/A'}</td>
                    <td><span class="log-level ${(log.level || 'info').toLowerCase()}">${log.level || 'INFO'}</span></td>
                    <td>${log.user_id ? log.user_id.substring(0, 8) : 'System'}</td>
                    <td>${log.message || 'No message'}</td>
                    <td>${log.ip || 'N/A'}</td>
                </tr>
            `).join('');

        } else {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No logs found</td></tr>`;
            document.getElementById('totalLogs').textContent = '0';
            document.getElementById('todayLogs').textContent = '0';
            document.getElementById('errorLogs').textContent = '0';
            document.getElementById('uniqueUsers').textContent = '0';
            document.getElementById('totalCount').textContent = '0';
            document.getElementById('showingCount').textContent = '0';
            document.getElementById('last24hCount').textContent = '0';
        }

        // Update last updated time
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();

    } catch (error) {
        console.error('Load audit logs error:', error);
        document.getElementById('auditTableBody').innerHTML = `
            <tr><td colspan="6" class="text-center text-danger">Error loading logs</td></tr>
        `;
    }
}

function filterAuditLogs() {
    const searchTerm = document.getElementById('auditSearch').value.toLowerCase();
    const levelFilter = document.getElementById('auditLevel').value;

    const rows = document.querySelectorAll('#auditTableBody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const level = row.querySelector('.log-level')?.textContent?.toLowerCase() || '';

        let show = true;
        if (searchTerm && !text.includes(searchTerm)) show = false;
        if (levelFilter && level !== levelFilter.toLowerCase()) show = false;

        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    document.getElementById('showingCount').textContent = visibleCount;
}

async function clearAuditLogs() {
    if (!confirm('Are you sure you want to clear all logs?')) return;

    try {
        const response = await fetch('http://localhost/log_handler.php', {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            showToast('✅ Logs cleared successfully!', 'success');
            loadAuditLogs();
        }
    } catch (error) {
        showToast('❌ Error clearing logs', 'error');
    }
}

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