import api from "../../shared/services/axios";

export const postCanvasCode = async (classId, canvasCode) => {
    try {
        const response = await api.post(`/classroom/${classId}/canvas`, { 
            api_key: canvasCode 
        });
        return response.data;
    } catch (error) {
        console.error("Error posting canvas code:", error);
        throw error;
    }
};
