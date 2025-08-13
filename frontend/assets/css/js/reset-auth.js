// Reset authentication state
function resetAuth() {
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('tempSession');
    console.log('🔄 Authentication state reset');
}

// Auto-reset on page load if needed
if (window.location.pathname.includes('login.html')) {
    // Clear any old authentication data when loading login page
    resetAuth();
    console.log('🧹 Cleared old auth data for fresh login');
}

// Make resetAuth available globally for debugging
window.resetAuth = resetAuth; 