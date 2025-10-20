import api from "../../shared/services/axios";

export const putUpdateClassName = async (classId, name) => { 

    const URL = `/classroom/name/${classId}`;

    try {
        const response = await api.put(URL, 
            { name }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating class name:", error);
        throw error;
    }
};