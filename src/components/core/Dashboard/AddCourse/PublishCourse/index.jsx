// UTILITY COMPONENTS
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



// CONSTANTS
import { COURSE_STATUS } from "../../../../../utils/constants";




// SLICE STORE
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"




// CUSTOM COMPONETNS
import IconBtn from "../../../../common/IconBtn";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";












const PublishCourse = () => {

    
    // Import React Form for default use
    const { register, handleSubmit, setValue, getValues, formState: { errors }, } = useForm();



    // SLICE STORE VALUES
    const { course } = useSelector( (state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();




    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    }, []);




    const handleCoursePublish = async() => {
        // check if form has been updated or not
        if ( (course?.status === COURSE_STATUS.PUBLISHED &&  getValues("public") === true) || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false) ) {
            // no updation in form
            // no need to make API CALL
            goToCourses();
            return ;
        }
        const formData = new FormData();
        formData.append("courseId", course._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status", courseStatus);
        setLoading(true);
        // API CALL ----> Update course Details
        const result = await editCourseDetails(formData, token);
        if (result) {
            goToCourses();
        }
        setLoading(false);
    }





    // form Submit Handler
    const onSubmit = () => {
        handleCoursePublish();
    }



    // go to previous page --> ie. Course Builder
    const goBack = () => {
        dispatch(setStep(2));
    }




    // go to course page
    const goToCourses = () => {
        dispatch( resetCourseState() );
        navigate("/dashboard/my-courses");
    }





    return (
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">



            {/* SubHeading  */}
            <p className="text-2xl font-semibold text-richblack-5"> 
                Publish Settings
            </p>



            {/* Input Form  */}
            <form onSubmit={ handleSubmit(onSubmit)} >




                {/* Checkbox */}
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="inline-flex items-center text-lg"></label>
                    <input type="checkbox" id="public" {...register("public")} className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5" />
                    <span className="ml-2 text-richblack-400"> Make this course as public </span>
                </div>



                {/* Next and Prev Button */}
                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button disabled={loading}  type="button" onClick={goBack} className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900" >
                        Back
                    </button>
                    <IconBtn disabled={loading} text="Save Changes" />
                </div>
            </form>


        </div>
    )
}


export default PublishCourse;