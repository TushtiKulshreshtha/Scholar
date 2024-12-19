import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../../services/operations/authAPI";

function LoginForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    /* state variable to store email and password values */
    const[ formData,setFormData ] = useState( { email:"", password:"" } );     
    
    
    /* state variable to visibility of password */
    const [ showPassword, setShowPassword ] = useState(false);

    
    const { email, password } = formData

    function changeHandler(event) {
        setFormData((prevData) => (
            {
                ...prevData,
                [event.target.name] : event.target.value
            }
        ))
    }

    function submitHandler(event) {
        event.preventDefault();
        dispatch( login(email, password, navigate) );
    }

    return (
        <div>
            <form onSubmit={submitHandler} className="flex flex-col w-full gap-4 mt-6">
                <label className="w-full">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">Email Address<sup className="text-pink-200">*</sup></p>
                    <input type="text" required name="email" onChange={changeHandler} value={formData.email} placeholder="Enter Email id" className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "></input>
                </label>
                <label className="w-full relative">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">Password<sup  className="text-pink-200">*</sup></p>
                    <input type={showPassword ? "text" : "password"} required name="password" onChange={changeHandler} value={formData.password} placeholder="Enter Password" className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "></input>
                    <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[38px] cursor-pointer">{showPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF"></AiOutlineEye> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"></AiOutlineEyeInvisible>}</span>
                    <Link to="/forgot-password"><p className="text-xs mt-1 text-blue-100 max-w-max ml-auto">Forgot Password</p></Link>
                </label>
                <button className="bg-yellow-500 py-2 rounded-md font-medium hover:bg-yellow-100">Sign In</button>                                 
            </form>
        </div>
    );
}

export default LoginForm;