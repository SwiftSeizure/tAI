import { MODULE_STORAGE_KEY } from '../module-store'; 

export const setModuleError = (error) => ({ setState, getState }) => {
  const newState = {
    error,
    isLoading: false
  };
  
  setState(newState);
  
  // Update localStorage
  localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  }));
  
  return error;
};
