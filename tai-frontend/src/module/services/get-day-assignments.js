import axios from "axios"; 

export const getDayAssignments = async (day) => {
  try {
    const url = `http://localhost:8000/day/${day.id}/assignments`;
    const response = await axios.get(url);
    return response.data.assignments;
  } 
  catch (error) {
    console.error("Error fetching day assignments information:", error);
    throw error;
  }
};