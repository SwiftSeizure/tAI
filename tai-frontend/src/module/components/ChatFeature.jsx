import React, { useState, useRef, useEffect } from 'react';
// import OpenAI from 'openai';	

/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 */

export const ChatFeature = ({ onMessageSend, displayResponse, conversation, loading }) => {
    // State to handle the user message, loading state, and error messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleMessageSend = () => {
        if (message.trim()) {
            onMessageSend(message);
            setMessage(''); // Clear the input after sending
        }
    };

    const convoRef = useRef(null);

    // auto-scroll to bottom when conversation or displayResponse changes
    useEffect(() => {
        const el = convoRef.current;
        if (el) {
            // scroll to bottom smoothly
            el.scrollTop = el.scrollHeight;
        }
    }, [conversation, displayResponse]);

    return (
        <div className="flex flex-col gap-4 w-full p-4 font-nunito">
            {/* Input container for users message */}
            <div className="">
                <textarea
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        // Auto-resize logic
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    rows={1}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden min-h-[80px]"
                    placeholder="Type your message here..."
                />
            </div>
                
            {/* Button to send the message */}
            {/* The button is disabled if loading or if the message is empty */}
            <div className="align-center">
                <button
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleMessageSend}
                    disabled={loading || !message.trim()}
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </div>
                
            {/* Display the error message if there is one on the screen */}
            {error && <div className="text-red-500 mt-2">{error}</div>}
                
            {/* Conversation view: show all messages and their replies as message bubbles */}
            <div>
                <div
                    ref={convoRef}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[160px] max-h-[60vh] overflow-auto flex flex-col gap-3"
                >
                    {conversation.length === 0 ? (
                        <div className="text-gray-500 italic">{displayResponse || 'Response will appear here...'}</div>
                    ) : (
                        conversation.map((item, idx) => {
                            const userMsg = item.message ?? '';
                            const reply = item.response ?? '';
                            return (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="flex justify-end">
                                        <div className="max-w-[80%] bg-blue-500 text-white rounded-lg px-4 py-2 shadow-sm">
                                            <div className="text-sm">{userMsg}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] bg-gray-200 text-gray-900 rounded-lg px-4 py-2 shadow-sm">
                                            <div className="text-sm">{reply}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {loading && (
                        <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            <div className="ml-2 text-sm text-gray-600">Waiting for reply...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
