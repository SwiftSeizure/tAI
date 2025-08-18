import axios from "axios"; 

export const postCreateClass = async (id, requestBody) => {
    try { 
        console.log(id, "   ", requestBody);
        const response = await axios.post(`http://localhost:8000/home/teacher/${id}`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}