import api from "../../shared/services/axios";

/**
 * Get a practice question based on the current content
 * @param {string} studentID - The student's Firebase UID
 * @param {number} classID - The class ID
 * @param {string} displayType - Type of content ('material' or 'assignment')
 * @param {number} dayID - The day ID
 * @param {string} currentFileName - The current file name
 * @param {number} level - The difficulty level (default 1)
 * @returns {Promise<{question: string}>} The generated practice question
 */
export const getPracticeQuestion = async (studentID, classID, displayType, dayID, currentFileName, level = 1) => {
    try {
        const url = `/chat/practice-question/uploads/${displayType}/${dayID}/${currentFileName}`;
        
        const response = await api.get(url, {
            params: { studentID, classID, level }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching practice question:', error);
        throw error;
    }
};
