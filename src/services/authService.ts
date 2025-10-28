// Authentication service for cookie-based authentication
export const authService = {
    // Check if user is authenticated by calling the backend
    async checkAuthentication() {
        try {
            // This will use the HTTP-only cookies automatically
            const response = await fetch('/api/auth/check', {
                method: 'GET',
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    authenticated: data.authenticated || false,
                    user: data.user || null
                };
            }
            return { authenticated: false, user: null };
        } catch (error) {
            console.error('Auth check failed:', error);
            return { authenticated: false, user: null };
        }
    },

    // Store authentication state in localStorage
    setAuthState(isAuthenticated: boolean, user: any = null) {
        localStorage.setItem('authState', JSON.stringify({
            isAuthenticated,
            user,
            timestamp: Date.now()
        }));
    },

    // Get authentication state from localStorage
    getAuthState() {
        try {
            const authState = localStorage.getItem('authState');
            if (authState) {
                const parsed = JSON.parse(authState);
                // Check if state is not too old (e.g., 24 hours)
                const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
                if (isExpired) {
                    this.clearAuthState();
                    return null;
                }
                return parsed;
            }
            return null;
        } catch (error) {
            console.error('Error reading auth state:', error);
            return null;
        }
    },

    // Clear authentication state
    clearAuthState() {
        localStorage.removeItem('authState');
    }
};
