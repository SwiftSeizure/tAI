import api from "./axios"; 

export const getAssignmentStudentPrompts = async ( assignmentID ) => {
    try {
        const response = await api.get(`/assignment/${assignmentID}/prompt`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching assignment student prompts:", error);
        throw error;
    }
};
