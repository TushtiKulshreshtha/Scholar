import React from "react";
import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";

import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";



const Sidebar = () => {


    // Extract two different loadings ie user loading and profile loading
    const { user , loading: profileLoading } = useSelector( (state) => state.profile );
    const { loading: authloading } = useSelector( (state) => state.auth );
    const dispatch = useDispatch()
    const navigate = useNavigate()


    // to keep track of confirmation modal
    const [confirmationModal, setConfirmationModal] = useState(null)



    // If any of the loading is true then show spinner
    if( profileLoading || authloading ) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner" ></div>
            </div>
        )
    }




    return (
        <div >
            <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10"> 
            
                {/* Icon and Links with Yellow bg on Click */}
                <div className = "flex flex-col" >  
                    {
                        
                        sidebarLinks.map( ( link ) => {
                            
                            if( link.type && user?.accountType !== link.type) return null;
                            return (
                                <SidebarLink key= {link.id} link= { link } iconName= { link.icon } />
                            )
                        })
                    }
                </div>


                {/* Line in Side bar Link */}
                <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />


                {/* Setting Button and logout button --> This contains only two rows ie Setting, logout*/}
                <div className="flex flex-col"> 


                    {/* Setting button */}
                    <SidebarLink link={ {name: "Settings", path: "/dashboard/settings" } } iconName="VscSettingsGear" />


                    {/* sign out */}
                    <button
                        onClick={ () => {
                            setConfirmationModal({
                                text1:"Are You Sure ?",
                                text2:"You will be logged our of your Account",
                                btn1Text: "Logout",
                                btn2Text: "Cancel",
                                // Logout button
                                btn1Handler: () => dispatch( logout(navigate) ),
                                // Cancel button
                                btn2Handler: () => setConfirmationModal(null),
                            })
                        }}
                        className="px-8 py-2 text-sm font-medium text-richblack-300"
                    >
                        <div className="flex items-center gap-x-2">
                            <VscSignOut className="text-lg" />
                            <span>Logout</span>
                        </div>
                    </button>
                </div>


            </div>
            {/* Confirmation Modal Visible and invisible logic  */}
            {/* if confirmation modal value is not null then only render confirmation Modal  */}
            {/* The value of confrimation modal changes according to cancel buton  */}


            {
                confirmationModal && <ConfirmationModal modalData={ confirmationModal } /> 
            }


        </div>
    )
}



export default Sidebar;