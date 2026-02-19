import { create } from 'zustand';
import Cookies from 'js-cookie'; // You'll need to run: npm install js-cookie

export const useAuthStore = create((set) => ({
    user: null,
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),

    // Set Login State
    setLogin: (userData, token) => {
        // 1. Save to Cookie (so Middleware can see it)
        Cookies.set('token', token, { expires: 7 }); // Expires in 7 days

        // 2. Update Zustand State
        set({ user: userData, token: token, isAuthenticated: true });
    },

    // Handle Logout
    setLogout: () => {
        Cookies.remove('token');
        localStorage.removeItem('token'); // Clean up both
        set({ user: null, token: null, isAuthenticated: false });
    }
}));