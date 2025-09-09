import { UNIT_STORAGE_KEY } from '../unit-store'; 

export const setUnitError = (error) => ({ setState, getState }) => {
    const newState = {
        error,
        isLoading: false
    };
    
    setState(newState);
    
    // Update localStorage
    localStorage.setItem(UNIT_STORAGE_KEY, JSON.stringify({
        ...getState(),
        ...newState
    }));
    
    return error;
};
