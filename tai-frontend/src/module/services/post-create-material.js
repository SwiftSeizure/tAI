import api from "../../shared/services/axios";

export const postCreateMaterial = async (dayID, fileName, formData) => {
    try {
        await api.post(
            `/material/${dayID}/${fileName}`, // Fixed URL path
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
