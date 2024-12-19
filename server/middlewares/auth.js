const jwt = require("jsonwebtoken");
require("dotenv").config();








/********************************************************************************************************************************/
// auth --> token validiy checking + decoding
/********************************************************************************************************************************/




// This middleware used for Authentication and authorization
exports.auth = async(request, respond, next) => {
    try{
        // extract token
        const token = request.cookies.token || request.body.token || request.header("Authorization").replace("Bearer ", "");
        // const token = request.body.token; 

        // if token missing, return response
        if(!token  || token === undefined) {
            return respond.status(400).json({
                success:false,
                message:"token is empty or undefined",
            });
        }    
        try{
            // extract payload from token, that create while signUp ie.(user_id,email,role)
            const payload = await jwt.verify(token, process.env.JWT_SECRET);
            request.user = payload;
        }
        catch(error) {
            return respond.status(400).json({
                success:false,
                message:"Invalid json web token",
                error:error.message
            });
        }
        next();
    }
    catch(error){
        console.log(error);
        respond.status(600).json({
            success:false,
            message:"Internal server error",
            error:message.error,
        })
    }
}













/********************************************************************************************************************************/
// isStudent
/********************************************************************************************************************************/



// isStudent
exports.isStudent = async(request, respond, next) => {
    console.log(request.user.accountType);
    try{
        if(request.user.accountType !== "Student") {
            return respond.status(501).json({
                success:false,
                message:"This is protected route for student only",
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        respond.status(600).json({
            success:false,
            message:"Internal server error",
            error:message.error,
        })
    }
}














/********************************************************************************************************************************/
// isInstructor
/********************************************************************************************************************************/


exports.isInstructor = async(request, respond, next) => {
    try{
        if(request.user.accountType !== "Instructor") {
            return respond.status(501).json({
                success:false,
                message:"This is protected route for Instructor only",
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        respond.status(600).json({
            success:false,
            message:"Internal server error",
            error:message.error,
        })
    }
}












/********************************************************************************************************************************/
// isAdmin
/********************************************************************************************************************************/


// isAdmin
exports.isAdmin = async(request, respond, next) => {
    try{
        if(request.user.accountType !== "Admin") {
            return respond.status(501).json({
                success:false,
                message:"This is protected route for admin only",
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        respond.status(600).json({
            success:false,
            message:"Internal server error",
            error:message.error,
        })
    }
}