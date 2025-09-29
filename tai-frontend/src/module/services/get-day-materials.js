import api from "../../shared/services/axios";

export const getDayMaterials = async (day) => {
  try {
    const url = `/day/${day.id}/materials`;
    const response = await api.get(url);
    return response.data.materials;
  } 
  catch (error) {
    return;
  }
};