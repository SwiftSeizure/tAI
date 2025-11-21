import api from "./axios";

export const getMaterialsPrompts = async (classID) => {
    try {
        const response = await api.get(`/material/prompt/${classID}/all`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching materials prompts:", error);
        throw error;
    }
};
