import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const deleteStudentFromClass = async (classroomID, studentID) => { 
    try { 
        const url = `${API_BASE_URL}/classroom/${classroomID}/${studentID}`;
        await axios.delete(url); 
        return;
    } 
    catch (error) { 
        console.error('Error deleting student from class:', error); 
        throw error; 
    } 
};