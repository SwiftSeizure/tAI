import React, { useState, useRef, useEffect } from 'react';
import { useCurrentChat } from '../../store/chat-store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { getPracticeQuestion } from '../services/get-practice-question';
import { validatePracticeAnswer } from '../services/validate-practice-answer';

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
 * @param {Object} [selectedDay] - Currently selected day
 * @param {Object} [user] - Current user object
 */
const ChatFeature = ({ chatId, onSendMessage, displayType, selectedContent, selectedDay, user }) => {
    const [message, setMessage] = useState('');
    const [isTransparent, setIsTransparent] = useState(false);
    const [practiceQuestion, setPracticeQuestion] = useState(null);
    const [practiceAnswer, setPracticeAnswer] = useState('');
    const [answerFeedback, setAnswerFeedback] = useState(null); // {is_correct: bool, feedback: string}
    const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
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
    }, [messages, practiceQuestion]);

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

    const handlePracticeAnswerKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitPracticeAnswer();
        }
    };

    const handleSubmitPracticeAnswer = async () => {
        if (!practiceAnswer.trim()) return;
        
        setIsValidatingAnswer(true);
        setAnswerFeedback(null);
        
        try {
            const result = await validatePracticeAnswer(
                user.id,
                displayType,
                selectedDay.id,
                selectedContent.filename,
                practiceQuestion,
                practiceAnswer
            );
            
            setAnswerFeedback(result);
            setPracticeAnswer('');
        } catch (error) {
            console.error('Error validating practice answer:', error);
            setAnswerFeedback({
                is_correct: false,
                feedback: 'Unable to validate answer at this time. Please try again.'
            });
        } finally {
            setIsValidatingAnswer(false);
        }
    };

    const handleGeneratePracticeQuestion = async () => {
        if (!user || !selectedDay || !selectedContent || !displayType) {
            console.error('Missing required data for practice question generation');
            return;
        }

        setIsLoadingQuestion(true);
        setPracticeQuestion(null);
        setAnswerFeedback(null);
        setPracticeAnswer('');

        try {
            const response = await getPracticeQuestion(
                user.id,
                displayType,
                selectedDay.id,
                selectedContent.filename
            );
            
            if (response && response.question) {
                setPracticeQuestion(response.question);
            }
        } catch (error) {
            console.error('Error generating practice question:', error);
            setPracticeQuestion('Unable to generate practice question at this time. Please try again.');
        } finally {
            setIsLoadingQuestion(false);
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
        <div className={`flex flex-col h-full rounded-lg overflow-hidden ${
            isTransparent ? '' : 'bg-gray-800/90 backdrop-blur-md shadow-md'
        }`}>
            {/* Header with transparency toggle */}
            <div className={`flex items-center justify-between px-4 py-3 ${
                isTransparent ? 'border-b border-gray-500/30 bg-black/30' : 'border-b border-gray-600 bg-gray-800/50'
            }`}>
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-100">Chat</h2>
                    <button
                        onClick={() => setIsTransparent(!isTransparent)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-md transition-colors"
                        title={isTransparent ? "Make background solid" : "Make background transparent"}
                    >
                        {isTransparent ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>Solid</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <span>Transparent</span>
                            </>
                        )}
                    </button>
                    
                    {/* Practice Question Button */}
                    <button
                        onClick={handleGeneratePracticeQuestion}
                        disabled={isLoadingQuestion}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-700 hover:bg-purple-600 text-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Generate a practice question based on current content"
                    >
                        {isLoadingQuestion ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Practice: Level 1</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="w-10"></div>
            </div>
            
            <div 
                ref={convoRef}
                className="flex-1 overflow-y-auto bg-transparent"
            >
                {messages.map((msg, index) => (
                    <div 
                        key={`msg-${index}`}
                        className={`w-full py-6 px-4 ${
                            msg.role === 'user' 
                                ? isTransparent ? 'bg-blue-600/20 border-l-4 border-blue-400' : 'bg-blue-900/40 border-l-4 border-blue-500'
                                : isTransparent ? 'bg-gray-900/20' : 'bg-gray-700/30'
                        }`}
                    >
                        <div className="max-w-3xl mx-auto">
                            <div className="flex gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-600' 
                                            : 'bg-green-600'
                                    }`}>
                                        {msg.role === 'user' ? 'U' : 'AI'}
                                    </div>
                                </div>
                                
                                {/* Message content */}
                                <div className={`flex-1 min-w-0 ${
                                    isTransparent ? 'text-white' : 'text-gray-100'
                                }`} style={isTransparent ? {textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)'} : {}}>
                                    {msg.role === 'user' ? (
                                        // User messages: display as plain text
                                        <div className="whitespace-pre-wrap font-medium">
                                            {msg.content && typeof msg.content === 'object' 
                                                ? JSON.stringify(msg.content) 
                                                : msg.content}
                                        </div>
                                    ) : (
                                        // Assistant messages: render as markdown
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                // Customize rendering for better spacing
                                                p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-7" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                                                li: ({node, ...props}) => <li className="leading-7" {...props} />,
                                                code: ({node, inline, ...props}) => 
                                                    inline 
                                                        ? <code className="bg-gray-200 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                                        : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono" {...props} />,
                                                pre: ({node, ...props}) => <pre className="bg-gray-900 rounded-lg my-4 overflow-x-auto" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                                                em: ({node, ...props}) => <em className="italic" {...props} />,
                                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                                                h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                                                hr: ({node, ...props}) => <hr className="my-6 border-gray-300" {...props} />,
                                            }}
                                        >
                                            {msg.content && typeof msg.content === 'object' 
                                                ? JSON.stringify(msg.content) 
                                                : (msg.content || '')}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Practice Question Display - Inline with conversation */}
                {practiceQuestion && (
                    <div className="w-full py-6 px-4">
                        <div className="max-w-3xl mx-auto">
                            <div className={`p-5 rounded-lg border-2 ${
                                isTransparent 
                                    ? 'bg-purple-900/30 border-purple-400/50 backdrop-blur-sm' 
                                    : 'bg-purple-900/50 border-purple-500'
                            }`}>
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-sm font-semibold text-purple-300">Practice: Level 1</h3>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setPracticeQuestion(null);
                                            setAnswerFeedback(null);
                                            setPracticeAnswer('');
                                        }}
                                        className="text-purple-300 hover:text-purple-100 transition-colors"
                                        aria-label="Close practice question"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className={`text-gray-100 mb-4 break-words overflow-wrap-anywhere ${
                                    isTransparent ? 'text-shadow-lg' : ''
                                }`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            // Customize rendering for better spacing and containment
                                            p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-7" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            li: ({node, ...props}) => <li className="leading-7" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            code: ({node, inline, ...props}) => 
                                                inline 
                                                    ? <code className="bg-purple-800/50 text-purple-100 px-1.5 py-0.5 rounded text-sm font-mono" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }} {...props} />
                                                    : <code className="block bg-purple-950/70 text-purple-100 p-4 rounded-lg my-4 text-sm font-mono whitespace-pre-wrap" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            pre: ({node, ...props}) => <pre className="bg-purple-950/70 rounded-lg my-4 whitespace-pre-wrap" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                                            em: ({node, ...props}) => <em className="italic" {...props} />,
                                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-400 pl-4 italic my-4" style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            hr: ({node, ...props}) => <hr className="my-6 border-purple-400" {...props} />,
                                            div: ({node, ...props}) => <div style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                            span: ({node, ...props}) => <span style={{ wordBreak: 'normal', overflowWrap: 'anywhere' }} {...props} />,
                                        }}
                                    >
                                        {practiceQuestion}
                                    </ReactMarkdown>
                                </div>

                                {/* Answer input area or feedback display */}
                                {answerFeedback ? (
                                    <div className={`p-4 rounded-lg border-2 ${
                                        answerFeedback.is_correct 
                                            ? 'bg-green-900/40 border-green-500' 
                                            : 'bg-red-900/40 border-red-500'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {answerFeedback.is_correct ? (
                                                <>
                                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-green-300 font-semibold text-lg">You were correct!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-red-300 font-semibold text-lg">Not quite right</span>
                                                </>
                                            )}
                                        </div>
                                        <p className={`${answerFeedback.is_correct ? 'text-green-100' : 'text-red-100'}`}>
                                            {answerFeedback.feedback}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setAnswerFeedback(null);
                                                setPracticeAnswer('');
                                            }}
                                            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 mt-4">
                                        <input
                                            type="text"
                                            value={practiceAnswer}
                                            onChange={(e) => setPracticeAnswer(e.target.value)}
                                            onKeyDown={handlePracticeAnswerKeyDown}
                                            placeholder="Type your answer here..."
                                            className="flex-1 px-4 py-2 bg-purple-950/50 text-gray-100 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-purple-300/50"
                                            disabled={isValidatingAnswer}
                                        />
                                        <button
                                            onClick={handleSubmitPracticeAnswer}
                                            disabled={!practiceAnswer.trim() || isValidatingAnswer}
                                            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isValidatingAnswer ? 'Checking...' : 'Submit'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                    <div className={`w-full py-6 px-4 ${isTransparent ? 'bg-gray-900/20' : 'bg-gray-700/30'}`}>
                        <div className="max-w-3xl mx-auto">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-green-600">
                                        AI
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span className="animate-bounce">●</span>
                                        <span className="animate-bounce animation-delay-200">●</span>
                                        <span className="animate-bounce animation-delay-400">●</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`p-4 border-t backdrop-blur-md ${
                isTransparent ? 'border-gray-500/30 bg-black/70' : 'border-gray-600 bg-gray-800/90'
            }`}>
                <div className="max-w-3xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatFeature;
