import { createSlice } from "@reduxjs/toolkit";

// This slice contains the information weahter the root user is instructor or student or admin

const initialState = {
    // extract user details from localstorage to presist data
    // whenever we refresh the page data is not presit ie. why storing user data like firstName lastName is impt
    // These data are used inside dashboard/my-profile
    user: localStorage.getItem("user") ?  JSON.parse( localStorage.getItem("user") ) : null,
    loading: false,
};


const profileSlice = createSlice( {
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state , value) {
            state.user = value.payload;
        },
        setLoading(state , value) {
            state.loading = value.payload;
        }
    },
} );



// export 
export const { setUser , setLoading } = profileSlice.actions;   // export reducers function
export default profileSlice.reducer;