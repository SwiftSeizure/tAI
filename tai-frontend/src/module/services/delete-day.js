import api from "../../shared/services/axios";

export const deleteDay = async (dayId) => {  
    try { 
        const url = `/days/${dayId}`;
        await api.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting day:', error);
        throw error;
    }
};
