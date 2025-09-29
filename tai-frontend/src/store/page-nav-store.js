import { createStore, createHook } from 'react-sweet-state'; 

const initialState = {
    currentPage: 'home',  
    pageHistory: [],
}; 

const actions = {
    setCurrentPage: (state, page) => {
        state.currentPage = page;
    },
};

export const PageNavStore = createStore({
    initialState,
    actions,
});

export const usePageNav = createHook(PageNavStore);

