import axios from 'axios';

export const getModules = async (unitID) => {
  const url = `http://localhost:8000/unit/${unitID}/modules`;
  const response = await axios.get(url); 
  return response.data.modules;
};
