import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const postJoinClass = async (requestBody) => {
  try {

    const response = await axios.put(`${API_BASE_URL}/student/enroll`, requestBody, {
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