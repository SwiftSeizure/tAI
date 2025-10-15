import api from "../../shared/services/axios"; 

export const getUserType = async () => {
    try {
        const response = await api.get(`/home/usertype`); 
        console.log("response", response);
        return response.data.user_type;
    } catch (error) {
        console.error('Error fetching user type:', error);
        throw error;
    }
};
