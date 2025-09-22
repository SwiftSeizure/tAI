import axios from "axios"; 

export const getStudentsEnrolled = async (classroomID) => { 
    try {   
        console.log("Fetching students enrolled for classroom:", classroomID); 
        const url = `http://localhost:8000/classroom/${classroomID}/students`;
        const response = await axios.get(url); 
        return response.data; 
    } 
    catch (error) { 
        console.error('Error fetching students enrolled:', error); 
        throw error; 
    } 
};