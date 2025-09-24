import axios from "axios";

export const deleteMaterial = async (dayID, filename) => {  
    try {
        const url = `http://localhost:8000/material/${dayID}/${filename}`;
        await axios.delete(url);
        return;
        
    } catch (error) {
        console.error('Error deleting material:', error);
        throw error;
    }
}
