import axios from 'axios';

export const postCreateDay = async (moduleId, dayName) => { 
    const url = `http://localhost:8000/module/${moduleId}/day`;
    await axios.post(url, { name: dayName });
    return;
};
