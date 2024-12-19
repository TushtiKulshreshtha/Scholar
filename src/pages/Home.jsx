import React from "react";

import {FaArrowRight} from "react-icons/fa"
import { Link } from "react-router-dom";

import Banner from "../assets/Images/banner.mp4";

import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/CTAButton";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ReviewSlider from "../components/common/ReviewSlider";           // ------> Pending Task
import Footer from "../components/common/Footer";                       // ------> Pending Task



const Home = () => {
    return (
        <div>


            {/* Section - 1 */}
            <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between gap-8">
                
                
                {/***************Become a Instuctor Button Button*************/}
                <Link to = {"/signup"}>
                    <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-700 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit drop-shadow-[0_2px_rgba(255,255,255,0.25)] hover:drop-shadow-none">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all group-hover:bg-richblack-900">
                            <p>Become a Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>


                {/***************Main Heading*************/}
                <div className="text-4xl font-bold">
                    Empower Your Future with <HighlightText text={"Coding Skills"} />
                </div>


                {/*****************Sub Heading*************/}
                <div className="w-[70%] text-center font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.
                </div>


                {/******************Two Buttons***************/}
                <div className="flex flex-row gap-4">
                    <CTAButton active={true} linkto={"/signup"}> Learn More </CTAButton>
                    <CTAButton active={false} linkto={"/login"}> Book a Demo </CTAButton>
                </div>


                {/***************Background Image*********/}
                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video className="shadow-[10px_10px_rgba(255,255,255)] w-106 h-84 aspect-w-16 aspect-h-9" muted loop autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>


                {/******************Code section 1************/}
                <CodeBlocks 
                    position={ "lg:flex-row" }
                    heading={ 
                        <div className="text-4xl font-bold">
                            Unlock your
                            <HighlightText text={"coding potential"}/>
                            with our online courses.
                        </div>
                    }
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabtn1 = { {
                        btnText: "Try it Yourself",
                        active:true,
                        linkto:"/signup"
                    } }
                    ctabtn2 = { {
                        btnText: "Learn More",
                        active:false,
                        linkto:"/login"
                    } }
                    codeColor={"text-yellow-25"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    backgroundGradient = {<div className="codeblock1 absolute"></div>}
                />


                {/******************Code section 2************/}
                <CodeBlocks 
                    position={ "lg:flex-row-reverse" }
                    heading={ 
                        <div className="text-4xl font-bold">
                            Start
                            <HighlightText text={"coding in seconds"}/>
                        </div>
                    }
                    subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                    ctabtn1 = { {
                        btnText: "Continue lession",
                        active:true,
                        linkto:"/signup"
                    } }
                    ctabtn2 = { {
                        btnText: "Learn More",
                        active:false,
                        linkto:"/login"
                    } }
                    codeColor={"text-white"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    backgroundGradient = {<div className="codeblock2 absolute"></div>}
                />


                {/* Explore More Content -----> Later added */}
                <ExploreMore />
                
            </div>


            {/* Section - 2 */}
            <div className="bg-pure-greys-5 text-richblack-700 ">


                {/* Backgroung Image */}
                <div className="homepage_bg h-[400px]">


                    {/* 11/12 default div */}
                    <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">

                        <div className="lg:h-[200px]"></div>
                        
                        
                        {/* Two Buttons In Rows */}
                        <div className="flex flex-row gap-7 text-white lg:mt-8">
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex flex-row gap-3 items-center">
                                    Explore Full Catalog
                                    <FaArrowRight className="mt-1"/>
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"}>Learn More</CTAButton>
                        </div>
                    </div>
                </div>

                {/* 11/12 default div -----> Correct Place*/}
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">

                    {/* Calenders Div -----> Your swisss knife */}
                    <LearningLanguageSection />
                </div>
            </div>



            {/* Section - 3 */}
            <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white ">

                {/* Become a instructor section */}
                {/* <InstructorSection /> */}


                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl mt-8">
                    Reviews from other learners
                </h1>
                <ReviewSlider />

            </div>

            
            {/* Fotter */}
            <Footer /> 
            
        </div>
    )
}

export default Home;