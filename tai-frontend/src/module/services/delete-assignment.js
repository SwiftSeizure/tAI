import api from "../../shared/services/axios";

export const deleteAssignment = async (dayID, filename) => {  
    try {
        const url = `/assignment/${dayID}/${filename}`;
        await api.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};
