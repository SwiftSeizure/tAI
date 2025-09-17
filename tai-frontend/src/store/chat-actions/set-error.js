export const setError = (chatId, error) => ({ setState, getState }) => {
    const state = getState();
    const chat = state.chats[chatId] || { messages: [], isLoading: false, error: null };
    
    setState({
        ...state,
        chats: {
            ...state.chats,
            [chatId]: {
                ...chat,
                error,
                isLoading: false
            }
        }
    });
};
