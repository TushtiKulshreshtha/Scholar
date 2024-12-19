import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import { signUp, sendOtp } from "../services/operations/authAPI";

import { RxCountdownTimer } from "react-icons/rx";
import { BiArrowBack } from "react-icons/bi"


const VerifyEmail = () => {

    // used to create a state variable
    const [ otp, setOtp ] = useState("");

    // used to call fucntions that are created in slices
    const dispatch = useDispatch();

    // use to navigate between pages
    const navigate = useNavigate();

    // get the complete user detail from slices later is used with combined otp to send
    // packets 
    const { signupData, loading } = useSelector( (state) => state.auth );


    // If all user data is not present than navigate user again to signup page and fill
    // its complete data and otp is extracted using this controlers 
    // and combined signUpData + otp is send for signup route in backend
    useEffect(() => {
        if(!signupData) {
            navigate("/signup");
        }
    }, []);


    function handleOnSubmit(event) {
        event.preventDefault();


        const { firstName, lastName, accountType, email, password, confirmPassword } = signupData;

        dispatch( signUp(firstName, lastName, accountType, email, password, confirmPassword, otp, navigate)  );
    }



    return (
        <div className="min-h-[calc(100vh-8.5rem)] grid place-items-center">
            {
                loading ? ( <div className="spinner">  </div> ) :
                (
                    <div className="max-w-[500px] p-4 lg:p-8">
                        {/* Heading */}
                        <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]"> 
                            Verify Email 
                        </h1>


                        {/* Paragraph */} 
                        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">  
                            A verification code has been sent to you. Enter the code below
                        </p>


                        {/* Input Form */}
                        <form onSubmit={ handleOnSubmit }>
                            <OTPInput value = { otp } onChange={ setOtp } numInputs={ 6 } 
                                renderSeparator = { <span> - </span>}
                                renderInput={ (props) => ( <input {...props} placeholder="-"  style={ { boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", } }
                                className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50" /> ) }
                                containerStyle={ { justifyContent: "space-between", gap: "0 6px", } }
                            />
                            <button type="submit" className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
                                Verify Email
                            </button>
                        </form>



                        <div className="mt-6 flex items-center justify-between" >
                            {/* Back to Login */}
                            <div>
                                <Link to="/login">
                                    <p className="text-richblack-5 flex items-center gap-x-2"> 
                                        <BiArrowBack />Back to login 
                                    </p>
                                </Link>
                            </div>


                            {/* Resend it button  */}
                            <button className="flex items-center text-blue-100 gap-x-2" onClick={ () => dispatch( sendOtp(signupData.email, navigate) ) }>
                                <RxCountdownTimer />
                                Resend it
                            </button>


                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default VerifyEmail;