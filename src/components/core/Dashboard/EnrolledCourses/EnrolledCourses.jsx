import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../../services/operations/profileAPI";


import ProgressBar from "@ramonak/react-progress-bar";




const EnrolledCourses = () => {



    // why token is used here as it need to be send in backend
    const { token } = useSelector( (state) => state.auth );
    // This state variable stores the data of all enrolled courses
    const [ enrolledCourses, setEnrolledCourses ] = useState(null);
    const navigate = useNavigate();



    const getEnrolledCourses = async() => {
        try{
            // API CALLS
            const response = await getUserEnrolledCourses(token);
            // without any filtering all data is set in sate variable. 
            // will get stored in page will refresh --> response data will update on frontend
            console.log("enrolled courses data is ---->>", response);
            // console.log( response[0].courseContent[0]._id);
            // console.log( response[0].courseContent[0].subSection[0]._id);
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











                        {/* Course Names ----> Black Box*/}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
                    </div>
                )
            }
        </div>
    )
}


export default EnrolledCourses;