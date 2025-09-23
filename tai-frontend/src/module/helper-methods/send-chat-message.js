import { putChatMessage } from "../services/put-chat-message";

/**
 * Handles sending a chat message and processing the server response.
 * @param {string} message - The message to send
 * @param {string} displayType - The type of content being displayed ('material' or 'assignment')
 * @param {Object} selectedContent - The currently selected content
 * @param {Object} selectedDay - The currently selected day
 * @param {Object} user - The current user
 * @param {Function} setCurrentChat - Function to set the current chat
 * @param {Function} addMessage - Function to add a message to the chat
 * @param {Function} setError - Function to set error state
 * @param {Function} setLoading - Function to set loading state
 * @returns {Promise<Object>} The server response
 */
export const sendChatMessage = async ({
    message,
    displayType,
    selectedContent,
    selectedDay,
    user,
    setCurrentChat,
    addMessage,
    setError,
    setLoading
}) => {
    if (!message.trim() || !displayType) return '';

    const chatId = displayType === 'material' 
        ? `material_${selectedContent.id}`
        : `assignment_${selectedContent.id}`;
    
    try {
        setLoading(true);
      
        // Get the response from the server
        const serverResponse = await putChatMessage(
            user.id,
            displayType,
            selectedDay.id,
            selectedContent.filename,
            message
        );

        console.log("Server response:", serverResponse);
      
        // Process the response to pair messages with their responses
        if (serverResponse && serverResponse.messages && serverResponse.responses) {
            // First, clear existing messages to avoid duplicates
            // Then add all message-response pairs
            const messagesToAdd = [];
            for (let i = 0; i < serverResponse.messages.length; i++) {
                // Add user message
                messagesToAdd.push({
                  id: serverResponse.messages[i].id,
                  role: 'user',
                  content: serverResponse.messages[i].content,
                  timestamp: Date.now()
              });
              
              // Add corresponding AI response if it exists
              if (serverResponse.responses[i]) {
                    messagesToAdd.push({
                        id: serverResponse.responses[i].id,
                        role: 'assistant',
                        content: serverResponse.responses[i].content,
                        timestamp: Date.now()
                    });
              }
            }
          
          // Clear existing messages and add all new ones with unique IDs
          setCurrentChat(chatId); // Reset the chat
          let messageCount = 1;
          
          messagesToAdd.forEach((msg, index) => {
                // For even indices (0, 2, 4, ...) use numeric ID, for odd use response_#
                const messageId = index % 2 === 0 
                    ? messageCount.toString() 
                    : `response_${messageCount}`;
              
                // Only increment the counter after processing a pair (user + assistant)
                if (index % 2 === 1) {
                    messageCount++;
                }
              
                const messageWithId = {
                    ...msg,
                    id: messageId
                };
                addMessage(messageWithId);
            });
        }
      
        return serverResponse;
    } catch (error) {
        console.error('Error sending chat message:', error);
        setError('Failed to send message. Please try again.');
        throw error;
    } finally {
        setLoading(false);
    }
};