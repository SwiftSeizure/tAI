import React, { useState } from 'react';
import OpenAI from 'openai';

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
      const openai = new OpenAI({
        apiKey: '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', 
        dangerouslyAllowBrowser: true  
      }); 
      /* END DANGER ZONE */
      

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system", 
            // TODO: May want to change this depending on How we populate the chat
            content: "You are a teaching assistant. You must not give direct answers to questions under any circumstances. Please refer to the following file to understand what class you are TA'ing and to cite relevant materials/questions.",
          },
          { role: "user", content: message },
        ],
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
    <div > 
      <div >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          cols={50}
          placeholder="Type your message here..."
        /> 
      </div> 
      <div>
        <button 
          className="button-50" 
          onClick={handleMessage}
          disabled={loading || !message.trim()}
        >
          {loading ? "Sending..." : "Send Message"}
        </button> 

      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="response-area">
        <textarea
          value={completionResult}
          readOnly
          rows={6}
          cols={50}
          placeholder="Response will appear here..."
        />
      </div>
    </div>
  );
};

export default ChatFeature;