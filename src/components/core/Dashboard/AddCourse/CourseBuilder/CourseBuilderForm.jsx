// UTILITY COMPONENTS
import React from "react";
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"



// REACT ICONS
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"



// CUSTOM COMPONETNS
import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView"



// BACKEND API CALLS
import { createSection } from "../../../../../services/operations/courseDetailsAPI";
import { updateSection } from "../../../../../services/operations/courseDetailsAPI";



// SLICE STORE
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice"





const CourseBuilderForm = () => {



    // Import React Form for default use
    const { register, handleSubmit, setValue, getValues, formState: { errors }, } = useForm();



    // SLICE STORE VALUES
    const { course } = useSelector( (state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    // keep track of create and edit section name
    const [editSectionName, setEditSectionName] = useState(null);
    const dispatch = useDispatch();



    // handle form submission
    const onSubmitForm = async (data) => {


        // console.log(data);
        setLoading(true);


        let result;
        // Handel Edit Section Case ---> OtherWise Handle createSection Name
        if(editSectionName) {
            // API CALL ---> For Update section
            result = await updateSection( {sectionName: data.sectionName, sectionId: editSectionName, courseId: course._id } , token);
            console.log("Update Section Result", result);
        }
        else{
            // API CALL ---> For Create section
            result = await createSection( {sectionName: data.sectionName, courseId: course._id}, token);
            console.log("Create Section Reault", result);
        }



        // CHECK API CALL VALUE IS NOT NULL 
        if (result) {
            //console.log("section result", result)
            dispatch( setCourse(result) );
            // course edit is completed than set to inital values
            setEditSectionName( null );
            setValue("sectionName", "");
        }



        setLoading(false);
    }




    // CANCEL EDIT BUTTONS
    const cancelEdit = () => {
        setEditSectionName(null);
        // set sectionName == NULL for form
        setValue("sectionName", "");
    }




    // HANDEL CHANGE EDIT SECTION NAME
    const handleChangeEditSectionName = (sectionId, sectionName) => {
        // Toggle between createsection and edit section
        if (editSectionName === sectionId) {
            cancelEdit();
            return ;
        }
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }




    // GO TO PREVIOUS PAGE HANDLER
    const goBack = () => {
        dispatch( setStep(1) );
        dispatch( setEditCourse(true) );
    }




    // GO TO NEXT PAGE HANDLER
    const goToNext = () => {
        // only allow to move on next page when course contains atleast one section
        if (course.courseContent.length === 0) {
            toast.error("Please add atleast one section");
            return ;
        }
        // check for subSection
        if ( course.courseContent.some((section) => section.subSection.length === 0) ) {
            toast.error("Please add atleast one lecture in each section");
            return ;
        }
        // forward to next step
        dispatch(setStep(3));
    }




    return (
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            
            {/* Heading  */}
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>



            {/* Input Form */}
            <form onSubmit={ handleSubmit(onSubmitForm) } className="space-y-4">



                {/* Section Name div and Label  */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" htmlFor="sectionName"> 
                        Section Name 
                        <sup className="text-pink-200">*</sup> 
                    </label>
                    <input id="sectionName" disabled={loading} placeholder="Add a section to build your course" {...register("sectionName", { required: true })} className="form-style w-full" />
                    {/* Handel Empty input Case  ----> Below text will generate error if input field is empty*/}
                    {
                        errors.sectionName && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">
                                Section name is required
                            </span>
                        )
                    }
                </div>




                {/* Create Section Button  */}
                <div className="flex items-end gap-x-4">
                    {/* when this button is clicked than form will call onSubmitForm function  */}
                    <IconBtn type="submit" disabled={loading} text={ editSectionName ? "Edit Section Name" : "Create Section" } outline={true} >
                        <IoAddCircleOutline size={20} className="text-yellow-50" />
                    </IconBtn>
                </div>
                {/* Also show cancel edit button when ---> editSectionName is true  */}
                {
                    editSectionName && (
                        <button type="button" onClick={cancelEdit} className="text-sm text-richblack-300 underline" >
                            Cancel Edit
                        </button>
                    )
                }
            </form>




            {/* Drop Down Nested View  */}
            {/* Only Render Nested View When course contains Sections  */}
            {
                console.log("course is--->" , course)
            }
            {
                course.courseContent.length > 0 && (  
                    <NestedView handleChangeEditSectionName={handleChangeEditSectionName} /> 
                )
            }




            {/* Next Prev Button */}
            <div className="flex flex-row justify-end gap-x-3">
                <button onClick={ goBack } className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                    Back
                </button>
                <IconBtn disabled={loading} text="Next" onclick={ goToNext }>
                    <MdNavigateNext size={21} className="ml-[-5px] mb-[1px]"/>
                </IconBtn>
            </div>



        </div>  
    )
}





export default CourseBuilderForm;