// UTILITY COMPONENTS
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSenderConnect = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");



// EMAIL TEMPLATES
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");



// CUSTOM COMPONENTS
const CourseProgress = require("../models/CourseProgress")























/********************************************************************************************************************************/
// capturePayment ---> Handle to buy multiple courses at single time
/********************************************************************************************************************************/





// capture the payment and initiate the Razerpay order

exports.capturePayment = async( request, respond) => {
    const { courses } = request.body;
    const userId = request.user.id;



    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" });
    }



    let total_amount = 0;
    for (const course_id of courses) {
        let course;
        try{
            // Find the course by its ID
            course = await Course.findById(course_id);


            // If the course is not found, return an error
            if (!course) {
                return respond.status(200).json({ 
                    success: false, 
                    message: "Could not find the Course" 
                })
            }


            // Check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId)
            if (course.studentEnrolled.includes(uid)) {
                return respond.status(200).json({ 
                    success: false, 
                    message: "Student is already Enrolled" 
                })
            }



            // Add the price of the course to the total amount
            total_amount = parseInt(total_amount) + parseInt(course.price)
        }
        catch (error) {
            console.log(error)
            return respond.status(500).json({ 
                success: false, 
                message: error.message 
            })
        }
    }




    // create options for razerpay
    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }


    try{
        // Initiate the payment using Razorpay
        console.log("hi");
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        respond.json({
            success: true,
            data: paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        respond.status(500).json( {
            success: false, 
            message: "Could not initiate order."
        })
    }
}
































/********************************************************************************************************************************/
// verifySignature
/********************************************************************************************************************************/


// verify the payment
exports.verifyPayment = async (request, respond) => {
    const razorpay_order_id = request.body?.razorpay_order_id;
    const razorpay_payment_id = request.body?.razorpay_payment_id;
    const razorpay_signature = request.body?.razorpay_signature;
    const courses = request.body?.courses;


    const userId = request.user.id;



    if ( !razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId ) {
        return res.status(304).json({ 
            success: false, 
            message: "Payment Failed"
        })
    }



    // same copy cat steps
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");


    // check weather our created signature === razorpay signature
    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, respond);
        return respond.status(200).json({ 
            success: true, 
            message: "Payment Verified" 
        });
    }

    return respond.status(200).json({ 
        success: false, 
        message: "Payment Failed" 
    });
}













































/********************************************************************************************************************************/
// Enroll Students
/********************************************************************************************************************************/




// enroll the student in the courses
const enrollStudents = async (courses, userId, respond) => {
    if (!courses || !userId) {
        return respond.status(400).json({ 
            success: false, 
            message: "Please Provide Course ID and User ID" })
        }



    for(const courseId of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate( { _id: courseId }, { $push: { studentEnrolled: userId } }, { new: true } );

            if (!enrolledCourse) {
                return respond.status(500).json({ 
                    success: false, 
                    error: "Course not found" 
                });
            }
            console.log("Updated course: ", enrolledCourse);



            // Once The user Is Enrolled Create is Progess ---> Newly Added
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })


            // Find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        // Newly Added
                        courseProgress: courseProgress._id,
                    }
                },
                { new: true }
            )
            console.log("Enrolled student: ", enrolledStudent);



            // Send an email notification to the enrolled student
            const emailResponse = await mailSenderConnect(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )

            console.log("Email sent successfully: ", emailResponse.response);
        } 
        catch (error) {
            console.log(error)
            return respond.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

























/********************************************************************************************************************************/
// sendPaymentSuccessEmail
/********************************************************************************************************************************/



exports.sendPaymentSuccessEmail = async (request, respond) => {
    const { orderId, paymentId, amount } = request.body

    const userId = request.user.id

    if (!orderId || !paymentId || !amount || !userId) {
        return respond .status(400) .json({ 
            success: false, 
            message: "Please provide all the details" 
        })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        await mailSenderConnect( enrolledStudent.email, `Payment Received`,
            paymentSuccessEmail(
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
            amount / 100,
            orderId,
            paymentId
        )
    )
    } 
    catch (error) {
        console.log("error in sending mail", error)
        return respond.status(400).json({ 
            success: false, 
            message: "Could not send email" 
        })
    }
}