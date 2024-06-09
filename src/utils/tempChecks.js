export const checkTempLevels = (fish, tempOfTank, errors) => {
    if (tempOfTank < fish.tempMin) {
      errors.push({ severity: 'error', message: `Your tank should be a minimum of ${fish.tempMin} °C for your ${fish.name} fish` });
    }
    if (tempOfTank > fish.tempMax) {
      errors.push({ severity: 'error', message: `Your tank should be a maximum of ${fish.tempMax} °C for your ${fish.name} fish` });
    }
  };
  