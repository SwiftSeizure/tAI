import React, { useState } from 'react';
// import OpenAI from 'openai';	

/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 */

const ChatFeature = ({onMessageSend, displayResponse}) => {
    // State to handle the completion result, user message, loading state, and error messages
    const [completionResult, setCompletionResult] = useState("");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleMessageSend = () => {
        onMessageSend(message);
        setMessage(displayResponse);
    };

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
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </div>
                
            {/* Display the error message if there is one on the screen */}
            {error && <div className="text-red-500 mt-2">{error}</div>}
                
            {/* Display the response from OpenAI in a read-only textarea */}
            <div>
                <textarea
                    value={completionResult}
                    readOnly
                    rows={1}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 resize-none overflow-hidden min-h-[120px]"
                    placeholder="Response will appear here..."
                    style={{ height: completionResult ? 'auto' : '120px' }}
                    ref={(ref) => {
                        if (ref && completionResult) {
                            ref.style.height = 'auto';
                            ref.style.height = ref.scrollHeight + 'px';
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ChatFeature;