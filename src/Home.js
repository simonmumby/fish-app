import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import fish from './fish.png';
import './Home.css';
import { getFireStore } from "./firebase";
import { collection, onSnapshot, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';

function Home({user}) {

  // State variable to hold fish choices for autocomplete field
  const [fishChoices, setFishChoices] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [allFish, setAllFish] = useState(null);
  const db = getFireStore;
  
  // const saveUser = async (e) => {
  //   e.preventDefault();  
   
  //   try {
  //       const docRef = await addDoc(collection(db, "todos"), {
  //         todo: todo,    
  //       });
  //       console.log("Document written with ID: ", docRef.id);
  //     } catch (e) {
  //       console.error("Error adding document: ", e);
  //     }
  // }

  const addToTank = async (e) => {
    e.preventDefault();  
    try {
        const updatedFish = [...allFish, selectedOption.label];
        const docRef = await setDoc(doc(db, "users", user.uid), {
          allFish: updatedFish,
        }, { merge: true });
        setAllFish(updatedFish);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }

  const addToTankOld = () => {
    if (selectedOption) {
      const updatedFish = [...allFish, selectedOption.label];
      setDoc(doc(db, "users", user.uid), {
        allFish: updatedFish,
      }, { merge: true });
      setAllFish(updatedFish);
    }
  };

  const handleOptionChange = (event, newValue) => {
    setSelectedOption(newValue);
  };

  const updateUserTable = async (db, user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
      }, { merge: true });
    } catch (error) {
      console.error("Error updating user table:", error);
    }
  };

  const fetchCompatibilityRules = async (db) => {
    try {
      const snapshot = await getDocs(collection(db, "compatibilityRules"));
      const compatibilityRules = snapshot.docs.map((doc) => doc.data());
      setFishChoices(compatibilityRules.map(fish => ({ label: fish.name })));
    } catch (error) {
      console.error("Error fetching compatibility rules:", error);
    }
  };

  const fetchFish = async (db, id) => {
    try {
      const docRef = doc(db, "users", id);
      const snapshot = await getDoc(docRef);
      const userData = snapshot.data();
      console.info(userData);
      setAllFish(userData.allFish);


      //const docRef = doc(db, "users", id);
      //const snapshot = await getDoc(docRef);
      //const theUsersFish = snapshot.docs.map((doc) => doc.data());
      //setFishChoices(compatibilityRules.map(fish => ({ label: fish.name })));
    } catch (error) {
      console.error("Error fetching fish:", error);
    }
  };

  useEffect(() => {
    console.info(allFish);
  }, [allFish]);


  useEffect(() => {
    updateUserTable(db, user);
    fetchCompatibilityRules(db);
    fetchFish(db, user.uid);
    
    // Subscribe to onSnapshot after calling the function
    // const unsubscribe = onSnapshot(collection(db, "compatibilityRules"), (snapshot) => {
    //   const compatibilityRules = snapshot.docs.map((doc) => doc.data());
    //   setFishChoices(compatibilityRules.map(fish => ({ label: fish.name })));
    // });
  
    // // Cleanup function
    // return () => unsubscribe();
  }, [db]);
  

  return (
    <div className="Home">
      <h2>Welcome {user.displayName}!</h2>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={fishChoices}
        onChange={handleOptionChange}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Fish" />}
      />
      <button type="submit" className="btn" onClick={addToTank}>Add to tank</button>
      { allFish && 
        <>
          <p>In your tank you have</p>
          <ul>
            {allFish.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> 
        </>
      }  
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