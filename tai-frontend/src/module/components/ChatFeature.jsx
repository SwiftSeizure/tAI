import React, { useState, useRef, useEffect } from 'react';
import { useCurrentChat } from '../../store/chat-store';

/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 */

const ChatFeature = ({ chatId, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const { currentChat, currentChatId, setCurrentChat } = useCurrentChat();
    
    // Use the chat from currentChat if chatId matches, otherwise use a fallback 
    console.log("currentChatId", currentChatId); 
    console.log("chatId", chatId); 

    console.log("currentChat", currentChat);

    const chat = (currentChatId === chatId) ? currentChat : 
        { messages: [], isLoading: false, error: null, responses: [] };
    
    const messages = chat.messages || [];
    const responses = chat.responses || [];
    const isLoading = chat.isLoading || false;
    
    const convoRef = useRef(null); 

    console.log("messages", messages);
    console.log("responses", responses);

    // Set current chat when component mounts or chatId changes
    useEffect(() => {
        if (chatId) {
            setCurrentChat(chatId);
        }
    }, [chatId, setCurrentChat]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (convoRef.current) {
            convoRef.current.scrollTop = convoRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim() || !chatId) return;
        
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

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
            <div 
                ref={convoRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((msg, index) => (
                    <div 
                        key={msg.id || index}
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
