import React from "react";
import { useSelector } from "react-redux";


// inbuild function for creating different pages with common side bar
// showing different pages with common side bar ---> known as Outlet
import { Outlet } from "react-router-dom";

import Sidebar from "../components/core/Dashboard/Sidebar";



const Dashboard = () => {


    // check --> which api data we are fetching according to that we show loading icons
    const { loading: authloading } = useSelector( (state) => state.auth );
    const { loading: profileLoading } = useSelector( (state) => state.profile );




    // If any of the loading is true then show spinner
    if( profileLoading || authloading ) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner" ></div>
            </div>
        )
    }




    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">

            {/* Side bar to navigate to different resources */}
            <Sidebar />


            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                    <Outlet />
                </div>
            </div>


        </div>
    )
}


export default Dashboard;