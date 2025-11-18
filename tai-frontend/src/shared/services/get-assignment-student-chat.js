import api from "./axios";

export const getAssignmentStudentChat = async (assignmentID, studentID) => {
    try {
        const response = await api.get(`/assignment/${assignmentID}/${studentID}/prompt`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student chat:", error);
        throw error;
    }
};
