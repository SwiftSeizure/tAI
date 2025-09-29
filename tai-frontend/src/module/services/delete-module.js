import api from "../../shared/services/axios";

export const deleteModule = async (moduleID) => {
    try {
        const url = `/module/${moduleID}`;
        await api.delete(url);
        return;
    } catch (error) {
        console.error('Error deleting module:', error);
        throw error;
    }
};
