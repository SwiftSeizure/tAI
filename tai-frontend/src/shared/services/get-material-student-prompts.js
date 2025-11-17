import api from "./axios"; 

export const getMaterialStudentPrompts = async ( materialID ) => {
    try {
        const response = await api.get(`/material/${materialID}/prompt`); 
        console.log("Material student prompts:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching material student prompts:", error);
        throw error;
    }
};
