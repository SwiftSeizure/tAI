import api from "../../shared/services/axios";

export const getUnits = async (classId) => {
  const response = await api.get(`/classroom/${classId}/units`);
  return response.data.units;
};
