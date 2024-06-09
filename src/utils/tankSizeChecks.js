export const checkFishSchoolSize = (fish, errors) => {
    if (fish.count < fish.minimumGroupSize) {
      errors.push({ severity: 'warning', message: `You should have a minimum of ${fish.minimumGroupSize} ${fish.name} fish in your tank.` });
    }
    if (fish.count > fish.maximumGroupSize) {
      errors.push({ severity: 'error', message: `You cannot have more than ${fish.maximumGroupSize} ${fish.name} fish in your tank.` });
    }
  };
  
  export const checkTankSize = (totalCmOfFish, tankSize, errors) => {
    if (tankSize < totalCmOfFish) {
      errors.push({ severity: 'error', message: `You have ${Math.round(totalCmOfFish - tankSize)}cm of fish too much for your ${tankSize}L tank.` });
    }
  };
  