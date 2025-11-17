import api from "../../shared/services/axios";

/**
 * Get a practice question based on the current content
 * @param {string} studentID - The student's Firebase UID
 * @param {string} displayType - Type of content ('material' or 'assignment')
 * @param {number} dayID - The day ID
 * @param {string} currentFileName - The current file name
 * @returns {Promise<{question: string}>} The generated practice question
 */
export const getPracticeQuestion = async (studentID, displayType, dayID, currentFileName) => {
    try {
        const url = `/chat/practice-question/uploads/${displayType}/${dayID}/${currentFileName}`;
        
        console.log("Fetching practice question from:", url);
        
        const response = await api.get(url, {
            params: { studentID }
        });
        
        console.log("Practice question response:", response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching practice question:', error);
        throw error;
    }
};
