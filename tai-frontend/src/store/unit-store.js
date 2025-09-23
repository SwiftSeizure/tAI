import { createStore, createHook } from 'react-sweet-state';
import * as actions from './unit-actions';  

export const UNIT_STORAGE_KEY = 'tai_unit_state';

const initialState = {
    currentUnit: null,
    units: [],
    isLoading: false,
    error: null,
    lastUpdated: null
}; 

// Load state from localStorage if available
export const loadUnitState = () => {
  try {
    const serializedState = localStorage.getItem(UNIT_STORAGE_KEY);
    if (serializedState === null) return initialState;
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load unit state from localStorage:', err);
    return initialState;
  }
};

export const UnitStore = createStore({
    name: 'unit',
    initialState: loadUnitState(),
    actions,
});

export const useUnit = createHook(UnitStore);

export const useCurrentUnit = () => {
    const [state] = useUnit();
    return { currentUnit: state.currentUnit };
};  

export const useAllUnits = () => {
    const [state] = useUnit();
    return { units: state.units };
};

export const useUnitLoading = () => {
    const [state] = useUnit();
    return { isLoading: state.isLoading };
};

export const useUnitError = () => {
    const [state] = useUnit();
    return { error: state.error };
}; 
