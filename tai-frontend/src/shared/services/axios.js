import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { API_BASE_URL } from '../constants/urls';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Store the refresh token promise to prevent multiple simultaneous refreshes
let refreshTokenPromise = null;

// Function to refresh the token
const refreshToken = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('No authenticated user');
        }
        
        const token = await user.getIdToken(true);
        localStorage.setItem('authToken', token);
        return token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('authToken');
        throw error;
    }
};

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Skip auth for login/register endpoints
        if (config.url.includes('/login') || config.url.includes('/register')) {
            return config;
        }

        // Get the token from localStorage
        let token = localStorage.getItem('authToken');
        
        // If no token, try to get a new one
        if (!token) {
            try {
                token = await refreshToken();
            } catch (error) {
                // If we can't get a token, redirect to login
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        }

        // Add the token to the request
        config.headers.Authorization = `Bearer ${token}`;
        return config;
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
                // Refresh the token
                const newToken = await refreshToken();
                
                // Update the Authorization header
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                
                // Retry the original request with the new token
                return api(originalRequest);
            } catch (error) {
                console.error('Failed to refresh token:', error);
                // Redirect to login if we can't refresh the token
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;