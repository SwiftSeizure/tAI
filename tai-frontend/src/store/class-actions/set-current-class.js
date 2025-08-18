import { CLASS_STORAGE_KEY } from '../class-store';

export const setCurrentClass = (classId) => ({ setState, getState }) => {
  const { classes } = getState();
  const currentClass = classId ? classes.find(c => c.id === classId) || null : null;
  
  const newState = {
    currentClass,
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
