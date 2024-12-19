const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSenderConnect = require("../utils/mailSender");
require("dotenv").config();



















/********************************************************************************************************************************/
// sendOtp
/********************************************************************************************************************************/

// sendOtp --> for singup
// For sending otp we require 1) email to send 2) otp value the that generate in function itself

exports.sendOtp = async(request, respond) => {
    try{
        const { email } = request.body;
        // check email is empty or Not??
        if(!email) {
            return respond.status(302).json({
                success:false,
                message:"Email field is requried Please check its empty",
            })
        }
        // find already exist in database or not
        const existingUser = await User.findOne({email});
        if(existingUser) {
            console.log("User Already exist in databse can't send otp again");
            return respond.status(301).json({
                success:false,
                message:"User already exist in database invalid move Don't try to signup again",
                data:existingUser,
            });
        }
        // generate otp for user singup using otpGenerator instance
        const generatedOtp = otpGenerator.generate(6,{upperCaseAlphabets:false, lowerCaseAlphabets:false,specialChars:false});
        console.log("Otp is ---> ", generatedOtp);
        // check otp for this email is already exist in the database --> check unique otp or not
        const existingOtp = await OTP.findOne({otp:generatedOtp});
        // generate otp untill we get unique otp ---> deadly while loop
        while(existingOtp) {
            generatedOtp = otpGenerator.generate(6, {upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false});
            existingOtp = await OTP.findOne({otp:generatedOtp});
        }
        // create an otp payload
        const otpPayload = {email:email,otp:generatedOtp};
        // save otp in database
        const otpBody = await OTP.create(otpPayload);             // is line s pehle otp wale schema code run ho jayga OTP pre Hook work before this line
        return respond.status(200).json({
            success:true,
            message:"Otp Send Successsfuly",
            otp:generatedOtp,
        })
    }
    catch(error){
        console.log("Error While Sending OTP");
        return respond.status(400).json({
            success:false,
            data:"Internal server error",
            message:"Something went wrong while sending otp form controllers",
            error:error.message,
        })
    }
}
























/********************************************************************************************************************************/
// signUp
/********************************************************************************************************************************/

// signup
exports.signUp = async(request, respond) => {
    try{
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = request.body;
        // check the validity of entry's in database
        if(!firstName && !lastName && !email && !password && !confirmPassword && !accountType && !otp) {
            return respond.status(301).json({
                success:false,
                message:"All Fields are Required",
            })
        }
        // check password and confirm password fields 
        if(password !== confirmPassword) {
            return respond.status(302).json({
                success:false,
                message:"Password and Confirm Password Fields doesn't match please check it again",
            })
        }
        // check user already exist in database
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return respond.status(303).json({
                success:false,
                message:"User already registered please check email id before try again",
                data:existingUser,
            });
        }
        // find the most react otp associated with existingUser email
        const existingRecentOtp = await OTP.find({ email }).sort({createdAt:-1}).limit(1);
        console.log("recenet opt id with data --->", existingRecentOtp);
        console.log("recent opt is ----> ", existingRecentOtp[0].otp);
        console.log("otp", otp);
        console.log("opt2--> ", existingRecentOtp[0].otp);
        // validate otp
        if(existingRecentOtp.length === 0) {
            return respond.status(406).json({
                sucess:false,
                message:"OTP not found in db records",
            })
        }
        // check Otp enterd by user from frontend and backend are same
        else if(otp !== existingRecentOtp[0].otp) {
            console.log("Otp Entered By the user doesn't match");
            return respond.status(305).json({
                success:false,
                message:"OTP eneted by user doesn't match with most recent otp",
            });
        }
        // hash password eneted by user
        const hashedPassword = await bcrypt.hash(password, 10);
        // check for instructor newly added  ------------------------------------------------
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);
        // create a fake Profile section for user and attach to User model entry
        const profileDetails = await Profile.create({ gender:null, about:null, dateOfBirth:null, contactNumber:null });
        // Now save entry in db
        const savedUser = await User.create({
            firstName,
            lastName, 
            email,
            password: hashedPassword,
            accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // now send a success response
        return respond.status(200).json({
            success:true,
            message:"User Registered Successfully",
            data:savedUser,
        })
    }
    catch(error) {
        console.log("Unable to signup");
        return respond.status(200).json({
            sucess:false,
            data:"Internal server error",
            message:"User not be Registered, Please try again",
            error:error.message,
        })
    }
}





















