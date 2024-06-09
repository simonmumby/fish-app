import compatibilityRulesDummyData from './data/compatibilityRulesDummyData';

// Extract fish names from the compatibilityRules object
const fishNames = Object.keys(compatibilityRulesDummyData);

// Map over the fish names to create an array of objects with 'label' property
const fishChoices = fishNames.map(fishName => ({
  label: fishName
}));

export default fishChoices;