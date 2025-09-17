export const setError = (chatId, error) => ({ setState, getState }) => {
    const { chats } = getState();
    const chat = chats[chatId] || { messages: [], isLoading: false, error: null };
    
    setState({
        chats: {
            ...chats,
            [chatId]: {
                ...chat,
                error,
                isLoading: false
            }
        }
    });
};
