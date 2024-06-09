export const checkNitrate = (nitrate, updatedTankErrors) => {
    if (nitrate > 40) {
        updatedTankErrors.push({severity: 'error', message: `Nitrate levels above 40 are dangerous to your fish.`});
    }
}