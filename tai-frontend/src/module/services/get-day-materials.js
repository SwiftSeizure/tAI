import axios from "axios"; 

export const getDayMaterials = async (day) => {
  try {
    const url = `http://localhost:8000/day/${day.id}/materials`;
    const response = await axios.get(url);
    return response.data.materials;
  } 
  catch (error) {
    console.error("Error fetching day materials information:", error);
    throw error;
  }
};