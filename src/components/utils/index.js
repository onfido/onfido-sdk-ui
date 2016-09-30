export const functionalSwitch = (key, hash) => (hash[key] || (_=>null))()
