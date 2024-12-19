import { createSlice } from "@reduxjs/toolkit";

// This slice contains the information about user token

// creation of initial values
const initialState = {
    signupData: null,
    loading: false,
    token : localStorage.getItem("token") ?  JSON.parse( localStorage.getItem("token") ) : null,
};


// creating a slice
const authSlice = createSlice({
    name:"auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setToken(state , value) {
            state.token = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload
        }
    }
})


// export 
export const { setSignupData,  setToken , setLoading} = authSlice.actions;   // export reducers function
export default authSlice.reducer;