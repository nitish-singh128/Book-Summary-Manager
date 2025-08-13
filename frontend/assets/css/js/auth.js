// Authentication Manager
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.isAuthenticated()) {
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }

        this.bindEvents();
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Handle logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Clear previous error messages
        this.hideError();

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        try {
            // Wait for Excel database to be ready
            if (!window.excelDB) {
                console.error('❌ Excel database not found');
                throw new Error('Excel database not initialized');
            }
            
            console.log('🔄 Waiting for database initialization...');
            await window.excelDB.waitForInit();
            console.log('✅ Database ready, attempting authentication...');

            // Authenticate against Excel database
            const user = await window.excelDB.authenticateUser(username, password);

            if (user) {
                // Store authentication data in the expected format
                const authData = {
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    loginTime: new Date().toISOString(),
                    isAuthenticated: true
                };
                
                if (rememberMe) {
                    localStorage.setItem('authData', JSON.stringify(authData));
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    sessionStorage.setItem('authData', JSON.stringify(authData));
                    sessionStorage.setItem('tempSession', 'true');
                }
                
                // Also store user data separately for compatibility
                localStorage.setItem('userData', JSON.stringify(user));
                
                this.showSuccess('Login successful! Redirecting to dashboard...');
                
                // Debug: Clear any existing localStorage issues
                console.log('✅ Login successful for user:', user.username, 'Role:', user.role);
                
                // Role-based redirection
                let dashboardUrl = 'dashboard.html'; // Default dashboard
                if (user.role === 'admin') {
                    dashboardUrl = 'admin-dashboard.html';
                    this.showSuccess('Admin login successful! Redirecting to admin dashboard...');
                } else if (user.role === 'platinum') {
                    dashboardUrl = 'platinum-dashboard.html';
                    this.showSuccess('Platinum member login successful! Redirecting to platinum dashboard...');
                } else if (user.role === 'gold') {
                    dashboardUrl = 'gold-dashboard.html';
                    this.showSuccess('Gold member login successful! Redirecting to enhanced dashboard...');
                } else if (user.role === 'silver') {
                    dashboardUrl = 'simple-dashboard.html'; // Use simple dashboard for silver users
                    this.showSuccess('Silver member login successful! Redirecting to premium dashboard...');
                } else if (user.role === 'diamond') {
                    dashboardUrl = 'diamond-dashboard.html';
                    this.showSuccess('Diamond member login successful! Redirecting to premium dashboard...');
                } else if (user.role === 'user') {
                    dashboardUrl = 'user-dashboard.html';
                    this.showSuccess('User login successful! Redirecting to user dashboard...');
                } else {
                    dashboardUrl = 'dashboard.html';
                    this.showSuccess('Login successful! Redirecting to dashboard...');
                }
                
                console.log('🔄 Redirecting to:', dashboardUrl);
                
                setTimeout(() => {
                    window.location.href = dashboardUrl;
                }, 500);
            } else {
                this.showError('Invalid username or password');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'Login failed');
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            this.clearAuthentication();
            this.showNotification('Successfully signed out!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }

    validateCredentials(username, password) {
        // This method is deprecated - authentication now handled by Excel database
        return false;
    }

    setAuthentication(username, rememberMe) {
        const authData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAuthenticated: true
        };

        if (rememberMe) {
            localStorage.setItem('authData', JSON.stringify(authData));
        } else {
            sessionStorage.setItem('authData', JSON.stringify(authData));
        }
    }

    clearAuthentication() {
        localStorage.removeItem('authData');
        sessionStorage.removeItem('authData');
    }

    isAuthenticated() {
        const localAuth = localStorage.getItem('authData');
        const sessionAuth = sessionStorage.getItem('authData');
        
        console.log('🔍 Checking authentication:', {
            hasLocal: !!localAuth,
            hasSession: !!sessionAuth
        });
        
        if (localAuth || sessionAuth) {
            try {
                const authData = JSON.parse(localAuth || sessionAuth);
                const isAuth = authData && authData.isAuthenticated;
                console.log('✅ Authentication result:', isAuth, 'for user:', authData?.username);
                return isAuth;
            } catch (e) {
                console.log('❌ Authentication parse error:', e);
                return false;
            }
        }
        console.log('❌ No authentication data found');
        return false;
    }

    getCurrentUser() {
        const localAuth = localStorage.getItem('authData');
        const sessionAuth = sessionStorage.getItem('authData');
        
        if (localAuth || sessionAuth) {
            try {
                return JSON.parse(localAuth || sessionAuth);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.className = 'error-message';
        }
    }

    showSuccess(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.className = 'success-message';
        }
    }

    hideError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Get user display name for UI
    getUserDisplayName() {
        const user = this.getCurrentUser();
        if (user) {
            // Return full name if available, otherwise fallback to username
            return user.fullName || user.username;
        }
        return 'Guest';
    }

    // Get login time for session info
    getLoginTime() {
        const user = this.getCurrentUser();
        if (user && user.loginTime) {
            return new Date(user.loginTime).toLocaleString();
        }
        return null;
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Auto-focus username field on login page
document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.focus();
    }
});

// Handle Enter key on form inputs
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('loginForm')) {
        const form = document.getElementById('loginForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
}); 