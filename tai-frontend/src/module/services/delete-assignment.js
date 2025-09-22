import axios from "axios";

export const deleteAssignment = async (dayID, filename) => {  
    try {
        const url = `http://localhost:8000/assignments/${dayID}/${filename}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};
