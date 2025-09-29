import api from "../../shared/services/axios";

export const postPublishClass = async (classID) => {
    try {
        await api.put(`/classroom/${classID}/publish`);
        return; 
    } catch (error) {
        throw error;
    }
}