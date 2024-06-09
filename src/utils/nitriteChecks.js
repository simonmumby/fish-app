export const checkNitrite = (nitrite, updatedTankErrors) => {
    if (nitrite > 0) {
        updatedTankErrors.push({severity: 'error', message: `Nitrite levels above 0.5 are dangerous to your fish.`});
    }
}