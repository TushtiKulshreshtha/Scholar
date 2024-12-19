// UTILITY COMPONENTS
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"


// REACT ICONS
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"


// CUSTOM UTILS
import { formattedDate } from "../../../../utils/dateFormatter";


// BACKEND API CALLS
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";



// CUSTOM CONSTANTS
import { COURSE_STATUS } from "../../../../utils/constants";



// CUSTOM COMPONENTS
import ConfirmationModal from "../../../common/ConfirmationModal";






const CoursesTable = ( {courses, setCourses}) => {



    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const TRUNCATE_LENGTH = 30;



    const handleCourseDelete = async (courseId) => {
        setLoading(true);
        // API CALL ----> Delete Course from DB
        await deleteCourse({ courseId: courseId }, token);
        // API CALL ---> Find remaning Instructor Courses
        const result = await fetchInstructorCourses(token);
        if (result) {
            setCourses(result);
        }
        setConfirmationModal(null);
        setLoading(false);
    }






    return (
        <div>
            <Table className="rounded-xl border border-richblack-800 ">

                <Thead>
                    <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
                        <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                            Courses
                        </Th>
                        <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                            Duration
                        </Th>
                        <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                            Price
                        </Th>
                        <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                            Actions
                        </Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {
                        courses.length === 0 ? (
                            <Tr>
                                <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                                    No courses found
                                </Td>
                            </Tr>
                        ) : (
                            courses.map( (course) => (
                                <Tr key={course._id} className="flex gap-x-10 border-b border-richblack-800 px-6 py-8 "> 
                                    <Td className="flex flex-row flex-1 gap-x-3">


                                        {/* Image   */}
                                        <img src={course?.thumbnail} alt={course?.courseName} className="h-[148px] w-[220px] rounded-lg object-cover" />


                                        {/* Image Right Side data  */}
                                        <div className="flex flex-col justify-between">


                                            {/* Course Name  */}
                                            <p className="text-lg font-semibold text-richblack-5">
                                                Course Name
                                            </p>



                                            {/* Course Description ---> Short Description Logic */}
                                            <p className="text-xs text-richblack-300">
                                                {
                                                    course.courseDescription.split(" ").length > 
                                                        TRUNCATE_LENGTH ? course.courseDescription 
                                                            .split(" ") 
                                                            .slice(0, TRUNCATE_LENGTH)  
                                                            .join(" ") + "..." 
                                                        : course.courseDescription
                                                }
                                            </p>



                                            {/* Created At  */}
                                            <p className="text-[12px] text-white">
                                                Created: { formattedDate(course.createdAt) }
                                            </p>



                                            {/* Course Status ---> Draft or Published  */}
                                            {
                                                course.status === COURSE_STATUS.DRAFT ? (
                                                    <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                                                        <HiClock size={14} />
                                                        Drafted
                                                    </p>
                                                ) : (
                                                    <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                                            <FaCheck size={8} />
                                                        </div>
                                                        Published
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </Td>



                                    {/* Video Time Duration  */}
                                    <Td className="text-sm font-medium text-richblack-100">
                                        30 min
                                    </Td>



                                    {/* Course Price  */}
                                    <Td className="text-sm font-medium text-richblack-100">
                                        ₹{course.price}
                                    </Td>


                                    
                                    {/* Course Actions Div  */}
                                    <Td className="text-sm font-medium text-richblack-100 ">



                                        {/* Course Edit Button  */}
                                        <button disabled={loading} title="Edit" 
                                            onClick={ () => { navigate(`/dashboard/edit-course/${course._id}`) } }
                                            className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                                        >
                                            <FiEdit2 size={20} />
                                        </button>



                                        {/* Course Delete Button  */}
                                        <button disabled={loading} 
                                            onClick={() => { setConfirmationModal({
                                                text1: "Do you want to delete this course?",
                                                text2: "All the data related to this course will be deleted",
                                                btn1Text: !loading ? "Delete" : "Loading...  ",
                                                btn2Text: "Cancel",
                                                btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                                                btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                                            })}}
                                            title="Delete"
                                            className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                                        >
                                            <RiDeleteBin6Line size={20} />
                                        </button>
                                    </Td>


                                </Tr>
                            ))
                        )
                    }
                </Tbody>
            </Table>


            {
                confirmationModal && <ConfirmationModal modalData={confirmationModal} />
            }


        </div>
    )
}

export default CoursesTable;