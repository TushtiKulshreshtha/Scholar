import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";

import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];


const ExploreMore = () => {


    {/* State Name variables & Functions */}
    const [currentTab, setCurrentTab] = useState(tabsName[0]);  // store the type of course
    const [courses, setCourses] = useState(HomePageExplore[0].courses);   // store value of course
    const [currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);  // stores heading


    {/* Functions */}
    function setMycards(value) {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }


    return (
        <div>


            {/* Heading and SubHeading*/}
            <div className="text-4xl font-semibold text-center my-10">
                {/****************Heading***************/}
                Unlock the 
                <HighlightText text={"Power of Code"} />
                {/****************SubHeading************/}
                <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
                    Learn to Build Anything You Can Imagine
                </p>   
            </div>


            {/* Slider */}
            <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
                {
                    tabsName.map((element, index) => {
                        return (
                            <div className={`text-[16px] items-center
                                ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200" } 
                                rounded-full transition-all duration-200 cursor-pointer
                                hover:bg-richblack-900 hover:text-richblack-5 px-7 py-3`}
                                key={ index } onClick={ () => setMycards(element) }>
                                { element }
                            </div>
                        )
                    })
                }
            </div>


            {/* Increase blue blackground size */}
            <div className="h-[200px]"></div>


            {/* Cards */}
            <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
                {
                    courses.map((element, index) => {
                    return (
                        <CourseCard
                            key = {index}
                            cardData = { element }
                            currentCard={ currentCard} 
                            setCurrentCard={ setCurrentCard }
                        />
                    )})
                }
            </div>


        </div>
    )
}

export default ExploreMore;