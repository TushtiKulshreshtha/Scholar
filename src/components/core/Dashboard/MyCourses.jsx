// UTILITY COMPONENTS
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"



// REACT ICONS
import { VscAdd } from "react-icons/vsc"



// BACKEND API CALLS
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"



// CUSTOM COMPONETNS
import IconBtn from "../../common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"




const MyCourses = () => {



    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);




    const fetchCourses = async () => {
        // API CALL ----> This api will fetch all courses of Instructor
        const result = await fetchInstructorCourses(token);
        if (result) {
            setCourses(result);
        }
    }




    useEffect(() => {
        fetchCourses();
    }, [])






    return (
        <div>

            <div className="mb-14 flex items-center justify-between">


                {/* Heading  */}
                <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>


                {/* Add Course Button  */}
                <IconBtn text="Add Course" onclick={() => navigate("/dashboard/add-course")} > 
                    <VscAdd /> 
                </IconBtn>
            </div>


            {/* Course Tables ----> Only show courseTable When courses exist */}
            {
                courses && <CoursesTable courses={courses} setCourses={setCourses} />
            }



        </div>
    )
}



export default MyCourses;