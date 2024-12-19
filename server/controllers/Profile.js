const { response } = require("express");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");



const uploadImageToCloudinary = require("../utils/imageUploader");





const { convertSecondsToDuration } = require("../utils/secToDuration");














/********************************************************************************************************************************/
// update profile
/********************************************************************************************************************************/



exports.updateProfile = async(request, respond) => {
    try{
        // extract profile details + userId
        const {dateOfBirth="", about="", contactNumber, gender } = request.body;
        const userId = request.user.id;
        // perform validation
        if(!contactNumber || !gender || !userId) {
            return respond.status(401).json({
                success:false,
                message:"All Fields are required",
            });
        }
        // find User Details => find Profile Id => find profile details
        const existingUser = await User.findById({_id:userId});
        // get ObjectId of existing/fake/dummy profile that created at the time of user creation
        const existingProfileId = existingUser.additionalDetails;
        const profileDetails = await Profile.findById(existingProfileId);
        // update Profile Using 2nd Method to save entry in db
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        
        // find updated profile details to send in request
        const updatedUserDetails = await User.findById({_id:userId}).populate("additionalDetails").exec();
        // send success flag
        return respond.status(200).json({
            success:true,
            message:"Profile Update Successfully",
            updatedUserDetails:updatedUserDetails,
        });
    }
    catch(error) {
        respond.status(403).json({
            success:false,
            data:"Internal Server Error",
            message:"Profile Updation Failed",
            error:error.message,
        });
    }
}



























/********************************************************************************************************************************/
// delete Account
/********************************************************************************************************************************/





exports.deleteAccount = async(request, respond) => {
    try{
        // get userId
        const userId  = request.user.id;   
        // check input fields are empty or not
        if(!userId) {
            return respond.status(303).json({
                success:false,
                message:"All Fields are requried ie. userId"
            })
        }
        // validation
        const existingUser = await User.findById({_id:userId });
        if(!existingUser) {
            return respond.status(401).json({
                success:false,
                message:"User doesn' exist in database, please try with differnt userId",
            });
        }
        // delete profile [Additonal Profile]
        await Profile.findByIdAndDelete({_id:existingUser.additionalDetails});
        // TODO: Unernroll user from all enrolled courses
        // for (const courseId of existingUser.courses) {
        //     await Course.findByIdAndUpdate(
        //         courseId,
        //         { $pull: { studentsEnroled: id } },
        //         { new: true }
        //     )
        // }
        // TODO: delete all courses, section and subSection if accountType === Instructor
        // delete user
        await User.findByIdAndDelete({_id:userId});
        return respond.status(200).json({
            success:true,
            message:"Account Deleted Successfully",
        });
    }
    catch(error) {
        respond.status(403).json({
            success:false,
            data:"Internal Server Error",
            message:"Account is not deleted",
            error:error.message,
        });
    }
}





























/********************************************************************************************************************************/
// get all User details
/********************************************************************************************************************************/



exports.getAllUserDetails = async (request, respond) => {
    try{
        // fetch user id
        const  userId  = request.user.id; 
        // perform validation  
        const existingUser = await User.findById({_id:userId}).populate("additionalDetails").exec();
        // return success flag
        return respond.status(200).json({
            success:true,
            message:"All User Data Fetched Successfully",
            data:existingUser,
        });
    }
    catch(error) {
        respond.status(403).json({
            success:false,
            data:"Internal Server Error",
            message:"Failed to Fetch User Details",
            error:error.message,
        });
    }
}

























/********************************************************************************************************************************/
// updateDisplayPicture ----> RECENTLY ADDED
/********************************************************************************************************************************/


exports.updateDisplayPicture = async(request, respond) => {
    try{
        const displayPicture = request.files.displayPicture;
        const userId = request.user.id;
        const newImageUpdatedResponse = await uploadImageToCloudinary( displayPicture, process.env.FOLDER_NAME, 1000, 1000);
        console.log(newImageUpdatedResponse);

        // update url in db for exisitng user
        const updatedProfile = await User.findByIdAndUpdate( { _id: userId }, { image: newImageUpdatedResponse.secure_url }, { new: true });

        // return success response
        return respond.status(200).json( {
            success:true,
            message: "Image Updated successfully",
            data: updatedProfile,
        } )
    }
    catch(error){
        return respond.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




























/********************************************************************************************************************************/
// get Enrolled courses  ----> RECENTLY ADDED
/********************************************************************************************************************************/



exports.getEnrolledCourses = async (request, respond ) => {
    try{
        const userId = request.user.id;

        let existingUser = await User.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                populate: {
                    path: "subSection",
                },
                },
            })




        // Calculate Duration of Courses
        existingUser = existingUser.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < existingUser.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < existingUser.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += existingUser.courses[i].courseContent[
                    j
                    ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                    existingUser.courses[i].totalDuration = convertSecondsToDuration( totalDurationInSeconds)
                    SubsectionLength += existingUser.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: existingUser.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length;
            if (SubsectionLength === 0) {
                existingUser.courses[i].progressPercentage = 100
            } 
            else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                existingUser.courses[i].progressPercentage =
                Math.round( (courseProgressCount / SubsectionLength) * 100 * multiplier ) / multiplier
            }
        }




        if(!existingUser) {
            return respond.status(400).json({
                success:false,
                message:`Could not find user with id: ${existingUser}`,
            })
        }

        return respond.status(200).json({
            success:true,
            data:existingUser.courses,
        })
    }
    catch(error) {
        return respond.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
























/********************************************************************************************************************************/
// instructorDashboard  ----> RECENTLY ADDED
/********************************************************************************************************************************/





exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id });

        const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price

        // Create a new object with the additional fields
        const courseDataWithStats = { _id: course._id, courseName: course.courseName, courseDescription: course.courseDescription, totalStudentsEnrolled, totalAmountGenerated,
        }

        return courseDataWithStats
    })

        res.status(200).json({ courses: courseData })
    } 
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}
