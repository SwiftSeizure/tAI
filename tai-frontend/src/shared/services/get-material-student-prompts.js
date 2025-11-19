import api from "./axios"; 

export const getMaterialStudentPrompts = async ( materialID ) => {
    try {
        const response = await api.get(`/material/${materialID}/prompt`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching material student prompts:", error);
        throw error;
    }
};
