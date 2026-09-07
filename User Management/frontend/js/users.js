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
// USER LIST LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', async function() {

    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !storedUser) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // ✅ FETCH LATEST USER DATA FROM API
        const response = await fetch('http://localhost:5000/api/users/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const user = data.data;
            localStorage.setItem('user', JSON.stringify(user));
            updateSidePanel(user);
            window.currentUser = user;
        } else {
            updateSidePanel(storedUser);
            window.currentUser = storedUser;
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        updateSidePanel(storedUser);
        window.currentUser = storedUser;
    }

    // ✅ LOAD USERS
    await loadUsers();

    // ✅ SETUP EVENT LISTENERS
    setupEventListeners();

});

// ============================================
// UPDATE SIDE PANEL
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
// SETUP EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Logout
    document.getElementById('logoutSideBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Search & Filter
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearFilters = document.getElementById('clearFilters');
    const exportBtn = document.getElementById('exportBtn');

    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }
    if (roleFilter) {
        roleFilter.addEventListener('change', filterUsers);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }

    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (roleFilter) roleFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            filterUsers();
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportUsers);
    }
}

// ============================================
// LOAD USERS
// ============================================

async function loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found');
        return;
    }

    try {
        console.log('📊 Loading users...');
        const response = await fetch('http://localhost:5000/api/users/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('📥 Users response:', data);

        if (data.success) {
            const users = data.data;
            const tbody = document.getElementById('usersTableBody');

            if (tbody) {
                tbody.innerHTML = users.map((user, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${user.firstName} ${user.lastName}</strong></td>
                        <td>${user.email}</td>
                        <td><span class="badge bg-${user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'info'}">${user.role}</span></td>
                        <td>
                            <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                                ${user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-warning toggle-status" data-id="${user._id}">
                                <i class="fas ${user.isActive ? 'fa-ban' : 'fa-check'}"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-user" data-id="${user._id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');

                // Attach event listeners to buttons
                document.querySelectorAll('.toggle-status').forEach(btn => {
                    btn.addEventListener('click', () => toggleUserStatus(btn.dataset.id));
                });
                document.querySelectorAll('.delete-user').forEach(btn => {
                    btn.addEventListener('click', () => deleteUser(btn.dataset.id));
                });

                const visibleCount = document.getElementById('visibleCount');
                if (visibleCount) {
                    visibleCount.textContent = users.length;
                }

                console.log(`✅ Loaded ${users.length} users`);
            }
        } else {
            console.error('❌ API error:', data.message);
        }
    } catch (error) {
        console.error('❌ Load users error:', error);
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error loading users: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
}

// ============================================
// TOGGLE USER STATUS
// ============================================

async function toggleUserStatus(id) {
    if (!confirm('Toggle user status?')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/users/toggle-status/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            showToast('✅ ' + data.message, 'success');
            await loadUsers();
        }
    } catch (error) {
        console.error('Toggle error:', error);
        showToast('❌ Error toggling status', 'error');
    }
}

// ============================================
// DELETE USER
// ============================================

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:5000/api/users/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            showToast('✅ User deleted', 'success');
            await loadUsers();
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('❌ Error deleting user', 'error');
    }
}

// ============================================
// FILTER USERS
// ============================================

function filterUsers() {
    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const roleFilter = document.getElementById('roleFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    const rows = document.querySelectorAll('#usersTableBody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const name = row.querySelector('td:nth-child(2)')?.textContent?.toLowerCase() || '';
        const email = row.querySelector('td:nth-child(3)')?.textContent?.toLowerCase() || '';
        const role = row.querySelector('td:nth-child(4) .badge')?.textContent?.toLowerCase() || '';
        const status = row.querySelector('td:nth-child(5) .status-badge')?.textContent?.toLowerCase() || '';

        let matches = true;

        if (searchTerm && !name.includes(searchTerm) && !email.includes(searchTerm) && !role.includes(searchTerm)) {
            matches = false;
        }

        if (roleFilter && role !== roleFilter) {
            matches = false;
        }

        if (statusFilter) {
            const statusMap = { 'active': 'active', 'inactive': 'inactive' };
            const rowStatus = statusMap[status] || '';
            if (rowStatus !== statusFilter) {
                matches = false;
            }
        }

        row.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
    });

    const visibleCountEl = document.getElementById('visibleCount');
    if (visibleCountEl) {
        visibleCountEl.textContent = visibleCount;
    }
}

// ============================================
// EXPORT USERS
// ============================================

function exportUsers() {
    const rows = document.querySelectorAll('#usersTableBody tr');
    let csv = 'Name,Email,Role,Status\n';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && row.style.display !== 'none') {
            const name = cells[1]?.textContent?.trim() || '';
            const email = cells[2]?.textContent?.trim() || '';
            const role = cells[3]?.textContent?.trim() || '';
            const status = cells[4]?.textContent?.trim() || '';
            csv += `"${name}","${email}","${role}","${status}"\n`;
        }
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('✅ Users exported!', 'success');
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