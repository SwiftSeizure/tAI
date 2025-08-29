import axios from "axios"; 

export const getClasses = async (userID, role) => {
    const url = `http://localhost:8000/home/${role}/${userID}`;
    const response = await axios.get(url); 
    return response.data.classes;
};