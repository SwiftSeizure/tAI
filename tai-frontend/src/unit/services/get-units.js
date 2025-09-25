import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const getUnits = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/classroom/${classId}/units`);
  return response.data.units;
};

