import axios from "axios";
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteAssignment = async (dayID, filename) => {  
    try {
        const url = `${API_BASE_URL}/assignment/${dayID}/${filename}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};
