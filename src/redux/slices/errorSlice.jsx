import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        hasError: {},
    },
    reducers: {
        setError(state, action) {
            state.hasError = action.payload; // Asigna el error directamente
        },
    },
});

export const { setError } = errorSlice.actions;
export default errorSlice.reducer;