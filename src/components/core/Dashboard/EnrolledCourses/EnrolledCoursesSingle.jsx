import React from "react";

import ProgressBar from "@ramonak/react-progress-bar"


const EnrolledCoursesSingle = ({ course }) => {
    return (
        <div>



            {/* Thumbnail and text  */}
            <div>
                <img src = {course.thumbnail} />
                <div>
                    <p> { course.courseName } </p>
                    <p> { course.description } </p>
                </div>
            </div>


            {/* Video Duration  */}
            <div>
                { course?.totalDuration }
            </div>



            {/* Progress bar  */}
            <div>
                <p> Progess: {course.progressPercentage} || 0 </p>
                <ProgressBar completed={course.progressPercentage || 0} height="8px" isLabelVisible={false} />
            </div>
        </div>
    )
}






export default EnrolledCoursesSingle;