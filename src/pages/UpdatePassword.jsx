import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"

import { BiArrowBack } from "react-icons/bi"

import { Link } from "react-router-dom";

import { resetPassword } from "../services/operations/authAPI";
import toast from "react-hot-toast";

// Contains the frontend logic that send over the EMAIL 

const UpdatePassowrd = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();


    const [ formData, setFormData ] = useState( { password:"", confirmPassowrd: "" } )


    const [ showPassword, setShowPassword ] = useState( false );
    const [ showConfirmPassword, setShowConfirmPassword ] = useState( false );


    const { loading } = useSelector( (state) => state.auth );



    const { password, confirmPassword } = formData;



    // Handle change in input fields for password and confirm password
    function handleOnChange(event) {
        console.log(event.target.value);
        setFormData( (prevData) => (
            {
                ...prevData,
                [event.target.name] : event.target.value
            }
        ))
    }



    // handle form submission
    function handleOnSubmit(event) {
        event.preventDefault();

        // check weather password and confirm password are equal
        if( password !== confirmPassword ) {
            toast.error("Password And Confrim Password doesn't Match");
            return ;
        }

        // extract the token from user forntend
        const token = location.pathname.split('/').at(-1);
        dispatch( resetPassword( password, confirmPassword, token , navigate ) );
    }



    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                loading ? ( <div  className="spinner"> </div>  ) 
                :
                ( 
                    <div className="max-w-[500px] p-4 lg:p-8" >
                        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5" > 
                            Choose new Password 
                        </h1>
                        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100" > 
                            Almost done. Enter Your new Password and youre all set. 
                        </p>



                        <form onSubmit={ handleOnSubmit }>


                            {/* new Passowrd Label */}
                            <label className="relative">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5" > 
                                    New Password
                                    <sup className="text-pink-200">*</sup>
                                </p>
                                <input required type = { showPassword ? "text" : "password"  } name="password" value={ password } onChange={ handleOnChange } placeholder="Password" className="form-style w-full"></input>
                                <span onClick = { () => setShowPassword( (prev) => !prev )  } className="absolute right-3 top-[38px] z-[10] cursor-pointer"> 
                                    {
                                        showPassword ?  <AiFillEye fontSize={24} fill="#AFB2BF" /> : <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    }
                                </span>
                            </label>
                            


                            {/* Confirm new Password Label */}
                            <label className="relative mt-3 block">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"> 
                                    Confirm New Password 
                                    <sup className="text-pink-200">*</sup> 
                                </p>
                                <input required type = { showConfirmPassword ? "text" : "password"  } name="confirmPassword" value={ confirmPassword } onChange={ handleOnChange } placeholder="Confirm Password"  className="form-style w-full" ></input>
                                <span onClick = { () => setShowConfirmPassword( (prev) => !prev )  } className="absolute right-3 top-[38px] z-[10] cursor-pointer"> 
                                    {
                                        showConfirmPassword ? <AiFillEye fontSize={24} fill="#AFB2BF" /> : <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    }
                                </span>
                            </label>


                            <button type = "submit"  className="w-full mt-11 bg-yellow-500 py-2 rounded-md font-medium  transform transition-transform hover:scale-30 cursor-pointer hover:bg-yellow-100 text-richblack-900">
                                Reset Password
                            </button>
                        </form>


                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/login">
                                <p className="flex items-center gap-x-2 text-richblack-5"> 
                                    <BiArrowBack /> Back to Login 
                                </p>
                            </Link>
                        </div>


                    </div> 
                )
            }
        </div>
    )
}



export default UpdatePassowrd;