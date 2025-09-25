import axios from "axios"; 
import { API_BASE_URL } from "../../shared/constants/urls";

export const getDayMaterials = async (day) => {
  try {
    const url = `${API_BASE_URL}/day/${day.id}/materials`;
    const response = await axios.get(url);
    return response.data.materials;
  } 
  catch (error) {
    return;
  }
};