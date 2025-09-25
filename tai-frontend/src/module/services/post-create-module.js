import api from "../../shared/services/axios";

export const postCreateModule = async (unitID, moduleName, settings) => { 
    
    try {
        const url = `/unit/${unitID}/module`;
        await api.post(url, { name: moduleName, settings: settings });
        return;
    } catch (error) {
        console.error('Error creating module:', error);
        throw error;
    }
};

