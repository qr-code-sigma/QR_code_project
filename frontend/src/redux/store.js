import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./reducers/user.js";
import authSlice from "./reducers/auth.js";

export const store = configureStore({
    reducer: {
        user: userSlice,
        auth: authSlice
    },
})