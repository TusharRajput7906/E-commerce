import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        initialLoading: true,
    },

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.initialLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.initialLoading = false;
        },
        setAuthChecked: (state) => {
            state.initialLoading = false;
        },
    },
});

export const { setCredentials, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;