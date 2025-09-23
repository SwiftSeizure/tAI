import axios from 'axios';

/**
 * Creates a new unit in the specified class
 * @param {string} classID - The ID of the class to add the unit to
 * @param {string} unitName - The name of the new unit
 * @returns {Promise<Object>} The response data containing the created unit
 */
export const postNewUnit = async (classID, unitName) => {
    try {
        const requestBody = {
            name: unitName,
            settings: {}
        };

        const response = await axios.post(
            `http://localhost:8000/classroom/${classID}/unit`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error creating unit:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to create unit'
        };
    }
};

export default postNewUnit;