import api from "../../shared/services/axios";

export const getClasses = async (userID, role) => { 
    try { 
        const url = `/home/${role}/${userID}`;
        const response = await api.get(url); 
        return response.data.classes;
    } 
    catch (error) { 
        console.error('Error fetching classes:', error); 
        
        // If student is not found (404), they might be a newly created student with no classes
        if (error.response && error.response.status === 404 && role === 'student') {
            return []; // Return empty array for new students
        }
        
        throw error; 
    } 
};