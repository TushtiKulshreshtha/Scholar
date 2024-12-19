// UTILITY COMPONENTS
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";



// REACT ICONS
import { RxCross2 } from "react-icons/rx";



// CUSTOM COMPONENTS
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";




// BACKEND API CALLS
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI"




// SLICE STORE
import { setCourse } from "../../../../../slices/courseSlice"








const SubSectionModal = ( {modalData, setModalData, add = false, edit = false, view = false,}) => {




    // Import React Form for default use
    const { register, handleSubmit, setValue, getValues, formState: { errors }, } = useForm();




    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);





    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    } ,[])




    // detect whether form is updated or not
    const isFormUpdated = () => {
        const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        if(currentValues.lectureTitle !== modalData.title || currentValues.lectureDesc !== modalData.description || currentValues.lectureVideo !== modalData.videoUrl ) {
            return true;
        }
        else{
            return false;
        }
    }




    // handle the editing of subsection
    const handleEditSubsection = async () => {
        
        const currentValues = getValues();
        // console.log("changes after editing form values:", currentValues);
        const formData = new FormData();
        // console.log("Values After Editing form values:", currentValues);
        
        
        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);
        

        if (currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle);
        }
        if (currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc);
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("videoFile", currentValues.lectureVideo);
        }
        
        setLoading(true);
        // API CALL ---> Update subSection
        const result = await updateSubSection(formData, token);
        if (result) {
            // console.log("result", result)
            // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section );
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            // course -ko --> course feed karnge thabi course Update hoga --> then ui Re-render hoga
            dispatch( setCourse(updatedCourse) );
        }
        setModalData(null);
        setLoading(false);
    }



    // From Submission Handler
    const onSubmit = async (data) => {
        // console.log(data)
        if(view) return ;
        if(edit) {
            if (!isFormUpdated()) {
                toast.error("No changes made to the form");
            } else {
                handleEditSubsection();
            }
            return ;
        }



        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("videoFile", data.lectureVideo);



        setLoading(true);
        // API CALL ----> create Subsection
        const result = await createSubSection(formData, token);
        if (result) {
            // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData ? result : section );
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            // course -ko --> course feed karnge thabi course Update hoga --> then ui Re-render hoga
            dispatch( setCourse(updatedCourse) );
        }
        setModalData(null);
        setLoading(false);
    }




    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">



            {/* Modal Header */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">
                    {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
                </p>
                <button onClick={() => (!loading ? setModalData(null) : {})}>
                    <RxCross2 className="text-2xl text-richblack-5" />
                </button>
            </div>





            {/* Modal Form */}
            <form onSubmit={ handleSubmit(onSubmit) } className="space-y-8 px-8 py-10" >
                {/* Lecture Video Upload */}
                <Upload name="lectureVideo" label="Lecture Video" register={register} setValue={setValue} errors={errors} video={true} viewData={view ? modalData.videoUrl : null} editData={edit ? modalData.videoUrl : null} />



                    {/* Lecture Title */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                            Lecture Title {!view && <sup className="text-pink-200">*</sup>}
                        </label>
                        <input disabled={view || loading} id="lectureTitle" placeholder="Enter Lecture Title" {...register("lectureTitle", { required: true })} className="form-style w-full" />
                        {
                            errors.lectureTitle && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">
                                Lecture title is required
                            </span>
                            )
                        }
                    </div>





                    { /* Lecture Description */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
                            Lecture Description{" "}
                            {!view && <sup className="text-pink-200">*</sup>}
                        </label>
                        <textarea disabled={view || loading} id="lectureDesc" placeholder="Enter Lecture Description" {...register("lectureDesc", { required: true })}className="form-style resize-x-none min-h-[130px] w-full" />
                        {
                            errors.lectureDesc && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    Lecture Description is required
                                </span>
                            )
                        }
                    </div>
                    {
                        !view && (
                            <div className="flex justify-end">
                                <IconBtn disabled={loading} text={loading ? "Loading.." : edit ? "Save Changes" : "Save"} />
                            </div>
                        )
                    }



                </form>
            </div>
        </div>
    )
}



export default SubSectionModal;