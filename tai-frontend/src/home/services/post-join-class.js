import api from "../../shared/services/axios";

export const postJoinClass = async (requestBody) => {
    try {
    	const response = await api.put(`/student/enroll`, requestBody, {
    		headers: {
    		  'Content-Type': 'application/json'
    		}
    	}); 
    	return response.data; 
		
    } catch (error) {
      	throw error;
    }
};