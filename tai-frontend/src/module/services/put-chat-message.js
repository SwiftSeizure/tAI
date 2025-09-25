import axios from 'axios';
import { API_BASE_URL } from "../../shared/constants/urls";

export const putChatMessage = async (studentID, displayType, dayID, currentFileName, message) => {
    try { 
 
        
        const url = `${API_BASE_URL}/chat/uploads/${displayType}/${dayID}/${currentFileName}`;
        const formData = new FormData();
        formData.append("query", message); 

        console.log("URL in put-chat-message", url);
        console.log("Form data in put-chat-message", formData);

        const response = await axios.put(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            params: { studentID } // replace with real student ID
        }); 

        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Error updating chat message:', error);
    }
};
