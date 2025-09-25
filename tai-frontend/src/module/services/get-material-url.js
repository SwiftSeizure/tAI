import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const getMaterialURL = async (dayID, fileName) => {
  if (!dayID || !fileName) {
    throw new Error('dayID and fileName are required');
  }

  try {
    const url = `${API_BASE_URL}/material/${dayID}/${fileName}`;
    const response = await axios.get(url, { responseType: 'blob' });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch material: ${response.status} ${response.statusText}`);
    }

    const fileURL = URL.createObjectURL(response.data);
    return fileURL;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};