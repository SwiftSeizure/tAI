import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { API_BASE_URL } from '../constants/urls';

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use(
    async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            try {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error getting auth token:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;