import { CLASS_STORAGE_KEY } from '../class-store';

export const setCurrentClass = (classID) => ({ setState, getState }) => {
  const { classes } = getState(); 
  const currentClass = classID ? classes.find(c => c.id === classID) || null : null;

  const newState = {
    currentClass: currentClass,
    error: null
  };
  
  setState(newState);
  
  // Update localStorage
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  }));
  
  return currentClass;
};
