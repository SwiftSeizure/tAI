import api from "../../shared/services/axios";

export const createStudent = async (name, username) => {
    try {
        const response = await api.post('/student/new', {
            name: name,
            username: username
        }, {
            headers: {
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