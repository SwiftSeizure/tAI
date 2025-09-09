
import axios from 'axios';

export const postCreateModule = async (unitID, moduleName, settings) => { 
    
    const url = `http://localhost:8000/unit/${unitID}/module`;
    await axios.post(url, { name: moduleName, settings: settings });
    return;
};

