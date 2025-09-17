export const addMessage = (chatId, { role, content }) => ({ setState, getState }) => {
    const { chats } = getState();
    const chat = chats[chatId] || { messages: [], isLoading: false, error: null };
    
    setState({
        chats: {
            ...chats,
            [chatId]: {
                ...chat,
                messages: 
                [
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