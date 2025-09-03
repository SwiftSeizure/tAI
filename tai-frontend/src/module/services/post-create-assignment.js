import axios from "axios"; 

export const postCreateAssignment = async ({dayID, fileName, file}) => { 
    try { 
        await axios.post(`/module/${dayID}/${fileName}`, file); 
    } 
    catch (error) { 
        console.error('Error creating assignment:', error);
    } 
};
