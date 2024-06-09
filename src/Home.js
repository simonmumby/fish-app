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
import { ErrorOutline, LeakAdd } from '@mui/icons-material';
import compatibilityRulesDummyData from './data/compatibilityRulesDummyData'
import logoSrc from './appLogo.png'

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

  //https://m.media-amazon.com/images/I/71qjPIbMHSL._AC_UF894,1000_QL80_.jpg
    const tempMarks = [
    {
      value: 10,
      label: '10°C',
    },
    {
      value: 15,
      label: '15°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 25,
      label: '25°C',
    },
    {
      value: 30,
      label: '30°C',
    },
  ];
  
  const pHMarks = [
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

  const nitriteMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 0.5,
      label: '0.5',
    },
    {
      value: 1.0,
      label: '1.0',
    },
    {
      value: 3.0,
      label: '3.0',
    },
    // {
    //   value: 5.0,
    //   label: '5.0',
    // },
    // {
    //   value: 10.0,
    //   label: '10.0',
    // },
  ];

  const nitrateMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 40,
      label: '40',
    },
    {
      value: 80,
      label: '80',
    },
    {
      value: 160,
      label: '160',
    },
    {
      value: 200,
      label: '200',
    },
  ];

  const gHMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 60,
      label: '60',
    },
    {
      value: 120,
      label: '120',
    },
    {
      value: 180,
      label: '180',
    }
  ];

  const kHMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 40,
      label: '40',
    },
    {
      value: 80,
      label: '80',
    },
    {
      value: 120,
      label: '120',
    },
    {
      value: 180,
      label: '180',
    },
    {
      value: 240,
      label: '240',
    },
  ];

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

      //Check min pH
      if (pHOfTank < f.minPh) {
        updatedTankErrors.push({severity: 'error', message: `Your water should be a minimum of ${f.minPh} pH for your ${f.name} fish`});
      }

      //Check max pH
      if (pHOfTank > f.maxPh) {
        updatedTankErrors.push({severity: 'error', message: `Your water should be a maximum of ${f.maxPh} pH for your ${f.name} fish`});
      }

      //Check min temp
      if (tempOfTank < f.tempMin) {
        updatedTankErrors.push({severity: 'error', message: `Your tank should be a minimum of ${f.tempMin} °C for your ${f.name} fish`});
      }

      //Check max temp
      if (tempOfTank > f.tempMax) {
        updatedTankErrors.push({severity: 'error', message: `Your tank should be a maximum of ${f.tempMax} °C for your ${f.name} fish`});
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

    //Check nitrite
    if (nitrite > 0) {
      updatedTankErrors.push({severity: 'error', message: `Nitrite levels above 0.5 are dangerous to your fish.`});
    }

    //Check nitrate
    if (nitrate > 40) {
      updatedTankErrors.push({severity: 'error', message: `Nitrate levels above 40 are dangerous to your fish.`});
    }

    //Check GH
    if (gH == 0 || gH > 120) {
      updatedTankErrors.push({severity: 'error', message: `General hardness is not optimum and should be between 30 - 120 GH.`});
    }

    //Check KH
    if (kH < 80 || kH > 120) {
      updatedTankErrors.push({severity: 'error', message: `Carbonate hardness  is not optimum and should be between 80 - 120 KH.`});
    }


    ////Check tank substrate

    setTotalCmOfFish(newTotalCmOfFish);
    setTankErrors(updatedTankErrors);
  }, [fishInTank, tankSize, tempOfTank, pHOfTank, nitrite, nitrate, gH, kH]);


  return (
    <div className="container">

  <div class="logo-container">
      <img src={logoSrc} alt="Example Image" class="logo-image"/>
      <div class="text">
        <h1 class="logoHeading">TankMaster</h1>
        <h4 class="logoSubheading">Master the art of fishkeeping</h4>
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