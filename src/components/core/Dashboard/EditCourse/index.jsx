// UTILITY COMPONENTS
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";



// SLICE STORE
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";


// BACKEND APIS CALLS
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";



// CUSTOM COMPONETNS
import RenderSteps from "../AddCourse/RenderSteps";








const EditCourse = () => {




    const dispatch = useDispatch();
    const { courseId } = useParams();
    const { course } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);


    const populateCourseDetails = async() => {
        setLoading(true);
        // API CALL ----> Get the entrire details of particular course
        const result = await getFullDetailsOfCourse( courseId , token);
        if (result?.courseDetails) {
            dispatch( setEditCourse(true) );
            dispatch( setCourse(result?.courseDetails) );
        }
        setLoading(false);
    }



    // Fetch Entire course detials on First Render
    useEffect(() => {
        populateCourseDetails();
    }, [])



    // if loading is true than show spinner
    if(loading) {
        return (
            <div className="grid flex-1 place-items-center justify-center mt-[285px] mr-[90px]">
                <div className="spinner"></div>
            </div>
        )
    }



    return (
        <div>


            {/* Heading */}
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Course
            </h1>


            {/* Render Course Data  */}
            <div className="mx-auto max-w-[600px]">
                {
                    course ? ( <RenderSteps /> 
                    ) : (
                        <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                            Course Not Found
                        </p>
                    )
                }
            </div>
        </div>
    )
}



export default EditCourse;