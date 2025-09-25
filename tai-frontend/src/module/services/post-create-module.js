
import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const postCreateModule = async (unitID, moduleName, settings) => { 
    
    const url = `${API_BASE_URL}/unit/${unitID}/module`;
    await axios.post(url, { name: moduleName, settings: settings });
    return;
};

