import React from "react";
import { apiConnector } from "../apiconnector";
import { setLoading } from "../../slices/authSlice";


import { endpoints } from "../apis"
import { toast } from "react-hot-toast"

// import token slice --> For session restoration
import { setToken } from "../../slices/authSlice"; 


// import user slice ---> For setting user image
import { setUser } from "../../slices/profileSlice"; 




const { SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints
















export function sendOtp( email, navigate ) {
    return async( dispatch ) => {
        console.log(email);
        dispatch( setLoading(true) );
        try{
            const response = await apiConnector("POST", SENDOTP_API, { email });

            console.log("SENDOTP API RESPONSE............", response);

            console.log(response.data.success);


            if( !response.data.success ) {
                throw new Error( response.data.message );
            }

            toast.success("OTP sent successfully");
            navigate("/verify-email");
        }
        catch(error) {
            console.log("SENDOTP API ERROR....", error);
            toast.error("Could Not Send Otp");
        }
        dispatch( setLoading(false) );
    }
}


















export function signUp( firstName, lastName, accountType,  email, password, confirmPassword , otp , navigate) {
    return async( dispatch ) => {
        dispatch( setLoading(true) );
        try{
            const response = await apiConnector("POST", SIGNUP_API, { firstName, lastName, accountType,  email, password, confirmPassword , otp } );

            console.log("SIGNUP API RESPONSE............", response);

            if(!response.data.success) {
                throw new Error(response.data.message);
            }


            toast.success("SignUp successfull");
            navigate("/login");
        }
        catch(error) {
            console.log("SINGUP API ERROR.....", error);
            toast.error("Signup Failed");
            navigate("/signup");
        }
        dispatch( setLoading(false) );
    }
}


















export function login( email, password , navigate) {
    return async( dispatch ) => {
        dispatch( setLoading(true) );
        try {
            const response = await apiConnector("POST", LOGIN_API, { email, password} );

            console.log("LOGIN API RESPONSE............", response);


            if(!response.data.success) {
                throw new Error(response.data.message);
            }


            toast.success("Login successfull");


            // set token in slices storage for further use
            dispatch( setToken( response.data.token ) );

            // navigate user to user dashboard/my-profile if login is successfull
            navigate( "/dashboard" );


            // set the image of user if not created at the time of user singup 
            // main content of user present in { response.data.user.{} }
            const userImage = response.data?.user?.image ? ( response.data.user.image ) : ( `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}` )
            dispatch( setUser( { ...response.data.user, image: userImage } ));


            // save token in local storage that can be used by other routes to transfer to ---> myprofile 
            // if token doesn't found in OpenRoute ---> Show Children components
            // if token is found in OpenRoute ----> Show dashboard/my-profile components
            localStorage.setItem("token", JSON.stringify( response.data.token) );
            console.log("Lsdfjdsoif", response.data.user);
            localStorage.setItem("user", JSON.stringify( response.data.user ) );
        }
        catch(error) {
            console.log("SINGUP API ERROR.....", error);
            toast.error("Login Failed");
            navigate( "/login" );
        }
        dispatch( setLoading(false) );
    }
}





























export function logout(navigate) {
    return (dispatch) => {
        dispatch( setToken(null) );
        dispatch( setUser(null) );
        //dispatch( resetCart(null) );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/");
    }
}
























export function getPasswordResetToken( email , setEmailSent ) {
    return async( dispatch ) => {
        dispatch( setLoading(true) );
        try{
            const response = await apiConnector("POST" , RESETPASSTOKEN_API , { email } ) 
            console.log("RESET PASSWORD TOEKN RESPONSE...", response);

            if( !response.data.success ) {
                throw new Error( response.data.message );
            }
            toast.success("Reset Email Sent");
            setEmailSent(true);
        }   
        catch( error ) {
            console.log("RESET PASSWORD TOEKN ERROR");
            console.log(error.message);
            toast.error("Failed to send email");
        }
        dispatch( setLoading( false ) );
    }
}






















export function resetPassword( password, confirmPassword, token , navigate) {
    return async( dispatch ) => {
        dispatch( setLoading(true) );
        try{
            const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token })
            console.log("Reset Password Response...", response);

            if(!response.data.success) {
                throw new Error( response.data.message );
            }
            
            toast.success("Password reset succesfully");
            navigate("/login");
        }
        catch(error) {
            console.log("RESET PASSWORD TOKEN ERROR", error);
            toast.error( "Unable to reset password" );
        }
        dispatch( setLoading(false) );
    }
}





















