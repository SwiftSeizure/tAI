import api from "./axios";

export const putUpdateTeacher = async (teacherID, name) => {
    try {
        const response = await api.put(`/teacher/${teacherID}`, {
            name: name
        });
        return response.data;
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
};