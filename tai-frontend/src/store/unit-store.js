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

export const UnitStore = createStore({
    name: 'unit',
    initialState: initialState,
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
