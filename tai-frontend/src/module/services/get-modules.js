import api from "../../shared/services/axios";

export const getModules = async (unitID) => {
  const url = `/unit/${unitID}/modules`; 
  const response = await api.get(url);
  return response.data.modules;
};
