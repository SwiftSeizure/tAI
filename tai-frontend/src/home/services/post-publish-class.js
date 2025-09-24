import axios from "axios"; 

export const postPublishClass = async (classID) => {
    try {
        await axios.post(`http://localhost:8000/classroom/${classID}/publish`);
        return; 
    } catch (error) {
        throw error;
    }
}