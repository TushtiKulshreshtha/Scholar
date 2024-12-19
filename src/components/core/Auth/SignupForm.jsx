import { useState } from "react"

import { ACCOUNT_TYPE } from "../../../utils/constants";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// import fetching api routes
import { sendOtp } from "../../../services/operations/authAPI";

// import central stroage for userDetails ---> Later these details are used for sending OTP
import { setSignupData } from "../../../slices/authSlice";

import Tab from "../../common/Tab";





function SignUpForm() {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    // student or instructor state variable
    const [ accountType, setAccountType ] = useState(ACCOUNT_TYPE.STUDENT);



    // state varible for form data
    const [ formData, setFormData ] = useState({ firstName:"" , lastName:"" , email:"", password:"", confirmPassword:"" });



    // extract varibles value from formdata
    const { firstName, lastName, email, password, confirmPassword } = formData



    // state varible for show password and show confrim password
    const [ showPassword , setShowPassword ] = useState(false);
    const [ showConfrimPassword, setShowConfirmPassword ] = useState(false);





    // form submission data
    function handleOnSubmit(event) {


        event.preventDefault();

        // check weather password and confirm password match in forntend itself
        if(password !== confirmPassword) {
            toast.error("Passwords And Confrim Password Do Not Match");
            return;
        }


        // Add details of account Type
        const signupData = {
            ...formData,
            accountType,
        }


        // Setting signup data to state
        // To be used after otp verification
        dispatch( setSignupData( signupData ) );


        // Send OTP to user for verification
        dispatch( sendOtp(formData.email, navigate) );


        // Reset entire form data
        setFormData( { firstName:"" , lastName:"" , email:"" , password:"" , confirmPassword:"" } )
        setAccountType(ACCOUNT_TYPE.STUDENT)
    }



    // monitor form input fields for on change
    function handleOnChange(event) {
        console.log(event.target.value);
        setFormData( (prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }




// data to pass to Tab component
const tabData = [
    {
        id: 1,
        tabName: "Student",
        type: ACCOUNT_TYPE.STUDENT,
    },
    {
        id: 2,
        tabName: "Instructor",
        type: ACCOUNT_TYPE.INSTRUCTOR,
    },
]


    return (
        <div>


            {/* Tab */}
            <Tab tabData={ tabData } field={ accountType } setField={ setAccountType } />


            {/* Form */}
            <form onSubmit={ handleOnSubmit } className="mt-[10px] ">


                {/* Input fields 1 */}
                <div className="flex flex-row justify-between gap-x-4 mt-4">


                    {/* Label for first Name */}
                    <label>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] "> 
                            First Name <sup className="text-pink-200">*</sup> 
                        </p>
                        <input required type="text" name="firstName" value={ firstName } onChange={ handleOnChange } placeholder = "Enter first name" className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]  transform transition-transform hover:scale-105 cursor-pointer"/>
                    </label>


                    {/* Label for last Name */}
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5" > 
                            Last Name <sup className="text-pink-200">*</sup> 
                        </p>
                        <input required type="text" name="lastName" value={ lastName } onChange={ handleOnChange } placeholder = "Enter last name" className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]  transform transition-transform hover:scale-105 cursor-pointer" />
                    </label>
                </div>


                {/* Label for email Address */}
                <label className="w-full">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] mt-4">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input required type="email" name="email" value = { email } onChange={ handleOnChange } placeholder="Enter email Address"  className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]  transform transition-transform hover:scale-105 cursor-pointer"></input>
                </label>


                {/* Password and confrim password div */}
                <div className="flex flex-row gap-x-4 justify-between mt-4">


                    {/* Label for Password */}
                    <label className="relative"> 
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] "> 
                            Create Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input required type={ showPassword ? "text" : "password" } name="password" value={ password } onChange={ handleOnChange } placeholder="Enter Password"  className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]  transform transition-transform hover:scale-105 cursor-pointer"></input>
                        <span onClick={ () => setShowPassword( (prev) => !prev ) } className="absolute right-3 top-[38px]   transform transition-transform hover:scale-105 cursor-pointer"> 
                            { showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" /> }
                        </span>
                    </label>


                    {/* Label for Confirm Password */}
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input required type={showConfrimPassword ? "text" : "password"} name="confirmPassword" value={ confirmPassword } onChange={handleOnChange} placeholder="Confirm Password" className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]  transform transition-transform hover:scale-105 cursor-pointer" />
                        <span onClick={ () => setShowConfirmPassword( (prev) => !prev ) } className="absolute right-3 top-[38px]   transform transition-transform hover:scale-30 cursor-pointer"> 
                            { showConfrimPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" /> }
                        </span>
                    </label>
                </div>


                {/* Submit Button */}
                <button type="submit"  className="w-full mt-11 bg-yellow-500 py-2 rounded-md font-medium  transform transition-transform hover:scale-30 cursor-pointer hover:bg-yellow-100">
                    Create Account
                </button>


            </form>
        </div>
    )
}

export default SignUpForm;