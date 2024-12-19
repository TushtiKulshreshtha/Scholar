const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");









/********************************************************************************************************************************/
// createRating and Review
/********************************************************************************************************************************/



exports.createRating = async(request, respond) => {
    try{
        // fetch incoming details
        const {courseId, rating, review} = request.body;
        // fetch user id
        const userId = request.user.id;
        // check input fields are empty or not
        if(!courseId || !rating || !review || !userId) {
            return respond.status(301).json({
                success:false,
                message:"All fields are required"
            });
        }
        // Check for student is enrolled or not ---> only those student allow to rate those are enrolled
        const enrolledStudent = await Course.findOne({_id:courseId , studentEnrolled: { $elemMatch: {$eq: userId}} });
        if(!enrolledStudent) {
            return respond.status(301).json({
                success:false,
                message:"Student is not enrolled in this course",
            });
        }
        // check user already rated the course
        const existingRating = await RatingAndReview.findOne({ user:userId , course:courseId});
        if(existingRating) {
            return respond.status(302).json({
                success:false,
                message:"Course already reviewed by user",
            });
        }
        // save a entry in db
        const newRatingAndReview = await RatingAndReview.create({
            user:userId,
            rating,
            review,
            course:courseId,
        });
        console.log("dsfdsfds");
        // update the reference in course Schema
        const updatedCourseWithNewRatingAndReview = await Course.findByIdAndUpdate(courseId, {$push: {ratingAndReviews: newRatingAndReview}} );
        await enrolledStudent.save();
        // return response
        return respond.status(200).json({
            success:true,
            message:"New Rating And Review created successfully",
            body:newRatingAndReview,
            updatedCourse:updatedCourseWithNewRatingAndReview,
        });
    }
    catch(error) {
        return respond.status(401).json({
            success:false,
            message:"Internal server error, something went wrong while rating creation"
        })
    }
}

















/********************************************************************************************************************************/
// find average Rating ---> getAverageRating
/********************************************************************************************************************************/



exports.getAverageRating = async(request, respond) => {
    try{
        // get couere id
        const { courseId } = request.body;
        // check input fields is empty of not
        if( !courseId ) {
            return respond.status(400).json({
                success:false,
                message:"All Fields are requied ie. courseId",
            });
        }
        // find average rating using aggregate operator
        const result = await RatingAndReview.aggregate([
            { $match:{ course:new mongoose.Types.ObjectId(courseId), } },
            { $group:{ _id:null, averageRating: {$avg: "$rating"}, } }
        ])
        // return rating
        if(result.length > 0) {
            return respond.status(200).json({
                success:true,
                message:"Average Rating Fetched successfully",
                averageRating:result[0].averageRating,
            });
        } 
        // if no rating and reviews
        return respond.status(200).json({
            success:false,
            message:"Average rating is 0 as no rating is given now",
            averageRating:0,
        })
    }
    catch(error){
        respond.status(300).json({
            success:false,
            message:"Internal Server error Something went wrong while finding average ratings",
            error:error.message,
        });
    }
}



















/********************************************************************************************************************************/
// getAllRatings
/********************************************************************************************************************************/


exports.getAllRating = async(request, respond) => {
    try{
        // extract all rating and reviews from db
        const allReviews = await RatingAndReview.find({}).sort( {rating:"desc"} )
        .populate( { path:"user" , select:"firstName lastName email image"} )
        .populate( { path:"course" , select:"courseName"}).exec();
        // return response
        return respond.status(200).json({
            success:true,
            message:"All rating And Reviews fetched successfully",
            data:allReviews
        });
    }
    catch(error){
        respond.status(300).json({
            success:false,
            message:"Internal Server error, Something went wrong while fectching all ratings",
            error:error.message,
        });
    }
}




















