import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import fish from './fish.png';
import './App.css';
import db from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';

function App() {

  // State variable to hold fish choices for autocomplete
  const [fishChoices, setFishChoices] = useState([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "compatibilityRules"), (snapshot) => {
        const compatibilityRules = snapshot.docs.map((doc) => doc.data());
        setFishChoices(compatibilityRules.map(fish => ({ label: fish.name })))
      }
      ),
    []
  );

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
          My Fish App! v1.2
        </a>
      </header>
    </div>
  );
}

export default App;