import axios from 'axios';

export const postJoinClass = async (classID, requestBody) => {
  try {

    await axios.put(`http://localhost:8000/student/${classID}/enroll`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return;
  } catch (error) {
    throw error;
  }
};