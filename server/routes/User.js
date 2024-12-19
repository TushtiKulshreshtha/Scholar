const express = require("express");
const router = express.Router();


const { sendOtp, signUp, login , changePassword } = require("../controllers/Auth");
const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/auth");


const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");

// controllers ---> Auth.js
router.post("/sendOtp", sendOtp);
router.post("/signUp", signUp);
router.post("/login", login);
// Route for Changing the password
router.post("/changepassword", auth, changePassword);





// controllers ---> ResetPassword.js
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);



module.exports = router;












