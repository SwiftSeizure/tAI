export const addMessage = (chatId, { role, content, id }) => ({ setState, getState }) => {
    const state = getState();
    const chat = state.chats[chatId] || { messages: [], isLoading: false, error: null };
    
    // Create a unique ID if one wasn't provided
    const messageId = id;
    
    // Check if a message with the same ID already exists
    const messageExists = chat.messages.some(msg => msg.id === messageId);
    
    if (messageExists) {
        return; // Skip adding if message already exists
    }
    
    setState({
        ...state,
        chats: {
            ...state.chats,
            [chatId]: {
                ...chat,
                messages: [
                    ...chat.messages,
                    {
                        id: messageId,
                        role,
                        content,
                        timestamp: Date.now()
                    }
                ]
            }
        }
    });
};