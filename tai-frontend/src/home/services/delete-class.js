import axios from "axios";  
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteClass = (classId) => { 
    const url = `${API_BASE_URL}/classroom/${classId}`;
    return axios.delete(url);
};
