
import axios from 'axios';

export const postCreateModule = async (unitID, moduleName) => { 
    
    const url = `http://localhost:8000/unit/${unitID}/modules`;
    const response = await axios.post(url, { name: moduleName });
    return response.data; 
    
};

