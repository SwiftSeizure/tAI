import axios from "axios";  
import { API_BASE_URL } from "../../shared/constants/urls";

export const getStudentsEnrolled = async (classroomID) => { 
    try {   
        console.log("Fetching students enrolled for classroom:", classroomID); 
        const url = `${API_BASE_URL}/classroom/${classroomID}/students`;
        const response = await axios.get(url); 
        return response.data; 
    } 
    catch (error) { 
        console.error('Error fetching students enrolled:', error); 
        throw error; 
    } 
};