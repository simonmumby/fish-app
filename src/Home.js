import React, { useState, useEffect, cloneElement } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Slider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Avatar,
  IconButton,
  Grid,
  Alert,
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ErrorOutline as ErrorOutlineIcon,
  LeakAdd,
  ErrorOutline
} from '@mui/icons-material';
import fish from './fish.png';
import './Home.css';
import { getFireStore } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import compatibilityRulesDummyData from './data/compatibilityRulesDummyData';
import logoSrc from './appLogo.png';
import {
  checkFishSchoolSize,
  checkTankSize
} from './utils/tankSizeChecks';
import { checkPhLevels } from './utils/pHChecks';
import { checkTempLevels } from './utils/tempChecks';
import { checkCompatibility } from './utils/compatibilityChecks';
import { checkNitrite } from './utils/nitriteChecks';
import { checkNitrate } from './utils/nitrateChecks';
import { checkKh } from './utils/kHChecks';
import { checkGh } from './utils/gHChecks';
import { kHMarks } from './data/kHValues'
import { pHMarks } from './data/pHValues'
import { tempMarks } from './data/tempValues'
import { nitriteMarks } from './data/nitriteValues'
import { nitrateMarks } from './data/nitrateValues'
import { gHMarks } from './data/gHValues'



function Home({user}) {

  // State variable to hold fish choices for autocomplete field
  const [fishChoices, setFishChoices] = useState([]);
  const [fishInTank, setFishInTank] = useState([]);
  const [selectedFish, setSelectedFish] = useState([]);
  const [tankErrors, setTankErrors] = useState([]);
  const [dense, setDense] = useState(false);
  const [tankSize, setTankSize] = useState(80);
  const [totalCmOfFish, setTotalCmOfFish] = useState(0);
  const [pHOfTank , setPhOfTank] = useState(7.2);
  const [tempOfTank , setTempOfTank] = useState(25);
  const [nitrite, setNitrite] = useState(0);
  const [nitrate, setNitrate] = useState(0);
  const [gH, setGh] = useState(30);
  const [kH, setKh] = useState(80);
  const db = getFireStore;


  const handleFishChange = (event, value) => {
    if (value) {
      setSelectedFish(value);
    } else {
      setSelectedFish(null);
    }
  };

  const pHChange = (event, value) => {
    setPhOfTank(value);
  };

  const nitriteChange = (event, value) => {
    setNitrite(value);
  };

  const nitrateChange = (event, value) => {
    setNitrate(value);
  };

  const gHChange = (event, value) => {
    setGh(value);
  };

  const kHChange = (event, value) => {
    setKh(value);
  };

  const temperatureChange = (event, value) => {
    setTempOfTank(value);
  };

  const addToTank = (fishToUpdate, addSubtractValue) => {

    if (fishToUpdate) {

      setFishInTank((prevSelectedFish) => {

        //find the index of the fish in current state
        const fishIndex = prevSelectedFish.findIndex(fish => fish.name === fishToUpdate.name);
  
        if (fishIndex !== -1) {

          const newCount = (prevSelectedFish[fishIndex].count || 0) + addSubtractValue;

          if (newCount > 0) {
            
            // If the fish already exists, get it and increase or decrease its count if it exists otherwise default to 0.
            const updatedFish = {
              ...prevSelectedFish[fishIndex],
              count: (prevSelectedFish[fishIndex].count || 0) + addSubtractValue,
            };
    
            //Return a new array with the updated fish, using array slicing to replace the existing fish object - preserving the order of existing elements.
            return [
              ...prevSelectedFish.slice(0, fishIndex),
              updatedFish,
              ...prevSelectedFish.slice(fishIndex + 1),
            ];

          } else {
            //delete fish 
            return fishInTank.filter(f => f.name !== fishToUpdate.name);
          }
        } else {
          // If the fish doesn't exist, add it with a count of 1
          return [
            ...prevSelectedFish,
            { ...fishToUpdate, count: + 1 },
          ];
        }
      });
    }

  };

  const updateTankSize = (event) => {
    setTankSize(event.target.value);
  };

  const renderListItem = (props, option) => {

    let fishIsCompatible = false;

    ////Check fish compatibility
    fishInTank.forEach(fishToCompare => {

      const compatibleWith = fishToCompare.compatibleWith;

      if (compatibleWith.includes(option.name)) {
        fishIsCompatible = true;
      }

    });

    return (
      <li {...props} key={option.uuid} style={{paddingTop: '15px', paddingBottom: '5px', paddingLeft: '10px'}}>
        <span style={{paddingRight: '10px'}}>
          {fishIsCompatible ?
             <Badge badgeContent='✔' color='success'>
              <Avatar alt={option.name} src={option.imgSrc}></Avatar>
            </Badge>
            :
            <Avatar alt={option.name} src={option.imgSrc}></Avatar>
          }
        </span>
        {option.name}  
      </li>
    );
  }
  

  // useEffect(
  //   () =>
  //     onSnapshot(collection(db, "compatibilityRules"), (snapshot) => {
  //       const compatibilityRules = snapshot.docs.map((doc) => doc.data());
  //       setFishChoices(compatibilityRules.map(fish => ({ label: fish.name, ...fish })))
  //     }
  //     ),
  //   []
  // );

  useEffect(() => {
    setFishChoices(compatibilityRulesDummyData.map(fish => ({ label: fish.name, ...fish }))) 
  },[]);

  useEffect(() => {
    const updatedTankErrors = [];
    const completedCompatibilityChecks = [];
    let newTotalCmOfFish = 0;

    fishInTank.forEach(fish => {
      newTotalCmOfFish += fish.adultSizeCm * fish.count;

      //Fish parameter checks
      checkFishSchoolSize(fish, updatedTankErrors);
      checkPhLevels(fish, pHOfTank, updatedTankErrors);
      checkTempLevels(fish, tempOfTank, updatedTankErrors);

      //Check fish is compatible with all other fish in tank
      checkCompatibility(fish, fishInTank, completedCompatibilityChecks, updatedTankErrors);
    });

    //Tank parameter checks
    checkTankSize(newTotalCmOfFish, tankSize, updatedTankErrors);
    checkNitrite(nitrite, updatedTankErrors);
    checkNitrate(nitrate, updatedTankErrors);
    checkGh(gH, updatedTankErrors);
    checkKh(kH, updatedTankErrors);

    ////Add to check tank substrate?

    setTotalCmOfFish(newTotalCmOfFish);
    setTankErrors(updatedTankErrors);
  }, [fishInTank, tankSize, tempOfTank, pHOfTank, nitrite, nitrate, gH, kH]);


  return (
    <div className="container">

  <div class="logo-container">
      <img src={logoSrc} alt="Example Image" class="logo-image"/>
      <div class="text">
        <h1 class="logoHeading">TankMaster</h1>
        <h4 class="logoSubheading">Master the art of fishkeeping.</h4>
      </div>
    </div>

    <div className="grid-container">
      {/* <h2>Welcome {user.displayName}!</h2> */}
      <div class="grid-item">
        <form>

          
  <Stack sx={{ width: '100%', marginBottom: '2.25rem' }} spacing={2}>
    {tankErrors && tankErrors.map((error) => (
      <Alert severity={error.severity}>{error.message}</Alert>
    ))}
  </Stack>

  <div>
  <label>Search to add fish to your tank</label>
  <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={fishChoices}
      sx={{ width: 300 }}
      onChange={handleFishChange}
      renderInput={(params) => <TextField {...params} label="Search for fish..." />}
      renderOption={(props, option) => renderListItem(props, option)}
    />
    
    <Button variant="contained" color="success" onClick={() => addToTank(selectedFish, 1)}>
    Add to tank
  </Button>
  </div>

  <div>
  <label>Size of your tank (litres)</label>
  <TextField
    id="outlined-number"
    label="Tank size (litres)"
    type="number"
    value={tankSize}
    onChange={updateTankSize}
    style={{marginBottom: "2rem"}}
    InputLabelProps={{
      shrink: true,
    }}
  />
  </div>       


  <p>Total cm of fish: {totalCmOfFish}</p>

    <Box sx={{ width: 300, marginTop: '3rem' }}>
      <p>Water temperature - <strong>{tempOfTank} °C</strong></p>
      <Slider
        aria-label="Always visible"
        defaultValue={25}
        step={1}
        min={10}
        max={30}
        marks={tempMarks}
        onChange={temperatureChange}
      />
    </Box>

    <Box sx={{ width: 300, marginTop: '3rem' }}>
      <p>pH level of water - <strong>{pHOfTank} pH</strong></p>
      <Slider
        aria-label="Always visible"
        defaultValue={6.4}
        step={0.1}
        min={6.4}
        max={8.4}
        marks={pHMarks}
        onChange={pHChange}
      />
    </Box>

    <Box sx={{ width: 300, marginTop: '3rem' }}>
      <p>Nitrite level of water - <strong>{nitrite} NO2</strong></p>
      <Slider
        aria-label="Always visible"
        defaultValue={0}
        step={0.5}
        min={0}
        max={3.0}
        marks={nitriteMarks}
        onChange={nitriteChange}
      />
    </Box>

    <Box sx={{ width: 300, marginTop: '3rem' }}>
      <p>Nitrate level of water - <strong>{nitrate} NO3</strong></p>
      <Slider
        aria-label="Always visible"
        defaultValue={0}
        step={null}
        min={0}
        max={200}
        marks={nitrateMarks}
        onChange={nitrateChange}
      />
    </Box>

    <Box sx={{ width: 300, marginTop: '3rem' }}>
      <p>General Hardness of water - <strong>{gH} GH</strong></p>
      <Slider
        aria-label="Always visible"
        defaultValue={30}
        step={null}
        min={0}
        max={180}
        marks={gHMarks}
        onChange={gHChange}
      />
    </Box>

    <Box sx={{ width: 300, marginTop: '3rem' }}>
      <p>Carbonate Hardness of water - <strong>{kH} KH</strong></p>
      <Slider
        aria-label="Always visible"
        defaultValue={80}
        step={null}
        min={0}
        max={240}
        marks={kHMarks}
        onChange={kHChange}
      />
    </Box>

  {/* https://1043140.app.netsuite.com/core/media/media.nl?id=510780&c=1043140&h=2dd845a564be718b9044&_xt=.pdf */}

        </form>
      </div>
      <div class="grid-item">
        <List dense={dense}>
          {fishInTank && fishInTank.map((value) => (
            <ListItem
              key={value.name}
              style={{width: "475px"}}
              secondaryAction={
                <>
                <IconButton edge="end" aria-label="add" onClick={() => addToTank(value, 1)}>
                  <AddIcon />
                </IconButton>

                <IconButton edge="end" aria-label="remove"  onClick={() => addToTank(value, -1)}>
                  <RemoveIcon />
                </IconButton>

                <IconButton edge="end" aria-label="delete" onClick={() => {
                  setFishInTank(
                    fishInTank.filter(f => f.name !== value.name)
                  );
                }}>
                  <DeleteIcon />
                </IconButton>                      
                </>
          }
          >
            <ListItemAvatar>
            <Badge badgeContent={value.count} color="primary">
              <Avatar alt={value.name} src={value.imgSrc}></Avatar>
            </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={value.name}
              secondary={`${value.shortDesc} (${value.adultSizeCm}cm)`}
            />
          </ListItem>
          ))}
        </List>
      </div>
    </div>
    </div>
  );
}

export default Home;