import axios from 'axios';

export const putChatMessage = async (studentID,displayType, dayID, currentFileName, message) => {
  try {
    const url = `http://localhost:8000/chat/uploads/${displayType}/${dayID}/${currentFileName}`;
    const formData = new FormData();
    formData.append("query", message);

    const response = await axios.put(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { studentID } // replace with real student ID
    });

    return response.data;
  } catch (error) {
    console.error('Error updating chat message:', error);
  }
};
