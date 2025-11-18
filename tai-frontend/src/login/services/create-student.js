import api from "../../shared/services/axios";
import { auth } from "../../auth/firebase";

export const createStudent = async (name, username) => { 
    const idToken = await auth.currentUser?.getIdToken();
    try {
        const response = await api.post('/student/new', {
            name: name,
            username: username
        }, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Student created:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};