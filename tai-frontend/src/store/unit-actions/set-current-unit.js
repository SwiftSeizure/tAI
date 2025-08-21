import { UNIT_STORAGE_KEY } from '../unit-store';

export const setCurrentUnit = (id) => ({ setState, getState }) => {
    const { units } = getState(); 
    const currentUnit = id ? units.find(u => u.id === id) || null : null;

    const newState = {
        ...getState(),
        currentUnit: currentUnit,
        error: null
    };
    
    setState(newState);
    
    // Update localStorage
    localStorage.setItem(UNIT_STORAGE_KEY, JSON.stringify(newState));
    
    return currentUnit;
};