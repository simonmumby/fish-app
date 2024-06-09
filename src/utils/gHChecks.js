export const checkGh = (gH, updatedTankErrors) => {
    if (gH === 0 || gH > 120) {
        updatedTankErrors.push({severity: 'error', message: `General hardness is not optimum and should be between 30 - 120 GH.`});
    }
}