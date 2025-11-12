import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { API_BASE_URL } from '../constants/urls';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Promise that resolves when Firebase auth is ready
let authReadyPromise = null;

const waitForAuthReady = () => {
    if (!authReadyPromise) {
        authReadyPromise = new Promise((resolve) => {
            const auth = getAuth();
            // This will immediately resolve if auth is already initialized
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            });
        });
    }
    return authReadyPromise;
};

// Function to refresh the token
const refreshToken = async () => {
    try {
        // Wait for auth to be ready first
        await waitForAuthReady();
        
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('No authenticated user');
        }
        
        const token = await user.getIdToken(true);
        return token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Skip auth for login/register endpoints
        if (config.url?.includes('/login') || config.url?.includes('/register')) {
            return config;
        }

        try {
            // Wait for Firebase auth to be ready
            await waitForAuthReady();
            
            const auth = getAuth();
            const user = auth.currentUser;
            
            // If no user, redirect to login
            if (!user) {
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(new Error('No authenticated user'));
            }
            
            // Get fresh token from Firebase (it handles caching internally)
            const token = await user.getIdToken();
            
            // Add the token to the request
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        } catch (error) {
            console.error('Error in request interceptor:', error);
            // Only redirect if we're not already on the login page
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't already tried to refresh the token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Get a fresh token
                const newToken = await refreshToken();
                
                // Update the Authorization header
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                
                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                // Redirect to login if we can't refresh the token
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;