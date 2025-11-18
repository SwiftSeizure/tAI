import api from "./axios"; 

export const getMaterialStudentChat = async (materialID, studentID) => {
    try {
        const response = await api.get(`/material/${materialID}/${studentID}/prompt`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student chat:", error);
        throw error;
    }
};
