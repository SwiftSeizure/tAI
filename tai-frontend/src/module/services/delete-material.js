import axios from "axios";
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteMaterial = async (dayID, filename) => {  
    try {
        const url = `${API_BASE_URL}/material/${dayID}/${filename}`;
        await axios.delete(url);
        return;
        
    } catch (error) {
        console.error('Error deleting material:', error);
        throw error;
    }
}
