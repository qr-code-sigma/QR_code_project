import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig.js";

export const getMe = createAsyncThunk(
    "user/checkIsAuth",
    async function () {
        const response = await axiosInstance.get("/auth/get_me");
        console.log(response.data);
        return response.data;
    });

export const authMe = createAsyncThunk(
    "user/signIn",
    async function ({userData, navigate}, {rejectWithValue}) {
        let response;
        try {
            response = await axiosInstance.post("/auth/login/", {
                username: userData.userName,
                password: userData.password,
            });

            navigate("/");

            return response.data.details;
        } catch (e) {
            console.log(`Response in error: ${e.response.data.details}`)
            return rejectWithValue(e.response.data.details);
        }
    },
);

const initialState = {
    userData: {},
    isAuthenticated: false,
    getMeStatus: null,
    authStatus: null
};

export const authSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        clearState: (state) => {
            state.authStatus = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMe.pending, (state) => {
                state.getMeStatus = "loading";
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.getMeStatus = "resolved";
                state.isAuthenticated = action.payload.isAuthenticated;
                if (action.payload.isAuthenticated) {
                    state.userData = action.payload.userData;
                } else {
                    state.userData = {};
                }
            })
            .addCase(getMe.rejected, (state, action) => {
                state.getMeStatus = 'rejected';
            })
            .addCase(authMe.pending, (state, action) => {
                state.authStatus = "loading";
                state.error = null;
            })
            .addCase(authMe.fulfilled, (state, action) => {
                state.authStatus = "resolved";
                state.error = null;
            })
            .addCase(authMe.rejected, (state, action) => {
                state.authStatus = "rejected";
                state.error = action.payload;
            })
    },
});

export const {clearState} = authSlice.actions;

export default authSlice.reducer;
