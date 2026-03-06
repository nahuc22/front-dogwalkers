import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        darkMode: false,
    },
    reducers: {
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode; // Inmutable gracias a Immer
        },
    },
});

export const { toggleDarkMode } = appSlice.actions;
export default appSlice.reducer;