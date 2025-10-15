import api from "../../shared/services/axios"; 

export const getUserType = async () => {
    try {
        const response = await api.get(`/home/usertype`, { 
            headers: {
                'Content-Type': 'application/json',
            },
        }); 
        console.log("response", response);
        return response.data.user_type;
    } catch (error) {
        console.error('Error fetching user type:', error);
        throw error;
    }
};
