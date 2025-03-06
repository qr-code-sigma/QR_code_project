import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig.js";

export const getMe = createAsyncThunk("user/checkIsAuth", async function () {
  const response = await axiosInstance.get("/auth/get_me");
  console.log(response.data);
  return response.data;
});

export const authMe = createAsyncThunk(
  "user/signIn",
  async function ({ userData, navigate }, { rejectWithValue }) {
    const response = await axiosInstance.post("/auth/login/", {
      username: userData.userName,
      password: userData.password,
    });

    if (response.status === 400) {
      return rejectWithValue(response.data.details);
    }

    navigate("/");

    return response.data.details;
  },
);

const initialState = {
  userData: {},
  isAuthenticated: false,
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
      .addCase(getMe.rejected, setError)
      .addCase(authMe.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(authMe.fulfilled, (state, action) => {
        state.status = "resolved";
        state.error = null;
      });
  },
});

export const { test } = authSlice.actions;

export default authSlice.reducer;
