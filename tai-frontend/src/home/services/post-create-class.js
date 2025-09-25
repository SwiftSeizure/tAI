import api from "../../shared/services/axios";

export const postCreateClass = async (id, requestBody) => {
    try { 
        const response = await api.post(`/home/teacher/${id}`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}