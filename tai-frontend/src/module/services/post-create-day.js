import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const postCreateDay = async (moduleId, dayName) => { 
    const url = `${API_BASE_URL}/module/${moduleId}/day`;
    await axios.post(url, { name: dayName });
    return;
};
