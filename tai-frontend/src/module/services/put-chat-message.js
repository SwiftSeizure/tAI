import axios from 'axios';

import api from "../../shared/services/axios";

export const putChatMessage = async (studentID, displayType, dayID, currentFileName, message) => {
    try { 
 

        const url = '/chat/uploads/${displayType}/${dayID}/${currentFileName}';
        const formData = new FormData();
        formData.append("query", message); 
        // Include studentID in the multipart form body so backend can read it from the request body
        formData.append("studentID", studentID);

        console.log("URL in put-chat-message", url);
        console.log("Form data in put-chat-message", formData);

        const response = await api.put(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            params: { studentID }
        }); 

        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Error updating chat message:', error);
    }
};