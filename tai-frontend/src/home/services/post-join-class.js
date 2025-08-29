import axios from 'axios';

export const postJoinClass = async (requestBody) => {
  try {

    await axios.put(`http://localhost:8000/student/enroll`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return;
  } catch (error) {
    throw error;
  }
};