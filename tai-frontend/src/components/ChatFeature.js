import React, { useState } from 'react';
import OpenAI from 'openai';  
import "../CSS/Chat.css"; 


/**
 * ChatFeature Component
 * This component provides a chat interface where users can send messages
 * and receive responses from the OpenAI API. It includes input handling,
 * API integration, and error handling.
 */

const ChatFeature = () => { 

  // State to handle the completion result, user message, loading state, and error messages
  const [completionResult, setCompletionResult] = useState("");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  /**
   * handleMessage
   * Handles the user's message submission. Sends the message to the OpenAI API
   * and updates the state with the response or error.
   */
  const handleMessage = async () => {
    if (!message.trim()) { 
      return;
    } 

    // Clear previous results and set loading state
    setLoading(true);
    setError('');
    
    try { 
      // Initialize OpenAI API client
      /* REPLACE THIS WITH THE BACKEND INTEGRATION  */ 
      /* Danger  */ 
      /* Danger  */ 
      /* Danger  */ 
      /* Danger  */
      const openai = new OpenAI({
        apiKey: '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', 
        dangerouslyAllowBrowser: true  
      });  
      /* Danger  */ 
      /* Danger  */ 
      /* Danger  */ 
      /* Danger  */ 
      /* Danger  */
      /* END DANGER ZONE */ 


      // Send the user's message to the OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [ 
          // System message to set the context for the assistant
          // This message is used to instruct the assistant on how to respond
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a teaching assistant. You must not give direct answers to questions under any circumstances. Please refer to the following file to understand what class you are TA'ing and to cite relevant materials/questions. Here is the text: P.E.M.D.A.S. 1) Solve inside the parenthesis. 2) Exponents 3) Multiplication and Division, from left to right 4) Addition and Subtraction, from left to right"
              } 

            ]
          }, 
          // // User's message which is sent to GPT-4
          // This message is the actual input from the user
          {
            role: "user",
            content: message
          }
        ]
      });
      
      // Update the state with the response from OpenAI 
      // Currently the response is formatted in a message, future versions may change this
      setCompletionResult(completion.choices[0].message.content);
    } 

    // Handle errors from the OpenAI API
    catch (e) {
      console.error("Error calling OpenAI API:", e);
      setError("Failed to get response from OpenAI: " + e.message);
    } 

    // Reset loading state
    finally {
      setLoading(false);
    }
    
    // Clear the message input field after sending the message
    setMessage("");
  };


  return ( 

    <div className="message-container">  
      {/* Input container for users message */}
      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="message-input"
          placeholder="Type your message here..."
        /> 
      </div>  
        
        
      {/* Button to send the message */}
      {/* The button is disabled if loading or if the message is empty */}
      <div className="button-container">
        <button 
          className="custom-button-standard" 
          onClick={handleMessage}
          disabled={loading || !message.trim()}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
      
      {/* Display the error message if there is one on the screen */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Display the response from OpenAI in a read-only textarea */}
      <div className="response-container">
        <textarea
          value={completionResult}
          readOnly
          rows={6}
          className="response-textarea"
          placeholder="Response will appear here..."
        />
      </div>
    </div>
  );  
};

export default ChatFeature;