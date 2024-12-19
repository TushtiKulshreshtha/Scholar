import React, { useEffect, useState } from "react"

// import inbuilt form hook
import { useForm } from "react-hook-form"
import CountryCode from "../../../data/countrycode.json"
import { apiConnector } from "../../../services/apiconnector"
import { contactusEndpoint } from "../../../services/apis"



const ContactUsForm = () => {

    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, reset, formState: {errors, isSubmitSuccessfull }} = useForm();


    // if form is submitted succesfully then, reset all contents of form
    useEffect( () => {
        if( isSubmitSuccessfull ) {
            reset( { email:"", firstname:"", lastname:"", message:"", phoneNo:"" });
        }
    }, [ reset, isSubmitSuccessfull ]);



    // Submit contact form and hit backend contact us API
    const submitContactForm = async(data) => {
        console.log("console data", data);
        try{
            setLoading(true);
            const response = { status:"OK" };
            console.log("Logging response" , response);
            setLoading(false);
        }
        catch(error) {
            console.log("Errror:", error.message);
            setLoading(false);
        }
    }



    return (
        <form onSubmit={ handleSubmit( submitContactForm ) }  className="flex flex-col gap-7" >



            {/* First Name And Last Name div */}
            <div className="flex flex-col gap-5 lg:flex-row">
                
                {/* First Name div */}
                <div className="flex flex-col gap-2 lg:w-[48%]" >

                    <div className="flex flex-row"> <label htmlFor="firstname" className="lable-style" > First Name </label> <sup  className="text-pink-200 pt-4">*</sup> </div>
                    <input type="text" name="firstname" id="firstname" placeholder="Enter first name" className="form-style" {...register("firstname", { required: true })} />

                    {
                        errors.firstname && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter Your name.
                            </span>
                        )
                    }
                </div>


                {/* Last Name Name div */}
                <div className="flex flex-col gap-2 lg:w-[48%]" > 
                    <label htmlFor="lastname" className="lable-style"> Last Name </label>
                    <input type="text" name="lastname" id="lastname" placeholder="Enter last name" className="form-style" {...register("lastname" )} />
                </div>


            </div>



            {/* Email Address div */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-row"> <label htmlFor="lastname" className="lable-style"> Email Address </label> <sup  className="text-pink-200 pt-4"> * </sup> </div>
                <input type="email" name="email" id="email" placeholder="email" className="form-style" {...register("email", { required: true })} />
                
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your Email address.
                        </span>
                    )
                }

            </div>
            



            {/* Dropdown &  Phone No Div */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-row"> <label htmlFor="phonenumber" > Phone Number </label> <sup  className="text-pink-200 pt-4 ">*</sup> </div>
                
                <div className="flex flex-row gap-5 " >
                    {/* Dropdown Menu*/}
                    <div className="flex w-[81px] flex-col gap-2">
                        < select type="text" name="dropdown" id="dropdown" className="form-style" {...register("countrycode", { required: true })} >
                            {
                                CountryCode.map( (element, index) => {
                                    return (
                                        <option key = { index } value={ element.code }>
                                            { element.code } -{ element.country } 
                                        </option>
                                    )
                                } )
                            }
                        </select>
                    </div>




                    {/* Enter Phone number div */}
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input 
                            type="number" 
                            name="phonenumber" 
                            id="phonenumber" 
                            placeholder="12345 67890"  
                            className="form-style"
                            {...register("phoneNo", {
                                required: { 
                                    value: true, message: "Please enter your Phone Number." },
                                    maxLength: { value: 12, message: "Invalid Phone Number" },
                                    minLength: { value: 10, message: "Invalid Phone Number" },
                            })}
                        />
                    </div>
                </div>
            </div>




            {/* Message Box div */}
            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="lable-style"> Message </label>
                <textarea name="message" id="message" cols="30" placeholder="Enter your message here" className="form-style" {...register("message", { required: true })} />
                

                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your Message.
                        </span>
                    )
                }
            </div>



            <button type="submit" className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]`} >
                Send Message
            </button>


        </form>
    )
}


export default ContactUsForm;