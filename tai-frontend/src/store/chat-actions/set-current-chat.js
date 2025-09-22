export const setCurrentChat = (chatId) => ({ setState, getState }) => {
    const state = getState();
    setState({
        ...state,
        currentChat: chatId, // This is going to be the same thing as the material.id or the assignment.id
        // Initialize chat if it doesn't exist
        chats: {
            ...state.chats,
            [chatId]: state.chats[chatId] || { 
                messages: [], 
                isLoading: false, 
                error: null 
            }
        }
    });
};