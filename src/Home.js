import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import fish from './fish.png';
import './Home.css';
import { getFireStore } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';

function Home({user}) {

  // State variable to hold fish choices for autocomplete field
  const [fishChoices, setFishChoices] = useState([]);
  const db = getFireStore;

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
    <div className="Home">
      <h2>Welcome {user.displayName}!</h2>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={fishChoices}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Fish" />}
      />  
      <header className="Home-header">
        <img src={fish} className="Home-logo" alt="logo" />
        <p>
          Lots of fishes coming soon...
        </p>
        <a
          className="Home-link"
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

export default Home;