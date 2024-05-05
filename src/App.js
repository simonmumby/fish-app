import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import logo from './logo.svg';
import fish from './fish.png';
import './App.css';
import compatibilityRules from './data/compatibilityRules';
//import fishChoices from './data/fishChoices';


function App() {

  // State variable to hold fish choices
  const [fishChoices, setFishChoices] = useState([]);

  useEffect(() => {

    // Extract fish names from the compatibilityRules object
    const fishNames = Object.keys(compatibilityRules);

    // Map fish names to array of objects with 'label' property
    const choices = fishNames.map(fishName => ({ label: fishName }));

    // Set fish choices in state
    setFishChoices(choices);

  }, []); // Run effect only once when component mounts


  return (
    <div className="App">
       <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={fishChoices}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Fish" />}
      /> 
      <header className="App-header">
        <img src={fish} className="App-logo" alt="logo" />
        <p>
          Lost of fishes coming soon...
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          My Fish App!
        </a>
      </header>
    </div>
  );
}

export default App;