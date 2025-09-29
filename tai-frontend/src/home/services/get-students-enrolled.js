import api from "../../shared/services/axios";

export const getStudentsEnrolled = async (classroomID) => { 
    try {   
        console.log("Fetching students enrolled for classroom:", classroomID); 
        const url = `/classroom/${classroomID}/students`;
        const response = await api.get(url); 
        return response.data; 
    } 
    catch (error) { 
        console.error('Error fetching students enrolled:', error); 
        throw error; 
    } 
};