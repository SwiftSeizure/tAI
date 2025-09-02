import axios from "axios"; 

const postCreateAssignment = async ({dayID, assignmentName, assignment}) => { 
    try { 
        await axios.post(`/module/${dayID}/assignment`, { name: assignmentName, assignment: assignment }); 
    } 
    catch (error) { 
        console.error('Error creating assignment:', error);
    } 
};
