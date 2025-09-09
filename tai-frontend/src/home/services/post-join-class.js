import axios from 'axios';

export const postJoinClass = async (classCode, requestBody) => {
  try {
    const response = await axios.put(`http://localhost:8000/classroom/${classCode}/join`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};