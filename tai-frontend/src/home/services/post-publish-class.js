import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const postPublishClass = async (classID) => {
    try {
        await axios.post(`${API_BASE_URL}/classroom/${classID}/publish`);
        return; 
    } catch (error) {
        throw error;
    }
}