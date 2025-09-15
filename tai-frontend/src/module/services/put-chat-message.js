import axios from 'axios';

export const putChatMessage = async (displayType, dayID, currentFileName, message) => {
    try {  

        const url = `http://localhost:8000/chat/${displayType}/${dayID}/${currentFileName}`;
        const requestBody = {
            message: message
        }; 
        console.log("URL: ", url);
        console.log("Request Body: ", requestBody);
        await axios.put(url, requestBody);
    } catch (error) {
        console.error('Error updating chat message:', error);
    }
};
