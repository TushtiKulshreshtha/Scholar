const User = require("../models/User");
const mailSenderConnect = require("../utils/mailSender");
const bcryt = require("bcrypt");
const crypto = require("crypto");










/********************************************************************************************************************************/
// resetPasswordToken
/********************************************************************************************************************************/


// reset password token ---> generate token and make entry in user model
exports.resetPasswordToken = async(request, respond) => {
    try{
        // get email from request body
        const { email } = request.body;
        // check email is empty or not
        if(!email) {
            return respond.status(301).json({
                success:false,
                message:"Email id can't be empty of resetting password",
            });
        }
        // check user entry in database
        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return respond.status(302).json({
                success:false,
                message:"User doesn't exist in database, Please singup First then try to change passowrd",
            })
        }
        // now generate token for reset password
        const token = crypto.randomBytes(20).toString("hex");
        // save token in db along with its expire's time
        const updatedUser = await User.findOneAndUpdate({email:email}, {token:token, resetPasswordExpires: Date.now() + 3600000 } , {new:true});
        // create url
        const url = `http://localhost:3000/update-password/${token}`
        // send mail with UI link
        const mailrespond = await mailSenderConnect(email, "Password Reset Link", `Passowrd Reset link: ${url} This Email is Only Valid For 5 minutes`);
        // return success respond
        return respond.status(200).json({
            success:true,
            message:"Email Sent Successfully, please check email and change password carefully :)",
        })
    }
    catch(error) {
        return respond.status(301).json({
            success:false,
            message:"Internal server error Something went wrong during password reset",
            error:error.message,
        })
    }
}




























/********************************************************************************************************************************/
// reset password
/********************************************************************************************************************************/




// how password is reset 
// 1) ---> click on forget password  ---> frontend
// 2) ---> redirect to reset password page ---> frontend
// 3) ---> enter email                      ---> frontend
// 4) Generate Ui link and send mail with ui ---> backend 
// 5) --> redirect to reset password page  ---> fronted + backend
// 6) ---> send otp 
// 7)--> choose new password 
// 8) ---> back to login page



exports.resetPassword = async(request, respond) => {
    try{
        // data fetch ---> token exist in body ---> from frontend part
        const {password, confirmPassword, token} = request.body;
        // validation 1
        if(!password || !confirmPassword || !token) {
            return respond.status(303).json({
                success:false,
                message:"All Fields are required ie password, confirmPassword and token",
            });
        }
        if(password !== confirmPassword){
            return respond.status(302).json({
                success:false,
                message:"Password and Confirm password doesn't match",
            });
        }
        // get userdetails from db using token
        const existingUser = await User.findOne({token:token});
        // if no entry ------> invalid token
        if(!existingUser){
            return respond.status(303).json({
                success:false,
                message:"User Not Found, Invalid Token",
            });
        }
        // token time
        if(existingUser.resetPasswordExpires < Date.now()) {
            return respond.status(304).json({
                success:false,
                message:"Token Time expires please, Please Regenerate Your Token",
            });
        }
        // hashpassowrd
        let hashpassowrd;
        try{
            hashpassowrd = await bcryt.hash(password, 10);
        }
        catch(error) {
            return respond.status(305).json({
                success:false,
                message:"Error occured while hashing password for resetting password",
            });
        }
        // update password in db
        const updatedUserPasswordEntry = await User.findOneAndUpdate({token:token}, {password:hashpassowrd}, {new:true});
        // return success flag
        return respond.status(200).json({
            success:true,
            message:"Passowrd Reset successfully",
            resetToken:token,
            data:updatedUserPasswordEntry,
        })
    }
    catch(error) {
        console.log(error);
        return respond.status(600).json({
            success:false,
            message:"Internal server error Something went wrong during password rest",
            error:error.message,
        });
    }
}