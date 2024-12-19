import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"

import { profileEndpoints } from "../apis"


const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints;










export async function getUserEnrolledCourses(token) {
    let result = [];
    try{
        const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API , null, { Authorization: `Bearer ${token}` } )

        if( !response.data.success ){
            throw new Error(response.data.message);
        }
        result = response.data.data;
        console.log("API RESPONSE ISSS--->", response.data);
    }
    catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        console.log(error.message);
        toast.error("Could Not Get Enrolled Courses")
    } 
    return result;
}





export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, { Authorization: `Bearer ${token}` })
        console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
        result = response?.data?.courses
    } 
    catch (error) {
        console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
        toast.error("Could Not Get Instructor Data")
    }
    toast.dismiss(toastId)
    return result
}