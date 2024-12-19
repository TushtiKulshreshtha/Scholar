const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");




/********************************************************************************************************************************/
// createSection
/********************************************************************************************************************************/


exports.createSection = async(request, respond) => {
    try{
        // fetch section name and courseId from request body
        const { sectionName , courseId } = request.body;
        // check section name and cousreId is empty or not
        if(!sectionName || !courseId) {
            return respond.status(301).json({
                success:false,
                message:"All Fields are required, i.e section name can't be empty",
            });
        }
        // create a section entry in database
        const newSection = await Section.create({sectionName:sectionName});
        // update courseContent in cousre schema
        const updatedCourseWithSection = await Course.findByIdAndUpdate({_id:courseId},  {$push: { courseContent:newSection._id} }, {new:true}).populate( { path: "courseContent", populate: { path: "subSection" } }).exec();
        // return success resposne
        return respond.status(200).json({
            success:true,
            message:"Section created successfully",
            data:updatedCourseWithSection,
        })
    }
    catch(error) {
        return respond.status(404).json({
            success:false,
            data:"Internal server error",
            message:"Failed To create section",
        });
    }
}


























/********************************************************************************************************************************/
// udpateSection
/********************************************************************************************************************************/

exports.updateSection = async(request, respond) => {
    try{
        // fetch sectionId and sectionName
        const { sectionId, sectionName, courseId } = request.body;
        // check fields are empty or not
        if(!sectionId || !sectionName || !courseId) {
            return respond.status(302).json({
                success:false,
                message:"All Fields are required ie sectionId, sectionName, courseId"
            });
        }
        // update section name in db
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId} , {sectionName:sectionName} , {new:true}).populate("sectionName").exec();
        // updated course with section
        const updatedCourseWithSection = await Course.findById(courseId).populate({ path: "courseContent",  populate: { path: "subSection", }, }).exec();
        // return success flag
        return respond.status(200).json({
            success:true,
            message:"Section updated successfully",
            data:updatedCourseWithSection,
        });
    }
    catch(error) {
        return respond.status(404).json({
            success:false,
            data:"Internal server error",
            message:"Failed To Update section",
        });
    }
}

























/********************************************************************************************************************************/
// deleteSection
/********************************************************************************************************************************/


exports.deleteSection = async(request, respond) => {
    try{
        // fetch section id from params ---> assuming sending id from params
        const { sectionId, courseId } = request.body;
        // check input fields are empty or not
        if(!sectionId || !courseId) {
            return respond.status(302).json({
                success:false,
                message:"All Fields are required, ie. sectionId, courseId"
            });
        }
        // check for existing section or not
        const existingSection = await Section.findById(sectionId);
        if(!existingSection) {
            return respond.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        // update/delete Section reference from course db
        await Course.findByIdAndUpdate(courseId, { $pull: { courseContent: sectionId } });
        /// Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: existingSection.subSection } })
        // delete section form db using sectionId
        await Section.findByIdAndDelete( {_id:sectionId} );
        // find the updated course and return it
        const updatedCourseDeletedSection = await Course.findById(courseId).populate({ path: "courseContent",  populate: { path: "subSection", }, }).exec();
        // reuturn response
        return respond.status(200).json({
            success:true,
            message:"Section deleted successfully",
            data:updatedCourseDeletedSection,
        });
    }
    catch(error) {
        return respond.status(404).json({
            success:false,
            data:"Internal server error",
            message:"Failed To Delete section",
        });
    }
}









