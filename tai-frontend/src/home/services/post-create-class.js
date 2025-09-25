import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const postCreateClass = async (id, requestBody) => {
    try { 
        const response = await axios.post(`${API_BASE_URL}/home/teacher/${id}`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}