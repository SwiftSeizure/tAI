import { getModules } from '../../module/services/get-modules'; 
import { MODULE_STORAGE_KEY } from '../module-store'; 

export const fetchModules = (unitID) => async ({ setState, getState }) => {
  try {
    // Set loading state
    setState({
      ...getState(),
      isLoading: true,
      error: null
    });
    
    // Make the API call
    const modules = await getModules(unitID);
    
    // Update the state with the fetched modules
    const newState = {
      ...getState(),
      modules: modules || [],
      lastUpdated: Date.now(),
      isLoading: false,
      error: null
    };
    
    setState(newState);
    
    // Save to localStorage
    localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(newState));
    
    return modules;
  } catch (error) {
    // Update the state with the error
    const newState = {
      ...getState(),
      isLoading: false,
      error: error.message
    };
    
    setState(newState);
    
    // Save to localStorage
    localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(newState));
    
    throw error;
  } 
};
