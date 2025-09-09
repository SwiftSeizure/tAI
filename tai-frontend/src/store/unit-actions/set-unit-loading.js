import { UNIT_STORAGE_KEY } from '../unit-store'; 

export const setUnitLoading = (isLoading) => ({ setState, getState }) => {
    const newState = { isLoading };
    setState(newState);
    
    // Update localStorage
    localStorage.setItem(UNIT_STORAGE_KEY, JSON.stringify({
        ...getState(),
        ...newState
    }));
    
    return isLoading;
};
    