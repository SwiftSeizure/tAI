export const addResponse = (chatId, { role, content, id }) => ({ setState, getState }) => { 
    const state = getState(); 

    const chat = state.chats[chatId] || { responses: [], isLoading: false, error: null }; 

    const responseId = id || `${Date.now()}`; 

    const responseExists = chat.responses.some(msg => msg.id === responseId);

    if (responseExists) {
        return;
    } 

    setState({
        ...state,
        chats: {
            ...state.chats,
            [chatId]: {
                ...chat,
                responses: [...chat.responses, { id: responseId, role, content, timestamp: Date.now()}]
            }
        }
    });
}