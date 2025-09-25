import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const getClasses = async (userID, role) => { 
    try { 
        const url = `${API_BASE_URL}/home/${role}/${userID}`;
        const response = await axios.get(url); 
        return response.data.classes;
    } 
    catch (error) { 
        console.error('Error fetching classes:', error); 
        throw error; 
    } 
};