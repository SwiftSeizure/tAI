import api from "./axios";

export const getMaterialsPrompts = async () => {
    try {
        const response = await api.get("/material/prompt/all");
        return response.data;
    } catch (error) {
        console.error("Error fetching materials prompts:", error);
        throw error;
    }
};
