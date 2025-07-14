import axios from 'axios';

const getModules = async (unitID) => {
  const url = `http://localhost:8000/unit/${unitID}/modules`;
  const response = await axios.get(url); 
  console.log("Modules data:");
  return response.data.modules;
};

export default getModules;