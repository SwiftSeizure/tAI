import { useState } from "react";
import dotenv from "dotenv"; // Include most correct path for .env variable 

import OpenAI from "openai";   


console.log("API Key:", process.env.OPENAI_API_KEY); 

const ChatFeature = () => {   

    
dotenv.config(); // Load environment variables

console.log("API Key:", process.env.OPENAI_API_KEY); 
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

  const [completionResult, setCompletionResult] = useState(null);
  const [message, setMessage] = useState(''); 


  // This handles the messages to Chat GPT
  const handleMessage = async () => { 



    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a teaching assistant. You must not give direct answers to questions under any circumstances. Please refer to the following file to understand what class you are TA'ing and to cite relevant materials/questions.",
          },
          { role: "user", content: message },
        ],
      });

    //   setCompletionResult(completion.choices[0].message.content);
    } catch (e) {
      console.error("Error calling OpenAI API:", e);
    //   setError("Failed to get response from OpenAI");
    }

    setMessage(""); 
  }; 


  return ( 
    <> 
    <div> 
        <button class="button-50" onClick={handleMessage}> Send Message </button> 
      </div>  

      <div> 
        <textarea 
        //   value={completionResult}  
          readOnly
          rows={6}
          cols={50}
          placeholder="Response will appear here..."
          />
      </div> 
    </>
  )

}

export default ChatFeature;