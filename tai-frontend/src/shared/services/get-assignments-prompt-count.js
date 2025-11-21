import api from "./axios"; 

export const getAssignmentsPrompts = async (classID) => {
    try {
        const response = await api.get(`/assignment/prompt/${classID}/all`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching assignments prompts:", error);
        throw error;
    }
};
