import api from "../../shared/services/axios";

/**
 * Validate a student's answer to a practice question
 * @param {string} studentID - The student's Firebase UID
 * @param {string} displayType - Type of content ('material' or 'assignment')
 * @param {number} dayID - The day ID
 * @param {string} currentFileName - The current file name
 * @param {string} question - The practice question that was asked
 * @param {string} answer - The student's answer
 * @returns {Promise<{is_correct: boolean, feedback: string}>} Validation result
 */
export const validatePracticeAnswer = async (studentID, displayType, dayID, currentFileName, question, answer) => {
    try {
        const url = `/chat/validate-practice-answer/uploads/${displayType}/${dayID}/${currentFileName}`;
        
        console.log("Validating practice answer at:", url);
        
        const formData = new FormData();
        formData.append('question', question);
        formData.append('answer', answer);
        
        const response = await api.post(url, formData, {
            params: { studentID }
        });
        
        console.log("Validation response:", response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error validating practice answer:', error);
        throw error;
    }
};
