export const initializeChat = (chatId) => ({ setState, getState }) => {
    const { chats } = getState();
    
    if (!chats[chatId]) {
        setState({
            ...getState(),
            chats: {
                ...chats,
                [chatId]: {
                    messages: [],
                    isLoading: false,
                    error: null
                }
            }
        });
    }
};