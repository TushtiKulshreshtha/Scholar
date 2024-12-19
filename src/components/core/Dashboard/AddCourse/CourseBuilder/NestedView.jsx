// UTILITY COMPONENTS
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";



// REACT ICONS
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";



// CUSTOM COMPONENTS
import ConfirmationModal from "../../../../common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";



// BACKEND API CALLS
import { deleteSection, deleteSubSection, } from "../../../../../services/operations/courseDetailsAPI";



// SLICE STORE
import courseSlice, { setCourse } from "../../../../../slices/courseSlice";



const NestedView = ({ handleChangeEditSectionName }) =>  {



    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // States to keep track of mode of modal [add, view, edit]
    const [addSubSection, setAddSubsection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    // to keep track of confirmation modal
    const [confirmationModal, setConfirmationModal] = useState(null);





    const handleDeleteSection = async (sectionId) => {
        // API CALLS ---> deleteSection 
        const result = await deleteSection({ sectionId, courseId: course._id }, token);
        if (result) {
            dispatch( setCourse(result) );
        }
        setConfirmationModal(null);
    }



    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        console.log(subSectionId);
        console.log(sectionId);
        // API CALLS -----> deleteSubsection
        const result = await deleteSubSection({ subSectionId, sectionId }, token)
        if (result) {
            // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section )
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            dispatch( setCourse(updatedCourse) )
        }
        setConfirmationModal(null);
    }




    return (
        <>
            <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer">
                {
                    course?.courseContent?.map((section) => (


                        // Section Dropdown
                        <details key={section._id} open>


                            {/* Section Dropdown Content */}
                            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">



                                {/* Actual Section Name  */}
                                <div className="flex items-center gap-x-3"> 
                                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                                    <p className="font-semibold text-richblack-50">
                                        {section.sectionName}
                                    </p>
                                </div>



                                {/* Edit , delete Button Icon  */}
                                <div className="flex items-center gap-x-3">



                                    {/* Edit Button ICon  */}
                                    <button onClick={() => handleChangeEditSectionName( section._id, section.sectionName ) }>
                                        <MdEdit className="text-xl text-richblack-300" />
                                    </button>



                                    {/* Delete Button Icon  */}
                                    <button  onClick={() => 
                                        setConfirmationModal({ 
                                            text1: "Delete this Section?",  
                                            text2: "All the lectures in this section will be deleted", 
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setConfirmationModal(null),
                                        })}
                                    >
                                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                    </button>



                                    {/* Vertical Line  */}
                                    <span className="font-medium text-richblack-300">|</span>



                                    {/* Drop Down Icon  */}
                                    <AiFillCaretDown className={`text-xl text-richblack-300`} />
                                </div>
                            </summary>





                            {/* Render All Sub Sections Within a Section */}
                            <div className="px-6 pb-4">
                                {
                                    section.subSection.map( (data) => (


                                        <div key={data?._id} onClick={() => setViewSubSection(data)} className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">



                                            {/* Left Side Icons Before subsection name  */}
                                            <div className="flex items-center gap-x-3 py-2 ">
                                                <RxDropdownMenu className="text-2xl text-richblack-50" />
                                                <p className="font-semibold text-richblack-50">
                                                    {data.title}
                                                </p>
                                            </div>



                                            {/* Edit , delete Subsection Button Icon  */}
                                            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-3">


                                                {/* Edit SubSection Button  */}
                                                <button  onClick={() => setEditSubSection({ ...data, sectionId: section._id }) }>
                                                    <MdEdit className="text-xl text-richblack-300" />
                                                </button>



                                                {/* Delete subSection Button */}
                                                <button onClick={() => 
                                                    setConfirmationModal({
                                                        text1: "Delete this Sub-Section?",
                                                        text2: "This lecture will be deleted",
                                                        btn1Text: "Delete",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                        btn2Handler: () => setConfirmationModal(null),
                                                    })}
                                                >
                                                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }




                                {/* Add Lecture button to Section */}
                                <button onClick={() => setAddSubsection(section._id)}  className="mt-3 flex items-center gap-x-1 text-yellow-50">
                                    <FaPlus className="text-lg" />
                                    <p>Add Lecture</p>
                                </button>
                            </div>
                        </details>
                    ))
                }






                {/* Modal Display */}
                {
                    addSubSection ? ( 
                        <SubSectionModal 
                            modalData={addSubSection}
                            setModalData={setAddSubsection}
                            add={true}
                        />
                    ) : 
                    viewSubSection ? (
                        <SubSectionModal 
                            modalData={viewSubSection}
                            setModalData={setViewSubSection}
                            view={true}
                        />
                    ) : 
                    editSubSection ? (
                        <SubSectionModal
                        modalData={editSubSection}
                        setModalData={setEditSubSection}
                        edit={true}
                        />
                    ) : (
                        <></>
                    )
                }



                {/* Confirmation Modal */}
                {
                    confirmationModal ? (
                        <ConfirmationModal modalData={confirmationModal} />
                    ) : (
                        <></>
                    )
                }



            </div>
        </>
    )
}




export default NestedView;