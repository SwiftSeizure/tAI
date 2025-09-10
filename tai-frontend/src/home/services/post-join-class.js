import axios from 'axios';

export const postJoinClass = async (requestBody) => {
  try {

    const response = await axios.put(`http://localhost:8000/student/enroll`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    }); 
    console.log("This is classID in postJoinClass: ", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};