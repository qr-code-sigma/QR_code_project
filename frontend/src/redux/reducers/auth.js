import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig.js";

export const getMe = createAsyncThunk("user/create", async function ({ user }) {
  const response = await axiosInstance.get("/getMe");

  return response.data;
});

const initialState = {
  userData: {},
  isAuthenticated: true,
  status: null,
};

const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload;
};

export const authSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    test: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = "resolved";
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.isAuthenticated) {
          state.userData = action.payload.userData;
        } else {
          state.userData = {};
        }
      })
      .addCase(getMe.rejected, setError);
  },
});

export const { test } = authSlice.actions;

export default authSlice.reducer;
