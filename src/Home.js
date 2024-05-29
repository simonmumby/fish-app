import React, { useState, useEffect, cloneElement } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Badge } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import fish from './fish.png';
import './Home.css';
import { getFireStore } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import { ErrorOutline } from '@mui/icons-material';

function Home({user}) {

  // State variable to hold fish choices for autocomplete field
  const [fishChoices, setFishChoices] = useState([]);
  const [fishInTank, setFishInTank] = useState([]);
  const [selectedFish, setSelectedFish] = useState([]);
  const [tankErrors, setTankErrors] = useState([])
  const [dense, setDense] = useState(false);
  const [tankSize, setTankSize] = useState(80);
  const [totalCmOfFish, setTotalCmOfFish] = useState(0);
  const db = getFireStore;

  //https://m.media-amazon.com/images/I/71qjPIbMHSL._AC_UF894,1000_QL80_.jpg
  const marks = [
    {
      value: 6.4,
      label: '6.4',
    },
    {
      value: 6.8,
      label: '6.8',
    },
    {
      value: 7.2,
      label: '7.2',
    },
    {
      value: 7.8,
      label: '7.8',
    },
    {
      value: 8.0,
      label: '8.0',
    },
    {
      value: 8.4,
      label: '8.4',
    },
  ];
  
  function valuetext(value) {
    return value;
  }

  const handleFishChange = (event, value) => {
    if (value) {
      setSelectedFish(value);
    } else {
      setSelectedFish(null);
    }


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

    let compatibleWarning = "";

    ////Check fish compatibility
    fishInTank.forEach(fishToCompare => {

      const notCompatibleWith = fishToCompare.notCompatibleWith;

      if (notCompatibleWith.includes(option.name)) {
        compatibleWarning = "not compatible"
      }

    });

    return (
      <li {...props} key={option.uuid}>
        {option.name} &nbsp;<small>{compatibleWarning}</small>
      </li>
    );
  }
  

  useEffect(
    () =>
      onSnapshot(collection(db, "compatibilityRules"), (snapshot) => {
        const compatibilityRules = snapshot.docs.map((doc) => doc.data());
        setFishChoices(compatibilityRules.map(fish => ({ label: fish.name, ...fish })))
      }
      ),
    []
  );

  useEffect(() => {
    const updatedTankErrors = [];
    const completedCompatibilityChecks = [];
    let newTotalCmOfFish = 0;

    fishInTank.forEach(f => {

      ////Calculate new total cm of fish
      newTotalCmOfFish = newTotalCmOfFish + (f.adultSizeCm * f.count);

      ////Check minimum fish school sizes
      if (f.count < f.minimumGroupSize) {
        updatedTankErrors.push({severity: 'warning', message: `You should have a minimum of ${f.minimumGroupSize} ${f.name} fish in your tank.`});
      }

      ////Check maximum fish school size
      if (f.count > f.maximumGroupSize) {
        updatedTankErrors.push({severity: 'error', message: `You cannot have more than ${f.maximumGroupSize} ${f.name} fish in your tank.`});
      }

      ////Check fish compatibility
      fishInTank.forEach(fishToCompare => {

        const hasBeenCompared = completedCompatibilityChecks.includes(fishToCompare.name);

        //Don't compare the same fish or fish that have already been compared
        if (f.name === fishToCompare.name || hasBeenCompared) {
          return;
        }

        const notCompatibleWith = fishToCompare.notCompatibleWith;

        if (notCompatibleWith.includes(f.name)) {
          completedCompatibilityChecks.push(f.name);
          updatedTankErrors.push({severity: 'error', message: `The ${f.name} fish and ${fishToCompare.name} fish are not compatible.`});
        }

      });

    });
    
    ////Check tank size
    if (tankSize < newTotalCmOfFish) {
      updatedTankErrors.push({severity: 'error', message: `You have ${Math.round(newTotalCmOfFish - tankSize)}cm of fish too much for your ${tankSize}L tank.`});
    }
    setTotalCmOfFish(newTotalCmOfFish);

    //Check tank pH
    //Check tank substrate

    setTankErrors(updatedTankErrors);
  }, [fishInTank, tankSize]);


  return (
    <div className="Home">
      <div className="grid-container">
  <h2>Welcome {user.displayName}!</h2>
        <form>

     
        <Stack sx={{ width: '100%', marginBottom: '2.25rem' }} spacing={2}>
          {tankErrors && tankErrors.map((error) => (
            <Alert severity={error.severity}>{error.message}</Alert>
          ))}
        </Stack>
       
        <p>Total cm of fish: {totalCmOfFish}</p>

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

       

      <Grid container>

        <Grid item>
          <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={fishChoices}
              sx={{ width: 300 }}
              onChange={handleFishChange}
              renderInput={(params) => <TextField {...params} label="Fish" />}
              renderOption={(props, option) => renderListItem(props, option)}
            />
        </Grid>

        <Grid item alignItems="stretch" style={{ display: "flex" }}>
          <Button variant="contained" color="success" onClick={() => addToTank(selectedFish, 1)}>
            Add to tank
          </Button>
        </Grid>
      </Grid>

  

          <List dense={dense}>
          {fishInTank && fishInTank.map((value) => (
                  <ListItem
                    key={value.name}
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

          
          <Box sx={{ width: 300, marginTop: '3rem' }}>
            <Slider
              aria-label="Always visible"
              defaultValue={6.4}
              getAriaValueText={valuetext}
              step={null}
              min={6.4}
              max={8.4}
              marks={marks}
              valueLabelDisplay="on"
            />
          </Box>


        </form>
        {/* <header className="Home-header">
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
        </header> */}

      </div>
      
    </div>
  );
}

export default Home;