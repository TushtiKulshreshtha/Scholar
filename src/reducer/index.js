import { combineReducers } from "@reduxjs/toolkit"; 


import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";
import viewCourseSlice from "../slices/viewCourseSlice";

// RootReducer function is to combine all the reducers/functions that created in slices folder 
// Reducers ---> Reducer are the functions for slices


const rootReducer = combineReducers ( {
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer,
    viewCourse:viewCourseSlice,
} )




export default rootReducer;