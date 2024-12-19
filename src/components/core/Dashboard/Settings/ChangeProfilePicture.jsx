// UTILITY MODULES
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";



// CUSTOM COMPONENTS
import IconBtn from "../../../common/IconBtn";



// BACKEND API CONTROLLERS ---> SETTINGSAPI
import { updateDisplayPicture } from "../../../../services/operations/settingAPI";



const ChangeProfilePicture = () => {


    const { token } = useSelector( ( state ) => state.auth );
    const { user } = useSelector( ( state ) => state.profile );
    const dispatch = useDispatch();


    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    // preview image ----> contains the file that we inputed from frontend
    // state var to manage the frontend input form user
    const [previewSource, setPreviewSource] = useState(null);


    const fileInputRef = useRef(null);


    // Method to store the image as preview ----> abstract view ---> understanding is not requried
    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }



    // Re-render frontend everytime whenever image file Changes
    useEffect(() => {
        if (imageFile) {
            previewFile(imageFile)
        }
    }, [imageFile])



    // extract files from event ---> then Re-render frontend --> this will trigger use effect -> 
    // continue -> ultimite trigger previewFile -> then show recently uploaded file at img block
    function handleFileChange(event) {
        const file = event.target.files[0];
        console.log("Uploaded file is", file);
        if(file) {
            setImageFile(file);
            setPreviewSource(file);
        }
    }



    // select button ----> to choose image that is clicked
    function handleClick() {
        fileInputRef.current.click();
    }



    // File Upload Function ----> from frontend to backend
    function handleFileUpload() {
        try {
            console.log("uploading...");
            setLoading(true);
            const formData = new FormData();
            // append image as formData and send to ---> backend
            formData.append("displayPicture", imageFile);
            // console.log("formdata", formData)
            dispatch( updateDisplayPicture(token, formData)).then(() => { setLoading(false) })
        }
        catch( error ){
            console.log("ERROR MESSAGE - ", error.message);
        }
    }




    return (
        <div>
            <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12" >


                {/* Image and Change profile picture div */}
                <div className="flex flex-row items-cenetr gap-x-5"> 

                    {/* Profile Image */}
                    <img src={ previewSource || user?.image } alt={`profile-${ user?.firstName }`} className="aspect-square w-[78px] rounded-full object-cover" />


                    {/* Change Profile Picture Text and Buttons */}
                    <div className="space-y-2">


                        {/* Input profile pictures */}
                        <p className="text-white "> Change Profile Picture </p>



                        <div className="flex flex-row gap-3">



                            {/* Upload Files */}
                            <input type="file" ref={ fileInputRef } onChange={ handleFileChange } className="hidden" accept="image/png, image/gif, image/jpeg" />



                            {/* Select Button */}
                            <button onClick={ handleClick } disabled={ loading } className="cursor-pointer rounded-md bg-richblack-700 py-1.9 px-5 font-medium text-richblack-50" >
                                Select
                            </button>



                            {/* Yellow Button */}
                            <IconBtn text={loading ? "Uploading..." : "Upload"} onclick={ handleFileUpload } >
                                { !loading }
                            </IconBtn>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}


export default ChangeProfilePicture;