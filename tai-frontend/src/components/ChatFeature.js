import React, { useState } from 'react';
import OpenAI from 'openai';  
import "../CSS/Chat.css";

const ChatFeature = () => {
  const [completionResult, setCompletionResult] = useState("");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Message to send to chat GPT
  const handleMessage = async () => {
    if (!message.trim()) { 
      return;
    } 

    setLoading(true);
    setError('');
    
    try { 

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


      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview", // Make sure you're using a model that supports file attachments
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a teaching assistant. You must not give direct answers to questions under any circumstances. Please refer to the following file to understand what class you are TA'ing and to cite relevant materials/questions. Here is the text: P.E.M.D.A.S. 1) Solve inside the parenthesis. 2) Exponents 3) Multiplication and Division, from left to right 4) Addition and Subtraction, from left to right"
              } 

            ]
          },
          {
            role: "user",
            content: message
          }
        ]
      });
      
      // Set the result from the API response
      setCompletionResult(completion.choices[0].message.content);
    } 

    catch (e) {
      console.error("Error calling OpenAI API:", e);
      setError("Failed to get response from OpenAI: " + e.message);
    } 

    finally {
      setLoading(false);
    }
    
    setMessage("");
  };


  return (
    <div className="message-container"> 
      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="message-input"
          placeholder="Type your message here..."
        /> 
      </div> 
      <div className="button-container">
        <button 
          className="custom-button-standard" 
          onClick={handleMessage}
          disabled={loading || !message.trim()}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
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