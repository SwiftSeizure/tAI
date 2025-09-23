import { MODULE_STORAGE_KEY } from '../module-store'; 

export const setModuleLoading = (isLoading) => ({ setState, getState }) => {
  const newState = { isLoading };
  setState(newState);
  
  // Update localStorage
  localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  }));
  
  return isLoading;
};
