import api from "../../shared/services/axios";

export const postCreateMaterial = async (dayID, fileName, formData) => {
    try {
        await api.post(
            `/material/${dayID}/${fileName}`, // URL path with dayID and fileName
            formData, // Send FormData directly
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Explicit header
                },
                params: {  
                    name: fileName // Only send name as query parameter
                }
            }
        );
    } catch (error) {
        console.error('Error creating material:', error);
        throw error; // Re-throw to handle in calling function if needed
    }
};
