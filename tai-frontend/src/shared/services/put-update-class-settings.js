import axios from "axios"; 

export const putUpdateClassSettings = async (classID, requestBody) => { 

    const URL = `http://localhost:8000/classroom/${classID}`;
    try {
        const response = await axios.put(URL, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};