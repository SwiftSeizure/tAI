import api from "./axios"; 

export const getAssignmentStudentPrompts = async ( assignmentID ) => {
    try {
        const response = await api.get(`/assignment/${assignmentID}/prompt`); 
        console.log("Assignment student prompts:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching assignment student prompts:", error);
        throw error;
    }
};
