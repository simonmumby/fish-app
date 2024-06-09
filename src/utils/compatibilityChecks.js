export const checkCompatibility = (fish, fishInTank, completedChecks, errors) => {
    fishInTank.forEach(fishToCompare => {
      const hasBeenCompared = completedChecks.includes(fishToCompare.name);
  
      if (fish.name === fishToCompare.name || hasBeenCompared) {
        return;
      }
  
      const notCompatibleWith = fishToCompare.notCompatibleWith;
  
      if (notCompatibleWith.includes(fish.name)) {
        completedChecks.push(fish.name);
        errors.push({ severity: 'error', message: `The ${fish.name} fish and ${fishToCompare.name} fish are not compatible.` });
      }
    });
  };
  