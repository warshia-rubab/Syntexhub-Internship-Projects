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
// PROFILE LOGIC - FETCHES LOGGED-IN USER DATA
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

            // ✅ Update localStorage with latest data
            localStorage.setItem('user', JSON.stringify(user));

            // ✅ UPDATE SIDE PANEL WITH LOGGED-IN USER
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

            // Update profile with logged-in user data
            renderProfile(user);

            // Fill form with logged-in user data
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPhone').value = user.phone || '';

            // Store user for form submissions
            window.currentUser = user;

        } else {
            // If API fails, use stored user
            renderProfile(storedUser);
            window.currentUser = storedUser;
            updateSidePanel(storedUser);
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to stored user
        renderProfile(storedUser);
        window.currentUser = storedUser;
        updateSidePanel(storedUser);
    }

    // Setup event listeners
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
// RENDER PROFILE - Shows logged-in user data
// ============================================

function renderProfile(user) {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    // Avatar - shows logged-in user's initials
    document.getElementById('avatarInitials').textContent = initials;

    // Name & Email - shows logged-in user
    document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profileEmail').textContent = user.email;

    // Role - shows logged-in user's role
    const roleDisplay = user.role === 'admin' ? 'Administrator' : user.role;
    document.getElementById('profileRole').textContent = roleDisplay;
    document.getElementById('profileRoleText').textContent = user.role === 'admin' ? 'Admin' : user.role;

    // Phone - shows logged-in user's phone
    document.getElementById('profilePhone').textContent = user.phone || 'Not provided';

    // ✅ STATUS - shows logged-in user's status
    const isActive = user.isActive;
    const statusText = document.getElementById('profileStatus');

    if (statusText) {
        statusText.textContent = isActive ? 'Active' : 'Inactive';
        statusText.style.color = isActive ? '#065F46' : '#991B1B';
    }

    // Joined date - shows logged-in user's join date
    if (user.createdAt) {
        const date = new Date(user.createdAt);
        document.getElementById('profileJoined').textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('profileJoined').textContent = 'N/A';
    }
}

// ============================================
// SETUP EVENT LISTENERS
// ============================================

function setupEventListeners() {
    const user = window.currentUser;
    const token = localStorage.getItem('token');

    // Logout
    document.getElementById('logoutSideBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.closest('.password-input-wrapper').querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Update Profile - updates logged-in user only
    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const userData = {
            firstName: document.getElementById('editFirstName').value.trim(),
            lastName: document.getElementById('editLastName').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            phone: document.getElementById('editPhone').value.trim()
        };

        try {
            const response = await fetch(`http://localhost:5000/api/users/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                const updatedUser = { ...user, ...userData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.currentUser = updatedUser;
                showToast('✅ Profile updated successfully!', 'success');
                renderProfile(updatedUser);
                updateSidePanel(updatedUser);
            } else {
                showToast('❌ ' + data.message, 'error');
            }
        } catch (error) {
            showToast('❌ Server error. Please try again.', 'error');
        }
    });

    // Change Password - changes logged-in user's password
    document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            showToast('❌ Passwords do not match!', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showToast('❌ Password must be at least 6 characters.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (data.success) {
                showToast('✅ Password changed successfully!', 'success');
                document.getElementById('changePasswordForm').reset();
            } else {
                showToast('❌ ' + data.message, 'error');
            }
        } catch (error) {
            showToast('❌ Server error. Please try again.', 'error');
        }
    });
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