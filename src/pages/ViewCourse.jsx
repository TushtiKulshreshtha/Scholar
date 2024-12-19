// UTILITY COMPONENTS
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";



// CUSTOM COMONENTS
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";


// BACKEND API CALLS
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";



// SLICES STORAGES
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice";





export default function ViewCourse() {


    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [ reviewModal, setReviewModal ] = useState(false);



    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            // API CALLS
            const courseData = await getFullDetailsOfCourse(courseId, token);
            console.log("Course Data here... ", courseData);
            dispatch( setEntireCourseData(courseData.courseDetails) );
            dispatch( setCourseSectionData(courseData.courseDetails.courseContent) );
            dispatch( setCompletedLectures(courseData.completedVideos) );
            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach( (sec) => { lectures += sec.subSection.length } );
            dispatch( setTotalNoOfLectures(lectures) );
        }
        setCourseSpecificDetails();
    }, []);



return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal = { setReviewModal } />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div div className="mx-6">
                    <Outlet />
                </div>
            </div>
        </div>
        {
            reviewModal && <CourseReviewModal setReviewModal={ setReviewModal } />
        }
    </>
)}
