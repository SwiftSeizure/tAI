import axios from 'axios';

export const getModules = async (unitID) => {
  const url = `http://localhost:8000/unit/${unitID}/modules`; 
  console.log("unitID in getModules", unitID);
  const response = await axios.get(url);  
  console.log("MODULES in getModules", response.data.modules);
  return response.data.modules;
};
