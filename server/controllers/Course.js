const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

const uploadImageToCloudinary = require("../utils/imageUploader");
require("dotenv").config();
const { convertSecondsToDuration } = require("../utils/secToDuration");

















/********************************************************************************************************************************/
// createCourse
/********************************************************************************************************************************/


exports.createCourse = async(request, respond) => {
    try{
        // extract data from frontend and files 
        const { courseName, courseDescription, whatYouWillLearn, price,tag, category, status} = request.body;
        const thumbnail = request.files.thumbnailImage ? request.files.thumbnailImage : "demo";
        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category || !status || !thumbnail) {
            return respond.status(301).json({
                success:false,
                message:"All Fields are Required for creating Course",
            });
        }
        // get user(instructor) id from request body using token 
        const findUserId = request.user.id;   
        // search User id in database
        const existingInstructor = await User.findById({_id:findUserId});
        // console.log("find by id -----> ", findUserId);
        // console.log("existing user -----> ", existingInstructor);
        // perfrom validation
        if(!existingInstructor) {
            return respond.status(404).json({
                success:false,
                message:"Instructor Details Not Found",
            });
        }
        // perfrom category validation enterd by user
        const existingCategory = await Category.findById({_id:category});
        if(!existingCategory) {
            return respond.status(405).json({
                success:false,
                message:"Please Enter a valid Category",
            })
        }
        // now upload image to cloudinary
        const thumbnailImageUrl = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        // create a entry for new post in database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: findUserId,
            whatYouWillLearn,
            price,
            tag,
            thumbnail:thumbnailImageUrl.secure_url,
            category:existingCategory._id,
            status                          
            // remaning entry are passed by reference
        });
        console.log("Hello Till now everything is ok");
        // add this course to User schema of instructor
        const updatedUserWithCourse = await User.findByIdAndUpdate({_id:existingInstructor._id}, {$push: {courses: newCourse._id}}, {new:true}).populate("courses").exec();
        // update category Schema with [as course include specific Category that must be updated ]
        const updatedCategoryWithCourse = await Category.findByIdAndUpdate({_id:existingCategory._id}, {$push: {courses: newCourse._id}}, {new:true}).populate("courses").exec();
        // send success flag
        return respond.status(200).json({
            success:true,
            message:"Course Created successfully User Updated successfully",
            data:newCourse,
        });
    }
    catch(error) {
        return respond.status(403).json({
            success:false,
            data:"Internal Server Error",
            message:"Something went wrong while creating a course",
            error:error.message,
        });
    }
}




































/********************************************************************************************************************************/
// editCourse
/********************************************************************************************************************************/



exports.editCourse = async( request, respond) => {
    try{
        const { courseId } = request.body;
        const updates = request.body;



        // find existing course in db
        const existingCourse = await Course.findById(courseId);
        if(!existingCourse) {
            return respond.status(404).json({ 
                success:"false",
                error: "Course not found" 
            })
        }



        // If Thumbnail Image is found, update it
        if(request.files) {
            console.log("thumbnail update");
            const thumbnail = request.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary( thumbnail, thumbnail, );
            existingCourse.thumbnail = thumbnailImage.secure_url;
        }



        // Update only the fields that are present in the request body
        for (const key in updates) {
            if ( updates.hasOwnProperty(key) ) {
                if (key === "tag" || key === "instructions") {
                    // console.log( updates[key]);
                    existingCourse[key] = JSON.parse(updates[key]);
                }
                else {
                    existingCourse[key] = updates[key];
                }
            }
        }

        await existingCourse.save();


        const updatedCourse = await Course.findOne({ _id:courseId} )
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            //.populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            }).exec();



        // return success flag
        return respond.status(200).json({
            success:"true",
            message: "Course updated successfully",
            data: updatedCourse,
        })
    }
    catch(error) {
        console.error(error);
        return respond.status(500).json({
            success: "false",
            message: "Internal server error",
            error: error.message
        })
    }
}






























/********************************************************************************************************************************/
// showAllCourses
/********************************************************************************************************************************/


exports.getAllCourses = async(request, respond) => {
    try{
        const allCourses = await Course.find({}).populate("instructor").exec();
        if(!allCourses){
            return respond.status(200).json({
                success:false,
                message:"Not able to fetch the courses",
                error:message.error,
            });
        }
        return respond.status(200).json({
            success:true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        });
    }
    catch(error) {
        console.log(error);
        respond.status(500).json({
            success:false,
            data:"Internal Server error",
            message:"Something went wrong not able to fetch course data",
            error:error.message,
        })
    }
}



































/********************************************************************************************************************************/
// getFullCourseDetails
/********************************************************************************************************************************/


exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    },
                })
            .populate("category")
            //.populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
                })
            .exec();


        let courseProgressCount = await CourseProgress.findOne({ courseID: courseId,userId: userId });


        console.log("courseProgressCount : ", courseProgressCount)


        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }



        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);


        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            },
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"Something Went wrong while fetching Full course details",
            error: error.message,
        })
    }
}

























/********************************************************************************************************************************/
// getCourseDetails
/********************************************************************************************************************************/




exports.getCourseDetails = async (request, respond) => {
    try {
        const { courseId } = request.body
        const courseDetails = await Course.findOne({ _id: courseId })
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
            })
            .populate("category")
            //.populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
                select: "-videoUrl",
            }
        }).exec()

        if (!courseDetails) {
            return respond.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }



        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration);
            totalDurationInSeconds += timeDurationInSeconds;
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);


        return respond.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        });
    } 
    catch (error) {
        return respond.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


























/********************************************************************************************************************************/
// deleteCourse
/********************************************************************************************************************************/



exports.deleteCourse = async (request, respond) => {
    try {
        const { courseId } = request.body
        // Find existing course in db
        const existingCourse = await Course.findById(courseId)
        if (!existingCourse) {
            return respond.status(404).json({ 
                success:"false",
                message: "Course not found" 
            })
        }

        // unenroll instrucotr itself form course ---> delete user ---> courses --> courseId
        let instructorEnrolled = existingCourse.instructor;
        instructorEnrolled = instructorEnrolled.toString();
        const updatedUserWithoutCourse = await User.findByIdAndUpdate({_id:instructorEnrolled} , { $pull: { courses: courseId } } , {new:true});       


        // delete course form its category
        let categoryId = existingCourse.category;
        categoryId = categoryId.toString();
        const updatedCategoryWithoutCourse = await Category.findByIdAndUpdate({_id: categoryId}, { $pull: { courses: courseId } } , {new:true})

        //return ;
        // Unenroll students  from the course
        const studentsEnrolled = existingCourse.studentEnrolled;
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }




        // Delete sections and sub-sections
        const courseSections = existingCourse.courseContent;
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId);
                }
            }   

            // Delete the section
            await Section.findByIdAndDelete(sectionId);
        }



        // Delete the course
        await Course.findByIdAndDelete(courseId);


        // return success flag
        return respond.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    }
    catch (error) {
        console.error(error)
        return respond.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

















/********************************************************************************************************************************/
// getInstructorCourses
/********************************************************************************************************************************/


exports.getInstructorCourses = async (request, respond) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = request.user.id


        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });
        // console.log(instructorCourses);

        // Return the instructor's courses
        respond.status(200).json({
            success: "true" ,
            data: instructorCourses,
        })
    } 
    catch (error) {
        console.error(error)
        respond.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}