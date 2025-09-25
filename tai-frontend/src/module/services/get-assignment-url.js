import api from "../../shared/services/axios";

export const getAssignmentURL = async (dayID, fileName) => {
  if (!dayID || !fileName) {
    throw new Error('dayID and fileName are required');
  }

  try {
    const url = `/assignment/${dayID}/${fileName}`;
    const response = await api.get(url, { responseType: 'blob' });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch assignment: ${response.status} ${response.statusText}`);
    }

    const fileURL = URL.createObjectURL(response.data);
    return fileURL;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    throw error;
  }
};