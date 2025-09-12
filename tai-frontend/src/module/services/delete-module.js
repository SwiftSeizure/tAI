import axios from "axios"; 

export const deleteModule = async (moduleID) => {
    try {
        const url = `http://localhost:8000/module/${moduleID}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting module:', error);
        throw error;
    }
};
