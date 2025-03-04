import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../config/axiosConfig.js'

export const getMe = createAsyncThunk(
    'user/checkIsAuth',
    async function() {
        const response = await axiosInstance.get('/getMe');

        return response.data;
    }
)

export const authMe = createAsyncThunk (
    'user/signIn',
    async function({userData}) {
        const response = await axiosInstance.post('/auth/login', {
            username: userData.username,
            password: userData.password,
        });

        return response.data;
    }
)

const initialState = {
    userData: {},
    isAuthenticated: true,
    status: null
}

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

export const authSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        test: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMe.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.isAuthenticated = action.payload.isAuthenticated;
                if(action.payload.isAuthenticated) {
                    state.userData = action.payload.userData;
                } else {
                    state.userData = {};
                }
            })
            .addCase(getMe.rejected, setError)

            .addCase(authMe.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(authMe.fulfilled, (state, action) => {
                state.status = 'resolved';
                state.isAuthenticated = action.payload.isAuthenticated;
                if(action.payload.isAuthenticated) {
                    state.userData = action.payload.userData;
                } else {
                    state.userData = {};
                }
            })
    },
})

export const {test} = authSlice.actions

export default authSlice.reducer
