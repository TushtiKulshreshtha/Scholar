import React, { useEffect} from "react";
import { useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png"

import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai"
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";

import { categories } from "../../services/apis"; 
import { ACCOUNT_TYPE } from "../../utils/constants";



// const subLinks = [
//     {
//         title: "python",
//         link: "/catalog/python"
//     },
//     {
//         title: "web dev",
//         link: "/catalog/web-development"
//     }
// ]





const Navbar = () => {

    // fetching values from slices
    const { token } = useSelector( (state) => state.auth);
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)

    // for fetching current url location
    const location = useLocation();


    // check at which page we are??  
    // 1st link from map function at which page we are 
    // 2nd page from url link using useLocation()
    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }


    // create a state varibale that stores all categories that created by admin {like web dev, python}
    const [ subLinks , setSubLinks ] = useState( [] );

    const fetchSublinks = async() => {
        try {
            const result = await apiConnector("GET" , categories.CATEGORIES_API);
            // set sublinks with fetched result
            console.log("Printing sub links result:" , result);
            setSubLinks(result.data.data);
        }
        catch(error) {
            console.log("Could not fetch the category list");
        }
    }

    // // call Api using use effects
    useEffect(() => {
        fetchSublinks();
    }, [])



    return (
        <div className="flex items-center justify-center h-14 border-b-[1px] border-b-richblack-700">

            {/* 11/12 width */}
            <div className="flex flex-row w-11/12 max-w-maxContent items-center justify-between ">


                {/* Logo for Study Scholar */}
                <Link to="/">
                    <img src={logo} width={190} height={42} loading="lazy"/>
                </Link>


                {/* Nav Links */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25 pr-11">
                        {
                            NavbarLinks.map((link, index) => (
                                <li key = { index }> 
                                {  
                                    link.title === "Catalog" ? 
                                    ( 
                                        <div className="flex relative items-center gap-2 group">
                                            <p> { link. title } </p>
                                            <IoIosArrowDropdownCircle />

                                            {/* drop down*/}
                                            <div className="invsible absolute left-[50%] translate-x-[-50%]  translate-y-[35%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] z-50 ">
                                                {/* Traingle Div*/}
                                                <div className="absolute left-[50%] top-0 translate-x-[80%]  translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5"></div>

                                                {/* Content Inside div*/}
                                                {
                                                    subLinks.length ? (
                                                            subLinks.map( (subLinks, index) => (
                                                                <Link to={ `/catalog/${subLinks.name.split(" ").join("-").toLowerCase()}` } key = { index } className="rounded-lg bg-transparent py-1 pl-2 hover:bg-richblack-50">
                                                                    <p> { subLinks.name } </p>
                                                                </Link>
                                                            ) )
                                                    ) : (<div></div>)
                                                }


                                            </div>
                                        </div> 
                                    ) 
                                    : 
                                    (
                                        <Link to = {link?.path}> 
                                            <p className = { `${ matchRoute(link?.path) ? "text-yellow-25": "text-richblack-25"}` }> 
                                                { link.title }  
                                            </p>  
                                        </Link> 
                                    )  
                                }  
                                </li>
                            ))
                        }
                    </ul>
                </nav>


                {/* Login/signUp/Dashboard */} 
                <div className="flex gap-x-4 items-center">
                    


                    {/* Below code will check that incoming user is  studnet if yes than show cart and total items*/}
                    {
                        user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                                {totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                        {totalItems}
                                    </span>
                                )
                                }
                            </Link>
                        )
                    }


                    {/* Below code will show login  buttons based on user is logined or not */}
                    {
                        token === null && (
                            <Link to="/login">
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                                    Log in
                                </button>
                            </Link>
                        )
                    }


                    {/* Below code will show singup  buttons based on user is logined or not */}
                    {
                        token === null && (
                            <Link to="/signup">
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }


                    {/* If the user is logined than show user logo, location ---> components -> core -> auth */}
                    {
                        token !== null && <ProfileDropDown /> 
                    }
                </div>
            </div>
            <button className="mr-4 md:hidden">
                <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            </button>
        </div>
    )
}


export default Navbar;