import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const createTeacher = async (name, username) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${BASE_URL}/teacher/new`, {
            name: name,
            username: username
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating teacher:', error);
        throw error;
    }
};