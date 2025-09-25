import api from "../../shared/services/axios";

export const getClasses = async (userID, role) => { 
    try { 
        const url = `/home/${role}/${userID}`;
        const response = await api.get(url); 
        return response.data.classes;
    } 
    catch (error) { 
        console.error('Error fetching classes:', error); 
        throw error; 
    } 
};