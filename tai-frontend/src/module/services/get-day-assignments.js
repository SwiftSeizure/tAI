import api from "../../shared/services/axios";

export const getDayAssignments = async (day) => {
  try {
    const url = `/day/${day.id}/assignments`;
    const response = await api.get(url);
    return response.data.assignments;
  } 
  catch (error) {
    console.error("Error fetching day assignments information:", error);
    throw error;
  }
};