/********************************************************************************************************************************/
// login
/********************************************************************************************************************************/


// login
exports.login = async(request, respond) => {
    try{
        // fetch email and password from request body
        const {email, password} = request.body;
        // validate entry empty or not ---> not valid return
        if(!email || !password){
            return respond.status(301).json({
                success:false,
                message:"All fields are required, please try again",
            })
        }
        // check for entry in database ---> if not found return
        const existingUser = await User.findOne({email}).populate("additionalDetails").exec();
        if(!existingUser) {
            return respond.status(302).json({
                success:false,
                message:"User doesn't exist in database please SignUp first",
            });
        }
        // create a payload to send with jwt token
        const payload = {
            id:existingUser._id,
            email:existingUser.email,
            accountType:existingUser.accountType,
        }
        // comapre password with database entry 
        if(await bcrypt.compare(password, existingUser.password)){
            // geneate a jwt token
            const token = jwt.sign(payload, process.env.JWT_SECRET , {expiresIn:"2h"});
            // add token to current user
            existingUser.token = token;
            existingUser.password = undefined;
            // create otpions for cookies
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            // send succss respond in form as cookies
            respond.cookie("token", token, options).status(200).json({
                success:true,
                message:"User Logged in Successfully",
                user:existingUser,
                token,
            });
        }
        else{
            return respond.status(303).json({
                success:false,
                message:"Password is incorrect"
            });
        }
    }
    catch(error) {
        console.log(error);
        return respond.status(400).json({
            success:false,
            data:"Internal server error Login Failure Please try again",
            message:error.message,
        })
    }
}

























/********************************************************************************************************************************/
// change password
/********************************************************************************************************************************/


// change Password
exports.changePassword = async(request, respond) => {
    try{
        // get data from req body ---> oldPassword, newPassword
        const { oldPassword, newPassword } = request.body;
        
        // extract userId from middlewares token
        const userId = request.user.id;
        
        // check frotend fields are empty of Not
        if(!userId || !oldPassword || !newPassword ) {
            return respond.status(301).json({
                success:false,
                message:"All Fields are requried",
            });
        }
        
        // check user exist in database or not
        const existingUser = await User.findById(request.user.id);
        // if not return 
        if(!existingUser) {
            return respond.status(302).json({
                success:false,
                message:"Email Id id Not Registered With Us, please signup and then try to change password",
            });
        }
        
        // check ---> old password from frontend === backend
        if( ! await bcrypt.compare(oldPassword, existingUser.password)) {
            return respond.status(401).json({
                success:false,
                message:"Old Password is Incorrect"
            })
        }
        // hash newPassword 
        hashedPassword = await bcrypt.hash(newPassword, 10);
        // now update passowrd in db Method - 1
        // existingUser.password = hashedPassowrd;
        // udpate passowrd in db Method - 2
        let updatedUserDetails = await User.findByIdAndUpdate({_id:userId}, { password: hashedPassword } , { new: true });
        console.log(updatedUserDetails);
        
        // send mail ---> password updated successfully -----> pending
        const mailResponse = await mailSenderConnect(updatedUserDetails.email, `Password updated successfully `, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`);
        console.log("Mail Response is ---> ", mailResponse);
        
        // return success flag
        return respond.status(200).json({
            success:true,
            message:"Password changed sucessfully",
        });
    }
    catch(error) {
        console.log(error);
        return respond.status(305).json({
            success:false,
            message:"Something Went Wrong While Updating the password in database",
        });
    }
}