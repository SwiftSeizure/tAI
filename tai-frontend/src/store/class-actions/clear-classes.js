import { CLASS_STORAGE_KEY } from '../class-store';

export const clearClasses = () => ({ setState }) => {
  const newState = {
    classes: [],
    currentClass: null,
    lastUpdated: null,
    error: null,
    isLoading: false
  };
  
  setState(newState);
  
  // Clear from localStorage
  localStorage.removeItem(CLASS_STORAGE_KEY);
  
  return true;
};
