export const checkKh = (kH, updatedTankErrors) => {
    if (kH < 80 || kH > 120) {
        updatedTankErrors.push({severity: 'error', message: `Carbonate hardness  is not optimum and should be between 80 - 120 KH.`});
      }
}