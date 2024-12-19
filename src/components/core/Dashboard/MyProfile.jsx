import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

import { RiEditBoxLine } from "react-icons/ri"
import { formattedDate } from "../../../utils/dateFormatter";


const MyProfile = () => {

    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();


    return (
        <div className="mb-14 text-3xl font-medium text-richblack-5">


            {/* heading */}
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                My Profile
            </h1>



            {/* section - 1 */}
            <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">

                <div className="flex items-cenetr gap-x-4">


                    {/* Profile Image */}
                    <img src={user?.image} alt={`profile-${user?.firstName}`} className="aspect-square w-[78px] rounded-full object-cover" />
                    
                    {/* Name  and email div */}
                    <div className="space-y-1">


                        {/* Name */ }
                        <p className="text-lg font-semibold text-richblack-5 mt-3">
                            { user.firstName + " " + user.lastName }
                        </p>


                        { /* Email */ }
                        <p className="text-sm text-richblack-300">{user?.email}</p>
                    </div>
                </div>


                {/* Button */ }
                <IconBtn text="Edit" onclick={ () => { navigate("/dashboard/settings") }}>
                    <RiEditBoxLine />
                </IconBtn>
            </div>




            { /* section - 2*/ }
            <div className="flex flex-col mt-5  justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                
                {/* About and edit button div */}
                <div className="flex w-full items-center justify-between"> 
                    {/* About  */}
                    <p className="text-lg font-semibold text-richblack-5">About</p>
                    {/* Edit button  */}
                    <IconBtn text="Edit" onclick={ () => { navigate("/dashboard/settings") }}>
                        <RiEditBoxLine />
                    </IconBtn>
                </div>

                
                {/* Tell me something about yourself div */}
                <p className={`${
                    user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"
                    } text-sm font-medium mt-3`}
                > 
                    {
                        user?.additionalDetails?.about ??  "Write Something About Yourself"
                    }
                </p>
            </div>



            { /* section - 3*/ }
            <div className="my-5 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                
                {/*  Personal details and edit button div  */}
                <div className="flex w-full items-center justify-between">
                    
                    {/* Personal details  */}
                    <p className="text-lg font-semibold text-richblack-5 "> 
                        Personal Details 
                    </p>

                    {/* edit button  */}
                    <IconBtn text="Edit" onclick={ () => { navigate("/dashboard/settings") }}>
                        <RiEditBoxLine />
                    </IconBtn>
                </div>



                {/* Lower div of Personal Details  */}
                <div className="flex max-w-[500px] justify-between">


                    {/* First Name, Email, Gender - col 1 ---> left side*/}
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <div className="flex felx-row gap-0.5"> 
                                <p className="mb-2 text-sm text-richblack-600">First Name</p> 
                                <sup  className="text-pink-200 mt-2 text-sm"> * </sup>  
                            </div>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.firstName}
                            </p>
                        </div>



                        {/* Email div */}
                        <div>
                            <div className="flex felx-row gap-0.5"> 
                                <p className="mb-2 text-sm text-richblack-600"> Email </p> 
                                <sup  className="text-pink-200 mt-2 text-sm">*</sup>  
                            </div>
                            <p  className="text-sm font-medium text-richblack-5" >
                                {user?.email}
                            </p>
                        </div>



                        {/* Gender div */}
                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Gender </p>
                            <p  className="text-sm font-medium text-richblack-5" >
                                { user?.additionalDetails?.gender ?? "Add Gender" }
                            </p>
                        </div>
                    </div>


                    {/* Last Name, Contact Number , DOB - col 2 ---> Right side*/}
                    <div className="flex flex-col gap-y-5">


                        {/* Last name div */}
                        <div>
                            <div className="flex felx-row gap-0.5"> <p className="mb-2 text-sm text-richblack-600"> Last Name </p> <sup  className="text-pink-200 mt-2 text-sm">*</sup>  </div>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.lastName}
                            </p>
                        </div>


                        {/* Contact Number div */}
                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Mobile Number </p>
                            <p  className="text-sm font-medium text-richblack-5" >
                                { user?.additionalDetails?.contactNumber ?? "Add Contact Number" }
                            </p>
                        </div>


                        {/* DOB  div */}
                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Date Of Birth </p>
                            <p  className="text-sm font-medium text-richblack-5" >
                                { formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth dsfdsf" }
                            </p>
                        </div>
                    </div>
                    
                </div>


            </div>
        </div>
    )
}




export default MyProfile;