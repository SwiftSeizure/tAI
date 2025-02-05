// TODO: Split into a chat component and a file upload component for 
import '../App.css';
import React, { useState } from 'react'; 
import dotenv from '../../src/.env'; // Include most correct path for .ev variable 
import OpenAI from "openai"; 

// dotenv.config(); 

console.log("API Key:", process.env.OPENAI_API_KEY); 

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(''); 
  const [completionResult, setCompletionResult] = useState(null);
  const [error, setError] = useState(null);

  // File Changed Handler
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  // Uploading file handler
  const handleUpload = () => {
    if (file) {
      console.log("File selected:", file.name);
      // Can upload to GPT here for files 
    } else {
      console.log("No file selected");
    }
  };

  // This needs to be here to update the message that is being typed
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

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

      setCompletionResult(completion.choices[0].message.content);
    } catch (e) {
      console.error("Error calling OpenAI API:", e);
      setError("Failed to get response from OpenAI");
    }

    setMessage(""); // Clear input after submission
  };


  return (
    <div>
      <h1>This is the home page</h1>
      <div>
        <input class="input-50" type="file" onChange={handleFileChange} />
        <button class="button-50" onClick={handleUpload}>Upload File</button>
      </div>
      <div>
        <textarea
          value={message}
          onChange={handleMessageChange}
        /> 
      </div> 
      <div> 
        <button class="button-50" onClick={handleMessage}>Send Message</button> 
      </div>  
      {file && <p>Selected file: {file.name}</p>} 
      <div> 
        <textarea 
          value={completionResult}  
          readOnly
          rows={6}
          cols={50}
          placeholder="Response will appear here..."
          />
      </div> 
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HomePage;