export const initializeChat = (chatId) => ({ setState, getState }) => {
    const state = getState();
    
    // Only initialize if the chat doesn't exist yet
    if (!state.chats[chatId]) {
        setState({
            ...state,
            chats: {
                ...state.chats,
                [chatId]: {
                    messages: [],
                    isLoading: false,
                    error: null
                }
            }
        });
    }
};