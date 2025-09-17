import { createStore, createHook } from 'react-sweet-state';
import * as actions from './chat-actions';

// Initial state
const initialState = {
    chats: {},          // Keyed by chatId (e.g., 'material_123' or 'assignment_456')
    currentChatId: null  // This is going to be the same thing as the material.id or the assignment.id
};

// Create the chat store
export const ChatStore = createStore({
    name: 'chat',
    initialState,
    actions: {
        ...actions,
        // Add a wrapper to expose actions directly
        setCurrentChat: (chatId) => ({ setState, getState }) => {
            const state = getState();
            setState({
                ...state,
                currentChatId: chatId,
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
        }
    }
});

// Base hook
export const useChat = createHook(ChatStore);

// Hook to get/set current chat
export const useCurrentChat = () => {
    const [state, actions] = useChat();
    const currentChat = state.currentChatId ? state.chats[state.currentChatId] : null;
    
    return { 
        currentChatId: state.currentChatId,
        currentChat: currentChat || { messages: [], isLoading: false, error: null },
        setCurrentChat: actions.setCurrentChat,
        addMessage: (message) => state.currentChatId && actions.addMessage(state.currentChatId, message),
        setLoading: (isLoading) => state.currentChatId && actions.setLoading(state.currentChatId, isLoading),
        setError: (error) => state.currentChatId && actions.setError(state.currentChatId, error)
    };
};
