import React from "react";
import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"


// ===> this component contains the information of single row-wise icon 
// ===> that is marked using yellow color



const SidebarLink = ( { link, iconName } ) => {

    const Icon = Icons[iconName];

    //const location = ?? ---> why location is needed
    const location = useLocation();

    const dispatch = useDispatch();

    // used to fetch at which location we are --> if path matches show side icon as yellow
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }
    





    return (
        <NavLink to = { link.path }  className={ `relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-300" } transition-all duration-200`} >

            <span className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${ matchRoute(link.path) ? "opacity-100" : "opacity-0" }`} ></span>
            {/* Name and Icon */}
            <div className="flex gap-2">
                <Icon className="text-lg" />
                <span> {link.name} </span>
            </div>
        
        </NavLink >
    )
}





export default SidebarLink;