const setLoading = (chatId, isLoading) => ({ setState, getState }) => {
    const { chats } = getState();
    const chat = chats[chatId] || { messages: [], isLoading: false, error: null };
    
    setState({
        chats: {
            ...chats,
            [chatId]: {
                ...chat,
                isLoading
            }
        }
    });
};