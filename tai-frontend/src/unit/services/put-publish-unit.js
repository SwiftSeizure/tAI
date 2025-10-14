import api from "../../shared/services/axios"; 

export const putPublishUnit = async (unitID) => {
    try {
        const response = await api.put(`/unit/${unitID}/publish`);
        return response.data;
    } catch (error) {
        console.error('Error publishing unit:', error);
        throw error;
    }
};
