import { createStore, createHook } from 'react-sweet-state';
import * as actions from './chat-actions';

// Initial state
const initialState = {
    chats: {},          // Keyed by chatId (e.g., 'material_123' or 'assignment_456')
    currentChatId: null  // ID of the currently active chat
};

// Create the chat store
export const ChatStore = createStore({
    name: 'chat',
    initialState,
    actions
});

// Create hooks
export const useChat = (chatId) => {
    const [state] = createHook(ChatStore)();
    return {
        chat: state.chats[chatId],
    };
};