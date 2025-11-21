import api from "../../shared/services/axios";

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
            published: false,
            settings: {
                additionalProp1: {}
            }
        }; 

        const response = await api.post(
            `/classroom/${classID}/unit`,
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
        console.error('Error creating unit:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,  // This will show the validation errors
            url: error.config?.url,
            method: error.config?.method,
            requestData: error.config?.data
        });
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to create unit'
        };
    }
};

export default postNewUnit;