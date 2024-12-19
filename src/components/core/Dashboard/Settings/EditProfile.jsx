// UTILITY FUNCTIONS
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


// CUSTOM FUCNTIONS
import IconBtn from "../../../common/IconBtn";


// BACKEND API CONTROLLERS ---> SETTINGSAPI
import { updateProfile } from "../../../../services/operations/settingAPI";



// MAP CONSTANTS FOR ---> DROPDOWN
const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]






const EditProfile = () => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const { register, handleSubmit, formState: { errors }, } = useForm();



    const submitProfileForm = async (data, event) => {
        event.preventDefault();
        console.log("Form Data - ", data)
        try {
            dispatch( updateProfile(token, data) )
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }




    return (
        <div>

            <form onSubmit={ handleSubmit(submitProfileForm) } >
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    




                    {/* Sub Heading  */}
                    <h2 className="text-lg font-semibold text-richblack-5">
                        Profile Information
                    </h2>



                    {/* USER INFO ROW 1 ---> First Name, Last Name */}
                    <div className="flex flex-col gap-5 lg:flex-row">


                        {/* First Name Div  */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="firstName" className="lable-style">
                                <div className="flex felx-row gap-0.5">
                                    First Name
                                    <sup  className="text-pink-200 mt-2 text-sm"> * </sup>
                                </div>
                            </label>
                            <input type="text" name="firstName" id="firstName" placeholder="Enter first name"  className="form-style" {...register("firstName", { required: true })} defaultValue={user?.firstName} />
                            { errors.lastName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your last name.
                                </span>
                            )}
                        </div>


                        {/* Last Name Div  */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastName" className="lable-style">
                                <div className="flex felx-row gap-0.5">
                                    Last Name
                                    <sup  className="text-pink-200 mt-2 text-sm"> * </sup>
                                </div>
                            </label>
                            <input type="text" name="lastName" id="lastName" placeholder="Enter last name"  className="form-style" {...register("lastName", { required: true })} defaultValue={user?.lastName} />
                            {/* Handel if any error occured  */}
                            { errors.lastName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your last name.
                                </span>
                            )}
                        </div>
                    </div>




                    {/* USER INFO ROW 2 ---> DOB, Gender */}
                    <div className="flex flex-col gap-5 lg:flex-row">

                        {/* DOB Div  */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="dateOfBirth" className="lable-style">
                                <div className="flex felx-row gap-0.5">
                                    Date Of Birth
                                    <sup  className="text-pink-200 mt-2 text-sm"> * </sup>
                                </div>
                            </label>
                            <input type="date" name="dateOfBirth" id="dateOfBirth"  className="form-style" 
                                {...register("dateOfBirth", {
                                    required: {
                                        value: true,
                                        message: "Please enter your Date of Birth.",
                                    },
                                    max: {
                                        value: new Date().toISOString().split("T")[0],
                                        message: "Date of Birth cannot be in the future.",
                                    },
                                })}
                                defaultValue={user?.additionalDetails?.dateOfBirth}
                            />
                            { errors.lastName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your last name.
                                </span>
                            )}
                        </div>



                        {/* Gender Div  */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="gender" className="lable-style"> 
                                <div className="flex felx-row gap-0.5">
                                    Gender
                                    <sup  className="text-pink-200 mt-2 text-sm"> * </sup>
                                </div>
                            </label>
                            <select type="text" name="gender" id="gender" className="rounded-lg bg-richblack-700 p-3.5 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none" {...register("gender", { required: true })} defaultValue={user?.additionalDetails?.gender} >
                                {
                                    genders.map((element, index) => {
                                        return (
                                            <option key={index} value={element}>
                                                {element}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                            {errors.gender && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your Date of Birth.
                            </span>
                            )}
                        </div>
                    </div>



                    {/* USER INFO ROW 3 ---> Contact Number, ABout */}
                    <div className="flex flex-col gap-5 lg:flex-row">



                        {/* Contact Number  */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="contactNumber" className="lable-style">
                                <div className="flex felx-row gap-0.5">
                                    Contact Number
                                    <sup  className="text-pink-200 mt-2 text-sm"> * </sup>
                                </div>
                            </label>
                            <input type="tel" name="contactNumber" id="contactNumber" placeholder="Enter Contact Number" className="form-style"
                                {...register("contactNumber", {
                                    required: {
                                        value: true,
                                        message: "Please enter your Contact Number.",
                                    },
                                    maxLength: { value: 12, message: "Invalid Contact Number" },
                                    minLength: { value: 10, message: "Invalid Contact Number" },
                                })}
                                defaultValue={user?.additionalDetails?.contactNumber}
                            />
                            {errors.contactNumber && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    {errors.contactNumber.message}
                                </span>
                            )}
                        </div>



                        {/* About  */}
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="about" className="lable-style"> 
                                <div className="flex felx-row gap-0.5">
                                    About
                                    <sup  className="text-pink-200 mt-2 text-sm"> * </sup>
                                </div>
                            </label>
                            <input type="text" name="about" id="about" placeholder="Enter Bio Details" className="form-style" 
                                {...register("about", { required: true })}
                                defaultValue={user?.additionalDetails?.about}
                            />
                            {errors.about && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your About.
                                </span>
                            )}
                        </div>
                    </div>
                </div>



                {/* Button  */}
                <div className="flex justify-end gap-2">
                    <button onClick={() => { navigate("/dashboard/my-profile") }} className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50" >
                        Cancel
                    </button>
                    <IconBtn type="submit" text="Save" />
                </div>



            </form>
        </div>
    )
}





export default EditProfile;