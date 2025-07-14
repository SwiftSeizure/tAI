import axios from "axios"; 

export const postCreateClass = async (userID, requestBody) => {
    try {
        const response = await axios.post(`http://localhost:8000/home/teacher/${userID}`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}