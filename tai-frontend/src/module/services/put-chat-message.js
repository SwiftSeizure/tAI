import axios from 'axios';

export const putChatMessage = async (displayType, dayID, currentFileName, message) => {
    try {  
        const url = `http://localhost:8000/chat/uploads/${displayType}/${dayID}/${currentFileName}`;
        const requestBody = {
            query: message
        };
        await axios.put(url, requestBody);
    } catch (error) {
        console.error('Error updating chat message:', error);
    }
};
