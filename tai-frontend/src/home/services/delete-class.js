import axios from "axios"; 

export const deleteClass = (classId) => { 
    const url = `http://localhost:8000/classroom/${classId}`;
    return axios.delete(url);
};
