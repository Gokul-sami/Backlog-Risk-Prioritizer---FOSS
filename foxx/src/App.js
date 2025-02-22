import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [project, setProject] = useState(null);

  const handleFileChange = (event) => {
    setProject(event.target.files);
  };

  const handleSubmit = () => {
    // Handle the submit logic here
    console.log('Project submitted:', project);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Project Submission Platform</h1>
        <div className="file-input">
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose Project Folder
          </label>
          <input
            id="file-upload"
            type="file"
            webkitdirectory="true"
            mozdirectory="true"
            directory="true"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Submit Project
        </button>
      </header>
    </div>
  );
}

export default App;