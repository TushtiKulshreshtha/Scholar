const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const uploadFileToCloudinary = require("../utils/imageUploader");











/********************************************************************************************************************************/
// createSubSection
/********************************************************************************************************************************/



exports.createSubSection = async(request, respond) => {
    try{
        // extract details ie. courseId, sectionname
        const {sectionId, title, description} = request.body;
        // fetch video path
        const video = request.files.videoFile;
        // check validy of course id
        if(!sectionId || !title  || !description || !video) {
            return respond.status(401).json({
                success:false,
                message:"All Fields are required",
            });
        }
        // upload file to cloudinary
        const uploadedVideoUrl = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);
        // save section in db
        const newSubSection = await SubSection.create({
            title,
            timeDuration:`${uploadedVideoUrl.duration}`,
            description,
            videoUrl: uploadedVideoUrl.secure_url,
        });
        // Update the corresponding section with the newly created sub-section
        const updatedSectionWithNewSubSection = await Section.findByIdAndUpdate({_id:sectionId}, {$push: {subSection:newSubSection._id}}, {new:true}).populate("subSection").exec();
        // return sucess flag
        return respond.status(200).json({
            success:true,
            message:"SubSection created successfully And Section Updated successfully",
            data:updatedSectionWithNewSubSection,
        });
    }
    catch(error) {
        return respond.status(404).json({
            success:false,
            data:"Internal server error",
            message:"Failed To create Subsection",
        });
    }
}





























/********************************************************************************************************************************/
// updateSubSection
/********************************************************************************************************************************/


exports.updateSubSection = async(request, respond) => {
    try{
        // extract details
        const {sectionId, subSectionId, title, description} = request.body;
        // extract file path
        const video = request.files.videoFile;
        if(!title || !sectionId || !description) {
            return respond.status(401).json({
                success:false,
                message:"All Fields are required",
            });
        }
        // check weather subSection exist in db or not
        const existingSubSection = await SubSection.findById(subSectionId);
        if (!existingSubSection) {
            return respond.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }
        // upload new file to cloudinary
        const uploadedVideoUrl = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);
        // update entry in db
        const updatedSubSection = await SubSection.findByIdAndUpdate({_id:subSectionId}, 
            {
                title:title,
                timeDuration:`${uploadedVideoUrl.duration}`,
                description:description,
                videoUrl:uploadedVideoUrl.secure_url,
            } , {new:true});
        // find updated section and return it
        const sectionWithUpdatedSubSection = await Section.findById({_id: sectionId}).populate("subSection").exec();
        // send success flag
        return respond.status(200).json({
            success:true,
            message:"SubSection Updated successfully",     
            data:sectionWithUpdatedSubSection,       
        });
    }
    catch(error) {
        return respond.status(404).json({
            success:false,
            data:"Internal server error",
            message:"Failed To Update Subsection",
            error:error.message,
        });
    }
}






























/********************************************************************************************************************************/
// deleteSubSection
/********************************************************************************************************************************/


exports.deleteSubSection = async(request, respond) => {
    try{
        // fetch subsection id
        const { subSectionId, sectionId } = request.body; 
        // check validity
        if( !subSectionId || !sectionId ) {
            return respond.status(401).json({
                success:false,
                message:"All Fields are required",
            });
        }
        // delete entry in db
        const existingSubSection = await SubSection.findById({_id:subSectionId});
        if(!existingSubSection) {
            return respond.status(404).json({
                success:"false",
                message: "SubSection not found"
            })
        }
        // TODO: update/delete SubSection reference from section db
        // TODO: do we need to delete the entry from the section schema --> self TODO
        await Section.findByIdAndUpdate({_id:sectionId}, { $pull: { subSection: subSectionId } });
        // delete subSection from db
        const deleteSubSection = await SubSection.findByIdAndDelete({_id: subSectionId}, {new:true});
        // Find updated subSection and return it
        const updatedSectionWithDeletedSubSection = await Section.findById({_id: sectionId} ).populate("subSection").exec();
        // send sucess flag
        return respond.status(200).json({
            success:true,
            message:"SubSection Deleted successfully",  
            data:updatedSectionWithDeletedSubSection,          
        })
    }
    catch(error) {
        return respond.status(404).json({
            success:false,
            data:"Internal server error",
            message:"Failed To Delete Subsection",
        });
    }
}