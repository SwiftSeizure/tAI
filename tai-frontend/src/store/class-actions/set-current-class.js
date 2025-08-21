import { CLASS_STORAGE_KEY } from '../class-store';

export const setCurrentClass = (id) => ({ setState, getState }) => {
  const { classes } = getState(); 
  const currentClass = id ? classes.find(c => c.id === id) || null : null;

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
