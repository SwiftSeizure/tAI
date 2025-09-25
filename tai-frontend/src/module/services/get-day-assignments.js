import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const getDayAssignments = async (day) => {
  try {
    const url = `${API_BASE_URL}/day/${day.id}/assignments`;
    const response = await axios.get(url);
    return response.data.assignments;
  } 
  catch (error) {
    console.error("Error fetching day assignments information:", error);
    throw error;
  }
};