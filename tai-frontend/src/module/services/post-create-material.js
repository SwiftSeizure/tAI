import axios from "axios";
import { API_BASE_URL } from "../../shared/constants/urls";

export const postCreateMaterial = async (dayID, fileName, formData) => {
    try {
        await axios.post(
            `${API_BASE_URL}/material/${dayID}/${fileName}`, // Fixed URL path
            formData, // Send FormData directly, not wrapped in object
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Explicit header
                },
                params: {  
                    dayID: dayID,
                    name: fileName // Send name as query parameter
                }
            }
        );
    } catch (error) {
        console.error('Error creating material:', error);
        throw error; // Re-throw to handle in calling function if needed
    }
};
