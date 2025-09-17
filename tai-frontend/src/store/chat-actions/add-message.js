export const addMessage = (chatId, { role, content }) => ({ setState, getState }) => {
    const state = getState();
    const chat = state.chats[chatId] || { messages: [], isLoading: false, error: null };
    
    setState({
        ...state,
        chats: {
            ...state.chats,
            [chatId]: {
                ...chat,
                messages: [
                    ...chat.messages,
                    {
                        id: Date.now().toString(),
                        role,
                        content,
                        timestamp: Date.now()
                    }
                ]
            }
        }
    });
};