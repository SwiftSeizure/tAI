import axios from "axios";

export const deleteDay = async (dayId) => {  
    try { 
        const url = `http://localhost:8000/days/${dayId}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting day:', error);
        throw error;
    }
};
