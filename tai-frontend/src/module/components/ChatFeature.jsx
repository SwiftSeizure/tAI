import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../store/chat-store';

/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 */

const ChatFeature = ({ chatId, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const { chat, addMessage, setLoading, setError } = useChat(chatId);
    const messages = chat?.messages || [];
    const isLoading = chat?.isLoading || false;
    
    const convoRef = useRef(null);

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
            // Add user message to chat
            addMessage({ role: 'user', content: userMessage });
            setLoading(true);
            
            // Send message and get response
            const response = await onSendMessage(userMessage);
            
            // Add AI response to chat
            if (response) {
                addMessage({ 
                    role: 'assistant', 
                    content: response 
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div 
                ref={convoRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((msg, idx) => (
                    <div 
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-3/4 p-3 rounded-lg ${
                                msg.role === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
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
