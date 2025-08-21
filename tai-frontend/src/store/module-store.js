import { createStore, createHook } from 'react-sweet-state';
import * as actions from './module-actions';  

export const MODULE_STORAGE_KEY = 'tai_module_state';

const initialState = {
    modules: [],
    isLoading: false,
    error: null,
    lastUpdated: null
}; 

export const ModuleStore = createStore({
    name: 'module',
    initialState: initialState,
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
