import api from "../../shared/services/axios";
import { auth } from "../../auth/firebase";

export const createTeacher = async (name, username) => {
    try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) {
            throw new Error('No authentication token found');
        }

        const response = await api.post(`/teacher/new`, {
            name: name,
            username: username
        }, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating teacher:', error);
        throw error;
    }
};