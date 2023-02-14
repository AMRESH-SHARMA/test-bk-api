export const equalsIgnoringCase = (text, other) => {
  return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}