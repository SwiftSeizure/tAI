import axios from "axios"; 

export const deleteUnit = async (unitID) => {
    try {
        const url = `http://localhost:8000/unit/${unitID}`;
        await axios.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting unit:', error);
        throw error;
    }
};
