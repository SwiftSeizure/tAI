import { createStore, createHook } from 'react-sweet-state';
import * as actions from './unit-actions'; 

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