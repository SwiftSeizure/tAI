import api from "../../shared/services/axios";

export const deleteMaterial = async (dayID, filename) => {  
    try {
        const url = `/material/${dayID}/${filename}`;
        await api.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting material:', error);
        throw error;
    }
}
