import api from './axios';

export const putUpdateStudent = async (studentID, name) => {
    try {
        const response = await api.put(`/student/${studentID}`, {
            name: name
        });
        return response.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};
