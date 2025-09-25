import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteUnit = async (unitID) => {
    try {
        const url = `${API_BASE_URL}/unit/${unitID}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting unit:', error);
        throw error;
    }
};
