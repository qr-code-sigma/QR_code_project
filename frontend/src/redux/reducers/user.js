import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    userData: {},
    status: null,
}


export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        test: (state, action) => {

        }
    },
    extraReducers: (builder) => {

    },
})

export const {test} = userSlice.actions

export default userSlice.reducer
