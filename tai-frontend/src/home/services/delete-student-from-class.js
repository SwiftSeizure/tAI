import api from "../../shared/services/axios";

export const deleteStudentFromClass = async (classroomID, studentID) => { 
    try { 
        const url = `/classroom/${classroomID}/${studentID}`;
        await api.delete(url); 
        return;
    } 
    catch (error) { 
        console.error('Error deleting student from class:', error); 
        throw error; 
    }
};