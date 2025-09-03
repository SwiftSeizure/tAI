import axios from "axios"; 

const postCreateAssignment = async ({dayID, assignmentData}) => { 
    try { 
        await axios.post(`/module/${dayID}/assignment`, assignmentData); 
    } 
    catch (error) { 
        console.error('Error creating assignment:', error);
    } 
};
