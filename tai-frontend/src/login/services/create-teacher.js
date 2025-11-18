import api from "../../shared/services/axios";

export const createTeacher = async (name, username) => {
    try {

        const response = await api.post(`/teacher/new`, {
            name: name,
            username: username
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating teacher:', error);
        throw error;
    }
};