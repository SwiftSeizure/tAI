import api from "../../shared/services/axios";

export const postCanvasCode = async (classId, canvasCode) => { 
    try {
        const response = await api.post(`/classroom/${classId}/canvas`, { 
            api_key: canvasCode.api_key,
            class_id: canvasCode.class_id,
            domain_name: canvasCode.domain_name
        },
        {
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
        return response.data;
    } catch (error) {
        console.error("Error posting canvas code:", error);
        throw error;
    }
};
