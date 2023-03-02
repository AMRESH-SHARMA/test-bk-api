export const equalsIgnoringCase = (text, other) => {
  return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
}