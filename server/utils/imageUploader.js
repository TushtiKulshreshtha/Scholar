const cloudinary = require("cloudinary").v2

const uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        if (height) { options.height = height };
        if (quality) { options.quality = quality };
        options.resource_type = "auto";  // Corrected typo here
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } 
    catch (error) {
        return respond.status(301).json({
            success: false,
            message: "Internal Server Error, Something went wrong while uploading image to cloudinary",
            error: error.message
        });
    }
}

module.exports = uploadImageToCloudinary;
