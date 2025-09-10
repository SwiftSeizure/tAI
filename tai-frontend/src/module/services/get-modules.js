import axios from 'axios';

export const getModules = async (unitID) => {
  const url = `http://localhost:8000/unit/${unitID}/modules`; 
<<<<<<< HEAD
  console.log("unitID in getModules", unitID);
  const response = await axios.get(url);  
  console.log("MODULES in getModules", response.data.modules);
=======
  const response = await axios.get(url);
>>>>>>> origin/Development-Frontend
  return response.data.modules;
};
