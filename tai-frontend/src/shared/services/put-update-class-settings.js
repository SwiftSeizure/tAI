import axios from "axios";

export const putUpdateClassSettings = async (classID, requestBody) => {
    if (!classID) {
        throw new Error('Class ID is required');
    }

    const URL = `http://localhost:8000/classroom/${classID}`;
    
    try {
        const response = await axios.put(URL, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        return response;
    } catch (error) {
        if (error.response) {
            throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } 
        else if (error.request) {
            throw new Error('Network error: No response from server');
        } 
        else {
            throw new Error(`Request error: ${error.message}`);
        }
    }
};