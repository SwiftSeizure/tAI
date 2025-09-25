import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteModule = async (moduleID) => {
    try {
        const url = `${API_BASE_URL}/module/${moduleID}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting module:', error);
        throw error;
    }
};
