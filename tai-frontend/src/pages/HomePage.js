// TODO: Split into a chat component and a file upload component for 
import '../App.css';
import React, { useState } from 'react'; 
import OpenAI from "openai"; 
import ChatFeature from "../components/ChatFeature";



console.log("API Key:", process.env.OPENAI_API_KEY); 

const HomePage = ( { user }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null); 
  const [fileContext, setFileContext] = useState(null);

  // File Changed Handler
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };
 
  // File context handler 
  const handleFileContextChange = (event) => {  
    console.log("File Context Changed to:", event.target.value);
    setFileContext(event.target.value);
  }; 

  // Uploading file handler
  const handleUpload = () => {
    if (file) {
      console.log("File selected:", file.name, fileContext); 

      // Can upload to GPT here for files 
    } else {
      console.log("No file selected, currently the context is:", fileContext);
    }
  }; 

  // This needs to be here to update the message that is being typed
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
 


  return (
    <div>
      <h1>This is the home page</h1> 
      <div> You are currently logged in as a {localStorage.getItem('user')} </div>
      <div>
        <input class="input-50" type="file" onChange={handleFileChange} /> 
      </div> 
      <div>
        <button class="button-50" onClick={handleUpload}>Upload File</button>   
        <select id = "dropdown" onChange={handleFileContextChange}>
          <option value="N/A">N/A</option>
          <option value="Lesson-Plan">Lesson Plan</option>
          <option value="Homework">Homework</option>
          <option value="Course-Overview">Course Overview</option>
        </select>
      </div>
      
      < ChatFeature />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HomePage;