import { configureStore } from '@reduxjs/toolkit'
import {userSlice} from "./reducers/user.js";

export const store = configureStore({
    reducer: {
        user: userSlice
    },
})