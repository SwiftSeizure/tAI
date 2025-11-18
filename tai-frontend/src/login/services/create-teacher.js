import api from "../../shared/services/axios";

export const createTeacher = async (name, username) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await api.post(`/teacher/new`, {
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