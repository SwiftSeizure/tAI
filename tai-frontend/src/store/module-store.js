import { createStore, createHook } from 'react-sweet-state';
import * as actions from './module-actions';  

export const MODULE_STORAGE_KEY = 'tai_module_state';

const initialState = {
    modules: [],
    isLoading: false,
    error: null,
    lastUpdated: null
}; 

// Load state from localStorage if available
export const loadModuleState = () => {
    try {
        const serializedState = localStorage.getItem(MODULE_STORAGE_KEY);
        if (serializedState === null) return initialState;
        return JSON.parse(serializedState);
    } catch (err) {
        console.warn('Failed to load module state from localStorage:', err);
        return initialState;
    }
};

export const ModuleStore = createStore({
    name: 'module',
    initialState: loadModuleState(),
    actions,
});

export const useModule = createHook(ModuleStore); 

export const useModules = () => {
    const [state] = useModule();
    return { modules: state.modules };
};

export const useModuleLoading = () => {
    const [state] = useModule();
    return { isLoading: state.isLoading };
};

export const useModuleError = () => {
    const [state] = useModule();
    return { error: state.error };
};
