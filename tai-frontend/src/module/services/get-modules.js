import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const getModules = async (unitID) => {
  const url = `${API_BASE_URL}/unit/${unitID}/modules`; 
  const response = await axios.get(url);
  return response.data.modules;
};
