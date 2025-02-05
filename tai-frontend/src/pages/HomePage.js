// TODO: Split into a chat component and a file upload component for 
import '../App.css';
import React, { useState } from 'react';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

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

  const handleMessage = () => {
    // Can upload messages here 
    console.log("Message:", message);
    setMessage("");
  };

  return (
    <div>
      <h1>This is the home page</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button class="button-50" onClick={handleUpload}>Upload File</button>
      </div>
      <div>
        <textarea
          value={message}
          onChange={handleMessageChange}
        />
        <button class="button-50" onClick={handleMessage}>Send Message</button>
      </div>
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
};

export default HomePage;