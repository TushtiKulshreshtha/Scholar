const { response } = require("express");
const Category = require("../models/Category");










/********************************************************************************************************************************/
// createCategory
/********************************************************************************************************************************/


exports.createCategory = async(request, respond) => {
    try{
        // extract name , and description from course
        const { name, description } = request.body;
        // validation
        if(!name || !description) {
            return respond.status(200).json({
                sucess:false,
                message:"All Fields are required",
            });
        }
        // create entry in database
        const categoryDetails = await Category.create({name:name, description:description});
        // return sucess flag
        respond.status(200).json({
            sucess:true,
            message:"Category Created successfully",
            data:categoryDetails,
        });
    }
    catch(error){
        return respond.status(400).json({
            sucess:false,
            message:"Something went Wrong Internal Server error",
            error:error.message,
        });
    }
}




















/********************************************************************************************************************************/
// getAllCategories
/********************************************************************************************************************************/


exports.getAllCategories = async(request, respond) => {
    try{
        const searchedCategory = await Category.find({}, {name:true, description:true});
        return respond.status(200).json({
            success:true,
            message:"All Categories returned successfully",
            data:searchedCategory,
        })
    }
    catch(error) {
        return respond.status(400).json({
            success:false,
            message:error.message,
        })
    }
};






















/********************************************************************************************************************************/
// categoryPageDetails ----------------xxxx
/********************************************************************************************************************************/


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}



exports.getCategoryPageDetails = async(request, respond) => {
    try{
        // get category Id
        const { categoryId } = request.body;
        console.log("categoryId is=---------------->", categoryId);
        // check for input field is empty or not
        if(!categoryId) {
            return response.status(404).json({
                success:false,
                message:"All Input fields are Required, ie. categoryId"
            });
        }
        // get courses for specified catId
        const selectedCategory = await Category.findById({ _id: categoryId })
            .populate({
                path:"courses",
                match: { status: "Published" },
                //populate: "ratingAndReviews",
            }).exec();
        
        // validation
        if(!selectedCategory) {
            return respond.status(404).json({
                sucess:false,
                message:"Selected Category Not Found",
            })
        }
        console.log( selectedCategory.courses.length );
        if(selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.");
            return respond.status(404).json({
                success:false,
                message:"No courses found for the selected category",
            })
        }
        const selectedCourses = selectedCategory.courses;

        //console.log( selectedCourses );

        // get courses for different cat
        const categoriesExceptSelected = await Category.find({ _id: {$ne: categoryId}, }).populate("courses").exec();
        
        //console.log( categoriesExceptSelected );
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec();
        
        
        // Get Top selling courses
        const allCategoires = await Category.find()
            .populate({ 
                path: "courses", 
                match: { status: "Published" }, 
                populate: {
                    path: "instructor"
                }
            })
        //console.log( allCategoires);
        const allCourses = allCategoires.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses.sort((a,b) => b.sold - a.sold).slice(0, 10);

        
        // return response
        return respond.status(200).json({
            success:true,
            data: {
                selectedCategory: selectedCategory,
                differentCategory: differentCategory,
                mostSellingCourses: mostSellingCourses,
            },
        });
    }
    catch(error) {
        return respond.status(400).json({
            sucess:false,
            message:"Internal Server Error",
            error:error.message,
            messageError:error
        })
    }
};
