import api from "./axios";

export const getMaterialsPrompts = async () => {
    try {
        const response = await api.get("/material/prompt/all"); 
        console.log("Materials prompts:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching materials prompts:", error);
        throw error;
    }
};
