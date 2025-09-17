import axios from 'axios';

export const getMaterialURL = async (dayID, filename) => {
  if (!dayID || !filename) {
    throw new Error('dayID and filename are required');
  }

  try {
    const url = `http://localhost:8000/material/${dayID}/${filename}`;  

    console.log("URL that is going into the get", url);
    const response = await axios.get(url, { responseType: 'blob' });
	console.log("Response: ", response);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch material: ${response.status} ${response.statusText}`);
    }

    const fileURL = URL.createObjectURL(response.data);
    return fileURL;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};