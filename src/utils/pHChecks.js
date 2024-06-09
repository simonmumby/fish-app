export const checkPhLevels = (fish, pHOfTank, errors) => {
    if (pHOfTank < fish.minPh) {
      errors.push({ severity: 'error', message: `Your water should be a minimum of ${fish.minPh} pH for your ${fish.name} fish` });
    }
    if (pHOfTank > fish.maxPh) {
      errors.push({ severity: 'error', message: `Your water should be a maximum of ${fish.maxPh} pH for your ${fish.name} fish` });
    }
  };
  