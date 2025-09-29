import axios from 'axios';
import { getAuth } from 'firebase/auth'; 
import { API_BASE_URL } from '../constants/urls';

const api = axios.create({
  baseURL: API_BASE_URL, // or your backend URL
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken(true);
        console.log('Frontend token:', token);
        console.log('Request URL:', config.baseURL + config.url);
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api;