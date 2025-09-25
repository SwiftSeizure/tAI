import axios from "axios";
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteDay = async (dayId) => {  
    try { 
        const url = `${API_BASE_URL}/days/${dayId}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting day:', error);
        throw error;
    }
};
