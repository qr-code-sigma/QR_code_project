import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../config/axiosConfig.js'

export const createUser = createAsyncThunk(
    'user/create',
    async function({user, navigate}, {rejectWithValue}) {
        const response = await axiosInstance.post('/auth/register', {
            first_name: user.firstName,
            last_name: user.lastName,
            password: user.password,
            password2: user.confirmPassword,
            email: user.email,
            username: user.userName
        });

        if(response.status > 200) {
            console.log("Rejected")
            return rejectWithValue(response.status)
        }
        console.log("Navigating to email")
        navigate('/confirmEmail', { state: { email: user.email } })

        return true;
    }
)

export const confirmEmail = createAsyncThunk(
    'user/confirmEmail',
    async function({code, email}, {rejectWithValue}) {
        let response;
        try {
            response = await axiosInstance.post('/auth/confirm_email', {code, email});
        } catch(e) {
            return rejectWithValue(response.status)
        }

        if(response.status > 200) {
            return rejectWithValue(response.status)
        } else {
            return 'successful'
        }
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

                switch (action.payload) {
                    case 403: {
                        state.error = 'User already exists'
                        break;
                    }
                    case 400: {
                        state.error = 'Validation error'
                        break;
                    }
                    default: {
                        state.error = 'Server error'
                        break;
                    }
                }
            })
            .addCase(confirmEmail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(confirmEmail.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = 'Code you wrote does not match to the code sent to your email'
            })
    },
})

export const {test} = userSlice.actions

export default userSlice.reducer
