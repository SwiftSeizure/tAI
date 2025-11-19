import api from "./axios"; 

export const getAssignmentsPrompts = async () => {
    try {
        const response = await api.get("/assignment/prompt/all"); 
        return response.data;
    } catch (error) {
        console.error("Error fetching assignments prompts:", error);
        throw error;
    }
};
