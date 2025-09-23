import axios from "axios"; 

export const deleteStudentFromClass = async (classroomID, studentID) => { 
    try { 
        const url = `http://localhost:8000/classroom/${classroomID}/${studentID}`;
        await axios.delete(url); 
        return;
    } 
    catch (error) { 
        console.error('Error deleting student from class:', error); 
        throw error; 
    } 
};