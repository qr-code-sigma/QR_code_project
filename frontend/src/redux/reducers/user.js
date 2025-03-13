import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../config/axiosConfig.js'
import {updateUserData} from "./auth.js";

export const createUser = createAsyncThunk(
    'user/create',
    async function ({user, navigate}, {rejectWithValue}) {
        let response;

        try {
            response = await axiosInstance.post('/auth/register', {
                first_name: user.firstName,
                last_name: user.lastName,
                password: user.password,
                password2: user.confirmPassword,
                email: user.email,
                username: user.userName
            });
        } catch (e) {
            return rejectWithValue(e.response.data.details)
        }

        if (response.status >= 400) {
            console.log("Rejected")
            return rejectWithValue(response.data.details)
        }
        console.log("Navigating to email")
        navigate('/confirmEmail', {state: {email: user.email}})

        return true;
    }
)

export const updateUser = createAsyncThunk(
    'user/update',
    async function ({user, navigate}, {rejectWithValue,dispatch}) {
        let response;
        try {
            response = await axiosInstance.put('/users/edit/', {
                new_first_name: user.first_name,
                new_last_name: user.last_name,
                new_username: user.username,
                old_password: user.oldPassword,
                new_password: user.newPassword
            }); //На бекенді зараз пост
        } catch (e) {
            console.log(e.response.data.error)
            return rejectWithValue(e.response.data.error)
        }

        window.location.reload();
        navigate('/profile')
        return response?.data;
    }
)

export const confirmEmail = createAsyncThunk(
    'user/confirmEmail',
    async function ({code, email, navigate}, {rejectWithValue}) {
        let response;
        try {
            response = await axiosInstance.post('/auth/confirm_email', {code, email});
        } catch (e) {
            return rejectWithValue(response.status)
        }

        navigate('/')
        window.location.reload();
        return 'successful'
    }
)

const initialState = {
    status: null,
    error: null
}


export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        test: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUser.fulfilled, (state) => {
                state.status = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'rejected';
                console.log(action.payload)
                state.error = action.payload;
            })
            .addCase(confirmEmail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(confirmEmail.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = 'Code you wrote does not match to the code sent to your email'
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = null;
            })
    },
})

export const {test} = userSlice.actions

export default userSlice.reducer
