import axios from 'axios';

export const getUnits = async (classId) => {
  const response = await axios.get(`http://localhost:8000/classroom/${classId}/units`);
  return response.data.units;
};

