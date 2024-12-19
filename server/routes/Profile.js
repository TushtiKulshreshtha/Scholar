const express = require("express");
const router = express.Router();
const {auth, isInstructor} = require("../middlewares/auth");



const { updateProfile , deleteAccount, getAllUserDetails} = require("../controllers/Profile");

const { getEnrolledCourses } = require("../controllers/Profile");
const { updateDisplayPicture } = require("../controllers/Profile");
const { instructorDashboard } = require("../controllers/Profile");



// controllers ---> Profile.js
router.put("/updateProfile", auth, updateProfile);              
router.delete("/deleteAccount", auth, deleteAccount);                 
router.get("/getAllUserDetails", auth, getAllUserDetails);         


// getEnrolledCourses ---> RECENTLY ADDEED                                                
router.get("/getEnrolledCourses", auth, getEnrolledCourses);


// updateDisplayPicture --->  RECENTLY ADDEED
router.put("/updateDisplayPicture", auth, updateDisplayPicture);


// instructorDashboard --->  RECENTLY ADDEED
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);





module.exports = router;