import api from "../../shared/services/axios";

export const deleteUnit = async (unitID) => {
    try {
        const url = `/unit/${unitID}`;
        await api.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting unit:', error);
        throw error;
    }
};
