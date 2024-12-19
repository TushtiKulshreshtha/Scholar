import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";


// component for single courses
import EnrolledCoursesSingle from "./EnrolledCoursesSingle";




const EnrolledCourses = () => {



    // why token is used here as it need to be send in backend
    const { token } = useSelector( (state) => state.auth );
    // This state variable stores the data of all enrolled courses
    const [ enrolledCourses, setEnrolledCourses ] = useState(null);



    const getEnrolledCourses = async() => {
        try{
            // calling of functions that will return data of token
            console.log("logging token before api call", token);
            const response = await getUserEnrolledCourses(token);
            // without any filtering all data is set in sate variable. 
            // will get stored in page will refresh --> response data will update on frontend
            console.log("enrolled courses data is ---->>", response);
            setEnrolledCourses(response);
        }
        catch(error) { 
            console.log("Unable to Fetch Enrolled Courses");
        }
    }



    // useEffect for backed call on first render
    useEffect(() => {
        getEnrolledCourses();
    }, []);



    return (
        <div  >
            {/* Heading  */}
            <div className="mb-14 text-3xl font-medium text-richblack-5"> Enrolled Courses </div>



            {/* Card Map  */}
            {
                !enrolledCourses ? ( 
                    <div className=" grid h-[70vh] justify-center items-center"> 
                        <div className="spinner"></div>
                    </div>
                ) : enrolledCourses.length < 1 ? ( 
                    <p className="grid h-[30vh] w-full place-content-center text-richblack-5 text-lg font-semibold">
                        You have not enrolled in any course yet.
                    </p>
                ) : (
                    <div className="my-8 text-richblack-5">



                        {/* Headings */}
                        <div className="flex rounded-t-lg bg-richblack-500 ">
                            <p className="w-[45%] px-5 py-3">Course Name</p>
                            <p className="w-1/4 px-2 py-3">Duration</p>
                            <p className="flex-1 px-2 py-3">Progress</p>
                        </div>



                        {/* Cards suru hote h ab */}
                        {
                            enrolledCourses.map( (course, index) => {
                                <EnrolledCoursesSingle course={course} />
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}


export default EnrolledCourses;