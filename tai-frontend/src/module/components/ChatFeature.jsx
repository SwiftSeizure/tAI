import React, { useState, useRef, useEffect } from 'react';
import { useCurrentChat } from '../../store/chat-store';

/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 */

/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 * 
 * @param {string} [chatId] - Optional chat ID for the conversation
 * @param {Function} onSendMessage - Function to handle sending messages
 * @param {string} [displayType] - Type of content being displayed ('material' or 'assignment')
 * @param {Object} [selectedContent] - Currently selected content
 */
const ChatFeature = ({ chatId, onSendMessage, displayType, selectedContent }) => {
    const [message, setMessage] = useState('');
    const { currentChat, currentChatId, setCurrentChat } = useCurrentChat();
    
    // If no chatId is provided but we have displayType and selectedContent, generate a chatId
    const effectiveChatId = chatId || (displayType && selectedContent?.id 
        ? `${displayType}_${selectedContent.id}` 
        : null);

    // Use the chat from currentChat if chatId matches, otherwise use a fallback
    const chat = (currentChatId === effectiveChatId) ? currentChat : 
        { messages: [], isLoading: false, error: null, responses: [] };
    
    const messages = chat.messages || [];
    const responses = chat.responses || [];
    const isLoading = chat.isLoading || false;
    
    const convoRef = useRef(null); 

    console.log("messages", messages);
    console.log("responses", responses);

    // Set current chat when component mounts or effectiveChatId changes
    useEffect(() => {
        if (effectiveChatId) {
            setCurrentChat(effectiveChatId);
        }
    }, [effectiveChatId, setCurrentChat]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (convoRef.current) {
            convoRef.current.scrollTop = convoRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim() || !effectiveChatId) return;
        
        const userMessage = message;
        setMessage('');
        
        try {
            // The message will be added by the parent component through onSendMessage
            // which should handle the API call and state updates
            const response = await onSendMessage(userMessage);
            
            // The response contains both messages and responses in separate arrays
            // We'll let the parent component handle updating the chat state
            if (response && response.data) {
                const { messages = [], responses = [] } = response.data;
                console.log('Messages:', messages);
                console.log('Responses:', responses);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Show placeholder if no content is selected
    if (!effectiveChatId) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <svg 
                    className="w-16 h-16 mb-4 text-gray-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                    />
                </svg>
                <h3 className="text-lg font-medium">No content selected</h3>
                <p className="mt-1">Please select an assignment or material to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
            <div 
                ref={convoRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((msg, index) => (
                    <div 
                        key={`msg-${index}`}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-3/4 p-3 rounded-lg ${
                                msg.role === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {msg.content && typeof msg.content === 'object' 
                                ? JSON.stringify(msg.content) 
                                : msg.content}
                        </div>
                    </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatFeature;
